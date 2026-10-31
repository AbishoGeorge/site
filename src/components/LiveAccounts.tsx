import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, BadgeCheck, CalendarDays, Mail, MapPin, Send, Zap, type LucideIcon } from 'lucide-react';
import { TOP_ACCOUNTS_HASH } from './accounts/AccountsFlow';

// Illustrative accounts: invented companies and people, shown to give a feel for the list.
interface Account {
  id: string;
  name: string;
  initials: string;
  tile: string;
  segment: string;
  location: string;
  when: string;
  score: number;
  signal: string;
  context: string;
  contact: { name: string; title: string; email: string };
  angle: string;
}

const accounts: Account[] = [
  {
    id: 'kelvar',
    name: 'Kelvar Logistics',
    initials: 'KL',
    tile: 'from-sky-500 to-indigo-600',
    segment: '3PL and warehousing · 1,800 employees',
    location: 'Rotterdam, NL',
    when: '3 days ago',
    score: 5,
    signal: 'Two automated distribution hubs approved',
    context: 'The board signed off on automating both hubs before peak season. A warehouse systems tender is due next quarter.',
    contact: { name: 'Sanne V.', title: 'Director of Operations', email: 'sa•••@k••••••.nl' },
    angle: 'Lead with go-live risk: the hubs open in Q3 and no integration partner has been chosen.',
  },
  {
    id: 'brightwell',
    name: 'Brightwell Pay',
    initials: 'BP',
    tile: 'from-violet-500 to-fuchsia-600',
    segment: 'Fintech · 420 employees',
    location: 'London, UK',
    when: '2 days ago',
    score: 5,
    signal: 'Raised a $45M Series B to expand into Europe',
    context: 'Opening offices in Amsterdam and Madrid and doubling the finance team this year.',
    contact: { name: 'Priya S.', title: 'Head of Finance Operations', email: 'pr•••@b•••••••.com' },
    angle: 'Multi-country finance is about to get harder. Offer a faster path to a consolidated close.',
  },
  {
    id: 'vantora',
    name: 'Vantora Health',
    initials: 'VH',
    tile: 'from-emerald-500 to-teal-600',
    segment: 'Healthcare network · 7,200 employees',
    location: 'Austin, US',
    when: '5 days ago',
    score: 4,
    signal: 'New VP of Revenue Cycle hired',
    context: 'Three clinics opening across Texas, and job posts mention replacing the billing platform.',
    contact: { name: 'Megan W.', title: 'VP of Revenue Cycle', email: 'me•••@v••••••.com' },
    angle: 'Reach out in the first 90 days, before the vendor shortlist is set.',
  },
  {
    id: 'solenne',
    name: 'Solenne Retail Group',
    initials: 'SR',
    tile: 'from-orange-500 to-rose-500',
    segment: 'Retail · 3,100 employees',
    location: 'Lyon, FR',
    when: '1 week ago',
    score: 4,
    signal: 'CIO named unified commerce the top priority',
    context: 'On the earnings call, leadership said store and online inventory will run on one platform by 2027.',
    contact: { name: 'Julien M.', title: 'Chief Information Officer', email: 'ju•••@s••••••.fr' },
    angle: 'Tie your pitch to the unified-commerce goal and its 2027 deadline.',
  },
  {
    id: 'orbiq',
    name: 'Orbiq Components',
    initials: 'OC',
    tile: 'from-amber-500 to-orange-600',
    segment: 'Manufacturing · 2,400 employees',
    location: 'Pune, IN',
    when: '4 days ago',
    score: 5,
    signal: 'New plant announced, 600 hires planned',
    context: 'The plant goes live next year. Tenders for manufacturing and quality systems are being prepared.',
    contact: { name: 'Arjun M.', title: 'VP of Plant Operations', email: 'ar•••@o•••••.in' },
    angle: 'Get on the shortlist before the tender is published.',
  },
];

const ADVANCE_MS = 5000;

