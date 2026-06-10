import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, NotebookPen, FileCheck2, BarChart3, Users, FileUp, Sparkles } from "lucide-react";
import { TeacherShell, type NavItem } from "@/components/teacher/teacher-shell";

const items: NavItem[] = [
  { titleKey: "t_nav_overview", url: "/teacher", icon: LayoutDashboard },
  { titleKey: "t_nav_homework", url: "/teacher/homework", icon: NotebookPen },
  { titleKey: "t_nav_exams", url: "/teacher/exams", icon: FileCheck2 },
  { titleKey: "t_nav_pdf", url: "/teacher/pdf-exams", icon: FileUp },
  { titleKey: "t_nav_analyzer", url: "/teacher/analyzer", icon: Sparkles },
  { titleKey: "t_nav_class", url: "/teacher/analytics", icon: BarChart3 },
  { titleKey: "t_nav_students", url: "/teacher/students", icon: Users },
];

export const Route = createFileRoute("/teacher")({
  component: () => (
    <TeacherShell items={items}>
      <Outlet />
    </TeacherShell>
  ),
});
