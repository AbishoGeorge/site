import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowRight, UserRound } from 'lucide-react';
import { industries, type Industry } from '../content/industries';
import { signalIcon } from './signalIcon';
import { accentStyle, industryIcon } from './usecases/industryStyle';
import { linkToUseCase } from './usecases/links';

const ADVANCE_MS = 7000;

/**
 * The markets we serve, as an explorer: pick an industry and the board shows what we watch there and who we help
 * you reach. It moves through the industries on its own until the visitor picks one, and pauses while hovered.
 */
export default function Industries() {
  const [active, setActive] = useState(0);
  const [picked, setPicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduce = useReducedMotion();
  const running = inView && !picked && !hovered && !reduce;

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => setActive((a) => (a + 1) % industries.length), ADVANCE_MS);
    return () => window.clearTimeout(id);
  }, [active, running]);

  // On phones the tabs are a row that scrolls sideways: keep the current one in sight without moving the page.
  useEffect(() => {
    const row = tabsRef.current;
    const tab = row?.children[active] as HTMLElement | undefined;
    if (!row || !tab || row.scrollWidth <= row.clientWidth) return;
    const left = tab.getBoundingClientRect().left - row.getBoundingClientRect().left + row.scrollLeft - 16;
    row.scrollTo({ left, behavior: reduce ? 'auto' : 'smooth' });
  }, [active, reduce]);

  const choose = (i: number, focus = false) => {
    setPicked(true);
    setActive(i);
    if (focus) (tabsRef.current?.children[i] as HTMLElement | undefined)?.focus();
  };

  const onKey = (e: KeyboardEvent) => {
    const last = industries.length - 1;
    const next =
      e.key === 'ArrowDown' || e.key === 'ArrowRight'
        ? active === last ? 0 : active + 1
        : e.key === 'ArrowUp' || e.key === 'ArrowLeft'
          ? active === 0 ? last : active - 1
          : e.key === 'Home'
            ? 0
            : e.key === 'End'
              ? last
              : -1;
    if (next < 0) return;
    e.preventDefault();
    choose(next, true);
  };

  const industry = industries[active];

  return (
    <section id="industries" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Different markets send different signals.
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            We tune what we watch to the market you sell into. Pick yours to see the signals we track and the people
            we help you reach.
          </p>
        </div>

        <div
          ref={ref}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="mt-12 grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-10"
        >
          <div
            ref={tabsRef}
            role="tablist"
            aria-label="Industries"
            onKeyDown={onKey}
            className="-mx-4 flex snap-x scroll-px-4 gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:flex-col lg:gap-1.5 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
          >
            {industries.map((ind, i) => {
              const selected = i === active;
              const Icon = industryIcon[ind.icon];
              const a = accentStyle[ind.accent];
              return (
                <button
                  key={ind.id}
                  id={`industry-tab-${ind.id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="industry-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => choose(i)}
                  className={`group relative flex shrink-0 snap-start items-center gap-3 overflow-hidden rounded-2xl py-2 pl-2 pr-4 text-left transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-500 lg:py-2.5 ${
                    selected ? 'bg-white shadow-sm ring-1 ring-slate-200' : 'hover:bg-slate-100'
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                      selected
                        ? `bg-gradient-to-br text-white shadow-md ${a.tile}`
                        : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-slate-700'
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span
                    className={`whitespace-nowrap text-sm font-semibold transition-colors lg:text-[15px] ${
                      selected ? 'text-slate-900' : 'text-slate-600'
                    }`}
                  >
                    {ind.name}
                  </span>
                  {/* Time until the next industry. */}
                  {selected && running && (
                    <span
                      key={active}
                      aria-hidden="true"
                      style={{ animationDuration: `${ADVANCE_MS}ms` }}
                      className={`absolute inset-x-3 bottom-0 h-0.5 origin-left animate-[grow_linear_forwards] rounded-full ${a.bar}`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div id="industry-panel" role="tabpanel" aria-labelledby={`industry-tab-${industry.id}`} className="min-w-0">
            <AnimatePresence mode="wait" initial={false}>
              <Board key={industry.id} industry={industry} />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function Board({ industry }: { industry: Industry }) {
  const Icon = industryIcon[industry.icon];
  const a = accentStyle[industry.accent];
  const shown = industry.signals.slice(0, 4);

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[28px] bg-white p-6 shadow-[0_30px_80px_-50px_rgba(49,46,129,0.55)] ring-1 ring-slate-200 sm:p-8"
    >
      <SignalRadar color={a.hex} count={shown.length} seed={industry.id.length * 7 + industry.name.length} />

      <div className="relative">
        <div className="flex items-center gap-3.5 pr-0 sm:pr-40">
          <span
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg ${a.tile}`}
          >
            <Icon className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">{industry.name}</h3>
            <p className="text-sm text-slate-500">For {industry.audience}</p>
          </div>
        </div>

        <p className="mt-6 max-w-2xl font-display text-xl font-semibold leading-snug tracking-tight text-slate-900 sm:pr-40 sm:text-[1.6rem]">
          {industry.moment}
        </p>

        <div className="mt-7 text-sm font-semibold text-slate-900">Signals we watch</div>
        <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
          {shown.map((s, i) => {
            const SIcon = signalIcon(s.label);
            return (
              <motion.li
                key={s.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3.5 ring-1 ring-slate-100"
              >
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${a.soft} ${a.text}`}>
                  <SIcon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-900">{s.label}</div>
                  <div className="mt-0.5 text-[13px] leading-relaxed text-slate-500">{s.why}</div>
                </div>
              </motion.li>
            );
          })}
        </ul>

        <div className="mt-6 flex flex-col gap-5 border-t border-slate-100 pt-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <div className="text-xs font-medium text-slate-500">Who we help you reach</div>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {industry.buyers.slice(0, 3).map((b) => (
                <li
                  key={b}
                  className="flex items-center gap-1.5 rounded-full bg-slate-100 py-1 pl-1.5 pr-2.5 text-xs font-medium text-slate-700"
                >
                  <UserRound className="h-3.5 w-3.5 text-slate-400" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <a
            href={linkToUseCase(industry.id)}
            className="group inline-flex shrink-0 items-center gap-2.5 self-start rounded-full bg-slate-900 py-1.5 pl-4 pr-1.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 sm:self-auto"
          >
            Read the use case
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-900">
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </a>
        </div>
      </div>
    </motion.article>
  );
}

/** A small radar in the corner of the board: one blip lights up for each signal as it appears. */
function SignalRadar({ color, count, seed }: { color: string; count: number; seed: number }) {
  const blips = Array.from({ length: count }, (_, i) => {
    const angle = ((seed * 37 + i * 97) % 360) * (Math.PI / 180);
    const r = 34 + ((seed * 13 + i * 29) % 52);
    return { x: 110 + Math.cos(angle) * r, y: 110 + Math.sin(angle) * r, i };
  });
  return (
    <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 hidden h-[220px] w-[220px] sm:block">
      <svg viewBox="0 0 220 220" className="h-full w-full">
        <defs>
          <linearGradient id="industry-sweep" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={color} stopOpacity="0" />
            <stop offset="100%" stopColor={color} stopOpacity="0.28" />
          </linearGradient>
        </defs>
        {[30, 55, 80, 105].map((r) => (
          <circle key={r} cx="110" cy="110" r={r} fill="none" stroke="#cbd5e1" strokeOpacity="0.7" strokeDasharray={r === 105 ? '2 5' : undefined} />
        ))}
        <path d="M110 5 V215 M5 110 H215" stroke="#e2e8f0" />
        <g className="animate-[spin_5s_linear_infinite]" style={{ transformOrigin: '110px 110px', transformBox: 'view-box' }}>
          <path d="M110 110 L215 110 A105 105 0 0 0 184.2 35.8 Z" fill="url(#industry-sweep)" />
        </g>
        {blips.map((b) => (
          <motion.g
            key={b.i}
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 + b.i * 0.12 }}
            style={{ transformOrigin: `${b.x}px ${b.y}px`, transformBox: 'view-box' }}
          >
            <circle cx={b.x} cy={b.y} r="9" fill={color} fillOpacity="0.15" />
            <circle cx={b.x} cy={b.y} r="3.5" fill={color} />
          </motion.g>
        ))}
        <circle cx="110" cy="110" r="4" fill="#0f172a" />
      </svg>
    </div>
  );
}
