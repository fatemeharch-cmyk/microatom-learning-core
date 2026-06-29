// TODO(xano): replace this mock module with real Xano API calls.
import { warnMock } from "./_warn";
warnMock("mock/calendar");

/**
 * Atomia — Cross-role Calendar provider.
 *
 * Returns a unified `CalendarEvent[]` stream aggregated from every role's
 * mock dataset. UI can filter by `audience` / `kind` / `relatedClassroomId`.
 * Replace `getCalendarEvents` with a single Xano endpoint in production.
 */
import type { CalendarEvent, RoleId } from "@/lib/types";
import { calendarEvents as parentEvents } from "@/lib/parent-mock";
import { calendarEvents as supervisorEvents } from "@/lib/supervisor-mock";
import { academicCalendar as adminEvents } from "@/lib/admin-mock";

const fromParent: CalendarEvent[] = parentEvents.map((e) => ({
  id: `p-${e.id}`,
  date: e.date,
  title: e.title,
  kind: e.kind as CalendarEvent["kind"],
}));

const fromSupervisor: CalendarEvent[] = supervisorEvents.map((e) => ({
  id: `s-${e.id}`,
  date: e.date,
  title: e.title,
  kind: e.kind as CalendarEvent["kind"],
}));

const fromAdmin: CalendarEvent[] = adminEvents.map((e) => ({
  id: `a-${e.id}`,
  date: e.date,
  title: e.title,
  kind: e.type as CalendarEvent["kind"],
}));

const allEvents: CalendarEvent[] = [...fromAdmin, ...fromSupervisor, ...fromParent];

export interface CalendarQuery {
  audience?: RoleId | "all";
  kinds?: CalendarEvent["kind"][];
  from?: string; // YYYY-MM-DD
  to?: string;   // YYYY-MM-DD
}

export async function getCalendarEvents(q: CalendarQuery = {}): Promise<CalendarEvent[]> {
  return allEvents.filter((e) => {
    if (q.kinds && !q.kinds.includes(e.kind)) return false;
    if (q.from && e.date < q.from) return false;
    if (q.to && e.date > q.to) return false;
    return true;
  });
}

export const calendarMock = { allEvents };
