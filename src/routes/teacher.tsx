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
import { useHealthGlossary } from "@/lib/health-glossary";
import { useTheme, resolveIcon } from "@/lib/theme";

const defaultItems: NavItem[] = [
  { title: "داشبورد", url: "/teacher", icon: LayoutDashboard },
  { title: "برنامه هفتگی", url: "/teacher/schedule", icon: CalendarRange },
  { title: "ثبت کلاس", url: "/teacher/log", icon: ClipboardEdit },
  { title: "آزمون‌ها", url: "/teacher/exams", icon: FileCheck2 },
  { title: "تکالیف", url: "/teacher/homework", icon: NotebookPen },
  { title: "تحلیل کلاس", url: "/teacher/analytics", icon: BarChart3 },
  { title: "دانش‌آموزان", url: "/teacher/students", icon: Users },
  { title: "منابع آموزشی", url: "/teacher/resources", icon: Library },
];

function TeacherLayout() {
  const { teacherItems } = useHealthGlossary();
  const { theme } = useTheme();
  const sidebar = theme?.menus?.sidebar;
  const items: NavItem[] =
    sidebar && sidebar.length > 0
      ? sidebar.map((m) => ({ title: m.title, url: m.url, icon: resolveIcon(m.icon) }))
      : (teacherItems ?? defaultItems);
  return (
    <TeacherShell items={items}>
      <Outlet />
    </TeacherShell>
  );
}

export const Route = createFileRoute("/teacher")({
  component: TeacherLayout,
});
