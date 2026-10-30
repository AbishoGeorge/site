import { forwardRef, useEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion } from 'framer-motion';
import {
  Briefcase,
  Building2,
  CheckCircle2,
  Cpu,
  FileText,
  Landmark,
  MapPin,
  Mic,
  Scale,
  Send,
  ShieldCheck,
  Sparkles,
  UserPlus,
  type LucideIcon,
} from 'lucide-react';
import { GlobeEngine, type GlobePhase } from './GlobeEngine';
import { accountSignals, signalKindLabel, type AccountSignal, type SignalKind } from './signals';

const kindIcon: Record<SignalKind, LucideIcon> = {
  hiring: Briefcase,
  funding: Landmark,
  leadership: UserPlus,
  tech: Cpu,
  rfp: FileText,
  expansion: Building2,
  regulatory: Scale,
  earnings: Mic,
};

function statusText(phase: GlobePhase, s: AccountSignal | undefined) {
  if (!s || phase === 'intro') return 'Initializing signal scan';
  switch (phase) {
    case 'scan':
      return `Scanning ${s.country === 'United States of America' ? 'United States' : s.country}`;
    case 'lock':
      return `Signal detected · ${s.city}`;
    case 'reveal':
      return 'Verifying evidence';
    default:
      return 'Account qualified · added to pipeline';
  }
}

