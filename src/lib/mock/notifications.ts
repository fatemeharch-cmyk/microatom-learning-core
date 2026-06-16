/**
 * Atomia — Notifications provider.
 *
 * Cross-role notification stream. Filter by `audience` to get the right
 * feed for each workspace.
 */
import type { Notification, RoleId } from "@/lib/types";

const notifications: Notification[] = [
  {
    id: "n-1",
    title: "گام بعدی شما آماده است",
    body: "یک واحد یادگیری کوتاه درباره «حرکت پرتابی» برای تثبیت مفاهیم پیشنهاد شد.",
    kind: "celebration",
    audience: "student",
    createdAt: "امروز ۰۹:۱۰",
    href: "/student/next-step",
  },
  {
    id: "n-2",
    title: "یادآوری ثبت گزارش کلاس",
    body: "گزارش کلاس امروز ریاضی پایه دهم آماده ثبت است.",
    kind: "reminder",
    audience: "teacher",
    createdAt: "امروز ۱۱:۴۵",
    href: "/teacher/log",
  },
  {
    id: "n-3",
    title: "جلسه همراهی والدین",
    body: "جلسه‌ای با خانواده آرمان فردا ساعت ۱۷ هماهنگ شده است.",
    kind: "mentoring",
    audience: "supervisor",
    createdAt: "دیروز ۱۶:۲۰",
    href: "/supervisor/sessions",
  },
  {
    id: "n-4",
    title: "خلاصه هفتگی فرزند شما",
    body: "گزارش رشد این هفته آرمان آماده مشاهده است.",
    kind: "info",
    audience: "parent",
    createdAt: "امروز ۰۸:۳۰",
    href: "/parent/weekly",
  },
  {
    id: "n-5",
    title: "نبض مدرسه رو به رشد",
    body: "نرخ ثبت کلاس‌های امروز ۹۲٪ است — یک روز پرانرژی.",
    kind: "announcement",
    audience: "admin",
    createdAt: "امروز ۰۸:۰۰",
    href: "/admin/registration",
  },
  {
    id: "n-6",
    title: "همایش خانواده و یادگیری",
    body: "پنجشنبه در سالن اجتماعات — همه نقش‌ها دعوت‌اند.",
    kind: "announcement",
    audience: "all",
    createdAt: "۲ روز پیش",
  },
];

export interface NotificationQuery {
  audience?: RoleId;
  unreadOnly?: boolean;
}

export async function getNotifications(q: NotificationQuery = {}): Promise<Notification[]> {
  return notifications.filter((n) => {
    if (q.audience && n.audience !== q.audience && n.audience !== "all") return false;
    if (q.unreadOnly && n.read) return false;
    return true;
  });
}

export async function getUnreadCount(audience?: RoleId): Promise<number> {
  const list = await getNotifications({ audience, unreadOnly: true });
  return list.length;
}

export const notificationsMock = { notifications };
