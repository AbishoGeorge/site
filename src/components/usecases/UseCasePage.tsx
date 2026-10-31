import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Clock3,
  Inbox,
  ListChecks,
  PenLine,
  Radar,
  Sparkles,
  Target,
  UserRound,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';
import { industries, type Industry } from '../../content/industries';
import { demoHref, demoLinkProps } from '../../brand';
import OverlayShell from '../overlay/OverlayShell';
import { useHashOverlay } from '../overlay/useHashOverlay';
import { TOP_ACCOUNTS_HASH } from '../accounts/AccountsFlow';
import { signalIcon } from '../signalIcon';
import { IndustryArt } from './IndustryArt';
import { accentStyle, industryIcon } from './industryStyle';
import { USE_CASE_HASH, linkToUseCase } from './links';

export default function UseCasePage() {
  const { open, close, param } = useHashOverlay(USE_CASE_HASH);
  const index = industries.findIndex((c) => c.id === param);
  const industry = index >= 0 ? industries[index] : undefined;
  const next = industries[(index + 1) % industries.length];

  return (
    <OverlayShell
      open={open && !!industry}
      onClose={close}
      backLabel="Back"
      label={industry ? industry.title : 'Use case'}
      scrollKey={param}
    >
      {industry && <UseCase key={industry.id} industry={industry} next={next} />}
    </OverlayShell>
  );
}

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
});

