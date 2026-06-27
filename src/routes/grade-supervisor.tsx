import { createFileRoute, Outlet } from "@tanstack/react-router";
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

const items: NavItem[] = [
  { title: "داشبورد پایه", url: "/grade-supervisor", icon: LayoutDashboard },
  { title: "دانش‌آموزان", url: "/grade-supervisor/students", icon: Users },
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
  { title: "توربو همراه", url: "/supervisor/turbo", icon: Sparkles },
];

function GradeSupervisorLayout() {
  return (
    <SupervisorShell items={items}>
      <Outlet />
    </SupervisorShell>
  );
}

export const Route = createFileRoute("/grade-supervisor")({
  component: GradeSupervisorLayout,
});
