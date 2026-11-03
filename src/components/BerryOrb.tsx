import { useEffect, useRef } from 'react';

/**
 * The Databery berry in 3D. A sphere of points spins continuously; on the left of the view the points are knitted
 * into a glowing mesh with data pulses running along it, and as they turn to the right they let go and drift into
 * loose dots, so it always reads like the logo. Stem and leaf sit on top. Drawn on a canvas; visitors who prefer
 * less motion get a still frame.
 */

const N = 220;
const NEIGHBOURS = 3;
const PULSES = 22;

// Indigo, violet and blue, matching the dark version of the mark.
const PALETTE = [
  [129, 140, 248],
  [167, 139, 250],
  [96, 165, 250],
];

const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

function mix(t: number) {
  const k = t < 0.5 ? t / 0.5 : (t - 0.5) / 0.5;
  const [a, b] = t < 0.5 ? [PALETTE[0], PALETTE[1]] : [PALETTE[1], PALETTE[2]];
  return a.map((v, i) => Math.round(v + (b[i] - v) * k));
}

/** A soft round glow in one colour, drawn once and stamped for every node. */
function glowSprite(rgb: number[]) {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, `rgba(${rgb},0.55)`);
  grad.addColorStop(0.25, `rgba(${rgb},0.2)`);
  grad.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return c;
}

