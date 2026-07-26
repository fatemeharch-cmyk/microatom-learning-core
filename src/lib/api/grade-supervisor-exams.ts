/**
 * Grade Supervisor — exam analytics data layer (real Xano only).
 *
 * These endpoints are being added to the `grade-supervisor` Xano group:
 *   GET /students/{student_id}/exams
 *   GET /students/{student_id}/exam-breakdown
 *   GET /exams/benchmarks
 *
 * Until they exist server-side, every helper degrades gracefully: a 404 /
 * 401 / malformed payload resolves to an empty result so the UI can render
 * a Persian empty state instead of crashing. No mock data is ever produced.
 */
import { GRADE_SUPERVISOR_BASE_URL } from "./config";
import { getAuthToken } from "./client";

export interface ExamAttemptRow {
  examId: string;
  attemptId: string;
  title: string;
  examType: string;
  examDate: string;
  subjectId: string;
  subjectName: string;
  chapterId: string;
  chapterName: string;
  questionCount: number;
  correct: number;
  wrong: number;
  unanswered: number;
  percentage: number | null;
  durationSeconds: number | null;
}

export interface ExamHistoryResult {
  exams: ExamAttemptRow[];
  available: boolean;
}

export interface BreakdownRow {
  id: string;
  name: string;
  examCount: number;
  avgPercentage: number | null;
  correct: number;
  wrong: number;
  unanswered: number;
  classAvgPercentage: number | null;
}

export interface ExamBreakdownResult {
  bySubject: BreakdownRow[];
  byChapter: BreakdownRow[];
  available: boolean;
}

export interface BenchmarkSubject {
  id: string;
  name: string;
  avgPercentage: number | null;
}

export interface BenchmarksResult {
  gradeAvgPercentage: number | null;
  classAvgPercentage: number | null;
  bySubject: BenchmarkSubject[];
  perExam: Record<string, number>;
  available: boolean;
}

/* ------------------------------- helpers ------------------------------- */

function num(...vals: unknown[]): number {
  for (const v of vals) {
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v.trim() !== "") {
      const n = Number(v.replace(/[^\d.\-]/g, ""));
      if (Number.isFinite(n)) return n;
    }
  }
  return 0;
}

function numOrNull(...vals: unknown[]): number | null {
  for (const v of vals) {
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v.trim() !== "") {
      const n = Number(v.replace(/[^\d.\-]/g, ""));
      if (Number.isFinite(n)) return n;
    }
  }
  return null;
}

function str(...vals: unknown[]): string {
  for (const v of vals) {
    if (typeof v === "string" && v.trim()) return v.trim();
    if (typeof v === "number" && Number.isFinite(v)) return String(v);
  }
  return "";
}

function asArray(v: unknown): unknown[] {
  return Array.isArray(v) ? v.filter((x) => x && typeof x === "object") : [];
}

function asObj(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : {};
}

/** GET against the grade-supervisor group with a single 429 retry. */
async function gsGet(
  path: string,
  query?: Record<string, string | number | undefined>,
): Promise<{ ok: boolean; status: number; body: unknown }> {
  const url = new URL(`${GRADE_SUPERVISOR_BASE_URL}${path}`);
  Object.entries(query ?? {}).forEach(([k, v]) => {
    if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
  });

  const token = getAuthToken();
  const doFetch = () =>
    fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

  let res: Response;
  try {
    res = await doFetch();
    if (res.status === 429) {
      await new Promise((r) => setTimeout(r, 1500));
      res = await doFetch();
    }
  } catch {
    return { ok: false, status: 0, body: null };
  }

  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  return { ok: res.ok, status: res.status, body };
}

/* ------------------------------ normalizers ----------------------------- */

