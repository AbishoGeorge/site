import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUp,
  Building2,
  Check,
  Crosshair,
  Globe,
  Landmark,
  Loader2,
  Search,
  Swords,
  UserPlus,
  Users,
  FileText,
  Trophy,
  X,
  type LucideIcon,
} from 'lucide-react';
import Logo from '../Logo';
import CompanyLogo from './CompanyLogo';
import RequestStep from './RequestStep';
import { companyName, toDomain } from './domain';

/** Location hash that opens the flow, so any link can point at it and Back closes it. */
export const TOP_ACCOUNTS_HASH = 'top-accounts';

type Step = 'website' | 'scan' | 'result';

const scanSteps: { label: string; detail: string; done: string; icon: LucideIcon }[] = [
  { label: 'Figuring out what you do', detail: 'Building company profile', done: 'Read your website', icon: Globe },
  { label: 'Matching your ideal customer', detail: 'Industries, company size and regions', done: 'Matched your ideal customer profile', icon: Crosshair },
  { label: 'Identifying competitors', detail: 'Who your buyers compare you with', done: 'Mapped your competitors', icon: Swords },
  { label: 'Tracking job changes', detail: 'New leaders in the roles you sell to', done: 'Checked leadership and job changes', icon: UserPlus },
  { label: 'Surfacing funding and grants', detail: 'Fresh budgets in your market', done: 'Checked funding rounds and grants', icon: Landmark },
  { label: 'Finding tenders and RFPs', detail: 'Open buying processes', done: 'Checked tenders and RFPs', icon: FileText },
  { label: 'Spotting expansion', detail: 'New offices, plants and markets', done: 'Checked expansion news', icon: Building2 },
  { label: 'Mapping buying committees', detail: 'Decision makers and champions', done: 'Mapped buying committees', icon: Users },
  { label: 'Ranking your top accounts', detail: 'Scoring fit and timing', done: 'Ranked accounts by fit and timing', icon: Trophy },
];
const STEP_MS = 850;

