import { useId, useMemo } from 'react';
import type { IndustryVisual } from '../../content/industries';

/** Small deterministic random generator, so each artwork looks the same on every visit. */
function seeded(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const W = 400;
const H = 520;

/** Generated artwork for each industry, used on the use case cards and pages. */
export function IndustryArt({ visual, className = '' }: { visual: IndustryVisual; className?: string }) {
  const uid = useId().replace(/:/g, '');
  const body = useMemo(() => {
    switch (visual) {
      case 'map':
        return <MapArt id={uid} />;
      case 'skyline':
        return <SkylineArt id={uid} />;
      case 'radar':
        return <RadarArt id={uid} />;
      case 'waves':
        return <WavesArt id={uid} />;
      case 'bars':
        return <BarsArt id={uid} />;
      case 'circuit':
        return <CircuitArt id={uid} />;
      case 'pulse':
        return <PulseArt id={uid} />;
      case 'blueprint':
        return <BlueprintArt id={uid} />;
    }
  }, [visual, uid]);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      {body}
      {/* Darken the top and bottom so the text stays readable on any artwork. */}
      <defs>
        <linearGradient id={`${uid}-shade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#020617" stopOpacity="0.45" />
          <stop offset="22%" stopColor="#020617" stopOpacity="0" />
          <stop offset="48%" stopColor="#020617" stopOpacity="0" />
          <stop offset="100%" stopColor="#020617" stopOpacity="0.88" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${uid}-shade)`} />
    </svg>
  );
}

function MapArt({ id }: { id: string }) {
  const dots: [number, number, number][] = [];
  for (let i = 0; i < 26; i++) {
    for (let j = 0; j < 34; j++) {
      const x = 8 + i * 15.5;
      const y = 6 + j * 15.5;
      const n = Math.sin(x * 0.03) + Math.cos(y * 0.025) + Math.sin((x + y) * 0.018) + Math.cos((x - y) * 0.012);
      if (n > 0.55) dots.push([x, y, Math.min(1, (n - 0.55) * 1.4)]);
    }
  }
  const hot: [number, number][] = [
    [248, 186],
    [263, 196],
    [252, 207],
    [238, 199],
    [271, 181],
  ];
  return (
    <>
      <rect width={W} height={H} fill="#16133a" />
      <defs>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0%" stopColor="#fb923c" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#fb923c" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-sky`} cx="0.7" cy="0.3" r="0.8">
          <stop offset="0%" stopColor="#4338ca" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#16133a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}-sky)`} />
      {dots.map(([x, y, a], k) => (
        <circle key={k} cx={x} cy={y} r={1.7} fill="#a5b4fc" opacity={0.25 + 0.5 * a} />
      ))}
      <path d="M255 195 Q 170 90 92 150" fill="none" stroke="#c4b5fd" strokeWidth="1.5" strokeOpacity="0.7" />
      <path d="M255 195 Q 330 280 330 360" fill="none" stroke="#c4b5fd" strokeWidth="1.5" strokeOpacity="0.5" />
      <circle cx="92" cy="150" r="3.5" fill="#c4b5fd" />
      <circle cx="330" cy="360" r="3.5" fill="#c4b5fd" />
      <circle cx="255" cy="195" r="60" fill={`url(#${id}-glow)`} />
      {hot.map(([x, y], k) => (
        <circle key={k} cx={x} cy={y} r={3} fill="#fdba74" />
      ))}
      <circle cx="255" cy="195" r="16" fill="none" stroke="#fdba74" strokeOpacity="0.6" />
      <circle cx="255" cy="195" r="30" fill="none" stroke="#fdba74" strokeOpacity="0.3" />
    </>
  );
}

