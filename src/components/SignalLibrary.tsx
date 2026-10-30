import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { Briefcase, Building2, Cpu, FileText, Landmark, Mic, Scale, UserPlus } from 'lucide-react';

const signals: { icon: LucideIcon; name: string; look: string; example: string }[] = [
  { icon: Briefcase, name: 'Hiring surges', look: 'Role clusters that point to a new initiative', example: '18 data-platform roles in 30 days' },
  { icon: Landmark, name: 'Funding & grants', look: 'Fresh capital that has to be spent', example: '$62M Series C closed' },
  { icon: UserPlus, name: 'Leadership changes', look: 'New decision-makers in their first 90 days', example: 'New CIO from a cloud-first OEM' },
  { icon: Cpu, name: 'Tech stack changes', look: 'Migrations, evaluations and contract expiries', example: 'Moving off legacy ERP' },
  { icon: FileText, name: 'Tenders & RFPs', look: 'Open buying processes before they close', example: 'Data warehouse tender issued' },
  { icon: Building2, name: 'Expansion', look: 'New sites, markets, plants and acquisitions', example: 'Two new distribution hubs' },
  { icon: Scale, name: 'Regulatory pressure', look: 'Deadlines that force a decision', example: 'Compliance deadline next year' },
  { icon: Mic, name: 'Earnings & strategy', look: 'Priorities named by leadership in public', example: '"Claims automation" cited 4×' },
];

export default function SignalLibrary() {
  return (
    <section id="signals" className="scroll-mt-20 px-2 sm:px-4">
      <div className="relative mx-auto max-w-[1600px] overflow-hidden rounded-[28px] bg-gradient-to-b from-indigo-50 via-violet-50/60 to-white py-20 ring-1 ring-indigo-100 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(165,180,252,0.45),transparent_70%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl text-center"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">Signal library</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">The signals behind every pick.</h2>
            <p className="mt-4 text-lg text-slate-600">
              One signal is a hint. Several, from independent sources, inside the same window, is a buying moment.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {signals.map(({ icon: Icon, name, look, example }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: (i % 4) * 0.08 }}
                className="group relative overflow-hidden rounded-2xl border border-indigo-100 bg-white/90 p-5 shadow-sm shadow-indigo-900/5 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-900/10"
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-orange-300/0 blur-2xl transition-colors duration-500 group-hover:bg-orange-300/25" />
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-semibold text-slate-900">{name}</h3>
                <p className="mt-1 text-sm text-slate-500">{look}</p>
                <div className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                  <span className="font-semibold text-orange-500">e.g.</span> {example}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
