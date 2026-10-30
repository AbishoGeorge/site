import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BadgeCheck,
  Briefcase,
  Building2,
  Cpu,
  FileClock,
  Landmark,
  Mail,
  Mic,
  Phone,
  UserPlus,
  type LucideIcon,
} from 'lucide-react';
import { GlobeEngine, type GlobePhase } from './GlobeEngine';
import { exampleSignals, signalKindLabel, type ExampleSignal, type SignalKind } from './signals';

const kindIcon: Record<SignalKind, LucideIcon> = {
  funding: Landmark,
  hiring: Briefcase,
  leadership: UserPlus,
  expansion: Building2,
  tech: Cpu,
  renewal: FileClock,
  earnings: Mic,
};

const TAG_SLOTS = 3;

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

function statusText(phase: GlobePhase, s: ExampleSignal | undefined) {
  if (!s || phase === 'intro') return 'Scanning for signals';
  if (phase === 'fly') return `Scanning ${s.country === 'United States of America' ? 'United States' : s.country}`;
  return `Signal found · ${s.city}`;
}

export default function SignalGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const tagRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [{ phase, index }, setView] = useState<{ phase: GlobePhase; index: number }>({ phase: 'intro', index: -1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const engine = new GlobeEngine({
      canvas,
      signals: exampleSignals,
      onPhase: (p, i) => setView({ phase: p, index: i }),
      anchor: anchorRef.current,
      tags: tagRefs.current,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    });
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? engine.start() : engine.stop()));
    io.observe(canvas);
    return () => {
      io.disconnect();
      engine.destroy();
    };
  }, []);

  const signal = index >= 0 ? exampleSignals[index] : undefined;
  const showCard = !!signal && phase === 'show';
  const found = phase === 'arrive' || phase === 'show' || phase === 'leave';

  return (
    <div className="absolute inset-0">
      <p className="sr-only">
        Animated example: a globe turns and zooms into one country at a time, and shows one example buying signal
        found there.
      </p>
      <canvas ref={canvasRef} className="absolute inset-0 block" aria-hidden="true" />

      {/* Status */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-4 top-4 flex justify-center sm:inset-x-6 sm:top-6 sm:justify-end xl:left-[54%] xl:right-8"
      >
        <motion.div
          layout
          transition={{ layout: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
          className="flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm shadow-indigo-900/5 backdrop-blur"
        >
          <span className="relative flex h-2 w-2">
            <span
              className={`absolute inline-flex h-full w-full rounded-full opacity-70 ${
                found ? 'bg-orange-400' : 'animate-ping bg-indigo-400'
              }`}
            />
            <span className={`relative inline-flex h-2 w-2 rounded-full ${found ? 'bg-orange-500' : 'bg-indigo-500'}`} />
          </span>
          {/* Crossfade: the outgoing label lifts out of flow so the pill never goes blank. */}
          <span className="relative">
            <AnimatePresence initial={false}>
              <motion.span
                key={statusText(phase, signal)}
                layout="position"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4, position: 'absolute', left: 0, top: 0 }}
                transition={{ duration: 0.3 }}
                className="block whitespace-nowrap"
              >
                {statusText(phase, signal)}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.div>
      </div>

      {/* Short tags at other cities, positioned and filled by the engine. */}
      {Array.from({ length: TAG_SLOTS }, (_, i) => (
        <div
          key={i}
          ref={(el) => {
            tagRefs.current[i] = el;
          }}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 opacity-0 will-change-transform"
        >
          <div className="-translate-x-1/2 -translate-y-full whitespace-nowrap rounded-full border border-violet-100 bg-white/90 px-2.5 py-1 text-[11px] font-medium text-violet-700 shadow-md shadow-indigo-900/10">
            <span data-label />
          </div>
        </div>
      ))}

      {/* The signal card hangs off the pin and travels with it. */}
      <div
        ref={anchorRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 will-change-transform"
      >
        <AnimatePresence>
          {showCard && signal && <SignalCard key={signal.id} signal={signal} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SignalCard({ signal }: { signal: ExampleSignal }) {
  const Icon = kindIcon[signal.kind];
  const words = signal.headline.split(' ');

  return (
    <div className="absolute left-0 top-0 w-[min(320px,calc(100vw-56px))] -translate-x-1/2 pt-9 xl:-translate-y-1/2 xl:translate-x-0 xl:pl-10 xl:pt-0"
    >
      {/* Leader line from the pin to the card. */}
      <motion.span
        initial={{ scaleY: 0, scaleX: 0 }}
        animate={{ scaleY: 1, scaleX: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="absolute left-1/2 top-3 h-6 w-px origin-top bg-gradient-to-b from-orange-400 to-orange-200 xl:left-3 xl:top-1/2 xl:h-px xl:w-7 xl:origin-left xl:bg-gradient-to-r"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -4, transition: { duration: 0.25, ease: 'easeIn' } }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="origin-top rounded-2xl border border-white bg-white/90 p-4 shadow-[0_20px_50px_-12px_rgba(49,46,129,0.28)] ring-1 ring-indigo-100 backdrop-blur-md xl:origin-left"
      >
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
            <Icon className="h-4 w-4" />
          </span>
          <span className="text-xs font-semibold text-orange-600">{signalKindLabel[signal.kind]}</span>
          <span className="ml-auto text-[11px] text-slate-500">{signal.age}</span>
        </div>

        <p className="mt-3 text-[15px] font-semibold leading-snug text-slate-900">
          {words.map((w, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.035 }}
              className="inline-block"
            >
              {w}
              {i < words.length - 1 ? ' ' : ''}
            </motion.span>
          ))}
        </p>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 border-t border-slate-100 pt-3 text-xs text-slate-500">
          <span>{signal.segment}</span>
          <span className="shrink-0 font-medium text-slate-700">
            {signal.city}, {signal.countryCode}
          </span>
        </div>
        <div className="mt-1 text-[11px] text-slate-500">Source: {signal.source}</div>

        {/* Who to reach out to, shown masked as a preview. */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 p-3 ring-1 ring-indigo-100"
        >
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-[11px] font-bold text-white">
              {initials(signal.contact.name)}
            </span>
            <div className="min-w-0 flex-1 leading-tight">
              <div className="text-[13px] font-semibold text-slate-900">{signal.contact.name}</div>
              <div className="text-[11px] leading-snug text-slate-500">{signal.contact.title}</div>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
              <BadgeCheck className="h-3 w-3" />
              Verified
            </span>
          </div>
          <div className="mt-2.5 grid gap-1 text-[12px] text-slate-700">
            <span className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-indigo-500" />
              <span className="font-mono tracking-tight">{signal.contact.email}</span>
            </span>
            <span className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-indigo-500" />
              <span className="font-mono tracking-tight">{signal.contact.phone}</span>
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
