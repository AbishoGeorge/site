import { ArrowRight, Radar, Ticket, type LucideIcon } from 'lucide-react';
import { serviceName, storiesFor, type Service, type Story } from '../../content/stories';
import { IndustryArt } from './IndustryArt';
import { industryIcon } from './industryStyle';
import { linkToUseCase } from './links';
import { showUseCases, useShownService } from './serviceTab';

const services: { id: Service; icon: LucideIcon }[] = [
  { id: 'accounts', icon: Radar },
  { id: 'events', icon: Ticket },
];

/** Use case cards running on a loop, one service at a time. Hovering or focusing a card pauses the strip. */
export default function UseCases() {
  const service = useShownService();
  const list = storiesFor(service);
  // Short lists repeat so the strip is always wider than the screen; the second half repeats the first so the loop
  // has no seam.
  const half = Array.from({ length: Math.max(1, Math.ceil(8 / list.length)) }, () => list).flat();
  const loop = [...half, ...half];

  return (
    <section id="use-cases" className="scroll-mt-24 border-y border-slate-200 bg-slate-50 py-16 sm:py-20">
      <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-x-10 gap-y-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">See how it works for teams like yours</h2>
          <p className="mt-3 text-slate-600">
            Each story follows one company through one specific problem, and how we solve it. Pick a service, then a
            story.
          </p>
        </div>
        <div
          role="tablist"
          aria-label="Service"
          className="flex w-full rounded-full bg-white p-1 shadow-sm ring-1 ring-slate-200 sm:w-auto"
        >
          {services.map(({ id, icon: Icon }) => {
            const selected = service === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => showUseCases(id)}
                className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold transition-colors sm:flex-none ${
                  selected ? 'bg-slate-900 text-white shadow' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                {serviceName[id]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="group/strip relative mt-10 overflow-hidden motion-reduce:overflow-x-auto [mask-image:linear-gradient(to_right,transparent,black_3%,black_97%,transparent)]">
        {/* Each card carries its own right padding (no flex gap) so the duplicated half lines up exactly. */}
        <ul
          key={service}
          style={{ animationDuration: `${half.length * 10}s` }}
          className="flex w-max max-w-none animate-[marquee_linear_infinite] py-3 pl-3 group-hover/strip:[animation-play-state:paused] group-focus-within/strip:[animation-play-state:paused]"
        >
          {loop.map((story, i) => {
            const copy = i >= list.length;
            return (
              <li key={`${story.id}-${i}`} className="pr-5 sm:pr-6" aria-hidden={copy || undefined}>
                <UseCaseCard story={story} tabIndex={copy ? -1 : undefined} />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function UseCaseCard({ story, tabIndex }: { story: Story; tabIndex?: number }) {
  const Icon = industryIcon[story.icon];
  return (
    <a
      href={linkToUseCase(story.id)}
      tabIndex={tabIndex}
      className="group relative block h-[420px] w-[290px] overflow-hidden rounded-[28px] bg-slate-900 text-white shadow-[0_24px_60px_-30px_rgba(15,23,42,0.7)] transition-transform duration-500 hover:-translate-y-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500 sm:h-[480px] sm:w-[360px]"
    >
      <IndustryArt
        visual={story.visual}
        className="absolute inset-0 h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />
      <div className="relative flex h-full flex-col justify-between p-6 sm:p-7">
        <span className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20 backdrop-blur">
            <Icon className="h-[18px] w-[18px]" />
          </span>
          <span className="text-sm font-semibold text-white/90">{story.tag}</span>
        </span>
        <div>
          <p className="font-display text-2xl font-bold leading-tight tracking-tight sm:text-[1.65rem]">
            {story.useCase.title}
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
