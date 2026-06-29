// TODO(xano): replace this mock module with real Xano API calls.
import { warnMock } from "./_warn";
warnMock("mock/operations");

/**
 * Mock store for Grade Supervisor operational pages: classes, students,
 * pulse analyses, appointment slots. Structured to be swapped with real
 * API calls later — every reader/mutator returns a Promise and the
 * subscribe pattern lets pages re-render after writes.
 */
import { useEffect, useState } from "react";

// ---------- shared types ----------
export type ClassRow = {
  id: string;
  name: string;
  grade: string;
  major: string;
  studentCount: number;
};

export type PanelStatus = "active" | "pending" | "inactive";

export type StudentRow = {
  id: string;
  fullName: string;
  nationalId: string;
  classId: string;
  fatherPhone: string;
  motherPhone: string;
  studentPanel: PanelStatus;
  parentPanel: PanelStatus;
};

export type PulseAnalysis = {
  id: string;
  studentId: string;
  classId: string;
  subject: string;
  examTitle: string;
  createdAt: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
  recipe: string[];
  studentMessage: string;
  parentMessage: string;
};

export type AppointmentAudience = "student" | "parent" | "both";
export type AppointmentStatus = "available" | "booked";

export type AppointmentSlot = {
  id: string;
  date: string;            // ۱۴۰۵/۰۴/۰۸
  startTime: string;       // ۱۴:۰۰
  endTime: string;         // ۱۴:۳۰
  audience: AppointmentAudience;
  status: AppointmentStatus;
  bookedBy?: { role: "student" | "parent"; name: string };
};

// ---------- in-memory state ----------
const classes: ClassRow[] = [
  { id: "c1", name: "یازدهم تجربی ۱", grade: "یازدهم", major: "تجربی", studentCount: 32 },
  { id: "c2", name: "یازدهم تجربی ۲", grade: "یازدهم", major: "تجربی", studentCount: 30 },
  { id: "c3", name: "یازدهم تجربی ۳", grade: "یازدهم", major: "تجربی", studentCount: 34 },
  { id: "c4", name: "یازدهم تجربی ۴", grade: "یازدهم", major: "تجربی", studentCount: 32 },
];

const students: StudentRow[] = [
  { id: "s1", fullName: "آرمان محمدی", nationalId: "۰۰۲۳۴۵۶۷۸۹", classId: "c1", fatherPhone: "۰۹۱۲۱۲۳۴۵۶۷", motherPhone: "۰۹۱۲۷۶۵۴۳۲۱", studentPanel: "active", parentPanel: "active" },
  { id: "s2", fullName: "نیکا رضایی", nationalId: "۰۰۲۳۴۵۶۸۰۱", classId: "c1", fatherPhone: "۰۹۱۲۱۱۱۲۲۳۳", motherPhone: "۰۹۱۲۹۹۸۸۷۷۶", studentPanel: "active", parentPanel: "pending" },
  { id: "s3", fullName: "پرهام حسینی", nationalId: "۰۰۲۳۴۵۶۸۱۲", classId: "c2", fatherPhone: "۰۹۱۲۲۲۳۳۴۴۵", motherPhone: "۰۹۱۲۸۸۷۷۶۶۵", studentPanel: "pending", parentPanel: "inactive" },
  { id: "s4", fullName: "ساینا کریمی", nationalId: "۰۰۲۳۴۵۶۸۲۳", classId: "c2", fatherPhone: "۰۹۱۲۳۳۴۴۵۵۶", motherPhone: "۰۹۱۲۷۷۶۶۵۵۴", studentPanel: "active", parentPanel: "active" },
  { id: "s5", fullName: "مهدی صادقی", nationalId: "۰۰۲۳۴۵۶۸۳۴", classId: "c3", fatherPhone: "۰۹۱۲۴۴۵۵۶۶۷", motherPhone: "۰۹۱۲۶۶۵۵۴۴۳", studentPanel: "active", parentPanel: "active" },
  { id: "s6", fullName: "هلیا مرادی", nationalId: "۰۰۲۳۴۵۶۸۴۵", classId: "c4", fatherPhone: "۰۹۱۲۵۵۶۶۷۷۸", motherPhone: "۰۹۱۲۵۵۴۴۳۳۲", studentPanel: "active", parentPanel: "pending" },
];

const pulses: PulseAnalysis[] = [
  {
    id: "p1",
    studentId: "s1",
    classId: "c1",
    subject: "زیست‌شناسی",
    examTitle: "آزمون فصل ۲ — تنفس سلولی",
    createdAt: "۴ تیر ۱۴۰۵",
    score: 78,
    strengths: ["درک مفهومی چرخه کربس", "تحلیل نمودار زنجیره انتقال الکترون"],
    weaknesses: ["تفاوت تخمیر لاکتیکی و الکلی", "محاسبات تولید ATP"],
    recipe: [
      "۲ دوز مطالعه هدفمند روی فصل ۲ — بخش تخمیر",
      "حل ۱۵ سؤال هدفمند از آزمون‌های قبلی",
      "مرور خلاصه ویدئویی توربو (۸ دقیقه)",
    ],
    studentMessage:
      "نقطه قوت تو در درک مفهومی عالی است. با تمرین بیشتر روی تخمیر و محاسبات ATP می‌توانی نمره‌ات را به بالای ۹۰ برسانی.",
    parentMessage:
      "فرزند شما در بخش مفهومی عملکرد خوبی دارد. پیشنهاد می‌شود برای تمرین محاسبات، فضای آرام مطالعه فراهم کنید.",
  },
];