function SkylineArt({ id }: { id: string }) {
  const rand = seeded(7);
  const buildings: { x: number; w: number; h: number }[] = [];
  let x = -10;
  while (x < W + 10) {
    const w = 26 + rand() * 34;
    buildings.push({ x, w, h: 130 + rand() * 210 });
    x += w + 3;
  }
  return (
    <>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e1033" />
          <stop offset="55%" stopColor="#5b2245" />
          <stop offset="85%" stopColor="#c2410c" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}-sky)`} />
      <circle cx="285" cy="330" r="64" fill="#fdba74" opacity="0.55" />
      {buildings.map((b, k) => {
        const top = H - b.h;
        const wins: [number, number][] = [];
        for (let wy = top + 12; wy < H - 10; wy += 13) {
          for (let wx = b.x + 6; wx < b.x + b.w - 6; wx += 9) if (rand() < 0.22) wins.push([wx, wy]);
        }
        return (
          <g key={k}>
            <rect x={b.x} y={top} width={b.w} height={b.h} fill="#140a24" />
            {wins.map(([wx, wy], i) => (
              <rect key={i} x={wx} y={wy} width={4} height={6} fill="#fcd34d" opacity={0.75} />
            ))}
          </g>
        );
      })}
    </>
  );
}

function RadarArt({ id }: { id: string }) {
  const cx = 200;
  const cy = 210;
  return (
    <>
      <rect width={W} height={H} fill="#062a28" />
      <defs>
        <linearGradient id={`${id}-sweep`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0" />
          <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.45" />
        </linearGradient>
      </defs>
      {[45, 90, 135, 180, 225].map((r) => (
        <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="#5eead4" strokeOpacity="0.18" />
      ))}
      <line x1={cx - 230} y1={cy} x2={cx + 230} y2={cy} stroke="#5eead4" strokeOpacity="0.12" />
      <line x1={cx} y1={cy - 230} x2={cx} y2={cy + 230} stroke="#5eead4" strokeOpacity="0.12" />
      <g className="animate-[spin_7s_linear_infinite]" style={{ transformOrigin: `${cx}px ${cy}px`, transformBox: 'view-box' }}>
        <path d={`M${cx} ${cy} L${cx + 225} ${cy} A225 225 0 0 0 ${cx + 159} ${cy - 159} Z`} fill={`url(#${id}-sweep)`} />
      </g>
      {[
        [120, 150, '#5eead4'],
        [265, 120, '#5eead4'],
        [300, 255, '#fb923c'],
        [150, 300, '#5eead4'],
      ].map(([x, y, c], k) => (
        <g key={k}>
          <circle cx={x as number} cy={y as number} r={4} fill={c as string} />
          <circle cx={x as number} cy={y as number} r={11} fill="none" stroke={c as string} strokeOpacity="0.4" />
        </g>
      ))}
    </>
  );
}

function WavesArt({ id }: { id: string }) {
  const lines = Array.from({ length: 11 }, (_, k) => {
    const y0 = 90 + k * 30;
    const amp = 14 + (k % 4) * 7;
    const pts: string[] = [];
    for (let x = -10; x <= W + 10; x += 10) pts.push(`${x},${(y0 + amp * Math.sin(x * 0.018 + k * 0.7)).toFixed(1)}`);
    return { pts: pts.join(' '), k };
  });
  return (
    <>
      <rect width={W} height={H} fill="#24104f" />
      <defs>
        <radialGradient id={`${id}-glow`} cx="0.2" cy="0.25" r="0.9">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#24104f" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}-glow)`} />
      {lines.map(({ pts, k }) => (
        <polyline
          key={k}
          points={pts}
          fill="none"
          stroke={k === 5 ? '#fb923c' : '#c4b5fd'}
          strokeWidth={k === 5 ? 2.5 : 1.2}
          strokeOpacity={k === 5 ? 0.95 : 0.18 + (k % 3) * 0.08}
        />
      ))}
    </>
  );
}

