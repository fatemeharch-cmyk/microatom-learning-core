/**
 * Admin service — async layer over mock providers.
 */
import {
  getSchoolPulse,
  getTodayRegistrations,
  getWeeklyEvents,
  getTeacherActivity,
  getGradeSummaries,
  getAdminFeedbackSummary,
  getAdminFeedbackThemes,
  getManagedUsers,
  getAdminClassrooms,
  getAdminWeeklySchedule,
  getAdminWeekDays,
  getAdminCalendar,
  getAdminClassRegistration,
  getSystemSettings as mockSystemSettings,
  getDashboardFor,
} from "@/lib/mock";

export async function getAdminDashboard() {
  const [base, pulse, registrations, weekly, teachers, grades] = await Promise.all([
    getDashboardFor("admin"),
    getSchoolPulse(),
    getTodayRegistrations(),
    getWeeklyEvents(),
    getTeacherActivity(),
    getGradeSummaries(),
  ]);
  return { ...base, pulse, registrations, weekly, teachers, grades };
}

export async function getUsersOverview() {
  return getManagedUsers();
}

export async function getGradesAndClassrooms() {
  const [grades, classrooms] = await Promise.all([
    getGradeSummaries(),
    getAdminClassrooms(),
  ]);
  return { grades, classrooms };
}

export async function getSchoolWeeklySchedule() {
  const [schedule, days] = await Promise.all([
    getAdminWeeklySchedule(),
    getAdminWeekDays(),
  ]);
  return { schedule, days };
}

export async function getSchoolCalendar() {
  return getAdminCalendar();
}

export async function getClassRegistrationOverview() {
  return getAdminClassRegistration();
}

export async function getSchoolFeedbackOverview() {
  const [summary, themes] = await Promise.all([
    getAdminFeedbackSummary(),
    getAdminFeedbackThemes(),
  ]);
  return { summary, themes };
}

export async function getSystemSettings() {
  return mockSystemSettings();
}
