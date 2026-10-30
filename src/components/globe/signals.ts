// Representative examples for the hero globe. Each stop shows one signal, not an account's full evidence.

export type SignalKind = 'funding' | 'hiring' | 'leadership' | 'expansion' | 'tech' | 'renewal' | 'earnings';

export interface ExampleSignal {
  id: string;
  kind: SignalKind;
  headline: string;
  /** Who the signal is about, described by segment rather than a company name. */
  segment: string;
  city: string;
  countryCode: string;
  /** Country name exactly as it appears in world-atlas countries-110m. */
  country: string;
  lat: number;
  lng: number;
  /** Globe zoom when focused here (1 = whole globe). */
  zoom: number;
  source: string;
  age: string;
  /** The person to reach out to. Email and phone are shown masked, as a preview. */
  contact: { name: string; title: string; email: string; phone: string };
}

export const exampleSignals: ExampleSignal[] = [
  {
    id: 'london',
    kind: 'funding',
    headline: 'Raised a $45M Series B to expand into Europe',
    segment: 'Fintech · 420 employees',
    city: 'London',
    countryCode: 'UK',
    country: 'United Kingdom',
    lat: 51.51,
    lng: -0.13,
    zoom: 2.6,
    source: 'Press release',
    age: '2 days ago',
    contact: { name: 'Priya S.', title: 'Head of Finance Operations', email: 'pr•••@•••••••.com', phone: '+44 7••• ••• 482' },
  },
  {
    id: 'bengaluru',
    kind: 'expansion',
    headline: 'Opening a 600-seat delivery center this quarter',
    segment: 'IT services · 5,000 employees',
    city: 'Bengaluru',
    countryCode: 'IN',
    country: 'India',
    lat: 12.97,
    lng: 77.59,
    zoom: 2.1,
    source: 'Local news',
    age: '3 days ago',
    contact: { name: 'Arjun M.', title: 'VP, Delivery', email: 'ar•••@••••••.in', phone: '+91 98••• ••• 317' },
  },
  {
    id: 'tokyo',
    kind: 'earnings',
    headline: 'CEO named cloud migration a top priority for next year',
    segment: 'Electronics · 3,000 employees',
    city: 'Tokyo',
    countryCode: 'JP',
    country: 'Japan',
    lat: 35.68,
    lng: 139.69,
    zoom: 2.4,
    source: 'Earnings call',
    age: '3 weeks ago',
    contact: { name: 'Kenji T.', title: 'Director of IT', email: 'ke•••@••••••.jp', phone: '+81 90-••••-•264' },
  },
  {
    id: 'sydney',
    kind: 'funding',
    headline: 'Awarded a A$12M grant to modernise patient records',
    segment: 'Healthcare · 900 employees',
    city: 'Sydney',
    countryCode: 'AU',
    country: 'Australia',
    lat: -33.87,
    lng: 151.21,
    zoom: 1.9,
    source: 'Government notice',
    age: '1 week ago',
    contact: { name: 'Emma L.', title: 'Chief Digital Officer', email: 'em•••@••••••.au', phone: '+61 4•• ••• 905' },
  },
  {
    id: 'dubai',
    kind: 'expansion',
    headline: 'Announced four new hotels opening next year',
    segment: 'Hospitality · 2,500 employees',
    city: 'Dubai',
    countryCode: 'AE',
    country: 'United Arab Emirates',
    lat: 25.2,
    lng: 55.27,
    zoom: 2.8,
    source: 'Press release',
    age: '6 days ago',
    contact: { name: 'Omar H.', title: 'VP Operations', email: 'om•••@•••••••.ae', phone: '+971 50 ••• •• 71' },
  },
  {
    id: 'munich',
    kind: 'leadership',
    headline: 'Appointed a new CIO to lead its digital overhaul',
    segment: 'Manufacturing · 2,000 employees',
    city: 'Munich',
    countryCode: 'DE',
    country: 'Germany',
    lat: 48.14,
    lng: 11.58,
    zoom: 2.7,
    source: 'Company news',
    age: '1 week ago',
    contact: { name: 'Lena K.', title: 'Chief Information Officer', email: 'le•••@••••••.de', phone: '+49 151 •••• •338' },
  },
  {
    id: 'sao-paulo',
    kind: 'tech',
    headline: 'Replacing its warehouse management system',
    segment: 'Logistics · 1,200 employees',
    city: 'São Paulo',
    countryCode: 'BR',
    country: 'Brazil',
    lat: -23.55,
    lng: -46.63,
    zoom: 1.9,
    source: 'Job posting',
    age: '4 days ago',
    contact: { name: 'Rafael C.', title: 'Head of Supply Chain Tech', email: 'ra•••@••••••.br', phone: '+55 11 9••••-•412' },
  },
  {
    id: 'toronto',
    kind: 'renewal',
    headline: 'CRM contract comes up for renewal in 90 days',
    segment: 'Insurance · 1,500 employees',
    city: 'Toronto',
    countryCode: 'CA',
    country: 'Canada',
    lat: 43.65,
    lng: -79.38,
    zoom: 2.1,
    source: 'Public filing',
    age: '2 weeks ago',
    contact: { name: 'Daniel R.', title: 'Director, CRM & Sales Ops', email: 'da•••@•••••••.ca', phone: '+1 416 •••-•729' },
  },
  {
    id: 'austin',
    kind: 'hiring',
    headline: 'Hiring 14 account executives this quarter',
    segment: 'B2B software · 300 employees',
    city: 'Austin',
    countryCode: 'US',
    country: 'United States of America',
    lat: 30.27,
    lng: -97.74,
    zoom: 1.8,
    source: 'Job boards',
    age: '5 days ago',
    contact: { name: 'Megan W.', title: 'VP of Sales', email: 'me•••@••••••.com', phone: '+1 512 •••-•186' },
  },
];

