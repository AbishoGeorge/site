// Placeholder brand details. Replace these before launch; every page reads from here.
export const brand = {
  name: 'YourBrand',
  email: 'hello@yourbrand.com',
  /**
   * Calendar or booking link for every "Book a demo" button, e.g. a Calendly URL.
   * Leave empty to use the on-site booking form instead.
   */
  demoUrl: '',
  year: 2026,
  /**
   * Where the "See my top accounts" request form is sent, e.g. a Formspree or HubSpot form endpoint that
   * accepts a JSON POST. Leave empty and the form opens the visitor's email app addressed to `email` instead.
   */
  formEndpoint: '',
};

/** Where every "Book a demo" button points: the booking link if set, otherwise the on-site booking page. */
export const demoHref = brand.demoUrl || '#book-demo';

/** External booking links open in a new tab. */
export const demoLinkProps = /^https?:\/\//.test(brand.demoUrl) ? { target: '_blank', rel: 'noopener noreferrer' } : {};
