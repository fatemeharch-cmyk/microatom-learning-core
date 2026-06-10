import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard, Baby, FileBarChart, MessageSquare } from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/dashboard-shell";

const items: NavItem[] = [
  { title: "Overview", url: "/parent", icon: LayoutDashboard },
  { title: "Children", url: "/parent/children", icon: Baby },
  { title: "Reports", url: "/parent/reports", icon: FileBarChart },
  { title: "Messages", url: "/parent/messages", icon: MessageSquare },
];

export const Route = createFileRoute("/parent")({
  component: () => <DashboardShell role="parent" roleLabel="Parent" items={items} />,
});
