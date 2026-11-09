import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Banknote,
  Check,
  Mail,
  Phone,
  Radar,
  Ticket,
  UserRound,
  UserRoundCheck,
  UserRoundPlus,
  type LucideIcon,
} from 'lucide-react';
import { demoLinkProps, eventHref } from '../brand';
import type { Service } from '../content/stories';
import { TOP_ACCOUNTS_HASH } from './accounts/AccountsFlow';
import { showUseCases } from './usecases/serviceTab';

const ease = [0.22, 1, 0.36, 1] as const;

/** The two service lines, side by side, right after the hero. */
export default function Services() {
  return (
    <section id="services" className="scroll-mt-24 pt-20 sm:pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Two ways we put you in front of buyers
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Use one or both. Each starts from your ideal customer and ends with the people to talk to, why now and how
            to reach them. We work with B2B teams in the UK and India.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2 lg:gap-6">
          <ServiceCard
            n={1}
            service="accounts"
            icon={Radar}
            tile="from-indigo-500 to-violet-600"
            check="text-indigo-600"
            name="Account intelligence"
            title="Accounts that are ready to buy, and the reason why."
            text="We watch your market for buying signals such as funding, new leaders, hiring and expansion, and hand you the accounts in a buying window with the evidence, the right people and a first message."
            points={[
              'Accounts showing buying signals right now',
              'The source and date behind every signal',
              'Decision makers with their contact details',
            ]}
            visual={<SignalFeed />}
            visualBg="bg-indigo-50"
            cta={{ label: 'See my top accounts', href: `#${TOP_ACCOUNTS_HASH}` }}
            delay={0}
          />
          <ServiceCard
            n={2}
            service="events"
            icon={Ticket}
            tile="from-orange-500 to-rose-500"
            check="text-orange-600"
            name="Event intelligence"
            title="Know exactly who to meet at your next event."
            text="Going to a trade show or conference? We gather everyone attending, keep only the people who match your ideal customer, and give you each buyer with their intent and contact details before you arrive."
            points={[
              'The attendee list, filtered to your buyers',
              'Why each person is likely to buy now',
              'Verified email and phone for each one',
            ]}
            visual={<AttendeeFilter />}
            visualBg="bg-orange-50"
            cta={{ label: 'Plan my next event', href: eventHref, external: true }}
            delay={0.08}
          />
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  n,
  service,
  icon: Icon,
  tile,
  check,
  name,
  title,
  text,
  points,
  visual,
  visualBg,
  cta,
  delay,
}: {
  n: number;
  service: Service;
  icon: LucideIcon;
  tile: string;
  check: string;
  name: string;
  title: string;
  text: string;
  points: string[];
  visual: ReactNode;
  visualBg: string;
  cta: { label: string; href: string; external?: boolean };
  delay: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease }}
      className="flex flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_30px_80px_-50px_rgba(49,46,129,0.5)] ring-1 ring-slate-200"
    >
      <div aria-hidden="true" className={`relative h-56 overflow-hidden sm:h-60 ${visualBg}`}>
        {visual}
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <div className="flex items-center gap-3.5">
          <span
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg ${tile}`}
          >
            <Icon className="h-6 w-6" />
          </span>
          <div>
            <div className="text-xs font-semibold text-slate-500">Service {n}</div>
            <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">{name}</h3>
          </div>
        </div>
        <p className="mt-5 font-display text-xl font-semibold leading-snug tracking-tight text-slate-900 sm:text-2xl">
          {title}
        </p>
        <p className="mt-3 leading-relaxed text-slate-600">{text}</p>
        <ul className="mt-5 space-y-2.5">
          {points.map((p) => (
            <li key={p} className="flex items-start gap-2.5 text-slate-700">
              <Check className={`mt-1 h-4 w-4 shrink-0 ${check}`} strokeWidth={3} />
              {p}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-8">
          <a
            href={cta.href}
            {...(cta.external ? demoLinkProps : {})}
            className="group inline-flex items-center gap-3 rounded-full bg-slate-900 py-1.5 pl-5 pr-1.5 font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            {cta.label}
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-900 transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </a>
          <a
            href="#use-cases"
            onClick={() => showUseCases(service)}
            className="group inline-flex items-center gap-1.5 font-semibold text-slate-700 hover:text-slate-900"
          >
            Read the use cases
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}

/** Cycles through a few example signals, lighting up one account at a time. */
function SignalFeed() {
  const rows = [
    { icon: Banknote, label: 'Raised a growth round', meta: 'Fintech · London', when: 'Today' },
    { icon: UserRoundCheck, label: 'Appointed a new CISO', meta: 'Banking · Frankfurt', when: 'Yesterday' },
    { icon: UserRoundPlus, label: 'Hiring a new sales team', meta: 'Software · Austin', when: 'This week' },
  ];
  const ref = useRef<HTMLDivElement>(null);
  const active = useCycle(ref, rows.length, 2400);
  return (
    <div ref={ref} className="absolute inset-0 flex flex-col justify-center gap-2.5 px-6 sm:px-10">
      {rows.map((r, i) => {
        const on = i === active;
        return (
          <div
            key={r.label}
            className={`flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 transition-all duration-500 ${
              on ? 'scale-[1.02] shadow-lg shadow-indigo-900/10 ring-indigo-200' : 'opacity-70 ring-slate-200/70'
            }`}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <r.icon className="h-[18px] w-[18px]" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-slate-900">{r.label}</div>
              <div className="truncate text-xs text-slate-500">{r.meta}</div>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors duration-500 ${
                on ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'text-slate-400'
              }`}
            >
              {on ? 'Buying window' : r.when}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/** A room of attendees with the buyers picked out, and the details you get for one of them. */
