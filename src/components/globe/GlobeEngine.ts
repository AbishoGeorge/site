import { geoEquirectangular, geoGraticule10, geoOrthographic, geoPath } from 'd3-geo';
import type { GeoPath, GeoPermissibleObjects, GeoProjection } from 'd3-geo';
import { feature, mesh } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';
import type { Feature, Geometry, MultiLineString } from 'geojson';
import { signalKindTag, type AccountSignal } from './signals';

export type GlobePhase = 'intro' | 'scan' | 'lock' | 'reveal' | 'ready' | 'close';

export interface GlobeEngineOptions {
  canvas: HTMLCanvasElement;
  signals: AccountSignal[];
  onPhase: (phase: GlobePhase, index: number) => void;
  /** Number of evidence arcs that have reached the pin for the current account. */
  onEvidence: (landed: number) => void;
  /** Card element the connector line runs to while an account is open. */
  getCard: () => HTMLElement | null;
  /** City label that follows the pin; positioned by the engine every frame. */
  chip: HTMLElement | null;
  /** Live coordinate readout. */
  coords: HTMLElement | null;
  reducedMotion: boolean;
}

// Seconds spent in each phase of an account reveal.
const INTRO_TIME = 1.2;
const LOCK_TIME = 0.55;
const REVEAL_TIME = 2.3;
const READY_TIME = 4.4;
const CLOSE_TIME = 0.5;
const ARC_STAGGER = 0.35;
const ARC_DURATION = 0.95;
const DOT_STEPS = [1.0, 0.6];

const DEG = Math.PI / 180;
const TAU = Math.PI * 2;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const smoothstep = (t: number) => {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
};

function toVec(lat: number, lng: number): [number, number, number] {
  const p = lat * DEG;
  const l = lng * DEG;
  return [Math.cos(p) * Math.cos(l), Math.cos(p) * Math.sin(l), Math.sin(p)];
}

function angularDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const a = toVec(lat1, lng1);
  const b = toVec(lat2, lng2);
  return Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]))) / DEG;
}

/** Point reached by travelling `dist` degrees from (lat, lng) on `bearing`. */
function destination(lat: number, lng: number, bearing: number, dist: number): [number, number] {
  const p1 = lat * DEG;
  const l1 = lng * DEG;
  const b = bearing * DEG;
  const d = dist * DEG;
  const p2 = Math.asin(Math.sin(p1) * Math.cos(d) + Math.cos(p1) * Math.sin(d) * Math.cos(b));
  const l2 = l1 + Math.atan2(Math.sin(b) * Math.sin(d) * Math.cos(p1), Math.cos(d) - Math.sin(p1) * Math.sin(p2));
  return [p2 / DEG, l2 / DEG];
}

interface Arc {
  from: [number, number, number];
  /** Which side of the chord the arc bows toward. */
  bend: number;
  start: number;
  tag: string;
}

interface Blip {
  idx: number;
  born: number;
}

interface Star {
  x: number;
  y: number;
  r: number;
  phase: number;
}

export class GlobeEngine {
  private opts: GlobeEngineOptions;
  private ctx: CanvasRenderingContext2D;
  private W = 0;
  private H = 0;
  private dpr = 1;
  private wide = false;
  private baseX = 0;
  private baseY = 0;
  private focusX = 0;
  private focusY = 0;
  private R0 = 1;

  // View state: the lat/lng at the centre of the globe, zoom and screen position.
  private cLng = -30;
  private cLat = 22;
  private scale = 1;
  private R = 1;
  private tx = 0;
  private ty = 0;

  private phase: GlobePhase = 'intro';
  private phaseT = 0;
  private time = 0;
  private index = -1;
  private fly = { lng0: 0, lat0: 0, lng1: 0, lat1: 0, s0: 1, s1: 1, dip: 0, dur: 1 };

  // Land dots.
  private ready = false;
  private n = 0;
  private dx = new Float32Array(0);
  private dy = new Float32Array(0);
  private dz = new Float32Array(0);
  private dCountry = new Int16Array(0);
  private dLevel = new Uint8Array(0);
  private buckets: Float32Array[] = [];
  private bucketCount = new Int32Array(10);
  private hlXY = new Float32Array(0);
  private hlCount = 0;

  private countries: Feature<Geometry, { name: string }>[] = [];
  private borders: MultiLineString | null = null;
  private graticule = geoGraticule10();
  private projection: GeoProjection = geoOrthographic().clipAngle(90).precision(0.6);
  private path: GeoPath<unknown, GeoPermissibleObjects>;
  private countryIndexByName = new Map<string, number>();

