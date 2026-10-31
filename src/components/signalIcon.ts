import {
  Banknote,
  Building2,
  CalendarClock,
  LineChart,
  Radar,
  RefreshCcw,
  ScrollText,
  ShieldAlert,
  UserRoundCheck,
  UserRoundPlus,
  type LucideIcon,
} from 'lucide-react';

// Picks the icon for a signal from its label, so the same kind of signal looks the same wherever it is listed.
const rules: [RegExp, LucideIcon][] = [
  [/fund|grant|series/i, Banknote],
  [/hiring|hires/i, UserRoundPlus],
  [/^new (vp|ciso|cio|head|data leader)|leader|appoint/i, UserRoundCheck],
  [/renewal|deadline/i, CalendarClock],
  [/tender|rfp/i, ScrollText],
  [/tech|stack|wms|evaluation|migration/i, RefreshCcw],
  [/office|hub|clinic|plant|opening|expansion/i, Building2],
  [/earnings/i, LineChart],
  [/security|incident|breach/i, ShieldAlert],
];

export function signalIcon(label: string): LucideIcon {
  return rules.find(([pattern]) => pattern.test(label))?.[1] ?? Radar;
}
