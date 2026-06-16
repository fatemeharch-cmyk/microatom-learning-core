/**
 * Student service — thin async layer over mock providers.
 * Swap mock imports for Xano fetches later without touching UI.
 */
import {
  getCurrentStudent,
  getSubjects,
  getAtomBits,
  getTodaySessions,
  getStudentHomework as mockStudentHomework,
  getStudentExams as mockStudentExams,
  getStudentInsights,
  getDashboardFor,
} from "@/lib/mock";

export async function getStudentDashboard() {
  return getDashboardFor("student");
}

export async function getStudentTodayPlan() {
  const [student, sessions] = await Promise.all([
    getCurrentStudent(),
    getTodaySessions(),
  ]);
  return { student, sessions };
}

export async function getStudentLearningJournal() {
  const [insights, atomBits] = await Promise.all([
    getStudentInsights(),
    getAtomBits(),
  ]);
  return { insights, atomBits };
}

export async function getStudentHomework() {
  return mockStudentHomework();
}

export async function getStudentExams() {
  return mockStudentExams();
}

export async function getStudentResources() {
  const [subjects, atomBits] = await Promise.all([getSubjects(), getAtomBits()]);
  return { subjects, atomBits };
}

export async function getStudentGrowthPath() {
  const [student, atomBits, insights] = await Promise.all([
    getCurrentStudent(),
    getAtomBits(),
    getStudentInsights(),
  ]);
  return { student, atomBits, insights };
}
