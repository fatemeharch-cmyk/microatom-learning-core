/**
 * Supervisor service — async layer over mock providers.
 */
import {
  getCurrentSupervisor,
  getSupervisorTodaySessions,
  getSupervisorParentMeetings,
  getSupervisorFollowUps,
  getSupervisorPendingLogs,
  getSupervisorInsights,
  getSupervisorCalendar,
  getSupervisorFeedbackTrends,
  getSupervisorTeacherNotes,
  getSampleStudentProfile,
  getDashboardFor,
} from "@/lib/mock";

export async function getSupervisorDashboard() {
  return getDashboardFor("supervisor");
}

export async function getMentoringSessions() {
  const [today, meetings] = await Promise.all([
    getSupervisorTodaySessions(),
    getSupervisorParentMeetings(),
  ]);
  return { today, meetings };
}

export async function getStudentLearningProfile(_studentId?: string) {
  return getSampleStudentProfile();
}

export async function getSupervisorFollowups() {
  return getSupervisorFollowUps();
}

export async function getTurboSupervisorSummary() {
  const [supervisor, pendingLogs, insights, notes, calendar] = await Promise.all([
    getCurrentSupervisor(),
    getSupervisorPendingLogs(),
    getSupervisorInsights(),
    getSupervisorTeacherNotes(),
    getSupervisorCalendar(),
  ]);
  return { supervisor, pendingLogs, insights, notes, calendar };
}

export async function getWeeklyFeedbackOverview() {
  return getSupervisorFeedbackTrends();
}