function AttendeeFilter() {
  const buyers = [3, 9, 14, 20];
  const ref = useRef<HTMLDivElement>(null);
  const active = useCycle(ref, buyers.length, 2400);
  return (
    <div ref={ref} className="absolute inset-0 flex items-center justify-center gap-6 px-6 sm:gap-8 sm:px-10">
      <div className="grid shrink-0 grid-cols-6 gap-2 sm:gap-2.5">
        {Array.from({ length: 24 }, (_, i) => {
          const buyer = buyers.includes(i);
          const lit = buyers[active] === i;
          return (
            <span
              key={i}
              className={`flex h-7 w-7 items-center justify-center rounded-full transition-all duration-500 sm:h-8 sm:w-8 ${
                buyer
                  ? `bg-gradient-to-br from-orange-400 to-rose-500 text-white ${lit ? 'scale-110 ring-4 ring-orange-200' : ''}`
                  : 'bg-white text-slate-300 ring-1 ring-orange-100'
              }`}
            >
              <UserRound className="h-3.5 w-3.5" />
            </span>
          );
        })}
      </div>
      <div className="hidden w-48 shrink-0 rounded-2xl bg-white p-3.5 shadow-lg shadow-orange-900/10 ring-1 ring-orange-100 min-[480px]:block">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
          <BadgeCheck className="h-3.5 w-3.5" />
          Matches your buyer
        </div>
        <div className="mt-2 text-sm font-semibold text-slate-900">Head of Security</div>
        <div className="text-xs text-slate-500">Retail bank</div>
        <div className="mt-2.5 rounded-lg bg-orange-50 px-2 py-1.5 text-[11px] font-medium text-orange-700">
          Intent: moving to the cloud
        </div>
        <div className="mt-2.5 space-y-1 font-mono text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <Mail className="h-3 w-3 text-indigo-500" />
            he•••@•••••.com
          </div>
          <div className="flex items-center gap-1.5">
            <Phone className="h-3 w-3 text-indigo-500" />
            +44 7••• ••• 210
          </div>
        </div>
      </div>
    </div>
  );
}

/** Steps through 0..count-1 while the element is on screen; stays put for visitors who prefer less motion. */
function useCycle(ref: RefObject<HTMLElement>, count: number, ms: number) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { amount: 0.3 });
  useEffect(() => {
    if (reduce || !inView) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % count), ms);
    return () => window.clearInterval(id);
  }, [count, ms, reduce, inView]);
  return i;
}
