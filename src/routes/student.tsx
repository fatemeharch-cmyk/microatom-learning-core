import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard, BookOpen, TrendingUp, Award, User } from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/dashboard-shell";

const items: NavItem[] = [
  { title: "Overview", url: "/student", icon: LayoutDashboard },
  { title: "Lessons", url: "/student/lessons", icon: BookOpen },
  { title: "Progress", url: "/student/progress", icon: TrendingUp },
  { title: "Achievements", url: "/student/achievements", icon: Award },
  { title: "Profile", url: "/student/profile", icon: User },
];

export const Route = createFileRoute("/student")({
  component: () => <DashboardShell role="student" roleLabel="Student" items={items} />,
});
