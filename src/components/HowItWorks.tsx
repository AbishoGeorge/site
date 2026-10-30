import { motion } from 'framer-motion';
import { Crosshair, Gauge, Inbox, Telescope } from 'lucide-react';

const steps = [
  {
    icon: Crosshair,
    title: 'Define your ideal buyer',
    desc: 'Tell us who you sell to and what "ready" looks like: the triggers that have come before your best deals.',
    chips: ['ICP', 'Triggers', 'Exclusions'],
  },
  {
    icon: Telescope,
    title: 'Monitor the market',
    desc: 'Agents watch job boards, funding news, filings, earnings calls, tenders and leadership moves every day.',
    chips: ['Jobs', 'Funding', 'Filings', 'News'],
  },
  {
    icon: Gauge,
    title: 'Verify and score',
    desc: 'Each signal is checked against its source and dated. Accounts are ranked on fit and timing, not firmographics alone.',
    chips: ['Sourced', 'Dated', 'Scored'],
  },
  {
    icon: Inbox,
    title: 'Act while it is warm',
    desc: 'You get prioritized accounts with the evidence, the right contacts and outreach written from the signal.',
    chips: ['CRM', 'Inbox', 'Sequences'],
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-gradient-to-b from-white to-electric-50/40 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-electric-500">How it works</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-navy-900 sm:text-5xl">From market noise to a short list you can act on.</h2>
        </motion.div>

        <div className="relative mt-16">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-120px' }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-px origin-left bg-gradient-to-r from-electric-200 via-electric-500 to-amber-400 lg:block"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ icon: Icon, title, desc, chips }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.12 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-900 text-white shadow-lg shadow-navy-900/20 ring-8 ring-white">
                  <Icon className="h-6 w-6" />
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-300 text-[11px] font-bold text-navy-900">
                    {i + 1}
                  </span>
                </div>
                <div className="mt-6 flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-navy-900">{title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-500">{desc}</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                    {chips.map((c) => (
                      <span key={c} className="rounded-full bg-electric-50 px-2.5 py-1 text-[11px] font-medium text-electric-700">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
