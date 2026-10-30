import { motion } from 'framer-motion';
import { ArrowUpRight, Clock3, FileSearch, PenLine } from 'lucide-react';
import SignalGlobe from './globe/SignalGlobe';
import { signalKindLabel, signalTicker } from './globe/signals';
import { brand } from '../brand';

const proofPoints = [
  { icon: FileSearch, label: 'Evidence on every account' },
  { icon: Clock3, label: 'Timed to real buying windows' },
  { icon: PenLine, label: 'Outreach written from the signal' },
];

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export default function Hero() {
  return (
    <section id="top" className="px-2 pt-2 sm:px-4 sm:pt-4">
      <div className="relative mx-auto flex max-w-[1600px] flex-col overflow-hidden rounded-[28px] bg-[#050b18] ring-1 ring-white/10 xl:block xl:h-[clamp(700px,calc(100svh-96px),860px)]">
        {/* Ambient light */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_72%_45%,rgba(27,95,170,0.35),transparent_70%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_10%_0%,rgba(186,117,23,0.14),transparent_70%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_30%_40%,black,transparent_70%)]" />

        {/* Globe stage: full-bleed behind the copy on wide screens, its own block below the copy otherwise. */}
        <div className="relative order-2 h-[680px] sm:h-[720px] xl:absolute xl:inset-0 xl:h-auto">
          <SignalGlobe />
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[60%] bg-[linear-gradient(to_right,#050b18_0%,#050b18_38%,rgba(5,11,24,0.82)_62%,transparent_100%)] xl:block" />

        <div className="relative z-10 order-1 px-6 pt-14 sm:px-10 sm:pt-20 xl:flex xl:h-full xl:max-w-[640px] xl:flex-col xl:justify-center xl:px-16 xl:pb-16 xl:pt-0">
          <motion.div {...fadeUp(0)} className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-300 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-300" />
            </span>
            <span className="text-xs font-medium tracking-wide text-sky-100/80">Signal-based account intelligence</span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.08)}
            className="mt-6 text-[2.6rem] font-semibold leading-[1.04] tracking-[-0.03em] text-white sm:text-6xl xl:text-[4.1rem]"
          >
            Know who's ready to buy.{' '}
            <span className="bg-gradient-to-r from-amber-200 via-amber-300 to-sky-200 bg-clip-text text-transparent">
              And exactly why.
            </span>
          </motion.h1>

          <motion.p {...fadeUp(0.16)} className="mt-6 max-w-xl text-base leading-relaxed text-sky-100/70 sm:text-lg">
            {brand.name} tracks hiring, funding, leadership moves, tech changes and filings, then hands your team the
            accounts worth targeting now. Each one comes with its evidence, its timing and the outreach to act on it.
            No vague lists.
          </motion.p>

          <motion.div {...fadeUp(0.24)} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#contact"
              className="group inline-flex items-center justify-between gap-4 rounded-full bg-white py-1.5 pl-6 pr-1.5 font-semibold text-navy-900 shadow-[0_10px_40px_-10px_rgba(255,200,120,0.5)] transition-transform hover:-translate-y-0.5"
            >
              Book a demo
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-900 text-white transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight className="h-5 w-5" />
              </span>
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3.5 font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/5"
            >
              See how it works
            </a>
          </motion.div>

          <motion.ul {...fadeUp(0.32)} className="mt-10 grid gap-3 sm:grid-cols-3 sm:gap-4">
            {proofPoints.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2.5 text-sm text-sky-100/65">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                  <Icon className="h-3.5 w-3.5 text-amber-200" />
                </span>
                {label}
              </li>
            ))}
          </motion.ul>
        </div>

        <SignalTicker />
      </div>
    </section>
  );
}

function SignalTicker() {
  const items = [...signalTicker, ...signalTicker];
  return (
    <div className="relative z-10 order-3 flex items-center border-t border-white/10 bg-[#050b18]/80 xl:absolute xl:inset-x-0 xl:bottom-0">
      <div className="hidden shrink-0 items-center gap-2 border-r border-white/10 px-5 py-4 font-mono text-[10px] tracking-[0.2em] text-sky-100/60 sm:flex">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
        INCOMING SIGNALS
      </div>
      <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <div className="flex w-max max-w-none animate-[marquee_60s_linear_infinite] gap-8 py-4 pl-6 hover:[animation-play-state:paused]">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2.5 whitespace-nowrap text-[13px]" aria-hidden={i >= signalTicker.length}>
              <span className="rounded-md border border-amber-200/20 bg-amber-200/[0.06] px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-amber-200/90">
                {signalKindLabel[item.kind]}
              </span>
              <span className="text-white/80">{item.text}</span>
              <span className="text-sky-100/40">{item.place}</span>
              <span className="ml-6 h-1 w-1 rounded-full bg-white/15" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
