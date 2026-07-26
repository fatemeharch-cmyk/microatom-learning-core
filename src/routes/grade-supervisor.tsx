import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, Users, ClipboardList, Timer, FileBarChart, Sparkles } from "lucide-react";
import { SupervisorShell, type NavItem } from "@/components/supervisor/supervisor-shell";

// Only routes backed by a real backend integration (Xano, or a working
// server endpoint) are exposed in the sidebar. Modules without one route to
// a single shared "به‌زودی فعال می‌شود" page instead of dedicated
// placeholder route files.
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
    url: "/grade-supervisor/study-tracking",
    icon: Timer,
  },
  {
    title: "دستیار تحلیل هوشمند",
    url: "/grade-supervisor/ai-assistant",
    icon: Sparkles,
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
