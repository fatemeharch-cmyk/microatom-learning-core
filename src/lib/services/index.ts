/**
 * Atomia — Service layer barrel.
 *
 * UI should import data through services, not directly from `@/lib/mock`.
 * When Xano lands, only these service files change.
 *
 *   import { getStudentDashboard } from "@/lib/services";
 */
export * from "./student-service";
export * from "./teacher-service";
export * from "./supervisor-service";
export * from "./parent-service";
export * from "./admin-service";
export * from "./calendar-service";
export * from "./notification-service";
export * from "./homework-service";
export * from "./exam-service";
export * from "./resource-service";
