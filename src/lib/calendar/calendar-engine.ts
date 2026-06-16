/**
 * Academic Calendar Engine.
 *
 * Pure, synchronous merger over the mock dataset. The async service layer
 * wraps these helpers and is the boundary that will later call Xano.
 *
 * Future integration hooks:
 *  - Notification Engine: subscribe to entries returned here to schedule
 *    role-based reminders (exam-soon, mentoring-soon, reflection-open, ...).
 *  - Event Bus: publish AtomiaEvents when calendar entries are added,
 *    moved, or cancelled.
 *  - Turbo AI / Daily Planner: consume getTodaySchedule + getUpcomingEvents
 *    to assemble personalised plans.
 */

import type { RoleId } from "@/lib/roles";

import {
  MOCK_ACADEMIC_YEAR,
  MOCK_ANNOUNCEMENTS,
  MOCK_CLASS_PERIODS,
  MOCK_EXAMS,
  MOCK_HOLIDAYS,
  MOCK_MENTORING,
  MOCK_PARENT_MEETINGS,
  MOCK_REFLECTION_WINDOWS,
  MOCK_TEACHER_MEETINGS,
  MOCK_TERMS,
  MOCK_WEEKS,
} from "./calendar-mock";
import {
  announcementToEntry,
  classPeriodToEntry,
  examToEntry,
  holidayToEntry,
  isVisibleToRole,
  mentoringToEntry,
  parentMeetingToEntry,
  reflectionWindowToEntry,
  sortEntriesByTime,
  teacherMeetingToEntry,
} from "./calendar-rules";
import type {
  AcademicTimeline,
  CalendarEntry,
  IsoDate,
} from "./calendar-types";

const toIsoDate = (d: Date): IsoDate => d.toISOString().slice(0, 10);

const allEntries = (): CalendarEntry[] => [
  ...MOCK_CLASS_PERIODS.map(classPeriodToEntry),
  ...MOCK_EXAMS.map(examToEntry),
  ...MOCK_MENTORING.map(mentoringToEntry),
  ...MOCK_PARENT_MEETINGS.map(parentMeetingToEntry),
  ...MOCK_TEACHER_MEETINGS.map(teacherMeetingToEntry),
  ...MOCK_HOLIDAYS.map(holidayToEntry),
  ...MOCK_ANNOUNCEMENTS.map(announcementToEntry),
  ...MOCK_REFLECTION_WINDOWS.map(reflectionWindowToEntry),
];

const filterByRole = (entries: CalendarEntry[], role?: RoleId) =>
  role ? entries.filter((e) => isVisibleToRole(e, role)) : entries;

export const calendarEngine = {
  getTodaySchedule(role?: RoleId): CalendarEntry[] {
    const today = toIsoDate(new Date());
    return sortEntriesByTime(
      filterByRole(allEntries(), role).filter((e) => e.date === today),
    );
  },

  getWeeklySchedule(role?: RoleId): CalendarEntry[] {
    const week = MOCK_WEEKS[0];
    if (!week) return [];
    return sortEntriesByTime(
      filterByRole(allEntries(), role).filter(
        (e) => e.date >= week.startsOn && e.date <= week.endsOn,
      ),
    );
  },

  getUpcomingEvents(role?: RoleId, limit = 10): CalendarEntry[] {
    const today = toIsoDate(new Date());
    return sortEntriesByTime(
      filterByRole(allEntries(), role).filter((e) => e.date >= today),
    ).slice(0, limit);
  },

  getEventsByDate(date: IsoDate, role?: RoleId): CalendarEntry[] {
    return sortEntriesByTime(
      filterByRole(allEntries(), role).filter((e) => e.date === date),
    );
  },

  getAcademicTimeline(): AcademicTimeline {
    return {
      year: MOCK_ACADEMIC_YEAR,
      terms: MOCK_TERMS,
      weeks: MOCK_WEEKS,
      holidays: MOCK_HOLIDAYS,
    };
  },
};

export type CalendarEngine = typeof calendarEngine;
