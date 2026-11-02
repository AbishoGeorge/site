import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Check,
  Clock3,
  Contact,
  FileCheck2,
  Filter,
  Loader2,
  Mail,
  Phone,
  Radar,
  UserRoundCheck,
} from 'lucide-react';
import { brand } from '../../brand';
import FloatField, { FloatTextArea } from '../overlay/FloatField';
import OverlayShell from '../overlay/OverlayShell';
import { useHashOverlay } from '../overlay/useHashOverlay';
import { submitLead, type LeadResult } from '../overlay/lead';
import { toDomain } from '../accounts/domain';

/** Location hash that opens the booking page; #book-demo-event opens it set up for event intelligence. */
export const BOOK_DEMO_HASH = /^book-demo(?:-(event))?$/;

// What the page says for each service. The event version is reached from "Plan my next event".
const copy = {
  demo: {
    label: 'Book a demo',
    lines: ['Meet your next customers.', 'Before anyone else does.'],
    intro: 'See the accounts in your market that are ready to buy, the signals behind them and who to contact first.',
    reasons: [
      { icon: Radar, title: 'Your market, live', text: 'Accounts in your space that are showing buying signals today.' },
      { icon: FileCheck2, title: 'The evidence behind each pick', text: 'Every signal dated and linked to its source.' },
      { icon: UserRoundCheck, title: 'Who to reach first', text: 'The decision makers, and what to say to them.' },
    ],
  },
  event: {
    label: 'Plan your next event',
    lines: ['Know who to meet.', 'Before you get there.'],
    intro: "Tell us the event you're going to. We'll show you which attendees are your buyers and how to reach them.",
    reasons: [
      { icon: Filter, title: 'Everyone attending, filtered', text: 'Only the people who match your ideal customer.' },
      { icon: Radar, title: 'Why each one is worth meeting', text: 'The intent behind every name on your list.' },
      { icon: Contact, title: 'Ready to book meetings', text: 'Verified email and phone for each person.' },
    ],
  },
};
const teamSizes = ['Just me', '2-10', '11-50', '51-200', '200+'];

// Personal email providers: with one of these we can't tell the company from the email, so we ask for the website.
const PERSONAL_MAIL =
  /^(gmail|googlemail|yahoo|ymail|outlook|hotmail|live|msn|icloud|me|mac|aol|proton|protonmail|pm|gmx|mail|yandex|zoho|zohomail|rediffmail)\./;

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export default function BookDemo() {
  const { open, close, openCount, param } = useHashOverlay(BOOK_DEMO_HASH);
  const kind = param === 'event' ? 'event' : 'demo';
  const page = copy[kind];
  return (
    <OverlayShell open={open} onClose={close} backLabel="Home" label={page.label}>
      <section className="mx-auto grid min-h-full max-w-6xl content-center items-center gap-4 px-4 pb-4 sm:gap-6 sm:px-6 lg:grid-cols-[1fr_430px] lg:gap-12 lg:pb-6 xl:gap-16 [@media(max-height:700px)]:pb-4">
        {/* On very short screens the form alone is shown. */}
        <div className="tiny:hidden">
          <motion.span
            {...rise(0)}
            className="hidden items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 sm:inline-flex"
          >
            <Clock3 className="h-3.5 w-3.5 text-indigo-600" />
            A 20-minute walkthrough
          </motion.span>
          <motion.h1
            {...rise(0.06)}
            className="text-[1.5rem] font-bold leading-[1.1] tracking-[-0.03em] text-slate-900 min-[380px]:text-[1.625rem] sm:mt-5 sm:text-5xl lg:text-[clamp(2.125rem,3.4vw,3.1rem)]"
          >
            {page.lines[0]}
            <span className="block bg-gradient-to-r from-indigo-600 via-violet-600 to-orange-500 bg-clip-text pb-1 text-transparent">
              {page.lines[1]}
            </span>
          </motion.h1>
          <motion.p {...rise(0.12)} className="mt-4 hidden max-w-xl text-lg leading-relaxed text-slate-600 sm:block">
            {page.intro}
          </motion.p>

          <ul className="mt-6 hidden space-y-3.5 lg:block">
            {page.reasons.map(({ icon: Icon, title, text }, i) => (
              <motion.li key={title} {...rise(0.18 + i * 0.06)} className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-600/25">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <div className="font-semibold text-slate-900">{title}</div>
                  <div className="text-sm text-slate-600">{text}</div>
                </div>
              </motion.li>
            ))}
          </ul>

          <motion.div
            {...rise(0.4)}
            className="mt-8 hidden max-w-sm [@media(min-height:880px)]:lg:block"
            aria-hidden="true"
          >
            {kind === 'event' ? <AttendeeCard /> : <SignalCard />}
          </motion.div>
        </div>

        <motion.div {...rise(0.1)}>
          <DemoForm key={`${openCount}-${kind}`} kind={kind} />
        </motion.div>
      </section>
    </OverlayShell>
  );
}

