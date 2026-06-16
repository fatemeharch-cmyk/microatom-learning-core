/**
 * Atomia — Parent mock provider.
 *
 * Wraps the existing parent-mock data and exposes a typed, async-shaped
 * provider surface so the UI can later swap to Xano without rewrites.
 */
import {
  dailySummary as _dailySummary,
  upcomingExams as _upcomingExams,
  mentoringMeetings as _mentoringMeetings,
  weeklyPulse as _weeklyPulse,
  announcements as _announcements,
  calendarEvents as _calendarEvents,
  growthIndicators as _growthIndicators,
  weeklySummary as _weeklySummary,
  companionSuggestions as _companionSuggestions,
  childName as _childName,
  type DailySummary,
  type UpcomingExam,
  type WeeklyPulse,
  type Announcement,
  type GrowthIndicator,
  type WeeklySummary,
  type CompanionSuggestion,
} from "@/lib/parent-mock";
import type {
  CalendarEvent,
  MentoringSession,
  Parent,
} from "@/lib/types";

const currentParent: Parent = {
  id: "par-karimi",
  name: "خانواده کریمی",
  role: "parent",
  status: "active",
  joinedAt: "۱۴۰۳/۰۷/۰۱",
  childIds: ["stu-arman"],
};

const meetings: MentoringSession[] = _mentoringMeetings.map((m) => ({
  id: m.id,
  studentName: _childName,
  studentClass: "یازدهم تجربی ۱",
  date: m.date,
  time: m.time,
  type: m.type,
  status: m.status === "upcoming" ? "scheduled" : "completed",
  with: m.with,
  summary: m.summary,
  followUp: m.followUp,
}));

const calendarEvents: CalendarEvent[] = _calendarEvents.map((e) => ({
  id: e.id,
  date: e.date,
  title: e.title,
  kind: e.kind as CalendarEvent["kind"],
}));

export async function getCurrentParent(): Promise<Parent> {
  return currentParent;
}
export async function getChildName(): Promise<string> {
  return _childName;
}
export async function getParentDailySummary(): Promise<DailySummary> {
  return _dailySummary;
}
export async function getParentUpcomingExams(): Promise<UpcomingExam[]> {
  return _upcomingExams;
}
export async function getParentMeetings(): Promise<MentoringSession[]> {
  return meetings;
}
export async function getParentWeeklyPulse(): Promise<WeeklyPulse[]> {
  return _weeklyPulse;
}
export async function getParentAnnouncements(): Promise<Announcement[]> {
  return _announcements;
}
export async function getParentCalendar(): Promise<CalendarEvent[]> {
  return calendarEvents;
}
export async function getParentGrowthIndicators(): Promise<GrowthIndicator[]> {
  return _growthIndicators;
}
export async function getParentWeeklySummary(): Promise<WeeklySummary> {
  return _weeklySummary;
}
export async function getParentCompanionSuggestions(): Promise<CompanionSuggestion[]> {
  return _companionSuggestions;
}

export const parentMock = {
  currentParent,
  childName: _childName,
  dailySummary: _dailySummary,
  upcomingExams: _upcomingExams,
  meetings,
  weeklyPulse: _weeklyPulse,
  announcements: _announcements,
  calendarEvents,
  growthIndicators: _growthIndicators,
  weeklySummary: _weeklySummary,
  companionSuggestions: _companionSuggestions,
};
