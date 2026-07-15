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
    url: "/grade-supervisor/coming-soon?module=%D9%BE%DB%8C%DA%AF%DB%8C%D8%B1%DB%8C%20%D9%85%D8%B7%D8%A7%D9%84%D8%B9%D9%87",
    icon: Timer,
  },
  {
    title: "آزمون‌ها و نتایج",
    url: "/grade-supervisor/coming-soon?module=%D8%A2%D8%B2%D9%85%D9%88%D9%86%E2%80%8C%D9%87%D8%A7%20%D9%88%20%D9%86%D8%AA%D8%A7%DB%8C%D8%AC",
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

