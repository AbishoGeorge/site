/**
 * The industries we serve and the use case behind each one. The "Industries" section after the hero and the
 * "Use cases" strip both read from this list, and each entry has its own page at #use-case-<id>.
 *
 * Everything here describes how the service works for teams selling into that market: the problem, the signals we
 * watch and why they matter, who we help you reach and what changes. There are no client names or results figures.
 */

export type IndustryVisual = 'radar' | 'bars' | 'circuit' | 'map' | 'waves' | 'skyline' | 'pulse' | 'blueprint';
export type IndustryIcon =
  | 'shield'
  | 'software'
  | 'server'
  | 'truck'
  | 'card'
  | 'people'
  | 'health'
  | 'factory';
export type Accent = 'rose' | 'indigo' | 'sky' | 'amber' | 'violet' | 'emerald' | 'teal' | 'orange';

export interface Signal {
  label: string;
  /** Why this signal tends to come before a purchase in this market. */
  why: string;
}

export interface Industry {
  id: string;
  name: string;
  /** Who the use case is for, written to follow "For": the kind of company that sells into this market. */
  audience: string;
  icon: IndustryIcon;
  accent: Accent;
  visual: IndustryVisual;
  /** One line on when buying happens in this market, shown in the Industries section. */
  moment: string;
  title: string;
  summary: string;
  problem: string;
  /** What usually goes wrong without signals. */
  pains: string[];
  signals: Signal[];
  /** The people we help you reach, by role. */
  buyers: string[];
  steps: string[];
  /** One account as your team would receive it. */
  brief: { account: string; signal: string; whyNow: string; contact: string; opener: string };
  outcomes: string[];
}

