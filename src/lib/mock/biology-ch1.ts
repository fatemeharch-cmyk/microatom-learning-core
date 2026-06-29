/**
 * Atomia MVP — Biology Grade 11 Experimental, Chapter 1.
 * Shared in-memory store for the vertical slice (student + grade supervisor).
 * Persists to localStorage so student actions show up in supervisor view.
 */
import { useEffect, useState } from "react";

export interface MicroAtom {
  id: string;
  title: string;
  section: string;
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

export const CHAPTER = {
  id: "bio-g11-exp-ch1",
  title: "زیست‌شناسی یازدهم تجربی — فصل ۱: تنظیم عصبی",
};

export const MICRO_ATOMS: MicroAtom[] = [
  { id: "ma-1", title: "ساختار نورون", section: "گفتار ۱" },
  { id: "ma-2", title: "پتانسیل آرامش", section: "گفتار ۱" },
  { id: "ma-3", title: "پتانسیل عمل", section: "گفتار ۲" },
  { id: "ma-4", title: "سیناپس و انتقال پیام", section: "گفتار ۲" },
  { id: "ma-5", title: "دستگاه عصبی مرکزی", section: "گفتار ۳" },
];

export const QUESTIONS: Question[] = [
  { id: "q1", microAtomId: "ma-1", prompt: "وظیفه دندریت در نورون کدام است؟", options: ["انتقال پیام به نورون بعدی", "دریافت پیام از نورون دیگر", "ساخت میلین", "تولید انرژی"], correctIndex: 1 },
  { id: "q2", microAtomId: "ma-1", prompt: "غلاف میلین توسط کدام سلول‌ها ساخته می‌شود؟", options: ["نورون‌ها", "گلبول قرمز", "سلول‌های شوان", "ماهیچه"], correctIndex: 2 },
  { id: "q3", microAtomId: "ma-2", prompt: "در پتانسیل آرامش، داخل نورون نسبت به بیرون:", options: ["مثبت‌تر است", "منفی‌تر است", "هم‌بار است", "بدون بار است"], correctIndex: 1 },
  { id: "q4", microAtomId: "ma-3", prompt: "در فاز دپلاریزاسیون کدام یون وارد سلول می‌شود؟", options: ["پتاسیم", "کلسیم", "سدیم", "کلر"], correctIndex: 2 },
  { id: "q5", microAtomId: "ma-4", prompt: "ناقل عصبی در کدام بخش ذخیره می‌شود؟", options: ["هسته", "وزیکول سیناپسی", "میتوکندری", "ریبوزوم"], correctIndex: 1 },
  { id: "q6", microAtomId: "ma-5", prompt: "بصل‌النخاع کنترل کدام مورد را بر عهده دارد؟", options: ["تعادل", "حافظه", "تنفس و ضربان قلب", "بینایی"], correctIndex: 2 },
];

const DOSE_KEY = "atomia_bio_ch1_doses";
const CHECKUP_KEY = "atomia_bio_ch1_checkups";

function load<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}
function save<T>(key: string, value: T[]) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

const listeners = new Set<() => void>();
function notify() {
  listeners.forEach((l) => l());
}

export function addDose(entry: Omit<DoseEntry, "id" | "at">) {
  const list = load<DoseEntry>(DOSE_KEY);
  list.push({ ...entry, id: `d-${Date.now()}`, at: Date.now() });
  save(DOSE_KEY, list);
  notify();
}
export function addCheckup(entry: Omit<CheckupResult, "id" | "at">) {
  const list = load<CheckupResult>(CHECKUP_KEY);
  list.push({ ...entry, id: `c-${Date.now()}`, at: Date.now() });
  save(CHECKUP_KEY, list);
  notify();
}
export function getDoses(): DoseEntry[] {
  return load<DoseEntry>(DOSE_KEY);
}
export function getCheckups(): CheckupResult[] {
  return load<CheckupResult>(CHECKUP_KEY);
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

// Demo students for supervisor view
export interface DemoStudent {
  id: string;
  name: string;
  className: string;
}
export const DEMO_STUDENTS: DemoStudent[] = [
  { id: "stu-arman", name: "آرمان کریمی", className: "یازدهم تجربی ۱" },
  { id: "stu-sara", name: "سارا احمدی", className: "یازدهم تجربی ۴" },
  { id: "stu-amir", name: "امیرحسین کاظمی", className: "یازدهم تجربی ۲" },
  { id: "stu-nika", name: "نیکا رضایی", className: "یازدهم تجربی ۱" },
  { id: "stu-mahsa", name: "مهسا نوری", className: "یازدهم تجربی ۱" },
];

// Seed a few demo records for other students so supervisor page isn't empty.
export function ensureSeed() {
  if (typeof window === "undefined") return;
  if (localStorage.getItem("atomia_bio_ch1_seeded")) return;
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const doses: DoseEntry[] = [
    { id: "sd1", studentId: "stu-sara", microAtomId: "ma-1", minutes: 20, at: now - 2 * day },
    { id: "sd2", studentId: "stu-amir", microAtomId: "ma-3", minutes: 35, at: now - 1 * day },
    { id: "sd3", studentId: "stu-nika", microAtomId: "ma-2", minutes: 25, at: now - 3 * day },
    { id: "sd4", studentId: "stu-mahsa", microAtomId: "ma-4", minutes: 40, at: now - 1 * day },
    { id: "sd5", studentId: "stu-mahsa", microAtomId: "ma-5", minutes: 30, at: now - 4 * day },
  ];
  const checkups: CheckupResult[] = [
    { id: "sc1", studentId: "stu-sara", microAtomId: "ma-1", score: 50, total: 2, correct: 1, at: now - 1 * day },
    { id: "sc2", studentId: "stu-amir", microAtomId: "ma-3", score: 40, total: 1, correct: 0, at: now - 1 * day },
    { id: "sc3", studentId: "stu-nika", microAtomId: "ma-2", score: 100, total: 1, correct: 1, at: now - 2 * day },
    { id: "sc4", studentId: "stu-mahsa", microAtomId: "ma-4", score: 100, total: 1, correct: 1, at: now - 1 * day },
    { id: "sc5", studentId: "stu-mahsa", microAtomId: "ma-5", score: 100, total: 1, correct: 1, at: now - 3 * day },
  ];
  save(DOSE_KEY, doses);
  save(CHECKUP_KEY, checkups);
  localStorage.setItem("atomia_bio_ch1_seeded", "1");
}
