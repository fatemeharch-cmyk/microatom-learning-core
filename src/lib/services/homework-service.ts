/**
 * Homework service — aggregated reads across roles.
 */
import { getStudentHomework, getTeacherHomework } from "@/lib/mock";
import type { Homework } from "@/lib/types";

export async function getHomeworkAssignments(): Promise<Homework[]> {
  const [student, teacher] = await Promise.all([
    getStudentHomework(),
    getTeacherHomework(),
  ]);
  const map = new Map<string, Homework>();
  [...student, ...teacher].forEach((h) => map.set(h.id, h));
  return Array.from(map.values());
}

export async function getHomeworkStatusByStudent(studentId: string) {
  const items = await getStudentHomework();
  return items.map((h) => ({
    homeworkId: h.id,
    studentId,
    status: h.status,
    completionRate: h.completionRate ?? 0,
  }));
}
