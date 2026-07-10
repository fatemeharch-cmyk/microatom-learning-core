/**
 * Content service — wired to the Xano Content API group.
 *
 * Endpoints (Content group base URL — see api/config.ts):
 *   GET subjects
 *   GET subjects/{subject_id}/chapters
 *   GET chapters/{chapter_id}/goftars
 *   GET goftars/{goftar_id}/atoms
 *   GET atoms/{atom_id}/micro-atoms
 */
import { apiClient } from "@/lib/api/client";
import { buildApiUrlFor } from "@/lib/api/config";

const contentUrl = (path: string) => buildApiUrlFor("content", path);


export interface ContentSubject {
  id: string;
  title: string;
}
export interface ContentChapter {
  id: string;
  subjectId: string;
  title: string;
  number?: number;
}
export interface ContentGoftar {
  id: string;
  chapterId: string;
  title: string;
  summary?: string;
}
export interface ContentAtom {
  id: string;
  goftarId: string;
  title: string;
}
export interface ContentMicroAtom {
  id: string;
  atomId: string;
  title: string;
}
export interface ContentQuestion {
  id: string;
  microAtomId: string;
  questionText: string;
  questionType: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  difficulty: string;
  estimatedTime: number | null;
}

function s(v: unknown): string {
  return v == null ? "" : String(v);
}

function pickTitle(r: Record<string, unknown>): string {
  return s(
    r.title ??
      r.name ??
      (r as { title_fa?: unknown }).title_fa ??
      (r as { nameFa?: unknown }).nameFa ??
      (r as { fa?: unknown }).fa ??
      "",
  );
}

function pickSummary(r: Record<string, unknown>): string {
  return s(
    (r as { summary?: unknown }).summary ??
      (r as { description?: unknown }).description ??
      (r as { subtitle?: unknown }).subtitle ??
      "",
  );
}

function listFrom(payload: unknown): Record<string, unknown>[] {
  if (Array.isArray(payload)) return payload as Record<string, unknown>[];
  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    if (Array.isArray(obj.items)) return obj.items as Record<string, unknown>[];
    if (Array.isArray(obj.data)) return obj.data as Record<string, unknown>[];
    if (Array.isArray(obj.result)) return obj.result as Record<string, unknown>[];
  }
  return [];
}

export async function listSubjects(): Promise<ContentSubject[]> {
  const res = await apiClient.get<unknown>(contentUrl("subjects"));
  return listFrom(res.data).map((r) => ({ id: s(r.id), title: pickTitle(r) }));
}

export async function listChaptersBySubject(
  subjectId: string,
): Promise<ContentChapter[]> {
  const res = await apiClient.get<unknown>(
    contentUrl(`subjects/${encodeURIComponent(subjectId)}/chapters`),
  );
  return listFrom(res.data).map((r) => ({
    id: s(r.id),
    subjectId,
    title: pickTitle(r),
    number:
      typeof r.number === "number"
        ? (r.number as number)
        : typeof (r as { order?: unknown }).order === "number"
          ? ((r as { order: number }).order)
          : undefined,
  }));
}

export async function listGoftarsByChapter(
  chapterId: string,
): Promise<ContentGoftar[]> {
  const res = await apiClient.get<unknown>(
    contentUrl(`chapters/${encodeURIComponent(chapterId)}/goftars`),
  );
  return listFrom(res.data).map((r) => ({
    id: s(r.id),
    chapterId,
    title: pickTitle(r),
    summary: pickSummary(r),
  }));
}

export async function listAtomsByGoftar(
  goftarId: string,
): Promise<ContentAtom[]> {
  const res = await apiClient.get<unknown>(
    contentUrl(`goftars/${encodeURIComponent(goftarId)}/atoms`),
  );
  return listFrom(res.data).map((r) => ({
    id: s(r.id),
    goftarId,
    title: pickTitle(r),
  }));
}

export async function listMicroAtomsByAtom(
  atomId: string,
): Promise<ContentMicroAtom[]> {
  const res = await apiClient.get<unknown>(
    contentUrl(`atoms/${encodeURIComponent(atomId)}/micro-atoms`),
  );
  return listFrom(res.data).map((r) => ({
    id: s(r.id),
    atomId,
    title: pickTitle(r),
  }));
}

export async function listQuestionsByMicroAtom(
  microAtomId: string,
): Promise<ContentQuestion[]> {
  const res = await apiClient.get<unknown>(
    contentUrl(`micro-atoms/${encodeURIComponent(microAtomId)}/questions`),
  );
  const payload = res.data as { questions?: unknown } | null;
  const raw = Array.isArray(payload?.questions)
    ? (payload!.questions as Record<string, unknown>[])
    : [];
  return raw.map((r) => mapQuestion(r, microAtomId));
}

