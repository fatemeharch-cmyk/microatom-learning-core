/**
 * Mock event handlers.
 *
 * Wires the in-memory event bus into the notification engine. Each handler
 * is a thin adapter that turns a domain event into one or more notifications
 * for the relevant roles. No real delivery happens — notifications are
 * pushed into the engine's in-memory queue for now.
 *
 * Future: replace these handlers with Xano webhook subscribers / Turbo AI
 * pipelines without changing the events themselves.
 */

import { eventBus } from "./event-bus";
import type { AnyAtomiaEvent } from "./event-types";
import { notificationEngine } from "@/lib/notifications/notification-engine";

let registered = false;

/**
 * Register the default mock handlers. Idempotent — safe to call on hot
 * reload. Returns a teardown function for tests.
 */
export function registerMockEventHandlers(): () => void {
  if (registered) return () => {};
  registered = true;

  const off = eventBus.onAny(async (event: AnyAtomiaEvent) => {
    await notificationEngine.handleEvent(event);
  });

  return () => {
    off();
    registered = false;
  };
}

/** Convenience for tests that want a clean slate. */
export function resetEventHandlers() {
  eventBus.clear();
  registered = false;
}
