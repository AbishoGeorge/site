/**
 * The industries we serve and one use case for each. The Industries section after the hero and the Use cases strip
 * both read from this list, and each use case has its own page at #use-case-<id>.
 *
 * Each use case follows one company through one specific problem: what goes wrong, how we solve it and what changes.
 * The companies are described by what they sell rather than named, and there are no results figures.
 */

export type IndustryVisual =
  | 'radar'
  | 'bars'
  | 'circuit'
  | 'map'
  | 'waves'
  | 'skyline'
  | 'pulse'
  | 'blueprint'
  | 'modules';
export type IndustryIcon =
  | 'shield'
  | 'software'
  | 'server'
  | 'truck'
  | 'card'
  | 'people'
  | 'health'
  | 'factory'
  | 'erp';
export type Accent = 'rose' | 'indigo' | 'sky' | 'amber' | 'violet' | 'emerald' | 'teal' | 'orange' | 'fuchsia';

export interface Signal {
  label: string;
  /** Why this signal tends to come before a purchase in this market. */
  why: string;
}

export interface UseCase {
  title: string;
  /** The company in the story, described by what it sells and to whom. */
  company: string;
  problem: string;
  solution: string;
  /** The signals the solution relies on, shown as tags. */
  signals: string[];
  outcomes: string[];
}

