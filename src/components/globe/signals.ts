// Illustrative accounts for the hero globe. Company names are fictional.

export type SignalKind =
  | 'hiring'
  | 'funding'
  | 'leadership'
  | 'tech'
  | 'rfp'
  | 'expansion'
  | 'regulatory'
  | 'earnings';

export interface Evidence {
  kind: SignalKind;
  text: string;
  source: string;
  age: string;
}

export interface AccountSignal {
  id: string;
  company: string;
  initials: string;
  industry: string;
  size: string;
  city: string;
  region: string;
  countryCode: string;
  /** Country name exactly as it appears in world-atlas countries-110m. */
  country: string;
  lat: number;
  lng: number;
  /** Globe zoom when focused on this account (1 = whole globe). */
  zoom: number;
  score: number;
  evidence: Evidence[];
  whyNow: string;
}

export const accountSignals: AccountSignal[] = [
  {
    id: 'munich',
    company: 'Kestrel Mobility',
    initials: 'KM',
    industry: 'Automotive software',
    size: '1,200 employees',
    city: 'Munich',
    region: 'Bavaria',
    countryCode: 'DE',
    country: 'Germany',
    lat: 48.14,
    lng: 11.58,
    zoom: 2.6,
    score: 94,
    evidence: [
      { kind: 'hiring', text: '18 data-platform roles opened in 30 days', source: 'Careers page', age: '3d ago' },
      { kind: 'leadership', text: 'New CIO joined from a cloud-first OEM', source: 'LinkedIn', age: '6w ago' },
      { kind: 'rfp', text: 'Tender issued for data warehouse migration', source: 'Procurement portal', age: '9d ago' },
    ],
    whyNow: 'Platform rebuild is funded and the vendor shortlist is still open.',
  },
  {
    id: 'dubai',
    company: 'Al Noor Hospitality',
    initials: 'AN',
    industry: 'Hotels & resorts',
    size: '4,800 employees',
    city: 'Dubai',
    region: 'Dubai',
    countryCode: 'AE',
    country: 'United Arab Emirates',
    lat: 25.2,
    lng: 55.27,
    zoom: 2.8,
    score: 91,
    evidence: [
      { kind: 'expansion', text: '5 new properties announced for 2027', source: 'Investor update', age: '2w ago' },
      { kind: 'rfp', text: 'RFP live for a guest-data platform', source: 'Supplier portal', age: '6d ago' },
      { kind: 'hiring', text: 'Hiring a Director of CRM & Loyalty', source: 'Job board', age: '4d ago' },
    ],
    whyNow: 'New properties need a unified guest platform before opening day.',
  },
  {
    id: 'bengaluru',
    company: 'Quanta Retail Tech',
    initials: 'QR',
    industry: 'Retail technology',
    size: '2,300 employees',
    city: 'Bengaluru',
    region: 'Karnataka',
    countryCode: 'IN',
    country: 'India',
    lat: 12.97,
    lng: 77.59,
    zoom: 2.0,
    score: 89,
    evidence: [
      { kind: 'expansion', text: 'New 400-seat engineering centre opening', source: 'Press release', age: '11d ago' },
      { kind: 'leadership', text: 'Head of Procurement hired from a Big Four firm', source: 'LinkedIn', age: '5w ago' },
      { kind: 'tech', text: 'Job posts mention moving off legacy ERP', source: 'Job descriptions', age: '8d ago' },
    ],
    whyNow: 'New site and new buyer: budgets are being set this quarter.',
  },
  {
    id: 'tokyo',
    company: 'Kitora Precision Works',
    initials: 'KP',
    industry: 'Industrial manufacturing',
    size: '6,500 employees',
    city: 'Tokyo',
    region: 'Kanto',
    countryCode: 'JP',
    country: 'Japan',
    lat: 35.68,
    lng: 139.69,
    zoom: 2.4,
    score: 92,
    evidence: [
      { kind: 'earnings', text: '"Cloud ERP" named a FY priority on earnings call', source: 'IR transcript', age: '3w ago' },
      { kind: 'expansion', text: 'New plant announced in Vietnam', source: 'Business press', age: '5w ago' },
      { kind: 'hiring', text: '20-person digital transformation office formed', source: 'Careers page', age: '2w ago' },
    ],
    whyNow: 'Board-level mandate plus a new plant to bring online on the new stack.',
  },
  {
    id: 'sydney',
    company: 'Southerly Grid Energy',
    initials: 'SG',
    industry: 'Utilities & energy',
    size: '1,900 employees',
    city: 'Sydney',
    region: 'New South Wales',
    countryCode: 'AU',
    country: 'Australia',
    lat: -33.87,
    lng: 151.21,
    zoom: 1.8,
    score: 90,
    evidence: [
      { kind: 'funding', text: 'Awarded A$40M grid-modernisation grant', source: 'Government notice', age: '10d ago' },
      { kind: 'hiring', text: '12 SCADA & OT security engineers wanted', source: 'Job board', age: '6d ago' },
      { kind: 'leadership', text: 'New COO appointed from a tier-one utility', source: 'Company news', age: '4w ago' },
    ],
    whyNow: 'Grant money must be committed within 12 months.',
  },
  {
    id: 'sao-paulo',
    company: 'Vale Azul Logística',
    initials: 'VA',
    industry: 'Logistics & 3PL',
    size: '3,100 employees',
    city: 'São Paulo',
    region: 'São Paulo',
    countryCode: 'BR',
    country: 'Brazil',
    lat: -23.55,
    lng: -46.63,
    zoom: 1.8,
    score: 87,
    evidence: [
      { kind: 'funding', text: 'R$180M credit facility closed for expansion', source: 'Regulatory filing', age: '2w ago' },
      { kind: 'expansion', text: 'Two new distribution hubs under construction', source: 'Local news', age: '3w ago' },
      { kind: 'tech', text: 'Evaluating warehouse management systems', source: 'Job descriptions', age: '5d ago' },
    ],
    whyNow: 'New hubs go live in Q2. Tooling decisions happen now.',
  },
  {
    id: 'austin',
    company: 'Brightline Health Partners',
    initials: 'BH',
    industry: 'Healthcare network',
    size: '7,200 employees',
    city: 'Austin',
    region: 'Texas',
    countryCode: 'US',
    country: 'United States of America',
    lat: 30.27,
    lng: -97.74,
    zoom: 1.7,
    score: 96,
    evidence: [
      { kind: 'funding', text: '$62M Series C closed', source: 'Press release', age: '12d ago' },
      { kind: 'expansion', text: '3 new clinics announced across Texas', source: 'Local news', age: '3w ago' },
      { kind: 'hiring', text: 'VP of Revenue Cycle role opened', source: 'Job board', age: '5d ago' },
    ],
    whyNow: 'Fresh capital and a new revenue leader who has budget to spend.',
  },
  {
    id: 'toronto',
    company: 'Maplewave Credit Union',
    initials: 'MC',
    industry: 'Financial services',
    size: '2,600 employees',
    city: 'Toronto',
    region: 'Ontario',
    countryCode: 'CA',
    country: 'Canada',
    lat: 43.65,
    lng: -79.38,
    zoom: 2.2,
    score: 88,
    evidence: [
      { kind: 'leadership', text: 'First Chief Digital Officer appointed', source: 'Company news', age: '7w ago' },
      { kind: 'expansion', text: 'Acquired two regional lenders', source: 'Regulatory filing', age: '4w ago' },
      { kind: 'regulatory', text: 'Open-banking compliance deadline set for next year', source: 'Regulator notice', age: '2w ago' },
    ],
    whyNow: 'Merging three core systems under a new digital leader.',
  },
  {
    id: 'london',
    company: 'Halden & Rowe Insurance',
    initials: 'HR',
    industry: 'Insurance',
    size: '3,400 employees',
    city: 'London',
    region: 'England',
    countryCode: 'UK',
    country: 'United Kingdom',
    lat: 51.51,
    lng: -0.13,
    zoom: 2.6,
    score: 93,
    evidence: [
      { kind: 'earnings', text: 'CFO cited "claims automation" 4× on Q3 call', source: 'IR transcript', age: '3w ago' },
      { kind: 'tech', text: 'Policy-admin contract expires in 90 days', source: 'Public tender record', age: '1w ago' },
      { kind: 'regulatory', text: 'Consumer Duty review flagged claims handling', source: 'Annual report', age: '6w ago' },
    ],
    whyNow: 'Contract renewal window opens next month.',
  },
];

