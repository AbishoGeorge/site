/** Turn whatever someone typed ("https://www.Acme.com/about") into a bare domain ("acme.com"), or null. */
export function toDomain(input: string): string | null {
  const host = input
    .trim()
    .toLowerCase()
    .replace(/^[a-z][a-z0-9+.-]*:\/\//, '')
    .replace(/^www\./, '')
    .split(/[/?#:]/)[0];
  return /^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(host) && !host.startsWith('-') ? host : null;
}

/** A readable name from a domain: "lead-strategus.com" -> "Lead Strategus". */
export function companyName(domain: string): string {
  return domain
    .split('.')[0]
    .split('-')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');
}
