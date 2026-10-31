import { ArrowRight } from 'lucide-react';
import { clientLogos, testimonials, type ClientLogo, type Testimonial } from '../content/clients';
import { LogoGlyph } from './cases/CaseArt';

// Each column drifts at its own speed; the middle one runs the other way.
const columnMotion = [
  'animate-[marquee-y_40s_linear_infinite]',
  'animate-[marquee-y_48s_linear_infinite] [animation-direction:reverse]',
  'animate-[marquee-y_44s_linear_infinite]',
];

export default function Clients() {
  const columns = [0, 1, 2].map((c) => testimonials.filter((_, i) => i % 3 === c));
  const sampleLogos = clientLogos.some((l) => l.sample);

  return (
    <section id="clients" className="scroll-mt-24 pb-20 pt-16 sm:pb-28 sm:pt-20">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4">
        <h2 className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Trusted by B2B teams</h2>
        {sampleLogos && <SampleTag />}
      </div>

      <div className="group/logos relative mx-auto mt-8 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        {/* Right padding on each item (not a flex gap) keeps the duplicated half aligned for a seamless loop. */}
        <ul
          aria-label="Clients"
          className="flex w-max max-w-none animate-[marquee_45s_linear_infinite] items-center py-2 group-hover/logos:[animation-play-state:paused]"
        >
          {[...clientLogos, ...clientLogos].map((l, i) => (
            <li key={i} aria-hidden={i >= clientLogos.length || undefined} className="pr-12 sm:pr-16">
              <ClientMark logo={l} />
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto mt-20 grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.6fr] lg:items-center lg:gap-14 lg:px-8">
        <div>
          <h3 className="text-3xl font-bold leading-[1.08] tracking-[-0.03em] text-slate-900 sm:text-5xl">
            Teams switch for the evidence. They stay for the meetings.
          </h3>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-slate-600">
            What sales leaders say once their reps start every conversation with a signal.
          </p>
          <a href="#stories" className="group mt-8 inline-flex items-center gap-2 font-semibold text-indigo-700">
            Read customer stories
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        <div className="group/wall relative h-[560px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
          {/* Phones: one column with every quote. */}
          <div className="sm:hidden">
            <Column items={testimonials} motion={columnMotion[0]} />
          </div>
          <div className="hidden h-full grid-cols-2 gap-4 sm:grid xl:grid-cols-3">
            {columns.map((items, c) => (
              <div key={c} className={c === 2 ? 'hidden xl:block' : ''}>
                <Column items={items} motion={columnMotion[c]} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Column({ items, motion }: { items: Testimonial[]; motion: string }) {
  return (
    <div className={`${motion} group-hover/wall:[animation-play-state:paused]`}>
      {[...items, ...items].map((t, i) => (
        <div key={i} className="pb-4" aria-hidden={i >= items.length || undefined}>
          <Quote t={t} />
        </div>
      ))}
    </div>
  );
}

function Quote({ t }: { t: Testimonial }) {
  const initials = t.name
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2);
  const mark = clientLogos.find((l) => l.name === t.company)?.mark ?? 'dot';
  return (
    <figure
      className={`rounded-3xl p-6 ring-1 transition-transform duration-300 hover:-translate-y-0.5 ${
        t.featured
          ? 'bg-slate-900 text-white ring-slate-900 shadow-[0_24px_50px_-28px_rgba(15,23,42,0.8)]'
          : 'bg-white text-slate-700 ring-slate-200 shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={`flex min-w-0 items-center gap-2 text-sm font-semibold ${t.featured ? 'text-white/80' : 'text-slate-500'}`}
        >
          <LogoGlyph mark={mark} className="h-5 w-5 shrink-0" />
          <span className="truncate font-display">{t.company}</span>
        </span>
        {t.sample && <SampleTag dark={t.featured} />}
      </div>
      <blockquote className={`mt-4 leading-relaxed ${t.featured ? 'text-lg font-medium text-white' : 'text-[15px]'}`}>
        “{t.quote}”
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
            t.featured ? 'bg-gradient-to-br from-orange-400 to-rose-500' : 'bg-gradient-to-br from-indigo-500 to-violet-500'
          }`}
        >
          {initials}
        </span>
        <span className="leading-tight">
          <span className={`block text-sm font-semibold ${t.featured ? 'text-white' : 'text-slate-900'}`}>{t.name}</span>
          <span className={`block text-xs ${t.featured ? 'text-slate-400' : 'text-slate-500'}`}>{t.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

function ClientMark({ logo }: { logo: ClientLogo }) {
  if (logo.image) {
    return (
      <img
        src={logo.image}
        alt={logo.name}
        className="h-8 w-auto opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
      />
    );
  }
  return (
    <span className="flex items-center gap-2.5 whitespace-nowrap text-slate-400 transition-colors duration-300 hover:text-slate-900">
      <LogoGlyph mark={logo.mark} className="h-7 w-7" />
      <span className="font-display text-xl font-bold tracking-tight">{logo.name}</span>
    </span>
  );
}

function SampleTag({ className = '', dark = false }: { className?: string; dark?: boolean }) {
  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ${
        dark ? 'bg-white/10 text-white/80 ring-white/15' : 'bg-amber-50 text-amber-800 ring-amber-200'
      } ${className}`}
    >
      Sample
    </span>
  );
}
