import { createFileRoute } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Layers,
  CalendarRange,
  CalendarDays,
  ClipboardList,
  MessageCircleHeart,
  Settings,
} from "lucide-react";
import { AdminShell, type NavItem } from "@/components/admin/admin-shell";
import { AdminDashboard } from "./admin.index";

/**
 * Landing route for the principal role.
 *
 * Renders the same AdminShell + dashboard as `/admin`, but the URL stays
 * `/principal` per the canonical role→route mapping. Sub-pages continue to
 * live under `/admin/*`.
 */
const items: NavItem[] = [
  { title: "داشبورد مدیر", url: "/principal", icon: LayoutDashboard },
  { title: "مدیریت کاربران", url: "/admin/users", icon: Users },
  { title: "پایه‌ها و کلاس‌ها", url: "/admin/classes", icon: Layers },
  { title: "برنامه هفتگی مدرسه", url: "/admin/schedule", icon: CalendarRange },
  { title: "تقویم آموزشی", url: "/admin/calendar", icon: CalendarDays },
  {
    title: "وضعیت ثبت کلاس‌ها",
    url: "/admin/registration",
    icon: ClipboardList,
  },
  {
    title: "بازخوردهای مدرسه",
    url: "/admin/feedback",
    icon: MessageCircleHeart,
  },
  { title: "تنظیمات سیستم", url: "/admin/system", icon: Settings },
];

export const Route = createFileRoute("/principal")({
  component: function PrincipalLanding() {
    return (
      <AdminShell items={items}>
        <AdminDashboard />
      </AdminShell>
    );
  },
});
