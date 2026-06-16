/**
 * Barrel export for the Academic Calendar Engine module.
 */

export * from "./calendar-types";
export * from "./calendar-rules";
export * from "./calendar-mock";
export { calendarEngine } from "./calendar-engine";
export type { CalendarEngine } from "./calendar-engine";
export {
  academicCalendarService,
} from "./calendar-service";
export type { AcademicCalendarService } from "./calendar-service";