  private hlCountry = -1;
  private hl = 0;
  private pinAlpha = 0;
  private target: [number, number, number] = [1, 0, 0];
  private visited: number[] = [];
  private arcs: Arc[] = [];
  private blips: Blip[] = [];
  private nextBlip = 0;
  private stars: Star[] = [];
  private lockAt = 0;
  private lastHud = 0;

  private raf = 0;
  private last = 0;
  private running = false;
  private disposed = false;
  private resizeObserver: ResizeObserver;
  private wideQuery: MediaQueryList;
  private dprQuery: MediaQueryList | null = null;
  private landed = 0;

  constructor(opts: GlobeEngineOptions) {
    this.opts = opts;
    this.ctx = opts.canvas.getContext('2d')!;
    this.path = geoPath(this.projection, this.ctx);
    this.wideQuery = window.matchMedia('(min-width: 1280px)');
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(opts.canvas.parentElement ?? opts.canvas);
    this.watchDpr();
    this.resize();
    this.load().catch(() => {
      // One retry for a flaky network or a chunk that changed mid-deploy; the starfield stays up meanwhile.
      window.setTimeout(() => {
        if (!this.disposed) this.load().catch(() => undefined);
      }, 2000);
    });
  }

  /** Re-render at the new density when the window moves to a screen with a different pixel ratio. */
  private watchDpr = () => {
    this.dprQuery?.removeEventListener('change', this.watchDpr);
    if (this.disposed) return;
    this.dprQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
    this.dprQuery.addEventListener('change', this.watchDpr);
    if (this.W) this.resize();
  };

  private async load() {
    const world = (await import('world-atlas/countries-110m.json')).default as unknown as Topology<{
      countries: GeometryCollection<{ name: string }>;
    }>;
    if (this.disposed) return;
    const all = feature(world, world.objects.countries).features as Feature<Geometry, { name: string }>[];
    this.countries = all.filter((f) => f.properties.name !== 'Antarctica');
    this.countries.forEach((f, i) => this.countryIndexByName.set(f.properties.name, i));
    this.borders = mesh(world, world.objects.countries, (a, b) => a !== b);
    this.buildDots();
    this.ready = true;
    this.setPhase('intro');
  }

  /** Rasterise country shapes to an equirectangular bitmap and sample it into an even dot grid. */
  private buildDots() {
    const w = 1440;
    const h = 720;
    const off = document.createElement('canvas');
    off.width = w;
    off.height = h;
    const octx = off.getContext('2d', { willReadFrequently: true })!;
    const eq = geoEquirectangular().translate([w / 2, h / 2]).scale(w / TAU);
    const opath = geoPath(eq, octx);
    this.countries.forEach((f, i) => {
      // Country id lives in the green/blue channels; red stays 255 so land is easy to test.
      const id = i + 1;
      octx.fillStyle = `rgb(255,${id & 255},${(id >> 8) * 64})`;
      octx.beginPath();
      opath(f);
      octx.fill();
    });
    const pixels = octx.getImageData(0, 0, w, h).data;

    const xs: number[] = [];
    const ys: number[] = [];
    const zs: number[] = [];
    const cs: number[] = [];
    const ls: number[] = [];
    // A coarse grid for the whole-globe view and a fine one that fades in as the camera zooms.
    DOT_STEPS.forEach((step, level) => {
      let row = 0;
      for (let lat = -56; lat <= 80; lat += step, row++) {
        const count = Math.max(1, Math.floor((360 * Math.cos(lat * DEG)) / step));
        for (let j = 0; j < count; j++) {
          const lng = -180 + ((j + (row % 2) * 0.5) * 360) / count;
          const px = Math.min(w - 1, Math.floor(((lng + 180) / 360) * w));
          const py = Math.min(h - 1, Math.floor(((90 - lat) / 180) * h));
          const o = (py * w + px) * 4;
          if (pixels[o + 3] < 128 || pixels[o] < 200) continue;
          const v = toVec(lat, lng);
          xs.push(v[0]);
          ys.push(v[1]);
          zs.push(v[2]);
          ls.push(level);
          const id = pixels[o + 1] + Math.round(pixels[o + 2] / 64) * 256 - 1;
          cs.push(pixels[o + 3] === 255 && id >= 0 && id < this.countries.length ? id : -1);
        }
      }
    });
    this.n = xs.length;
    this.dx = Float32Array.from(xs);
    this.dy = Float32Array.from(ys);
    this.dz = Float32Array.from(zs);
    this.dCountry = Int16Array.from(cs);
    this.dLevel = Uint8Array.from(ls);
    this.buckets = Array.from({ length: 10 }, () => new Float32Array(this.n * 2));
    this.hlXY = new Float32Array(this.n * 4);
  }