function UseCase({ industry, next }: { industry: Industry; next: Industry }) {
  const Icon = industryIcon[industry.icon];
  const NextIcon = industryIcon[next.icon];
  const a = accentStyle[industry.accent];

  return (
    <article className="mx-auto max-w-6xl px-4 pb-16 pt-2 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr] lg:items-stretch lg:gap-10">
        <motion.div
          {...rise(0)}
          className="relative min-h-[300px] overflow-hidden rounded-[28px] bg-slate-900 text-white sm:min-h-[380px]"
        >
          <IndustryArt visual={industry.visual} className="absolute inset-0 h-full w-full" />
          <div className="relative flex h-full min-h-[300px] flex-col justify-between p-7 sm:min-h-[380px] sm:p-9">
            <span className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur">
                <Icon className="h-5 w-5" />
              </span>
              <span className="font-display text-xl font-bold tracking-tight">{industry.name}</span>
            </span>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">When buying happens</div>
              <p className="mt-2 max-w-md font-display text-xl font-semibold leading-snug sm:text-2xl">{industry.moment}</p>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col justify-center">
          <motion.span
            {...rise(0.08)}
            className="flex w-fit items-center gap-1.5 rounded-full bg-white py-1 pl-1.5 pr-3 text-xs font-semibold text-slate-700 ring-1 ring-slate-200"
          >
            <span className={`flex h-5 w-5 items-center justify-center rounded-full ${a.soft} ${a.text}`}>
              <Icon className="h-3 w-3" />
            </span>
            Use case
          </motion.span>
          <motion.h1
            {...rise(0.14)}
            className="mt-4 text-3xl font-bold leading-[1.08] tracking-[-0.03em] text-slate-900 sm:text-5xl"
          >
            {industry.title}
          </motion.h1>
          <motion.p {...rise(0.2)} className="mt-4 text-lg leading-relaxed text-slate-600">
            {industry.summary}
          </motion.p>
          <motion.p {...rise(0.26)} className="mt-5 flex items-start gap-2.5 text-sm leading-relaxed text-slate-600">
            <Target className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
            <span>
              <span className="font-semibold text-slate-900">Who it's for: </span>
              {upperFirst(industry.audience)}
            </span>
          </motion.p>
        </div>
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <section>
          <Heading icon={AlertTriangle} tone="bg-rose-50 text-rose-600">
            The problem
          </Heading>
          <p className="mt-4 leading-relaxed text-slate-700">{industry.problem}</p>
        </section>
        <section aria-label="What goes wrong today" className="lg:self-center">
          <ul className="space-y-3">
            {industry.pains.map((p) => (
              <li key={p} className="flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-rose-400" />
                <span className="leading-relaxed text-slate-700">{p}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-14">
        <Heading icon={Radar} tone={`${a.soft} ${a.text}`}>
          What we watch, and why it matters
        </Heading>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {industry.signals.map((s) => {
            const SIcon = signalIcon(s.label);
            return (
              <li key={s.label} className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${a.soft} ${a.text}`}>
                  <SIcon className="h-[18px] w-[18px]" />
                </span>
                <div className="mt-3 font-semibold text-slate-900">{s.label}</div>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{s.why}</p>
              </li>
            );
          })}
          {/* Fills the last row of the grid with the next step. */}
          {industry.signals.length % 3 !== 0 && (
            <li className="hidden lg:block">
              <a
                href={`#${TOP_ACCOUNTS_HASH}`}
                className="group flex h-full flex-col justify-between rounded-2xl bg-slate-900 p-5 text-white transition-transform hover:-translate-y-0.5"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-indigo-300">
                  <Radar className="h-[18px] w-[18px]" />
                </span>
                <span>
                  <span className="mt-3 block font-semibold">See these signals in your market</span>
                  <span className="mt-1 flex items-center gap-1.5 text-sm text-slate-300 transition-colors group-hover:text-white">
                    Preview your top accounts
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </span>
              </a>
            </li>
          )}
        </ul>
      </section>

      <div className="mt-14 grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
        <section>
          <Heading icon={ListChecks} tone="bg-indigo-50 text-indigo-600">
            How it works
          </Heading>
          <ol className="mt-5 space-y-3">
            {industry.steps.map((step, i) => (
              <li key={step} className="flex gap-4 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="leading-relaxed text-slate-700">{step}</span>
              </li>
            ))}
          </ol>
        </section>
        <section>
          <Heading icon={UsersRound} tone="bg-indigo-50 text-indigo-600">
            Who we help you reach
          </Heading>
          <ul className="mt-5 space-y-2.5">
            {industry.buyers.map((b) => (
              <li key={b} className="flex items-center gap-3 rounded-2xl bg-white p-3.5 ring-1 ring-slate-200">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white">
                  <UserRound className="h-4 w-4" />
                </span>
                <span className="font-medium text-slate-800">{b}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="relative mt-14 overflow-hidden rounded-[28px] bg-slate-950 p-6 text-white sm:p-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(148,163,184,0.25)_1px,transparent_1px)] [background-size:22px_22px]"
        />
        <div className="relative">
          <h2 className="flex items-center gap-2.5 text-xl font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-indigo-300">
              <Inbox className="h-4 w-4" />
            </span>
            What lands in your inbox
          </h2>
          <p className="mt-2 text-sm text-slate-400">One account, as your team would receive it.</p>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl bg-white p-5 text-slate-900 sm:p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <Building2 className="h-5 w-5" />
                </span>
                <span className="font-semibold">{industry.brief.account}</span>
              </div>
              <dl className="mt-5 space-y-4 text-sm">
                <BriefRow icon={Radar} label="Signal">
                  {industry.brief.signal}
                </BriefRow>
                <BriefRow icon={Clock3} label="Why now">
                  {industry.brief.whyNow}
                </BriefRow>
                <BriefRow icon={UserRound} label="Who to contact">
                  {industry.brief.contact}
                </BriefRow>
              </dl>
            </div>
            <div className="flex flex-col rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 sm:p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-indigo-200">
                <PenLine className="h-4 w-4" />
                First message, written from the signal
              </div>
              <p className="mt-4 flex-1 text-lg leading-relaxed text-white">{industry.brief.opener}</p>
              <div className="mt-5 flex items-center gap-2 text-xs text-slate-400">
                <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
                Your reps edit and send it from their own inbox.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <Heading icon={CheckCircle2} tone="bg-emerald-50 text-emerald-600">
          What changes for your team
        </Heading>
        <ul className="mt-5 grid gap-3 md:grid-cols-3">
          {industry.outcomes.map((o) => (
            <li key={o} className="flex items-start gap-3 rounded-2xl bg-white p-5 ring-1 ring-slate-200">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
              <span className="leading-relaxed text-slate-700">{o}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-10 flex flex-col gap-6 rounded-[28px] bg-white p-6 ring-1 ring-slate-200 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
        <a
          href={linkToUseCase(next.id)}
          onClick={(e) => {
            // Swap use cases in place, so Back still returns to the page in one step.
            e.preventDefault();
            window.location.replace(linkToUseCase(next.id));
          }}
          className="group flex items-center gap-4"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <NextIcon className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Next use case</span>
            <span className="flex items-center gap-1.5 font-semibold text-slate-900">
              {next.name}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </span>
        </a>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href={`#${TOP_ACCOUNTS_HASH}`}
            className="group inline-flex items-center justify-center gap-3 rounded-full bg-slate-900 py-1.5 pl-5 pr-1.5 font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            See my top accounts
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-900 transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </a>
          <a
            href={demoHref}
            {...demoLinkProps}
            className="inline-flex items-center justify-center rounded-full px-5 py-3 font-semibold text-slate-800 ring-1 ring-slate-300 transition-colors hover:bg-slate-50"
          >
            Book a demo
          </a>
        </div>
      </div>
    </article>
  );
}

function Heading({ icon: Icon, tone, children }: { icon: LucideIcon; tone: string; children: ReactNode }) {
  return (
    <h2 className="flex items-center gap-2.5 text-xl font-bold text-slate-900">
      <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${tone}`}>
        <Icon className="h-4 w-4" />
      </span>
      {children}
    </h2>
  );
}

function BriefRow({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: ReactNode }) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
      <div>
        <dt className="text-xs font-medium text-slate-500">{label}</dt>
        <dd className="mt-0.5 leading-relaxed text-slate-800">{children}</dd>
      </div>
    </div>
  );
}

const upperFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
