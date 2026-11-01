import { ArrowRight } from 'lucide-react';
import { industries, type Industry } from '../../content/industries';
import { IndustryArt } from './IndustryArt';
import { industryIcon } from './industryStyle';
import { linkToUseCase } from './links';

/** Use case cards running on a loop. Hovering or focusing a card pauses the strip. */
export default function UseCases() {
  const loop = [...industries, ...industries];
  return (
    <section id="use-cases" className="scroll-mt-24 border-y border-slate-200 bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <h2 className="max-w-xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          See how it works in your market
        </h2>
        <p className="max-w-md text-slate-600">
          One company, one specific problem, and how buying signals solve it. Pick your market to read the story.
        </p>
      </div>

      <div className="group/strip relative mt-10 overflow-hidden motion-reduce:overflow-x-auto [mask-image:linear-gradient(to_right,transparent,black_3%,black_97%,transparent)]">
        {/* Each card carries its own right padding (no flex gap) so the duplicated half lines up exactly. */}
        <ul className="flex w-max max-w-none animate-[marquee_90s_linear_infinite] py-3 pl-3 group-hover/strip:[animation-play-state:paused] group-focus-within/strip:[animation-play-state:paused]">
          {loop.map((industry, i) => {
            const copy = i >= industries.length;
            return (
              <li key={i} className="pr-5 sm:pr-6" aria-hidden={copy || undefined}>
                <UseCaseCard industry={industry} tabIndex={copy ? -1 : undefined} />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function UseCaseCard({ industry, tabIndex }: { industry: Industry; tabIndex?: number }) {
  const Icon = industryIcon[industry.icon];
  return (
    <a
      href={linkToUseCase(industry.id)}
      tabIndex={tabIndex}
      className="group relative block h-[420px] w-[290px] overflow-hidden rounded-[28px] bg-slate-900 text-white shadow-[0_24px_60px_-30px_rgba(15,23,42,0.7)] transition-transform duration-500 hover:-translate-y-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500 sm:h-[480px] sm:w-[360px]"
    >
      <IndustryArt
        visual={industry.visual}
        className="absolute inset-0 h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />
      <div className="relative flex h-full flex-col justify-between p-6 sm:p-7">
        <span className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20 backdrop-blur">
            <Icon className="h-[18px] w-[18px]" />
          </span>
          <span className="text-sm font-semibold text-white/90">{industry.name}</span>
        </span>
        <div>
          <p className="font-display text-2xl font-bold leading-tight tracking-tight sm:text-[1.65rem]">
            {industry.useCase.title}
          </p>
          <span className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-white/70 transition-all duration-300 group-hover:gap-2.5 group-hover:text-white">
            Read the use case
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </a>
  );
}
