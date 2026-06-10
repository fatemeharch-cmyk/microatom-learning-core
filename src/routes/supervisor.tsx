import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, Layers, Users, BarChart3, AlertTriangle } from "lucide-react";
import { SupervisorShell, type NavItem } from "@/components/supervisor/supervisor-shell";

const items: NavItem[] = [
  { titleKey: "s_nav_overview", url: "/supervisor", icon: LayoutDashboard },
  { titleKey: "s_nav_grade", url: "/supervisor/grade", icon: Layers },
  { titleKey: "s_nav_teachers", url: "/supervisor/teachers", icon: Users },
  { titleKey: "s_nav_analytics", url: "/supervisor/analytics", icon: BarChart3 },
  { titleKey: "s_nav_alerts", url: "/supervisor/alerts", icon: AlertTriangle },
];

export const Route = createFileRoute("/supervisor")({
  component: () => (
    <SupervisorShell items={items}>
      <Outlet />
    </SupervisorShell>
  ),
});
