/**
 * Notification routing rules.
 *
 * Maps each domain event to the set of roles that should receive a
 * notification. Kept declarative so future Xano-backed rules can be loaded
 * dynamically without changing the engine.
 */

import type { AtomiaEventName } from "@/lib/events/event-types";
import type { RoleId } from "@/lib/roles";

export type NotificationChannel = "in_app" | "email" | "push";

export interface NotificationRule {
  /** Roles the notification should be fanned out to */
  audience: RoleId[];
  /** Delivery channels — only in_app is wired in the mock engine */
  channels: NotificationChannel[];
  /** Soft priority hint for the inbox UI */
  priority: "low" | "normal" | "high";
}

export const notificationRules: Record<AtomiaEventName, NotificationRule> = {
  class_logged: {
    audience: ["supervisor", "admin"],
    channels: ["in_app"],
    priority: "low",
  },
  homework_created: {
    audience: ["student", "parent"],
    channels: ["in_app"],
    priority: "normal",
  },
  exam_created: {
    audience: ["student", "parent", "supervisor"],
    channels: ["in_app"],
    priority: "normal",
  },
  exam_result_published: {
    audience: ["student", "parent", "teacher", "supervisor"],
    channels: ["in_app"],
    priority: "high",
  },
  mentoring_session_created: {
    audience: ["student", "parent", "supervisor"],
    channels: ["in_app"],
    priority: "normal",
  },
  mentoring_session_completed: {
    audience: ["student", "parent", "supervisor"],
    channels: ["in_app"],
    priority: "normal",
  },
  weekly_feedback_submitted: {
    audience: ["parent", "supervisor"],
    channels: ["in_app"],
    priority: "normal",
  },
  student_absence_recorded: {
    audience: ["parent", "supervisor"],
    channels: ["in_app"],
    priority: "high",
  },
  daily_plan_generated: {
    audience: ["student", "parent"],
    channels: ["in_app"],
    priority: "low",
  },
};

export function getRuleForEvent(name: AtomiaEventName): NotificationRule {
  return notificationRules[name];
}