export interface Industry {
  id: string;
  name: string;
  /** Who sells into this market, written to follow "For". */
  audience: string;
  icon: IndustryIcon;
  accent: Accent;
  visual: IndustryVisual;
  /** One line on when buying happens in this market. */
  moment: string;
  /** What we watch in this market, shown in the Industries section. */
  signals: Signal[];
  /** The people we help you reach, by role. */
  buyers: string[];
  useCase: UseCase;
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
    ],
    buyers: ['Chief Information Security Officer', 'Head of Security Operations', 'IT Director'],
    useCase: {
      title: 'Finding the banks that need help with DORA now',
      company: 'A security software company that sells third-party risk monitoring to banks and insurers in Europe.',
      problem:
        "Since DORA came into force, banks across Europe have to track the risk from their technology suppliers. The company's reps email every bank in their territory with the same message about it. Most banks have either finished that work or haven't started, so replies are rare, and the deals that do appear arrive as tenders already written around a competitor.",
      solution:
        'We watch for the moments that make a bank act: a new CISO or head of third-party risk, job posts for DORA and vendor risk roles, DORA programs named in annual reports, and incidents at peer banks. Every week the reps get the banks where one of these just happened, with the person who owns the problem and a first message that names it.',
      signals: ['New CISO or risk leader', 'DORA and vendor risk hiring', 'DORA programs in annual reports', 'Incidents at peer banks'],
      outcomes: [
        "Reps stop emailing banks that aren't ready and focus on the ones with an open project.",
        'Conversations start while the requirements are still being written, before any tender.',
        'Every first message names a reason the buyer recognizes, so the right people reply.',
      ],
    },
  },
  {
    id: 'b2b-software',
    name: 'B2B software',
    audience: 'SaaS companies selling to growing businesses.',
    icon: 'software',
    accent: 'indigo',
    visual: 'bars',
    moment: 'Companies replace tools when they grow, reorganize or bring in a new leader.',
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
    ],
    buyers: ['Head of the team your product serves', 'Operations and RevOps leaders', 'CFO or finance lead'],
    useCase: {
      title: 'Reaching finance teams as they outgrow spreadsheets',
      company: 'A SaaS company that sells spend management software to mid-sized businesses.',
      problem:
        "The SDR team prospects every company in the right size band. Most of them are happy with what they have, and the ones that are ready to switch have usually started a trial with a competitor before anyone calls. Nobody can see which companies are outgrowing their finance setup right now.",
      solution:
        "We look for the moments that break a finance team's setup: a funding round, a new CFO or finance director, a jump in finance hiring and new entities in other countries. Every week the SDRs get the companies where this just happened, with the finance leader to contact and an opening line about their situation.",
      signals: ['Funding rounds', 'New CFO or finance director', 'Finance team hiring', 'New entities abroad'],
      outcomes: [
        'SDRs work a short list of companies with a reason to change, not the whole size band.',
        "Conversations start before a competitor's trial does.",
        "Opening lines talk about the buyer's situation, not the product's features.",
      ],
    },
  },
  {
    id: 'it-services',
    name: 'IT services and MSPs',
    audience: 'managed service providers, cloud consultancies and IT partners.',
    icon: 'server',
    accent: 'sky',
    visual: 'circuit',
    moment: "IT projects are announced long before they're staffed: moves, mergers, migrations and new leaders.",
    signals: [
      { label: 'Mergers and acquisitions', why: 'Two companies joining means systems, networks and teams to bring together.' },
      { label: 'Office moves and new sites', why: 'New locations need networks, devices and support from the first day.' },
      {
        label: 'Cloud and platform migrations',
        why: 'Mentions in job posts, earnings calls or the news point to a migration being planned.',
      },
      { label: 'New IT leadership', why: 'A new CIO or IT Director often reviews outside partners early on.' },
    ],
    buyers: ['Chief Information Officer', 'IT Director', 'Head of Infrastructure'],
    useCase: {
      title: 'Getting into acquisitions before the IT work is awarded',
      company: 'A managed service provider that runs networks, devices and helpdesk for multi-site businesses.',
      problem:
        "The provider's best projects come from acquisitions: two companies merge and suddenly need one network, one helpdesk and one set of devices. But the team usually hears about a deal months later, after the buyer's existing IT partner has been handed the integration.",
      solution:
        'We track acquisitions, new sites and IT leadership changes among multi-site businesses in their region. When a deal is announced, they get the account the same week, with the IT owner on the buying side and a message about bringing the new sites together.',
      signals: ['Mergers and acquisitions', 'New sites and office moves', 'New IT leadership', 'Infrastructure hiring'],
      outcomes: [
        "They're in the conversation while the integration is still being scoped.",
        "Outreach is about the buyer's project, not a list of services.",
        "Their pipeline follows what's changing in their region.",
      ],
    },
  },
  {
    id: 'logistics',
    name: 'Logistics and supply chain',
    audience: 'software and service providers selling to shippers, 3PLs and carriers.',
    icon: 'truck',
    accent: 'amber',
    visual: 'map',
    moment: 'New warehouses, routes and regions are planned in public: permits, job posts and press releases.',
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
    ],
    buyers: ['VP or Head of Operations', 'Director of Logistics', 'Site and General Managers'],
    useCase: {
      title: 'Selling warehouse software before the new site opens',
      company: 'A warehouse management software provider that sells to food and retail distributors.',
      problem:
        "Distributors choose their warehouse system while a new site is being planned, then keep it for years. This provider usually learns about new sites from the opening press release, when the system is already live and nobody has a reason to change it.",
      solution:
        'We follow planning applications, site announcements and the operations hiring that comes before a new distribution center opens. The team gets each project early, with its expected timeline, the operations leaders behind it and a message about the new site.',
      signals: ['Planning applications', 'New distribution centers', 'Operations hiring', 'New operations leadership'],
      outcomes: [
        'They help choose the systems for new sites instead of trying to replace them later.',
        'They hear about projects that never make a press release.',
        'Outreach reaches the people running the new site, not just head office.',
      ],
    },
  },
  {
    id: 'fintech',
    name: 'Fintech and payments',
    audience: 'payments, banking and finance software companies selling to finance teams.',
    icon: 'card',
    accent: 'violet',
    visual: 'waves',
    moment: 'Finance stacks change when a company enters new markets, raises capital or brings in a new CFO.',
    signals: [
      {
        label: 'Expansion into new countries',
        why: 'New entities and markets bring new currencies, tax rules and payment methods.',
      },
      { label: 'Funding rounds', why: 'New capital comes with investor reporting, tighter controls and a plan to scale.' },
      { label: 'New finance leadership', why: 'A new CFO or controller often reviews the finance stack in their first year.' },
      { label: 'Finance hiring', why: "Roles in treasury, billing or accounting operations show what's being built." },
    ],
    buyers: ['Chief Financial Officer', 'Financial Controller', 'Head of Payments'],
    useCase: {
      title: 'Meeting finance teams before they launch in a new country',
      company: 'A payments company that handles multi-currency billing and payouts for online businesses.',
      problem:
        "Online businesses only rethink payments when they expand abroad, and the window is short. By the time a company announces it's live in a new country, the payments setup for that market is decided, usually by stretching whatever they use at home.",
      solution:
        'We watch for the early signs of expansion: new entities in company registries abroad, international roles in job posts, funding raised for new markets and new finance leaders. The team gets each company before launch, with the head of finance or payments and a message about the new market.',
      signals: ['New entities abroad', 'International hiring', 'Funding for expansion', 'New finance leadership'],
      outcomes: [
        "They're talking to finance while the new market's setup is still open.",
        'Messages speak to the expansion the buyer is planning.',
        'Fewer calls to companies that are happy with what they have.',
      ],
    },
  },
  {
    id: 'hr-staffing',
    name: 'HR tech and staffing',
    audience: 'HR software companies, recruitment agencies and workforce providers.',
    icon: 'people',
    accent: 'emerald',
    visual: 'skyline',
    moment: 'Hiring tells you who is growing, which teams are growing and how fast.',
    signals: [
      { label: 'Hiring surges', why: 'A sharp rise in open roles shows a team or a whole company scaling.' },
      { label: 'New offices and locations', why: 'A new site has to be staffed from scratch, often on a tight timeline.' },
      {
        label: 'New HR and people leaders',
        why: 'New heads of people often review recruiting partners and HR systems early.',
      },
      { label: 'Funding rounds', why: 'Fresh capital usually turns into a hiring plan within months.' },
    ],
    buyers: ['Chief People Officer', 'Head of Talent Acquisition', 'HR Director'],
    useCase: {
      title: 'Reaching a hiring push before every agency calls',
      company: 'A recruitment agency that fills technical roles for engineering and IT teams.',
      problem:
        'Recruiters spend their mornings scrolling job boards for leads. By the time a role is posted, other agencies are calling the same hiring manager, and the company has often picked its recruiting partners for the year.',
      solution:
        "We flag companies about to hire at scale: new offices, funding rounds, a sharp rise in open roles and a new head of talent. Recruiters get each company with the roles it's hiring for and the person who owns hiring, at the start of the push.",
      signals: ['New offices', 'Funding rounds', 'Hiring surges', 'New head of talent'],
      outcomes: [
        'Recruiters reach companies at the start of a hiring push, not the end of it.',
        "Every call is about the roles the company is actually hiring for.",
        'Less time on job boards, more time with hiring managers.',
      ],
    },
  },
  {
    id: 'healthcare',
    name: 'Healthcare technology',
    audience: 'health tech, medical device and services companies selling to hospitals and clinics.',
    icon: 'health',
    accent: 'teal',
    visual: 'pulse',
    moment: 'Health systems buy around new sites, new leaders, public funding and system upgrades.',
    signals: [
      { label: 'New hospitals and clinics', why: 'New sites need systems, devices and services, chosen well before opening.' },
      { label: 'Leadership appointments', why: 'New CIOs, CMIOs and service line leaders bring new priorities.' },
      { label: 'Grants and public funding', why: 'Public funding usually comes with a defined project and timeline.' },
      {
        label: 'System upgrades and migrations',
        why: 'Replacing a patient records system or another core platform pulls in integration, training and services.',
      },
    ],
    buyers: ['Chief Information Officer', 'Chief Medical Information Officer', 'Procurement lead'],
    useCase: {
      title: 'Reaching hospitals while the records program is being planned',
      company: 'A company that sells integration software connecting hospital systems to their patient records platform.',
      problem:
        'Hospitals buy integration tools as part of bigger programs, such as a move to a new patient records system. The team usually learns about those programs when a tender is published, and by then the requirements favor vendors who have been talking to the hospital for months.',
      solution:
        'We track funding awards for digital programs, new patient records projects, appointments of clinical information leaders and early market engagement notices. The team gets each hospital as soon as a program is funded or announced, with the clinical and IT leaders to contact.',
      signals: ['Funding for digital programs', 'Patient records projects', 'New CIO or CMIO', 'Early market notices'],
      outcomes: [
        "They're in the conversation before the tender is written.",
        'They reach the whole buying group, clinical and technical.',
        'Their pipeline is built around funded programs, not cold lists.',
      ],
    },
  },
  {
    id: 'industrial',
    name: 'Industrial and manufacturing',
    audience: 'equipment, automation, materials and service suppliers selling to manufacturers.',
    icon: 'factory',
    accent: 'orange',
    visual: 'blueprint',
    moment: 'Plants announce investment long before they buy: new lines, permits, grants and plant leadership.',
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
        why: "Roles for plant engineers or automation specialists reveal what's being built.",
      },
      {
        label: 'Plant leadership changes',
        why: 'A new plant manager or operations director often arrives with an improvement plan.',
      },
    ],
    buyers: ['Plant Manager', 'Head of Engineering', 'Operations Director'],
    useCase: {
      title: 'Getting into a new production line at the design stage',
      company: 'An automation supplier that designs conveyor and robotics systems for packaging plants.',
      problem:
        "Plant automation is specified by engineers long before purchasing gets involved. This supplier mostly meets new projects as published tenders, competing on price against a specification written around another vendor's equipment.",
      solution:
        'We follow investment announcements, planning permits, capacity and energy grants, and hiring for automation and process engineers at packaging plants. The supplier gets each project at the design stage, with the engineers who write the specification.',
      signals: ['New production lines', 'Planning permits', 'Engineering hiring', 'Investment grants'],
      outcomes: [
        'They help shape the specification instead of bidding against it.',
        'First conversations are with the engineers who decide.',
        'Their pipeline follows the plants that are investing this year.',
      ],
    },
  },
  {
    id: 'erp-testing',
    name: 'ERP testing',
    audience: 'test automation and QA service companies that work on SAP, Oracle, Microsoft Dynamics and other ERP systems.',
    icon: 'erp',
    accent: 'fuchsia',
    visual: 'modules',
    moment: 'Testing work spikes around migrations, upgrades and release cycles, and most of them are planned in public.',
    signals: [
      {
        label: 'ERP migrations and go-lives',
        why: 'A move to S/4HANA, Oracle Cloud or Dynamics 365 means months of testing against a fixed go-live date.',
      },
      {
        label: 'Release and update cycles',
        why: 'Cloud ERPs ship updates on a fixed schedule, and every release needs regression testing.',
      },
      {
        label: 'ERP and testing hiring',
        why: 'Job posts for SAP consultants, test managers or automation engineers show a program is underway.',
      },
      {
        label: 'System integrator partnerships',
        why: 'When a company names its implementation partner, the testing plan is being set.',
      },
    ],
    buyers: ['ERP program manager', 'Head of QA or test manager', 'Chief Information Officer'],
    useCase: {
      title: 'Reaching SAP customers before their S/4HANA testing is planned',
      company: 'A test automation company that helps businesses test their SAP systems through upgrades and migrations.',
      problem:
        "SAP ends mainstream maintenance for ECC at the end of 2027, so many SAP customers are planning a move to S/4HANA, and each move needs months of testing. The company's reps know the market is large but can't tell who is starting now, so they call the same SAP users as every other vendor and mostly reach companies that are years away or already committed to a testing partner.",
      solution:
        'We track the signals that show a migration is starting: S/4HANA roles in job posts, system integrator partnerships, migration programs named in annual reports and new ERP leaders. Every week the reps get the companies moving now, with the program manager or test lead and a message about their migration timeline.',
      signals: ['S/4HANA hiring', 'System integrator partnerships', 'Migration programs in annual reports', 'New ERP leadership'],
      outcomes: [
        'Reps reach companies as their migration starts, not years before or after.',
        'Testing comes up while the plan is still being written, not after a go-live slips.',
        "Every message names the buyer's program and timeline.",
      ],
    },
  },
];
