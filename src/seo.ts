import { brand } from './brand';
import { faqs } from './content/faqs';
import { industries } from './content/industries';
import { serviceName, stories, type Story } from './content/stories';
import { pathToUseCase } from './components/usecases/links';

/**
 * Everything a crawler or AI tool reads besides the page itself: each page's head tags and structured data, and the
 * robots.txt, sitemap.xml and llms.txt files. scripts/prerender.mjs writes them all at build time.
 */

const site = brand.siteUrl;
export const HOME_TITLE = "Databery | Know who's ready to buy";
const HOME_DESCRIPTION =
  'Databery finds the B2B accounts that are ready to buy and why. We track funding, hiring, leadership changes, tech changes and filings, and hand you each account with its evidence and the right person to contact. For teams in the UK and India.';

/** What we sell, as the site, the structured data and llms.txt describe it. */
export const offerings = [
  {
    name: serviceName.accounts,
    description:
      'Accounts showing buying signals right now, each with the evidence behind it (source and date), the right person to contact and a first outreach draft.',
  },
  {
    name: serviceName.events,
    description:
      'Before a conference or trade show, the attendees who match your ideal customer, why each is likely to buy now, and their verified email and phone.',
  },
  {
    name: 'ERP buying-intent research',
    description:
      'Companies planning ERP migrations, go-lives and upgrades on SAP, Oracle, Microsoft Dynamics and other ERP systems, found from public signals, for ERP testing, QA and services firms.',
  },
  {
    name: 'Qualified prospect databases',
    description:
      'Prospect lists researched against your ideal customer, with verified contacts at the accounts that fit, delivered to your CRM, your inbox or as a shared list.',
  },
];

export const signals = [
  'Funding and grant announcements',
  'Hiring and job postings',
  'Leadership changes',
  'Technology changes',
  'Regulatory filings',
  'Earnings calls',
  'Tenders',
  'Company news',
];

export const markets = ['United Kingdom', 'India'];

export interface Page {
  path: string;
  title: string;
  description: string;
  jsonLd: object[];
}

const abs = (path: string) => `${site}${path}`;

/** Cuts text to about `max` characters at a word boundary. */
function clip(text: string, max = 160) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,.;:]$/, '')}…`;
}

const organization = {
  '@type': 'Organization',
  '@id': `${site}/#organization`,
  name: brand.name,
  url: `${site}/`,
  logo: `${site}/apple-touch-icon.png`,
  slogan: brand.tagline,
  description: HOME_DESCRIPTION,
  email: brand.email,
  sameAs: [brand.linkedin],
  areaServed: markets.map((name) => ({ '@type': 'Country', name })),
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    email: brand.email,
    areaServed: ['GB', 'IN'],
  },
};

const services = offerings.map((o) => ({
  '@type': 'Service',
  name: o.name,
  serviceType: o.name,
  description: o.description,
  provider: { '@id': `${site}/#organization` },
  areaServed: markets.map((name) => ({ '@type': 'Country', name })),
  audience: {
    '@type': 'BusinessAudience',
    audienceType: 'B2B sales and marketing teams',
  },
  url: `${site}/#services`,
}));

function homePage(): Page {
  return {
    path: '/',
    title: HOME_TITLE,
    description: clip(HOME_DESCRIPTION, 200),
    jsonLd: [
      organization,
      {
        '@type': 'WebSite',
        '@id': `${site}/#website`,
        url: `${site}/`,
        name: brand.name,
        publisher: { '@id': `${site}/#organization` },
      },
      ...services,
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };
}

function useCasePage(story: Story): Page {
  const path = pathToUseCase(story.id);
  const service = offerings.find((o) => o.name === serviceName[story.service])!;
  return {
    path,
    title: `${story.useCase.title} | ${brand.name}`,
    description: clip(`${story.tag}: ${story.useCase.problem}`),
    jsonLd: [
      organization,
      {
        '@type': 'Article',
        headline: story.useCase.title,
        description: clip(story.useCase.problem, 300),
        about: {
          '@type': 'Service',
          name: service.name,
          description: service.description,
          provider: { '@id': `${site}/#organization` },
        },
        author: { '@id': `${site}/#organization` },
        publisher: { '@id': `${site}/#organization` },
        mainEntityOfPage: abs(path),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${site}/` },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Use cases',
            item: `${site}/#use-cases`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: story.useCase.title,
            item: abs(path),
          },
        ],
      },
    ],
  };
}