function mapQuestion(
  r: Record<string, unknown>,
  fallbackMicroAtomId?: string,
): ContentQuestion {
  const microAtomId = s(
    r.micro_atom_id ??
      (r as { microAtomId?: unknown }).microAtomId ??
      fallbackMicroAtomId ??
      "",
  );
  return {
    id: s(r.id),
    microAtomId,
    questionText: s(r.question_text ?? (r as { questionText?: unknown }).questionText),
    questionType: s(r.question_type ?? (r as { questionType?: unknown }).questionType),
    option1: s(r.option1),
    option2: s(r.option2),
    option3: s(r.option3),
    option4: s(r.option4),
    difficulty: s(r.difficulty),
    estimatedTime:
      typeof r.estimated_time === "number"
        ? (r.estimated_time as number)
        : typeof (r as { estimatedTime?: unknown }).estimatedTime === "number"
          ? ((r as { estimatedTime: number }).estimatedTime)
          : null,
  };
}

export interface QuestionBankFilters {
  subject_id?: string | number;
  chapter_id?: string | number;
  goftar_id?: string | number;
  atom_id?: string | number;
  micro_atom_id?: string | number;
  difficulty?: string;
  question_type?: string;
  count?: number;
}


export async function searchQuestionBank(
  filters: QuestionBankFilters,
): Promise<ContentQuestion[]> {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(filters)) {
    if (v === undefined || v === null) continue;
    const str = String(v).trim();
    if (str === "") continue;
    params.set(k, str);
  }
  const qs = params.toString();
  const path = qs ? `search?${qs}` : "search";
  const res = await apiClient.get<unknown>(
    buildApiUrlFor("question-bank", path),
  );
  const raw = listFrom(res.data);
  return raw.map((r) => mapQuestion(r));
}

export interface ExamSubmitResult {
  success: boolean;
  examId?: string;
  score: number;
  percentage: number;
  correctCount: number;
  wrongCount: number;
  blankCount: number;
  learningHealth?: number;
  learningHealthBefore?: number;
  learningHealthAfter?: number;
  learningHealthChange?: number;
  learningHealthIncreased?: boolean;
}


export async function submitExam(payload: {
  studentId: string;
  microAtomId?: string;
  answers: { questionId: string; answer: number | string }[];
}): Promise<ExamSubmitResult> {
  const body = {
    student_id: Number(payload.studentId),
    micro_atom_id: payload.microAtomId ? Number(payload.microAtomId) : null,
    answers: payload.answers.map((a) => ({
      question_id: Number(a.questionId),
      answer: a.answer,
    })),
  };
  const res = await apiClient.post<Record<string, unknown>>(
    buildApiUrlFor("content", "exam/submit"),
    body,
  );
  const d = (res.data ?? {}) as Record<string, unknown>;
  const numOr = (v: unknown): number | undefined => {
    if (v === null || v === undefined || v === "") return undefined;
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) ? n : undefined;
  };
  const num = (v: unknown) => numOr(v) ?? 0;
  const before = numOr(d.learning_health_before ?? d.health_before);
  const after = numOr(
    d.learning_health_after ??
      d.health_after ??
      d.learning_health ??
      d.learning_health_score,
  );
  const change = numOr(d.learning_health_change ?? d.health_change);
  const computedChange =
    change ??
    (before !== undefined && after !== undefined ? after - before : undefined);
  const increasedRaw = d.learning_health_increased;
  const increased =
    typeof increasedRaw === "boolean"
      ? increasedRaw
      : computedChange !== undefined
        ? computedChange > 0
        : undefined;
  return {
    success: Boolean(d.success),
    score: num(d.score),
    percentage: num(d.percentage),
    correctCount: num(d.correct_count ?? (d as { correctCount?: unknown }).correctCount),
    wrongCount: num(d.wrong_count ?? (d as { wrongCount?: unknown }).wrongCount),
    blankCount: num(d.blank_count ?? (d as { blankCount?: unknown }).blankCount),
    learningHealth: after,
    learningHealthBefore: before,
    learningHealthAfter: after,
    learningHealthChange: computedChange,
    learningHealthIncreased: increased,
  };
}

export interface SmartReviewResponse {
  available: boolean;
  message?: string;
  question_count?: number;
  questions: ContentQuestion[];
}

export async function getSmartReview(): Promise<SmartReviewResponse> {
  const res = await apiClient.get<Record<string, unknown>>(
    contentUrl("student/smart-review"),
  );
  const d = (res.data ?? {}) as Record<string, unknown>;
  const available = Boolean(d.available);
  const rawQs = Array.isArray(d.questions)
    ? (d.questions as Record<string, unknown>[])
    : [];
  return {
    available,
    message: typeof d.message === "string" ? (d.message as string) : undefined,
    question_count:
      typeof d.question_count === "number"
        ? (d.question_count as number)
        : undefined,
    questions: rawQs.map((r) => mapQuestion(r)),
  };
}

