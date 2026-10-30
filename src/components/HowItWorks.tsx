import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import {
  BadgeCheck,
  Briefcase,
  CalendarClock,
  Crosshair,
  Database,
  Gauge,
  Inbox,
  Landmark,
  Link2,
  Send,
  Telescope,
  UserPlus,
  type LucideIcon,
} from 'lucide-react';

const steps: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: Crosshair,
    title: 'Define your ideal buyer',
    desc: 'Tell us who you sell to and what "ready" looks like: the triggers that came before your best deals.',
  },
  {
    icon: Telescope,
    title: 'Monitor the market',
    desc: 'Agents watch job boards, funding news, filings, earnings calls, tenders and leadership moves every day.',
  },
  {
    icon: Gauge,
    title: 'Verify and score',
    desc: 'Each signal is checked against its source and dated. Accounts are ranked on fit and timing, not firmographics alone.',
  },
  {
    icon: Inbox,
    title: 'Act while it is warm',
    desc: 'Prioritized accounts land in your CRM with the evidence, the right contacts and a first message.',
  },
];

const STEP_MS = 5200;

export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.35 });
  const reduce = useReducedMotion();
  const playing = inView && !paused && !reduce;

  useEffect(() => {
    if (!playing) return;
    const started = performance.now() - progress * STEP_MS;
    const id = window.setInterval(() => {
      const p = (performance.now() - started) / STEP_MS;
      if (p >= 1) {
        setActive((a) => (a + 1) % steps.length);
        setProgress(0);
      } else {
        setProgress(p);
      }
    }, 60);
    return () => window.clearInterval(id);
    // Restart the clock when the step changes or playback resumes; progress is read once at that moment.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, active]);

  const select = (i: number) => {
    setActive(i);
    setProgress(0);
  };

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="scroll-mt-24 bg-gradient-to-b from-white to-indigo-50/50 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">How it works</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            From market noise to a short list you can act on.
          </h2>
        </motion.div>

        <div
          className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.15fr] lg:gap-10"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <ol className="space-y-3" aria-label="Steps">
            {steps.map(({ icon: Icon, title, desc }, i) => {
              const isActive = i === active;
              return (
                <li key={title}>
                  <button
                    type="button"
                    onClick={() => select(i)}
                    aria-current={isActive ? 'step' : undefined}
                    className={`group relative w-full overflow-hidden rounded-2xl p-5 text-left transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 ${
                      isActive
                        ? 'bg-white shadow-[0_20px_50px_-24px_rgba(79,70,229,0.45)] ring-1 ring-indigo-200'
                        : 'bg-white/40 ring-1 ring-transparent hover:bg-white/80 hover:ring-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
                          isActive ? 'bg-slate-900 text-white' : 'bg-indigo-50 text-indigo-600'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-orange-600">0{i + 1}</span>
                          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                        </div>
                        <AnimatePresence initial={false}>
                          {isActive && (
                            <motion.p
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                              className="overflow-hidden pt-1.5 text-sm leading-relaxed text-slate-600"
                            >
                              {desc}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    {isActive && (
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-indigo-100">
                        <span
                          className="block h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-orange-400"
                          style={{ width: `${(reduce ? 1 : progress) * 100}%` }}
                        />
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="relative min-h-[360px] overflow-hidden rounded-3xl bg-white p-6 shadow-[0_30px_80px_-40px_rgba(79,70,229,0.5)] ring-1 ring-indigo-100 sm:p-8">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(closest-side,rgba(165,180,252,0.45),transparent)]" />
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                {active === 0 && <IdealBuyer />}
                {active === 1 && <MarketFeed />}
                {active === 2 && <VerifyScore />}
                {active === 3 && <ActNow />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

const item = (i: number) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
});

function PanelTitle({ children }: { children: React.ReactNode }) {
  return <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{children}</div>;
}

function IdealBuyer() {
  const groups = [
    { label: 'Industry', values: ['B2B software', 'Logistics', 'Fintech'] },
    { label: 'Company size', values: ['200–2,000 employees'] },
    { label: 'Regions', values: ['North America', 'Europe'] },
    { label: 'Buying triggers', values: ['New sales leader', 'Funding round', 'CRM renewal'] },
  ];
  return (
    <div>
      <PanelTitle>Your ideal buyer</PanelTitle>
      <div className="mt-5 space-y-4">
        {groups.map((g, i) => (
          <motion.div key={g.label} {...item(i)}>
            <div className="text-sm font-medium text-slate-700">{g.label}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {g.values.map((v) => (
                <span
                  key={v}
                  className={`rounded-full px-3 py-1 text-sm font-medium ring-1 ${
                    g.label === 'Buying triggers'
                      ? 'bg-orange-50 text-orange-700 ring-orange-100'
                      : 'bg-indigo-50 text-indigo-700 ring-indigo-100'
                  }`}
                >
                  {v}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function MarketFeed() {
  const rows = [
    { icon: Landmark, kind: 'Funding', text: 'Series B closed · Fintech · Berlin' },
    { icon: Briefcase, kind: 'Hiring', text: '14 account executive roles · SaaS · Austin' },
    { icon: UserPlus, kind: 'Leadership', text: 'New VP of Sales · Logistics · Rotterdam' },
    { icon: Database, kind: 'Tech change', text: 'Replacing its CRM · Insurance · Toronto' },
  ];
  return (
    <div>
      <div className="flex items-center justify-between">
        <PanelTitle>Signals coming in</PanelTitle>
        <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-700">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          Live
        </span>
      </div>
      <ul className="mt-5 space-y-2.5">
        {rows.map(({ icon: Icon, kind, text }, i) => (
          <motion.li
            key={text}
            {...item(i)}
            className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-orange-700">{kind}</div>
              <div className="truncate text-sm text-slate-700">{text}</div>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

function VerifyScore() {
  const checks = [
    { icon: Link2, text: 'Source linked: press release' },
    { icon: CalendarClock, text: 'Dated: 5 days ago' },
    { icon: BadgeCheck, text: 'Confirmed by a second source' },
  ];
  return (
    <div>
      <PanelTitle>Fintech · 420 employees · London</PanelTitle>
      <motion.div {...item(0)} className="mt-5 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
        <div className="text-xs font-semibold text-orange-700">Funding</div>
        <div className="mt-0.5 font-semibold text-slate-900">Raised a $45M Series B to expand into Europe</div>
      </motion.div>
      <ul className="mt-4 space-y-2">
        {checks.map(({ icon: Icon, text }, i) => (
          <motion.li key={text} {...item(i + 1)} className="flex items-center gap-2.5 text-sm text-slate-700">
            <Icon className="h-4 w-4 text-emerald-600" />
            {text}
          </motion.li>
        ))}
      </ul>
      <motion.div {...item(4)} className="mt-6">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-700">Fit and timing</span>
          <span className="font-bold text-orange-600">High</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-indigo-100">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '88%' }}
            transition={{ duration: 1.1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-orange-400"
          />
        </div>
      </motion.div>
    </div>
  );
}

function ActNow() {
  return (
    <div>
      <PanelTitle>Ready in your CRM</PanelTitle>
      <motion.div {...item(0)} className="mt-5 flex items-center gap-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-bold text-white">
          PS
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 font-semibold text-slate-900">
            Priya S. <BadgeCheck className="h-4 w-4 text-emerald-600" aria-label="Verified" />
          </div>
          <div className="text-sm text-slate-500">Head of Finance Operations · London</div>
        </div>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
          Added
        </span>
      </motion.div>
      <motion.div {...item(1)} className="mt-3 rounded-2xl p-4 ring-1 ring-slate-200">
        <div className="text-xs text-slate-500">
          Subject: <span className="font-medium text-slate-700">Congrats on the Series B</span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          Hi Priya, congrats on the raise. Expanding into Europe usually means new finance processes in every market.
          Worth a quick chat about how teams like yours handle it?
        </p>
      </motion.div>
      <motion.div {...item(2)} className="mt-4 flex justify-end">
        <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
          <Send className="h-4 w-4" />
          Send from your inbox
        </span>
      </motion.div>
    </div>
  );
}
