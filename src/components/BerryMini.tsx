import { useEffect, useRef } from 'react';

/**
 * The Databery mark as a small 3D berry for the navbar: the same composition as the logo (meshed on the left,
 * loose dots on the right, stem and leaf on top) turning slowly. It takes the exact box of the static mark and
 * has no interaction. Visitors who prefer less motion get a still frame.
 */

const N = 90;
const COLORS = [
  [30, 27, 75], // deep navy
  [109, 40, 217], // purple
  [59, 130, 246], // blue
];

const smoothstep = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

function mix(t: number) {
  const k = t < 0.6 ? t / 0.6 : (t - 0.6) / 0.4;
  const [a, b] = t < 0.6 ? [COLORS[0], COLORS[1]] : [COLORS[1], COLORS[2]];
  return a.map((v, i) => Math.round(v + (b[i] - v) * k));
}

export default function BerryMini({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const pts = Array.from({ length: N }, (_, i) => {
      const y = 1 - (2 * (i + 0.5)) / N;
      const r = Math.sqrt(1 - y * y);
      const t = i * Math.PI * (3 - Math.sqrt(5));
      return { x: Math.cos(t) * r, y, z: Math.sin(t) * r, drift: 0.08 + ((i * 7) % 11) / 55 };
    });
    const edges: [number, number][] = [];
    const seen = new Set<string>();
    pts.forEach((p, i) => {
      pts
        .map((q, j) => ({ j, d: (p.x - q.x) ** 2 + (p.y - q.y) ** 2 + (p.z - q.z) ** 2 }))
        .filter(({ j }) => j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 3)
        .forEach(({ j }) => {
          const key = i < j ? `${i}-${j}` : `${j}-${i}`;
          if (!seen.has(key)) {
            seen.add(key);
            edges.push([Math.min(i, j), Math.max(i, j)]);
          }
        });
    });

    // Measured from layout, and again whenever that changes: inside a frame or a hidden tab the first
    // measurement can be zero, which would leave the canvas blank. 36px is the mark's size in the navbar.
    let size = 36;
    let spin = -0.5;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      size = canvas.clientWidth || canvas.getBoundingClientRect().width || 36;
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(spin);
    };

    const sx = new Float32Array(N);
    const sy = new Float32Array(N);
    const sz = new Float32Array(N);
    const loose = new Float32Array(N);
    const order = Array.from({ length: N }, (_, i) => i);

    // Laid out like the static mark: berry low and slightly left, stem and leaf top right.
    function draw(spin: number) {
      ctx!.clearRect(0, 0, size, size);
      const R = size * 0.33;
      const cx = size * 0.48;
      const cy = size * 0.6;
      const cyw = Math.cos(spin);
      const syw = Math.sin(spin);
      const cp = Math.cos(0.2);
      const sp = Math.sin(0.2);
      for (let i = 0; i < N; i++) {
        const p = pts[i];
        const x1 = p.x * cyw + p.z * syw;
        const z1 = -p.x * syw + p.z * cyw;
        const y2 = p.y * cp - z1 * sp;
        const z2 = p.y * sp + z1 * cp;
        const m = smoothstep(-0.05, 0.6, x1);
        loose[i] = m;
        const out = 1 + m * p.drift;
        sx[i] = cx + x1 * out * R;
        sy[i] = cy - y2 * out * R;
        sz[i] = z2;
      }

      ctx!.lineWidth = Math.max(0.5, size / 60);
      for (const [a, b] of edges) {
        const hold = (1 - loose[a]) * (1 - loose[b]);
        if (hold < 0.05) continue;
        const front = ((sz[a] + sz[b]) / 2 + 1) / 2;
        const c = mix(Math.min(1, (loose[a] + loose[b]) / 2 + 0.15));
        ctx!.strokeStyle = `rgba(${c},${(0.12 + front * 0.6) * hold})`;
        ctx!.beginPath();
        ctx!.moveTo(sx[a], sy[a]);
        ctx!.lineTo(sx[b], sy[b]);
        ctx!.stroke();
      }
      order.sort((a, b) => sz[a] - sz[b]);
      for (const i of order) {
        const front = (sz[i] + 1) / 2;
        const m = loose[i];
        const c = mix(Math.min(1, m * 0.85 + 0.1));
        const r = size * 0.03 * (1 - m * 0.4) * (0.55 + front * 0.6);
        ctx!.fillStyle = `rgba(${c},${0.25 + front * 0.75})`;
        ctx!.beginPath();
        ctx!.arc(sx[i], sy[i], Math.max(0.45, r), 0, Math.PI * 2);
        ctx!.fill();
      }

      // Stem and leaf, as on the static mark.
      ctx!.save();
      ctx!.translate(cx + R * 0.05, cy - R * 1.02);
      ctx!.strokeStyle = '#1e1b4b';
      ctx!.lineWidth = size * 0.04;
      ctx!.lineCap = 'round';
      ctx!.beginPath();
      ctx!.moveTo(0, R * 0.05);
      ctx!.bezierCurveTo(-R * 0.02, -R * 0.2, -R * 0.1, -R * 0.36, -R * 0.24, -R * 0.5);
      ctx!.stroke();
      const leaf = ctx!.createLinearGradient(0, 0, R * 0.9, -R * 0.5);
      leaf.addColorStop(0, '#5b21b6');
      leaf.addColorStop(1, '#7c3aed');
      ctx!.fillStyle = leaf;
      ctx!.beginPath();
      ctx!.moveTo(R * 0.06, -R * 0.06);
      ctx!.bezierCurveTo(R * 0.2, -R * 0.42, R * 0.55, -R * 0.56, R * 0.95, -R * 0.52);
      ctx!.bezierCurveTo(R * 0.78, -R * 0.18, R * 0.42, R * 0.02, R * 0.06, -R * 0.06);
      ctx!.fill();
      ctx!.restore();
    }

    let raf = 0;
    let running = false;
    let last = 0;
    function frame(now: number) {
      const dt = Math.min(50, last ? now - last : 16);
      last = now;
      spin += dt * 0.00025;
      draw(spin);
      if (running) raf = requestAnimationFrame(frame);
    }

    // Pause while the tab is hidden; the navbar is otherwise always on screen.
    const onVisibility = () => {
      if (reduce) return;
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    if (!reduce) {
      running = true;
      raf = requestAnimationFrame(frame);
      document.addEventListener('visibilitychange', onVisibility);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={ref} width={36} height={36} className={`block ${className}`} aria-hidden="true" />;
}