/** Find the Biology subject by Persian title heuristic, falling back to the first subject. */
export async function findBiologySubject(): Promise<ContentSubject | null> {
  const subjects = await listSubjects();
  const match = subjects.find((subj) => {
    const t = subj.title || "";
    return t.includes("زیست") || t.toLowerCase().includes("biology");
  });
  return match ?? subjects[0] ?? null;
}

/** Aggregate every micro-atom under a chapter (used by the supervisor profile). */
export async function listAllMicroAtomsForChapter(
  chapterId: string,
): Promise<ContentMicroAtom[]> {
  const goftars = await listGoftarsByChapter(chapterId);
  const atomsArrs = await Promise.all(
    goftars.map((g) => listAtomsByGoftar(g.id)),
  );
  const atoms = atomsArrs.flat();
  const microsArrs = await Promise.all(
    atoms.map((a) => listMicroAtomsByAtom(a.id)),
  );
  return microsArrs.flat();
}

// ---------------------------------------------------------------------------
// Daily check-in & daily mission (student home page)
// ---------------------------------------------------------------------------

export interface DailyCheckin {
  id?: string | number;
  student_id?: number;
  checkin_date?: string;
  sleep_hours?: number;
  mood?: string;
  focus?: number;
  stress?: number;
  energy?: number;
  note?: string;
  [k: string]: unknown;
}

export interface DailyMission {
  id: string;
  studentId: string;
  missionDate: string;
  goftarId: string;
  title: string;
  targetMinutes: number;
  minutesDone: number;
  isComplete: boolean;
}

export async function getTodayCheckin(
  studentId: string,
  date: string,
): Promise<{ exists: boolean; checkin: DailyCheckin | null }> {
  const qs = new URLSearchParams({
    student_id: String(studentId),
    date,
  }).toString();
  const res = await apiClient.get<Record<string, unknown>>(
    contentUrl(`daily-checkin/today?${qs}`),
  );
  const d = (res.data ?? {}) as Record<string, unknown>;
  const checkin = (d.checkin ?? null) as DailyCheckin | null;
  return { exists: Boolean(d.exists), checkin };
}

export async function submitCheckin(payload: {
  studentId: string;
  date: string;
  sleepHours?: number;
  mood?: string;
  focus?: number;
  stress?: number;
  energy?: number;
  note?: string;
}): Promise<DailyCheckin> {
  const body: Record<string, unknown> = {
    student_id: Number(payload.studentId),
    checkin_date: payload.date,
  };
  if (payload.sleepHours !== undefined) body.sleep_hours = payload.sleepHours;
  if (payload.mood !== undefined) body.mood = payload.mood;
  if (payload.focus !== undefined) body.focus = payload.focus;
  if (payload.stress !== undefined) body.stress = payload.stress;
  if (payload.energy !== undefined) body.energy = payload.energy;
  if (payload.note !== undefined) body.note = payload.note;
  const res = await apiClient.post<DailyCheckin>(
    contentUrl("daily-checkin/submit"),
    body,
  );
  return (res.data ?? {}) as DailyCheckin;
}

function mapMission(r: Record<string, unknown>): DailyMission {
  const num = (v: unknown) => (typeof v === "number" ? v : Number(v) || 0);
  return {
    id: s(r.id),
    studentId: s(r.student_id ?? (r as { studentId?: unknown }).studentId),
    missionDate: s(r.mission_date ?? (r as { missionDate?: unknown }).missionDate),
    goftarId: s(r.goftar_id ?? (r as { goftarId?: unknown }).goftarId),
    title: s(r.title),
    targetMinutes: num(r.target_minutes ?? (r as { targetMinutes?: unknown }).targetMinutes),
    minutesDone: num(r.minutes_done ?? (r as { minutesDone?: unknown }).minutesDone),
    isComplete: Boolean(r.is_complete ?? (r as { isComplete?: unknown }).isComplete),
  };
}

export async function getTodayMission(
  studentId: string,
  date: string,
): Promise<DailyMission> {
  const qs = new URLSearchParams({
    student_id: String(studentId),
    date,
  }).toString();
  const res = await apiClient.get<Record<string, unknown>>(
    contentUrl(`daily-mission/today?${qs}`),
  );
  return mapMission((res.data ?? {}) as Record<string, unknown>);
}

export async function updateMissionProgress(
  missionId: string,
  minutesDone: number,
): Promise<DailyMission> {
  const res = await apiClient.post<Record<string, unknown>>(
    contentUrl("daily-mission/update-progress"),
    { mission_id: Number(missionId), minutes_done: Number(minutesDone) },
  );
  return mapMission((res.data ?? {}) as Record<string, unknown>);
}
