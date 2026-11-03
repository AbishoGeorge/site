import { motion } from 'framer-motion';
import { ArrowUpRight, FileCheck2, Timer, UsersRound } from 'lucide-react';
import { brand, demoHref, demoLinkProps } from '../brand';
import BerryOrb from './BerryOrb';

// What we stand for. Add your own story here when you're ready: when and why you started, the team, where you work.
const principles = [
  {
    icon: FileCheck2,
    title: 'Evidence over guesswork',
    text: "Every signal links to its source. If we can't show where it came from, we don't send it.",
  },
  {
    icon: Timer,
    title: 'Timing over volume',
    text: 'Ten accounts in a buying window beat a thousand that might buy someday.',
  },
  {
    icon: UsersRound,
    title: 'People, not just companies',
    text: 'We find who to talk to and what to say, so the first message lands.',
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function About() {
  return (
    <section id="about" className="scroll-mt-24 px-2 py-10 sm:px-4 sm:py-14">
      <div className="relative isolate mx-auto max-w-[1600px] overflow-hidden rounded-[28px] bg-[#0c0a24] px-6 py-16 text-white sm:px-10 sm:py-24 lg:px-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 -top-40 -z-10 h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.38),transparent)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-56 -right-24 -z-10 h-[560px] w-[560px] rounded-full bg-[radial-gradient(closest-side,rgba(249,115,22,0.16),transparent)]"
        />

        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-6 lg:grid-cols-[1.25fr_1fr] lg:gap-10">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, ease }}
              className="max-w-3xl"
            >
              <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">Who we are</h2>
              <p className="mt-6 text-2xl leading-snug text-slate-200 sm:text-[2rem]">
                {brand.name} exists so sales teams can spend their time{' '}
                <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-orange-300 bg-clip-text font-semibold text-transparent">
                  selling
                </span>
                , not researching.
              </p>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-400">
                We pair always-on monitoring with the judgment of a research team. Every account we hand you comes with
                a reason to reach out, the evidence behind it and the right person to talk to.
              </p>
            </motion.div>

            <BerryOrb className="mx-auto block aspect-square w-full max-w-[300px] sm:max-w-[380px] lg:max-w-[460px]" />
          </div>

          <ul className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-white/10 ring-1 ring-white/10 md:grid-cols-3">
            {principles.map(({ icon: Icon, title, text }, i) => (
              <motion.li
                key={title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease }}
                className="bg-[#0c0a24]/90 p-6 sm:p-8"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-950/50">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                <p className="mt-1.5 leading-relaxed text-slate-400">{text}</p>
              </motion.li>
            ))}
          </ul>

          <a
            href={demoHref}
            {...demoLinkProps}
            className="group mt-12 inline-flex items-center gap-3 rounded-full bg-white py-1.5 pl-6 pr-1.5 font-semibold text-slate-900 transition-transform hover:-translate-y-0.5"
          >
            Talk to the team
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
