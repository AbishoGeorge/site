import { industries, type Accent, type IndustryIcon, type IndustryVisual, type UseCase } from './industries';
import { eventStories } from './events';

/** The two service lines. */
export type Service = 'accounts' | 'events';

export const serviceName: Record<Service, string> = {
  accounts: 'Account intelligence',
  events: 'Event intelligence',
};

/** One use case, from either service, as the Use cases strip and the use case pages show it. */
export interface Story {
  id: string;
  service: Service;
  /** The industry or the kind of event. */
  tag: string;
  icon: IndustryIcon;
  accent: Accent;
  visual: IndustryVisual;
  useCase: UseCase;
}

export const stories: Story[] = [
  ...industries.map(({ id, name, icon, accent, visual, useCase }) => ({
    id,
    service: 'accounts' as const,
    tag: name,
    icon,
    accent,
    visual,
    useCase,
  })),
  ...eventStories.map(({ id, name, icon, accent, visual, useCase }) => ({
    id,
    service: 'events' as const,
    tag: name,
    icon,
    accent,
    visual,
    useCase,
  })),
];

export const storiesFor = (service: Service) => stories.filter((s) => s.service === service);