export default function AccountsFlow() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('website');
  const [domain, setDomain] = useState('');
  const openedInPage = useRef(false);

  useEffect(() => {
    const sync = (fromEvent: boolean) => {
      const isOpen = window.location.hash === `#${TOP_ACCOUNTS_HASH}`;
      setOpen(isOpen);
      if (isOpen) {
        openedInPage.current = fromEvent;
        setStep('website');
      }
    };
    sync(false);
    const onHash = () => sync(true);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const close = useCallback(() => {
    if (openedInPage.current) {
      window.history.back();
    } else {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, close]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="flow"
          role="dialog"
          aria-modal="true"
          aria-label="See your top accounts"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[70] overflow-y-auto bg-[#f6f7ff]"
        >
          <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
            <div className="absolute left-[10%] top-[-20%] h-[60%] w-[50%] rounded-full bg-[radial-gradient(closest-side,var(--tw-gradient-stops))] from-indigo-200/90 to-transparent animate-[drift-a_24s_ease-in-out_infinite]" />
            <div className="absolute bottom-[-20%] right-[0%] h-[60%] w-[45%] rounded-full bg-[radial-gradient(closest-side,var(--tw-gradient-stops))] from-violet-200/90 to-transparent animate-[drift-b_28s_ease-in-out_infinite]" />
          </div>

          <header className="sticky top-0 z-10 flex items-center justify-between border-b border-indigo-100/70 bg-white/70 px-4 py-3 backdrop-blur-xl sm:px-6">
            <span className="text-slate-900">
              <Logo />
            </span>
            <button
              type="button"
              onClick={close}
              className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 ring-1 ring-slate-200 transition-colors hover:bg-white hover:text-slate-900"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          <div className="relative">
            <AnimatePresence mode="wait">
              {step === 'website' && (
                <WebsiteStep
                  key="website"
                  initial={domain}
                  onSubmit={(d) => {
                    setDomain(d);
                    setStep('scan');
                  }}
                />
              )}
              {step === 'scan' && <ScanStep key="scan" domain={domain} onDone={() => setStep('result')} />}
              {step === 'result' && <RequestStep key="result" domain={domain} onRestart={() => setStep('website')} />}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function WebsiteStep({ initial, onSubmit }: { initial: string; onSubmit: (domain: string) => void }) {
  const [value, setValue] = useState(initial);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto flex min-h-[calc(100svh-65px)] max-w-4xl flex-col items-center justify-center px-5 py-16 text-center"
    >
      <h1 className="text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-slate-900 sm:text-6xl">
        See which accounts are{' '}
        <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-orange-500 bg-clip-text text-transparent">
          ready to buy what you sell
        </span>
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
        Enter your website. We'll work out your ideal customer and show you the kind of buying signals we'd surface for
        you: funding, job changes, expansion, tenders and more.
      </p>

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const d = toDomain(value);
          if (!d) {
            setError('Enter a website like yourcompany.com');
            inputRef.current?.focus();
            return;
          }
          onSubmit(d);
        }}
        className="mt-10 w-full max-w-2xl"
      >
        <label htmlFor="company-website" className="sr-only">
          Company website
        </label>
        <div
          className={`flex items-center gap-3 rounded-2xl bg-white p-2 pl-5 shadow-[0_20px_50px_-20px_rgba(79,70,229,0.45)] ring-2 transition-shadow focus-within:ring-indigo-500 ${
            error ? 'ring-red-400' : 'ring-indigo-200'
          }`}
        >
          <Search className="h-5 w-5 shrink-0 text-slate-400" />
          <input
            ref={inputRef}
            id="company-website"
            type="text"
            inputMode="url"
            autoComplete="url"
            placeholder="Enter company website"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError('');
            }}
            aria-invalid={!!error}
            aria-describedby={error ? 'company-website-error' : undefined}
            className="min-w-0 flex-1 bg-transparent py-3 text-lg text-slate-900 outline-none placeholder:text-slate-400"
          />
          <button
            type="submit"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            aria-label="Find my top accounts"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        </div>
        <p id="company-website-error" role="alert" className="mt-3 h-5 text-sm text-red-600">
          {error}
        </p>
      </form>
      <p className="mt-4 text-sm text-slate-500">Free sample. We only use your website to tailor it.</p>
    </motion.section>
  );
}