export default function BerryOrb({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Evenly spread points on a unit sphere, each with its own drift phase for when it floats loose.
    const pts = Array.from({ length: N }, (_, i) => {
      const y = 1 - (2 * (i + 0.5)) / N;
      const r = Math.sqrt(1 - y * y);
      const t = i * Math.PI * (3 - Math.sqrt(5));
      return {
        x: Math.cos(t) * r,
        y,
        z: Math.sin(t) * r,
        phase: (i * 2.399) % (Math.PI * 2),
        drift: 0.06 + ((i * 7) % 11) / 60,
        size: 0.8 + ((i * 13) % 7) / 14,
      };
    });
    const edges: [number, number][] = [];
    const seen = new Set<string>();
    pts.forEach((p, i) => {
      pts
        .map((q, j) => ({ j, d: (p.x - q.x) ** 2 + (p.y - q.y) ** 2 + (p.z - q.z) ** 2 }))
        .filter(({ j }) => j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, NEIGHBOURS)
        .forEach(({ j }) => {
          const key = i < j ? `${i}-${j}` : `${j}-${i}`;
          if (!seen.has(key)) {
            seen.add(key);
            edges.push([Math.min(i, j), Math.max(i, j)]);
          }
        });
    });
    const pulses = Array.from({ length: PULSES }, (_, k) => ({
      edge: (k * 37) % edges.length,
      t: (k * 0.137) % 1,
      speed: 0.35 + ((k * 17) % 10) / 25,
      forward: k % 2 === 0,
    }));
    const sprites = [0, 0.25, 0.5, 0.75, 1].map((t) => glowSprite(mix(t)));

    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduce) draw(0, 0);
    };

    let tiltX = 0;
    let tiltY = 0;
    let aimX = 0;
    let aimY = 0;
    const onMove = (e: PointerEvent) => {
      const b = canvas.getBoundingClientRect();
      aimY = Math.max(-0.5, Math.min(0.5, ((e.clientX - b.left) / b.width - 0.5) * 0.5));
      aimX = Math.max(-0.4, Math.min(0.4, ((e.clientY - b.top) / b.height - 0.5) * 0.35));
    };

    // Screen positions are reused every frame instead of allocated.
    const sx = new Float32Array(N);
    const sy = new Float32Array(N);
    const sz = new Float32Array(N);
    const loose = new Float32Array(N);
    const order = Array.from({ length: N }, (_, i) => i);

    function draw(spin: number, time: number) {
      ctx!.clearRect(0, 0, w, h);
      const R = Math.min(w, h) * 0.33;
      const cx = w / 2;
      const cy = h * 0.57;
      const yaw = spin + tiltY;
      const pitch = 0.22 + tiltX;
      const cyw = Math.cos(yaw);
      const syw = Math.sin(yaw);
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);

      for (let i = 0; i < N; i++) {
        const p = pts[i];
        const x1 = p.x * cyw + p.z * syw;
        const z1 = -p.x * syw + p.z * cyw;
        const y2 = p.y * cp - z1 * sp;
        const z2 = p.y * sp + z1 * cp;
        // How far this point has let go: none on the left of the view, fully on the right.
        const m = smooth(-0.05, 0.6, x1);
        loose[i] = m;
        const out = 1 + m * (p.drift + Math.sin(time * 0.0012 + p.phase) * 0.05 * m);
        const s = 1 / (1 - z2 * out * 0.25);
        sx[i] = cx + x1 * out * R * s;
        sy[i] = cy - y2 * out * R * s;
        sz[i] = z2;
      }

      // Back glow, and a faint glassy body so the berry reads as a solid.
      const glow = ctx!.createRadialGradient(cx, cy, R * 0.1, cx, cy, R * 1.7);
      glow.addColorStop(0, 'rgba(124,58,237,0.30)');
      glow.addColorStop(0.5, 'rgba(79,70,229,0.10)');
      glow.addColorStop(1, 'rgba(79,70,229,0)');
      ctx!.fillStyle = glow;
      ctx!.fillRect(0, 0, w, h);
      const body = ctx!.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.05, cx, cy, R);
      body.addColorStop(0, 'rgba(199,210,254,0.10)');
      body.addColorStop(0.75, 'rgba(99,102,241,0.06)');
      body.addColorStop(1, 'rgba(99,102,241,0)');
      ctx!.fillStyle = body;
      ctx!.beginPath();
      ctx!.arc(cx, cy, R, 0, Math.PI * 2);
      ctx!.fill();

      // Mesh lines fade with depth and dissolve as their points let go.
      ctx!.lineWidth = 1;
      for (const [a, b] of edges) {
        const hold = (1 - loose[a]) * (1 - loose[b]);
        if (hold < 0.02) continue;
        const front = ((sz[a] + sz[b]) / 2 + 1) / 2;
        const c = mix(Math.min(1, (loose[a] + loose[b]) / 2 + 0.2));
        ctx!.strokeStyle = `rgba(${c},${(0.06 + front * front * 0.55) * hold})`;
        ctx!.beginPath();
        ctx!.moveTo(sx[a], sy[a]);
        ctx!.lineTo(sx[b], sy[b]);
        ctx!.stroke();
      }

      // Points, back to front.
      order.sort((a, b) => sz[a] - sz[b]);
      ctx!.globalCompositeOperation = 'lighter';
      for (const i of order) {
        const front = (sz[i] + 1) / 2;
        const m = loose[i];
        const t = Math.min(1, m * 0.8 + 0.1 + front * 0.1);
        const size = R * 0.03 * pts[i].size * (1 - m * 0.45) * (0.65 + front * 0.5);
        const sprite = sprites[Math.round(t * 4)];
        const g = size * (2.4 + front * 1.4);
        ctx!.globalAlpha = (0.15 + front * 0.75) * (m > 0.5 ? 0.85 : 1);
        ctx!.drawImage(sprite, sx[i] - g, sy[i] - g, g * 2, g * 2);
        const c = mix(t);
        const lift = 30 * front;
        ctx!.fillStyle = `rgb(${Math.min(255, c[0] + lift)},${Math.min(255, c[1] + lift)},${Math.min(255, c[2] + lift)})`;
        ctx!.beginPath();
        ctx!.arc(sx[i], sy[i], Math.max(0.6, size), 0, Math.PI * 2);
        ctx!.fill();
      }

      // Data pulses travelling along the mesh, on the side facing us.
      for (const p of pulses) {
        const [a, b] = edges[p.edge];
        const hold = (1 - loose[a]) * (1 - loose[b]);
        if (hold < 0.3 || sz[a] + sz[b] < -0.4) continue;
        const k = p.forward ? p.t : 1 - p.t;
        const px = sx[a] + (sx[b] - sx[a]) * k;
        const py = sy[a] + (sy[b] - sy[a]) * k;
        const fade = Math.sin(p.t * Math.PI);
        ctx!.globalAlpha = fade * hold;
        const g = R * 0.09;
        ctx!.drawImage(sprites[4], px - g, py - g, g * 2, g * 2);
        ctx!.fillStyle = '#ffffff';
        ctx!.beginPath();
        ctx!.arc(px, py, R * 0.012, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;
      ctx!.globalCompositeOperation = 'source-over';

      // Rim light along the left edge, where the mesh is.
      ctx!.strokeStyle = 'rgba(165,180,252,0.22)';
      ctx!.lineWidth = 1.5;
      ctx!.beginPath();
      ctx!.arc(cx, cy, R * 1.01, Math.PI * 0.55, Math.PI * 1.45);
      ctx!.stroke();

      // Stem and leaf. The leaf turns a little in depth as it sways.
      const sway = Math.sin(time * 0.0008) * 0.05 + tiltY * 0.3;
      ctx!.save();
      ctx!.translate(cx, cy - R * 1.0);
      ctx!.rotate(sway);
      ctx!.strokeStyle = '#c7d2fe';
      ctx!.lineWidth = R * 0.06;
      ctx!.lineCap = 'round';
      ctx!.beginPath();
      ctx!.moveTo(0, R * 0.04);
      ctx!.bezierCurveTo(-R * 0.02, -R * 0.2, -R * 0.08, -R * 0.34, -R * 0.2, -R * 0.46);
      ctx!.stroke();
      ctx!.translate(R * 0.04, -R * 0.06);
      ctx!.scale(1, 0.85 + Math.sin(time * 0.0011) * 0.15);
      ctx!.shadowColor = 'rgba(167,139,250,0.7)';
      ctx!.shadowBlur = R * 0.18;
      const leaf = ctx!.createLinearGradient(0, 0, R * 0.78, -R * 0.42);
      leaf.addColorStop(0, '#6d28d9');
      leaf.addColorStop(0.6, '#8b5cf6');
      leaf.addColorStop(1, '#ddd6fe');
      ctx!.fillStyle = leaf;
      ctx!.beginPath();
      ctx!.moveTo(0, 0);
      ctx!.bezierCurveTo(R * 0.12, -R * 0.32, R * 0.44, -R * 0.46, R * 0.78, -R * 0.42);
      ctx!.bezierCurveTo(R * 0.66, -R * 0.14, R * 0.36, R * 0.04, 0, 0);
      ctx!.fill();
      ctx!.shadowBlur = 0;
      ctx!.strokeStyle = 'rgba(255,255,255,0.35)';
      ctx!.lineWidth = R * 0.012;
      ctx!.beginPath();
      ctx!.moveTo(R * 0.06, -R * 0.04);
      ctx!.quadraticCurveTo(R * 0.36, -R * 0.24, R * 0.66, -R * 0.36);
      ctx!.stroke();
      ctx!.restore();
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;
    let running = false;
    let last = 0;
    let spin = -0.6;
    let clock = 0;
    function frame(now: number) {
      const dt = Math.min(50, last ? now - last : 16);
      last = now;
      clock += dt;
      spin += dt * 0.00022;
      for (const p of pulses) {
        p.t += (dt / 1000) * p.speed;
        if (p.t >= 1) {
          p.t = 0;
          p.edge = (p.edge + 53) % edges.length;
        }
      }
      // Ease toward the pointer so the lean feels weighty, not twitchy.
      tiltX += (aimX - tiltX) * Math.min(1, dt * 0.004);
      tiltY += (aimY - tiltY) * Math.min(1, dt * 0.004);
      draw(spin, clock);
      if (running) raf = requestAnimationFrame(frame);
    }

    const io = new IntersectionObserver(([e]) => {
      if (reduce) return;
      if (e.isIntersecting && !running) {
        running = true;
        last = 0;
        raf = requestAnimationFrame(frame);
      } else if (!e.isIntersecting) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(canvas);
    if (!reduce) window.addEventListener('pointermove', onMove, { passive: true });
    draw(spin, 0);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
