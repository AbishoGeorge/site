import { motion } from 'framer-motion';
import { brand } from '../brand';
import { Briefcase, Building2, CheckCircle2, Landmark, Link2, ListX, Send } from 'lucide-react';

const vagueRows = [
  { name: 'Company A', meta: 'Software · 200–500 · USA' },
  { name: 'Company B', meta: 'Healthcare · 1k–5k · USA' },
  { name: 'Company C', meta: 'Manufacturing · 500–1k · DE' },
  { name: 'Company D', meta: 'Fintech · 50–200 · UK' },
  { name: 'Company E', meta: 'Logistics · 1k–5k · BR' },
];

const evidence = [
  { icon: Landmark, label: 'Funding', text: '$62M Series C closed', source: 'Press release · 12 days ago' },
  { icon: Briefcase, label: 'Hiring surge', text: 'VP of Revenue Cycle role opened', source: 'Job board · 5 days ago' },
  { icon: Building2, label: 'Expansion', text: '3 new clinics announced across Texas', source: 'Local news · 3 weeks ago' },
];

export default function ListVsEvidence() {
  return (
    <section id="why" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">Why {brand.name}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">Not another list of logos.</h2>
          <p className="mt-4 text-lg text-gray-500">
            Most lead lists tell you who exists. We tell you who is ready to buy, and show you the proof.
          </p>
        </motion.div>

        <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-2">
          {/* The usual list */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="flex flex-col rounded-3xl border border-gray-200 bg-gray-50 p-6 sm:p-8"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-500">
              <ListX className="h-4 w-4" />
              A typical lead list
            </div>
            <div className="mt-6 flex-1 overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1.6fr)_minmax(0,0.8fr)] gap-3 border-b border-gray-100 px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                <span className="truncate">Account</span>
                <span className="truncate">Firmographics</span>
                <span className="truncate">Why now?</span>
              </div>
              {vagueRows.map((row) => (
                <div key={row.name} className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1.6fr)_minmax(0,0.8fr)] items-center gap-3 border-b border-gray-50 px-4 py-3.5 text-sm last:border-0">
                  <span className="truncate font-medium text-gray-400">{row.name}</span>
                  <span className="truncate text-gray-400">{row.meta}</span>
                  <span className="text-gray-300">—</span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm text-gray-500">No context. No timing. Your reps spend the week guessing.</p>
          </motion.div>

          {/* An evidence-backed account */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative flex flex-col overflow-hidden rounded-3xl bg-white p-6 shadow-[0_30px_70px_-30px_rgba(79,70,229,0.45)] ring-1 ring-indigo-100 sm:p-8"
          >
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-300/30 blur-3xl" />
            <div className="relative flex items-center gap-2 text-sm font-semibold text-indigo-600">
              <CheckCircle2 className="h-4 w-4" />
              A {brand.name} account
            </div>

            <div className="relative mt-6 flex-1 rounded-2xl border border-indigo-100 bg-gradient-to-b from-indigo-50/60 to-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold text-slate-900">Regional healthcare network</div>
                  <div className="text-sm text-slate-500">7,200 employees · Austin, TX</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-600">High</div>
                  <div className="text-[10px] font-semibold tracking-[0.14em] text-slate-500">INTENT</div>
                </div>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-indigo-100">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '90%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-orange-400"
                />
              </div>

              <ul className="mt-5 space-y-2.5">
                {evidence.map(({ icon: Icon, label, text, source }, i) => (
                  <motion.li
                    key={label}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.12 }}
                    className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white px-3 py-2.5"
                  >
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold text-orange-700">{label}</div>
                      <div className="text-sm text-slate-800">{text}</div>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Link2 className="h-3 w-3" />
                        {source}
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                <div className="rounded-xl border border-orange-100 bg-orange-50/70 px-3 py-2.5">
                  <div className="text-[10px] font-semibold tracking-[0.16em] text-orange-700">WHY NOW</div>
                  <div className="mt-0.5 text-sm text-slate-800">Fresh capital and a new revenue leader with budget.</div>
                </div>
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 px-3 py-2.5">
                  <div className="text-[10px] font-semibold tracking-[0.16em] text-indigo-600">NEXT STEP</div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-800">
                    <Send className="h-3.5 w-3.5 text-indigo-600" />
                    Email to the new VP, drafted
                  </div>
                </div>
              </div>
            </div>
            <p className="relative mt-5 text-sm text-slate-500">Every claim links back to its source. Your reps open with a reason.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
