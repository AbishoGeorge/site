import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { brand, demoHref, demoLinkProps } from '../brand';
import { TOP_ACCOUNTS_HASH } from './accounts/AccountsFlow';

export default function FinalCTA() {
  return (
    <section id="contact" className="scroll-mt-24 px-2 py-10 sm:px-4 sm:py-14">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto max-w-[1600px] overflow-hidden rounded-[28px] bg-indigo-600 px-6 py-20 text-center sm:py-24"
      >
        <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Your next customers are already showing signals.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-indigo-100">
            See the accounts in your market that are ready to buy right now, each with the evidence behind it.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={`#${TOP_ACCOUNTS_HASH}`}
              className="group inline-flex items-center gap-4 rounded-full bg-white py-1.5 pl-6 pr-1.5 font-semibold text-slate-900 shadow-[0_12px_30px_-10px_rgba(30,27,75,0.6)] transition-transform hover:-translate-y-0.5"
            >
              See my top accounts
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight className="h-5 w-5" />
              </span>
            </a>
            <a
              href={demoHref}
              {...demoLinkProps}
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3.5 font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
            >
              Book a demo
            </a>
          </div>
          <p className="mt-6 text-sm text-indigo-100">
            Or email us at{' '}
            <a href={`mailto:${brand.email}`} className="font-medium text-white underline-offset-2 hover:underline">
              {brand.email}
            </a>
          </p>
        </div>
      </motion.div>
    </section>
  );
}
