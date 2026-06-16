/**
 * Atomia — Mock data barrel.
 *
 * Single entry point for every mock provider. UI code should import from
 * `@/lib/mock` and never from individual files directly, so the future
 * Xano integration only has to swap this folder's internals.
 *
 *   import { getDashboardFor, getNotifications } from "@/lib/mock";
 */
export * from "./student";
export * from "./teacher";
export * from "./supervisor";
export * from "./parent";
export * from "./admin";
export * from "./calendar";
export * from "./notifications";
export * from "./dashboard";
