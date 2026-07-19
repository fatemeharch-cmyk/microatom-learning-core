/**
 * Real Xano-backed student data provider.
 *
 * Replaces the legacy `src/lib/mock/student.ts` provider. UI code keeps
 * calling the same functions (`getCurrentStudent`, `getSubjects`, etc.);
 * this module fulfils them against the Xano `student-api` group.
 *
 * Endpoint map (confirmed in the Xano dashboard, group base URL
 * `.../api:student-api`):
 *   - GET  dashboard-summary          → auth-required student profile + summary
 *   - GET  student/dashboard          → public, needs ?student_id (fallback)
 *   - GET  daily-class-timeline       → auth-required today sessions
 *   - GET  exams/active               → auth-required active exams
 *   - GET  student/homeworks          → public, ?student_id
 *   - GET  student/progress           → public, ?student_id (AtomBits by subject/chapter)
 *   - GET  learning-clinic            → auth-required mistakes overview
 *   - GET  smart-review               → auth-required smart review
 *
 * Public endpoints require the caller to pass `student_id`; we read it
 * from the same localStorage key that `auth.ts` persists on login
 * (`atomia.auth.user_id`). Unknown / missing fields are left as sensible
 * defaults rather than fabricated — the domain types keep the truth.
 *
 * We picked `dashboard-summary` over `student/dashboard` as the primary
 * "current student" source: Xano's own description flags it as the real
 * replacement for mock values, it's auth-scoped (no id juggling), and
 * exposes more result fields (12 vs 6).
 */

import type {
  AtomBit,
  ClassSession,
  Exam,
  ExamStatus,
  Homework,
  HomeworkStatus,
  LearningInsight,
  Student,
  Subject,
} from "@/lib/types";
import { apiClient } from "./client";
import { buildApiUrlFor } from "./config";

// ---- helpers -----------------------------------------------------------

const USER_ID_STORAGE_KEY = "atomia.auth.user_id";

function readStudentId(): string | number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(USER_ID_STORAGE_KEY);
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : raw;
  } catch {
    return null;
  }
}

/** Convenience wrapper — student-api group + Bearer token from apiClient. */
async function studentGet<T = any>(
  path: string,
  query?: Record<string, string | number | undefined>,
): Promise<T | null> {
  const url = buildApiUrlFor("student", path);
  try {
    const res = await apiClient.get<T>(url, { query });
    return res.data;
  } catch (err) {
    // Swallow network/auth errors here so a single failed endpoint doesn't
    // take down the whole dashboard. Consumers get an empty result and can
    // render an appropriate empty state.
    if (import.meta.env?.DEV) {
      // eslint-disable-next-line no-console
      console.warn(`[student-api] ${path} failed:`, (err as Error)?.message);
    }
    return null;
  }
}

function firstString(...vals: unknown[]): string {
  for (const v of vals) {
    if (typeof v === "string" && v.trim()) return v;
    if (typeof v === "number") return String(v);
  }
  return "";
}

function toArray<T = any>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

// ---- getCurrentStudent (dashboard-summary) -----------------------------
//
// Real Xano `dashboard-summary` response shape (confirmed via Run & Debug):
//   {
//     success, profile_incomplete,
//     student: { id, name, grade, major },
//     learning_health: { score, trend_percentage },
//     today: { medical_history_completed, checkup_completed, mission_completed },
//     latest_checkup: { exists, id, title, percentage },
//     latest_exploration: { exists, id, title, subject_name, percentage, wrong_count, date },
//     today_mission: { exists, id, title, estimated_minutes, status },
//     next_school_exam: { exists, id, title, subject_name, exam_date },
//     weekly_study: { total_minutes, difference_minutes },
//     class_comparison: { student_average, highest_average, class_size },
//     weekly_trend: [],
//     smart_review: { available, question_count, message }
//   }
//
// The richer dashboard fields (learning_health, today, latest_checkup, etc.)
// don't map to our current domain types — kept intact on the cached summary
// and exposed via `getDashboardSummaryRaw()` / `isProfileIncomplete()` for
// consumers. A dedicated `DashboardSummary` domain type could be introduced
// later if a UI wants to render it.
//
// KNOWN XANO BUGS (server-side, flag to backend — parsed defensively here):
//   - latest_checkup.percentage         → sometimes "0\n    date"
//   - class_comparison.highest_average  → sometimes "0\n    rank"
//   - smart_review.question_count       → sometimes "0\n    source"
// These look like a broken formula concatenating a field name into a
// fallback. `safeNumber()` treats non-parseable strings as 0.

let cachedDashboardSummary: any = null;
async function getDashboardSummary(): Promise<any> {
  if (cachedDashboardSummary) return cachedDashboardSummary;
  const data = await studentGet<any>("dashboard-summary");
  cachedDashboardSummary = data ?? {};
  return cachedDashboardSummary;
}

