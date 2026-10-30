import { brand } from '../brand';

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
        <defs>
          <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#4338ca" />
          </linearGradient>
        </defs>
        <circle cx="16" cy="16" r="15" fill="url(#logo-g)" />
        <ellipse cx="16" cy="16" rx="6.5" ry="15" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
        <path d="M1.5 12h29M1.5 20h29" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        <circle cx="20.5" cy="11.5" r="3" fill="#fb923c" />
        <circle cx="20.5" cy="11.5" r="5.5" fill="none" stroke="#fb923c" strokeOpacity="0.5" strokeWidth="1" />
      </svg>
      <span className="text-lg font-bold tracking-tight">{brand.name}</span>
    </span>
  );
}
