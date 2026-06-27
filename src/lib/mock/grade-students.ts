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
  const m = MONITORING.find((x) => x.id === id);
  if (m) return monitoringToProfile(m);
  const s = STUDENTS.find((x) => x.id === id);
  if (!s) return null;
  return DEFAULT_PROFILE(s);
}

// ============= Monitoring Center =============

export type RiskLevel = "high" | "mid" | "low";

export const RISK_META: Record<RiskLevel, { label: string; pill: string; dot: string }> = {
  high: { label: "ریسک بالا", pill: "bg-rose-50 text-rose-700 border-rose-100", dot: "bg-rose-500" },
  mid: { label: "ریسک متوسط", pill: "bg-amber-50 text-amber-700 border-amber-100", dot: "bg-amber-500" },
  low: { label: "ریسک کم", pill: "bg-emerald-50 text-emerald-700 border-emerald-100", dot: "bg-emerald-500" },
};

export type MonitoringGroup = "urgent" | "follow" | "stable";

export const GROUP_META: Record<
  MonitoringGroup,
  { title: string; subtitle: string; ring: string; chip: string; soft: string; dot: string }
> = {
  urgent: {
    title: "نیازمند اقدام فوری",
    subtitle: "دانش‌آموزانی که امروز باید سراغشان بروی",
    ring: "border-rose-100",
    chip: "bg-rose-50 text-rose-700 border-rose-100",
    soft: "from-rose-50/70 to-pink-50/40",
    dot: "bg-rose-500",
  },
  follow: {
    title: "نیازمند پیگیری",
    subtitle: "روند یادگیری نیازمند مراقبت است",
    ring: "border-amber-100",
    chip: "bg-amber-50 text-amber-700 border-amber-100",
    soft: "from-amber-50/70 to-yellow-50/40",
    dot: "bg-amber-500",
  },
  stable: {
    title: "وضعیت پایدار",
    subtitle: "روند رشد مثبت و پایدار",
    ring: "border-emerald-100",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-100",
    soft: "from-emerald-50/70 to-teal-50/40",
    dot: "bg-emerald-500",
  },
};

export type PrescriptionStatusLabel =
  | "نسخه انجام نشده"
  | "نیازمند بازبینی"
  | "نسخه فعال"
  | "نیازمند پیگیری"
  | "تکمیل شده";

export type MonitoringStudent = {
  id: string;
  name: string;
  className: string;
  avatarColor: string;
  group: MonitoringGroup;
  risk: RiskLevel;
  learningPulse: number;
  lastCheckup: number;
  missionsDone: number;
  missionsTotal: number;
  prescriptionStatus: PrescriptionStatusLabel;
  alerts: string[];
  nextAction: string;
  guardianRelation: string;
};

export const MONITORING: MonitoringStudent[] = [
  {
    id: "m-001",
    name: "سارا احمدی",
    className: "یازدهم تجربی ۴",
    avatarColor: "from-rose-100 to-pink-100",
    group: "urgent",
    risk: "high",
    learningPulse: 65,
    lastCheckup: 48,
    missionsDone: 2,
    missionsTotal: 5,
    prescriptionStatus: "نسخه انجام نشده",
    alerts: ["سه روز دوز مطالعه ثبت نشده", "دو چکاب ضعیف متوالی"],
    nextAction: "جلسه ۱۵ دقیقه‌ای با دانش‌آموز پیشنهاد می‌شود.",
    guardianRelation: "ارتباط منظم، نیازمند هماهنگی بیشتر",
  },
  {
    id: "m-002",
    name: "امیرحسین کاظمی",
    className: "یازدهم تجربی ۲",
    avatarColor: "from-orange-100 to-rose-100",
    group: "urgent",
    risk: "high",
    learningPulse: 69,
    lastCheckup: 52,
    missionsDone: 1,
    missionsTotal: 4,
    prescriptionStatus: "نیازمند بازبینی",
    alerts: ["ماموریت‌ها انجام نشده", "کاهش مشارکت در کلاس"],
    nextAction: "تماس با اولیا برای همراهی در دوز مطالعه پیشنهاد می‌شود.",
    guardianRelation: "ارتباط کم، نیازمند تماس",
  },
  {
    id: "m-003",
    name: "نیکا رضایی",
    className: "یازدهم تجربی ۱",
    avatarColor: "from-amber-100 to-yellow-100",
    group: "follow",
    risk: "mid",
    learningPulse: 74,
    lastCheckup: 63,
    missionsDone: 3,
    missionsTotal: 5,
    prescriptionStatus: "نسخه فعال",
    alerts: ["افت در مبحث نورون"],
    nextAction: "نسخه تقویتی زیست فعال شود.",
    guardianRelation: "ارتباط فعال و همراه",
  },
  {
    id: "m-004",
    name: "پارسا کریمی",
    className: "یازدهم تجربی ۳",
    avatarColor: "from-yellow-100 to-amber-100",
    group: "follow",
    risk: "mid",
    learningPulse: 72,
    lastCheckup: 60,
    missionsDone: 4,
    missionsTotal: 6,
    prescriptionStatus: "نیازمند پیگیری",
    alerts: ["دوز مطالعه نامنظم"],
    nextAction: "بازبینی برنامه هفتگی دوز مطالعه پیشنهاد می‌شود.",
    guardianRelation: "ارتباط معمول",
  },
  {
    id: "m-005",
    name: "آرمان محمدی",
    className: "یازدهم تجربی ۲",
    avatarColor: "from-emerald-100 to-teal-100",
    group: "stable",
    risk: "low",
    learningPulse: 84,
    lastCheckup: 78,
    missionsDone: 5,
    missionsTotal: 5,
    prescriptionStatus: "تکمیل شده",
    alerts: ["بدون هشدار جدی"],
    nextAction: "ادامه روند فعلی و تشویق پیشنهاد می‌شود.",
    guardianRelation: "ارتباط مستمر و سازنده",
  },
  {
    id: "m-006",
    name: "مهسا نوری",
    className: "یازدهم تجربی ۱",
    avatarColor: "from-teal-100 to-emerald-100",
    group: "stable",
    risk: "low",
    learningPulse: 88,
    lastCheckup: 81,
    missionsDone: 6,
    missionsTotal: 6,
    prescriptionStatus: "تکمیل شده",
    alerts: ["روند رشد مثبت"],
    nextAction: "ماموریت چالشی جدید برای حفظ انگیزه پیشنهاد می‌شود.",
    guardianRelation: "ارتباط بسیار خوب",
  },
];