export const signalKindLabel: Record<SignalKind, string> = {
  hiring: 'Hiring surge',
  funding: 'Funding',
  leadership: 'Leadership change',
  tech: 'Tech change',
  rfp: 'Open RFP',
  expansion: 'Expansion',
  regulatory: 'Regulatory',
  earnings: 'Earnings call',
};

/** Short tags drawn next to the evidence arcs on the globe. */
export const signalKindTag: Record<SignalKind, string> = {
  hiring: 'JOBS',
  funding: 'FUNDING',
  leadership: 'PEOPLE',
  tech: 'TECH',
  rfp: 'RFP',
  expansion: 'NEWS',
  regulatory: 'FILINGS',
  earnings: 'EARNINGS',
};

export const signalTicker: { kind: SignalKind; text: string; place: string }[] = [
  { kind: 'funding', text: 'Series B closed · Climate SaaS', place: 'Berlin, DE' },
  { kind: 'hiring', text: '22 SDR roles opened · Cybersecurity', place: 'Tel Aviv, IL' },
  { kind: 'leadership', text: 'New CRO appointed · Fintech', place: 'London, UK' },
  { kind: 'tech', text: 'Migrating CRM · Logistics', place: 'Rotterdam, NL' },
  { kind: 'rfp', text: 'Data platform tender · Public health', place: 'Madrid, ES' },
  { kind: 'expansion', text: 'New APAC HQ · Payments', place: 'Singapore, SG' },
  { kind: 'earnings', text: '"AI roadmap" cited 6× · Retail', place: 'Chicago, US' },
  { kind: 'regulatory', text: 'Compliance deadline · Banking', place: 'Frankfurt, DE' },
  { kind: 'hiring', text: 'Head of RevOps wanted · HR tech', place: 'Toronto, CA' },
  { kind: 'funding', text: 'Growth round · Medtech', place: 'Boston, US' },
  { kind: 'expansion', text: '3 new plants · Manufacturing', place: 'Pune, IN' },
  { kind: 'tech', text: 'Moving to cloud ERP · Automotive', place: 'Nagoya, JP' },
];
