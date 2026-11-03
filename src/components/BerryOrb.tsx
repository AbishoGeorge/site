import { useEffect, useRef } from 'react';

/**
 * The Databery berry in 3D: points on a sphere, joined into a mesh on one side and breaking into loose dots on the
 * other, as in the logo. It turns slowly, leans toward the pointer and keeps the stem and leaf on top. Drawn on a
 * canvas; visitors who prefer less motion get a still frame.
 */
export default function BerryOrb({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Evenly spread points on a unit sphere. x > 0.15 is the "loose" side.
    const N = 150;
    const pts = Array.from({ length: N }, (_, i) => {
      const y = 1 - (2 * (i + 0.5)) / N;
      const r = Math.sqrt(1 - y * y);
      const t = i * Math.PI * (3 - Math.sqrt(5));
      const x = Math.cos(t) * r;
      const z = Math.sin(t) * r;
      return { x, y, z, mesh: x < 0.15 };
    });
    // Each mesh point joins its three nearest mesh neighbours.
    const edges: [number, number][] = [];
    pts.forEach((p, i) => {
      if (!p.mesh) return;
      pts
        .map((q, j) => ({ j, d: (p.x - q.x) ** 2 + (p.y - q.y) ** 2 + (p.z - q.z) ** 2 }))
        .filter(({ j }) => j !== i && pts[j].mesh)
        .sort((a, b) => a.d - b.d)
        .slice(0, 3)
        .forEach(({ j }) => i < j && edges.push([i, j]));
    });

    // Colour along the berry: indigo on the mesh side, through violet, to blue on the loose side.
    const colour = (x: number, a: number) => {
      const t = (x + 1) / 2;
      const stops = [
        [129, 140, 248],
        [167, 139, 250],
        [96, 165, 250],
      ];
      const k = t < 0.55 ? t / 0.55 : (t - 0.55) / 0.45;
      const [c0, c1] = t < 0.55 ? [stops[0], stops[1]] : [stops[1], stops[2]];
      const c = c0.map((v, i) => Math.round(v + (c1[i] - v) * k));
      return `rgba(${c[0]},${c[1]},${c[2]},${a})`;
    };

    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let tiltX = 0;
    let tiltY = 0;
    let aimX = 0;
    let aimY = 0;
    const onMove = (e: PointerEvent) => {
      const b = canvas.getBoundingClientRect();
      aimY = ((e.clientX - b.left) / b.width - 0.5) * 0.6;
      aimX = ((e.clientY - b.top) / b.height - 0.5) * 0.4;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !reduce) raf = requestAnimationFrame(frame);
    });
    io.observe(canvas);

    const start = performance.now();
    function draw(time: number) {
      ctx!.clearRect(0, 0, w, h);
      const R = Math.min(w, h) * 0.34;
      const cx = w / 2;
      const cy = h * 0.56;
      // Turn back and forth so the mesh side stays in view, as on the logo.
      const yaw = -0.35 + Math.sin(time * 0.00035) * 0.75 + tiltY;
      const pitch = 0.18 + tiltX;
      const cyw = Math.cos(yaw);
      const syw = Math.sin(yaw);
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);
      const proj = pts.map((p) => {
        const x1 = p.x * cyw + p.z * syw;
        const z1 = -p.x * syw + p.z * cyw;
        const y2 = p.y * cp - z1 * sp;
        const z2 = p.y * sp + z1 * cp;
        const s = 1 / (1 - z2 * 0.28);
        return { sx: cx + x1 * R * s, sy: cy - y2 * R * s, z: z2, s };
      });

      // Soft glow behind the berry.
      const glow = ctx!.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.6);
      glow.addColorStop(0, 'rgba(124,58,237,0.28)');
      glow.addColorStop(1, 'rgba(124,58,237,0)');
      ctx!.fillStyle = glow;
      ctx!.fillRect(0, 0, w, h);

      ctx!.lineWidth = 1.2;
      for (const [a, b] of edges) {
        const za = (proj[a].z + proj[b].z) / 2;
        ctx!.strokeStyle = colour(pts[a].x, 0.12 + Math.max(0, za + 0.4) * 0.45);
        ctx!.beginPath();
        ctx!.moveTo(proj[a].sx, proj[a].sy);
        ctx!.lineTo(proj[b].sx, proj[b].sy);
        ctx!.stroke();
      }
      const order = proj.map((_, i) => i).sort((a, b) => proj[a].z - proj[b].z);
      for (const i of order) {
        const p = pts[i];
        const q = proj[i];
        const front = (q.z + 1) / 2;
        // Loose dots shrink toward the edge of the berry, like the logo's scattered side.
        const size = (p.mesh ? 4.2 : 3.4 - (p.x - 0.15) * 2) * q.s * (R / 150);
        ctx!.fillStyle = colour(p.x, 0.25 + front * 0.75);
        ctx!.beginPath();
        ctx!.arc(q.sx, q.sy, Math.max(0.8, size), 0, Math.PI * 2);
        ctx!.fill();
      }

      // Stem and leaf, swaying a little with the turn.
      const topX = cx;
      const topY = cy - R * 1.02;
      const sway = Math.sin(time * 0.0009) * 0.06 + tiltY * 0.4;
      ctx!.save();
      ctx!.translate(topX, topY);
      ctx!.rotate(sway);
      ctx!.strokeStyle = '#c7d2fe';
      ctx!.lineWidth = R * 0.07;
      ctx!.lineCap = 'round';
      ctx!.beginPath();
      ctx!.moveTo(0, 0);
      ctx!.bezierCurveTo(-R * 0.02, -R * 0.22, -R * 0.08, -R * 0.36, -R * 0.2, -R * 0.48);
      ctx!.stroke();
      const leaf = ctx!.createLinearGradient(R * 0.05, -R * 0.05, R * 0.75, -R * 0.45);
      leaf.addColorStop(0, '#7c3aed');
      leaf.addColorStop(1, '#c4b5fd');
      ctx!.fillStyle = leaf;
      ctx!.beginPath();
      ctx!.moveTo(R * 0.06, -R * 0.08);
      ctx!.bezierCurveTo(R * 0.18, -R * 0.4, R * 0.5, -R * 0.52, R * 0.82, -R * 0.48);
      ctx!.bezierCurveTo(R * 0.7, -R * 0.2, R * 0.4, -R * 0.02, R * 0.06, -R * 0.08);
      ctx!.fill();
      ctx!.restore();
    }

    function frame(now: number) {
      tiltX += (aimX - tiltX) * 0.05;
      tiltY += (aimY - tiltY) * 0.05;
      draw(now - start);
      if (visible && !reduce) raf = requestAnimationFrame(frame);
    }
    draw(0);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
