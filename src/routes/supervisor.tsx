import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  LayoutDashboard,
  CalendarRange,
  HeartHandshake,
  UserCircle,
  ListChecks,
  Sparkles,
  MessageSquareHeart,
  Users,
} from "lucide-react";
import { SupervisorShell, type NavItem } from "@/components/supervisor/supervisor-shell";
import { useHealthGlossary } from "@/lib/health-glossary";

const defaultItems: NavItem[] = [
  { title: "داشبورد", url: "/supervisor", icon: LayoutDashboard },
  { title: "تقویم آموزشی", url: "/supervisor/calendar", icon: CalendarRange },
  { title: "جلسات همراهی", url: "/supervisor/sessions", icon: HeartHandshake },
  { title: "پروفایل دانش‌آموز", url: "/supervisor/student", icon: UserCircle },
  { title: "پیگیری‌ها", url: "/supervisor/followups", icon: ListChecks },
  { title: "خلاصه هوشمند توربو", url: "/supervisor/turbo", icon: Sparkles },
  { title: "بازخوردهای هفتگی", url: "/supervisor/feedback", icon: MessageSquareHeart },
  { title: "ارتباط با دبیران", url: "/supervisor/teachers-hub", icon: Users },
];

function SupervisorLayout() {
  const { supervisorItems } = useHealthGlossary();
  const items: NavItem[] = supervisorItems ?? defaultItems;
  return (
    <SupervisorShell items={items}>
      <Outlet />
    </SupervisorShell>
  );
}

export const Route = createFileRoute("/supervisor")({
  component: SupervisorLayout,
});
