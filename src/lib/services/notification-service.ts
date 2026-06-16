/**
 * Notification service — role-aware notification reads.
 */
import { getNotifications } from "@/lib/mock";
import type { Notification } from "@/lib/types";
import type { RoleId } from "@/lib/roles";

export async function getNotificationsByRole(role: RoleId): Promise<Notification[]> {
  return getNotifications({ audience: role });
}

export async function markNotificationAsRead(id: string): Promise<{ id: string; read: true }> {
  // Mock-only: future Xano call will PATCH /notifications/:id.
  return { id, read: true };
}
