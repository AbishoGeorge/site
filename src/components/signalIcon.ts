import {
  Banknote,
  Building2,
  CalendarClock,
  Contact,
  Factory,
  FileCheck2,
  FileText,
  Filter,
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
  UsersRound,
  Warehouse,
  type LucideIcon,
} from 'lucide-react';

// Picks the icon for a signal from its label, so the same kind of signal looks the same wherever it is listed.
// Order matters: the first pattern that matches wins.
const rules: [RegExp, LucideIcon][] = [
  // What event intelligence delivers.
  [/attendee|exhibitor|speaker/i, UsersRound],
  [/filtered|buyers|mid-migration/i, Filter],
  [/contact|email|phone/i, Contact],
  // Buying signals.
  [/fund|grant|series/i, Banknote],
  [/hiring|hires/i, UserRoundPlus],
  [/^new (vp|ciso|cio|cfo|cmio|head|data leader)|leader|appoint|director|head of/i, UserRoundCheck],
  [/renewal|deadline/i, CalendarClock],
  [/tender|rfp|notice/i, ScrollText],
  [/annual report|filing/i, FileText],
  [/merger|acquisition|partner/i, Handshake],
  [/tech|stack|wms|evaluation|migration|cloud|platform|system|records|release|update/i, RefreshCcw],
  [/countr|markets|regions|abroad|entities/i, Globe],
  [/plant|production/i, Factory],
  [/warehouse|distribution/i, Warehouse],
  [/office|hub|clinic|hospital|site|opening|expansion/i, Building2],
  [/earnings/i, LineChart],
  [/security|incident|breach/i, ShieldAlert],
  [/licens|regulat/i, Scale],
  [/restructur|reorgani/i, Shuffle],
  [/permit|planning/i, FileCheck2],
  [/energy|emission|sustainab/i, Leaf],
];

export function signalIcon(label: string): LucideIcon {
  return rules.find(([pattern]) => pattern.test(label))?.[1] ?? Radar;
}
