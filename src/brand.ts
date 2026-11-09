// Placeholder brand details. Replace these before launch; every page reads from here.
export const brand = {
  name: 'Databery',
  /** The live address, no trailing slash. Canonical links, the sitemap and llms.txt are built from it. */
  siteUrl: 'https://databery.com',
  tagline: 'Insights · Intelligence · Impact',
  email: 'abisho@databery.com',
  linkedin: 'https://www.linkedin.com/company/databery/',
  /**
   * Calendar or booking link for every "Book a demo" button, e.g. a Calendly URL.
   * Leave empty to use the on-site booking form instead.
   */
  demoUrl: '',
  year: 2026,
};

/** Where every "Book a demo" button points: the booking link if set, otherwise the on-site booking page. */
export const demoHref = brand.demoUrl || '#book-demo';

/** Where "Plan my next event" points: the booking link if set, otherwise the booking page set up for events. */
export const eventHref = brand.demoUrl || '#book-demo-event';

/** External booking links open in a new tab. */
export const demoLinkProps = /^https?:\/\//.test(brand.demoUrl) ? { target: '_blank', rel: 'noopener noreferrer' } : {};
