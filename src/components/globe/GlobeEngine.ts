import { geoEquirectangular, geoGraticule10, geoInterpolate, geoOrthographic, geoPath } from 'd3-geo';
import type { GeoPath, GeoPermissibleObjects, GeoProjection } from 'd3-geo';
import { feature, merge, mesh } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';
import type { Feature, Geometry, MultiLineString } from 'geojson';
import { ambientTags, hubCities, type ExampleSignal } from './signals';

/**
 * intro: the globe turns on its own · fly: camera travels to the next signal ·
 * arrive: country lights up and the pin drops · show: the signal card is open ·
 * leave: the card closes just before the next flight.
 */
export type GlobePhase = 'intro' | 'fly' | 'arrive' | 'show' | 'leave';

export interface GlobeEngineOptions {
  canvas: HTMLCanvasElement;
  signals: ExampleSignal[];
  onPhase: (phase: GlobePhase, index: number) => void;
  /** Follows the pin every frame; the signal card hangs off it. */
  anchor: HTMLElement | null;
  /** Small tags that pop up at other cities while a signal is shown. */
  tags: (HTMLElement | null)[];
  reducedMotion: boolean;
}

// Seconds.
const INTRO_TIME = 1.0;
const ARRIVE_TIME = 0.75;
const SHOW_TIME = 4.4;
const LEAVE_TIME = 0.35;
const TAG_LIFE = 2.6;

// A flight pulls back to the whole globe, turns it, then dives in. Fractions of the flight time.
const PULL_BACK = 0.32;
const DIVE_IN = 0.36;
const DOT_STEPS = [1.0, 0.6];
/** How far the atmosphere reaches, in globe radii. */
const BASE_EXTENT = 1.28;
const SPRITE_PX = 1024;

const DEG = Math.PI / 180;
const TAU = Math.PI * 2;

// Palette: indigo land on a pearl sphere, a warm orange for the active signal.
const INK = '67, 56, 202';
const INK_SOFT = '99, 102, 241';
const VIOLET = '139, 92, 246';
const WARM = '249, 115, 22';
const WARM_SOFT = '251, 146, 60';

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutBack = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
const smoothstep = (t: number) => {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
};
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function toVec(lat: number, lng: number): [number, number, number] {
  const p = lat * DEG;
  const l = lng * DEG;
  return [Math.cos(p) * Math.cos(l), Math.cos(p) * Math.sin(l), Math.sin(p)];
}

function angle(a: [number, number, number], b: [number, number, number]) {
  return Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]))) / DEG;
}

interface Arc {
  from: [number, number, number];
  to: [number, number, number];
  omega: number;
  lift: number;
  born: number;
}

interface Tag {
  hub: number;
  born: number;
}

export class GlobeEngine {
  private opts: GlobeEngineOptions;
  private ctx: CanvasRenderingContext2D;
  private W = 0;
  private H = 0;
  private dpr = 0;
  private wide = false;
  private baseX = 0;
  private baseY = 0;
  private focusX = 0;
  private focusY = 0;
  private R0 = 1;

  // Camera: lat/lng at the centre of the view, zoom, and where the globe sits on screen.
  private cLng = -20;
  private cLat = 24;
  private scale = 1;
  private R = 1;
  private tx = 0;
  private ty = 0;

  private phase: GlobePhase = 'intro';
  private phaseT = 0;
  private time = 0;
  private index = -1;
  private fly = { along: geoInterpolate([0, 0], [0, 0]), s0: 1, s1: 1, dur: 1 };

  // Land dots: a coarse grid for the whole globe and a fine one that fades in when zoomed.
  private ready = false;
  private n = 0;
  private dx = new Float32Array(0);
  private dy = new Float32Array(0);
  private dz = new Float32Array(0);
  private dCountry = new Int16Array(0);
  private dLevel = new Uint8Array(0);
  private buckets: Float32Array[] = [];
  private bucketCount = new Int32Array(10);
  private warmXY = new Float32Array(0);
  private warmCount = 0;

