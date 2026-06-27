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

/**
 * Landing route for the grade_supervisor role.
 *
 * Renders the same SupervisorShell + dashboard as `/supervisor`, but the
 * URL stays `/grade-supervisor` per the canonical role→route mapping.
 * Sub-pages (students, sessions, etc.) continue to live under `/supervisor/*`.
 */
const items: NavItem[] = [
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

export const Route = createFileRoute("/grade-supervisor")({
  component: function GradeSupervisorLanding() {
    return (
      <SupervisorShell items={items}>
        <SupervisorDashboard />
      </SupervisorShell>
    );
  },
});
