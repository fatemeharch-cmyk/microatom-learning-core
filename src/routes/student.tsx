import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  LayoutDashboard,
  CalendarDays,
  CalendarRange,
  NotebookPen,
  GraduationCap,
  TrendingUp,
  User,
} from "lucide-react";
import { StudentShell, type NavItem } from "@/components/student/student-shell";

const items: NavItem[] = [
  { title: "داشبورد", url: "/student", icon: LayoutDashboard },
  { title: "برنامه روزانه", url: "/student/daily", icon: CalendarDays },
  { title: "برنامه هفتگی", url: "/student/weekly", icon: CalendarRange },
  { title: "مرکز تکالیف", url: "/student/homework", icon: NotebookPen },
  { title: "مرکز آزمون", url: "/student/exams", icon: GraduationCap },
  { title: "پیشرفت من", url: "/student/progress", icon: TrendingUp },
  { title: "پروفایل", url: "/student/profile", icon: User },
];

export const Route = createFileRoute("/student")({
  component: () => (
    <StudentShell items={items}>
      <Outlet />
    </StudentShell>
  ),
});
