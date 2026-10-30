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

/** Feed the cursor position to the card's spotlight gradient. */
function spotlight(e: React.MouseEvent<HTMLDivElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`);
}

export default function SignalLibrary() {
  return (
    <section id="signals" className="scroll-mt-24 px-2 sm:px-4">
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
                onMouseMove={spotlight}
                className="group relative overflow-hidden rounded-2xl border border-indigo-100 bg-white/90 p-5 shadow-sm shadow-indigo-900/5 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-900/10"
              >
                {/* Light that follows the cursor. */}
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background:radial-gradient(220px_circle_at_var(--x,50%)_var(--y,50%),rgba(129,140,248,0.18),transparent_70%)]" />
                <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-600/30">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="relative mt-4 font-semibold text-slate-900">{name}</h3>
                <p className="relative mt-1 text-sm text-slate-500">{look}</p>
                <div className="relative mt-4 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600 transition-colors duration-300 group-hover:bg-orange-50">
                  <span className="font-semibold text-orange-700">e.g.</span> {example}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
