import { useId, useMemo } from 'react';
import type { CaseVisual, LogoMark } from '../../content/caseStudies';

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

/** Generated artwork that stands in for a photo on each story card. */
export function CaseArt({ visual, className = '' }: { visual: CaseVisual; className?: string }) {
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
      case 'orbit':
        return <OrbitArt id={uid} />;
    }
  }, [visual, uid]);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      {body}
      {/* Darken the top and bottom so the logo and text stay readable on any artwork. */}
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

function OrbitArt({ id }: { id: string }) {
  const rand = seeded(23);
  const stars = Array.from({ length: 70 }, () => [rand() * W, rand() * H * 0.7, rand()]);
  return (
    <>
      <rect width={W} height={H} fill="#0c1a3d" />
      <defs>
        <radialGradient id={`${id}-planet`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="55%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#0b1a4a" />
        </radialGradient>
      </defs>
      {stars.map(([x, y, a], k) => (
        <circle key={k} cx={x} cy={y} r={a > 0.85 ? 1.6 : 0.9} fill="#e0e7ff" opacity={0.25 + a * 0.6} />
      ))}
      <ellipse cx="290" cy="420" rx="250" ry="70" fill="none" stroke="#93c5fd" strokeOpacity="0.35" transform="rotate(-14 290 420)" />
      <circle cx="300" cy="470" r="220" fill={`url(#${id}-planet)`} />
      <ellipse cx="290" cy="420" rx="250" ry="70" fill="none" stroke="#bfdbfe" strokeOpacity="0.55" strokeDasharray="3 7" transform="rotate(-14 290 420)" />
      <circle cx="80" cy="455" r="5" fill="#fdba74" />
      <circle cx="80" cy="455" r="12" fill="none" stroke="#fdba74" strokeOpacity="0.45" />
    </>
  );
}

/** A simple invented logo mark for each sample company. */
export function LogoGlyph({ mark, className = 'h-7 w-7' }: { mark: LogoMark; className?: string }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <svg viewBox="0 0 28 28" className={className} aria-hidden="true">
      {mark === 'split' && (
        <>
          <path d="M14 3a11 11 0 0 0 0 22" {...common} />
          <path d="M17 6a8 8 0 0 1 0 16" {...common} />
        </>
      )}
      {mark === 'triangle' && (
        <>
          <path d="M14 3 25 23H3Z" {...common} />
          <circle cx="14" cy="16" r="2" fill="currentColor" />
        </>
      )}
      {mark === 'hex' && <path d="M14 2.5 24 8.25v11.5L14 25.5 4 19.75V8.25Z" {...common} />}
      {mark === 'dot' && (
        <>
          <circle cx="14" cy="14" r="10.5" {...common} />
          <circle cx="14" cy="14" r="4" fill="currentColor" />
        </>
      )}
      {mark === 'wave' && (
        <>
          <path d="M3 10c3.5-4 7.5-4 11 0s7.5 4 11 0" {...common} />
          <path d="M3 18c3.5-4 7.5-4 11 0s7.5 4 11 0" {...common} />
        </>
      )}
      {mark === 'ring' && <path d="M22 9.5A9.5 9.5 0 1 1 14 4.5" {...common} />}
    </svg>
  );
}
