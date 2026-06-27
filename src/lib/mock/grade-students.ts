/**
 * Mock students for the Grade Supervisor "Students" flow.
 * Persian demo data, medical learning theme.
 */

export type StudentStatus = "healthy" | "watch" | "warning" | "risk";

export const STATUS_META: Record<
  StudentStatus,
  { label: string; pill: string; dot: string }
> = {
  healthy: {
    label: "سالم",
    pill: "bg-emerald-50 text-emerald-700 border-emerald-100",
    dot: "bg-emerald-500",
  },
  watch: {
    label: "نیازمند مراقبت",
    pill: "bg-amber-50 text-amber-700 border-amber-100",
    dot: "bg-amber-500",
  },
  warning: {
    label: "هشدار",
    pill: "bg-orange-50 text-orange-700 border-orange-100",
    dot: "bg-orange-500",
  },
  risk: {
    label: "ریسک بالا",
    pill: "bg-rose-50 text-rose-700 border-rose-100",
    dot: "bg-rose-500",
  },
};

export type StudentRow = {
  id: string;
  name: string;
  className: string;
  healthScore: number;
  lastCheckup: string;
  status: StudentStatus;
  avatarColor: string;
};

export const CLASSES = [
  "یازدهم تجربی ۱",
  "یازدهم تجربی ۲",
  "یازدهم تجربی ۳",
  "یازدهم تجربی ۴",
];

export const STUDENTS: StudentRow[] = [
  { id: "s-001", name: "آرمان محمدی", className: "یازدهم تجربی ۱", healthScore: 58, lastCheckup: "۲۵ مهر", status: "risk", avatarColor: "from-rose-100 to-pink-100" },
  { id: "s-002", name: "نیکا رضایی", className: "یازدهم تجربی ۲", healthScore: 67, lastCheckup: "۲۶ مهر", status: "warning", avatarColor: "from-orange-100 to-amber-100" },
  { id: "s-003", name: "پارسا کریمی", className: "یازدهم تجربی ۱", healthScore: 74, lastCheckup: "۲۷ مهر", status: "watch", avatarColor: "from-amber-100 to-yellow-100" },
  { id: "s-004", name: "ملینا حسینی", className: "یازدهم تجربی ۳", healthScore: 88, lastCheckup: "۲۸ مهر", status: "healthy", avatarColor: "from-emerald-100 to-teal-100" },
  { id: "s-005", name: "سامیار جعفری", className: "یازدهم تجربی ۲", healthScore: 81, lastCheckup: "۲۸ مهر", status: "healthy", avatarColor: "from-violet-100 to-pink-100" },
  { id: "s-006", name: "هلیا مرادی", className: "یازدهم تجربی ۴", healthScore: 63, lastCheckup: "۲۹ مهر", status: "warning", avatarColor: "from-fuchsia-100 to-rose-100" },
  { id: "s-007", name: "رادین صادقی", className: "یازدهم تجربی ۳", healthScore: 71, lastCheckup: "۲۹ مهر", status: "watch", avatarColor: "from-sky-100 to-indigo-100" },
  { id: "s-008", name: "آوا یوسفی", className: "یازدهم تجربی ۱", healthScore: 92, lastCheckup: "۳۰ مهر", status: "healthy", avatarColor: "from-teal-100 to-emerald-100" },
  { id: "s-009", name: "بنیامین اکبری", className: "یازدهم تجربی ۴", healthScore: 55, lastCheckup: "۳۰ مهر", status: "risk", avatarColor: "from-red-100 to-rose-100" },
  { id: "s-010", name: "یاسمن قاسمی", className: "یازدهم تجربی ۲", healthScore: 79, lastCheckup: "۱ آبان", status: "watch", avatarColor: "from-purple-100 to-violet-100" },
  { id: "s-011", name: "محمدطاها نوری", className: "یازدهم تجربی ۳", healthScore: 84, lastCheckup: "۱ آبان", status: "healthy", avatarColor: "from-blue-100 to-cyan-100" },
  { id: "s-012", name: "ثنا بهرامی", className: "یازدهم تجربی ۱", healthScore: 69, lastCheckup: "۲ آبان", status: "warning", avatarColor: "from-pink-100 to-fuchsia-100" },
];

