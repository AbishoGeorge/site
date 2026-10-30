import { motion } from 'framer-motion';
import { ArrowUpRight, Clock3, FileSearch, PenLine } from 'lucide-react';
import SignalGlobe from './globe/SignalGlobe';
import { exampleSignals, signalKindLabel } from './globe/signals';
import { brand, demoHref, demoLinkProps } from '../brand';

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
    <section id="top" className="scroll-mt-16 px-2 pt-2 sm:px-4 sm:pt-4">
      <div className="relative mx-auto flex max-w-[1600px] flex-col overflow-hidden rounded-[28px] bg-[#f5f6ff] ring-1 ring-indigo-100 xl:block xl:h-[clamp(700px,calc(100svh-96px),860px)]">
        {/* Ambient light */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_72%_48%,rgba(165,180,252,0.55),transparent_70%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_45%_at_100%_0%,rgba(196,181,253,0.45),transparent_70%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_35%_40%_at_0%_100%,rgba(253,186,116,0.22),transparent_70%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(rgba(99,102,241,0.18)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_25%_40%,black,transparent_65%)]" />

        {/* Globe stage: full-bleed behind the copy on wide screens, its own block below the copy otherwise. */}
        <div className="relative order-2 h-[620px] sm:h-[680px] xl:absolute xl:inset-0 xl:h-auto">
          <SignalGlobe />
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[52%] bg-[linear-gradient(to_right,#f5f6ff_0%,rgba(245,246,255,0.9)_45%,transparent_100%)] xl:block" />

        <div className="relative z-10 order-1 px-6 pt-14 sm:px-10 sm:pt-20 xl:flex xl:h-full xl:max-w-[640px] xl:flex-col xl:justify-center xl:px-16 xl:pb-16 xl:pt-0">
          <motion.div
            {...fadeUp(0)}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-3 py-1.5 shadow-sm shadow-indigo-900/5"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
            </span>
            <span className="text-xs font-medium text-slate-600">Signal-based account intelligence</span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.08)}
            className="mt-6 text-[2.6rem] font-semibold leading-[1.04] tracking-[-0.03em] text-slate-900 sm:text-6xl xl:text-[4.1rem]"
          >
            Know who's ready to buy.{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-orange-500 bg-clip-text text-transparent">
              And exactly why.
            </span>
          </motion.h1>

          <motion.p {...fadeUp(0.16)} className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
            {brand.name} tracks hiring, funding, leadership moves, tech changes and filings, then hands your team the
            accounts worth targeting now. Each one comes with its evidence, its timing and the outreach to act on it.
            No vague lists.
          </motion.p>

          <motion.div {...fadeUp(0.24)} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={demoHref}
              {...demoLinkProps}
              className="group inline-flex items-center justify-between gap-4 rounded-full bg-slate-900 py-1.5 pl-6 pr-1.5 font-semibold text-white shadow-[0_12px_30px_-10px_rgba(49,46,129,0.55)] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Book a demo
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-900 transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight className="h-5 w-5" />
              </span>
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/70 px-6 py-3.5 font-semibold text-slate-800 transition-colors hover:border-slate-400 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              See how it works
            </a>
          </motion.div>

          <motion.ul {...fadeUp(0.32)} className="mt-10 grid gap-3 sm:grid-cols-3 sm:gap-4">
            {proofPoints.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2.5 text-sm text-slate-600">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-indigo-100 bg-white">
                  <Icon className="h-3.5 w-3.5 text-indigo-600" />
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
  const items = [...exampleSignals, ...exampleSignals];
  return (
    <div className="relative z-10 order-3 flex items-center border-t border-indigo-100 bg-white/70 backdrop-blur xl:absolute xl:inset-x-0 xl:bottom-0">
      <div className="hidden shrink-0 items-center gap-2 border-r border-indigo-100 px-5 py-3.5 text-xs font-semibold text-slate-500 sm:flex">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500" />
        Example signals
      </div>
      <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <div
          tabIndex={0}
          aria-label="Example signals, scrolling. Focus to pause."
          className="flex w-max max-w-none animate-[marquee_70s_linear_infinite] gap-8 py-3.5 pl-6 outline-none hover:[animation-play-state:paused] focus:[animation-play-state:paused] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-400"
        >
          {items.map((s, i) => (
            <div key={i} className="flex items-center gap-2.5 whitespace-nowrap text-[13px]" aria-hidden={i >= exampleSignals.length}>
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">
                {signalKindLabel[s.kind]}
              </span>
              <span className="text-slate-700">{s.segment}</span>
              <span className="text-slate-500">
                {s.city}, {s.countryCode}
              </span>
              <span className="ml-6 h-1 w-1 rounded-full bg-slate-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
