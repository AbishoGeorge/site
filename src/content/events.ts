import type { Accent, IndustryIcon, IndustryVisual, UseCase } from './industries';

/**
 * Use cases for event intelligence: before a trade show or conference, we gather who is attending, keep only the
 * client's buyers and hand over each person with their intent and contact details.
 *
 * Like the account use cases, each one follows one company through one specific problem, with no names or figures.
 */
export interface EventStory {
  id: string;
  /** The kind of event, shown as the story's tag. */
  name: string;
  icon: IndustryIcon;
  accent: Accent;
  visual: IndustryVisual;
  useCase: UseCase;
}

export const eventStories: EventStory[] = [
  {
    id: 'event-security-conference',
    name: 'Security conference',
    icon: 'ticket',
    accent: 'rose',
    visual: 'crowd',
    useCase: {
      title: 'Booking meetings before a global security conference',
      company: 'A cloud security company exhibiting at a global security conference.',
      problem:
        'The company pays for a booth every year, but its reps spend the event waiting for whoever walks past. The people they most want to meet, security leaders at large banks and retailers, are at the same event, but nobody knows which of them are coming or how to reach them before the doors open.',
      solution:
        "We build the attendee list from the event's speakers, sponsors, exhibitors and the people who announce they're going, then keep only the client's buyers: security leaders at companies of the right size in their target sectors. Each person comes with why they're likely to buy now, such as a cloud migration or a new CISO, and a verified email and phone number, weeks before the event.",
      signals: ['Full attendee list', 'Filtered to your buyers', 'Intent for each person', 'Verified email and phone'],
      outcomes: [
        'Reps arrive with meetings booked instead of waiting at the booth.',
        'Every meeting is with someone who fits and has a reason to talk now.',
        'Follow-up after the event starts from a real conversation, not a scanned badge.',
      ],
    },
  },
  {
    id: 'event-supply-chain-show',
    name: 'Supply chain trade show',
    icon: 'presentation',
    accent: 'amber',
    visual: 'badge',
    useCase: {
      title: 'Finding the right buyers in a crowded trade show',
      company: 'A transport management software provider visiting a large supply chain trade show without a booth.',
      problem:
        "With no booth, the team only meets the people it plans to meet. The exhibitor list is long, the attendee list isn't published, and the sales director usually walks the floor hoping to run into the right shippers.",
      solution:
        'We gather who is attending from exhibitor lists, speaker sessions and attendee announcements, then keep only the logistics and operations leaders at shippers that match their customer profile. Each one comes with intent, like a new distribution center or a carrier tender, and contact details, so the team can set up meetings around the show.',
      signals: ['Exhibitors and attendees', 'Operations leaders at shippers', 'Expansion and tender signals', 'Direct contact details'],
      outcomes: [
        'The trip is planned around meetings, not luck.',
        "Conversations start with the buyer's own project.",
        'The team knows which stands to visit and who to ask for.',
      ],
    },
  },
  {
    id: 'event-sap-user-conference',
    name: 'SAP user conference',
    icon: 'calendar',
    accent: 'fuchsia',
    visual: 'calendar',
    useCase: {
      title: 'Meeting S/4HANA program leads at an SAP user conference',
      company: 'An ERP testing company attending an SAP user group conference.',
      problem:
        'Almost everyone at the conference runs SAP, but only some are in the middle of an S/4HANA move, and those are the only ones who need testing help this year. Without knowing who is who, the team spends the event in conversations that go nowhere.',
      solution:
        'We pull the attendee list together from the agenda, sponsors and attendee announcements, then keep only the people at companies with an active migration, spotted through S/4HANA hiring, integrator partnerships and program announcements. The team gets each program lead with their migration signals and contact details before the event.',
      signals: ['Attendee list', 'Companies mid-migration', 'Migration signals', 'Verified contact details'],
      outcomes: [
        'Every meeting is with a company that needs testing help now.',
        'The team fills its calendar before the event opens.',
        "Each conversation starts from the buyer's migration timeline.",
      ],
    },
  },
];
