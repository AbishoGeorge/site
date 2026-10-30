import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BadgeCheck, Check, Loader2, Lock, Mail, Phone, RotateCcw } from 'lucide-react';
import { brand } from '../../brand';
import CompanyLogo from './CompanyLogo';

const fields = [
  { id: 'firstName', label: 'First name', type: 'text', autoComplete: 'given-name' },
  { id: 'lastName', label: 'Last name', type: 'text', autoComplete: 'family-name' },
  { id: 'email', label: 'Work email', type: 'email', autoComplete: 'email' },
  { id: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel' },
  { id: 'company', label: 'Company name', type: 'text', autoComplete: 'organization' },
  { id: 'website', label: 'Website', type: 'text', autoComplete: 'url' },
  { id: 'jobTitle', label: 'Job title', type: 'text', autoComplete: 'organization-title', wide: true },
] as const;

type FieldId = (typeof fields)[number]['id'];
type Status = 'idle' | 'sending' | 'sent' | 'email' | 'error';

const exampleContacts = [
  { name: 'Sanne de Vries', title: 'Director of Operations', email: 's•••••@h•••••••••.nl', phone: '+31 6 •• •• •• 42' },
  { name: 'Pieter Jansen', title: 'Head of IT', email: 'p•••••@h•••••••••.nl', phone: '+31 20 ••• •• 17' },
];

export default function RequestStep({ domain, onRestart }: { domain: string; onRestart: () => void }) {
  const [values, setValues] = useState<Record<FieldId, string>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    website: domain,
    jobTitle: '',
  });
  const [status, setStatus] = useState<Status>('idle');

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;
    if (!brand.formEndpoint) {
      // No form service configured: hand the details to the visitor's email app instead.
      const body = fields.map((f) => `${f.label}: ${values[f.id]}`).join('\n');
      window.location.href = `mailto:${brand.email}?subject=${encodeURIComponent(
        `Top accounts request: ${values.website}`
      )}&body=${encodeURIComponent(body)}`;
      setStatus('email');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch(brand.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(values),
      });
      setStatus(res.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:grid-rows-[auto_1fr] lg:gap-x-14 lg:gap-y-0 lg:py-16"
    >
      <div className="lg:col-start-1 lg:row-start-1">
        <div className="flex items-center gap-3">
          <CompanyLogo domain={domain} className="h-10 w-10 rounded-xl shadow-sm ring-1 ring-indigo-100" />
          <span className="text-sm font-medium text-slate-600">{domain}</span>
          <button
            type="button"
            onClick={onRestart}
            className="ml-auto flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-slate-500 ring-1 ring-slate-200 hover:bg-white hover:text-slate-800"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Change website
          </button>
        </div>
        <h1 className="mt-8 text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-slate-900 sm:text-6xl">
          See your top 10 accounts
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
          The companies most likely to buy what {domain} sells this quarter, each with the signal behind it and the people
          to contact. Tell us where to send your list.
        </p>
      </div>

      <ExampleSignal />

      <div className="lg:col-start-1 lg:row-start-2">

        {status === 'sent' || status === 'email' ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-emerald-100 lg:mt-10"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <Check className="h-6 w-6" />
            </span>
            {status === 'sent' ? (
              <>
                <h2 className="mt-5 text-2xl font-bold text-slate-900">Request received</h2>
                <p className="mt-2 text-slate-600">
                  Thanks, {values.firstName}. We'll send your top accounts to {values.email}.
                </p>
              </>
            ) : (
              <>
                <h2 className="mt-5 text-2xl font-bold text-slate-900">One more step</h2>
                <p className="mt-2 text-slate-600">
                  Your email app should have opened with your details, addressed to {brand.email}. Send that email and
                  we'll get your list to you. If nothing opened, email us at{' '}
                  <span className="select-all font-medium text-slate-900">{brand.email}</span>.
                </p>
              </>
            )}
          </motion.div>
        ) : (
          <form onSubmit={submit} className="grid gap-x-5 gap-y-5 sm:grid-cols-2 lg:mt-10">
            {fields.map((f) => (
              <div key={f.id} className={'wide' in f && f.wide ? 'sm:col-span-2' : ''}>
                <label htmlFor={`req-${f.id}`} className="text-sm font-medium text-slate-800">
                  {f.label}
                  <span className="text-orange-600" aria-hidden="true">
                    *
                  </span>
                </label>
                <input
                  id={`req-${f.id}`}
                  name={f.id}
                  type={f.type}
                  required
                  autoComplete={f.autoComplete}
                  value={values[f.id]}
                  onChange={(e) => setValues((v) => ({ ...v, [f.id]: e.target.value }))}
                  className="mt-1.5 block w-full rounded-xl border-0 bg-white px-4 py-3 text-slate-900 shadow-sm ring-1 ring-slate-200 transition-shadow placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={status === 'sending'}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-4 font-semibold text-white shadow-[0_12px_30px_-10px_rgba(49,46,129,0.55)] transition-transform hover:-translate-y-0.5 disabled:opacity-70 sm:w-auto"
              >
                {status === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {status === 'sending' ? 'Sending…' : 'Send me my top accounts'}
                {status !== 'sending' && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
              </button>
              {status === 'error' && (
                <p role="alert" className="mt-3 text-sm text-red-600">
                  We couldn't send that. Please try again, or email us at {brand.email}.
                </p>
              )}
              <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
                <Lock className="h-3.5 w-3.5" />
                We use your details only to prepare and send your list.
              </p>
            </div>
          </form>
        )}
      </div>
    </motion.section>
  );
}

function ExampleSignal() {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:sticky lg:top-24 lg:self-start"
    >
      <p className="text-sm font-semibold text-indigo-600">Example signal</p>
      <div className="mt-3 overflow-hidden rounded-3xl bg-white shadow-[0_30px_80px_-40px_rgba(79,70,229,0.55)] ring-1 ring-indigo-200">
        <div className="bg-gradient-to-br from-indigo-50 via-white to-orange-50/60 p-6 sm:p-7">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Harborline Logistics</h2>
            <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">NL</span>
            <span className="ml-auto rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-700">
              High intent
            </span>
          </div>
          <p className="mt-1.5 text-slate-600">Warehouse automation and WMS replacement</p>
        </div>

        <div className="space-y-6 p-6 sm:p-7">
          <div>
            <h3 className="text-sm font-semibold text-indigo-600">Why now</h3>
            <p className="mt-2 leading-relaxed text-slate-700">
              In its latest annual report the company committed to automating two distribution hubs next year, and it
              has posted three roles for a warehouse systems lead in the past month. Together they point to an active
              buying window for warehouse software and integration partners.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-indigo-600">What they need</h3>
            <ul className="mt-2 space-y-2 text-slate-700">
              {[
                'Replacing a legacy warehouse management system before the new hubs open.',
                'Integration support across carriers and their ERP.',
              ].map((t) => (
                <li key={t} className="flex gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-slate-100 pt-5">
            <h3 className="text-sm font-semibold text-indigo-600">Buyer contacts for this signal</h3>
            <ul className="mt-3 divide-y divide-slate-100">
              {exampleContacts.map((c) => (
                <li key={c.name} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                    {c.name}
                    <BadgeCheck className="h-4 w-4 text-emerald-600" aria-label="Verified" />
                  </div>
                  <div className="text-sm text-slate-500">{c.title}</div>
                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[13px] text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-indigo-500" />
                      {c.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-indigo-500" />
                      {c.phone}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <p className="rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
            Sources: annual report, job postings. Example account; your list is built for your company.
          </p>
        </div>
      </div>
    </motion.aside>
  );
}
