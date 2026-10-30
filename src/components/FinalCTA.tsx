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
        className="relative mx-auto max-w-[1600px] overflow-hidden rounded-[28px] bg-[#050b18] px-6 py-20 text-center sm:py-24"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_70%_at_50%_100%,rgba(27,95,170,0.45),transparent_70%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(140,190,255,0.5)_1px,transparent_1px)] [background-size:18px_18px] [mask-image:radial-gradient(ellipse_45%_60%_at_50%_100%,black,transparent)]" />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Your next customers are already showing signals.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-sky-100/65">
            See the accounts in your market that are ready to buy right now, each with the evidence behind it.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={brand.demoUrl || `mailto:${brand.email}?subject=Demo%20request`}
              {...demoLinkProps}
              className="group inline-flex items-center gap-4 rounded-full bg-white py-1.5 pl-6 pr-1.5 font-semibold text-navy-900 transition-transform hover:-translate-y-0.5"
            >
              Book a demo
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-900 text-white transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight className="h-5 w-5" />
              </span>
            </a>
            <a
              href={`mailto:${brand.email}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/5"
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
