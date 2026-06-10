import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard, Layers, Users, BarChart3, AlertTriangle } from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/dashboard-shell";

const items: NavItem[] = [
  { title: "Overview", url: "/supervisor", icon: LayoutDashboard },
  { title: "Grade overview", url: "/supervisor/grade", icon: Layers },
  { title: "Teachers", url: "/supervisor/teachers", icon: Users },
  { title: "Analytics", url: "/supervisor/analytics", icon: BarChart3 },
  { title: "Alerts", url: "/supervisor/alerts", icon: AlertTriangle },
];

export const Route = createFileRoute("/supervisor")({
  component: () => <DashboardShell role="supervisor" roleLabel="Grade Supervisor" items={items} />,
});
