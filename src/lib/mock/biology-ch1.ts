// TODO(xano): replace this mock module with real Xano API calls.
import { warnMock } from "./_warn";
warnMock("mock/biology-ch1");

/**
 * Atomia — Biology Grade 11 Experimental, Chapter 1.
 * First real educational content integrated into Atomia.
 * Hierarchy: Subject → Chapter → Goftar → Atom → MicroAtom → Question.
 * Doses and checkups persist to localStorage so the Grade Supervisor's
 * existing Student Monitoring Center can read the same records.
 */
import { useEffect, useState } from "react";

export interface Goftar {
  id: string;
  title: string;
  summary: string;
}
export interface Atom {
  id: string;
  goftarId: string;
  title: string;
}
export interface MicroAtom {
  id: string;
  atomId: string;
  title: string;
}
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

export const SUBJECT = {
  id: "bio-g11-exp",
  title: "زیست‌شناسی یازدهم تجربی",
};
export const CHAPTER = {
  id: "ch1",
  subjectId: "bio-g11-exp",
  number: 1,
  title: "فصل ۱: تنظیم عصبی",
};

export const GOFTARS: Goftar[] = [
  { id: "g1", title: "گفتار ۱: یاخته‌های بافت عصبی", summary: "نورون، انواع آن و پیام عصبی." },
  { id: "g2", title: "گفتار ۲: ساختار دستگاه عصبی", summary: "مغز، نخاع و وظایف هر بخش." },
  { id: "g3", title: "گفتار ۳: دستگاه عصبی محیطی", summary: "اعصاب پیکری و خودمختار." },
];

export const ATOMS: Atom[] = [
  { id: "a1", goftarId: "g1", title: "نورون و انواع آن" },
  { id: "a2", goftarId: "g1", title: "پتانسیل غشا" },
  { id: "a3", goftarId: "g2", title: "مغز و نخاع" },
  { id: "a4", goftarId: "g3", title: "اعصاب پیکری و خودمختار" },
];

export const MICRO_ATOMS: MicroAtom[] = [
  { id: "ma-1", atomId: "a1", title: "ساختار نورون" },
  { id: "ma-2", atomId: "a1", title: "انواع نورون" },
  { id: "ma-3", atomId: "a2", title: "پتانسیل آرامش" },
  { id: "ma-4", atomId: "a2", title: "پتانسیل عمل" },
  { id: "ma-5", atomId: "a3", title: "بصل‌النخاع و وظایف حیاتی" },
  { id: "ma-6", atomId: "a4", title: "سیناپس و انتقال پیام" },
];

export const QUESTIONS: Question[] = [
  { id: "q1", microAtomId: "ma-1", prompt: "وظیفه دندریت در نورون کدام است؟", options: ["انتقال پیام به نورون بعدی", "دریافت پیام از نورون دیگر", "ساخت میلین", "تولید انرژی"], correctIndex: 1 },
  { id: "q2", microAtomId: "ma-1", prompt: "غلاف میلین در دستگاه عصبی محیطی توسط کدام سلول‌ها ساخته می‌شود؟", options: ["نورون‌ها", "گلبول قرمز", "سلول‌های شوان", "ماهیچه"], correctIndex: 2 },
  { id: "q3", microAtomId: "ma-2", prompt: "نورون حسی پیام را به کدام سمت می‌برد؟", options: ["از CNS به ماهیچه", "از گیرنده به CNS", "بین دو نورون رابط", "بدون جهت"], correctIndex: 1 },
  { id: "q4", microAtomId: "ma-3", prompt: "در پتانسیل آرامش، داخل نورون نسبت به بیرون:", options: ["مثبت‌تر است", "منفی‌تر است", "هم‌بار است", "بدون بار است"], correctIndex: 1 },
  { id: "q5", microAtomId: "ma-4", prompt: "در فاز دپلاریزاسیون کدام یون وارد سلول می‌شود؟", options: ["پتاسیم", "کلسیم", "سدیم", "کلر"], correctIndex: 2 },
  { id: "q6", microAtomId: "ma-5", prompt: "بصل‌النخاع کنترل کدام مورد را بر عهده دارد؟", options: ["تعادل", "حافظه", "تنفس و ضربان قلب", "بینایی"], correctIndex: 2 },
  { id: "q7", microAtomId: "ma-6", prompt: "ناقل عصبی در کدام بخش ذخیره می‌شود؟", options: ["هسته", "وزیکول سیناپسی", "میتوکندری", "ریبوزوم"], correctIndex: 1 },
];

