/**
 * Notification engine.
 *
 * Consumes domain events, applies role-based routing rules, renders the
 * Persian template, and stores the resulting notifications in memory. No
 * real delivery happens — UI components can read from `list()` /
 * `subscribe()` to display the mock inbox.
 *
 * Replace `deliver()` with Xano + push provider calls later. The public API
 * stays the same so services and UI don't change.
 */

import type {
  AnyAtomiaEvent,
  AtomiaEventName,
  AtomiaEventPayloads,
} from "@/lib/events/event-types";
import type { RoleId } from "@/lib/roles";
import { getRuleForEvent, type NotificationChannel } from "./notification-rules";
import { notificationTemplates } from "./notification-templates";

export interface EngineNotification {
  id: string;
  eventId: string;
  eventName: AtomiaEventName;
  audienceRole: RoleId;
  channels: NotificationChannel[];
  priority: "low" | "normal" | "high";
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

type Listener = (notifications: EngineNotification[]) => void;

function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `ntf_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function render<N extends AtomiaEventName>(
  name: N,
  payload: AtomiaEventPayloads[N],
) {
  const tpl = notificationTemplates[name] as (
    p: AtomiaEventPayloads[N],
  ) => { title: string; body: string };
  return tpl(payload);
}

function createNotificationEngine() {
  const store: EngineNotification[] = [];
  const listeners = new Set<Listener>();

  function notify() {
    const snapshot = store.slice();
    for (const l of listeners) l(snapshot);
  }

  async function deliver(_n: EngineNotification): Promise<void> {
    // Mock delivery: no-op. Future: dispatch to Xano / push provider.
  }

  return {
    async handleEvent(event: AnyAtomiaEvent): Promise<EngineNotification[]> {
      const rule = getRuleForEvent(event.name);
      const rendered = render(event.name, event.payload);
      const created: EngineNotification[] = rule.audience.map((role) => ({
        id: makeId(),
        eventId: event.meta.id,
        eventName: event.name,
        audienceRole: role,
        channels: rule.channels,
        priority: rule.priority,
        title: rendered.title,
        body: rendered.body,
        createdAt: event.meta.emittedAt,
        read: false,
      }));
      store.unshift(...created);
      await Promise.all(created.map(deliver));
      notify();
      return created;
    },
    list(role?: RoleId): EngineNotification[] {
      return role
        ? store.filter((n) => n.audienceRole === role)
        : store.slice();
    },
    markRead(id: string): void {
      const n = store.find((x) => x.id === id);
      if (n && !n.read) {
        n.read = true;
        notify();
      }
    },
    subscribe(listener: Listener): () => void {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    clear(): void {
      store.length = 0;
      notify();
    },
  };
}

export const notificationEngine = createNotificationEngine();
export type NotificationEngine = typeof notificationEngine;