function toAttemptRow(raw: unknown): ExamAttemptRow {
  const r = asObj(raw);
  const correct = num(r.correct, r.correct_count, r.correct_answers);
  const wrong = num(r.wrong, r.wrong_count, r.incorrect, r.incorrect_count);
  const unanswered = num(r.unanswered, r.unanswered_count, r.blank);
  const questionCount =
    num(r.question_count, r.total_questions, r.questions) ||
    correct + wrong + unanswered;
  let percentage = numOrNull(r.percentage, r.score_percentage, r.score);
  if (percentage === null && questionCount > 0) {
    percentage = Math.round((correct / questionCount) * 100);
  }
  return {
    examId: str(r.exam_id, r.id),
    attemptId: str(r.attempt_id),
    title: str(r.title, r.exam_title, r.name) || "آزمون",
    examType: str(r.exam_type, r.type),
    examDate: str(r.exam_date, r.date, r.created_at, r.taken_at),
    subjectId: str(r.subject_id),
    subjectName: str(r.subject_name, r.subject),
    chapterId: str(r.chapter_id),
    chapterName: str(r.chapter_name, r.chapter),
    questionCount,
    correct,
    wrong,
    unanswered,
    percentage,
    durationSeconds: numOrNull(r.duration_seconds, r.duration),
  };
}

function toBreakdownRow(raw: unknown): BreakdownRow {
  const r = asObj(raw);
  return {
    id: str(r.id, r.subject_id, r.chapter_id),
    name: str(r.name, r.subject_name, r.chapter_name, r.title) || "—",
    examCount: num(r.exam_count, r.count),
    avgPercentage: numOrNull(r.avg_percentage, r.average_percentage, r.percentage),
    correct: num(r.correct, r.correct_count),
    wrong: num(r.wrong, r.wrong_count, r.incorrect),
    unanswered: num(r.unanswered, r.unanswered_count),
    classAvgPercentage: numOrNull(
      r.class_avg_percentage,
      r.grade_avg_percentage,
      r.class_average,
    ),
  };
}

/* -------------------------------- readers -------------------------------- */

export async function getStudentExamHistory(
  studentId: string | number,
  opts?: { fromDate?: string; toDate?: string; subjectId?: string },
): Promise<ExamHistoryResult> {
  const { ok, body } = await gsGet(
    `/students/${encodeURIComponent(String(studentId))}/exams`,
    {
      from_date: opts?.fromDate,
      to_date: opts?.toDate,
      subject_id: opts?.subjectId,
    },
  );
  if (!ok) return { exams: [], available: false };

  const container = Array.isArray(body) ? body : asObj(body).exams;
  const exams = asArray(container).map(toAttemptRow);
  exams.sort((a, b) => (a.examDate > b.examDate ? 1 : a.examDate < b.examDate ? -1 : 0));
  return { exams, available: true };
}

export async function getStudentExamBreakdown(
  studentId: string | number,
): Promise<ExamBreakdownResult> {
  const { ok, body } = await gsGet(
    `/students/${encodeURIComponent(String(studentId))}/exam-breakdown`,
  );
  if (!ok) return { bySubject: [], byChapter: [], available: false };
  const o = asObj(body);
  return {
    bySubject: asArray(o.by_subject ?? o.subjects).map(toBreakdownRow),
    byChapter: asArray(o.by_chapter ?? o.chapters).map(toBreakdownRow),
    available: true,
  };
}

export async function getGradeBenchmarks(params: {
  gradeLevel: string;
  major: string;
  className?: string;
}): Promise<BenchmarksResult> {
  const { ok, body } = await gsGet("/exams/benchmarks", {
    grade_level: params.gradeLevel,
    major: params.major,
    class_name: params.className,
  });
  if (!ok) {
    return {
      gradeAvgPercentage: null,
      classAvgPercentage: null,
      bySubject: [],
      perExam: {},
      available: false,
    };
  }
  const o = asObj(body);
  const perExam: Record<string, number> = {};
  asArray(o.per_exam).forEach((raw) => {
    const r = asObj(raw);
    const id = str(r.exam_id, r.id);
    const avg = numOrNull(r.class_avg, r.grade_avg, r.avg_percentage);
    if (id && avg !== null) perExam[id] = avg;
  });
  return {
    gradeAvgPercentage: numOrNull(o.grade_avg_percentage, o.grade_average),
    classAvgPercentage: numOrNull(o.class_avg_percentage, o.class_average),
    bySubject: asArray(o.by_subject ?? o.subjects).map((raw) => {
      const r = asObj(raw);
      return {
        id: str(r.id, r.subject_id),
        name: str(r.name, r.subject_name) || "—",
        avgPercentage: numOrNull(r.avg_percentage, r.average_percentage),
      };
    }),
    perExam,
    available: true,
  };
}
