import BerryMark from './BerryMark';

/** Mark plus wordmark: "DATA" in the base color, "BERY" in the brand purple. */
export default function Logo({ className = '', tone = 'light' }: { className?: string; tone?: 'light' | 'dark' }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <BerryMark tone={tone} className="h-9 w-9 -translate-y-0.5" />
      <span className="font-display text-[1.15rem] font-semibold tracking-[0.14em]">
        <span className={tone === 'dark' ? 'text-white' : 'text-[#1e1b4b]'}>DATA</span>
        <span
          className={`bg-gradient-to-r bg-clip-text text-transparent ${
            tone === 'dark' ? 'from-violet-300 to-indigo-300' : 'from-violet-700 to-purple-600'
          }`}
        >
          BERY
        </span>
      </span>
    </span>
  );
}
