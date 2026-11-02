import {
  CalendarCheck,
  ClipboardCheck,
  CreditCard,
  Factory,
  LayoutDashboard,
  ServerCog,
  Presentation,
  ShieldCheck,
  Stethoscope,
  Ticket,
  Truck,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';
import type { Accent, IndustryIcon } from '../../content/industries';

export const industryIcon: Record<IndustryIcon, LucideIcon> = {
  shield: ShieldCheck,
  software: LayoutDashboard,
  server: ServerCog,
  truck: Truck,
  card: CreditCard,
  people: UsersRound,
  health: Stethoscope,
  factory: Factory,
  erp: ClipboardCheck,
  ticket: Ticket,
  presentation: Presentation,
  calendar: CalendarCheck,
};

/** Full class names per accent, so Tailwind can see them. `hex` is for SVG fills. */
export const accentStyle: Record<
  Accent,
  { tile: string; soft: string; text: string; bar: string; hex: string }
> = {
  rose: { tile: 'from-rose-500 to-orange-400', soft: 'bg-rose-50', text: 'text-rose-600', bar: 'bg-rose-500', hex: '#f43f5e' },
  indigo: { tile: 'from-indigo-500 to-violet-500', soft: 'bg-indigo-50', text: 'text-indigo-600', bar: 'bg-indigo-500', hex: '#6366f1' },
  sky: { tile: 'from-sky-500 to-blue-600', soft: 'bg-sky-50', text: 'text-sky-600', bar: 'bg-sky-500', hex: '#0ea5e9' },
  amber: { tile: 'from-amber-400 to-orange-500', soft: 'bg-orange-50', text: 'text-orange-600', bar: 'bg-orange-500', hex: '#f59e0b' },
  violet: { tile: 'from-violet-500 to-fuchsia-500', soft: 'bg-violet-50', text: 'text-violet-600', bar: 'bg-violet-500', hex: '#8b5cf6' },
  emerald: { tile: 'from-emerald-500 to-teal-500', soft: 'bg-emerald-50', text: 'text-emerald-600', bar: 'bg-emerald-500', hex: '#10b981' },
  teal: { tile: 'from-teal-500 to-cyan-600', soft: 'bg-teal-50', text: 'text-teal-600', bar: 'bg-teal-500', hex: '#14b8a6' },
  orange: { tile: 'from-orange-500 to-rose-500', soft: 'bg-orange-50', text: 'text-orange-600', bar: 'bg-orange-500', hex: '#f97316' },
  fuchsia: { tile: 'from-fuchsia-500 to-purple-600', soft: 'bg-fuchsia-50', text: 'text-fuchsia-600', bar: 'bg-fuchsia-500', hex: '#d946ef' },
};