  private countries: Feature<Geometry, { name: string }>[] = [];
  private land: Geometry | null = null;
  // The sphere's gradients never change shape, only size, so they are painted once and scaled.
  private baseSprite = GlobeEngine.paintSprite(BASE_EXTENT, (c) => {
    const halo = c.createRadialGradient(0, 0, 0.97, 0, 0, BASE_EXTENT);
    halo.addColorStop(0, `rgba(${INK_SOFT}, 0.55)`);
    halo.addColorStop(0.25, `rgba(${INK_SOFT}, 0.22)`);
    halo.addColorStop(0.6, `rgba(${VIOLET}, 0.08)`);
    halo.addColorStop(1, `rgba(${VIOLET}, 0)`);
    c.fillStyle = halo;
    c.beginPath();
    c.arc(0, 0, BASE_EXTENT, 0, TAU);
    c.fill();
    const ocean = c.createRadialGradient(-0.35, -0.4, 0.05, 0, 0, 1.02);
    ocean.addColorStop(0, '#f2f6ff');
    ocean.addColorStop(0.45, '#d6e2ff');
    ocean.addColorStop(0.8, '#adc2f7');
    ocean.addColorStop(1, '#8ea7ec');
    c.fillStyle = ocean;
    c.beginPath();
    c.arc(0, 0, 1, 0, TAU);
    c.fill();
  });
  private shadeSprite = GlobeEngine.paintSprite(1, (c) => {
    // Terminator-style shading toward the lower right gives the sphere its depth.
    const shade = c.createRadialGradient(-0.3, -0.35, 0.1, -0.3, -0.35, 1.55);
    shade.addColorStop(0, 'rgba(30, 27, 90, 0)');
    shade.addColorStop(0.5, 'rgba(30, 27, 90, 0)');
    shade.addColorStop(1, 'rgba(30, 27, 90, 0.42)');
    c.fillStyle = shade;
    c.beginPath();
    c.arc(0, 0, 1, 0, TAU);
    c.fill();
    // Thin bright rim where the atmosphere catches the light.
    const rim = c.createRadialGradient(0, 0, 0.92, 0, 0, 1);
    rim.addColorStop(0, 'rgba(224, 231, 255, 0)');
    rim.addColorStop(1, 'rgba(224, 231, 255, 0.6)');
    c.fillStyle = rim;
    c.fill();
    // Specular highlight.
    const sheen = c.createRadialGradient(-0.42, -0.48, 0, -0.42, -0.48, 0.75);
    sheen.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
    sheen.addColorStop(1, 'rgba(255, 255, 255, 0)');
    c.fillStyle = sheen;
    c.fill();
  });
  private borders: MultiLineString | null = null;
  private graticule = geoGraticule10();
  private projection: GeoProjection = geoOrthographic().clipAngle(90).precision(1.2);
  private path: GeoPath<unknown, GeoPermissibleObjects>;
  private countryIndexByName = new Map<string, number>();
  private hubs = hubCities.map(([lat, lng]) => toVec(lat, lng));

  private hlCountry = -1;
  private hl = 0;
  private pin = 0;
  private arriveAt = -10;
  private target: [number, number, number] = [1, 0, 0];
  private visited: number[] = [];
  private arcs: Arc[] = [];
  private nextArc = 0;
  private tags: (Tag | null)[] = [];
  private nextTag = 0;
  private tagLabel = 0;
  /** Fades every tag in with 'show' and out with the card, so none ride along on a flight. */
  private tagVis = 0;

  private raf = 0;
  private last = 0;
  private running = false;
  private disposed = false;
  private resizeObserver: ResizeObserver;
  private wideQuery: MediaQueryList;
  private dprQuery: MediaQueryList | null = null;

  /** Paint into a square canvas whose coordinates run from -extent to +extent globe radii. */
  private static paintSprite(extent: number, paint: (c: CanvasRenderingContext2D) => void) {
    const canvas = document.createElement('canvas');
    canvas.width = SPRITE_PX;
    canvas.height = SPRITE_PX;
    const c = canvas.getContext('2d')!;
    c.translate(SPRITE_PX / 2, SPRITE_PX / 2);
    c.scale(SPRITE_PX / (2 * extent), SPRITE_PX / (2 * extent));
    paint(c);
    return canvas;
  }