const appointments: AppointmentSlot[] = [
  { id: "a1", date: "۸ تیر ۱۴۰۵", startTime: "۱۰:۰۰", endTime: "۱۰:۳۰", audience: "student", status: "available" },
  { id: "a2", date: "۸ تیر ۱۴۰۵", startTime: "۱۰:۳۰", endTime: "۱۱:۰۰", audience: "parent", status: "available" },
  { id: "a3", date: "۹ تیر ۱۴۰۵", startTime: "۱۴:۰۰", endTime: "۱۴:۳۰", audience: "both", status: "booked", bookedBy: { role: "parent", name: "خانواده محمدی" } },
  { id: "a4", date: "۱۰ تیر ۱۴۰۵", startTime: "۹:۰۰", endTime: "۹:۳۰", audience: "student", status: "available" },
];

// ---------- subscribe pattern for re-renders ----------
type Listener = () => void;
const listeners = new Set<Listener>();
function emit() { listeners.forEach((l) => l()); }
export function useOperationsTick() {
  const [, setN] = useState(0);
  useEffect(() => {
    const l = () => setN((x) => x + 1);
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);
}

// ---------- classes ----------
export async function listClasses(): Promise<ClassRow[]> { return [...classes]; }
export async function createClass(input: Omit<ClassRow, "id">): Promise<ClassRow> {
  const row: ClassRow = { id: `c${Date.now()}`, ...input };
  classes.push(row); emit(); return row;
}

// ---------- students ----------
export async function listStudents(classId?: string): Promise<StudentRow[]> {
  return classId ? students.filter((s) => s.classId === classId) : [...students];
}

export type ImportSummary = { total: number; created: number; duplicates: number; errors: number };
export async function importStudents(rows: number): Promise<ImportSummary> {
  // demo simulation
  const created = Math.max(0, rows - 3);
  return { total: rows, created, duplicates: 2, errors: rows > created + 2 ? 1 : 0 };
}

// ---------- pulse ----------
export async function listPulsesByStudent(studentId: string): Promise<PulseAnalysis[]> {
  return pulses.filter((p) => p.studentId === studentId);
}
export async function analyzePulse(input: {
  studentId: string; classId: string; subject: string; examTitle: string;
}): Promise<PulseAnalysis> {
  const fresh: PulseAnalysis = {
    id: `p${Date.now()}`,
    ...input,
    createdAt: "امروز",
    score: 72 + Math.floor(Math.random() * 20),
    strengths: ["تسلط بر مفاهیم پایه", "دقت در پاسخ‌گویی به سؤالات مفهومی"],
    weaknesses: ["نیاز به تمرین بیشتر در سؤالات محاسباتی", "مرور بخش پایانی فصل"],
    recipe: ["۲ دوز مطالعه هدفمند", "حل ۱۰ سؤال انتخابی توربو", "بازبینی خلاصه فصل"],
    studentMessage:
      "عملکرد قابل قبولی داشتی. با تمرکز روی نقاط ضعف کوچک، می‌توانی به سطح بالاتری برسی.",
    parentMessage:
      "نتیجه عملکرد فرزند شما مثبت ارزیابی می‌شود. همراهی شما در زمان مطالعه می‌تواند سرعت رشد را افزایش دهد.",
  };
  pulses.unshift(fresh); emit(); return fresh;
}

// ---------- appointments ----------
export async function listAppointments(): Promise<AppointmentSlot[]> { return [...appointments]; }
export async function listAvailableAppointments(role: "student" | "parent"): Promise<AppointmentSlot[]> {
  return appointments.filter((a) =>
    a.status === "available" && (a.audience === role || a.audience === "both")
  );
}
export async function createAppointment(input: Omit<AppointmentSlot, "id" | "status" | "bookedBy">): Promise<AppointmentSlot> {
  const slot: AppointmentSlot = { id: `a${Date.now()}`, status: "available", ...input };
  appointments.push(slot); emit(); return slot;
}
export async function bookAppointment(id: string, by: { role: "student" | "parent"; name: string }):
  Promise<{ ok: true; slot: AppointmentSlot } | { ok: false; reason: string }> {
  const slot = appointments.find((a) => a.id === id);
  if (!slot) return { ok: false, reason: "این زمان دیگر در دسترس نیست." };
  if (slot.status === "booked") return { ok: false, reason: "این زمان قبلاً رزرو شده است." };
  slot.status = "booked"; slot.bookedBy = by; emit();
  return { ok: true, slot };
}
