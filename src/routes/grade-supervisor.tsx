import { createFileRoute } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  HeartPulse,
  Stethoscope,
  NotebookPen,
  ScrollText,
  Target,
  CalendarDays,
  ClipboardCheck,
  UserCircle2,
  GraduationCap,
  BarChart3,
  Sparkles,
} from "lucide-react";
import {
  SupervisorShell,
  type NavItem,
} from "@/components/supervisor/supervisor-shell";
import { SupervisorDashboard } from "./supervisor.index";
import { useTheme, resolveIcon } from "@/lib/theme";

const defaultItems: NavItem[] = [
  { title: "داشبورد پایه", url: "/grade-supervisor", icon: LayoutDashboard },
  { title: "دانش‌آموزان", url: "/supervisor/student", icon: Users },
  { title: "سلامت آموزشی", url: "/supervisor/grade", icon: HeartPulse },
  { title: "چکاب‌ها", url: "/supervisor/sessions", icon: Stethoscope },
  { title: "کلینیک یادگیری", url: "/supervisor/followups", icon: NotebookPen },
  { title: "نسخه‌ها", url: "/supervisor/alerts", icon: ScrollText },
  { title: "ماموریت‌ها", url: "/supervisor/teachers-hub", icon: Target },
  { title: "قرار ملاقات‌ها", url: "/supervisor/calendar", icon: CalendarDays },
  { title: "ویزیت هفتگی", url: "/supervisor/feedback", icon: ClipboardCheck },
  { title: "اولیا", url: "/supervisor/parents", icon: UserCircle2 },
  { title: "دبیران", url: "/supervisor/teachers", icon: GraduationCap },
  { title: "گزارش‌ها", url: "/supervisor/analytics", icon: BarChart3 },
  { title: "هوش مصنوعی", url: "/supervisor/turbo", icon: Sparkles },
];

function GradeSupervisorLanding() {
  const { theme } = useTheme();
  const sidebar = theme?.menus?.sidebar;
  const items: NavItem[] =
    sidebar && sidebar.length > 0
      ? sidebar.map((m) => ({ title: m.title, url: m.url, icon: resolveIcon(m.icon) }))
      : defaultItems;
  return (
    <SupervisorShell items={items}>
      <SupervisorDashboard />
    </SupervisorShell>
  );
}

export const Route = createFileRoute("/grade-supervisor")({
  component: GradeSupervisorLanding,
});
