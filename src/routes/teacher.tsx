import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard, School, FileEdit, Users, BarChart3 } from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/dashboard-shell";

const items: NavItem[] = [
  { title: "Overview", url: "/teacher", icon: LayoutDashboard },
  { title: "Classrooms", url: "/teacher/classrooms", icon: School },
  { title: "Content", url: "/teacher/content", icon: FileEdit },
  { title: "Students", url: "/teacher/students", icon: Users },
  { title: "Analytics", url: "/teacher/analytics", icon: BarChart3 },
];

export const Route = createFileRoute("/teacher")({
  component: () => <DashboardShell role="teacher" roleLabel="Teacher" items={items} />,
});