function BarsArt({ id }: { id: string }) {
  const rand = seeded(11);
  const bars = Array.from({ length: 14 }, (_, k) => 60 + k * 15 + rand() * 40);
  const bw = 20;
  const gap = 7;
  const x0 = 16;
  const base = 400;
  return (
    <>
      <rect width={W} height={H} fill="#0b1224" />
      <defs>
        <linearGradient id={`${id}-bar`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#4338ca" stopOpacity="0.25" />
        </linearGradient>
        <linearGradient id={`${id}-hot`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fdba74" />
          <stop offset="100%" stopColor="#ea580c" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      {[100, 160, 220, 280, 340, 400].map((y) => (
        <line key={y} x1="0" y1={y} x2={W} y2={y} stroke="#94a3b8" strokeOpacity="0.1" />
      ))}
      {bars.map((h, k) => (
        <rect
          key={k}
          x={x0 + k * (bw + gap)}
          y={base - h}
          width={bw}
          height={h}
          rx={4}
          fill={k >= bars.length - 3 ? `url(#${id}-hot)` : `url(#${id}-bar)`}
        />
      ))}
      <polyline
        points={bars.map((h, k) => `${x0 + k * (bw + gap) + bw / 2},${base - h - 14}`).join(' ')}
        fill="none"
        stroke="#e0e7ff"
        strokeOpacity="0.6"
        strokeWidth="1.5"
      />
    </>
  );
}

function CircuitArt({ id }: { id: string }) {
  const rand = seeded(31);
  const step = 26;
  const traces = Array.from({ length: 24 }, (_, k) => {
    let x = Math.round((rand() * W) / step) * step;
    let y = Math.round((rand() * H * 0.62) / step) * step;
    let d = `M${x} ${y}`;
    let across = rand() > 0.5;
    const turns = 3 + Math.floor(rand() * 4);
    for (let t = 0; t < turns; t++) {
      const len = step * (1 + Math.floor(rand() * 3));
      if (across) x += rand() > 0.5 ? len : -len;
      else y += len;
      d += ` L${x} ${y}`;
      across = !across;
    }
    return { d, x, y, hot: k === 9 };
  });
  const hot = traces.find((t) => t.hot)!;
  return (
    <>
      <rect width={W} height={H} fill="#061a2e" />
      <defs>
        <radialGradient id={`${id}-glow`} cx="0.65" cy="0.3" r="0.75">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#061a2e" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}-glow)`} />
      {traces.map((t, k) => (
        <g key={k}>
          <path
            d={t.d}
            fill="none"
            stroke={t.hot ? '#fb923c' : '#7dd3fc'}
            strokeOpacity={t.hot ? 0.95 : 0.2 + (k % 4) * 0.07}
            strokeWidth={t.hot ? 2 : 1.3}
            strokeLinejoin="round"
          />
          <circle cx={t.x} cy={t.y} r={t.hot ? 4 : 2.6} fill={t.hot ? '#fdba74' : '#bae6fd'} opacity={t.hot ? 1 : 0.6} />
        </g>
      ))}
      <circle cx={hot.x} cy={hot.y} r={13} fill="none" stroke="#fdba74" strokeOpacity="0.5" />
      <circle cx={hot.x} cy={hot.y} r={24} fill="none" stroke="#fdba74" strokeOpacity="0.25" />
    </>
  );
}

function PulseArt({ id }: { id: string }) {
  const base = 205;
  let d = `M-10 ${base}`;
  for (let x0 = -10; x0 < W + 10; x0 += 140) {
    d +=
      ` L${x0 + 30} ${base} Q${x0 + 38} ${base - 12} ${x0 + 46} ${base} L${x0 + 56} ${base}` +
      ` L${x0 + 61} ${base + 14} L${x0 + 68} ${base - 72} L${x0 + 75} ${base + 26} L${x0 + 81} ${base}` +
      ` L${x0 + 96} ${base} Q${x0 + 108} ${base - 20} ${x0 + 120} ${base} L${x0 + 140} ${base}`;
  }
  const peak: [number, number] = [-10 + 140 * 2 + 68, base - 72];
  return (
    <>
      <rect width={W} height={H} fill="#032321" />
      <defs>
        <radialGradient id={`${id}-glow`} cx="0.8" cy="0.35" r="0.7">
          <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#032321" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}-glow)`} />
      {Array.from({ length: 16 }, (_, k) => (
        <line key={`v${k}`} x1={k * 26} y1={0} x2={k * 26} y2={H} stroke="#5eead4" strokeOpacity="0.07" />
      ))}
      {Array.from({ length: 21 }, (_, k) => (
        <line key={`h${k}`} x1={0} y1={k * 26} x2={W} y2={k * 26} stroke="#5eead4" strokeOpacity="0.07" />
      ))}
      <path d={d} fill="none" stroke="#2dd4bf" strokeOpacity="0.18" strokeWidth="9" strokeLinejoin="round" />
      <path d={d} fill="none" stroke="#99f6e4" strokeWidth="2" strokeLinejoin="round" />
      <circle cx={peak[0]} cy={peak[1]} r={4.5} fill="#fdba74" />
      <circle cx={peak[0]} cy={peak[1]} r={13} fill="none" stroke="#fdba74" strokeOpacity="0.45" />
    </>
  );
}

function BlueprintArt({ id }: { id: string }) {
  const line = { fill: 'none', stroke: '#e0f2fe', strokeOpacity: 0.75, strokeWidth: 1.6, strokeLinejoin: 'round' as const };
  return (
    <>
      <rect width={W} height={H} fill="#0a2246" />
      <defs>
        <radialGradient id={`${id}-glow`} cx="0.3" cy="0.3" r="0.8">
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0a2246" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}-glow)`} />
      {Array.from({ length: 21 }, (_, k) => (
        <line key={`v${k}`} x1={k * 20} y1={0} x2={k * 20} y2={H} stroke="#93c5fd" strokeOpacity={k % 5 === 0 ? 0.16 : 0.06} />
      ))}
      {Array.from({ length: 27 }, (_, k) => (
        <line key={`h${k}`} x1={0} y1={k * 20} x2={W} y2={k * 20} stroke="#93c5fd" strokeOpacity={k % 5 === 0 ? 0.16 : 0.06} />
      ))}
      {/* A plant drawn as a technical sketch: sawtooth roof, chimney and a new line marked out in orange. */}
      <path d="M40 300 L40 220 L100 180 L100 220 L160 180 L160 220 L220 180 L220 220 L280 180 L280 300 Z" {...line} />
      <path d="M300 300 L300 120 L326 120 L326 300" {...line} />
      <path d="M296 120 L330 120" {...line} />
      <rect x="60" y="246" width="130" height="34" rx="3" fill="#fb923c" fillOpacity="0.12" stroke="#fb923c" strokeWidth="2" />
      <path d="M40 322 L280 322 M40 316 L40 328 M280 316 L280 328" {...line} strokeOpacity={0.45} />
      <circle cx="340" cy="80" r="30" {...line} strokeDasharray="4 5" strokeOpacity={0.55} />
      <circle cx="340" cy="80" r="11" {...line} strokeOpacity={0.55} />
      <path d="M340 40 L340 120 M300 80 L380 80" {...line} strokeOpacity={0.25} />
    </>
  );
}