function ScanStep({ domain, onDone }: { domain: string; onDone: () => void }) {
  const [current, setCurrent] = useState(0);
  const total = scanSteps.length;
  const finished = current >= total;

  useEffect(() => {
    if (finished) {
      const t = window.setTimeout(onDone, 900);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setCurrent((c) => c + 1), STEP_MS);
    return () => window.clearTimeout(t);
  }, [current, finished, onDone]);

  const active = scanSteps[Math.min(current, total - 1)];
  const progress = Math.min(1, current / total);
  const name = companyName(domain);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[320px_1fr] lg:py-12"
      aria-live="polite"
    >
      {/* Steps */}
      <aside className="rounded-3xl bg-white/80 p-5 shadow-sm ring-1 ring-indigo-100 backdrop-blur">
        <div className="flex items-center gap-3">
          <CompanyLogo domain={domain} className="h-11 w-11 rounded-xl" />
          <div className="min-w-0">
            <div className="truncate font-semibold text-slate-900">{domain}</div>
            <div className="text-xs text-slate-500">Sample report</div>
          </div>
        </div>
        <ol className="mt-5 hidden space-y-1 lg:block">
          {scanSteps.map((s, i) => {
            const state = i < current ? 'done' : i === current ? 'active' : 'pending';
            return (
              <li
                key={s.label}
                className={`flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm transition-colors ${
                  state === 'active' ? 'bg-indigo-50 font-semibold text-slate-900' : state === 'done' ? 'text-slate-700' : 'text-slate-400'
                }`}
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                  {state === 'done' ? (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                  ) : state === 'active' ? (
                    <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                  ) : (
                    <span className="h-4 w-4 rounded-full border-2 border-slate-200" />
                  )}
                </span>
                {s.label}
              </li>
            );
          })}
        </ol>
        <div className="mt-5 rounded-2xl bg-slate-50 p-3.5">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            {finished ? (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
            ) : (
              <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
            )}
            {finished ? 'Your sample is ready' : 'Building your report…'}
          </div>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-indigo-100">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-orange-400"
              animate={{ width: `${Math.max(4, progress * 100)}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <div className="mt-1.5 text-xs text-slate-500 lg:hidden">
            Step {Math.min(current + 1, total)} of {total}: {active.label}
          </div>
        </div>
      </aside>

      {/* Live panel */}
      <div className="min-w-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={finished ? 'ready' : active.label}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
          >
            {finished ? 'Report ready' : active.label}
          </motion.p>
        </AnimatePresence>

        <div className="mt-4 grid overflow-hidden rounded-3xl bg-white shadow-[0_30px_80px_-40px_rgba(79,70,229,0.5)] ring-1 ring-indigo-100 md:grid-cols-[1fr_1.1fr]">
          <div className="relative flex flex-col justify-between gap-8 overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-6 sm:p-8">
            <Radar />
            <div className="relative flex items-center gap-5">
              <div className="relative">
                <span className="absolute inset-0 animate-ping rounded-2xl bg-indigo-300/40" />
                <CompanyLogo domain={domain} className="relative h-20 w-20 rounded-2xl shadow-lg ring-1 ring-indigo-100" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-3xl font-bold tracking-tight text-slate-900">{name}</div>
                <div className="truncate text-sm text-slate-500">{domain}</div>
              </div>
            </div>
            <div className="relative flex items-center gap-2.5 text-sm font-medium text-slate-700">
              {finished ? (
                <Check className="h-4 w-4 text-emerald-600" />
              ) : (
                <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
              )}
              {finished ? 'All signals checked' : `${active.detail}…`}
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="text-sm font-semibold text-slate-900">Progress</div>
            <ul className="mt-4 space-y-2">
              <AnimatePresence initial={false}>
                {scanSteps.slice(0, current).map((s) => {
                  const Icon = s.icon;
                  return (
                    <motion.li
                      key={s.label}
                      initial={{ opacity: 0, x: -10, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: 'auto' }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-sm text-slate-700">{s.done}</span>
                        <Check className="ml-auto h-4 w-4 text-emerald-600" />
                      </div>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
              {!finished && (
                <li className="relative overflow-hidden rounded-xl bg-slate-50 px-3 py-2">
                  <div className="flex items-center gap-3">
                    <span className="h-7 w-7 rounded-lg bg-slate-200/70" />
                    <span className="h-2.5 w-1/2 rounded bg-slate-200/70" />
                  </div>
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.3s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

/** A slow radar sweep behind the company card. */
function Radar() {
  return (
    <svg aria-hidden="true" viewBox="0 0 200 200" className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 opacity-70">
      <defs>
        <linearGradient id="radar-sweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgb(99,102,241)" stopOpacity="0" />
          <stop offset="100%" stopColor="rgb(99,102,241)" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      {[30, 55, 80, 98].map((r) => (
        <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="rgb(99,102,241)" strokeOpacity="0.15" />
      ))}
      <g className="animate-[spin_3.5s_linear_infinite]" style={{ transformOrigin: '100px 100px', transformBox: 'view-box' }}>
        <path d="M100 100 L198 100 A98 98 0 0 0 169 31 Z" fill="url(#radar-sweep)" />
      </g>
      <circle cx="150" cy="70" r="3" fill="rgb(249,115,22)" className="animate-pulse" />
      <circle cx="62" cy="128" r="2.5" fill="rgb(139,92,246)" className="animate-pulse" />
    </svg>
  );
}