export const pages: Page[] = [homePage(), ...stories.map(useCasePage)];

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** The tags that go in a page's <head>. */
export function headTags(page: Page) {
  const url = abs(page.path);
  const image = `${site}/og-image.png`;
  const ld = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': page.jsonLd,
  }).replace(/</g, '\\u003c');
  return [
    `<title>${esc(page.title)}</title>`,
    `<meta name="description" content="${esc(page.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${page.path === '/' ? 'website' : 'article'}" />`,
    `<meta property="og:site_name" content="${brand.name}" />`,
    `<meta property="og:title" content="${esc(page.title)}" />`,
    `<meta property="og:description" content="${esc(page.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${brand.name}: ${esc(brand.tagline)}" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(page.title)}" />`,
    `<meta name="twitter:description" content="${esc(page.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<script type="application/ld+json">${ld}</script>`,
  ].join('\n    ');
}

export function robotsTxt() {
  const named = [
    'GPTBot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'ClaudeBot',
    'Claude-User',
    'Claude-SearchBot',
    'PerplexityBot',
    'Perplexity-User',
    'Google-Extended',
    'Googlebot',
    'Bingbot',
  ];
  return [
    '# Search engines and AI tools are welcome to read this site.',
    ...named.flatMap((agent) => [`User-agent: ${agent}`, 'Allow: /', '']),
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    '',
    `Sitemap: ${site}/sitemap.xml`,
    '',
  ].join('\n');
}

export function sitemapXml(lastmod: string) {
  const urls = pages
    .map(
      (p) =>
        `  <url>\n    <loc>${abs(p.path)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>${p.path === '/' ? '1.0' : '0.7'}</priority>\n  </url>`
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function llmsTxt() {
  const byService = (service: Story['service']) =>
    stories
      .filter((s) => s.service === service)
      .map((s) => `- [${s.useCase.title}](${abs(pathToUseCase(s.id))}): ${s.tag}. ${clip(s.useCase.problem, 180)}`);
  return `# ${brand.name}

> ${brand.name} (${brand.tagline}) tells B2B sales and marketing teams which accounts are ready to buy and why. We track public buying signals, score accounts against your ideal customer, and hand over each account with its evidence, the right person to contact and how to reach them. We work with B2B teams in the UK and India.

## What we offer

${offerings.map((o) => `- **${o.name}**: ${o.description}`).join('\n')}

## Signals we track

${signals.map((s, i) => (i ? s.toLowerCase() : s)).join(', ')}. Every signal on an account links back to where it was found, with its date.

## Markets

${markets.join(' and ')}. Industries we serve: ${industries.map((i) => i.name).join(', ')}.

## How it works

1. Tell us who you sell to, or enter your website for a free preview of your top 10 accounts.
2. We research the full list for your company: accounts showing buying signals now, scored on fit and on how many independent signals point to a buying window.
3. Each account reaches your team in your CRM, your inbox or as a shared list, with its evidence, suggested contacts and a first outreach draft.

## Use cases: ${serviceName.accounts}

${byService('accounts').join('\n')}

## Use cases: ${serviceName.events}

${byService('events').join('\n')}

## Links

- [Home](${site}/)
- [Services](${site}/#services)
- [FAQ](${site}/#faq)
- [Book a demo](${site}/#book-demo)
- [See your top accounts (free preview)](${site}/#top-accounts)
- [LinkedIn](${brand.linkedin})

## Contact

Email: ${brand.email}
`;
}
