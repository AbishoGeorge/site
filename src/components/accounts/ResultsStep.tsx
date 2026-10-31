import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Banknote,
  Building2,
  CalendarClock,
  Check,
  ChevronDown,
  LineChart,
  Loader2,
  Lock,
  Mail,
  RefreshCcw,
  ScrollText,
  UserRoundCheck,
  UserRoundPlus,
  type LucideIcon,
} from 'lucide-react';
import { brand } from '../../brand';
import FloatField from '../overlay/FloatField';
import { submitLead, type LeadResult } from '../overlay/lead';
import CompanyLogo from './CompanyLogo';

interface PreviewRow {
  kind: string;
  icon: LucideIcon;
  when: string;
  score: number;
  role: string;
}

// What each row of the preview shows before the list is unlocked. Names and contacts stay hidden.
const previewRows: PreviewRow[] = [
  { kind: 'Funding round', icon: Banknote, when: '2 days ago', score: 5, role: 'Head of Finance' },
  { kind: 'New VP of Sales', icon: UserRoundCheck, when: '4 days ago', score: 5, role: 'VP of Sales' },
  { kind: 'Expansion', icon: Building2, when: '1 week ago', score: 5, role: 'Chief Operating Officer' },
  { kind: 'Hiring surge', icon: UserRoundPlus, when: '3 days ago', score: 4, role: 'Head of Revenue Operations' },
  { kind: 'Tech change', icon: RefreshCcw, when: '5 days ago', score: 4, role: 'Chief Information Officer' },
  { kind: 'Contract renewal', icon: CalendarClock, when: '2 weeks ago', score: 4, role: 'Procurement Lead' },
  { kind: 'Leadership change', icon: UserRoundCheck, when: '1 week ago', score: 4, role: 'Chief Financial Officer' },
  { kind: 'Tender published', icon: ScrollText, when: '6 days ago', score: 3, role: 'IT Director' },
  { kind: 'Earnings call', icon: LineChart, when: '3 weeks ago', score: 3, role: 'Chief Executive Officer' },
  { kind: 'Grant awarded', icon: Banknote, when: '1 week ago', score: 3, role: 'Head of Operations' },
];

/**
 * Laid out to fit one screen: the title, a ranked list that fills whatever height is left (fading out where it is
 * cut off) and the unlock card, beside the list on wide screens and under it on smaller ones. On phones the card
 * starts as a single button so the list gets the room, and the form takes the list's place once it is tapped.
 */
export default function ResultsStep({ domain }: { domain: string }) {
  const [formOpen, setFormOpen] = useState(false);
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`mx-auto grid h-full max-w-7xl gap-4 px-4 pb-4 pt-1 sm:px-6 sm:pb-6 sm:[grid-template-areas:'title'_'list'_'card'] sm:grid-rows-[auto_minmax(0,1fr)_auto] lg:grid-cols-[minmax(0,1fr)_380px] lg:grid-rows-[auto_minmax(0,1fr)] lg:gap-x-10 lg:gap-y-5 lg:[grid-template-areas:'title_card'_'list_card'] ${
        formOpen
          ? "content-start [grid-template-areas:'title'_'card'] grid-rows-[auto_auto] sm:content-stretch"
          : "[grid-template-areas:'title'_'list'_'card'] grid-rows-[auto_minmax(0,1fr)_auto]"
      }`}
    >
      {/* With the form open on a very short screen, the form gets the whole space. */}
      <div className={`[grid-area:title] ${formOpen ? 'tiny:hidden' : ''}`}>
        <div className="flex items-center gap-2.5">
          <CompanyLogo domain={domain} className="h-8 w-8 rounded-lg shadow-sm ring-1 ring-indigo-100" />
          <span className="truncate text-sm font-semibold text-slate-700">{domain}</span>
          <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800 ring-1 ring-amber-200">
            Preview
          </span>
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-slate-900 sm:text-4xl xl:text-5xl">
          Your top 10 accounts
        </h1>
        <p className="mt-2 hidden max-w-2xl text-slate-600 sm:block">
          This is how your list will look. Company names, contacts and the full signal unlock when we build it for{' '}
          {domain}.
        </p>
      </div>

      <div
        className={`relative min-h-0 overflow-hidden rounded-3xl bg-white shadow-[0_30px_80px_-50px_rgba(79,70,229,0.6)] ring-1 ring-slate-200 [grid-area:list] ${
          formOpen ? 'hidden sm:block' : ''
        }`}
      >
        <ol className="divide-y divide-slate-100">
          {previewRows.map((r, i) => (
            <motion.li
              key={r.kind}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.08 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 px-4 py-2.5 sm:gap-4 sm:px-5 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_minmax(0,1.1fr)_auto_minmax(0,1fr)] lg:py-3"
            >
              <span className="w-5 shrink-0 text-sm font-bold tabular-nums text-slate-400">{i + 1}</span>
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <span className="h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br from-slate-200 to-slate-100" />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-center gap-3">
                    <Locked className="h-2.5 flex-1 lg:w-[70%] lg:flex-none" />
                    <span className="shrink-0 text-[11px] text-slate-400 lg:hidden">{r.when}</span>
                  </div>
                  <Locked className="hidden h-2 w-[45%] lg:block" />
                  {/* Below lg the signal sits under the hidden name instead of in its own column. */}
                  <SignalTag row={r} className="lg:hidden" />
                </div>
              </div>
              <SignalTag row={r} className="hidden lg:flex" />
              <div className="shrink-0">
                <Relevance score={r.score} />
              </div>
              <div className="hidden w-52 shrink-0 items-center gap-2 sm:flex lg:w-auto lg:min-w-0">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                  <Lock className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0 leading-tight">
                  <div className="truncate text-xs font-medium text-slate-700">{r.role}</div>
                  <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                    <Mail className="h-3 w-3" />
                    ••••••@••••••.com
                  </div>
                </div>
              </div>
            </motion.li>
          ))}
        </ol>
        {/* The list is cut to the space available; the fade and note make that read as "more inside". */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-28 items-end justify-center bg-gradient-to-t from-white via-white/90 to-transparent pb-3">
          <span className="flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
            <Lock className="h-3.5 w-3.5" />
            All 10 accounts unlock with your details
          </span>
        </div>
      </div>

      <aside className="[grid-area:card] lg:self-center">
        <UnlockCard domain={domain} formOpen={formOpen} onFormOpen={setFormOpen} />
      </aside>
    </motion.section>
  );
}

