/**
 * Real Xano-backed student data provider (group base: `.../api:student-api`).
 *
 * Endpoint map (confirmed against the group's OpenAPI schema):
 *   - GET  dashboard-summary          → auth-required student profile + summary
 *   - GET  daily-class-timeline       → auth-required, array of today's sessions
 *   - GET  exams/active               → auth-required, array of active/upcoming exams
 *   - GET  student/homeworks          → public, ?student_id, array of assignments
 *                                       (publish status only — no per-student submission state)
 *   - GET  student/progress           → public, ?student_id, FLAT array of atom-bit progress
 *   - GET  learning-clinic            → auth-required (schema opaque)
 *   - GET  smart-review               → auth-required (schema opaque)
 *   - GET  learning-followups         → auth-required, array of follow-ups
 *   - GET  mentoring-followups        → auth-required, array of mentoring items
 *   - GET  pulse                      → auth-required, array of pulse reports
 *
 * Per the workspace OpenAPI spec, `student/progress` and `student/homeworks`
 * declare `security: []` (bearer not required) but REQUIRE a `student_id`
 * query param. We read the id from `atomia.auth.user_id` (persisted by
 * `auth.ts` on login) and pass it explicitly; `apiClient` will still attach
 * the bearer token, which the endpoints ignore harmlessly.
 *
 * KNOWN REAL GAPS (documented, NOT papered over):
 *   1. Homework submission status: the `status` field on `student/homeworks`
 *      is the teacher's PUBLISH status (draft/published/closed), NOT the
 *      student's submission state. There is no read endpoint that returns
 *      "has this student submitted homework X?". Submitting exists
 *      (POST student/homework/submit) but reading back submission state
 *      would require a new endpoint or a client-side cache of submitted ids.
 *      → We default every homework to `status: "assigned"`.
 *   2. Subjects list: there is NO dedicated "list subjects" endpoint in
 *      the `student-api` group. We derive a de-duplicated subject list
 *      from whatever the nested objects on `student/progress` records
 *      happen to expose at runtime; if nothing is present, we return `[]`.
 *      A real subjects endpoint would need to come from the `content` group.
 *
 * KNOWN XANO BUGS (server-side, flag to backend — parsed defensively here):
 *   - latest_checkup.percentage         → sometimes "0\n    date"
 *   - class_comparison.highest_average  → sometimes "0\n    rank"
 *   - smart_review.question_count       → sometimes "0\n    source"
 */

