/**
 * Atomia — School Admin mock provider.
 *
 * Wraps the existing admin-mock data behind an async-shaped provider
 * surface and maps it to the shared type system. Existing pages keep
 * importing from "@/lib/admin-mock"; new pages should import from here.
 */
import {
  schoolPulse as _schoolPulse,
  todayRegistrations as _todayRegistrations,
  weeklyEvents as _weeklyEvents,
  teacherActivity as _teacherActivity,
  gradeSummaries as _gradeSummaries,
  feedbackSummary as _feedbackSummary,
  managedUsers as _managedUsers,
  classrooms as _classrooms,
  weeklySchedule as _weeklySchedule,
  weekDays as _weekDays,
  academicCalendar as _academicCalendar,
  classRegistration as _classRegistration,
  feedbackThemes as _feedbackThemes,
  systemSettings as _systemSettings,
  roleLabelsFa as _roleLabelsFa,
  type SchoolPulse,
  type TodayRegistration,
  type WeeklyEvent,
  type TeacherActivity,
  type GradeSummary,
  type ClassRegistrationItem,
  type FeedbackTheme,
  type SystemSettings,
} from "@/lib/admin-mock";
import type {
  CalendarEvent,
  Classroom,
  User,
  WeeklyFeedback,
} from "@/lib/types";

// Map admin-mock shapes onto the shared type system.
const classrooms: Classroom[] = _classrooms.map((c) => ({
  id: c.id,
  name: c.name,
  gradeId: `grade-${c.grade}`,
  major: c.major,
  studentCount: c.students,
}));

const users: User[] = _managedUsers.map((u) => ({
  id: u.id,
  name: u.name,
  role: u.role,
  status: u.status,
  joinedAt: u.joinedAt,
}));

const calendarEvents: CalendarEvent[] = _academicCalendar.map((c) => ({
  id: c.id,
  date: c.date,
  title: c.title,
  kind: c.type === "parent"
    ? "parent"
    : c.type === "teacher"
      ? "teacher"
      : (c.type as CalendarEvent["kind"]),
}));

const feedback: WeeklyFeedback[] = _feedbackSummary.map((f) => ({
  channel: f.source,
  label: f.label,
  satisfaction: f.satisfaction,
  responses: f.responses,
  trend: f.trend,
}));

// --- Providers ----------------------------------------------------------

export async function getSchoolPulse(): Promise<SchoolPulse> {
  return _schoolPulse;
}
export async function getTodayRegistrations(): Promise<TodayRegistration[]> {
  return _todayRegistrations;
}
export async function getWeeklyEvents(): Promise<WeeklyEvent[]> {
  return _weeklyEvents;
}
export async function getTeacherActivity(): Promise<TeacherActivity[]> {
  return _teacherActivity;
}
export async function getGradeSummaries(): Promise<GradeSummary[]> {
  return _gradeSummaries;
}
export async function getAdminFeedbackSummary(): Promise<WeeklyFeedback[]> {
  return feedback;
}
export async function getAdminFeedbackThemes(): Promise<FeedbackTheme[]> {
  return _feedbackThemes;
}
export async function getManagedUsers(): Promise<User[]> {
  return users;
}
export async function getAdminClassrooms(): Promise<Classroom[]> {
  return classrooms;
}
export async function getAdminWeeklySchedule() {
  return _weeklySchedule;
}
export async function getAdminWeekDays(): Promise<string[]> {
  return _weekDays;
}
export async function getAdminCalendar(): Promise<CalendarEvent[]> {
  return calendarEvents;
}
export async function getAdminClassRegistration(): Promise<ClassRegistrationItem[]> {
  return _classRegistration;
}
export async function getSystemSettings(): Promise<SystemSettings> {
  return _systemSettings;
}

export const adminMock = {
  schoolPulse: _schoolPulse,
  todayRegistrations: _todayRegistrations,
  weeklyEvents: _weeklyEvents,
  teacherActivity: _teacherActivity,
  gradeSummaries: _gradeSummaries,
  feedback,
  feedbackThemes: _feedbackThemes,
  users,
  classrooms,
  weeklySchedule: _weeklySchedule,
  weekDays: _weekDays,
  calendarEvents,
  classRegistration: _classRegistration,
  systemSettings: _systemSettings,
  roleLabelsFa: _roleLabelsFa,
};