export const MONITORING_SUMMARY = {
  urgent: 5,
  follow: 14,
  stable: 109,
  avgPulse: 78,
};

export type RiskPrediction = { subject: string; probability: number; level: RiskLevel };

function monitoringToProfile(m: MonitoringStudent): StudentProfile {
  const statusMap: Record<RiskLevel, StudentStatus> = { high: "risk", mid: "warning", low: "healthy" };
  return {
    id: m.id,
    name: m.name,
    className: m.className,
    avatarColor: m.avatarColor,
    healthScore: m.learningPulse,
    trend: m.risk === "low" ? 12 : m.risk === "mid" ? 4 : -6,
    status: statusMap[m.risk],
    guardian: "خانواده " + m.name.split(" ").slice(-1)[0],
    phone: "۰۹۱۲۳۴۵۶۷۸۹",
    joined: "مهر ۱۴۰۴",
    checkups: [
      { date: "۲۰ مهر", subject: "زیست — تنفس سلولی", score: Math.max(40, m.lastCheckup - 10) },
      { date: "۲۳ مهر", subject: "شیمی — استوکیومتری", score: Math.max(45, m.lastCheckup - 5) },
      { date: "۲۷ مهر", subject: "فیزیک — حرکت‌شناسی", score: Math.min(98, m.lastCheckup + 4) },
      { date: "۱ آبان", subject: "زیست — ژنتیک", score: m.lastCheckup },
    ],
    weakConcepts: [
      { title: "چرخه کربس", subject: "زیست", severity: "high" },
      { title: "موازنه واکنش‌ها", subject: "شیمی", severity: "mid" },
      { title: "بردار شتاب", subject: "فیزیک", severity: "low" },
    ],
    prescriptions: [
      { date: "۲۲ مهر", title: "۳ دوز مطالعه چرخه کربس + ویدیو توربو", status: m.prescriptionStatus === "تکمیل شده" ? "done" : "active" },
      { date: "۲۵ مهر", title: "نسخه تقویتی شیمی — تمرین موازنه", status: "active" },
      { date: "۱۸ مهر", title: "نسخه پایه زیست — مرور فصل ۱", status: "done" },
    ],
    missions: [
      { title: "حل ۲۰ تست ژنتیک مندلی", due: "۵ آبان", progress: Math.round((m.missionsDone / m.missionsTotal) * 100) },
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
  };
}

export function getMonitoringExtras(id: string): {
  nextAction: string;
  smartAlerts: string[];
  riskPredictions: RiskPrediction[];
  guardianRelation: string;
} {
  const m = MONITORING.find((x) => x.id === id);
  if (!m) {
    return {
      nextAction: "بازبینی روند هفتگی پیشنهاد می‌شود.",
      smartAlerts: ["سه روز دوز مطالعه ثبت نشده", "دو چکاب ضعیف متوالی", "نسخه فعال انجام نشده"],
      riskPredictions: [
        { subject: "زیست", probability: 78, level: "high" },
        { subject: "شیمی", probability: 42, level: "mid" },
        { subject: "ریاضی", probability: 23, level: "low" },
      ],
      guardianRelation: "ارتباط معمول",
    };
  }
  const base = m.risk === "high" ? 78 : m.risk === "mid" ? 55 : 25;
  const lvl = (n: number): RiskLevel => (n >= 70 ? "high" : n >= 40 ? "mid" : "low");
  const p2 = Math.max(20, base - 25);
  const p3 = Math.max(15, base - 45);
  return {
    nextAction: m.nextAction,
    smartAlerts: [
      ...m.alerts,
      m.prescriptionStatus === "نسخه انجام نشده" ? "نسخه فعال انجام نشده" : "نسخه فعال در حال پیگیری",
    ],
    riskPredictions: [
      { subject: "زیست", probability: base, level: lvl(base) },
      { subject: "شیمی", probability: p2, level: lvl(p2) },
      { subject: "ریاضی", probability: p3, level: lvl(p3) },
    ],
    guardianRelation: m.guardianRelation,
  };
}
