/**
 * Atomia — Cross-role Dashboard provider.
 *
 * Builds a per-role dashboard payload from the underlying role providers.
 * UI components depend only on the `RoleDashboard` shape; the Xano swap
 * later only needs to replace `getDashboardFor`.
 */
import type {
  CalendarEvent,
  LearningInsight,
  Notification,
  RoleId,
  WeeklyFeedback,
} from "@/lib/types";
import { getCalendarEvents } from "./calendar";
import { getNotifications } from "./notifications";
import {
  getCurrentStudent,
  getStudentInsights,
  getTodaySessions,
} from "./student";
import {
  getCurrentTeacher,
  getTeacherInsights,
  getTeacherTodaySessions,
} from "./teacher";
import {
  getCurrentSupervisor,
  getSupervisorInsights,
  getSupervisorTodaySessions,
} from "./supervisor";
import {
  getCurrentParent,
  getParentDailySummary,
  getParentWeeklyPulse,
} from "./parent";
import {
  getSchoolPulse,
  getAdminFeedbackSummary,
  getTodayRegistrations,
} from "./admin";

export interface RoleDashboard {
  role: RoleId;
  greetingName: string;
  highlights: Array<{ label: string; value: string }>;
  insights: LearningInsight[];
  upcoming: CalendarEvent[];
  notifications: Notification[];
  feedback?: WeeklyFeedback[];
}

async function buildStudentDashboard(): Promise<RoleDashboard> {
  const [me, insights, sessions, upcoming, notifications] = await Promise.all([
    getCurrentStudent(),
    getStudentInsights(),
    getTodaySessions(),
    getCalendarEvents({ kinds: ["class", "exam", "mentoring"] }),
    getNotifications({ audience: "student" }),
  ]);
  return {
    role: "student",
    greetingName: me.name,
    highlights: [
      { label: "کلاس‌های امروز", value: sessions.length.toLocaleString("fa-IR") },
      { label: "تداوم یادگیری", value: "۱۲ روز" },
    ],
    insights,
    upcoming,
    notifications,
  };
}

async function buildTeacherDashboard(): Promise<RoleDashboard> {
  const [me, insights, sessions, upcoming, notifications] = await Promise.all([
    getCurrentTeacher(),
    getTeacherInsights(),
    getTeacherTodaySessions(),
    getCalendarEvents({ kinds: ["class", "exam", "teacher"] }),
    getNotifications({ audience: "teacher" }),
  ]);
  return {
    role: "teacher",
    greetingName: me.name,
    highlights: [
      { label: "کلاس‌های امروز", value: sessions.length.toLocaleString("fa-IR") },
      { label: "کلاس‌های فعال", value: me.classroomIds.length.toLocaleString("fa-IR") },
    ],
    insights,
    upcoming,
    notifications,
  };
}

async function buildSupervisorDashboard(): Promise<RoleDashboard> {
  const [me, insights, sessions, upcoming, notifications] = await Promise.all([
    getCurrentSupervisor(),
    getSupervisorInsights(),
    getSupervisorTodaySessions(),
    getCalendarEvents({ kinds: ["mentoring", "parent", "teacher", "exam"] }),
    getNotifications({ audience: "supervisor" }),
  ]);
  return {
    role: "supervisor",
    greetingName: me.name,
    highlights: [
      { label: "جلسات امروز", value: sessions.length.toLocaleString("fa-IR") },
    ],
    insights,
    upcoming,
    notifications,
  };
}

async function buildParentDashboard(): Promise<RoleDashboard> {
  const [me, daily, pulse, upcoming, notifications] = await Promise.all([
    getCurrentParent(),
    getParentDailySummary(),
    getParentWeeklyPulse(),
    getCalendarEvents({ kinds: ["mentoring", "parent", "exam", "school"] }),
    getNotifications({ audience: "parent" }),
  ]);
  return {
    role: "parent",
    greetingName: me.name,
    highlights: [
      { label: "یادگیری امروز", value: `${daily.studiedMinutes.toLocaleString("fa-IR")} دقیقه` },
      { label: "نبض هفتگی", value: `${Math.round(pulse.reduce((a, b) => a + b.value, 0) / pulse.length)}%` },
    ],
    insights: [],
    upcoming,
    notifications,
  };
}

async function buildAdminDashboard(): Promise<RoleDashboard> {
  const [pulse, feedback, regs, upcoming, notifications] = await Promise.all([
    getSchoolPulse(),
    getAdminFeedbackSummary(),
    getTodayRegistrations(),
    getCalendarEvents(),
    getNotifications({ audience: "admin" }),
  ]);
  return {
    role: "admin",
    greetingName: "مدیر مدرسه",
    highlights: [
      { label: "دانش‌آموزان فعال", value: pulse.activeStudents.toLocaleString("fa-IR") },
      { label: "دبیران فعال", value: pulse.activeTeachers.toLocaleString("fa-IR") },
      { label: "کلاس‌های امروز", value: pulse.classesToday.toLocaleString("fa-IR") },
      { label: "نرخ ثبت", value: `${pulse.registrationRate}%` },
    ],
    insights: [],
    upcoming,
    notifications,
    feedback,
  };
  void regs; // available for future detail views
}

export async function getDashboardFor(role: RoleId): Promise<RoleDashboard> {
  switch (role) {
    case "student": return buildStudentDashboard();
    case "teacher": return buildTeacherDashboard();
    case "supervisor": return buildSupervisorDashboard();
    case "parent": return buildParentDashboard();
    case "admin": return buildAdminDashboard();
  }
}
