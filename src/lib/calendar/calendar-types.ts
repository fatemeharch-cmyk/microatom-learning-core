/**
 * Academic Calendar typed entities for Atomia.
 *
 * Single source of truth for calendar-related interfaces consumed by the
 * calendar engine, service layer and (in the future) Xano-backed API
 * integration. No UI, runtime, or backend calls live here.
 */

import type { RoleId } from "@/lib/roles";

/** ISO date string (YYYY-MM-DD). */
export type IsoDate = string;
/** ISO datetime string. */
export type IsoDateTime = string;

export type AcademicYearStatus = "upcoming" | "active" | "archived";

export interface AcademicYear {
  id: string;
  label: string;
  startsOn: IsoDate;
  endsOn: IsoDate;
  status: AcademicYearStatus;
  termIds: string[];
}

export type SchoolTermKind = "term" | "semester" | "trimester";

export interface SchoolTerm {
  id: string;
  academicYearId: string;
  label: string;
  kind: SchoolTermKind;
  startsOn: IsoDate;
  endsOn: IsoDate;
  weekIds: string[];
}

export interface SchoolWeek {
  id: string;
  termId: string;
  index: number;
  label: string;
  startsOn: IsoDate;
  endsOn: IsoDate;
  reflectionWindowId?: string;
}

export type DayKind = "school" | "weekend" | "holiday" | "exam" | "event";

export interface DaySchedule {
  date: IsoDate;
  weekId: string;
  kind: DayKind;
  periodIds: string[];
  notes?: string;
}

export interface ClassPeriod {
  id: string;
  date: IsoDate;
  classroomId: string;
  subjectId: string;
  teacherId: string;
  startsAt: IsoDateTime;
  endsAt: IsoDateTime;
  room?: string;
  topic?: string;
}

export type ExamScope = "classroom" | "grade" | "school";

export interface ExamEvent {
  id: string;
  date: IsoDate;
  startsAt: IsoDateTime;
  endsAt: IsoDateTime;
  subjectId: string;
  scope: ExamScope;
  classroomId?: string;
  gradeId?: string;
  title: string;
  description?: string;
}

export type MentoringEventMode = "in_person" | "online";

export interface MentoringEvent {
  id: string;
  date: IsoDate;
  startsAt: IsoDateTime;
  endsAt: IsoDateTime;
  mentorId: string;
  studentId: string;
  mode: MentoringEventMode;
  topic: string;
}

export interface ParentMeeting {
  id: string;
  date: IsoDate;
  startsAt: IsoDateTime;
  endsAt: IsoDateTime;
  parentId: string;
  studentId: string;
  hostId: string;
  topic: string;
  location?: string;
}

export interface TeacherMeeting {
  id: string;
  date: IsoDate;
  startsAt: IsoDateTime;
  endsAt: IsoDateTime;
  organizerId: string;
  participantIds: string[];
  topic: string;
  location?: string;
}

export interface SchoolHoliday {
  id: string;
  startsOn: IsoDate;
  endsOn: IsoDate;
  title: string;
  description?: string;
  countrywide?: boolean;
}

export type AnnouncementAudience = RoleId | "all";

export interface SchoolAnnouncement {
  id: string;
  publishedAt: IsoDateTime;
  expiresAt?: IsoDateTime;
  title: string;
  body: string;
  audiences: AnnouncementAudience[];
}

export interface WeeklyReflectionWindow {
  id: string;
  weekId: string;
  opensAt: IsoDateTime;
  closesAt: IsoDateTime;
  audiences: AnnouncementAudience[];
}

/** Discriminated union of every event the calendar engine can return. */
export type CalendarEntryKind =
  | "class_period"
  | "exam"
  | "mentoring"
  | "parent_meeting"
  | "teacher_meeting"
  | "holiday"
  | "announcement"
  | "reflection_window";

export interface CalendarEntry {
  id: string;
  kind: CalendarEntryKind;
  date: IsoDate;
  startsAt?: IsoDateTime;
  endsAt?: IsoDateTime;
  title: string;
  description?: string;
  audiences: AnnouncementAudience[];
  /** Underlying typed source object, useful for downstream consumers. */
  source:
    | ClassPeriod
    | ExamEvent
    | MentoringEvent
    | ParentMeeting
    | TeacherMeeting
    | SchoolHoliday
    | SchoolAnnouncement
    | WeeklyReflectionWindow;
}

export interface AcademicTimeline {
  year: AcademicYear;
  terms: SchoolTerm[];
  weeks: SchoolWeek[];
  holidays: SchoolHoliday[];
}
