/**
 * Calendar service — role-aware calendar reads.
 */
import { getCalendarEvents } from "@/lib/mock";
import type { CalendarEvent } from "@/lib/types";
import type { RoleId } from "@/lib/roles";

export async function getCalendarEventsByRole(role: RoleId): Promise<CalendarEvent[]> {
  return getCalendarEvents({ audience: role });
}

export async function getTodayEvents(role: RoleId): Promise<CalendarEvent[]> {
  const today = new Date().toISOString().slice(0, 10);
  const events = await getCalendarEvents({ audience: role });
  return events.filter((e) => (e.date ?? e.startsAt ?? "").startsWith(today));
}
