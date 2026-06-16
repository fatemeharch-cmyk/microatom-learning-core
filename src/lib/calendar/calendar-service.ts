/**
 * Async service facade over the Calendar Engine.
 *
 * UI / service callers should depend on this module rather than the engine
 * or mock dataset directly. When Xano is wired in, each method here will
 * delegate to the API client while keeping the same signatures, so no UI
 * components need to change.
 *
 * NOTE: this lives alongside the existing `src/lib/services/calendar-service.ts`
 * on purpose — that file is the legacy notification/calendar facade. This
 * new module is the canonical Academic Calendar Engine service.
 */

import type { RoleId } from "@/lib/roles";

import { calendarEngine } from "./calendar-engine";
import type {
  AcademicTimeline,
  CalendarEntry,
  IsoDate,
} from "./calendar-types";

export const academicCalendarService = {
  async getTodaySchedule(role?: RoleId): Promise<CalendarEntry[]> {
    return calendarEngine.getTodaySchedule(role);
  },
  async getWeeklySchedule(role?: RoleId): Promise<CalendarEntry[]> {
    return calendarEngine.getWeeklySchedule(role);
  },
  async getUpcomingEvents(
    role?: RoleId,
    limit?: number,
  ): Promise<CalendarEntry[]> {
    return calendarEngine.getUpcomingEvents(role, limit);
  },
  async getEventsByDate(
    date: IsoDate,
    role?: RoleId,
  ): Promise<CalendarEntry[]> {
    return calendarEngine.getEventsByDate(date, role);
  },
  async getAcademicTimeline(): Promise<AcademicTimeline> {
    return calendarEngine.getAcademicTimeline();
  },
};

export type AcademicCalendarService = typeof academicCalendarService;
