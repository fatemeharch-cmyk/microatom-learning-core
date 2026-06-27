import type { LucideIcon } from "lucide-react";
import {
  Home,
  Stethoscope,
  HeartPulse,
  ScanLine,
  NotebookPen,
  ShieldCheck,
  CalendarCheck2,
  Compass,
  Target,
  FolderHeart,
  Trophy,
  Activity,
  ClipboardList,
  ScrollText,
  Users,
  Siren,
  MessageCircleHeart,
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Settings,
  FileText,
  Bell,
} from "lucide-react";

/**
 * Maps icon name strings (returned by the Atomia Theme Engine) to
 * Lucide React components. Unknown names fall back to a neutral icon.
 */
export const ICON_MAP: Record<string, LucideIcon> = {
  home: Home,
  stethoscope: Stethoscope,
  "heart-pulse": HeartPulse,
  heartpulse: HeartPulse,
  "scan-line": ScanLine,
  scan: ScanLine,
  notebook: NotebookPen,
  "notebook-pen": NotebookPen,
  shield: ShieldCheck,
  "shield-check": ShieldCheck,
  calendar: CalendarCheck2,
  "calendar-check": CalendarCheck2,
  compass: Compass,
  target: Target,
  folder: FolderHeart,
  "folder-heart": FolderHeart,
  trophy: Trophy,
  activity: Activity,
  clipboard: ClipboardList,
  scroll: ScrollText,
  users: Users,
  siren: Siren,
  message: MessageCircleHeart,
  dashboard: LayoutDashboard,
  graduation: GraduationCap,
  book: BookOpen,
  settings: Settings,
  file: FileText,
  bell: Bell,
};

export function resolveIcon(name?: string): LucideIcon {
  if (!name) return Home;
  return ICON_MAP[name.toLowerCase()] ?? Home;
}
