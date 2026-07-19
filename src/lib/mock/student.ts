/**
 * Legacy student mock provider — retained for reference only.
 *
 * All exports now delegate to the real Xano-backed provider in
 * `@/lib/api/student-data`. The original hard-coded mock objects have
 * been removed; if you need the old sample data for offline dev, restore
 * it from git history (this file's pre-Xano revision).
 */
export {
  getCurrentStudent,
  getSubjects,
  getAtomBits,
  getTodaySessions,
  getStudentHomework,
  getStudentExams,
  getStudentInsights,
} from "@/lib/api/student-data";
