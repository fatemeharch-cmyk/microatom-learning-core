import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  LayoutDashboard,
  CalendarRange,
  ClipboardEdit,
  FileCheck2,
  NotebookPen,
  BarChart3,
  Users,
  Library,
} from "lucide-react";
import { TeacherShell, type NavItem } from "@/components/teacher/teacher-shell";

const items: NavItem[] = [
  { title: "داشبورد", url: "/teacher", icon: LayoutDashboard },
  { title: "برنامه هفتگی", url: "/teacher/schedule", icon: CalendarRange },
  { title: "ثبت کلاس", url: "/teacher/log", icon: ClipboardEdit },
  { title: "آزمون‌ها", url: "/teacher/exams", icon: FileCheck2 },
  { title: "تکالیف", url: "/teacher/homework", icon: NotebookPen },
  { title: "تحلیل کلاس", url: "/teacher/analytics", icon: BarChart3 },
  { title: "دانش‌آموزان", url: "/teacher/students", icon: Users },
  { title: "منابع آموزشی", url: "/teacher/resources", icon: Library },
];

export const Route = createFileRoute("/teacher")({
  component: () => (
    <TeacherShell items={items}>
      <Outlet />
    </TeacherShell>
  ),
});
