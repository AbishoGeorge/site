import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Loader2, Lock, Mail } from 'lucide-react';
import { brand } from '../../brand';
import { submitLead, type LeadResult } from '../overlay/lead';
import CompanyLogo from './CompanyLogo';

// What each row of the preview shows before the list is unlocked. Names and contacts stay hidden.
const previewRows = [
  { kind: 'Funding round', when: '2 days ago', score: 5, role: 'Head of Finance' },
  { kind: 'New VP of Sales', when: '4 days ago', score: 5, role: 'VP of Sales' },
  { kind: 'Expansion', when: '1 week ago', score: 5, role: 'Chief Operating Officer' },
  { kind: 'Hiring surge', when: '3 days ago', score: 4, role: 'Head of Revenue Ops' },
  { kind: 'Tech change', when: '5 days ago', score: 4, role: 'Chief Information Officer' },
  { kind: 'Contract renewal', when: '2 weeks ago', score: 4, role: 'Procurement Lead' },
  { kind: 'Leadership change', when: '1 week ago', score: 4, role: 'Chief Financial Officer' },
  { kind: 'Tender published', when: '6 days ago', score: 3, role: 'IT Director' },
  { kind: 'Earnings call', when: '3 weeks ago', score: 3, role: 'Chief Executive' },
  { kind: 'Grant awarded', when: '1 week ago', score: 3, role: 'Head of Operations' },
];
const MOBILE_ROWS = 5;

export default function ResultsStep({ domain }: { domain: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto max-w-7xl px-4 pb-10 pt-2 sm:px-6 lg:pb-14"
    >
      <div className="flex flex-wrap items-center gap-3">
        <CompanyLogo domain={domain} className="h-10 w-10 rounded-xl shadow-sm ring-1 ring-indigo-100" />
        <span className="font-semibold text-slate-800">{domain}</span>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-10">
        <div className="min-w-0">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h1 className="text-3xl font-bold tracking-[-0.03em] text-slate-900 sm:text-5xl">Your top 10 accounts</h1>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-200">
              Preview
            </span>
          </div>
          <p className="mt-3 max-w-2xl text-slate-600">
            Here is how your list will look. Company names, contacts and the full signal unlock when we build it for{' '}
            {domain}.
          </p>

          <ol className="mt-6 divide-y divide-slate-100 overflow-hidden rounded-3xl bg-white shadow-[0_30px_80px_-50px_rgba(79,70,229,0.6)] ring-1 ring-slate-200">
            {previewRows.map((r, i) => (
              <motion.li
                key={r.kind}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.08 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className={`${i >= MOBILE_ROWS ? 'hidden lg:grid' : 'grid'} grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 px-4 py-3.5 sm:px-5 lg:grid-cols-[auto_minmax(0,1.1fr)_minmax(0,1fr)_auto_minmax(0,1fr)]`}
              >
                <span className="w-6 text-sm font-bold tabular-nums text-slate-400">{i + 1}</span>
                <div className="flex min-w-0 items-center gap-3">
                  <span className="h-9 w-9 shrink-0 rounded-xl bg-gradient-to-br from-slate-200 to-slate-100" />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <Locked className="h-3 w-[70%]" />
                    <Locked className="h-2 w-[45%]" />
                  </div>
                </div>
                <div className="col-start-2 flex min-w-0 flex-wrap items-center gap-2 lg:col-start-auto lg:flex-col lg:items-start lg:gap-1">
                  <span className="whitespace-nowrap rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700 ring-1 ring-orange-100">
                    {r.kind}
                  </span>
                  <span className="whitespace-nowrap text-xs text-slate-500">{r.when}</span>
                </div>
                <div className="col-start-3 row-start-1 lg:col-start-auto lg:row-start-auto">
                  <Relevance score={r.score} />
                </div>
                <div className="col-span-2 col-start-2 flex min-w-0 items-center gap-2 lg:col-span-1 lg:col-start-auto">
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
            <li className="px-5 py-3 text-center text-sm font-medium text-slate-500 lg:hidden">
              + {previewRows.length - MOBILE_ROWS} more accounts in your list
            </li>
          </ol>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <UnlockCard domain={domain} />
        </aside>
      </div>
    </motion.section>
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

function UnlockCard({ domain }: { domain: string }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | LeadResult>('idle');

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;
    setStatus('sending');
    setStatus(await submitLead('top-accounts', { Name: name, Email: email, Phone: phone, Website: domain }));
  };

  if (status === 'sent' || status === 'email') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-slate-900 p-7 text-white shadow-2xl shadow-indigo-900/20"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
          <Check className="h-6 w-6" />
        </span>
        {status === 'sent' ? (
          <>
            <h2 className="mt-5 text-2xl font-bold">You're all set</h2>
            <p className="mt-2 text-slate-300">
              We'll research your top 10 accounts for {domain} and send them to {email}.
            </p>
          </>
        ) : (
          <>
            <h2 className="mt-5 text-2xl font-bold">One more step</h2>
            <p className="mt-2 text-slate-300">
              Your email app should have opened with your details. Send that email and we'll build your list. If nothing
              opened, write to <span className="select-all font-medium text-white">{brand.email}</span>.
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
      className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-2xl shadow-indigo-900/25 sm:p-7"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(closest-side,rgba(129,140,248,0.45),transparent)]" />
      <div className="relative flex items-center gap-2 text-sm font-semibold text-indigo-200">
        <Lock className="h-4 w-4" />
        Unlock your list
      </div>
      <h2 className="relative mt-2 text-2xl font-bold leading-tight">All 10 accounts, with the people to contact</h2>
      <p className="relative mt-2 text-sm text-slate-300">We research the list for {domain} and send it straight to you.</p>

      <form onSubmit={submit} className="relative mt-6 space-y-3">
        <DarkField id="unlock-name" label="Full name" value={name} onChange={setName} autoComplete="name" required />
        <DarkField id="unlock-email" label="Work email" type="email" value={email} onChange={setEmail} autoComplete="email" required />
        <DarkField id="unlock-phone" label="Phone (optional)" type="tel" value={phone} onChange={setPhone} autoComplete="tel" />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="group mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-slate-900 transition-transform hover:-translate-y-0.5 disabled:opacity-70"
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

function DarkField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  autoComplete,
  required,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-xs font-medium text-slate-300">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded-xl border-0 bg-white/10 px-4 py-3 text-white ring-1 ring-white/15 transition-shadow placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
    </div>
  );
}
