import { motion } from 'framer-motion';
import { ArrowUpRight, Mail } from 'lucide-react';
import { brand, demoLinkProps } from '../brand';

export default function FinalCTA() {
  return (
    <section id="contact" className="scroll-mt-20 px-2 pb-10 pt-8 sm:px-4 sm:pb-14">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto max-w-[1600px] overflow-hidden rounded-[28px] bg-gradient-to-br from-indigo-100 via-violet-50 to-orange-50 px-6 py-20 text-center ring-1 ring-indigo-100 sm:py-24"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_70%_at_50%_100%,rgba(129,140,248,0.35),transparent_70%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:radial-gradient(rgba(99,102,241,0.35)_1px,transparent_1px)] [background-size:18px_18px] [mask-image:radial-gradient(ellipse_45%_60%_at_50%_100%,black,transparent)]" />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Your next customers are already showing signals.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-600">
            See the accounts in your market that are ready to buy right now, each with the evidence behind it.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={brand.demoUrl || `mailto:${brand.email}?subject=Demo%20request`}
              {...demoLinkProps}
              className="group inline-flex items-center gap-4 rounded-full bg-slate-900 py-1.5 pl-6 pr-1.5 font-semibold text-white shadow-[0_12px_30px_-10px_rgba(49,46,129,0.55)] transition-transform hover:-translate-y-0.5"
            >
              Book a demo
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-900 transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight className="h-5 w-5" />
              </span>
            </a>
            <a
              href={`mailto:${brand.email}`}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/70 px-6 py-3.5 font-semibold text-slate-800 transition-colors hover:border-slate-400 hover:bg-white"
            >
              <Mail className="h-4 w-4" />
              {brand.email}
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
