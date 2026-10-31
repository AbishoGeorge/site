import { ArrowRight } from 'lucide-react';
import { caseStudies, type CaseStudy } from '../../content/caseStudies';
import { CaseArt, LogoGlyph } from './CaseArt';
import { caseHref } from './caseLinks';

/** Story cards running on a loop. Hovering or focusing a card pauses the strip. */
export default function CaseStudies() {
  const loop = [...caseStudies, ...caseStudies];
  return (
    <section id="stories" className="scroll-mt-24 border-y border-slate-200 bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <h2 className="max-w-xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Teams that sell on signals
        </h2>
        <p className="max-w-md text-slate-600">
          How sales teams find, time and win their best accounts. Tap a story to read it.
        </p>
      </div>

      <div className="group/strip relative mt-10 overflow-hidden motion-reduce:overflow-x-auto [mask-image:linear-gradient(to_right,transparent,black_3%,black_97%,transparent)]">
        {/* Each card carries its own right padding (no flex gap) so the duplicated half lines up exactly. */}
        <ul className="flex w-max max-w-none animate-[marquee_80s_linear_infinite] py-3 pl-3 group-hover/strip:[animation-play-state:paused] group-focus-within/strip:[animation-play-state:paused]">
          {loop.map((c, i) => {
            const copy = i >= caseStudies.length;
            return (
              <li key={i} className="pr-5 sm:pr-6" aria-hidden={copy || undefined}>
                <StoryCard study={c} tabIndex={copy ? -1 : undefined} />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function StoryCard({ study, tabIndex }: { study: CaseStudy; tabIndex?: number }) {
  return (
    <a
      href={caseHref(study.id)}
      tabIndex={tabIndex}
      className="group relative block h-[420px] w-[290px] overflow-hidden rounded-[28px] bg-slate-900 text-white shadow-[0_24px_60px_-30px_rgba(15,23,42,0.7)] transition-transform duration-500 hover:-translate-y-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500 sm:h-[500px] sm:w-[370px]"
    >
      <CaseArt
        visual={study.visual}
        className="absolute inset-0 h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />
      <div className="relative flex h-full flex-col justify-between p-6 sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <span className="flex items-center gap-2.5">
            <LogoGlyph mark={study.mark} />
            <span className="font-display text-2xl font-bold tracking-tight">{study.company}</span>
          </span>
          {study.sample && (
            <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/85 backdrop-blur">
              Sample
            </span>
          )}
        </div>
        <div>
          {study.card.kind === 'stat' ? (
            <>
              <div className="font-display text-6xl font-bold tracking-tight sm:text-7xl">{study.card.value}</div>
              <p className="mt-2 text-lg leading-snug text-white/85">{study.card.label}</p>
            </>
          ) : (
            <p className="text-lg leading-snug sm:text-xl">{study.card.text}</p>
          )}
          <span className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-white/70 transition-all duration-300 group-hover:gap-2.5 group-hover:text-white">
            Read the story
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </a>
  );
}