export const industries: Industry[] = [
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    audience: 'security software vendors and managed security providers selling to mid-market and enterprise teams.',
    icon: 'shield',
    accent: 'rose',
    visual: 'radar',
    moment: 'Security budgets move when something changes: a new security leader, an incident nearby or a compliance deadline.',
    title: 'Reach security leaders while the budget is still open',
    summary:
      'Most security purchases start with a change inside the buyer, long before an RFP is written. We watch for those changes and tell you who to call and why, while the shortlist is still forming.',
    problem:
      "Security teams rarely buy from a cold email. They buy when something forces the question: a new CISO has to present a plan to the board, an incident at a peer makes the risk real, or an auditor sets a date. By the time a formal RFP is published, the requirements are usually written around a vendor the buyer already knows.",
    pains: [
      'Reps chase the same well-known logos as every other security vendor.',
      'Outreach arrives with no reason attached, so it reads like noise.',
      'Deals show up late, as RFPs shaped by a competitor.',
    ],
    signals: [
      {
        label: 'New CISO or security leader',
        why: 'New leaders review tools and vendors early, and the plan they write sets the budget.',
      },
      {
        label: 'Incidents and breach disclosures',
        why: 'A public incident at the company, or at a close peer, moves security up the agenda.',
      },
      {
        label: 'Compliance deadlines',
        why: 'New rules such as NIS2 and DORA in Europe, and audit or certification dates, put a date on the work.',
      },
      {
        label: 'Security hiring',
        why: 'Job posts for security engineers or a SOC team show where the gaps are and which tools they run.',
      },
      {
        label: 'Cloud and infrastructure changes',
        why: 'A migration or a new platform opens new ground to protect.',
      },
    ],
    buyers: [
      'Chief Information Security Officer',
      'Head of Security Operations',
      'IT Director',
      'Governance, risk and compliance lead',
    ],
    steps: [
      'You tell us who you sell to: company size, regions and the security problems you solve.',
      'We watch leadership moves, incident disclosures, regulatory dates and security hiring across those companies.',
      'Each week you get the accounts where something changed, with the source for every signal and the security leaders to contact.',
    ],
    brief: {
      account: 'A European payments company',
      signal: 'Appointed a new CISO and is hiring for DORA readiness.',
      whyNow: 'DORA now applies to payment firms, and a new security leader is setting the plan for the year.',
      contact: 'Chief Information Security Officer, recently appointed',
      opener:
        "Congratulations on the new role. Most security leaders at payments firms start with DORA readiness and third-party risk. If that's on your plan, I'd like to show you how we handle the reporting side.",
    },
    outcomes: [
      'Conversations start before the RFP, while requirements are still open.',
      'Every first message carries a reason the buyer recognizes.',
      'Reps spend their week on accounts with an active trigger, not on cold logos.',
    ],
  },
  {
    id: 'b2b-software',
    name: 'B2B software',
    audience: 'SaaS companies selling to growing businesses.',
    icon: 'software',
    accent: 'indigo',
    visual: 'bars',
    moment: 'Companies replace tools when they grow, reorganize or bring in a new leader.',
    title: 'Find companies that just outgrew their tools',
    summary:
      "Growth breaks processes. When a company raises money, hires quickly or brings in a new leader, the tools that worked last year stop fitting. We find those moments across your market, so you reach buyers while they're open to change.",
    problem:
      "Most SaaS outbound targets companies that match a profile, not companies that are ready to buy. A perfect fit that just renewed with a competitor isn't a lead. A smaller company that's building a whole new team is. Without timing, reps burn through the list and the market learns to ignore the emails.",
    pains: [
      'Lists built on company size and industry alone, with no sense of timing.',
      'Tool changes discovered after the decision is made.',
      'Sequences that sound like every other vendor in the inbox.',
    ],
    signals: [
      { label: 'Funding rounds', why: 'New money comes with a plan to scale, and the tools to support it.' },
      {
        label: 'New leaders in the team you sell to',
        why: 'A new VP or head of department often replaces tools in their first months.',
      },
      {
        label: 'Hiring surges',
        why: 'Fast hiring in your buyer team means the current setup is about to be stretched.',
      },
      {
        label: 'Tech stack changes',
        why: "Job posts and public docs show which tools a company runs, and when it's replacing one.",
      },
      { label: 'Expansion into new markets', why: 'New offices and regions mean new teams to equip and new processes.' },
    ],
    buyers: [
      'Head of the team your product serves',
      'Operations and RevOps leaders',
      'CFO or finance lead',
      'IT and security reviewers',
    ],
    steps: [
      'We start from your best customers and the moments that came before they bought.',
      'We watch funding, leadership changes, hiring and stack changes across every company that fits.',
      'You get a short weekly list of accounts in a buying window, each with the person to contact and a first message.',
    ],
    brief: {
      account: 'A logistics software company after its Series B',
      signal: 'Hired a new VP of Sales and posted roles for a full SDR team.',
      whyNow: 'A new sales leader is building a team from scratch and choosing the tools it will run on.',
      contact: 'VP of Sales, recently appointed',
      opener:
        "Congrats on the new role. Teams that hire this quickly usually find the current setup doesn't scale with them. Is the stack for the new SDR team already decided, or still open?",
    },
    outcomes: [
      'Reps work fewer accounts, each with a reason to reach out now.',
      "Outreach starts from the buyer's situation, not from your feature list.",
      "You hear about tool changes while they're being decided.",
    ],
  },
  {
    id: 'it-services',
    name: 'IT services and MSPs',
    audience: 'managed service providers, cloud consultancies and IT partners.',
    icon: 'server',
    accent: 'sky',
    visual: 'circuit',
    moment: "IT projects are announced long before they're staffed: moves, mergers, migrations and new leaders.",
    title: 'Be the partner in place before the project starts',
    summary:
      "Office moves, acquisitions, cloud migrations and new IT leaders all create work that an in-house team can't absorb. We spot those projects early, so you're talking to the buyer while they're still deciding who to bring in.",
    problem:
      'IT services are bought at moments of change, and those moments are short. Once a company picks a partner for a migration or an integration, it stays with them for the life of the project. Referrals and inbound only cover part of the market, and cold outreach without a project to point to rarely gets a reply.',
    pains: [
      'Projects are already awarded by the time you hear about them.',
      "Outbound lists your capabilities instead of the buyer's project.",
      'No way to see which companies in your region are about to change.',
    ],
    signals: [
      { label: 'Mergers and acquisitions', why: 'Two companies joining means systems, networks and teams to bring together.' },
      { label: 'Office moves and new sites', why: 'New locations need networks, devices and support from the first day.' },
      {
        label: 'Cloud and platform migrations',
        why: 'Mentions in job posts, earnings calls or the news point to a migration being planned.',
      },
      { label: 'New IT leadership', why: 'A new CIO or IT Director often reviews outside partners early on.' },
      {
        label: 'Tenders and frameworks',
        why: 'Public bodies and large companies publish projects you can bid for, often with short deadlines.',
      },
    ],
    buyers: ['Chief Information Officer', 'IT Director', 'Head of Infrastructure', 'Operations lead for moves and new sites'],
    steps: [
      'You set the regions, company sizes and services you want to grow.',
      'We track deals, moves, migrations, IT leadership changes and published tenders across that market.',
      'Each account arrives with the project behind it, the people who own it and an opening line about their project.',
    ],
    brief: {
      account: 'A regional healthcare group',
      signal: "Announced it's acquiring a group of clinics and is hiring an infrastructure lead.",
      whyNow: 'New sites have to join one network and one helpdesk, and that work is being scoped now.',
      contact: 'IT Director',
      opener:
        'Congratulations on the acquisition. Bringing new sites onto one network and helpdesk is usually the first project after a deal like this. Is that already planned, or still being scoped?',
    },
    outcomes: [
      "You're in the conversation while the project is still being shaped.",
      'Every first call is about a real project, not a service list.',
      'Your pipeline reflects what is happening in your region this quarter.',
    ],
  },
  {
    id: 'logistics',
    name: 'Logistics and supply chain',
    audience: 'software and service providers selling to shippers, 3PLs and carriers.',
    icon: 'truck',
    accent: 'amber',
    visual: 'map',
    moment: 'New warehouses, routes and regions are planned in public: permits, job posts and press releases.',
    title: 'Get in before the new warehouse goes live',
    summary:
      'Logistics companies announce growth long before it opens: planning permits, site announcements and waves of operations hiring. We track those signals so you can help shape the systems for a new site, instead of competing to replace them later.',
    problem:
      "Warehouse and transport systems are chosen while a site is being planned, then kept for years. Reach the operations team after go-live and you're asking them to rip out something new. The window is the time between the announcement and the opening, and most vendors miss it because the signals are scattered across local news, permit filings and job boards.",
    pains: [
      'Site projects discovered after the systems are chosen.',
      'Signals scattered across local news, permits and job boards.',
      'Outreach to head office that never reaches the people running the new site.',
    ],
    signals: [
      { label: 'New distribution centers', why: 'Announced sites and planning permits show where capacity is being added.' },
      { label: 'Operations hiring', why: 'A wave of roles for a new location reveals the timeline and the team.' },
      {
        label: 'Expansion into new regions',
        why: 'New lanes, countries or customers mean new carriers, systems and partners.',
      },
      {
        label: 'Systems in transition',
        why: 'Job posts that mention a WMS, TMS or automation project point to an active evaluation.',
      },
      {
        label: 'New operations leadership',
        why: 'A new COO or head of logistics tends to revisit the network and the tools behind it.',
      },
    ],
    buyers: ['VP or Head of Operations', 'Director of Logistics', 'Site and General Managers', 'Supply chain systems lead'],
    steps: [
      'We map the shippers, 3PLs and carriers you can serve, by region and by type of operation.',
      'We follow permits, site announcements, operations hiring and systems projects across them.',
      'You get each site project with its timeline, the operations leaders behind it and a first message.',
    ],
    brief: {
      account: 'A national food distributor',
      signal: 'Filed plans for a new cold-storage distribution center and posted roles for its launch team.',
      whyNow: 'Systems for the new site are chosen before the launch team starts.',
      contact: 'Director of Logistics',
      opener:
        'Saw the plans for the new cold-storage site. Teams in your position usually lock in their warehouse systems well before the first hires start. Have you chosen yours yet?',
    },
    outcomes: [
      'You help design the systems for new sites instead of displacing them later.',
      'Your team hears about projects that never reach a press release.',
      'Outreach goes to the people running the operation, not just head office.',
    ],
  },
  {
    id: 'fintech',
    name: 'Fintech and payments',
    audience: 'payments, banking and finance software companies selling to finance teams.',
    icon: 'card',
    accent: 'violet',
    visual: 'waves',
    moment: 'Finance stacks change when a company enters new markets, raises capital or brings in a new CFO.',
    title: 'Meet finance teams as they expand into new markets',
    summary:
      'New countries mean new currencies, entities, tax rules and payment methods. We find companies at that point of expansion, along with the finance leaders who have to make it work.',
    problem:
      "Finance software is sticky. Most companies only revisit payments, billing or accounting tools when the current setup breaks, and expansion is when it breaks. If you aren't talking to the CFO while the new entity is being set up, the decision gets made with whatever is already in place.",
    pains: [
      'Expansion plans discovered after the finance setup is chosen.',
      'Reaching the wrong person: marketing announces the expansion, finance makes the call.',
      'Messages about features instead of the problem the buyer has this quarter.',
    ],
    signals: [
      {
        label: 'Expansion into new countries',
        why: 'New entities and markets bring new currencies, tax rules and payment methods.',
      },
      { label: 'Funding rounds', why: 'New capital comes with investor reporting, tighter controls and a plan to scale.' },
      { label: 'New finance leadership', why: 'A new CFO or controller often reviews the finance stack in their first year.' },
      { label: 'Finance hiring', why: 'Roles in treasury, billing or accounting operations show what is being built.' },
      { label: 'Licensing and regulatory news', why: 'New licenses or rules can force changes to how money moves.' },
    ],
    buyers: ['Chief Financial Officer', 'Financial Controller', 'Head of Finance Operations', 'Head of Payments'],
    steps: [
      'We define the companies that fit your product by business model, region and stage.',
      'We watch expansions, funding, finance hiring and leadership changes across that market.',
      'You get each account with the finance leader to contact and a message about their expansion.',
    ],
    brief: {
      account: 'A subscription software company',
      signal: 'Opened new entities in Europe and is hiring a billing operations lead.',
      whyNow: 'Billing has to handle new currencies and tax rules this quarter.',
      contact: 'Head of Finance Operations',
      opener:
        'Congrats on the European launch. Adding entities usually means new currencies and tax rules in billing at the same time. Is the current setup ready for that, or is it on the list?',
    },
    outcomes: [
      'You reach finance leaders while the new setup is being designed.',
      "Your message speaks to the expansion they're living through.",
      'Fewer cold calls to companies that are happy with their current stack.',
    ],
  },
  {
    id: 'hr-staffing',
    name: 'HR tech and staffing',
    audience: 'HR software companies, recruitment agencies and workforce providers.',
    icon: 'people',
    accent: 'emerald',
    visual: 'skyline',
    moment: 'Hiring tells you who is growing, which teams are growing and how fast.',
    title: 'Find companies hiring faster than their HR team can keep up',
    summary:
      'When open roles pile up, the people team is stretched first. We track hiring surges, new offices and new HR leaders, so you reach companies when recruiting, onboarding and HR tools are under the most pressure.',
    problem:
      "Every company says it's hiring. What matters is a sudden change: a burst of open roles, a new location to staff or a new people leader with a mandate. Those changes show up on public job boards every day, but no one has time to watch them across thousands of companies and spot the ones that matter.",
    pains: [
      'Prospecting companies that hire steadily instead of the ones that just started scaling.',
      'Finding out about a new office after the recruiting partner is chosen.',
      "Generic outreach that ignores the roles they're actually trying to fill.",
    ],
    signals: [
      { label: 'Hiring surges', why: 'A sharp rise in open roles shows a team or a whole company scaling.' },
      { label: 'New offices and locations', why: 'A new site has to be staffed from scratch, often on a tight timeline.' },
      {
        label: 'New HR and people leaders',
        why: 'New heads of people often review recruiting partners and HR systems early.',
      },
      { label: 'Funding rounds', why: 'Fresh capital usually turns into a hiring plan within months.' },
      {
        label: 'Restructuring news',
        why: 'Reorganizations create demand for outplacement, contractors and new tools.',
      },
    ],
    buyers: ['Chief People Officer', 'Head of Talent Acquisition', 'HR Director', 'Hiring managers in the growing team'],
    steps: [
      'We agree the company sizes, sectors and roles where you win.',
      'We track open roles, new locations, people leadership changes and funding across that market every day.',
      "You get each account with the roles they're trying to fill, who owns hiring and a first message.",
    ],
    brief: {
      account: 'A fast-growing engineering consultancy',
      signal: 'Opened a new office and posted roles for most of its teams there.',
      whyNow: 'The new office has to be staffed quickly, and the hiring plan is being set now.',
      contact: 'Head of Talent Acquisition',
      opener:
        'Saw the new office and the roles going up for it. Filling a new site at that pace is hard to do with an in-house team alone. How are you planning to staff it?',
    },
    outcomes: [
      'You reach companies at the start of a hiring push, not the end of it.',
      "Every message names the roles they're hiring for.",
      'Your team stops chasing companies with no open need.',
    ],
  },
  {
    id: 'healthcare',
    name: 'Healthcare technology',
    audience: 'health tech, medical device and services companies selling to hospitals and clinics.',
    icon: 'health',
    accent: 'teal',
    visual: 'pulse',
    moment: 'Health systems buy around new sites, new leaders, public funding and system upgrades.',
    title: 'Time your outreach to how health systems really buy',
    summary:
      'Hospital buying is slow and run by committee, but it follows visible events: new clinics, leadership appointments, grants and system upgrades. We track them so you can start conversations early and reach every member of the buying group.',
    problem:
      "Healthcare sales cycles are long and the buying group is large. Vendors that wait for a tender end up competing on price against requirements they didn't help shape. The teams that win are in conversation months earlier, when a new site is planned or a new leader is setting priorities.",
    pains: [
      'Learning about projects at the tender stage.',
      'Deals that stall when the one contact you have moves on.',
      'Little visibility into which organizations have budget this year.',
    ],
    signals: [
      { label: 'New hospitals and clinics', why: 'New sites need systems, devices and services, chosen well before opening.' },
      { label: 'Leadership appointments', why: 'New CIOs, CMIOs and service line leaders bring new priorities.' },
      { label: 'Grants and public funding', why: 'Public funding usually comes with a defined project and timeline.' },
      {
        label: 'System upgrades and migrations',
        why: 'Replacing a patient records system or another core platform pulls in integration, training and services.',
      },
      {
        label: 'Tenders and early market notices',
        why: 'Published tenders and early market engagement notices show what is coming next.',
      },
    ],
    buyers: [
      'Chief Information Officer',
      'Chief Medical Information Officer',
      'Director of Operations',
      'Procurement lead',
    ],
    steps: [
      'We map the hospitals, clinic groups and health systems that fit your product.',
      'We follow new sites, appointments, funding awards, system upgrades and tender notices across them.',
      'You get each account with the members of the buying group to reach and a first message for each.',
    ],
    brief: {
      account: 'A regional hospital network',
      signal: 'Received public funding to modernize patient records and appointed a new CMIO.',
      whyNow: 'Integration partners for the records program are chosen early.',
      contact: 'Chief Medical Information Officer, recently appointed',
      opener:
        'Congratulations on the funding for the records program. Projects like this usually choose integration partners early. Who is leading that work on your side?',
    },
    outcomes: [
      "You're part of the conversation before the tender is written.",
      'Deals involve the whole buying group, not a single contact.',
      'Your team focuses on organizations with funded projects this year.',
    ],
  },
  {
    id: 'industrial',
    name: 'Industrial and manufacturing',
    audience: 'equipment, automation, materials and service suppliers selling to manufacturers.',
    icon: 'factory',
    accent: 'orange',
    visual: 'blueprint',
    moment: 'Plants announce investment long before they buy: new lines, permits, grants and plant leadership.',
    title: 'Get specified into new plants before the tender',
    summary:
      "Manufacturers announce new plants, lines and expansions well ahead of purchasing. We follow those announcements, permits and hiring waves, so you're part of the design conversation instead of a line in a tender.",
    problem:
      'In manufacturing, the important decisions are made at the design stage. Equipment, automation and suppliers are specified long before a purchase order goes out. By the time a tender is published, the specification often favors whoever helped write it.',
    pains: [
      'Capital projects found at the purchasing stage.',
      'Reaching procurement instead of the engineers who write the specification.',
      'No view of which plants are investing this year.',
    ],
    signals: [
      {
        label: 'New plants and production lines',
        why: 'Investment announcements show where capacity is being added and when.',
      },
      {
        label: 'Planning permits and incentives',
        why: 'Permits and public incentives confirm a project is real and give it a timeline.',
      },
      {
        label: 'Engineering and operations hiring',
        why: 'Roles for plant engineers or automation specialists reveal what is being built.',
      },
      {
        label: 'Plant leadership changes',
        why: 'A new plant manager or operations director often arrives with an improvement plan.',
      },
      {
        label: 'Energy and emissions targets',
        why: 'Commitments to cut energy use or emissions drive upgrades to equipment and processes.',
      },
    ],
    buyers: ['Plant Manager', 'Head of Engineering', 'Operations Director', 'Procurement and sourcing lead'],
    steps: [
      'We define the plants and manufacturers you can serve, by process, region and size.',
      'We follow investment news, permits, incentives, engineering hiring and leadership changes across them.',
      'You get each project with its stage, the engineers and plant leaders to reach and a first message.',
    ],
    brief: {
      account: 'A packaging manufacturer',
      signal: 'Announced a new production line and is hiring automation engineers for the project.',
      whyNow: 'Automation for the new line is being specified before procurement gets involved.',
      contact: 'Head of Engineering',
      opener:
        'Saw the announcement about the new line. Teams at this stage usually finalize automation specs before procurement gets involved. Is that work underway?',
    },
    outcomes: [
      'You help shape the specification instead of bidding against it.',
      'Your first conversation is with the engineers who decide.',
      'Your pipeline follows the plants that are investing right now.',
    ],
  },
];