import type {
  AtomBit,
  ClassSession,
  Exam,
  ExamStatus,
  Homework,
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

async function studentGet<T = any>(
  path: string,
  query?: Record<string, string | number | undefined>,
): Promise<T | null> {
  const url = buildApiUrlFor("student", path);
  try {
    const res = await apiClient.get<T>(url, { query });
    return res.data;
  } catch (err) {
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

/**
 * Format a Xano timestamp (unix ms, unix seconds, or ISO string) into
 * "HH:MM" in the local timezone. Returns "" when unusable.
 */
function formatHHMM(v: unknown): string {
  if (v == null || v === "") return "";
  let d: Date | null = null;
  if (typeof v === "number") {
    // Heuristic: seconds vs ms
    d = new Date(v < 1e12 ? v * 1000 : v);
  } else if (typeof v === "string") {
    const n = Number(v);
    if (Number.isFinite(n)) d = new Date(n < 1e12 ? n * 1000 : n);
    else d = new Date(v);
  }
  if (!d || Number.isNaN(d.getTime())) return "";
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function formatDateISO(v: unknown): string {
  if (v == null || v === "") return "";
  let d: Date | null = null;
  if (typeof v === "number") d = new Date(v < 1e12 ? v * 1000 : v);
  else if (typeof v === "string") {
    const n = Number(v);
    if (Number.isFinite(n)) d = new Date(n < 1e12 ? n * 1000 : n);
    else d = new Date(v);
  }
  if (!d || Number.isNaN(d.getTime())) return "";
  return d.toISOString();
}

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

// ---- dashboard-summary cache ------------------------------------------

let cachedDashboardSummary: any = null;
async function getDashboardSummary(): Promise<any> {
  if (cachedDashboardSummary) return cachedDashboardSummary;
  const data = await studentGet<any>("dashboard-summary");
  cachedDashboardSummary = data ?? {};
  return cachedDashboardSummary;
}

export function resetStudentDataCache() {
  cachedDashboardSummary = null;
  cachedProgress = null;
}

export async function getDashboardSummaryRaw(): Promise<any> {
  return getDashboardSummary();
}

export async function isProfileIncomplete(): Promise<boolean> {
  const s = await getDashboardSummary();
  return Boolean(s?.profile_incomplete);
}

// ---- getCurrentStudent (dashboard-summary) ----------------------------

export async function getCurrentStudent(): Promise<Student> {
  const summary = await getDashboardSummary();
  const s = (summary?.student ?? {}) as any;

  return {
    id: firstString(s?.id, readStudentId()),
    name: firstString(s?.name) || "دانش‌آموز",
    role: "student",
    status: "active",
    joinedAt: "",
    classroomId: "",
    gradeId: firstString(s?.grade),
    major: (typeof s?.major === "string" && s.major) || undefined,
    guardianIds: [],
    supervisorId: undefined,
    email: undefined,
    avatarUrl: undefined,
  };
}

// ---- student/progress cache (shared by getAtomBits + getSubjects) ------

let cachedProgress: any[] | null = null;
async function getProgressRecords(): Promise<any[]> {
  if (cachedProgress) return cachedProgress;
  const studentId = readStudentId();
  if (studentId == null) {
    if (import.meta.env?.DEV) {
      // eslint-disable-next-line no-console
      console.warn("[student-api] student/progress: missing atomia.auth.user_id in localStorage; returning [].");
    }
    return [];
  }
  const data = await studentGet<any>("student/progress", {
    student_id: String(studentId),
  });
  // Real schema: FLAT array. Guard against wrapped `{ items: [...] }` too.
  const list = Array.isArray(data)
    ? data
    : toArray<any>((data as any)?.items ?? (data as any)?.records ?? []);
  cachedProgress = list;
  return list;
}

// ---- getSubjects (derived from progress records) ----------------------
//
// GAP: no dedicated subjects endpoint in `student-api`. We inspect the
// nested `chapter` / `section` / `atom` / `micro_atom` objects on each
// progress record at runtime — if any of them expose a subject id/name,
// we de-duplicate and return that. Otherwise `[]`.

export async function getSubjects(): Promise<Subject[]> {
  const records = await getProgressRecords();
  const seen = new Map<string, Subject>();
  for (const r of records) {
    const candidates = [r?.chapter, r?.section, r?.atom, r?.micro_atom];
    for (const c of candidates) {
      if (!c || typeof c !== "object") continue;
      const id = firstString(
        (c as any).subject_id,
        (c as any).subjectId,
        (c as any).subject?.id,
      );
      const name = firstString(
        (c as any).subject_name,
        (c as any).subject?.name,
      );
      if (id && !seen.has(id)) {
        seen.set(id, { id, name: name || id });
      }
    }
  }
  return Array.from(seen.values());
}

// ---- getAtomBits (flat student/progress) ------------------------------

export async function getAtomBits(): Promise<AtomBit[]> {
  const records = await getProgressRecords();
  return records.map((r: any, i: number): AtomBit => {
    const mastery = safeNumber(r?.mastery_percent) ?? 0;
    const progress = Math.max(0, Math.min(100, Math.round(mastery)));
    const status: AtomBit["status"] =
      progress >= 100 ? "mastered" : progress > 0 ? "in_progress" : "new";

    // `micro_atom` is nullable and typed as string in the schema, but Xano
    // often returns an expanded object at runtime — handle both.
    const microAtom = r?.micro_atom;
    let title = "";
    if (microAtom && typeof microAtom === "object") {
      title = firstString(
        (microAtom as any).title,
        (microAtom as any).name,
        (microAtom as any).label,
      );
    } else if (typeof microAtom === "string" && microAtom.trim()) {
      title = microAtom;
    }
    if (!title) title = "واحد یادگیری";

    // Try to resolve a subjectId from the nested objects; leave blank if
    // nothing is available (no direct subject_id on the record itself).
    let subjectId = "";
    for (const c of [r?.chapter, r?.section, r?.atom, r?.micro_atom]) {
      if (c && typeof c === "object") {
        subjectId = firstString(
          (c as any).subject_id,
          (c as any).subjectId,
          (c as any).subject?.id,
        );
        if (subjectId) break;
      }
    }

    return {
      id: firstString(r?.micro_atom_id, r?.id, `atom-${i}`),
      title,
      subjectId,
      level: 1, // no source field for this on progress records
      estimatedMinutes: Number(r?.study_minutes ?? 0) || 0,
      status,
      progress,
    };
  });
}

// ---- getTodaySessions (daily-class-timeline) --------------------------
//
// Real schema: flat array of session records with start_time/end_time as
// unix timestamps. Build the human-readable period string here.

export async function getTodaySessions(): Promise<ClassSession[]> {
  // Confirmed real shape: bare array at root (e.g. `[]` for a student with
  // no timetable yet). `Array.isArray(data) ? data : []` is sufficient.
  const data = await studentGet<any>("daily-class-timeline");
  const list = Array.isArray(data) ? data : [];
  return list.map((s: any, i: number): ClassSession => {
    const start = formatHHMM(s?.start_time);
    const end = formatHHMM(s?.end_time);
    const period = start && end ? `${start}-${end}` : start || end || firstString(s?.period_number);
    return {
      id: firstString(s?.id, `session-${i}`),
      classroomId: firstString(s?.classroom_id),
      subjectId: firstString(s?.subject_id),
      teacherId: firstString(s?.teacher_id),
      day: "امروز",
      period,
      date: (typeof s?.session_date === "string" && s.session_date) || undefined,
      status: "scheduled",
      topic: firstString(s?.lesson_title) || undefined,
    };
  });
}

// ---- getStudentHomework (student/homeworks) ---------------------------
//
// GAP: `status` here is the teacher's PUBLISH status (draft/published/
// closed), NOT the student's submission status. There is no read endpoint
// that returns per-student submission state. We default every row to
// "assigned". Submission itself is POST student/homework/submit; a real
// "did the student submit?" view would need either a new endpoint or a
// client-side cache of submitted homework ids after each POST.

export async function getStudentHomework(): Promise<Homework[]> {
  const studentId = readStudentId();
  if (studentId == null) {
    if (import.meta.env?.DEV) {
      // eslint-disable-next-line no-console
      console.warn("[student-api] student/homeworks: missing atomia.auth.user_id in localStorage; returning [].");
    }
    return [];
  }
  const data = await studentGet<any>("student/homeworks", {
    student_id: String(studentId),
  });
  const list = Array.isArray(data) ? data : toArray<any>((data as any)?.items);
  return list.map((h: any, i: number): Homework => {
    // `teacher` may be an expanded object at runtime; prefer its name if so.
    const teacher = h?.teacher;
    let assignedBy = "";
    if (teacher && typeof teacher === "object") {
      assignedBy = firstString(
        (teacher as any).name,
        (teacher as any).full_name,
        (teacher as any).id,
      );
    }
    if (!assignedBy) assignedBy = firstString(h?.teacher_id);

    return {
      id: firstString(h?.id, `hw-${i}`),
      title: firstString(h?.title) || "تکلیف",
      subjectId: firstString(h?.subject_id),
      classroomId: firstString(h?.classroom_id),
      assignedBy,
      dueDate: formatDateISO(h?.due_date) || firstString(h?.due_date),
      // KNOWN GAP: real submission status unavailable. Default only.
      status: "assigned",
      description: (h?.description as string) || undefined,
    };
  });
}

// ---- getStudentExams (exams/active) -----------------------------------

const EXAM_STATUSES: ExamStatus[] = ["upcoming", "active", "completed"];

export async function getStudentExams(): Promise<Exam[]> {
  // Confirmed real shape: bare array at root (e.g. `[]` for a student with
  // no active exams). `Array.isArray(data) ? data : []` is sufficient.
  const data = await studentGet<any>("exams/active");
  const list = Array.isArray(data) ? data : [];
  return list.map((e: any, i: number): Exam => {
    const raw = String(e?.status ?? "").toLowerCase();
    let status: ExamStatus;
    if (raw === "started") status = "active";
    else if (EXAM_STATUSES.includes(raw as ExamStatus)) status = raw as ExamStatus;
    else status = "upcoming";

    return {
      id: firstString(e?.id, `exam-${i}`),
      title: firstString(e?.title) || "آزمون",
      subjectId: firstString(e?.subject_id),
      classroomId: firstString(e?.classroom_id) || undefined,
      date: formatDateISO(e?.exam_date) || firstString(e?.exam_date),
      durationMinutes: Number(e?.duration_minutes ?? 0) || 0,
      status,
    };
  });
}

// ---- getStudentInsights (learning-clinic + smart-review) --------------
//
// Confirmed real shapes (from a test student with no history):
//   learning-clinic → {
//     success, summary, mistakes: [], weak_areas: [],
//     recommended_action: { title, message }
//   }
//   smart-review → {
//     success, available, source, question_count, questions: []
//   }
//
// Behavior:
//   - Map each `mistakes[]` entry to a "warning" insight. The per-item
//     field names are UNVERIFIED (the sample array was empty); the
//     firstString() fallbacks below are best-effort guesses that need
//     confirming once real data flows.
//   - When `mistakes` is empty but `recommended_action.title` exists,
//     surface it as a single "suggestion" insight — this endpoint always
//     returns some recommended_action, so it's a reliable fallback.
//   - Smart-review: skip entirely when `available === false` or
//     `questions` is empty. When present, map each item from `questions[]`
//     (confirmed field name, was previously guessed as items/recommendations).

export async function getStudentInsights(): Promise<LearningInsight[]> {
  const [clinic, review] = await Promise.all([
    studentGet<any>("learning-clinic"),
    studentGet<any>("smart-review"),
  ]);

  const out: LearningInsight[] = [];

  // learning-clinic → mistakes[] (item shape UNVERIFIED, sample was empty)
  const mistakes = toArray<any>(clinic?.mistakes);
  mistakes.slice(0, 5).forEach((m: any, i: number) => {
    const title = firstString(m?.title, m?.question_title, m?.subject) || "خطای یادگیری";
    const body = firstString(m?.explanation, m?.reason, m?.description, m?.summary);
    if (!body) return;
    out.push({
      id: firstString(m?.id, `mistake-${i}`),
      title,
      body,
      tone: "opportunity",
      audience: "student",
      source: "turbo",
    });
  });

  // learning-clinic → recommended_action (always-available fallback)
  if (mistakes.length === 0) {
    const action = clinic?.recommended_action;
    const title = firstString(action?.title);
    if (title) {
      const body = firstString(action?.message) || title;
      out.push({
        id: "clinic-recommended-action",
        title,
        body,
        tone: "suggestion",
        audience: "student",
        source: "turbo",
      });
    }
  }

  // smart-review → questions[] (confirmed field name). Respect `available`.
  if (review?.available !== false) {
    const questions = toArray<any>(review?.questions);
    questions.slice(0, 5).forEach((q: any, i: number) => {
      const title = firstString(q?.title, q?.subject) || "مرور هوشمند";
      const body = firstString(q?.prompt, q?.question_text, q?.text, q?.summary);
      if (!body) return;
      out.push({
        id: firstString(q?.id, `review-${i}`),
        title,
        body,
        tone: "opportunity",
        audience: "student",
        source: "turbo",
      });
    });
  }

  return out;
}

