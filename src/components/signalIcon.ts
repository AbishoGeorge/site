import {
  Banknote,
  Building2,
  CalendarClock,
  Factory,
  FileCheck2,
  Globe,
  Handshake,
  Leaf,
  LineChart,
  Radar,
  RefreshCcw,
  Scale,
  ScrollText,
  ShieldAlert,
  Shuffle,
  UserRoundCheck,
  UserRoundPlus,
  Warehouse,
  type LucideIcon,
} from 'lucide-react';

// Picks the icon for a signal from its label, so the same kind of signal looks the same wherever it is listed.
// Order matters: the first pattern that matches wins.
const rules: [RegExp, LucideIcon][] = [
  [/fund|grant|series/i, Banknote],
  [/hiring|hires/i, UserRoundPlus],
  [/^new (vp|ciso|cio|head|data leader)|leader|appoint/i, UserRoundCheck],
  [/renewal|deadline/i, CalendarClock],
  [/tender|rfp/i, ScrollText],
  [/tech|stack|wms|evaluation|migration|cloud|platform|system/i, RefreshCcw],
  [/merger|acquisition/i, Handshake],
  [/countr|markets|regions/i, Globe],
  [/plant|production/i, Factory],
  [/warehouse|distribution/i, Warehouse],
  [/office|hub|clinic|hospital|site|opening|expansion/i, Building2],
  [/earnings/i, LineChart],
  [/security|incident|breach/i, ShieldAlert],
  [/licens|regulat/i, Scale],
  [/restructur|reorgani/i, Shuffle],
  [/permit/i, FileCheck2],
  [/energy|emission|sustainab/i, Leaf],
];

export function signalIcon(label: string): LucideIcon {
  return rules.find(([pattern]) => pattern.test(label))?.[1] ?? Radar;
}
