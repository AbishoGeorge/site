import { motion } from 'framer-motion';
import { ArrowUpRight, Clock3, FileSearch, Target, Users } from 'lucide-react';
import { brand, demoHref, demoLinkProps } from '../brand';

// Mission and principles. Add your own story here: when and why you started, who is on the team, where you work.
const principles = [
  {
    icon: FileSearch,
    title: 'Evidence over guesswork',
    text: 'Every signal links to its source. If we cannot show where it came from, we do not send it.',
  },
  {
    icon: Clock3,
    title: 'Timing over volume',
    text: 'Ten accounts in a buying window beat a thousand that might buy someday.',
  },
  {
    icon: Users,
    title: 'People, not just companies',
    text: 'We find who to talk to and what to say, so the first message lands.',
  },
  {
    icon: Target,
    title: 'Built around your buyer',
    text: 'Your list follows your ideal customer and the triggers behind your best deals.',
  },
];

export default function About() {
  return (
    <section id="about" className="scroll-mt-24 px-2 pb-16 sm:px-4 sm:pb-24">
      <div className="mx-auto max-w-[1600px] rounded-[28px] bg-[#f4f5ff] px-6 py-16 ring-1 ring-indigo-100 sm:px-10 sm:py-20 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">Who we are</h2>
            <p className="mt-6 text-xl leading-relaxed text-slate-800 sm:text-2xl">
              {brand.name} exists so sales teams can spend their time selling, not researching.
            </p>
            <p className="mt-4 max-w-xl leading-relaxed text-slate-600">
              We pair always-on monitoring with the care of a research team. Every account we hand you comes with a
              reason to reach out, the evidence behind it and the right person to talk to.
            </p>
            <a
              href={demoHref}
              {...demoLinkProps}
              className="group mt-8 inline-flex items-center gap-3 rounded-full bg-slate-900 py-1.5 pl-5 pr-1.5 font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Talk to the team
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-900 transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </a>
          </motion.div>

          <ul className="grid gap-4 sm:grid-cols-2">
            {principles.map(({ icon: Icon, title, text }, i) => (
              <motion.li
                key={title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="group rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgba(79,70,229,0.45)]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-colors duration-300 group-hover:bg-indigo-600 group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-slate-900">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{text}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