export default function SignalGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chipRef = useRef<HTMLDivElement>(null);
  const coordsRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [{ phase, index }, setView] = useState<{ phase: GlobePhase; index: number }>({ phase: 'intro', index: -1 });
  // Evidence rows fill in as the engine reports each arc reaching the pin.
  const [landed, setLanded] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const engine = new GlobeEngine({
      canvas,
      signals: accountSignals,
      onPhase: (p, i) => setView({ phase: p, index: i }),
      onEvidence: setLanded,
      getCard: () => cardRef.current,
      chip: chipRef.current,
      coords: coordsRef.current,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    });
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? engine.start() : engine.stop()));
    io.observe(canvas);
    return () => {
      io.disconnect();
      engine.destroy();
    };
  }, []);

  const signal = index >= 0 ? accountSignals[index] : undefined;
  const showCard = !!signal && (phase === 'reveal' || phase === 'ready');
  const live = phase === 'lock' || phase === 'reveal' || phase === 'ready';

  return (
    <div className="absolute inset-0">
      <p className="sr-only">
        Animated example: a globe turns and zooms into one country at a time, highlights an example account there, and
        shows the buying signals that make it worth contacting.
      </p>
      <canvas ref={canvasRef} className="absolute inset-0 block" aria-hidden="true" />

      {/* HUD */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-4 top-4 flex items-start justify-between gap-3 sm:inset-x-6 sm:top-6 xl:left-[54%] xl:right-8">
        <div className="hidden sm:block font-mono text-[10px] leading-relaxed tracking-[0.18em] text-sky-200/60">
          <div className="flex items-center gap-2 text-sky-100/80">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            LIVE SIGNAL MAP
          </div>
          <span ref={coordsRef} className="tabular-nums">
            --
          </span>
        </div>
        <div className="mx-auto sm:mx-0 flex items-center gap-2 rounded-full border border-white/10 bg-[#0a1630]/70 px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] text-sky-100/80 shadow-lg shadow-black/20">
          <span
            className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${
              phase === 'ready' || phase === 'close' ? 'bg-emerald-400' : live ? 'bg-amber-300' : 'bg-sky-400 animate-pulse'
            }`}
          />
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={statusText(phase, signal)}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              className="uppercase whitespace-nowrap"
            >
              {statusText(phase, signal)}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* City label that rides on top of the pin's light beam. */}
      <div
        ref={chipRef}
        className="pointer-events-none absolute left-0 top-0 opacity-0 will-change-transform"
        aria-hidden="true"
      >
        <div className="-translate-x-1/2 -translate-y-full">
          <div className="flex items-center gap-2 whitespace-nowrap rounded-full border border-amber-200/30 bg-[#0b1630]/85 py-1 pl-1 pr-3 shadow-[0_0_24px_rgba(255,180,80,0.25)]">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-amber-500">
              <Sparkles className="h-3 w-3 text-[#2a1600]" />
            </span>
            <span className="text-[11px] font-semibold tracking-[0.08em] text-white">
              {signal ? `${signal.city.toUpperCase()}, ${signal.countryCode}` : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Account card */}
      <div aria-hidden="true" className="absolute inset-x-3 bottom-3 sm:inset-x-auto sm:bottom-6 sm:left-1/2 sm:w-[400px] sm:-translate-x-1/2 xl:bottom-auto xl:left-auto xl:right-[3.5%] xl:top-[18%] xl:w-[360px] xl:translate-x-0">
        <AnimatePresence mode="wait">
          {showCard && signal && (
            <SignalCard key={signal.id} ref={cardRef} signal={signal} ready={phase === 'ready'} arrived={landed} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}


interface SignalCardProps {
  signal: AccountSignal;
  ready: boolean;
  /** Evidence rows whose arc has reached the pin. */
  arrived: number;
}

const SignalCard = forwardRef<HTMLDivElement, SignalCardProps>(function SignalCard({ signal, ready, arrived }, ref) {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18, scale: 0.96, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -12, scale: 0.97, filter: 'blur(6px)' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#081329]/85 p-4 text-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] backdrop-blur-md sm:p-5"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/60 to-transparent" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-electric-500/25 blur-3xl" />

      <div className="relative flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-electric-400 to-electric-700 text-sm font-bold tracking-wide shadow-inner shadow-white/20">
          {signal.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[15px] font-semibold leading-tight">{signal.company}</div>
          <div className="mt-0.5 truncate text-xs text-sky-100/55">
            {signal.industry} · {signal.size}
          </div>
          <div className="mt-1.5 flex items-center gap-1 text-[11px] text-sky-100/70">
            <MapPin className="h-3 w-3 text-amber-300" />
            {signal.city}, {signal.region} · {signal.countryCode}
          </div>
        </div>
        <ScoreRing score={signal.score} ready={ready} />
      </div>

      <div className="relative mt-4 flex items-center justify-between border-t border-white/10 pt-3">
        <span className="font-mono text-[10px] tracking-[0.2em] text-sky-100/50">EVIDENCE</span>
        <span className="font-mono text-[10px] tracking-[0.12em] text-sky-100/60 tabular-nums">
          {arrived}/{signal.evidence.length} VERIFIED
        </span>
      </div>

      <ul className="relative mt-2 space-y-1.5">
        {signal.evidence.map((ev, i) => (
          <EvidenceRow key={ev.text} evidence={ev} arrived={i < arrived} />
        ))}
      </ul>

      <div className="relative mt-3 h-[66px] overflow-hidden rounded-xl border border-amber-300/20 bg-amber-300/[0.07] px-3 py-2.5">
        <div className="font-mono text-[9px] tracking-[0.2em] text-amber-200/80">WHY NOW</div>
        <AnimatePresence initial={false} mode="wait">
          {ready ? (
            <motion.p
              key="why"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="mt-0.5 text-[12.5px] leading-snug text-amber-50/90"
            >
              {signal.whyNow}
            </motion.p>
          ) : (
            <motion.p key="wait" exit={{ opacity: 0 }} className="mt-1 flex items-center gap-2 text-[12px] text-amber-100/40">
              <span className="h-3 w-3 animate-spin rounded-full border border-amber-200/40 border-t-transparent" />
              Weighing timing across sources…
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="relative mt-3 flex items-center justify-between gap-2">
        <span className={`flex items-center gap-1.5 text-[11px] transition-colors duration-500 ${ready ? 'text-emerald-300/90' : 'text-sky-100/35'}`}>
          <ShieldCheck className="h-3.5 w-3.5" />
          {ready ? 'Every claim sourced' : 'Cross-checking sources'}
        </span>
        <motion.span
          initial={false}
          animate={{ opacity: ready ? 1 : 0.35, scale: ready ? 1 : 0.96 }}
          transition={{ duration: 0.4, delay: ready ? 0.3 : 0 }}
          className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-navy-900"
        >
          <Send className="h-3 w-3" />
          {ready ? 'Outreach drafted' : 'Drafting outreach'}
        </motion.span>
      </div>
    </motion.div>
  );
});

function EvidenceRow({ evidence, arrived }: { evidence: AccountSignal['evidence'][number]; arrived: boolean }) {
  const Icon = kindIcon[evidence.kind];
  return (
    <li className="relative h-[54px] overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03]">
      <AnimatePresence initial={false}>
        {arrived ? (
          <motion.div
            key="row"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex items-center gap-2.5 px-2.5"
          >
            <motion.span
              initial={{ boxShadow: '0 0 0 0 rgba(255,190,100,0.7)' }}
              animate={{ boxShadow: '0 0 0 8px rgba(255,190,100,0)' }}
              transition={{ duration: 0.8 }}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-300/10 text-amber-200"
            >
              <Icon className="h-4 w-4" />
            </motion.span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-sky-100/50">
                {signalKindLabel[evidence.kind]}
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              </div>
              <div className="truncate text-[12.5px] leading-snug text-white/90">{evidence.text}</div>
              <div className="truncate text-[10.5px] text-sky-100/40">
                {evidence.source} · {evidence.age}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="skeleton"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center gap-2.5 px-2.5"
          >
            <span className="h-8 w-8 shrink-0 rounded-lg bg-white/[0.06]" />
            <div className="flex-1 space-y-1.5">
              <div className="h-2 w-1/3 rounded bg-white/[0.07]" />
              <div className="h-2.5 w-4/5 rounded bg-white/[0.07]" />
            </div>
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

function ScoreRing({ score, ready }: { score: number; ready: boolean }) {
  const [value, setValue] = useState(0);
  const r = 19;
  const c = 2 * Math.PI * r;

  useEffect(() => {
    if (!ready) return;
    const controls = animate(0, score, { duration: 1.1, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setValue(Math.round(v)) });
    return () => controls.stop();
  }, [ready, score]);

  return (
    <div className="relative h-12 w-12 shrink-0">
      <svg viewBox="0 0 48 48" className={`h-12 w-12 -rotate-90 ${ready ? '' : 'animate-spin [animation-duration:2.4s]'}`}>
        <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
        <circle
          cx="24"
          cy="24"
          r={r}
          fill="none"
          stroke="url(#score-grad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={ready ? c * (1 - value / 100) : c * 0.78}
        />
        <defs>
          <linearGradient id="score-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fcd38d" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className="text-[13px] font-bold tabular-nums">{ready ? value : '··'}</span>
        <span className="mt-0.5 text-[7px] font-semibold tracking-[0.14em] text-sky-100/50">INTENT</span>
      </div>
    </div>
  );
}