  private resize() {
    const parent = this.opts.canvas.parentElement ?? this.opts.canvas;
    const W = parent.clientWidth;
    const H = parent.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const wide = this.wideQuery.matches;
    if (!W || !H) return;
    if (W === this.W && H === this.H && dpr === this.dpr && wide === this.wide) return;
    this.W = W;
    this.H = H;
    this.dpr = dpr;
    const c = this.opts.canvas;
    c.width = Math.round(W * this.dpr);
    c.height = Math.round(H * this.dpr);
    c.style.width = `${W}px`;
    c.style.height = `${H}px`;
    this.wide = wide;

    if (this.wide) {
      this.baseX = W * 0.71;
      this.baseY = H * 0.5;
      this.R0 = Math.min(H * 0.4, W * 0.25);
      const cardLeft = W * 0.965 - 360;
      this.focusX = Math.max(W * 0.5, Math.min(W * 0.62, cardLeft - W * 0.12));
      this.focusY = H * 0.4;
    } else {
      this.baseX = W / 2;
      this.baseY = H * 0.4;
      this.R0 = Math.min(W * 0.43, H * 0.36);
      this.focusX = W / 2;
      this.focusY = H * 0.25;
    }

    this.stars = Array.from({ length: Math.round((W * H) / 9000) }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() < 0.85 ? 0.6 : 1.1,
      phase: Math.random() * TAU,
    }));
    // Resizing the backing store clears it, so repaint now rather than leave a blank frame.
    this.draw();
  }

  start() {
    if (this.running || this.disposed) return;
    this.running = true;
    this.last = performance.now();
    const loop = (now: number) => {
      if (!this.running) return;
      const dt = Math.min(0.05, (now - this.last) / 1000);
      this.last = now;
      this.update(dt);
      this.draw();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  destroy() {
    this.disposed = true;
    this.stop();
    this.resizeObserver.disconnect();
    this.dprQuery?.removeEventListener('change', this.watchDpr);
  }

  private setPhase(phase: GlobePhase) {
    this.phase = phase;
    this.phaseT = 0;
    this.opts.onPhase(phase, this.index);
  }

  private startFly() {
    const signals = this.opts.signals;
    this.index = (this.index + 1) % signals.length;
    const s = signals[this.index];
    let dLng = (s.lng - this.cLng) % 360;
    if (dLng > 180) dLng -= 360;
    if (dLng < -180) dLng += 360;
    const dist = angularDistance(this.cLat, this.cLng, s.lat, s.lng);
    const mid = (this.scale + s.zoom) / 2;
    this.fly = {
      lng0: this.cLng,
      lat0: this.cLat,
      lng1: this.cLng + dLng,
      lat1: s.lat,
      s0: this.scale,
      s1: s.zoom,
      dip: this.opts.reducedMotion ? 0 : Math.max(0, mid - 0.95),
      dur: this.opts.reducedMotion ? 1.4 : 2.6 + 1.0 * clamp01(dist / 140),
    };
    this.target = toVec(s.lat, s.lng);
    this.arcs = [];
    this.setPhase('scan');
  }

  private spawnArcs() {
    const s = this.opts.signals[this.index];
    const base = Math.random() * 360;
    this.arcs = s.evidence.map((ev, i) => {
      const dist = 7 + Math.random() * 6;
      const [lat, lng] = destination(s.lat, s.lng, base + i * 120 + (Math.random() - 0.5) * 40, dist);
      return {
        from: toVec(lat, lng),
        bend: Math.random() < 0.5 ? -1 : 1,
        start: this.time + i * ARC_STAGGER,
        tag: signalKindTag[ev.kind],
      };
    });
  }

  private update(dt: number) {
    if (!this.ready) return;
    this.time += dt;
    this.phaseT += dt;
    const drift = this.opts.reducedMotion ? 0.15 : 0.5;

    switch (this.phase) {
      case 'intro':
        this.cLng += (this.opts.reducedMotion ? 2 : 9) * dt;
        if (this.phaseT > INTRO_TIME) this.startFly();
        break;
      case 'scan': {
        const f = this.fly;
        const t = clamp01(this.phaseT / f.dur);
        const e = easeInOutCubic(t);
        this.cLng = lerp(f.lng0, f.lng1, e);
        this.cLat = lerp(f.lat0, f.lat1, e);
        const dipped = lerp(f.s0, f.s1, e) - f.dip * Math.pow(Math.sin(Math.PI * t), 0.6);
        // The dip curve and the eased zoom peak at different times, so floor it at the whole-globe view.
        this.scale = f.dip > 0 ? Math.max(Math.min(0.95, f.s0, f.s1), dipped) : dipped;
        if (t >= 1) {
          this.hlCountry = this.countryIndexByName.get(this.opts.signals[this.index].country) ?? -1;
          this.lockAt = this.time;
          this.setPhase('lock');
        }
        break;
      }
      case 'lock':
        this.cLng += drift * dt;
        if (this.phaseT > LOCK_TIME) {
          this.spawnArcs();
          this.setPhase('reveal');
        }
        break;
      case 'reveal':
        this.cLng += drift * dt;
        this.scale *= 1 + 0.01 * dt;
        if (this.phaseT > REVEAL_TIME) {
          if (!this.visited.includes(this.index)) this.visited.push(this.index);
          this.setPhase('ready');
        }
        break;
      case 'ready':
        this.cLng += drift * dt;
        this.scale *= 1 + 0.01 * dt;
        if (this.phaseT > READY_TIME) this.setPhase('close');
        break;
      case 'close':
        this.cLng += drift * dt;
        if (this.phaseT > CLOSE_TIME) this.startFly();
        break;
    }

    const showing = this.phase === 'lock' || this.phase === 'reveal' || this.phase === 'ready';
    this.hl = clamp01(this.hl + (showing ? dt / 0.6 : -dt / 0.45));
    this.pinAlpha = clamp01(this.pinAlpha + (showing ? dt / 0.3 : -dt / 0.35));
    if (this.hl === 0 && !showing) this.hlCountry = -1;

    // The card's evidence rows fill in as arcs land, on the engine's clock so they pause with it.
    let landed = 0;
    for (const arc of this.arcs) if (this.time - arc.start >= ARC_DURATION) landed++;
    if (landed !== this.landed) {
      this.landed = landed;
      this.opts.onEvidence(landed);
    }

    // Ambient activity: brief blips on random land dots.
    if (!this.opts.reducedMotion && this.time > this.nextBlip && this.n) {
      this.nextBlip = this.time + 0.12 + Math.random() * 0.14;
      this.blips.push({ idx: Math.floor(Math.random() * this.n), born: this.time });
      if (this.blips.length > 24) this.blips.shift();
    }
  }

  /** Project a unit-sphere (or lifted) point to screen space for the current view. */
  private project(x: number, y: number, z: number, out: Float32Array | number[]) {
    const lr = -this.cLng * DEG;
    const pr = -this.cLat * DEG;
    const cl = Math.cos(lr);
    const sl = Math.sin(lr);
    const cp = Math.cos(pr);
    const sp = Math.sin(pr);
    const x1 = x * cl - y * sl;
    const y1 = x * sl + y * cl;
    const depth = x1 * cp - z * sp;
    const u = y1;
    const v = z * cp + x1 * sp;
    out[0] = this.tx + this.R * u;
    out[1] = this.ty - this.R * v;
    out[2] = depth;
    return depth > 0 || u * u + v * v > 1;
  }

  private draw() {
    const { ctx, W, H } = this;
    if (!W) return;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const k = smoothstep((this.scale - 1) / 0.9);
    this.R = this.R0 * this.scale;
    this.tx = lerp(this.baseX, this.focusX, k);
    this.ty = lerp(this.baseY, this.focusY, k);
    const { R, tx, ty } = this;

    this.drawStars();
    if (!this.ready) return;

    // Atmosphere halo.
    const halo = ctx.createRadialGradient(tx, ty, R * 0.95, tx, ty, R * 1.28);
    halo.addColorStop(0, 'rgba(76, 150, 255, 0.32)');
    halo.addColorStop(0.35, 'rgba(56, 120, 230, 0.12)');
    halo.addColorStop(1, 'rgba(40, 90, 200, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(tx, ty, R * 1.28, 0, TAU);
    ctx.fill();

    // Ocean sphere, lit from the upper left.
    const ocean = ctx.createRadialGradient(tx - R * 0.35, ty - R * 0.4, R * 0.05, tx, ty, R * 1.05);
    ocean.addColorStop(0, '#163a6e');
    ocean.addColorStop(0.45, '#0c2147');
    ocean.addColorStop(1, '#040b1c');
    ctx.fillStyle = ocean;
    ctx.beginPath();
    ctx.arc(tx, ty, R, 0, TAU);
    ctx.fill();

    const rim = ctx.createRadialGradient(tx, ty, R * 0.78, tx, ty, R);
    rim.addColorStop(0, 'rgba(90, 160, 255, 0)');
    rim.addColorStop(1, 'rgba(110, 180, 255, 0.28)');
    ctx.fillStyle = rim;
    ctx.beginPath();
    ctx.arc(tx, ty, R, 0, TAU);
    ctx.fill();

    this.projection.rotate([-this.cLng, -this.cLat]).translate([tx, ty]).scale(R);
    const zoomed = smoothstep((this.scale - 1.2) / 1.2);

    ctx.lineWidth = 0.6;
    ctx.strokeStyle = 'rgba(120, 170, 255, 0.06)';
    ctx.beginPath();
    this.path(this.graticule);
    ctx.stroke();

    if (this.borders) {
      ctx.lineWidth = 0.7;
      ctx.strokeStyle = `rgba(130, 185, 255, ${0.07 + 0.16 * zoomed})`;
      ctx.beginPath();
      this.path(this.borders);
      ctx.stroke();
    }

    const hlFeature = this.hlCountry >= 0 ? this.countries[this.hlCountry] : null;
    if (hlFeature && this.hl > 0) {
      const pulse = 0.85 + 0.15 * Math.sin(this.time * 3);
      ctx.beginPath();
      this.path(hlFeature);
      ctx.fillStyle = `rgba(255, 176, 72, ${0.09 * this.hl * pulse})`;
      ctx.fill();
      ctx.lineJoin = 'round';
      ctx.lineWidth = 6;
      ctx.strokeStyle = `rgba(255, 170, 60, ${0.12 * this.hl})`;
      ctx.stroke();
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = `rgba(255, 205, 130, ${0.85 * this.hl})`;
      ctx.stroke();
    }

    this.drawDots();
    this.drawVisited();
    this.drawBlips();
    this.drawArcs();
    this.drawPin();

    // Soft specular sheen.
    const sheen = ctx.createRadialGradient(tx - R * 0.45, ty - R * 0.5, 0, tx - R * 0.45, ty - R * 0.5, R * 0.9);
    sheen.addColorStop(0, 'rgba(200, 225, 255, 0.07)');
    sheen.addColorStop(1, 'rgba(200, 225, 255, 0)');
    ctx.fillStyle = sheen;
    ctx.beginPath();
    ctx.arc(tx, ty, R, 0, TAU);
    ctx.fill();

    this.drawConnector();
    this.updateOverlays();
  }

  private drawStars() {
    const { ctx, W } = this;
    const shift = ((this.cLng * 1.6) % W + W) % W;
    for (const s of this.stars) {
      const a = this.opts.reducedMotion ? 0.35 : 0.2 + 0.25 * (0.5 + 0.5 * Math.sin(this.time * 1.3 + s.phase));
      ctx.fillStyle = `rgba(200, 220, 255, ${a})`;
      const x = (s.x - shift + W) % W;
      ctx.fillRect(x, s.y, s.r, s.r);
    }
  }

  private drawDots() {
    const { ctx, W, H, R, tx, ty } = this;
    const lr = -this.cLng * DEG;
    const pr = -this.cLat * DEG;
    const cl = Math.cos(lr);
    const sl = Math.sin(lr);
    const cp = Math.cos(pr);
    const sp = Math.sin(pr);
    const count = this.bucketCount;
    count.fill(0);
    this.hlCount = 0;

    const hlOn = this.hl > 0 && this.hlCountry >= 0;
    const rippleOn = this.pinAlpha > 0 && !this.opts.reducedMotion;
    const [Tx, Ty, Tz] = this.target;
    const rippleAge = this.time - this.lockAt;
    const rippleR = (rippleAge % 2.4) * 7; // degrees
    const cosMax = Math.cos(18 * DEG);
    const margin = 6;
    const fine = smoothstep((this.scale - 1.35) / 0.5);
    const levelAlpha = [1 - fine, fine];

    for (let i = 0; i < this.n; i++) {
      const level = this.dLevel[i];
      if (levelAlpha[level] <= 0.01) continue;
      const X = this.dx[i];
      const Y = this.dy[i];
      const Z = this.dz[i];
      const x1 = X * cl - Y * sl;
      const depth = x1 * cp - Z * sp;
      if (depth <= 0.03) continue;
      const y1 = X * sl + Y * cl;
      const sx = tx + R * y1;
      const sy = ty - R * (Z * cp + x1 * sp);
      if (sx < -margin || sx > W + margin || sy < -margin || sy > H + margin) continue;

      let boost = 0;
      if (hlOn && this.dCountry[i] === this.hlCountry) boost = 0.55 * this.hl;
      if (rippleOn) {
        const c = X * Tx + Y * Ty + Z * Tz;
        if (c > cosMax) {
          const d = Math.acos(Math.min(1, c)) / DEG;
          const band = 1 - Math.abs(d - rippleR) / 1.6;
          if (band > 0) boost = Math.max(boost, band * this.pinAlpha * (1 - rippleR / 18));
        }
      }
      if (boost > 0.02) {
        const o = this.hlCount * 4;
        this.hlXY[o] = sx;
        this.hlXY[o + 1] = sy;
        this.hlXY[o + 2] = boost;
        this.hlXY[o + 3] = level;
        this.hlCount++;
        continue;
      }
      const b = level * 5 + (depth > 0.8 ? 4 : Math.floor(depth * 5));
      const o = count[b] * 2;
      this.buckets[b][o] = sx;
      this.buckets[b][o + 1] = sy;
      count[b]++;
    }

    const alphas = [0.16, 0.28, 0.42, 0.6, 0.78];
    for (let b = 0; b < 10; b++) {
      if (!count[b]) continue;
      const level = b < 5 ? 0 : 1;
      const spacing = R * DOT_STEPS[level] * DEG;
      const baseSize = Math.max(1, spacing * 0.3);
      const round = baseSize > 2;
      const size = baseSize * (0.6 + 0.1 * (b % 5));
      const half = size / 2;
      const arr = this.buckets[b];
      ctx.fillStyle = `rgba(118, 178, 255, ${alphas[b % 5] * levelAlpha[level]})`;
      ctx.beginPath();
      for (let j = 0, m = count[b] * 2; j < m; j += 2) {
        if (round) {
          ctx.moveTo(arr[j] + half, arr[j + 1]);
          ctx.arc(arr[j], arr[j + 1], half, 0, TAU);
        } else {
          ctx.rect(arr[j] - half, arr[j + 1] - half, size, size);
        }
      }
      ctx.fill();
    }

    // Highlighted dots (target country and the ripple), drawn individually for per-dot glow.
    // They follow the same coarse/fine crossfade as the rest of the land.
    for (let j = 0; j < this.hlCount; j++) {
      const o = j * 4;
      const x = this.hlXY[o];
      const y = this.hlXY[o + 1];
      const a = Math.min(1, this.hlXY[o + 2]);
      const level = this.hlXY[o + 3];
      const size = Math.max(1, R * DOT_STEPS[level] * DEG * 0.3) * (0.95 + 0.5 * a);
      const alpha = (0.45 + 0.55 * a) * levelAlpha[level];
      ctx.fillStyle = `rgba(255, ${Math.round(200 + 40 * a)}, ${Math.round(120 + 100 * a)}, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, TAU);
      ctx.fill();
    }
  }

  private drawVisited() {
    const { ctx } = this;
    const p = [0, 0, 0];
    for (const idx of this.visited) {
      if (idx === this.index && this.pinAlpha > 0) continue;
      const s = this.opts.signals[idx];
      const v = toVec(s.lat, s.lng);
      if (!this.project(v[0], v[1], v[2], p) || p[2] <= 0) continue;
      const pulse = 0.5 + 0.5 * Math.sin(this.time * 2 + idx);
      const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], 10);
      g.addColorStop(0, `rgba(255, 190, 100, ${0.45 + 0.2 * pulse})`);
      g.addColorStop(1, 'rgba(255, 190, 100, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p[0], p[1], 10, 0, TAU);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 225, 170, 0.95)';
      ctx.beginPath();
      ctx.arc(p[0], p[1], 2, 0, TAU);
      ctx.fill();
    }
  }

  private drawBlips() {
    const { ctx } = this;
    const p = [0, 0, 0];
    const life = 1.6;
    for (const b of this.blips) {
      const age = (this.time - b.born) / life;
      if (age >= 1) continue;
      if (!this.project(this.dx[b.idx], this.dy[b.idx], this.dz[b.idx], p) || p[2] <= 0.1) continue;
      const a = (1 - age) * Math.min(1, p[2] * 1.4);
      ctx.strokeStyle = `rgba(150, 205, 255, ${0.55 * a})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(p[0], p[1], 2 + easeOutCubic(age) * 12, 0, TAU);
      ctx.stroke();
      ctx.fillStyle = `rgba(220, 240, 255, ${a})`;
      ctx.beginPath();
      ctx.arc(p[0], p[1], 1.5, 0, TAU);
      ctx.fill();
    }
  }

  private drawArcs() {
    if (!this.arcs.length) return;
    const { ctx } = this;
    const fade = this.phase === 'close' || this.phase === 'scan' ? this.pinAlpha : 1;
    if (fade <= 0) return;
    const p = [0, 0, 0];
    const q = [0, 0, 0];
    const [Tx, Ty, Tz] = this.target;
    if (!this.project(Tx, Ty, Tz, q) || q[2] <= 0) return;
    const ex = q[0];
    const ey = q[1];
    const steps = 40;
    ctx.lineCap = 'round';
    ctx.font = '600 9px ui-monospace, SFMono-Regular, Menlo, monospace';

    for (const arc of this.arcs) {
      const t = (this.time - arc.start) / ARC_DURATION;
      if (t < 0) continue;
      if (!this.project(arc.from[0], arc.from[1], arc.from[2], p) || p[2] <= 0) continue;
      const sx = p[0];
      const sy = p[1];
      // Bow the arc off the chord in screen space so it reads as a flight path at any zoom.
      const dx = ex - sx;
      const dy = ey - sy;
      const len = Math.hypot(dx, dy) || 1;
      const cx = (sx + ex) / 2 - (dy / len) * len * 0.32 * arc.bend;
      const cy = (sy + ey) / 2 + (dx / len) * len * 0.32 * arc.bend - len * 0.12;
      const at = (u: number, out: number[]) => {
        const m = 1 - u;
        out[0] = m * m * sx + 2 * m * u * cx + u * u * ex;
        out[1] = m * m * sy + 2 * m * u * cy + u * u * ey;
      };

      // Source marker and tag.
      const ma = clamp01(t * 3) * fade;
      ctx.fillStyle = `rgba(160, 215, 255, ${0.9 * ma})`;
      ctx.beginPath();
      ctx.arc(sx, sy, 2.4, 0, TAU);
      ctx.fill();
      if (t < 1) {
        ctx.strokeStyle = `rgba(160, 215, 255, ${0.5 * ma * (1 - t)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(sx, sy, 3 + 14 * t, 0, TAU);
        ctx.stroke();
      }
      const tw = ctx.measureText(arc.tag).width;
      const lx = sx + (dx > 0 ? -tw - 19 : 7);
      ctx.fillStyle = `rgba(8, 20, 44, ${0.8 * ma})`;
      ctx.fillRect(lx, sy - 8, tw + 10, 15);
      ctx.strokeStyle = `rgba(130, 190, 255, ${0.45 * ma})`;
      ctx.lineWidth = 1;
      ctx.strokeRect(lx + 0.5, sy - 7.5, tw + 9, 14);
      ctx.fillStyle = `rgba(190, 225, 255, ${ma})`;
      ctx.fillText(arc.tag, lx + 5, sy + 3);

      // Trail, brighter toward the head; settles into a faint path once it lands.
      const head = easeInOutCubic(clamp01(t));
      const tail = t < 1 ? Math.max(0, head - 0.5) : 0;
      const settled = t >= 1 ? Math.max(0.3, 1 - (t - 1) * 0.5) : 1;
      at(tail, q);
      for (let i = 1; i <= steps; i++) {
        const u = tail + ((head - tail) * i) / steps;
        at(u, p);
        const rel = i / steps;
        const a = (t < 1 ? rel * rel : settled * 0.55) * fade;
        ctx.strokeStyle = `rgba(255, ${Math.round(190 + 50 * rel)}, ${Math.round(110 + 110 * rel)}, ${a})`;
        ctx.lineWidth = t < 1 ? 0.8 + 1.8 * rel : 1.1;
        ctx.beginPath();
        ctx.moveTo(q[0], q[1]);
        ctx.lineTo(p[0], p[1]);
        ctx.stroke();
        q[0] = p[0];
        q[1] = p[1];
      }

      if (t < 1) {
        at(head, p);
        const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], 10);
        g.addColorStop(0, `rgba(255, 245, 220, ${fade})`);
        g.addColorStop(1, 'rgba(255, 200, 120, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p[0], p[1], 10, 0, TAU);
        ctx.fill();
      }
    }
  }

  private drawPin() {
    if (this.pinAlpha <= 0) return;
    const { ctx } = this;
    const p = [0, 0, 0];
    const [x0, y0, z0] = this.target;
    if (!this.project(x0, y0, z0, p) || p[2] <= 0) return;
    const [x, y] = p;
    const a = this.pinAlpha;
    const age = this.time - this.lockAt;

    // Expanding rings (a single still ring when motion is reduced).
    if (this.opts.reducedMotion) {
      ctx.strokeStyle = `rgba(255, 190, 100, ${0.5 * a})`;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(x, y, 18, 0, TAU);
      ctx.stroke();
    }
    for (let i = 0; i < 3 && !this.opts.reducedMotion; i++) {
      const t = ((age + i * 0.8) % 2.4) / 2.4;
      ctx.strokeStyle = `rgba(255, 190, 100, ${0.55 * (1 - t) * a})`;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(x, y, 6 + easeOutCubic(t) * 54, 0, TAU);
      ctx.stroke();
    }

    // Light beam.
    const beamH = 86 * easeOutCubic(clamp01(age / 0.6));
    const beam = ctx.createLinearGradient(x, y, x, y - beamH);
    beam.addColorStop(0, `rgba(255, 210, 140, ${0.9 * a})`);
    beam.addColorStop(1, 'rgba(255, 210, 140, 0)');
    ctx.strokeStyle = beam;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - beamH);
    ctx.stroke();
    ctx.globalAlpha = 0.25;
    ctx.lineWidth = 9;
    ctx.stroke();
    ctx.globalAlpha = 1;

    const glow = ctx.createRadialGradient(x, y, 0, x, y, 30);
    glow.addColorStop(0, `rgba(255, 190, 100, ${0.55 * a})`);
    glow.addColorStop(1, 'rgba(255, 190, 100, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, TAU);
    ctx.fill();

    ctx.fillStyle = `rgba(255, 255, 255, ${a})`;
    ctx.beginPath();
    ctx.arc(x, y, 3.6, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = `rgba(255, 200, 120, ${a})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, TAU);
    ctx.stroke();

    // Lock-on reticle that snaps in, then fades.
    const lt = clamp01(age / 0.55);
    const ra = this.opts.reducedMotion ? 0 : (1 - clamp01((age - 0.9) / 0.6)) * a;
    if (ra > 0) {
      const size = lerp(64, 17, easeOutCubic(lt));
      const len = size * 0.45;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((1 - easeOutCubic(lt)) * 0.8);
      ctx.strokeStyle = `rgba(255, 230, 190, ${ra})`;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (let q = 0; q < 4; q++) {
        ctx.rotate(Math.PI / 2);
        ctx.moveTo(-size, -size + len);
        ctx.lineTo(-size, -size);
        ctx.lineTo(-size + len, -size);
      }
      ctx.stroke();
      ctx.restore();
    }
  }

  private drawConnector() {
    if (this.phase !== 'reveal' && this.phase !== 'ready') return;
    const card = this.opts.getCard();
    if (!card || this.pinAlpha <= 0) return;
    const p = [0, 0, 0];
    const [x0, y0, z0] = this.target;
    if (!this.project(x0, y0, z0, p) || p[2] <= 0) return;

    const cr = card.getBoundingClientRect();
    const vr = this.opts.canvas.getBoundingClientRect();
    const ax = this.wide ? cr.left - vr.left : cr.left - vr.left + cr.width / 2;
    const ay = this.wide ? cr.top - vr.top + 48 : cr.top - vr.top;
    const a = clamp01((this.time - this.lockAt - LOCK_TIME - 0.15) / 0.5) * this.pinAlpha;
    const { ctx } = this;
    const sx = p[0];
    const sy = p[1];
    const cx = this.wide ? sx + (ax - sx) * 0.55 : sx;
    const cy = this.wide ? sy : sy + (ay - sy) * 0.55;

    const grad = ctx.createLinearGradient(sx, sy, ax, ay);
    grad.addColorStop(0, `rgba(255, 200, 120, ${0.85 * a})`);
    grad.addColorStop(1, `rgba(170, 210, 255, ${0.6 * a})`);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.2;
    ctx.setLineDash([3, 5]);
    ctx.lineDashOffset = -this.time * 28;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.quadraticCurveTo(cx, cy, ax, ay);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = `rgba(200, 225, 255, ${a})`;
    ctx.beginPath();
    ctx.arc(ax, ay, 2.6, 0, TAU);
    ctx.fill();
  }

  private updateOverlays() {
    const chip = this.opts.chip;
    if (chip) {
      const p = [0, 0, 0];
      const [x0, y0, z0] = this.target;
      const visible = this.project(x0, y0, z0, p) && p[2] > 0;
      const beamH = 86 * easeOutCubic(clamp01((this.time - this.lockAt) / 0.6));
      chip.style.transform = `translate3d(${p[0].toFixed(1)}px, ${(p[1] - beamH - 6).toFixed(1)}px, 0)`;
      chip.style.opacity = visible ? String(this.pinAlpha) : '0';
    }
    const coords = this.opts.coords;
    if (coords && this.time - this.lastHud > 0.08) {
      this.lastHud = this.time;
      const lng = ((((this.cLng + 180) % 360) + 360) % 360) - 180;
      coords.textContent = `${Math.abs(this.cLat).toFixed(2)}°${this.cLat >= 0 ? 'N' : 'S'}  ${Math.abs(lng).toFixed(2)}°${lng >= 0 ? 'E' : 'W'}  ·  ${this.scale.toFixed(1)}×`;
    }
  }
}