  constructor(opts: GlobeEngineOptions) {
    this.opts = opts;
    this.ctx = opts.canvas.getContext('2d')!;
    this.path = geoPath(this.projection, this.ctx);
    this.tags = opts.tags.map(() => null);
    this.wideQuery = window.matchMedia('(min-width: 1280px)');
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(opts.canvas.parentElement ?? opts.canvas);
    this.watchDpr();
    this.resize();
    this.load().catch(() => {
      // One retry for a flaky network or a chunk that changed mid-deploy.
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
    // One merged landmass is far cheaper to project and clip every frame than ~170 country outlines.
    const landShapes = world.objects.countries.geometries.filter(
      (g) => (g.properties as { name?: string } | undefined)?.name !== 'Antarctica'
    );
    this.land = merge(world, landShapes as unknown as Parameters<typeof merge>[1]);
    this.buildDots();
    this.ready = true;
    this.setPhase('intro');
    this.draw();
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
    this.warmXY = new Float32Array(this.n * 4);
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
    this.wide = wide;
    const c = this.opts.canvas;
    c.width = Math.round(W * dpr);
    c.height = Math.round(H * dpr);
    c.style.width = `${W}px`;
    c.style.height = `${H}px`;

    if (wide) {
      this.baseX = W * 0.7;
      this.baseY = H * 0.5;
      this.R0 = Math.min(H * 0.4, W * 0.25);
      // Leave room on the right for the card that hangs off the pin.
      this.focusX = Math.min(W * 0.6, W - 420);
      this.focusY = H * 0.5;
    } else {
      this.baseX = W / 2;
      this.baseY = H * 0.42;
      this.R0 = Math.min(W * 0.42, H * 0.36);
      this.focusX = W / 2;
      this.focusY = H * 0.3;
    }
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

  /** Plan the next flight: along the great circle to the next signal. */
  private startFly() {
    const signals = this.opts.signals;
    this.index = (this.index + 1) % signals.length;
    const s = signals[this.index];
    const dist = angle(toVec(this.cLat, this.cLng), toVec(s.lat, s.lng));
    this.fly = {
      along: geoInterpolate([this.cLng, this.cLat], [s.lng, s.lat]),
      s0: this.scale,
      s1: s.zoom,
      dur: this.opts.reducedMotion ? 1.2 : 3.0 + 0.8 * clamp01(dist / 120),
    };
    // `target` stays on the city just shown so its pin and highlight fade out in place; it moves on arrival.
    this.setPhase('fly');
  }

  /** Zoom over a flight: ease out to the whole globe, a slight extra breath while it turns, ease back in. */
  private flightScale(t: number) {
    const { s0, s1 } = this.fly;
    if (t < PULL_BACK) return lerp(s0, 1, easeInOutCubic(t / PULL_BACK));
    if (t > 1 - DIVE_IN) return lerp(1, s1, easeInOutCubic((t - (1 - DIVE_IN)) / DIVE_IN));
    const u = (t - PULL_BACK) / (1 - PULL_BACK - DIVE_IN);
    return 1 - 0.05 * Math.pow(Math.sin(Math.PI * u), 2);
  }

  private update(dt: number) {
    if (!this.ready) return;
    this.time += dt;
    this.phaseT += dt;
    const drift = this.opts.reducedMotion ? 0.1 : 0.45;

    switch (this.phase) {
      case 'intro':
        // Spin eases to rest so the first flight starts from still, not from a sudden stop.
        this.cLng += (this.opts.reducedMotion ? 2 : 10) * dt * (1 - smoothstep((this.phaseT - INTRO_TIME * 0.3) / (INTRO_TIME * 0.7)));
        if (this.phaseT > INTRO_TIME) this.startFly();
        break;
      case 'fly': {
        const t = clamp01(this.phaseT / this.fly.dur);
        // The turn starts a little after the pull-back and settles a little before the dive ends.
        const [lng, lat] = this.fly.along(easeInOutSine(clamp01((t - 0.1) / 0.78)));
        this.cLng = lng;
        this.cLat = lat;
        this.scale = this.opts.reducedMotion ? lerp(this.fly.s0, this.fly.s1, easeInOutSine(t)) : this.flightScale(t);
        if (t >= 1) {
          const s = this.opts.signals[this.index];
          this.target = toVec(s.lat, s.lng);
          this.hlCountry = this.countryIndexByName.get(s.country) ?? -1;
          this.arriveAt = this.time;
          this.setPhase('arrive');
        }
        break;
      }
      case 'arrive':
        this.cLng += drift * dt;
        if (this.phaseT > ARRIVE_TIME) this.setPhase('show');
        break;
      case 'show':
        this.cLng += drift * dt;
        this.scale *= 1 + 0.012 * dt;
        if (this.phaseT > SHOW_TIME) {
          if (!this.visited.includes(this.index)) this.visited.push(this.index);
          this.setPhase('leave');
        }
        break;
      case 'leave':
        this.cLng += drift * dt;
        if (this.phaseT > LEAVE_TIME) this.startFly();
        break;
    }

    const lit = this.phase === 'arrive' || this.phase === 'show';
    this.hl = clamp01(this.hl + (lit ? dt / 0.9 : -dt / 0.6));
    this.pin = clamp01(this.pin + (lit ? dt / 0.35 : -dt / 0.4));
    if (this.hl === 0 && !lit) this.hlCountry = -1;

    if (!this.opts.reducedMotion) {
      // A steady trickle of arcs between cities keeps the network feeling live.
      if (this.time > this.nextArc) {
        this.nextArc = this.time + 0.45 + Math.random() * 0.35;
        this.spawnArc();
      }
      this.arcs = this.arcs.filter((a) => this.time - a.born < 2.6);
    }

    // While a signal is open, a few other cities flash short tags.
    this.tagVis = clamp01(this.tagVis + (this.phase === 'show' ? dt / 0.3 : -dt / 0.3));
    if (this.phase === 'show' && this.phaseT < SHOW_TIME - 1.2 && this.time > this.nextTag) {
      this.nextTag = this.time + 0.9 + Math.random() * 0.5;
      this.spawnTag();
    }
    if (this.phase === 'fly') this.nextTag = 0;
  }

  private spawnArc() {
    const p = [0, 0, 0];
    for (let tries = 0; tries < 8; tries++) {
      const a = this.hubs[Math.floor(Math.random() * this.hubs.length)];
      const b = this.hubs[Math.floor(Math.random() * this.hubs.length)];
      const d = angle(a, b);
      if (d < 20 || d > 75) continue;
      this.project((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2, p);
      if (p[2] < 0.25) continue;
      this.arcs.push({ from: a, to: b, omega: d * DEG, lift: 0.06 + d / 600, born: this.time });
      return;
    }
  }

  private spawnTag() {
    const slot = this.tags.findIndex((t) => !t || this.time - t.born > TAG_LIFE);
    if (slot < 0) return;
    const p = [0, 0, 0];
    const pin = [0, 0, 0];
    this.project(this.target[0], this.target[1], this.target[2], pin);
    for (let tries = 0; tries < 12; tries++) {
      const hub = Math.floor(Math.random() * this.hubs.length);
      if (this.tags.some((t) => t && t.hub === hub && this.time - t.born < TAG_LIFE)) continue;
      const v = this.hubs[hub];
      const d = angle(v, this.target);
      if (d < 4 || d > 45) continue;
      this.project(v[0], v[1], v[2], p);
      // On wide screens the left half holds the hero copy.
      const minX = this.wide ? this.W * 0.56 : 70;
      if (p[2] < 0.3 || p[0] < minX || p[0] > this.W - 70 || p[1] < 70 || p[1] > this.H - 90) continue;
      // Keep clear of the signal card, which hangs right of the pin (or below it on narrow screens).
      const dxp = p[0] - pin[0];
      const dyp = p[1] - pin[1];
      if (this.wide ? dxp > -40 && dxp < 400 && Math.abs(dyp) < 150 : dyp > -30 && Math.abs(dxp) < 190) continue;
      if (Math.hypot(dxp, dyp) < 70) continue;
      this.tags[slot] = { hub, born: this.time };
      const label = this.opts.tags[slot]?.querySelector('[data-label]');
      if (label) label.textContent = ambientTags[this.tagLabel++ % ambientTags.length];
      return;
    }
  }

  /** Project a unit-sphere (or lifted) point for the current view. Returns false when hidden behind the globe. */
  private project(x: number, y: number, z: number, out: number[]) {
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
    if (!this.ready) return;

    const k = smoothstep((this.scale - 1) / 0.8);
    this.R = this.R0 * this.scale;
    this.tx = lerp(this.baseX, this.focusX, k);
    this.ty = lerp(this.baseY, this.focusY, k);
    const { R, tx, ty } = this;
    const zoomed = smoothstep((this.scale - 1.2) / 1.0);

    // Soft contact shadow while the whole globe is in view.
    if (k < 0.98) {
      ctx.save();
      ctx.globalAlpha = 1 - k;
      ctx.translate(tx, ty + R * 1.12);
      ctx.scale(1, 0.13);
      const sh = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 0.85);
      sh.addColorStop(0, 'rgba(30, 27, 75, 0.38)');
      sh.addColorStop(1, 'rgba(30, 27, 75, 0)');
      ctx.fillStyle = sh;
      ctx.beginPath();
      ctx.arc(0, 0, R * 0.85, 0, TAU);
      ctx.fill();
      ctx.restore();
    }

    // Atmosphere and lit ocean.
    const be = R * BASE_EXTENT;
    ctx.drawImage(this.baseSprite, tx - be, ty - be, be * 2, be * 2);

    this.projection.rotate([-this.cLng, -this.cLat]).translate([tx, ty]).scale(R);

    ctx.lineWidth = 0.6;
    ctx.strokeStyle = `rgba(${INK}, 0.1)`;
    ctx.beginPath();
    this.path(this.graticule);
    ctx.stroke();

    // Landmasses as solid shapes, with the dot grid laid over them.
    if (this.land) {
      // Project the coastlines once and reuse them for the fill and the outline.
      const coast = new Path2D();
      this.path.context(coast as unknown as CanvasRenderingContext2D)(this.land);
      this.path.context(ctx);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.94)';
      ctx.fill(coast);
      ctx.lineWidth = 0.9;
      ctx.strokeStyle = `rgba(${INK}, 0.28)`;
      ctx.stroke(coast);
    }
    if (this.borders) {
      ctx.lineWidth = 0.7;
      ctx.strokeStyle = `rgba(${INK}, ${0.14 + 0.22 * zoomed})`;
      ctx.beginPath();
      this.path(this.borders);
      ctx.stroke();
    }

    const p = [0, 0, 0];
    const pinVisible = this.project(this.target[0], this.target[1], this.target[2], p) && p[2] > 0;
    const pinX = p[0];
    const pinY = p[1];
    // The country is revealed outward from the pin.
    const revealDeg = 2 + 28 * easeOutCubic(clamp01((this.time - this.arriveAt) / 1.2));
    const hlFeature = this.hlCountry >= 0 ? this.countries[this.hlCountry] : null;
    if (hlFeature && this.hl > 0 && pinVisible) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(pinX, pinY, revealDeg * DEG * R * 1.1, 0, TAU);
      ctx.clip();
      ctx.beginPath();
      this.path(hlFeature);
      ctx.fillStyle = `rgba(${WARM_SOFT}, ${0.3 * this.hl})`;
      ctx.fill();
      ctx.lineJoin = 'round';
      ctx.lineWidth = 9;
      ctx.strokeStyle = `rgba(${WARM}, ${0.16 * this.hl})`;
      ctx.stroke();
      ctx.lineWidth = 2;
      ctx.strokeStyle = `rgba(${WARM}, ${0.95 * this.hl})`;
      ctx.stroke();
      ctx.restore();
    }

    this.drawDots(revealDeg);

    // Depth shading, rim light and specular highlight.
    ctx.drawImage(this.shadeSprite, tx - R, ty - R, R * 2, R * 2);

    this.drawHubs(zoomed);
    this.drawArcs(zoomed);
    this.drawVisited();
    if (pinVisible) this.drawPin(pinX, pinY);

    this.updateOverlays(pinVisible, pinX, pinY);
  }

  private drawDots(revealDeg: number) {
    const { ctx, W, H, R, tx, ty } = this;
    const lr = -this.cLng * DEG;
    const pr = -this.cLat * DEG;
    const cl = Math.cos(lr);
    const sl = Math.sin(lr);
    const cp = Math.cos(pr);
    const sp = Math.sin(pr);
    const count = this.bucketCount;
    count.fill(0);
    this.warmCount = 0;

    const fine = smoothstep((this.scale - 1.35) / 0.5);
    const levelAlpha = [1 - fine, fine];
    const hlOn = this.hl > 0 && this.hlCountry >= 0;
    const [Tx, Ty, Tz] = this.target;
    const cosReveal = Math.cos(revealDeg * DEG);
    const age = this.time - this.arriveAt;
    const ripple = this.opts.reducedMotion ? -1 : (age % 2.2) * 4.5; // degrees from the pin
    const cosRipple = Math.cos(11 * DEG);
    // A slow highlight band that sweeps around the globe.
    const sweep = this.time * 0.22;
    const swX = Math.cos(sweep);
    const swY = Math.sin(sweep);
    const margin = 6;

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

      let warm = 0;
      if (hlOn || this.pin > 0) {
        const c = X * Tx + Y * Ty + Z * Tz;
        if (hlOn && this.dCountry[i] === this.hlCountry && c > cosReveal) warm = 0.85 * this.hl;
        if (ripple >= 0 && this.pin > 0 && c > cosRipple) {
          const d = Math.acos(Math.min(1, c)) / DEG;
          const band = 1 - Math.abs(d - ripple) / 1.2;
          if (band > 0) warm = Math.max(warm, 0.7 * band * this.pin * (1 - ripple / 10));
        }
      }
      if (warm > 0.03) {
        const o = this.warmCount * 4;
        this.warmXY[o] = sx;
        this.warmXY[o + 1] = sy;
        this.warmXY[o + 2] = warm;
        this.warmXY[o + 3] = level;
        this.warmCount++;
      }
      let b = depth > 0.8 ? 4 : Math.floor(depth * 5);
      if (b < 4 && X * swX + Y * swY > 0.985) b++;
      const slot = level * 5 + b;
      const o = count[slot] * 2;
      const arr = this.buckets[slot];
      arr[o] = sx;
      arr[o + 1] = sy;
      count[slot]++;
    }

    const alphas = [0.22, 0.36, 0.52, 0.68, 0.85];
    for (let b = 0; b < 10; b++) {
      if (!count[b]) continue;
      const level = b < 5 ? 0 : 1;
      const baseSize = Math.max(1, R * DOT_STEPS[level] * DEG * 0.32);
      const size = baseSize * (0.6 + 0.1 * (b % 5));
      const half = size / 2;
      const round = size > 2;
      const arr = this.buckets[b];
      ctx.fillStyle = `rgba(${INK}, ${alphas[b % 5] * levelAlpha[level]})`;
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

    for (let j = 0; j < this.warmCount; j++) {
      const o = j * 4;
      const a = Math.min(1, this.warmXY[o + 2]);
      const level = this.warmXY[o + 3];
      const size = Math.max(1, R * DOT_STEPS[level] * DEG * 0.32) * (1 + 0.45 * a);
      // Drawn over the indigo dot, so orange blends in and out from zero rather than swapping colour.
      ctx.fillStyle = `rgba(${WARM}, ${a * levelAlpha[level]})`;
      ctx.beginPath();
      ctx.arc(this.warmXY[o], this.warmXY[o + 1], size / 2, 0, TAU);
      ctx.fill();
    }
  }

  private drawHubs(zoomed: number) {
    const { ctx } = this;
    const p = [0, 0, 0];
    const a = 0.85 * (1 - zoomed * 0.4);
    for (const v of this.hubs) {
      if (!this.project(v[0], v[1], v[2], p) || p[2] <= 0.05) continue;
      const da = a * Math.min(1, p[2] * 2);
      ctx.fillStyle = `rgba(${INK_SOFT}, ${da * 0.3})`;
      ctx.beginPath();
      ctx.arc(p[0], p[1], 6, 0, TAU);
      ctx.fill();
      ctx.fillStyle = `rgba(${INK}, ${da})`;
      ctx.beginPath();
      ctx.arc(p[0], p[1], 2.2, 0, TAU);
      ctx.fill();
    }
    // Pulse on cities currently showing a tag.
    for (const t of this.tags) {
      if (!t) continue;
      const age = (this.time - t.born) / TAG_LIFE;
      if (age >= 1) continue;
      const v = this.hubs[t.hub];
      if (!this.project(v[0], v[1], v[2], p) || p[2] <= 0) continue;
      const ring = (age * 2.2) % 1;
      const vis = this.tagVis * Math.max(0, Math.min(1, age / 0.12, (1 - age) / 0.18));
      ctx.strokeStyle = `rgba(${VIOLET}, ${0.5 * (1 - ring) * vis})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(p[0], p[1], 3 + ring * 14, 0, TAU);
      ctx.stroke();
      ctx.fillStyle = `rgba(${VIOLET}, ${0.95 * vis})`;
      ctx.beginPath();
      ctx.arc(p[0], p[1], 2.6, 0, TAU);
      ctx.fill();
    }
  }

  private drawArcs(zoomed: number) {
    if (!this.arcs.length) return;
    const { ctx } = this;
    const fade = 1 - zoomed * 0.75;
    const steps = 36;
    const p = [0, 0, 0];
    const q = [0, 0, 0];
    ctx.lineCap = 'round';
    for (const arc of this.arcs) {
      const age = this.time - arc.born;
      const head = easeInOutSine(clamp01(age / 1.5));
      const tail = easeInOutSine(clamp01((age - 0.55) / 1.6));
      if (head <= tail) continue;
      const so = Math.sin(arc.omega) || 1;
      const at = (u: number, out: number[]) => {
        const a = Math.sin((1 - u) * arc.omega) / so;
        const b = Math.sin(u * arc.omega) / so;
        const h = 1 + arc.lift * Math.sin(Math.PI * u);
        return this.project(
          (arc.from[0] * a + arc.to[0] * b) * h,
          (arc.from[1] * a + arc.to[1] * b) * h,
          (arc.from[2] * a + arc.to[2] * b) * h,
          out
        );
      };
      let prevOk = at(tail, q);
      for (let i = 1; i <= steps; i++) {
        const u = tail + ((head - tail) * i) / steps;
        const ok = at(u, p);
        if (ok && prevOk) {
          const rel = i / steps;
          const col = rel > 0.5 ? VIOLET : INK_SOFT;
          ctx.beginPath();
          ctx.moveTo(q[0], q[1]);
          ctx.lineTo(p[0], p[1]);
          ctx.strokeStyle = `rgba(${col}, ${0.18 * rel * fade})`;
          ctx.lineWidth = 6 * rel + 1;
          ctx.stroke();
          ctx.strokeStyle = `rgba(${col}, ${0.9 * rel * fade})`;
          ctx.lineWidth = 1.2 + 1.6 * rel;
          ctx.stroke();
        }
        q[0] = p[0];
        q[1] = p[1];
        prevOk = ok;
      }
      if (age < 1.5 && at(head, p)) {
        const ha = fade * (1 - smoothstep((age - 1.2) / 0.3));
        const hg = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], 9);
        hg.addColorStop(0, `rgba(255, 255, 255, ${ha})`);
        hg.addColorStop(0.35, `rgba(${VIOLET}, ${0.8 * ha})`);
        hg.addColorStop(1, `rgba(${VIOLET}, 0)`);
        ctx.fillStyle = hg;
        ctx.beginPath();
        ctx.arc(p[0], p[1], 9, 0, TAU);
        ctx.fill();
      }
    }
  }

  private drawVisited() {
    const { ctx } = this;
    const p = [0, 0, 0];
    for (const idx of this.visited) {
      if (idx === this.index && this.pin > 0) continue;
      const s = this.opts.signals[idx];
      const v = toVec(s.lat, s.lng);
      if (!this.project(v[0], v[1], v[2], p) || p[2] <= 0) continue;
      const va = idx === this.visited[this.visited.length - 1] ? 1 - this.pin : 1;
      const g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], 9);
      g.addColorStop(0, `rgba(${WARM_SOFT}, ${0.45 * va})`);
      g.addColorStop(1, `rgba(${WARM_SOFT}, 0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p[0], p[1], 9, 0, TAU);
      ctx.fill();
      ctx.fillStyle = `rgba(${WARM}, ${0.95 * va})`;
      ctx.beginPath();
      ctx.arc(p[0], p[1], 2.2, 0, TAU);
      ctx.fill();
    }
  }

  private drawPin(x: number, y: number) {
    if (this.pin <= 0) return;
    const { ctx } = this;
    const a = this.pin;
    const age = this.time - this.arriveAt;
    const drop = this.opts.reducedMotion ? 0 : (1 - easeOutBack(clamp01(age / 0.55))) * 26;

    if (!this.opts.reducedMotion) {
      for (let i = 0; i < 2; i++) {
        const t = ((age + i * 1.1) % 2.2) / 2.2;
        ctx.strokeStyle = `rgba(${WARM}, ${0.7 * (1 - t) * a})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(x, y, 8 + easeOutCubic(t) * 52, 0, TAU);
        ctx.stroke();
      }
    }

    // Light beam rising from the location.
    const beamH = 70 * easeOutCubic(clamp01(age / 0.7));
    const beam = ctx.createLinearGradient(x, y, x, y - beamH);
    beam.addColorStop(0, `rgba(${WARM}, ${0.75 * a})`);
    beam.addColorStop(1, `rgba(${WARM_SOFT}, 0)`);
    ctx.strokeStyle = beam;
    ctx.lineCap = 'round';
    ctx.lineWidth = 10;
    ctx.globalAlpha = 0.25;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - beamH);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    const glow = ctx.createRadialGradient(x, y, 0, x, y, 30);
    glow.addColorStop(0, `rgba(${WARM_SOFT}, ${0.6 * a})`);
    glow.addColorStop(1, `rgba(${WARM_SOFT}, 0)`);
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, TAU);
    ctx.fill();

    // Marker head drops in with a small bounce.
    const hy = y - drop;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.shadowColor = 'rgba(124, 45, 18, 0.35)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = `rgb(${WARM})`;
    ctx.beginPath();
    ctx.arc(x, hy, 9, 0, TAU);
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = `rgba(255, 255, 255, ${a})`;
    ctx.beginPath();
    ctx.arc(x, hy, 3.5, 0, TAU);
    ctx.fill();
  }

  private updateOverlays(pinVisible: boolean, pinX: number, pinY: number) {
    const anchor = this.opts.anchor;
    if (anchor) {
      anchor.style.transform = `translate3d(${pinX.toFixed(1)}px, ${pinY.toFixed(1)}px, 0)`;
      anchor.style.visibility = pinVisible ? 'visible' : 'hidden';
    }
    const p = [0, 0, 0];
    this.opts.tags.forEach((el, i) => {
      if (!el) return;
      const t = this.tags[i];
      const age = t ? (this.time - t.born) / TAG_LIFE : 1;
      if (!t || age >= 1) {
        el.style.opacity = '0';
        return;
      }
      const v = this.hubs[t.hub];
      const visible = this.project(v[0], v[1], v[2], p) && p[2] > 0.1 && this.tagVis > 0;
      const fade = Math.min(1, age / 0.12, (1 - age) / 0.18);
      const rise = (1 - easeOutCubic(Math.min(1, age / 0.15))) * 6;
      el.style.transform = `translate3d(${p[0].toFixed(1)}px, ${(p[1] - 10 + rise).toFixed(1)}px, 0)`;
      // Fade out as the city nears the globe's edge instead of vanishing when it crosses over.
      const edge = clamp01((p[2] - 0.1) / 0.15);
      el.style.opacity = visible ? String(Math.max(0, fade) * edge * this.tagVis) : '0';
    });
  }
}
