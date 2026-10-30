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
      <div className="relative mx-auto max-w-[1600px] overflow-hidden rounded-[28px] bg-[#050b18] py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(27,95,170,0.35),transparent_70%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl text-center"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-200">Signal library</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-5xl">The signals behind every pick.</h2>
            <p className="mt-4 text-lg text-sky-100/60">
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
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors duration-300 hover:border-amber-200/30 hover:bg-white/[0.05]"
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-amber-300/0 blur-2xl transition-colors duration-500 group-hover:bg-amber-300/20" />
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-300/10 text-amber-200">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-semibold text-white">{name}</h3>
                <p className="mt-1 text-sm text-sky-100/55">{look}</p>
                <div className="mt-4 rounded-lg border border-white/5 bg-black/20 px-3 py-2 font-mono text-[11px] text-sky-100/70">
                  <span className="text-emerald-400">✓</span> {example}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