/** Invalidate the in-memory cache (call on logout / user switch). */
export function resetStudentDataCache() {
  cachedDashboardSummary = null;
}

/** Raw dashboard-summary payload (for consumers that want the rich fields). */
export async function getDashboardSummaryRaw(): Promise<any> {
  return getDashboardSummary();
}

/** True when Xano signals the student hasn't completed their profile yet. */
export async function isProfileIncomplete(): Promise<boolean> {
  const s = await getDashboardSummary();
  return Boolean(s?.profile_incomplete);
}

/**
 * Defensively coerce a value to a finite number. Handles the Xano bug
 * where certain fields return strings like "0\n    date". Returns `null`
 * when the value can't be interpreted cleanly (caller decides fallback).
 */
export function safeNumber(v: unknown): number | null {
  if (v == null) return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v === "string") {
    const trimmed = v.trim().split(/\s+/)[0];
    const n = Number(trimmed);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export async function getCurrentStudent(): Promise<Student> {
  const summary = await getDashboardSummary();
  const s = (summary?.student ?? {}) as any;

  return {
    id: firstString(s?.id, readStudentId()),
    name: firstString(s?.name) || "دانش‌آموز",
    role: "student",
    status: "active",
    joinedAt: "",
    // Not present in dashboard-summary — left blank rather than fabricated.
    classroomId: "",
    gradeId: firstString(s?.grade),
    major: (typeof s?.major === "string" && s.major) || undefined,
    guardianIds: [],
    supervisorId: undefined,
    email: undefined,
    avatarUrl: undefined,
  };
}


// ---- getSubjects (derived from student/progress) -----------------------

export async function getSubjects(): Promise<Subject[]> {
  const studentId = readStudentId();
  if (studentId == null) return [];
  const data = await studentGet<any>("student/progress", {
    student_id: String(studentId),
  });
  const subjects = toArray<any>(data?.subjects ?? data?.by_subject ?? data);
  return subjects
    .map((s: any) => ({
      id: firstString(s?.id, s?.subject_id, s?.slug, s?.name),
      name: firstString(s?.name, s?.title, s?.label),
      color: (s?.color as string) || undefined,
    }))
    .filter((s: Subject) => s.id && s.name);
}

// ---- getAtomBits (student/progress) ------------------------------------

export async function getAtomBits(): Promise<AtomBit[]> {
  const studentId = readStudentId();
  if (studentId == null) return [];
  const data = await studentGet<any>("student/progress", {
    student_id: String(studentId),
  });

  // Response is expected to aggregate AtomBits by subject/chapter.
  // Try a few likely shapes; flatten whatever we can find.
  const rawList: any[] = [];
  const subjects = toArray<any>(data?.subjects ?? data?.by_subject);
  for (const subj of subjects) {
    const subjectId = firstString(subj?.id, subj?.subject_id, subj?.slug);
    const chapters = toArray<any>(subj?.chapters ?? subj?.units);
    for (const ch of chapters) {
      const bits = toArray<any>(ch?.atom_bits ?? ch?.micro_atoms ?? ch?.items);
      for (const bit of bits) rawList.push({ ...bit, __subjectId: subjectId });
    }
    // Also handle flat lists under the subject.
    const flat = toArray<any>(subj?.atom_bits ?? subj?.micro_atoms);
    for (const bit of flat) rawList.push({ ...bit, __subjectId: subjectId });
  }
  // Fully-flat fallback.
  if (rawList.length === 0) {
    for (const bit of toArray<any>(data?.atom_bits ?? data?.micro_atoms)) {
      rawList.push(bit);
    }
  }

  return rawList.map((b: any, i: number): AtomBit => {
    const progressRaw = Number(b?.progress ?? b?.mastery ?? b?.percent ?? 0);
    const progress = Number.isFinite(progressRaw)
      ? Math.max(0, Math.min(100, Math.round(progressRaw)))
      : 0;
    const status: AtomBit["status"] =
      b?.status === "mastered" || progress >= 100
        ? progress >= 100
          ? "completed"
          : "mastered"
        : progress > 0
          ? "in_progress"
          : "new";
    return {
      id: firstString(b?.id, b?.atom_id, b?.micro_atom_id, `atom-${i}`),
      title: firstString(b?.title, b?.name, b?.label) || "واحد یادگیری",
      subjectId: firstString(b?.subject_id, b?.__subjectId),
      level: Number(b?.level ?? b?.difficulty ?? 1) || 1,
      estimatedMinutes: Number(b?.estimated_minutes ?? b?.duration ?? 0) || 0,
      status,
      progress,
      tags: Array.isArray(b?.tags) ? b.tags.map(String) : undefined,
    };
  });
}

// ---- getTodaySessions (daily-class-timeline) ---------------------------

export async function getTodaySessions(): Promise<ClassSession[]> {
  const data = await studentGet<any>("daily-class-timeline");
  const list = toArray<any>(
    data?.sessions ?? data?.timeline ?? data?.items ?? data,
  );
  return list.map((s: any, i: number): ClassSession => ({
    id: firstString(s?.id, s?.session_id, `session-${i}`),
    classroomId: firstString(s?.classroom_id, s?.class_id),
    subjectId: firstString(s?.subject_id, s?.subject?.id),
    teacherId: firstString(s?.teacher_id, s?.teacher?.id),
    day: firstString(s?.day, s?.day_label) || "امروز",
    period: firstString(
      s?.period,
      s?.time,
      s?.start_time && s?.end_time ? `${s.start_time}-${s.end_time}` : "",
    ),
    date: (s?.date as string) || undefined,
    status: (s?.status as any) || "scheduled",
    topic: firstString(s?.topic, s?.subject?.name, s?.title) || undefined,
  }));
}

// ---- getStudentHomework (student/homeworks) ----------------------------

export async function getStudentHomework(): Promise<Homework[]> {
  const studentId = readStudentId();
  if (studentId == null) return [];
  const data = await studentGet<any>("student/homeworks", {
    student_id: String(studentId),
  });
  const list = toArray<any>(data?.homeworks ?? data?.items ?? data);
  return list.map((h: any, i: number): Homework => {
    const rawStatus = String(h?.status ?? h?.submission_status ?? "assigned");
    const status: HomeworkStatus = (
      ["assigned", "in_progress", "submitted", "reviewed"].includes(rawStatus)
        ? rawStatus
        : rawStatus === "done" || rawStatus === "completed"
          ? "submitted"
          : "assigned"
    ) as HomeworkStatus;
    return {
      id: firstString(h?.id, h?.homework_id, `hw-${i}`),
      title: firstString(h?.title, h?.name) || "تکلیف",
      subjectId: firstString(h?.subject_id, h?.subject?.id),
      classroomId: firstString(h?.classroom_id, h?.class_id),
      assignedBy: firstString(h?.assigned_by, h?.teacher_id, h?.teacher?.id),
      dueDate: firstString(h?.due_date, h?.deadline),
      status,
      description: (h?.description as string) || undefined,
    };
  });
}

// ---- getStudentExams (exams/active) ------------------------------------

export async function getStudentExams(): Promise<Exam[]> {
  const data = await studentGet<any>("exams/active");
  const list = toArray<any>(data?.exams ?? data?.items ?? data);
  return list.map((e: any, i: number): Exam => {
    const rawStatus = String(e?.status ?? "upcoming");
    const status: ExamStatus =
      rawStatus === "active" || rawStatus === "completed"
        ? (rawStatus as ExamStatus)
        : "upcoming";
    return {
      id: firstString(e?.id, e?.exam_id, `exam-${i}`),
      title: firstString(e?.title, e?.name) || "آزمون",
      subjectId: firstString(e?.subject_id, e?.subject?.id),
      classroomId: firstString(e?.classroom_id, e?.class_id) || undefined,
      date: firstString(e?.date, e?.start_at, e?.scheduled_at),
      durationMinutes: Number(e?.duration_minutes ?? e?.duration ?? 0) || 0,
      status,
    };
  });
}

// ---- getStudentInsights (learning-clinic + smart-review) ---------------

export async function getStudentInsights(): Promise<LearningInsight[]> {
  const [clinic, smart] = await Promise.all([
    studentGet<any>("learning-clinic"),
    studentGet<any>("smart-review"),
  ]);

  const out: LearningInsight[] = [];

  // Smart-review → suggestion tone (a personalized next step).
  const smartItems = toArray<any>(
    smart?.items ?? smart?.recommendations ?? smart?.review_items ?? [],
  );
  smartItems.slice(0, 3).forEach((it: any, i: number) => {
    out.push({
      id: firstString(it?.id, `smart-${i}`),
      title:
        firstString(it?.title, it?.topic, it?.name) || "پیشنهاد مرور هوشمند",
      body: firstString(it?.summary, it?.description, it?.reason) || "",
      tone: "suggestion",
      audience: "student",
      source: "turbo",
    });
  });

  // Learning-clinic → opportunity tone (mistakes to revisit).
  const clinicItems = toArray<any>(
    clinic?.items ?? clinic?.mistakes ?? clinic?.topics ?? [],
  );
  clinicItems.slice(0, 3).forEach((it: any, i: number) => {
    out.push({
      id: firstString(it?.id, `clinic-${i}`),
      title:
        firstString(it?.title, it?.topic, it?.name) || "فرصت یادگیری",
      body: firstString(it?.summary, it?.description, it?.reason) || "",
      tone: "opportunity",
      audience: "student",
      source: "turbo",
    });
  });

  return out;
}
