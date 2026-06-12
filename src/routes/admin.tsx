import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard, Users, ShieldCheck, Library, Database, FileUp, Settings } from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/dashboard-shell";

const items: NavItem[] = [
  { title: "Overview", url: "/admin", icon: LayoutDashboard },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Roles", url: "/admin/roles", icon: ShieldCheck },
  { title: "Content library", url: "/admin/content", icon: Library },
  { title: "Curriculum DB", url: "/admin/curriculum", icon: Database },
  { title: "Import Curriculum CSV", url: "/admin/curriculum-import", icon: FileUp },
  { title: "System", url: "/admin/system", icon: Settings },
];

export const Route = createFileRoute("/admin")({
  component: () => <DashboardShell role="admin" roleLabel="Admin" items={items} />,
});
