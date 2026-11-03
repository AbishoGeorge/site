import { useId } from 'react';

// The Databery mark: a berry drawn as a data network. The left side is a connected mesh in deep navy and purple;
// the right side breaks into loose dots that fade to blue. Coordinates are in a 100 x 100 box.
const meshNodes: [number, number, number][] = [
  [22, 52, 5.5], [24, 70, 4.8], [32, 83, 4.5], [44, 90, 4], [36, 40, 4.5], [42, 58, 5], [53, 46, 4.2],
  [58, 64, 4.6], [50, 77, 4.2], [67, 48, 3.8], [71, 61, 4], [64, 77, 3.6], [45, 30, 2.6], [55, 33, 2.4],
];
const meshEdges: [number, number][] = [
  [0, 4], [0, 5], [0, 1], [1, 5], [1, 2], [2, 8], [2, 3], [3, 8], [4, 6], [4, 5], [5, 6], [5, 7], [5, 8],
  [6, 9], [6, 13], [7, 8], [7, 10], [7, 9], [8, 11], [10, 11], [9, 10], [4, 12], [12, 13],
];
const looseDots: [number, number, number][] = [
  [73, 37, 2.4], [80, 44, 2.2], [81, 54, 2.6], [87, 50, 1.6], [85, 63, 2], [78, 70, 2.8], [86, 74, 1.8],
  [75, 83, 2.6], [81, 87, 2], [62, 90, 2.8], [69, 94, 2],
];

/** The mark on its own. `tone="dark"` lightens it for dark backgrounds. */
export default function BerryMark({ className = '', tone = 'light' }: { className?: string; tone?: 'light' | 'dark' }) {
  const id = useId().replace(/:/g, '');
  const stops =
    tone === 'dark' ? ['#a5b4fc', '#a78bfa', '#60a5fa'] : ['#1e1b4b', '#6d28d9', '#3b82f6'];
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-g`} x1="16" y1="0" x2="90" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={stops[0]} />
          <stop offset="0.6" stopColor={stops[1]} />
          <stop offset="1" stopColor={stops[2]} />
        </linearGradient>
        <linearGradient id={`${id}-leaf`} x1="55" y1="20" x2="88" y2="4" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={tone === 'dark' ? '#8b5cf6' : '#5b21b6'} />
          <stop offset="1" stopColor={tone === 'dark' ? '#c4b5fd' : '#7c3aed'} />
        </linearGradient>
      </defs>
      <path d="M50 26 C49 17 46 10 40 4" fill="none" stroke={tone === 'dark' ? '#c7d2fe' : '#1e1b4b'} strokeWidth="3.2" strokeLinecap="round" />
      <path d="M53 22 C58 9 72 3 89 4 C84 17 70 25 53 22 Z" fill={`url(#${id}-leaf)`} />
      <g stroke={`url(#${id}-g)`} strokeWidth="1.3">
        {meshEdges.map(([a, b]) => (
          <line key={`${a}-${b}`} x1={meshNodes[a][0]} y1={meshNodes[a][1]} x2={meshNodes[b][0]} y2={meshNodes[b][1]} />
        ))}
      </g>
      <g fill={`url(#${id}-g)`}>
        {meshNodes.map(([x, y, r], i) => (
          <circle key={`n${i}`} cx={x} cy={y} r={r} />
        ))}
        {looseDots.map(([x, y, r], i) => (
          <circle key={`d${i}`} cx={x} cy={y} r={r} />
        ))}
      </g>
    </svg>
  );
}
