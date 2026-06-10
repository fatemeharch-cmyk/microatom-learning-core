import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, Baby, FileBarChart, MessageSquare } from "lucide-react";
import { ParentShell, type NavItem } from "@/components/parent/parent-shell";

const items: NavItem[] = [
  { titleKey: "p_nav_overview", url: "/parent", icon: LayoutDashboard },
  { titleKey: "p_nav_children", url: "/parent/children", icon: Baby },
  { titleKey: "p_nav_reports", url: "/parent/reports", icon: FileBarChart },
  { titleKey: "p_nav_messages", url: "/parent/messages", icon: MessageSquare },
];

export const Route = createFileRoute("/parent")({
  component: () => (
    <ParentShell items={items}>
      <Outlet />
    </ParentShell>
  ),
});
