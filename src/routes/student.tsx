import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  LayoutDashboard,
  CalendarDays,
  CalendarRange,
  NotebookPen,
  GraduationCap,
  TrendingUp,
  Timer,
  User,
} from "lucide-react";
import { StudentShell, type NavItem } from "@/components/student/student-shell";

const items: NavItem[] = [
  { titleKey: "nav_dashboard", url: "/student", icon: LayoutDashboard },
  { titleKey: "nav_daily", url: "/student/daily", icon: CalendarDays },
  { titleKey: "nav_weekly", url: "/student/weekly", icon: CalendarRange },
  { titleKey: "nav_homework", url: "/student/homework", icon: NotebookPen },
  { titleKey: "nav_exams", url: "/student/exams", icon: GraduationCap },
  { titleKey: "nav_tracking", url: "/student/tracking", icon: Timer },
  { titleKey: "nav_progress", url: "/student/progress", icon: TrendingUp },
  { titleKey: "nav_profile", url: "/student/profile", icon: User },
];

export const Route = createFileRoute("/student")({
  component: () => (
    <StudentShell items={items}>
      <Outlet />
    </StudentShell>
  ),
});
