/**
 * Exam service — aggregated exam reads.
 */
import { getStudentExams, getTeacherExams, getStudentInsights } from "@/lib/mock";
import type { Exam } from "@/lib/types";

export async function getExams(): Promise<Exam[]> {
  const [student, teacher] = await Promise.all([
    getStudentExams(),
    getTeacherExams(),
  ]);
  const map = new Map<string, Exam>();
  [...student, ...teacher].forEach((e) => map.set(e.id, e));
  return Array.from(map.values());
}

export async function getExamInsights(_studentId: string) {
  return getStudentInsights();
}
