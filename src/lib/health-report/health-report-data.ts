/**
 * Health Report — demo/static data.
 *
 * Structured to be swappable with Xano later. All fields map cleanly to
 * likely backend shapes (score / class_avg / top_score / status, etc.).
 */

export type CheckupStatus = "green" | "yellow" | "orange" | "red";

export interface HealthCheckup {
  id: string;
  subject: string; // درس
  topic: string; // مبحث
  score: number;
  classAverage: number;
  topScore: number;
  status: CheckupStatus;
  date: string;
}

export interface LearningPulse {
  current: number; // 0-100
  trend: "up" | "down" | "stable";
  weeklyDelta: number;
  label: string;
}

export interface StudyDoseSummary {
  todayMinutes: number;
  weekMinutes: number;
  monthMinutes: number;
  weeklyGoalMinutes: number;
}

export interface Concept {
  id: string;
  title: string;
  subject: string;
  masteryPercent: number;
}

export interface PrescriptionMission {
  id: string;
  title: string;
  dueLabel: string;
  done: boolean;
}

export interface ActivePrescription {
  id: string;
  issuedBy: string; // معلم / مشاور
  issuedAt: string;
  summary: string;
  missions: PrescriptionMission[];
}

export interface HealthReport {
  myScore: number;
  classAverage: number;
  topScore: number;
  myRank: number;
  classSize: number;
  pulse: LearningPulse;
  studyDose: StudyDoseSummary;
  checkups: HealthCheckup[];
  strengths: Concept[];
  needsCare: Concept[];
  prescription: ActivePrescription;
}

export const STATUS_LABELS: Record<CheckupStatus, string> = {
  green: "سالم",
  yellow: "مراقبت",
  orange: "کلینیک فعال",
  red: "اورژانس",
};

export const STATUS_STYLES: Record<CheckupStatus, string> = {
  green: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  yellow: "bg-amber-500/15 text-amber-600 border-amber-500/30",
  orange: "bg-orange-500/15 text-orange-600 border-orange-500/30",
  red: "bg-red-500/15 text-red-600 border-red-500/30",
};

export const demoHealthReport: HealthReport = {
  myScore: 82,
  classAverage: 71,
  topScore: 96,
  myRank: 5,
  classSize: 28,
  pulse: {
    current: 78,
    trend: "up",
    weeklyDelta: 6,
    label: "روند رو به رشد",
  },
  studyDose: {
    todayMinutes: 95,
    weekMinutes: 540,
    monthMinutes: 2180,
    weeklyGoalMinutes: 700,
  },
  checkups: [
    {
      id: "c1",
      subject: "زیست‌شناسی",
      topic: "یاخته و بافت",
      score: 88,
      classAverage: 72,
      topScore: 96,
      status: "green",
      date: "۲ تیر",
    },
    {
      id: "c2",
      subject: "شیمی",
      topic: "استوکیومتری",
      score: 74,
      classAverage: 68,
      topScore: 92,
      status: "yellow",
      date: "۲۹ خرداد",
    },
    {
      id: "c3",
      subject: "فیزیک",
      topic: "حرکت پرتابی",
      score: 61,
      classAverage: 70,
      topScore: 90,
      status: "orange",
      date: "۲۵ خرداد",
    },
    {
      id: "c4",
      subject: "ریاضی",
      topic: "معادلات درجه دو",
      score: 55,
      classAverage: 66,
      topScore: 88,
      status: "red",
      date: "۲۰ خرداد",
    },
  ],
  strengths: [
    { id: "s1", title: "ساختار یاخته", subject: "زیست‌شناسی", masteryPercent: 92 },
    { id: "s2", title: "قوانین نیوتون", subject: "فیزیک", masteryPercent: 87 },
    { id: "s3", title: "تناسب و درصد", subject: "ریاضی", masteryPercent: 85 },
  ],
  needsCare: [
    { id: "n1", title: "معادلات درجه دو", subject: "ریاضی", masteryPercent: 42 },
    { id: "n2", title: "حرکت پرتابی", subject: "فیزیک", masteryPercent: 48 },
    { id: "n3", title: "محاسبات مولی", subject: "شیمی", masteryPercent: 55 },
  ],
  prescription: {
    id: "rx-001",
    issuedBy: "استاد رضایی",
    issuedAt: "۳ تیر",
    summary:
      "تمرکز این هفته: تقویت معادلات درجه دو و مرور حرکت پرتابی. روزی ۲۰ دقیقه تمرین هدفمند کافی است.",
    missions: [
      { id: "m1", title: "حل ۱۰ تمرین معادلات درجه دو", dueLabel: "امروز", done: true },
      { id: "m2", title: "مرور ویدیوی حرکت پرتابی", dueLabel: "فردا", done: false },
      { id: "m3", title: "چکاب کوتاه شیمی — استوکیومتری", dueLabel: "پنج‌شنبه", done: false },
    ],
  },
};

export function formatMinutes(m: number): string {
  if (m < 60) return `${m} دقیقه`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r === 0 ? `${h} ساعت` : `${h} ساعت و ${r} دقیقه`;
}
