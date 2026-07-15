import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Timer,
  FileBarChart,
} from "lucide-react";
import {
  SupervisorShell,
  type NavItem,
} from "@/components/supervisor/supervisor-shell";

// Only routes backed by real Xano endpoints are exposed in the sidebar.
// Modules without real backend endpoints route to a single shared
// "به‌زودی فعال می‌شود" page instead of dedicated placeholder route files.
const items: NavItem[] = [
  { title: "داشبورد پایه", url: "/grade-supervisor", icon: LayoutDashboard },
  { title: "دانش‌آموزان", url: "/grade-supervisor/students", icon: Users },
  {
    title: "دفتر مسئول پایه",
    url: "/grade-supervisor/notebook",
    icon: ClipboardList,
  },
  {
    title: "پیگیری مطالعه",
    url: "/grade-supervisor/coming-soon",
    icon: Timer,
  },
  {
    title: "آزمون‌ها و نتایج",
    url: "/grade-supervisor/coming-soon",
    icon: FileBarChart,
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

