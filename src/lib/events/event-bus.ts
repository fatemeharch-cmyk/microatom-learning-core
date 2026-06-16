/**
 * Lightweight in-memory event bus.
 *
 * Synchronous pub/sub with typed event names. The bus is intentionally
 * minimal so it can later be swapped for a real transport (Xano webhook
 * relay, websocket gateway, BroadcastChannel, etc.) without changing the
 * call sites in services or the notification engine.
 */

import type {
  AnyAtomiaEvent,
  AtomiaEvent,
  AtomiaEventName,
  AtomiaEventPayloads,
  BaseEventMeta,
} from "./event-types";

export type EventHandler<N extends AtomiaEventName> = (
  event: AtomiaEvent<N>,
) => void | Promise<void>;

export type WildcardHandler = (event: AnyAtomiaEvent) => void | Promise<void>;

export interface EventBus {
  on<N extends AtomiaEventName>(name: N, handler: EventHandler<N>): () => void;
  onAny(handler: WildcardHandler): () => void;
  off<N extends AtomiaEventName>(name: N, handler: EventHandler<N>): void;
  emit<N extends AtomiaEventName>(
    name: N,
    payload: AtomiaEventPayloads[N],
    meta?: Partial<BaseEventMeta>,
  ): Promise<AtomiaEvent<N>>;
  clear(): void;
}

function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `evt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function createEventBus(): EventBus {
  const handlers = new Map<AtomiaEventName, Set<EventHandler<AtomiaEventName>>>();
  const wildcardHandlers = new Set<WildcardHandler>();

  return {
    on(name, handler) {
      let set = handlers.get(name);
      if (!set) {
        set = new Set();
        handlers.set(name, set);
      }
      set.add(handler as EventHandler<AtomiaEventName>);
      return () => this.off(name, handler);
    },
    onAny(handler) {
      wildcardHandlers.add(handler);
      return () => wildcardHandlers.delete(handler);
    },
    off(name, handler) {
      handlers.get(name)?.delete(handler as EventHandler<AtomiaEventName>);
    },
    async emit(name, payload, meta) {
      const event = {
        name,
        meta: {
          id: meta?.id ?? makeId(),
          emittedAt: meta?.emittedAt ?? new Date().toISOString(),
          actorRole: meta?.actorRole,
          correlationId: meta?.correlationId,
        },
        payload,
      } as AtomiaEvent<typeof name>;

      const targeted = handlers.get(name);
      const promises: Array<void | Promise<void>> = [];
      if (targeted) {
        for (const h of targeted) promises.push(h(event));
      }
      for (const h of wildcardHandlers) {
        promises.push(h(event as AnyAtomiaEvent));
      }
      await Promise.all(promises);
      return event;
    },
    clear() {
      handlers.clear();
      wildcardHandlers.clear();
    },
  };
}

/** Shared singleton bus. Replace with a transport-backed bus later. */
export const eventBus: EventBus = createEventBus();

/** Factory exported for tests and scoped buses. */
export { createEventBus };