// ---------- helpers ----------
export function microAtomById(id: string) {
  return MICRO_ATOMS.find((m) => m.id === id);
}
export function atomById(id: string) {
  return ATOMS.find((a) => a.id === id);
}
export function goftarById(id: string) {
  return GOFTARS.find((g) => g.id === id);
}
export function microAtomsByAtom(atomId: string) {
  return MICRO_ATOMS.filter((m) => m.atomId === atomId);
}
export function atomsByGoftar(goftarId: string) {
  return ATOMS.filter((a) => a.goftarId === goftarId);
}
export function questionsByMicro(microId: string) {
  return QUESTIONS.filter((q) => q.microAtomId === microId);
}

// ---------- store ----------
// Study doses are now backed by Xano (see services/study-dose-service.ts).
// We keep a tiny in-memory cache so that synchronous getDoses() callers keep
// working. Callers should trigger refreshDosesFor(...) on mount.
// Checkups remain in localStorage until a Xano endpoint exists for them.
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
  } catch {}
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
    // Merge: replace entries for this student.
    const others = doseCache.filter((d) => d.studentId !== studentId);
    doseCache = [...others, ...fetched.map((d) => ({ ...d, studentId: d.studentId || studentId }))];
    notify();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("[atomia][study-dose] fetch failed", e);
  }
}

export async function addDose(entry: Omit<DoseEntry, "id" | "at">) {
  // Optimistic add for instant UI feedback.
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
    // Roll back optimistic entry on failure.
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
  return studentId ? doseCache.filter((d) => d.studentId === studentId) : doseCache;
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

/** Active student inside the student workspace (آرمان محمدی). */
export const STUDENT_ID = "s-001";

/** Seed demo doses/checkups for other students in the Monitoring Center. */
export function ensureSeed() {
  if (typeof window === "undefined") return;
  if (localStorage.getItem("atomia_bio_ch1_seeded_v2")) return;
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const doses: DoseEntry[] = [
    { id: "sd1", studentId: "s-001", microAtomId: "ma-1", minutes: 25, at: now - 4 * day },
    { id: "sd2", studentId: "s-001", microAtomId: "ma-3", minutes: 30, at: now - 2 * day },
    { id: "sd3", studentId: "s-002", microAtomId: "ma-4", minutes: 35, at: now - 1 * day },
    { id: "sd4", studentId: "s-003", microAtomId: "ma-2", minutes: 20, at: now - 3 * day },
    { id: "sd5", studentId: "s-004", microAtomId: "ma-5", minutes: 40, at: now - 1 * day },
    { id: "sd6", studentId: "s-004", microAtomId: "ma-6", minutes: 30, at: now - 2 * day },
    { id: "sd7", studentId: "s-006", microAtomId: "ma-3", minutes: 15, at: now - 5 * day },
  ];
  const checkups: CheckupResult[] = [
    { id: "sc1", studentId: "s-001", microAtomId: "ma-1", score: 50, total: 2, correct: 1, at: now - 3 * day },
    { id: "sc2", studentId: "s-002", microAtomId: "ma-4", score: 0, total: 1, correct: 0, at: now - 1 * day },
    { id: "sc3", studentId: "s-003", microAtomId: "ma-2", score: 100, total: 1, correct: 1, at: now - 2 * day },
    { id: "sc4", studentId: "s-004", microAtomId: "ma-5", score: 100, total: 1, correct: 1, at: now - 1 * day },
    { id: "sc5", studentId: "s-004", microAtomId: "ma-6", score: 100, total: 1, correct: 1, at: now - 2 * day },
    { id: "sc6", studentId: "s-006", microAtomId: "ma-3", score: 0, total: 1, correct: 0, at: now - 4 * day },
  ];
  save(DOSE_KEY, doses);
  save(CHECKUP_KEY, checkups);
  localStorage.setItem("atomia_bio_ch1_seeded_v2", "1");
}

/** Aggregated per-student summary used by the Grade Supervisor view. */
export function summarizeStudent(studentId: string) {
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
  const weak = MICRO_ATOMS.filter((m) => {
    const v = byMicro.get(m.id);
    return v && v.sum / v.n < 60;
  });

  return {
    doses,
    checkups,
    totalMinutes,
    doseCount: doses.length,
    latest,
    avg,
    weak,
    needsFollowUp: doses.length === 0 || (latest != null && latest.score < 60) || weak.length > 0,
  };
}
