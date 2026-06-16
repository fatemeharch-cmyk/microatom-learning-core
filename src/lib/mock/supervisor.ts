/**
 * Atomia — Grade Supervisor mock provider.
 *
 * Wraps the existing supervisor-mock data and exposes a typed, async-shaped
 * provider surface. Existing UI keeps importing from "@/lib/supervisor-mock"
 * unchanged; new code should import from here.
 */
import {
  todaySessions as _todaySessions,
  upcomingParentMeetings as _upcomingParentMeetings,
  followUps as _followUps,
  pendingClassLogs as _pendingClassLogs,
  weeklyAISummary as _weeklyAISummary,
  calendarEvents as _calendarEvents,
  feedbackTrends as _feedbackTrends,
  teacherNotes as _teacherNotes,
  sampleStudentProfile as _sampleStudentProfile,
  type FollowUp,
  type PendingClassLog,
  type FeedbackTrend,
  type TeacherNote,
  type StudentProfile,
} from "@/lib/supervisor-mock";
import type {
  CalendarEvent,
  GradeSupervisor,
  LearningInsight,
  MentoringSession,
} from "@/lib/types";

const currentSupervisor: GradeSupervisor = {
  id: "sup-noori",
  name: "استاد نوری",
  role: "supervisor",
  status: "active",
  joinedAt: "۱۴۰۱/۰۵/۱۰",
  gradeId: "grade-11",
};

// Adapt the in-file `MentoringSession` shape to the shared interface.
const todaySessions: MentoringSession[] = _todaySessions as MentoringSession[];
const upcomingParentMeetings: MentoringSession[] = _upcomingParentMeetings as MentoringSession[];
const calendarEvents: CalendarEvent[] = _calendarEvents as CalendarEvent[];

const insights: LearningInsight[] = _weeklyAISummary.map((body, i) => ({
  id: `sup-in-${i + 1}`,
  title: "نکته توربو",
  body,
  tone: "suggestion" as const,
  audience: "supervisor" as const,
  source: "turbo" as const,
}));

export async function getCurrentSupervisor(): Promise<GradeSupervisor> {
  return currentSupervisor;
}
export async function getSupervisorTodaySessions(): Promise<MentoringSession[]> {
  return todaySessions;
}
export async function getSupervisorParentMeetings(): Promise<MentoringSession[]> {
  return upcomingParentMeetings;
}
export async function getSupervisorFollowUps(): Promise<FollowUp[]> {
  return _followUps;
}
export async function getSupervisorPendingLogs(): Promise<PendingClassLog[]> {
  return _pendingClassLogs;
}
export async function getSupervisorInsights(): Promise<LearningInsight[]> {
  return insights;
}
export async function getSupervisorCalendar(): Promise<CalendarEvent[]> {
  return calendarEvents;
}
export async function getSupervisorFeedbackTrends(): Promise<
  { group: string; trends: FeedbackTrend[] }[]
> {
  return _feedbackTrends;
}
export async function getSupervisorTeacherNotes(): Promise<TeacherNote[]> {
  return _teacherNotes;
}
export async function getSampleStudentProfile(): Promise<StudentProfile> {
  return _sampleStudentProfile;
}

export const supervisorMock = {
  currentSupervisor,
  todaySessions,
  upcomingParentMeetings,
  followUps: _followUps,
  pendingClassLogs: _pendingClassLogs,
  insights,
  calendarEvents,
  feedbackTrends: _feedbackTrends,
  teacherNotes: _teacherNotes,
  sampleStudentProfile: _sampleStudentProfile,
};
