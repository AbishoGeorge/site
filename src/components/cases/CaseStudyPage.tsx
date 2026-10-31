import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Quote } from 'lucide-react';
import { caseStudies, type CaseStudy } from '../../content/caseStudies';
import { demoHref, demoLinkProps } from '../../brand';
import OverlayShell from '../overlay/OverlayShell';
import { useHashOverlay } from '../overlay/useHashOverlay';
import { TOP_ACCOUNTS_HASH } from '../accounts/AccountsFlow';
import { CaseArt, LogoGlyph } from './CaseArt';
import { CASE_HASH, caseHref } from './caseLinks';

export default function CaseStudyPage() {
  const { open, close, param } = useHashOverlay(CASE_HASH);
  const index = caseStudies.findIndex((c) => c.id === param);
  const study = index >= 0 ? caseStudies[index] : undefined;
  const next = caseStudies[(index + 1) % caseStudies.length];

  return (
    <OverlayShell
      open={open && !!study}
      onClose={close}
      backLabel="All stories"
      label={study ? study.title : 'Customer story'}
      scrollKey={param}
    >
      {study && <Story key={study.id} study={study} next={next} />}
    </OverlayShell>
  );
}

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
});

function Story({ study, next }: { study: CaseStudy; next: CaseStudy }) {
  return (
    <article className="mx-auto max-w-6xl px-4 pb-16 pt-2 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr] lg:items-stretch lg:gap-10">
        <motion.div
          {...rise(0)}
          className="relative min-h-[320px] overflow-hidden rounded-[28px] bg-slate-900 text-white sm:min-h-[400px]"
        >
          <CaseArt visual={study.visual} className="absolute inset-0 h-full w-full" />
          <div className="relative flex h-full min-h-[320px] flex-col justify-between p-7 sm:min-h-[400px] sm:p-9">
            <span className="flex items-center gap-3">
              <LogoGlyph mark={study.mark} className="h-8 w-8" />
              <span className="font-display text-3xl font-bold tracking-tight">{study.company}</span>
            </span>
            <div>
              <div className="font-display text-7xl font-bold tracking-tight sm:text-8xl">{study.results[0].value}</div>
              <p className="mt-2 max-w-xs text-lg text-white/85">{study.results[0].label}</p>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col justify-center">
          <motion.div {...rise(0.08)} className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
              {study.industry}
            </span>
            {study.sample && (
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-200">
                Sample story
              </span>
            )}
          </motion.div>
          <motion.h1
            {...rise(0.14)}
            className="mt-4 text-3xl font-bold leading-[1.08] tracking-[-0.03em] text-slate-900 sm:text-5xl"
          >
            {study.title}
          </motion.h1>
          <motion.p {...rise(0.2)} className="mt-4 text-lg leading-relaxed text-slate-600">
            {study.summary}
          </motion.p>
          <motion.dl {...rise(0.26)} className="mt-8 grid grid-cols-3 gap-3">
            {study.results.map((r) => (
              <div key={r.label} className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                <dt className="sr-only">{r.label}</dt>
                <dd className="font-display text-2xl font-bold tracking-tight text-indigo-600 sm:text-3xl">{r.value}</dd>
                <dd className="mt-1 text-xs leading-snug text-slate-600 sm:text-sm">{r.label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.35fr] lg:gap-16">
        <section>
          <h2 className="text-xl font-bold text-slate-900">The challenge</h2>
          <p className="mt-3 leading-relaxed text-slate-700">{study.challenge}</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-slate-900">What they did</h2>
          <ol className="mt-4 space-y-3">
            {study.approach.map((step, i) => (
              <li key={step} className="flex gap-4 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="leading-relaxed text-slate-700">{step}</span>
              </li>
            ))}
          </ol>
          <div className="mt-6">
            <div className="text-sm font-semibold text-slate-900">Signals they used</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {study.signals.map((s) => (
                <span key={s} className="rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700 ring-1 ring-orange-100">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>

      <figure className="relative mt-14 overflow-hidden rounded-[28px] bg-slate-950 p-8 text-white sm:p-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(148,163,184,0.25)_1px,transparent_1px)] [background-size:22px_22px]"
        />
        <Quote className="relative h-8 w-8 text-indigo-400" aria-hidden="true" />
        <blockquote className="relative mt-4 max-w-4xl text-2xl font-semibold leading-snug sm:text-3xl">
          {study.quote.text}
        </blockquote>
        <figcaption className="relative mt-6 text-slate-400">
          {study.quote.name} · {study.quote.role}, {study.company}
        </figcaption>
      </figure>

      <div className="mt-10 flex flex-col gap-6 rounded-[28px] bg-white p-6 ring-1 ring-slate-200 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
        <a
          href={caseHref(next.id)}
          onClick={(e) => {
            // Swap stories in place, so Back still returns to the page in one step.
            e.preventDefault();
            window.location.replace(caseHref(next.id));
          }}
          className="group flex items-center gap-4"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <LogoGlyph mark={next.mark} className="h-6 w-6" />
          </span>
          <span>
            <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Next story</span>
            <span className="flex items-center gap-1.5 font-semibold text-slate-900">
              {next.company}
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