export type StudentProfile = {
  id: string;
  name: string;
  className: string;
  avatarColor: string;
  healthScore: number;
  trend: number;
  status: StudentStatus;
  guardian: string;
  phone: string;
  joined: string;
  checkups: { date: string; subject: string; score: number }[];
  weakConcepts: { title: string; subject: string; severity: "low" | "mid" | "high" }[];
  prescriptions: { date: string; title: string; status: "active" | "done" }[];
  missions: { title: string; due: string; progress: number }[];
  doseHistory: { date: string; minutes: number; subject: string }[];
  appointments: { date: string; with: string; topic: string }[];
  timeline: { date: string; label: string; kind: "checkup" | "prescription" | "mission" | "appointment" | "growth" }[];
};

const DEFAULT_PROFILE = (s: StudentRow): StudentProfile => ({
  id: s.id,
  name: s.name,
  className: s.className,
  avatarColor: s.avatarColor,
  healthScore: s.healthScore,
  trend: 12,
  status: s.status,
  guardian: "خانواده " + s.name.split(" ").slice(-1)[0],
  phone: "۰۹۱۲۳۴۵۶۷۸۹",
  joined: "مهر ۱۴۰۴",
  checkups: [
    { date: "۲۰ مهر", subject: "زیست — تنفس سلولی", score: 72 },
    { date: "۲۳ مهر", subject: "شیمی — استوکیومتری", score: 65 },
    { date: "۲۷ مهر", subject: "فیزیک — حرکت‌شناسی", score: 78 },
    { date: "۱ آبان", subject: "زیست — ژنتیک", score: 81 },
  ],
  weakConcepts: [
    { title: "چرخه کربس", subject: "زیست", severity: "high" },
    { title: "موازنه واکنش‌ها", subject: "شیمی", severity: "mid" },
    { title: "بردار شتاب", subject: "فیزیک", severity: "mid" },
    { title: "تقسیم میوز", subject: "زیست", severity: "low" },
  ],
  prescriptions: [
    { date: "۲۲ مهر", title: "۳ دوز مطالعه چرخه کربس + ویدیو توربو", status: "active" },
    { date: "۲۵ مهر", title: "نسخه تقویتی شیمی — تمرین موازنه", status: "active" },
    { date: "۱۸ مهر", title: "نسخه پایه زیست — مرور فصل ۱", status: "done" },
  ],
  missions: [
    { title: "حل ۲۰ تست ژنتیک مندلی", due: "۵ آبان", progress: 60 },
    { title: "خلاصه‌نویسی فصل تنفس", due: "۷ آبان", progress: 35 },
    { title: "آزمونک شیمی فصل ۲", due: "۹ آبان", progress: 10 },
  ],
  doseHistory: [
    { date: "۲۸ مهر", minutes: 95, subject: "زیست" },
    { date: "۲۹ مهر", minutes: 70, subject: "شیمی" },
    { date: "۳۰ مهر", minutes: 110, subject: "فیزیک" },
    { date: "۱ آبان", minutes: 60, subject: "زیست" },
    { date: "۲ آبان", minutes: 85, subject: "ریاضی" },
    { date: "۳ آبان", minutes: 100, subject: "زیست" },
  ],
  appointments: [
    { date: "۲۹ مهر — ۱۰:۳۰", with: "مسئول پایه", topic: "بررسی روند مطالعه زیست" },
    { date: "۵ آبان — ۱۲:۰۰", with: "دبیر شیمی", topic: "رفع اشکال موازنه" },
  ],
  timeline: [
    { date: "۲۰ مهر", label: "چکاب زیست", kind: "checkup" },
    { date: "۲۲ مهر", label: "نسخه تقویتی", kind: "prescription" },
    { date: "۲۵ مهر", label: "ماموریت تمرینی", kind: "mission" },
    { date: "۲۹ مهر", label: "قرار ملاقات", kind: "appointment" },
    { date: "۳ آبان", label: "رشد ۱۲٪", kind: "growth" },
  ],
});

export function getStudentProfile(id: string): StudentProfile | null {
  const s = STUDENTS.find((x) => x.id === id);
  if (!s) return null;
  return DEFAULT_PROFILE(s);
}
