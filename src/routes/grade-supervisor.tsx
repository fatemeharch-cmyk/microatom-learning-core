import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Activity,
} from "lucide-react";
import {
  SupervisorShell,
  type NavItem,
} from "@/components/supervisor/supervisor-shell";

// Only routes backed by real Xano endpoints are exposed in the sidebar.
// Legacy /supervisor/* mock pages are hidden until their backends land.
const items: NavItem[] = [
  { title: "داشبورد پایه", url: "/grade-supervisor", icon: LayoutDashboard },
  { title: "دانش‌آموزان", url: "/grade-supervisor/students", icon: Users },
  {
    title: "دفتر مسئول پایه",
    url: "/grade-supervisor/notebook",
    icon: ClipboardList,
  },
  {
    title: "پایش فصل اول",
    url: "/grade-supervisor/chapter1-monitoring",
    icon: Activity,
  },
];

function GradeSupervisorLayout() {
  return (
    <SupervisorShell items={items}>
      <Outlet />
    </SupervisorShell>
  );
}

export const Route = createFileRoute("/grade-supervisor")({
  component: GradeSupervisorLayout,
});

