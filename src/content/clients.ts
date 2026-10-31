import type { LogoMark } from './caseStudies';

/**
 * Client logos and testimonials for the "Trusted by B2B teams" section.
 *
 * These are DRAFTS: the companies, people and quotes are invented to show the layout, and each entry is marked
 * `sample: true`, which shows a "Sample" tag on the site. Replace them with real clients and approved quotes (and set
 * `sample: false`) before launch. To use real logo files instead of the generated wordmarks, add an `image` path.
 */

export interface ClientLogo {
  name: string;
  mark: LogoMark;
  /** Optional path to a real logo file in /public, used instead of the generated wordmark. */
  image?: string;
  sample: boolean;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  /** Dark cards break up the wall; use them for the strongest quotes. */
  featured?: boolean;
  sample: boolean;
}

export const clientLogos: ClientLogo[] = [
  { name: 'Halcyon Cloud', mark: 'split', sample: true },
  { name: 'Arcwell Security', mark: 'triangle', sample: true },
  { name: 'Freightline', mark: 'wave', sample: true },
  { name: 'Corvo Analytics', mark: 'hex', sample: true },
  { name: 'Meridian Health IT', mark: 'dot', sample: true },
  { name: 'Brightpath HR', mark: 'ring', sample: true },
  { name: 'Northfold', mark: 'triangle', sample: true },
  { name: 'Lumio Payments', mark: 'dot', sample: true },
  { name: 'Pillarbase', mark: 'hex', sample: true },
  { name: 'Vantage Grid', mark: 'split', sample: true },
];

export const testimonials: Testimonial[] = [
  {
    quote: 'We used to buy lists. Now every account arrives with a reason to call, and the reason is usually right.',
    name: 'Dana R.',
    role: 'VP of Sales',
    company: 'Halcyon Cloud',
    featured: true,
    sample: true,
  },
  {
    quote: 'Our SDRs open with the signal, not a template. Replies went up in the first week.',
    name: 'Marcus L.',
    role: 'Head of Enterprise Sales',
    company: 'Arcwell Security',
    sample: true,
  },
  {
    quote: 'The research is done before I open the account. That is the whole point.',
    name: 'Priya N.',
    role: 'Head of Growth',
    company: 'Freightline',
    sample: true,
  },
  {
    quote: 'Leadership-change alerts got us into deals months before the RFP was written.',
    name: 'Jordan T.',
    role: 'Chief Revenue Officer',
    company: 'Meridian Health IT',
    sample: true,
  },
  {
    quote: 'It is the first prospecting tool our reps actually ask for.',
    name: 'Elena K.',
    role: 'Director of Revenue Operations',
    company: 'Corvo Analytics',
    featured: true,
    sample: true,
  },
  {
    quote: 'Every signal links to its source, so we trust it enough to act on it.',
    name: 'Sam O.',
    role: 'Head of Sales',
    company: 'Brightpath HR',
    sample: true,
  },
  {
    quote: 'Ten accounts in a buying window beat a thousand cold ones. Our pipeline shows it.',
    name: 'Aisha B.',
    role: 'Sales Director',
    company: 'Northfold',
    sample: true,
  },
  {
    quote: 'We finally know why we are calling, and so does the buyer.',
    name: 'Tom W.',
    role: 'Account Executive',
    company: 'Lumio Payments',
    sample: true,
  },
  {
    quote: 'Setup took an afternoon. The first meetings came the same week.',
    name: 'Grace L.',
    role: 'Founder',
    company: 'Pillarbase',
    featured: true,
    sample: true,
  },
];
