import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Building2, Check } from 'lucide-react';
import { serviceName, stories, storiesFor, type Story } from '../../content/stories';
import { demoHref, demoLinkProps, eventHref } from '../../brand';
import OverlayShell from '../overlay/OverlayShell';
import { useHashOverlay } from '../overlay/useHashOverlay';
import { TOP_ACCOUNTS_HASH } from '../accounts/AccountsFlow';
import { signalIcon } from '../signalIcon';
import { IndustryArt } from './IndustryArt';
import { accentStyle, industryIcon } from './industryStyle';
import { USE_CASE_HASH, linkToUseCase } from './links';

export default function UseCasePage() {
  const { open, close, param } = useHashOverlay(USE_CASE_HASH);
  const story = stories.find((s) => s.id === param);
  // "Next" stays within the same service.
  const siblings = story ? storiesFor(story.service) : [];
  const next = story ? siblings[(siblings.indexOf(story) + 1) % siblings.length] : undefined;

  return (
    <OverlayShell
      open={open && !!story}
      onClose={close}
      backLabel="Back"
      label={story ? story.useCase.title : 'Use case'}
      scrollKey={param}
    >
      {story && next && <UseCase key={story.id} story={story} next={next} />}
    </OverlayShell>
  );
}

const ease = [0.22, 1, 0.36, 1] as const;
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease },
});

/** One company's story, read top to bottom: the problem, how we solve it, the outcome. */
function UseCase({ story: item, next }: { story: Story; next: Story }) {
  const Icon = industryIcon[item.icon];
  const NextIcon = industryIcon[next.icon];
  const a = accentStyle[item.accent];
  const story = item.useCase;
  const events = item.service === 'events';

  return (
    <article className="mx-auto max-w-4xl px-4 pb-16 pt-2 sm:px-6">
      <header className="grid items-stretch gap-6 md:grid-cols-[1.5fr_1fr] md:gap-8">
        <div className="flex flex-col justify-center">
          <motion.span
            {...rise(0)}
            className="flex w-fit items-center gap-2 rounded-full bg-white py-1 pl-1 pr-3 text-xs font-semibold text-slate-700 ring-1 ring-slate-200"
          >
            <span className={`flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br text-white ${a.tile}`}>
              <Icon className="h-3.5 w-3.5" />
            </span>
            {serviceName[item.service]} · {item.tag}
          </motion.span>
          <motion.h1
            {...rise(0.06)}
            className="mt-4 text-3xl font-bold leading-[1.1] tracking-[-0.03em] text-slate-900 sm:text-[2.5rem]"
          >
            {story.title}
          </motion.h1>
          <motion.p {...rise(0.12)} className="mt-4 flex items-start gap-2.5 text-slate-600">
            <Building2 className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
            {story.company}
          </motion.p>
        </div>
        <motion.div
          {...rise(0.08)}
          aria-hidden="true"
          className="relative hidden min-h-[220px] overflow-hidden rounded-[24px] bg-slate-900 md:block"
        >
          <IndustryArt visual={item.visual} align="top" className="absolute inset-0 h-full w-full" />
        </motion.div>
      </header>

      {/* The three steps share one line down the left, so the reading order is obvious. */}
      <ol className="relative mt-10 space-y-4 before:absolute before:bottom-10 before:left-6 before:top-10 before:hidden before:w-px before:bg-slate-200 sm:mt-12 sm:space-y-5 sm:before:block">
        <Step n={1} tone="bg-rose-500" title="The problem" delay={0.16}>
          <p>{story.problem}</p>
        </Step>
        <Step n={2} tone={`bg-gradient-to-br ${a.tile}`} title="How we solve it" delay={0.24}>
          <p>{story.solution}</p>
          <ul className="mt-4 flex flex-wrap gap-2" aria-label={events ? 'What you get' : 'Signals we use'}>
            {story.signals.map((s) => {
              const SIcon = signalIcon(s);
              return (
                <li
                  key={s}
                  className={`flex items-center gap-1.5 rounded-full py-1 pl-2 pr-3 text-sm font-medium ${a.soft} ${a.text}`}
                >
                  <SIcon className="h-3.5 w-3.5" />
                  {s}
                </li>
              );
            })}
          </ul>
        </Step>
        <Step n={3} tone="bg-emerald-500" title="The outcome" delay={0.32}>
          <ul className="space-y-2.5">
            {story.outcomes.map((o) => (
              <li key={o} className="flex items-start gap-2.5">
                <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-600" strokeWidth={3} />
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </Step>
      </ol>

      <div className="relative mt-10 overflow-hidden rounded-[28px] bg-slate-900 p-6 text-white sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(closest-side,rgba(129,140,248,0.4),transparent)]" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold sm:text-2xl">
              {events ? 'Going to an event soon?' : 'See these signals in your market'}
            </h2>
            <p className="mt-1 text-slate-300">
              {events
                ? "Tell us which one. We'll show you the buyers in the room and how to reach them."
                : 'Preview your top accounts in a minute, or talk it through with us.'}
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <a
              href={events ? eventHref : `#${TOP_ACCOUNTS_HASH}`}
              {...(events ? demoLinkProps : {})}
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-white py-1.5 pl-5 pr-1.5 font-semibold text-slate-900 transition-transform hover:-translate-y-0.5"
            >
              {events ? 'Plan my next event' : 'See my top accounts'}
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </a>
            <a
              href={demoHref}
              {...demoLinkProps}
              className="inline-flex items-center justify-center rounded-full px-5 py-3 font-semibold text-white ring-1 ring-white/30 transition-colors hover:bg-white/10"
            >
              Book a demo
            </a>
          </div>
        </div>
      </div>

      <a
        href={linkToUseCase(next.id)}
        onClick={(e) => {
          // Swap use cases in place, so Back still returns to the page in one step.
          e.preventDefault();
          window.location.replace(linkToUseCase(next.id));
        }}
        className="group mt-4 flex items-center gap-4 rounded-[24px] bg-white p-4 ring-1 ring-slate-200 transition-colors hover:ring-slate-300 sm:p-5"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
          <NextIcon className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-medium text-slate-500">Next use case · {next.tag}</span>
          <span className="block truncate font-semibold text-slate-900">{next.useCase.title}</span>
        </span>
        <ArrowRight className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-slate-700" />
      </a>
    </article>
  );
}

function Step({
  n,
  tone,
  title,
  delay,
  children,
}: {
  n: number;
  tone: string;
  title: string;
  delay: number;
  children: ReactNode;
}) {
  return (
    <motion.li {...rise(delay)} className="relative sm:flex sm:gap-6">
      {/* Wider screens: the number sits on the rail. Phones: it moves into the heading to leave room for the text. */}
      <span
        aria-hidden="true"
        className={`relative z-10 hidden h-12 w-12 shrink-0 items-center justify-center rounded-full font-display text-xl font-bold text-white shadow-lg ring-4 ring-[#f7f8fc] sm:flex ${tone}`}
      >
        {n}
      </span>
      <section className="min-w-0 flex-1 rounded-3xl bg-white p-5 ring-1 ring-slate-200 sm:p-7">
        <h2 className="flex items-center gap-3 text-xl font-bold text-slate-900 sm:text-2xl">
          <span
            aria-hidden="true"
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-base font-bold text-white sm:hidden ${tone}`}
          >
            {n}
          </span>
          {title}
        </h2>
        <div className="mt-3 leading-relaxed text-slate-700 sm:text-[17px]">{children}</div>
      </section>
    </motion.li>
  );
}
