import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, Check, Search } from 'lucide-react';
import OverlayShell from '../overlay/OverlayShell';
import { useHashOverlay } from '../overlay/useHashOverlay';
import CompanyLogo from './CompanyLogo';
import ResultsStep from './ResultsStep';
import { toDomain } from './domain';

/** Location hash that opens the flow, so any link can point at it and Back closes it. */
export const TOP_ACCOUNTS_HASH = 'top-accounts';

type Step = 'website' | 'scan' | 'results';

const scanSteps = ['Reading your website', 'Matching your ideal customer', 'Checking live buying signals', 'Ranking your top accounts'];
const STEP_MS = 620;

export default function AccountsFlow() {
  const { open, close, openCount } = useHashOverlay(TOP_ACCOUNTS_HASH);
  const [step, setStep] = useState<Step>('website');
  const [domain, setDomain] = useState('');

  // Every visit starts at the website field.
  useEffect(() => {
    if (openCount) setStep('website');
  }, [openCount]);

  return (
    <OverlayShell open={open} onClose={close} label="See your top accounts">
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
        {step === 'scan' && <ScanStep key="scan" domain={domain} onDone={() => setStep('results')} />}
        {step === 'results' && <ResultsStep key="results" domain={domain} onChangeWebsite={() => setStep('website')} />}
      </AnimatePresence>
    </OverlayShell>
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
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto flex min-h-[calc(100svh-65px)] max-w-4xl flex-col items-center justify-center px-5 py-16 text-center"
    >
      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100">
        Free preview
      </span>
      <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-slate-900 sm:text-6xl">
        See which accounts are{' '}
        <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-orange-500 bg-clip-text text-transparent">
          ready to buy what you sell
        </span>
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
        Enter your website and we'll show you how your top 10 accounts will look.
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
    </motion.section>
  );
}

/** A short, focused scan: the company's logo and four quick checks, then straight to the preview. */
function ScanStep({ domain, onDone }: { domain: string; onDone: () => void }) {
  const [done, setDone] = useState(0);
  const finished = done >= scanSteps.length;

  useEffect(() => {
    const t = window.setTimeout(finished ? onDone : () => setDone((d) => d + 1), finished ? 350 : STEP_MS);
    return () => window.clearTimeout(t);
  }, [done, finished, onDone]);

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto flex min-h-[calc(100svh-65px)] max-w-md flex-col items-center justify-center px-5 py-16"
      aria-live="polite"
    >
      <div className="relative flex h-32 w-32 items-center justify-center">
        <span className="absolute inset-0 animate-[spin_1.6s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(99,102,241,0.9)_300deg,transparent_360deg)] [mask-image:radial-gradient(closest-side,transparent_calc(100%-3px),black_calc(100%-2px))]" />
        <span className="absolute inset-3 rounded-full bg-indigo-100/60" />
        <CompanyLogo domain={domain} className="relative h-20 w-20 rounded-2xl shadow-lg ring-1 ring-indigo-100" />
      </div>
      <div className="mt-6 text-center">
        <div className="text-2xl font-bold tracking-tight text-slate-900">{domain}</div>
        <div className="mt-1 text-sm text-slate-500">Building your preview</div>
      </div>

      <ul className="mt-8 w-full space-y-2.5">
        {scanSteps.map((label, i) => {
          const state = i < done ? 'done' : i === done ? 'active' : 'pending';
          return (
            <li
              key={label}
              className={`flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm ring-1 transition-all duration-300 ${
                state === 'pending' ? 'text-slate-400 ring-slate-100' : 'text-slate-800 ring-slate-200'
              } ${state === 'active' ? 'shadow-md shadow-indigo-900/5' : ''}`}
            >
              <span className="flex h-5 w-5 items-center justify-center">
                {state === 'done' ? (
                  <motion.span
                    initial={{ scale: 0.4 }}
                    animate={{ scale: 1 }}
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white"
                  >
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </motion.span>
                ) : state === 'active' ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
                ) : (
                  <span className="h-4 w-4 rounded-full border-2 border-slate-200" />
                )}
              </span>
              {label}
            </li>
          );
        })}
      </ul>
      <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-indigo-100">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-orange-400"
          initial={{ width: '6%' }}
          animate={{ width: `${Math.max(6, (done / scanSteps.length) * 100)}%` }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        />
      </div>
    </motion.section>
  );
}
