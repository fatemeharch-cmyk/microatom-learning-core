/**
 * Calendar rules: role-based filtering and entry-normalisation helpers.
 *
 * The engine relies on these helpers to merge heterogeneous calendar
 * sources (classes, exams, mentoring, meetings, holidays, announcements,
 * reflection windows) into a single typed stream that downstream services
 * — and later the Notification Engine and Turbo Planner — can consume.
 */

import type { RoleId } from "@/lib/roles";

import type {
  AnnouncementAudience,
  CalendarEntry,
  ClassPeriod,
  ExamEvent,
  MentoringEvent,
  ParentMeeting,
  SchoolAnnouncement,
  SchoolHoliday,
  TeacherMeeting,
  WeeklyReflectionWindow,
} from "./calendar-types";

const audienceMatches = (
  role: RoleId,
  audiences: AnnouncementAudience[],
): boolean => audiences.includes("all") || audiences.includes(role);

/** Default visibility rules per role for each entry kind. */
export const ROLE_VISIBILITY: Record<RoleId, CalendarEntry["kind"][]> = {
  student: ["class_period", "exam", "mentoring", "holiday", "announcement", "reflection_window"],
  parent: ["exam", "parent_meeting", "holiday", "announcement", "reflection_window"],
  teacher: ["class_period", "exam", "teacher_meeting", "holiday", "announcement"],
  supervisor: [
    "class_period",
    "exam",
    "mentoring",
    "parent_meeting",
    "teacher_meeting",
    "holiday",
    "announcement",
    "reflection_window",
  ],
  admin: [
    "class_period",
    "exam",
    "mentoring",
    "parent_meeting",
    "teacher_meeting",
    "holiday",
    "announcement",
    "reflection_window",
  ],
};

export const isVisibleToRole = (
  entry: CalendarEntry,
  role: RoleId,
): boolean => {
  if (!ROLE_VISIBILITY[role]?.includes(entry.kind)) return false;
  return audienceMatches(role, entry.audiences);
};

const allRoles: AnnouncementAudience[] = ["all"];

export const classPeriodToEntry = (p: ClassPeriod): CalendarEntry => ({
  id: p.id,
  kind: "class_period",
  date: p.date,
  startsAt: p.startsAt,
  endsAt: p.endsAt,
  title: p.topic ?? "کلاس درس",
  description: p.room ? `کلاس ${p.room}` : undefined,
  audiences: ["student", "teacher", "supervisor", "admin"],
  source: p,
});

export const examToEntry = (e: ExamEvent): CalendarEntry => ({
  id: e.id,
  kind: "exam",
  date: e.date,
  startsAt: e.startsAt,
  endsAt: e.endsAt,
  title: e.title,
  description: e.description,
  audiences: ["student", "parent", "teacher", "supervisor", "admin"],
  source: e,
});

export const mentoringToEntry = (m: MentoringEvent): CalendarEntry => ({
  id: m.id,
  kind: "mentoring",
  date: m.date,
  startsAt: m.startsAt,
  endsAt: m.endsAt,
  title: m.topic,
  audiences: ["student", "supervisor", "admin"],
  source: m,
});

export const parentMeetingToEntry = (m: ParentMeeting): CalendarEntry => ({
  id: m.id,
  kind: "parent_meeting",
  date: m.date,
  startsAt: m.startsAt,
  endsAt: m.endsAt,
  title: m.topic,
  description: m.location,
  audiences: ["parent", "supervisor", "admin"],
  source: m,
});

export const teacherMeetingToEntry = (m: TeacherMeeting): CalendarEntry => ({
  id: m.id,
  kind: "teacher_meeting",
  date: m.date,
  startsAt: m.startsAt,
  endsAt: m.endsAt,
  title: m.topic,
  description: m.location,
  audiences: ["teacher", "supervisor", "admin"],
  source: m,
});

export const holidayToEntry = (h: SchoolHoliday): CalendarEntry => ({
  id: h.id,
  kind: "holiday",
  date: h.startsOn,
  title: h.title,
  description: h.description,
  audiences: allRoles,
  source: h,
});

export const announcementToEntry = (a: SchoolAnnouncement): CalendarEntry => ({
  id: a.id,
  kind: "announcement",
  date: a.publishedAt.slice(0, 10),
  startsAt: a.publishedAt,
  endsAt: a.expiresAt,
  title: a.title,
  description: a.body,
  audiences: a.audiences,
  source: a,
});

export const reflectionWindowToEntry = (
  w: WeeklyReflectionWindow,
): CalendarEntry => ({
  id: w.id,
  kind: "reflection_window",
  date: w.opensAt.slice(0, 10),
  startsAt: w.opensAt,
  endsAt: w.closesAt,
  title: "پنجره بازخورد هفتگی",
  audiences: w.audiences,
  source: w,
});

export const sortEntriesByTime = (entries: CalendarEntry[]): CalendarEntry[] =>
  [...entries].sort((a, b) => {
    const ax = a.startsAt ?? `${a.date}T00:00:00`;
    const bx = b.startsAt ?? `${b.date}T00:00:00`;
    return ax.localeCompare(bx);
  });
