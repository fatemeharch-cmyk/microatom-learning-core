/**
 * Learning Health Center glossary.
 *
 * Conditional UI wording that applies ONLY when the active scope is
 * Grade 11 — Experimental Sciences. For any other grade/major the
 * helpers return `active: false` and callers fall back to the default
 * labels. No backend, route, or logic changes — wording only.
 */

import { useScope } from "./scope";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Stethoscope,
  ScanLine,
  HeartPulse,
  ClipboardList,
  ShieldCheck,
  CalendarCheck2,
  Compass,
  Target,
  FolderHeart,
  Trophy,
  NotebookPen,
  ScrollText,
  Users,
  Siren,
  MessageCircleHeart,
  LayoutDashboard,
  GraduationCap,
  Home,
} from "lucide-react";

export type HealthNavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

export type HealthStatus = "green" | "yellow" | "orange" | "red";

export const HEALTH_STATUS_LABELS_FA: Record<HealthStatus, string> = {
  green: "سالم",
  yellow: "مراقبت",
  orange: "کلینیک فعال",
  red: "اورژانس",
};

const STUDENT_ITEMS: HealthNavItem[] = [
  { title: "خانه", url: "/student", icon: Home },
  { title: "شرح حال", url: "/student/profile", icon: Stethoscope },
  { title: "نبض دانش", url: "/student/progress", icon: HeartPulse },
  { title: "اسکن ضعف", url: "/student/tracking", icon: ScanLine },
  { title: "کلینیک یادگیری", url: "/student/notebook", icon: NotebookPen },
  { title: "نسخه", url: "/student/planner", icon: ScrollText },
  { title: "مراقبت", url: "/student/schedule", icon: ShieldCheck },
  { title: "چکاپ", url: "/student/exams", icon: CalendarCheck2 },
  { title: "کاوش", url: "/student/analytics", icon: Compass },
  { title: "ماموریت", url: "/student/homework", icon: Target },
  { title: "پرونده رشد", url: "/student/growth", icon: FolderHeart },
  { title: "افتخارات", url: "/student/achievements", icon: Trophy },
];

const TEACHER_ITEMS: HealthNavItem[] = [
  { title: "یادداشت بالینی", url: "/teacher/log", icon: ClipboardList },
  { title: "نبض‌های کلاس", url: "/teacher/exams", icon: HeartPulse },
  { title: "اسکن کلاس", url: "/teacher/analytics", icon: ScanLine },
  { title: "ماموریت‌ها", url: "/teacher/homework", icon: Target },
  { title: "کاوش‌ها", url: "/teacher/students", icon: Compass },
  { title: "پایش کلاس", url: "/teacher", icon: Activity },
];

const SUPERVISOR_ITEMS: HealthNavItem[] = [
  { title: "پایش", url: "/supervisor", icon: Activity },
  { title: "شرح حال دانش‌آموزان", url: "/supervisor/student", icon: Stethoscope },
  { title: "کلینیک‌های فعال", url: "/supervisor/followups", icon: NotebookPen },
  { title: "نسخه‌ها", url: "/supervisor/sessions", icon: ScrollText },
  { title: "چکاپ پایه", url: "/supervisor/grade", icon: CalendarCheck2 },
  { title: "اتاق مشاوره", url: "/supervisor/feedback", icon: MessageCircleHeart },
  { title: "اورژانس", url: "/supervisor/alerts", icon: Siren },
];

/**
 * Returns the Learning Health Center wording when scope = Grade 11
 * Experimental Sciences. For any other scope returns `active: false`
 * so callers keep their existing default labels.
 */
export function useHealthGlossary() {
  const { grade, major } = useScope();
  const active = grade?.id === "g11" && major?.id === "experimental";

  return {
    active,
    studentItems: active ? STUDENT_ITEMS : null,
    teacherItems: active ? TEACHER_ITEMS : null,
    supervisorItems: active ? SUPERVISOR_ITEMS : null,
    statusLabels: active ? HEALTH_STATUS_LABELS_FA : null,
  };
}

// Re-export icon set so consumers can render a custom item list.
export const HealthIcons = {
  LayoutDashboard,
  GraduationCap,
  Users,
};