function DemoForm({ kind }: { kind: 'demo' | 'event' }) {
  const event = kind === 'event';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [team, setTeam] = useState('');
  const [message, setMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [websiteError, setWebsiteError] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | LeadResult>('idle');

  // The company comes from the work email. Only a personal address needs the website asked for separately.
  const emailDomain = toDomain(email.split('@')[1] ?? '');
  const personal = !!emailDomain && PERSONAL_MAIL.test(emailDomain);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;
    if (!emailDomain) {
      setEmailError('Enter your work email, like name@yourcompany.com');
      return;
    }
    const domain = personal ? toDomain(website) : emailDomain;
    if (!domain) {
      setWebsiteError('Enter a website like yourcompany.com');
      return;
    }
    setStatus('sending');
    setStatus(
      await submitLead(kind, {
        Name: name,
        Email: email,
        Website: domain,
        'Team size': team,
        [event ? 'Event' : 'Message']: message.trim(),
      })
    );
  };

  if (status === 'sent' || status === 'email') {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-[0_30px_80px_-40px_rgba(49,46,129,0.5)] ring-1 ring-slate-200 sm:p-10">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <Check className="h-7 w-7" />
        </span>
        {status === 'sent' ? (
          <>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
              {event ? "We're on it" : "You're booked in"}
            </h2>
            <p className="mt-3 text-slate-600">
              Thanks, {name.split(' ')[0]}. We'll email {email}{' '}
              {event ? 'to talk through your event and the buyers you want to meet.' : 'to pick a time that suits you.'}
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
      className="rounded-3xl bg-white p-5 shadow-[0_30px_80px_-40px_rgba(49,46,129,0.5)] ring-1 ring-slate-200 sm:p-6 [@media(max-height:700px)]:p-5"
    >
      <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
        {event ? 'Plan your next event' : 'Book your demo'}
      </h2>
      <p className="mt-1 text-balance text-sm text-slate-500 tiny:hidden">
        {event
          ? "Tell us the event. We'll email you to talk through your list."
          : "It takes 30 seconds. We'll email you to pick a time."}
      </p>

      <div className="mt-4 space-y-2.5">
        <FloatField id="demo-name" label="Full name" value={name} onChange={setName} autoComplete="name" required />
        <FloatField
          id="demo-email"
          label="Work email"
          type="email"
          value={email}
          onChange={(v) => {
            setEmail(v);
            if (emailError) setEmailError('');
          }}
          autoComplete="email"
          error={emailError}
          required
        />
        <AnimatePresence initial={false}>
          {personal && (
            <motion.div
              key="website"
              // Clipped only while it opens or closes, so the focus ring isn't cut off.
              initial={{ height: 0, opacity: 0, overflow: 'hidden' }}
              animate={{ height: 'auto', opacity: 1, transitionEnd: { overflow: 'visible' } }}
              exit={{ height: 0, opacity: 0, overflow: 'hidden' }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <FloatField
                id="demo-website"
                label="Company website"
                value={website}
                onChange={(v) => {
                  setWebsite(v);
                  if (websiteError) setWebsiteError('');
                }}
                inputMode="url"
                autoComplete="url"
                placeholder="yourcompany.com"
                error={websiteError}
                required
              />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Optional, so phones skip it to keep the form on one screen. */}
        <fieldset className="hidden sm:block">
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
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium ring-1 transition-colors ${
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
        <FloatTextArea
          id="demo-message"
          label={event ? 'Which event? (optional)' : 'How can we help? (optional)'}
          value={message}
          onChange={setMessage}
          placeholder={event ? 'Event name and dates' : 'Your questions or goals'}
        />
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="group mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 font-semibold text-white shadow-[0_12px_30px_-10px_rgba(49,46,129,0.55)] transition-transform hover:-translate-y-0.5 disabled:opacity-70"
      >
        {status === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {status === 'sending' ? 'Sending…' : event ? 'Plan my event' : 'Book my demo'}
        {status !== 'sending' && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
      </button>
      {status === 'error' && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          That didn't go through. Please try again, or email {brand.email}.
        </p>
      )}
      <p className="mt-3 text-balance text-center text-xs text-slate-500">
        No commitment. We only use your details to {event ? 'plan your event' : 'arrange the demo'}.
      </p>
    </form>
  );
}

/** Example of what account intelligence delivers, shown beside the form on tall screens. */
function SignalCard() {
  return (
    <div className="animate-[float_6s_ease-in-out_infinite] rounded-2xl bg-white p-4 shadow-[0_24px_60px_-28px_rgba(49,46,129,0.45)] ring-1 ring-indigo-100">
      <div className="flex items-center gap-2 text-xs">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-orange-50 text-orange-600">
          <Banknote className="h-3.5 w-3.5" />
        </span>
        <span className="font-semibold text-orange-700">Funding</span>
        <span className="ml-auto text-slate-500">2 days ago</span>
      </div>
      <div className="mt-2 text-sm font-semibold text-slate-900">Raised a $45M Series B to expand into Europe</div>
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
  );
}

/** Example of what event intelligence delivers: one attendee who matches the buyer profile. */
function AttendeeCard() {
  return (
    <div className="animate-[float_6s_ease-in-out_infinite] rounded-2xl bg-white p-4 shadow-[0_24px_60px_-28px_rgba(49,46,129,0.45)] ring-1 ring-indigo-100">
      <div className="flex items-center gap-2 text-xs">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
          <BadgeCheck className="h-3.5 w-3.5" />
        </span>
        <span className="font-semibold text-emerald-700">Matches your buyer</span>
        <span className="ml-auto text-slate-500">Attending</span>
      </div>
      <div className="mt-2 text-sm font-semibold text-slate-900">Head of Security at a retail bank</div>
      <div className="mt-1 text-xs text-orange-700">Intent: moving core systems to the cloud</div>
      <div className="mt-3 flex items-center gap-3 border-t border-slate-100 pt-3 font-mono text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <Mail className="h-3 w-3" />
          he•••@•••.com
        </span>
        <span className="flex items-center gap-1">
          <Phone className="h-3 w-3" />
          +44 7••• ••• 210
        </span>
      </div>
    </div>
  );
}
