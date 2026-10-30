// Placeholder brand details. Replace these before launch; every page reads from here.
export const brand = {
  name: 'YourBrand',
  email: 'hello@yourbrand.com',
  /**
   * Calendar or booking link for every "Book a demo" button, e.g. a Calendly URL.
   * Leave empty to send those buttons to the contact section, where the main button opens an email instead.
   */
  demoUrl: '',
  year: 2026,
  /**
   * Where the "See my top accounts" request form is sent, e.g. a Formspree or HubSpot form endpoint that
   * accepts a JSON POST. Leave empty and the form opens the visitor's email app addressed to `email` instead.
   */
  formEndpoint: '',
};

/** Where the navbar and hero "Book a demo" buttons point. */
export const demoHref = brand.demoUrl || '#contact';

/** External booking links open in a new tab. */
export const demoLinkProps = /^https?:\/\//.test(brand.demoUrl) ? { target: '_blank', rel: 'noopener noreferrer' } : {};
