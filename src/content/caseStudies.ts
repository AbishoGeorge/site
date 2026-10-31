/**
 * Customer stories for the looping strip under the hero and the story pages behind each card.
 *
 * These are DRAFTS. The companies, people, numbers and quotes are invented to show the format, and every entry is
 * marked `sample: true`, which puts a "Sample" tag on the card and the story page. Replace each one with a real,
 * customer-approved story (and set `sample: false`) before launch.
 */

export type CaseVisual = 'map' | 'skyline' | 'radar' | 'waves' | 'bars' | 'orbit';
export type LogoMark = 'split' | 'triangle' | 'hex' | 'dot' | 'wave' | 'ring';

export interface CaseStudy {
  id: string;
  sample: boolean;
  company: string;
  industry: string;
  mark: LogoMark;
  visual: CaseVisual;
  /** What the card in the strip leads with: a headline number or a short quote. */
  card: { kind: 'stat'; value: string; label: string } | { kind: 'quote'; text: string };
  title: string;
  summary: string;
  challenge: string;
  approach: string[];
  signals: string[];
  results: { value: string; label: string }[];
  quote: { text: string; name: string; role: string };
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'halcyon-cloud',
    sample: true,
    company: 'Halcyon Cloud',
    industry: 'B2B SaaS · 180 employees',
    mark: 'split',
    visual: 'map',
    card: { kind: 'stat', value: '3.2×', label: 'pipeline from target accounts in two quarters' },
    title: 'How Halcyon Cloud tripled pipeline from its target accounts',
    summary:
      'A 14-person sales team swapped static lead lists for accounts with live buying signals, and focused every rep on the companies that were ready to talk.',
    challenge:
      'Reps worked from a list of 4,000 "ideal" accounts with no sense of timing. Most cold outreach landed months too early or too late, and research took up half of every SDR\'s week.',
    approach: [
      'Defined five buying triggers from their last 40 closed deals.',
      'Received a ranked list of 25 accounts each week, each with its signal and source.',
      'Opened every first email with the signal, written from the draft provided.',
    ],
    signals: ['Funding round', 'New VP of Sales', 'Hiring surge', 'CRM renewal'],
    results: [
      { value: '3.2×', label: 'pipeline from target accounts' },
      { value: '41%', label: 'reply rate on signal-led emails' },
      { value: '9 hrs', label: 'research saved per rep each week' },
    ],
    quote: {
      text: 'We stopped guessing who to call. Every account now comes with a reason, and our reps open with it.',
      name: 'Dana R.',
      role: 'VP of Sales',
    },
  },
  {
    id: 'arcwell-security',
    sample: true,
    company: 'Arcwell Security',
    industry: 'Cybersecurity · 320 employees',
    mark: 'triangle',
    visual: 'radar',
    card: {
      kind: 'quote',
      text: '“Instead of checking ten tools for news, we get one short list of accounts that are actually in a buying window.”',
    },
    title: 'How Arcwell Security reached buyers before the RFP',
    summary:
      'By tracking compliance deadlines, security incidents and new CISO hires, Arcwell started conversations months before formal tenders were published.',
    challenge:
      'Most deals arrived as RFPs where the requirements were already written around a competitor. The team needed to be in the room earlier.',
    approach: [
      'Monitored regulatory deadlines and breach disclosures in their target sectors.',
      'Flagged new security leaders in their first 90 days.',
      'Routed each signal to the account owner with a suggested first message.',
    ],
    signals: ['New CISO', 'Compliance deadline', 'Tender published', 'Security incident'],
    results: [
      { value: '2.4×', label: 'more deals sourced before an RFP' },
      { value: '35%', label: 'shorter sales cycle' },
      { value: '18', label: 'new enterprise opportunities in six months' },
    ],
    quote: {
      text: 'Instead of checking ten tools for news, we get one short list of accounts that are actually in a buying window.',
      name: 'Marcus L.',
      role: 'Head of Enterprise Sales',
    },
  },
  {
    id: 'freightline',
    sample: true,
    company: 'Freightline',
    industry: 'Logistics software · 95 employees',
    mark: 'wave',
    visual: 'skyline',
    card: { kind: 'stat', value: '50%', label: 'of new meetings came from signal-led outreach' },
    title: 'How Freightline filled its calendar from expansion signals',
    summary:
      'Warehouse openings, new distribution hubs and operations hires told Freightline exactly which shippers were about to rethink their software.',
    challenge:
      'A small team with a big market: they could only work a few hundred accounts a quarter and had no way to tell which ones were changing.',
    approach: [
      'Tracked expansion news, planning permits and operations job posts.',
      'Prioritised accounts where two or more signals appeared within 60 days.',
      'Mapped the operations and IT leaders behind each account.',
    ],
    signals: ['New distribution hub', 'Operations hiring', 'Funding round', 'WMS evaluation'],
    results: [
      { value: '50%', label: 'of meetings sourced from signals' },
      { value: '2.1×', label: 'more meetings per rep' },
      { value: '27%', label: 'win rate on signal-sourced deals' },
    ],
    quote: {
      text: 'The expansion alerts alone paid for it in the first month.',
      name: 'Priya N.',
      role: 'Head of Growth',
    },
  },
  {
    id: 'corvo-analytics',
    sample: true,
    company: 'Corvo Analytics',
    industry: 'Data platform · 240 employees',
    mark: 'hex',
    visual: 'bars',
    card: { kind: 'stat', value: '90%', label: 'less time spent researching accounts' },
    title: 'How Corvo Analytics gave its SDRs their week back',
    summary:
      'Corvo replaced hours of manual account research with ready-to-work accounts, and moved that time into conversations.',
    challenge:
      'SDRs spent most of each day reading company news and LinkedIn before every touch, which capped how many accounts each person could work.',
    approach: [
      'Each account arrived with the signal, the context and the right contact.',
      'Reps reviewed and personalised drafts instead of writing from scratch.',
      'Managers tracked which signal types turned into meetings.',
    ],
    signals: ['Tech stack change', 'New data leader', 'Earnings call mention', 'Hiring surge'],
    results: [
      { value: '90%', label: 'less research time' },
      { value: '3×', label: 'accounts worked per SDR' },
      { value: '44%', label: 'more first meetings' },
    ],
    quote: {
      text: 'It is the research our SDRs would do if they had unlimited time.',
      name: 'Elena K.',
      role: 'Director of Revenue Operations',
    },
  },
  {
    id: 'meridian-health-it',
    sample: true,
    company: 'Meridian Health IT',
    industry: 'Healthcare software · 410 employees',
    mark: 'dot',
    visual: 'waves',
    card: {
      kind: 'quote',
      text: '“We reach new leaders in their first 90 days, before the vendor shortlist is set. That timing changed everything.”',
    },
    title: 'How Meridian Health IT timed its outreach to leadership changes',
    summary:
      'New revenue-cycle and IT leaders reshape their vendor list early. Meridian made sure it was on it.',
    challenge:
      'Hospital buying committees are large and slow, and by the time Meridian heard about a project, a shortlist already existed.',
    approach: [
      'Tracked leadership appointments across their target health systems.',
      'Combined them with clinic openings and grant awards to rank timing.',
      'Built multi-threaded outreach to each buying committee.',
    ],
    signals: ['New VP of Revenue Cycle', 'Clinic opening', 'Grant awarded', 'Contract renewal'],
    results: [
      { value: '64%', label: 'of new leaders reached in 90 days' },
      { value: '2.8×', label: 'more shortlist invitations' },
      { value: '$1.9M', label: 'new pipeline in one quarter' },
    ],
    quote: {
      text: 'We reach new leaders in their first 90 days, before the vendor shortlist is set. That timing changed everything.',
      name: 'Jordan T.',
      role: 'Chief Revenue Officer',
    },
  },
  {
    id: 'brightpath-hr',
    sample: true,
    company: 'Brightpath HR',
    industry: 'HR tech · 150 employees',
    mark: 'ring',
    visual: 'orbit',
    card: { kind: 'stat', value: '11 hrs', label: 'saved per rep, every week' },
    title: 'How Brightpath HR turned hiring surges into its best pipeline',
    summary:
      'Companies hiring fast need better HR tooling. Brightpath used hiring signals to find them at exactly that moment.',
    challenge:
      'The team knew fast-growing companies were their best customers but found out about growth spurts too late.',
    approach: [
      'Flagged companies whose open roles jumped more than 30% in a month.',
      'Paired each with the HR or People leader and a short, specific opener.',
      'Refreshed the list every week as signals changed.',
    ],
    signals: ['Hiring surge', 'New Head of People', 'Funding round', 'New office'],
    results: [
      { value: '11 hrs', label: 'saved per rep each week' },
      { value: '2.5×', label: 'reply rate versus cold lists' },
      { value: '31%', label: 'more pipeline quarter on quarter' },
    ],
    quote: {
      text: 'Hiring surges were always our best signal. Now we see them the week they start.',
      name: 'Sam O.',
      role: 'Head of Sales',
    },
  },
];