function SignalTag({ row, className = '' }: { row: PreviewRow; className?: string }) {
  return (
    <div className={`flex min-w-0 items-center gap-2 ${className}`}>
      <span className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-orange-50 py-0.5 pl-1.5 pr-2.5 text-xs font-semibold text-orange-700 ring-1 ring-orange-100 lg:py-1">
        <row.icon className="h-3.5 w-3.5" />
        {row.kind}
      </span>
      <span className="hidden truncate text-xs text-slate-500 lg:inline">{row.when}</span>
    </div>
  );
}

function Locked({ className }: { className: string }) {
  return (
    <span className={`relative block overflow-hidden rounded-full bg-slate-200 ${className}`}>
      <span className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/70 to-transparent" />
    </span>
  );
}

function Relevance({ score }: { score: number }) {
  return (
    <span className="flex items-end gap-0.5" aria-label={`Relevance ${score} of 5`}>
      {[0, 1, 2, 3, 4].map((b) => (
        <span
          key={b}
          className={`w-1.5 rounded-sm ${b < score ? 'bg-indigo-600' : 'bg-indigo-100'}`}
          style={{ height: 6 + b * 3 }}
        />
      ))}
    </span>
  );
}

function UnlockCard({
  domain,
  formOpen,
  onFormOpen,
}: {
  domain: string;
  /** Phones only: whether the fields are showing. Larger screens always show them. */
  formOpen: boolean;
  onFormOpen: (open: boolean) => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | LeadResult>('idle');
  const firstField = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formOpen) firstField.current?.querySelector('input')?.focus();
  }, [formOpen]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;
    setStatus('sending');
    const result = await submitLead('top-accounts', { Name: name, Email: email, Phone: phone, Website: domain });
    setStatus(result);
    // Once sent, phones go back to showing the list above the confirmation.
    if (result !== 'error') onFormOpen(false);
  };

  if (status === 'sent' || status === 'email') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-slate-900 p-6 text-white shadow-2xl shadow-indigo-900/20 sm:p-7"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
          <Check className="h-6 w-6" />
        </span>
        {status === 'sent' ? (
          <>
            <h2 className="mt-4 text-2xl font-bold">You're all set</h2>
            <p className="mt-2 text-slate-300">
              We'll research your top 10 accounts for {domain} and send them to {email}.
            </p>
          </>
        ) : (
          <>
            <h2 className="mt-4 text-2xl font-bold">One more step</h2>
            <p className="mt-2 text-slate-300">
              Your email app should have opened with your details. Send that email and we'll build your list. If
              nothing opened, write to <span className="select-all font-medium text-white">{brand.email}</span>.
            </p>
          </>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl bg-slate-900 p-5 text-white shadow-2xl shadow-indigo-900/25 sm:p-7"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(closest-side,rgba(129,140,248,0.45),transparent)]" />
      {/* On a very short screen the closed card is just its button, so the list keeps some room. */}
      <div
        className={`relative flex items-center gap-2 text-sm font-semibold text-indigo-200 ${formOpen ? '' : 'tiny:hidden'}`}
      >
        <Lock className="h-4 w-4" />
        Unlock your list
        {formOpen && (
          <button
            type="button"
            onClick={() => onFormOpen(false)}
            aria-label="Back to the preview"
            className="-my-1 ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:hidden"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        )}
      </div>
      <h2 className="relative mt-1.5 text-xl font-bold leading-tight tiny:hidden sm:text-2xl">
        Get all 10 accounts, with the people to contact
      </h2>
      <p className="relative mt-1.5 hidden text-sm text-slate-300 sm:block">
        We research the list for {domain} and send it to your inbox.
      </p>

      {!formOpen && (
        <button
          type="button"
          onClick={() => onFormOpen(true)}
          className="group relative mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-slate-900 tiny:mt-0 sm:hidden"
        >
          Unlock my top 10
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      )}

      <form
        onSubmit={submit}
        className={`relative mt-4 space-y-2.5 sm:mt-5 sm:block sm:space-y-3 ${formOpen ? '' : 'hidden'}`}
      >
        <div ref={firstField}>
          <FloatField id="unlock-name" tone="dark" label="Full name" value={name} onChange={setName} autoComplete="name" required />
        </div>
        <FloatField
          id="unlock-email"
          tone="dark"
          label="Work email"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          required
        />
        <FloatField
          id="unlock-phone"
          tone="dark"
          label="Phone (optional)"
          type="tel"
          value={phone}
          onChange={setPhone}
          autoComplete="tel"
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="group mt-1 flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-slate-900 transition-transform hover:-translate-y-0.5 disabled:opacity-70"
        >
          {status === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {status === 'sending' ? 'Sending…' : 'Unlock my top 10'}
          {status !== 'sending' && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
        </button>
        {status === 'error' && (
          <p role="alert" className="text-sm text-red-300">
            That didn't go through. Please try again, or email {brand.email}.
          </p>
        )}
        <p className="text-center text-xs text-slate-400">We only use your details to send your list.</p>
      </form>
    </motion.div>
  );
}
