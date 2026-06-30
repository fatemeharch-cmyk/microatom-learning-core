// TODO(xano): Doses and Questions still live here.
// - Content hierarchy (Subject → Chapter → Goftar → Atom → MicroAtom) is now
//   served from Xano via `@/lib/services/content-service`.
// - Study Dose is wired to Xano via `@/lib/services/study-dose-service`.
// - Checkup questions remain local until a Xano endpoint exists.
import { warnMock } from "./_warn";
warnMock("mock/biology-ch1");

import { useEffect, useState } from "react";

export interface Question {
  id: string;
  microAtomId: string;
  prompt: string;
  options: string[];
  correctIndex: number;
}

export interface DoseEntry {
  id: string;
  studentId: string;
  microAtomId: string;
  minutes: number;
  at: number;
}
export interface CheckupResult {
  id: string;
  studentId: string;
  microAtomId: string;
  score: number; // 0-100
  total: number;
  correct: number;
  at: number;
}

/**
 * Local checkup question bank, keyed by micro-atom id. Until the Content
 * Engine exposes questions we fall back to a tiny shared pool so the
 * "شروع چکاب" flow keeps rendering regardless of which micro is loaded.
 */
const SHARED_QUESTIONS: Question[] = [
  {
    id: "shared-q1",
    microAtomId: "*",
    prompt: "کدام گزینه به مفهوم اصلی این میکرواتم نزدیک‌تر است؟",
    options: ["گزینه نادرست", "گزینه درست", "گزینه نامرتبط", "هیچ‌کدام"],
    correctIndex: 1,
  },
  {
    id: "shared-q2",
    microAtomId: "*",
    prompt: "بهترین تعریف برای این مفهوم کدام است؟",
    options: ["تعریف کلی", "تعریف دقیق", "تعریف نادرست", "تعریف ناقص"],
    correctIndex: 1,
  },
];

export function questionsByMicro(microId: string): Question[] {
  return SHARED_QUESTIONS.map((q) => ({ ...q, microAtomId: microId }));
}

// ---------- store ----------
const CHECKUP_KEY = "atomia_bio_ch1_checkups";

function load<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}
function save<T>(key: string, value: T[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

const listeners = new Set<() => void>();
function notify() {
  listeners.forEach((l) => l());
}

// --- doses cache (Xano-backed) ---
let doseCache: DoseEntry[] = [];

import {
  createStudyDose,
  listMyStudyDoses,
  listStudentStudyDoses,
} from "@/lib/services/study-dose-service";

export async function refreshDosesFor(studentId: string, mine = false) {
  try {
    const fetched = mine
      ? await listMyStudyDoses()
      : await listStudentStudyDoses(studentId);
    const others = doseCache.filter((d) => d.studentId !== studentId);
    doseCache = [
      ...others,
      ...fetched.map((d) => ({ ...d, studentId: d.studentId || studentId })),
    ];
    notify();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("[atomia][study-dose] fetch failed", e);
  }
}

export async function addDose(entry: Omit<DoseEntry, "id" | "at">) {
  const optimistic: DoseEntry = {
    ...entry,
    id: `tmp-${Date.now()}`,
    at: Date.now(),
  };
  doseCache = [...doseCache, optimistic];
  notify();
  try {
    const saved = await createStudyDose({
      microAtomId: entry.microAtomId,
      minutes: entry.minutes,
      studentId: entry.studentId,
    });
    doseCache = doseCache.map((d) =>
      d.id === optimistic.id
        ? { ...saved, studentId: saved.studentId || entry.studentId }
        : d,
    );
    notify();
  } catch (e) {
    doseCache = doseCache.filter((d) => d.id !== optimistic.id);
    notify();
    // eslint-disable-next-line no-console
    console.warn("[atomia][study-dose] create failed", e);
  }
}

export function addCheckup(entry: Omit<CheckupResult, "id" | "at">) {
  const list = load<CheckupResult>(CHECKUP_KEY);
  list.push({ ...entry, id: `c-${Date.now()}`, at: Date.now() });
  save(CHECKUP_KEY, list);
  notify();
}

export function getDoses(studentId?: string): DoseEntry[] {
  return studentId
    ? doseCache.filter((d) => d.studentId === studentId)
    : doseCache;
}
export function getCheckups(studentId?: string): CheckupResult[] {
  const all = load<CheckupResult>(CHECKUP_KEY);
  return studentId ? all.filter((c) => c.studentId === studentId) : all;
}

export function useBioCh1Tick() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const fn = () => setTick((x) => x + 1);
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  }, []);
}

/** Active student inside the student workspace. */
export const STUDENT_ID = "s-001";

/**
 * Aggregated per-student summary used by the Grade Supervisor view.
 * `micros` is optional metadata (from Xano) used to label weak concepts.
 */
export function summarizeStudent(
  studentId: string,
  micros: { id: string; title: string }[] = [],
) {
  const doses = getDoses(studentId);
  const checkups = getCheckups(studentId);
  const totalMinutes = doses.reduce((s, d) => s + d.minutes, 0);
  const latest = [...checkups].sort((a, b) => b.at - a.at)[0] ?? null;
  const avg =
    checkups.length === 0
      ? null
      : Math.round(checkups.reduce((s, c) => s + c.score, 0) / checkups.length);

  const byMicro = new Map<string, { sum: number; n: number }>();
  checkups.forEach((c) => {
    const cur = byMicro.get(c.microAtomId) ?? { sum: 0, n: 0 };
    cur.sum += c.score;
    cur.n += 1;
    byMicro.set(c.microAtomId, cur);
  });

  const weakIds = [...byMicro.entries()]
    .filter(([, v]) => v.sum / v.n < 60)
    .map(([id]) => id);
  const weak = weakIds.map((id) => {
    const found = micros.find((m) => m.id === id);
    return { id, title: found?.title ?? id };
  });

  return {
    doses,
    checkups,
    totalMinutes,
    doseCount: doses.length,
    latest,
    avg,
    weak,
    needsFollowUp:
      doses.length === 0 ||
      (latest != null && latest.score < 60) ||
      weak.length > 0,
  };
}