export default function LiveAccounts() {
  const [active, setActive] = useState(1);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView || paused || reduce) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % accounts.length), ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [inView, paused, reduce]);

  const n = accounts.length;

  return (
    <section id="live-accounts" className="scroll-mt-24 px-2 pt-2 sm:px-4 sm:pt-4">
      <div
        ref={ref}
        className="relative mx-auto max-w-[1600px] overflow-hidden rounded-[28px] bg-slate-950 py-20 sm:py-24"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-50 [background-image:radial-gradient(rgba(148,163,184,0.18)_1px,transparent_1px)] [background-size:24px_24px]"
        />

        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
            This is what your active targets look like
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            Every account arrives with the signal, the context and the person to contact, ready for your team to act
            on.
          </p>
        </div>

        <p className="sr-only">
          A rotating preview of what each account brief contains: a buying signal, why it matters now and who to
          contact.
        </p>
        <div
          aria-hidden="true"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="relative mt-14 grid select-none items-start justify-items-center [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
        >
          {accounts.map((a, i) => {
            // Position relative to the center card, wrapped into -2..2 so the loop never shows a jump.
            const rel = ((i - active + n + 2) % n) - 2;
            return (
              <motion.div
                key={a.id}
                initial={false}
                animate={{
                  x: `${rel * 104}%`,
                  scale: rel === 0 ? 1 : 0.92,
                  opacity: Math.abs(rel) > 1 ? 0 : rel === 0 ? 1 : 0.55,
                }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                style={{ zIndex: rel === 0 ? 2 : 1 }}
                className="col-start-1 row-start-1 w-[min(880px,78vw)]"
              >
                <AccountCard account={a} active={rel === 0} />
              </motion.div>
            );
          })}
        </div>

        <div className="relative mt-12 flex flex-col items-center gap-3 px-6">
          <a
            href={`#${TOP_ACCOUNTS_HASH}`}
            className="group inline-flex items-center gap-4 rounded-full bg-white py-1.5 pl-7 pr-1.5 text-lg font-semibold text-slate-900 shadow-[0_20px_50px_-15px_rgba(129,140,248,0.6)] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            See my top accounts
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-white transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight className="h-5 w-5" />
            </span>
          </a>
          <span className="text-sm text-slate-400">Free preview for your company · Company names are illustrative</span>
        </div>
      </div>
    </section>
  );
}

function AccountCard({ account: a, active }: { account: Account; active: boolean }) {
  return (
    <article className="overflow-hidden rounded-[24px] bg-white text-left shadow-[0_40px_100px_-40px_rgba(0,0,0,0.8)]">
      <header className="flex flex-wrap items-center gap-x-10 gap-y-4 border-b border-slate-100 px-6 py-5 sm:px-8 sm:py-6">
        <div className="flex min-w-0 flex-1 basis-64 items-center gap-4">
          <span
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-base font-bold text-white shadow-md ${a.tile}`}
          >
            {a.initials}
          </span>
          <div className="min-w-0">
            <div className="truncate text-xl font-bold text-slate-900 sm:text-2xl">{a.name}</div>
            <div className="truncate text-sm text-slate-500">{a.segment}</div>
          </div>
        </div>
        <Meta label="Location">
          <MapPin className="h-4 w-4 text-slate-400" />
          {a.location}
        </Meta>
        <Meta label="Signal spotted">
          <CalendarDays className="h-4 w-4 text-slate-400" />
          {a.when}
        </Meta>
        <Meta label="Relevance">
          <Bars score={a.score} active={active} />
          <span className="text-slate-500">{a.score}</span>
        </Meta>
      </header>

      <div className="grid gap-x-10 gap-y-5 px-6 py-6 sm:px-8 sm:py-7 md:grid-cols-2">
        <Subhead icon={Zap}>Why reach out now?</Subhead>
        <Block label="Signal">{a.signal}</Block>
        <Block label="Context">{a.context}</Block>
        <Subhead icon={Send} className="mt-2">
          Outreach plan
        </Subhead>
        <Block label="Contact">
          <span className="flex items-center gap-1.5 font-semibold">
            {a.contact.name}
            <BadgeCheck className="h-4 w-4 text-emerald-600" />
          </span>
          <span className="block text-slate-600">{a.contact.title}</span>
          <span className="mt-1 flex items-center gap-1.5 font-mono text-sm text-slate-500">
            <Mail className="h-3.5 w-3.5" />
            {a.contact.email}
          </span>
        </Block>
        <Block label="Best way in">{a.angle}</Block>
      </div>
    </article>
  );
}

function Subhead({ icon: Icon, className = '', children }: { icon: LucideIcon; className?: string; children: string }) {
  return (
    <h3 className={`flex items-center gap-2.5 text-lg font-semibold text-indigo-600 md:col-span-2 ${className}`}>
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50">
        <Icon className="h-4 w-4" />
      </span>
      {children}
    </h3>
  );
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-medium text-slate-500">{label}</div>
      <div className="mt-1 flex items-center gap-1.5 text-base font-medium text-slate-900">{children}</div>
    </div>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-sm font-medium text-slate-500">{label}</div>
      <div className="mt-1.5 leading-relaxed text-slate-900">{children}</div>
    </div>
  );
}

function Bars({ score, active }: { score: number; active: boolean }) {
  return (
    <span className="flex items-end gap-1">
      {[0, 1, 2, 3, 4].map((b) => (
        <motion.span
          key={b}
          initial={false}
          animate={{ height: active ? 7 + b * 3 : 4 }}
          transition={{ duration: 0.5, delay: active ? 0.3 + b * 0.06 : 0 }}
          className={`w-2 rounded-sm ${b < score ? 'bg-indigo-600' : 'bg-indigo-100'}`}
        />
      ))}
    </span>
  );
}
