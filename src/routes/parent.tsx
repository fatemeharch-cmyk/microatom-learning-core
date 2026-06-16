import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  LayoutDashboard,
  CalendarRange,
  Sprout,
  Sparkles,
  HeartHandshake,
  Lightbulb,
  Megaphone,
  MessageSquareHeart,
} from "lucide-react";
import { ParentShell, type NavItem } from "@/components/parent/parent-shell";

const items: NavItem[] = [
  { title: "داشبورد", url: "/parent", icon: LayoutDashboard },
  { title: "تقویم آموزشی", url: "/parent/calendar", icon: CalendarRange },
  { title: "مسیر رشد فرزندم", url: "/parent/growth", icon: Sprout },
  { title: "خلاصه هفتگی", url: "/parent/weekly", icon: Sparkles },
  { title: "جلسات همراهی", url: "/parent/meetings", icon: HeartHandshake },
  { title: "همراهی پیشنهادی", url: "/parent/companion", icon: Lightbulb },
  { title: "اطلاعیه‌ها", url: "/parent/announcements", icon: Megaphone },
  { title: "بازخورد هفتگی", url: "/parent/feedback", icon: MessageSquareHeart },
];

export const Route = createFileRoute("/parent")({
  component: () => (
    <ParentShell items={items}>
      <Outlet />
    </ParentShell>
  ),
});
