/**
 * Teacher service — async layer over mock providers.
 */
import {
  getCurrentTeacher,
  getTeacherClassrooms,
  getTeacherTodaySessions,
  getTeacherHomework as mockTeacherHomework,
  getTeacherExams as mockTeacherExams,
  getTeacherInsights,
  getDashboardFor,
} from "@/lib/mock";

export async function getTeacherDashboard() {
  return getDashboardFor("teacher");
}

export async function getTeacherWeeklySchedule() {
  const [teacher, classrooms, sessions] = await Promise.all([
    getCurrentTeacher(),
    getTeacherClassrooms(),
    getTeacherTodaySessions(),
  ]);
  return { teacher, classrooms, sessions };
}

export async function getTeacherClassLogs() {
  const sessions = await getTeacherTodaySessions();
  return sessions;
}

export async function getTeacherExams() {
  return mockTeacherExams();
}

export async function getTeacherHomework() {
  return mockTeacherHomework();
}

export async function getTeacherClassInsights() {
  return getTeacherInsights();
}

export async function getTeacherStudents() {
  return getTeacherClassrooms();
}