export const signalKindLabel: Record<SignalKind, string> = {
  funding: 'Funding',
  hiring: 'Hiring surge',
  leadership: 'Leadership change',
  expansion: 'Expansion',
  tech: 'Tech change',
  renewal: 'Contract renewal',
  earnings: 'Earnings call',
};

/** Short tags that flicker up at other cities while the camera holds on a signal. */
export const ambientTags = [
  'Hiring surge',
  'New VP Sales',
  'Funding round',
  'New office',
  'Tech change',
  'Contract renewal',
  'Leadership hire',
  'Grant awarded',
  'RFP published',
  'Acquisition',
];

/** Cities used as network nodes, for ambient arcs and the small tags. */
export const hubCities: [number, number][] = [
  [40.71, -74.0], [37.77, -122.42], [41.88, -87.63], [29.76, -95.37], [47.61, -122.33], [25.76, -80.19],
  [19.43, -99.13], [4.71, -74.07], [-12.05, -77.04], [-34.6, -58.38], [-22.91, -43.17], [45.5, -73.57],
  [49.28, -123.12], [53.35, -6.26], [48.86, 2.35], [52.37, 4.9], [40.42, -3.7], [41.9, 12.5], [59.33, 18.07],
  [52.23, 21.01], [50.45, 30.52], [41.01, 28.98], [30.04, 31.24], [6.52, 3.38], [-1.29, 36.82], [-26.2, 28.05],
  [24.71, 46.68], [28.61, 77.21], [19.08, 72.88], [13.08, 80.27], [1.35, 103.82], [13.76, 100.5], [3.14, 101.69],
  [-6.21, 106.85], [14.6, 120.98], [22.32, 114.17], [31.23, 121.47], [39.9, 116.4], [37.57, 126.98], [34.69, 135.5],
  [-37.81, 144.96], [-27.47, 153.03], [-36.85, 174.76], [-31.95, 115.86],
];
