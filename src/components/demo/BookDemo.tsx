import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BadgeCheck, Check, Clock3, Crosshair, Globe, Landmark, Loader2, Mail, Users } from 'lucide-react';
import { brand } from '../../brand';
import OverlayShell from '../overlay/OverlayShell';
import { useHashOverlay } from '../overlay/useHashOverlay';
import { submitLead, type LeadResult } from '../overlay/lead';
import { toDomain } from '../accounts/domain';

/** Location hash that opens the booking page. */
export const BOOK_DEMO_HASH = 'book-demo';

const reasons = [
  { icon: Globe, title: 'Your market, live', text: 'Accounts in your space showing buying signals right now.' },
  { icon: Crosshair, title: 'The evidence behind each pick', text: 'Every signal dated and linked to its source.' },
  { icon: Users, title: 'Who to reach first', text: 'The decision makers, and what to say to them.' },
];
const teamSizes = ['Just me', '2–10', '11–50', '51–200', '200+'];

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export default function BookDemo() {
  const { open, close, openCount } = useHashOverlay(BOOK_DEMO_HASH);
  return (
    <OverlayShell open={open} onClose={close} label="Book a demo">
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:min-h-[calc(100svh-65px)] lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-14">
        <div>
          <motion.span
            {...rise(0)}
            className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200"
          >
            <Clock3 className="h-3.5 w-3.5 text-indigo-600" />
            Book a demo · 20 minutes
          </motion.span>
          <motion.h1
            {...rise(0.06)}
            className="mt-6 text-4xl font-bold leading-[1.04] tracking-[-0.03em] text-slate-900 sm:text-6xl"
          >
            Meet your next customers.
            <span className="block bg-gradient-to-r from-indigo-600 via-violet-600 to-orange-500 bg-clip-text pb-1 text-transparent">
              Before anyone else does.
            </span>
          </motion.h1>
          <motion.p {...rise(0.12)} className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
            A short walkthrough of the accounts in your market that are ready to buy, the signals behind them and who to
            contact.
          </motion.p>

          <ul className="mt-8 space-y-4">
            {reasons.map(({ icon: Icon, title, text }, i) => (
              <motion.li key={title} {...rise(0.18 + i * 0.06)} className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/25">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <div className="font-semibold text-slate-900">{title}</div>
                  <div className="text-sm text-slate-600">{text}</div>
                </div>
              </motion.li>
            ))}
          </ul>

          <motion.div {...rise(0.4)} className="mt-10 hidden max-w-sm lg:block" aria-hidden="true">
            <div className="animate-[float_6s_ease-in-out_infinite] rounded-2xl bg-white p-4 shadow-[0_24px_60px_-28px_rgba(49,46,129,0.45)] ring-1 ring-indigo-100">
              <div className="flex items-center gap-2 text-xs">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-orange-50 text-orange-600">
                  <Landmark className="h-3.5 w-3.5" />
                </span>
                <span className="font-semibold text-orange-700">Funding</span>
                <span className="ml-auto text-slate-500">2 days ago</span>
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-900">
                Raised a $45M Series B to expand into Europe
              </div>
              <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-[10px] font-bold text-white">
                  PS
                </span>
                Priya S. · Head of Finance
                <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span className="ml-auto flex items-center gap-1 font-mono text-[11px] text-slate-500">
                  <Mail className="h-3 w-3" />
                  pr•••@•••.com
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div {...rise(0.1)}>
          <DemoForm key={openCount} />
        </motion.div>
      </section>
    </OverlayShell>
  );
}

function DemoForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [team, setTeam] = useState('');
  const [websiteError, setWebsiteError] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | LeadResult>('idle');

  // Suggest the website from a work email once one is typed.
  useEffect(() => {
    if (website) return;
    const domain = email.split('@')[1];
    if (domain && toDomain(domain) && !/^(gmail|yahoo|outlook|hotmail|icloud|proton)\./.test(domain))
      setWebsite(domain);
    // Only react to the email changing; an edited website is left alone.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;
    const domain = toDomain(website);
    if (!domain) {
      setWebsiteError('Enter a website like yourcompany.com');
      return;
    }
    setStatus('sending');
    setStatus(await submitLead('demo', { Name: name, Email: email, Website: domain, 'Team size': team }));
  };

  if (status === 'sent' || status === 'email') {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-[0_30px_80px_-40px_rgba(49,46,129,0.5)] ring-1 ring-slate-200 sm:p-10">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <Check className="h-7 w-7" />
        </span>
        {status === 'sent' ? (
          <>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">You're booked in</h2>
            <p className="mt-3 text-slate-600">
              Thanks, {name.split(' ')[0]}. We'll email {email} to pick a time that suits you.
            </p>
          </>
        ) : (
          <>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">One more step</h2>
            <p className="mt-3 text-slate-600">
              Your email app should have opened with your request. Send it and we'll get back to you to pick a time. If
              nothing opened, write to <span className="select-all font-medium text-slate-900">{brand.email}</span>.
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-3xl bg-white p-6 shadow-[0_30px_80px_-40px_rgba(49,46,129,0.5)] ring-1 ring-slate-200 sm:p-9"
    >
      <h2 className="text-2xl font-bold tracking-tight text-slate-900">Book your demo</h2>
      <p className="mt-1 text-sm text-slate-500">Takes 30 seconds. We'll email you to pick a time.</p>

      <div className="mt-7 space-y-4">
        <Field id="demo-name" label="Full name" value={name} onChange={setName} autoComplete="name" required />
        <Field
          id="demo-email"
          label="Work email"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          required
        />
        <Field
          id="demo-website"
          label="Company website"
          value={website}
          onChange={(v) => {
            setWebsite(v);
            if (websiteError) setWebsiteError('');
          }}
          autoComplete="url"
          placeholder="yourcompany.com"
          error={websiteError}
          required
        />
        <fieldset>
          <legend className="text-sm font-medium text-slate-800">
            Sales team size <span className="font-normal text-slate-400">(optional)</span>
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {teamSizes.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={team === t}
                onClick={() => setTeam(team === t ? '' : t)}
                className={`rounded-full px-3.5 py-2 text-sm font-medium ring-1 transition-colors ${
                  team === t
                    ? 'bg-slate-900 text-white ring-slate-900'
                    : 'bg-white text-slate-700 ring-slate-200 hover:bg-slate-50 hover:ring-slate-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="group mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-4 font-semibold text-white shadow-[0_12px_30px_-10px_rgba(49,46,129,0.55)] transition-transform hover:-translate-y-0.5 disabled:opacity-70"
      >
        {status === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {status === 'sending' ? 'Sending…' : 'Book my demo'}
        {status !== 'sending' && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
      </button>
      {status === 'error' && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          That didn't go through. Please try again, or email {brand.email}.
        </p>
      )}
      <p className="mt-4 text-center text-xs text-slate-500">
        No commitment. We only use your details to arrange the demo.
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = 'text',
  autoComplete,
  placeholder,
  error,
  required,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-slate-800">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1.5 block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-slate-900 ring-1 transition-shadow placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          error ? 'ring-red-400' : 'ring-slate-200'
        }`}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
