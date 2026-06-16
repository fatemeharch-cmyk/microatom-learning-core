/**
 * Growth Analytics — Mock Data
 * Sample growth summaries, signals, focus topics, and progress trends.
 */

import type {
  GrowthSummary,
  FocusTopic,
  LearningProgressPoint,
  WeeklyGrowthSignal,
} from "./growth-types";

export const mockGrowthSummary: GrowthSummary = {
  id: "growth-001",
  studentId: "student-001",
  generatedAt: "2026-06-16T08:00:00Z",
  overallMessage:
    "این هفته پیشرفت خوبی داشتی. تمرکزت روی درک عمیق‌تر مفاهیم ریاضی قابل ستایش است. به همین روند ادامه بده!",
  metrics: [
    {
      id: "metric-001",
      label: "مشارکت در کلاس",
      value: 85,
      unit: "%",
      trend: "up",
      period: "این هفته",
    },
    {
      id: "metric-002",
      label: "پیشرفت مطالعاتی",
      value: 78,
      unit: "%",
      trend: "upward",
      period: "این هفته",
    },
    {
      id: "metric-003",
      label: "ساعت مطالعه فعال",
      value: 12,
      unit: "ساعت",
      trend: "stable",
      period: "این هفته",
    },
    {
      id: "metric-004",
      label: "تمرین‌های تکمیل‌شده",
      value: 24,
      unit: "بار",
      trend: "up",
      period: "این هفته",
    },
  ],
};

export const mockFocusTopics: FocusTopic[] = [
  {
    id: "focus-001",
    title: "معادلات درجه دو",
    description: "تمرکز فعلی روی حل معادلات درجه دو و درک ریشه‌ها",
    subject: "ریاضی",
    progress: 65,
    encouragement: "با تمرین بیشتر، حل این معادلات برایت روان‌تر می‌شود.",
  },
  {
    id: "focus-002",
    title: "خواندن متون علمی",
    description: "تقویت مهارت درک مطلب با متون علمی ساده",
    subject: "زبان انگلیسی",
    progress: 50,
    encouragement: "هر متن جدید دایرهٔ لغاتت را گسترش می‌دهد. ادامه بده!",
  },
  {
    id: "focus-003",
    title: "آزمایش‌های فیزیک پایه",
    description: "کشف مفاهیم نیرو و حرکت از طریق آزمایش",
    subject: "علوم تجربی",
    progress: 40,
    encouragement: "علم با کنجکاوی شروع می‌شود. سؤال بپرس و آزمایش کن!",
  },
];

export const mockLearningProgressTrend: LearningProgressPoint[] = [
  { date: "2026-05-19", score: 55, label: "ریاضی — فصل ۱" },
  { date: "2026-05-26", score: 62, label: "ریاضی — فصل ۲" },
  { date: "2026-06-02", score: 70, label: "ریاضی — فصل ۲" },
  { date: "2026-06-09", score: 75, label: "ریاضی — فصل ۳" },
  { date: "2026-06-16", score: 82, label: "ریاضی — فصل ۳" },
];

export const mockWeeklyGrowthSignals: WeeklyGrowthSignal[] = [
  {
    id: "signal-001",
    weekStart: "2026-06-09",
    title: "ثبات در مطالعه روزانه",
    description:
      "این هفته هر روز حداقل یک ساعت مطالعهٔ هدفمند داشتی. این عادت ارزشمند به رشد پایدارت کمک می‌کند.",
    category: "consistency",
  },
  {
    id: "signal-002",
    weekStart: "2026-06-09",
    title: "کنجکاوی در علوم",
    description:
      "سؤالات جالبی دربارهٔ فشار هوا پرسیدی. کنجکاوی تو نشان‌دهندهٔ یادگیری عمیق است.",
    category: "curiosity",
  },
  {
    id: "signal-003",
    weekStart: "2026-06-09",
    title: "مشارکت فعال در بحث کلاسی",
    description:
      "در بحث‌های گروهی این هفته حضور مؤثری داشتی. بیان نظرت به تقویت یادگیری کمک می‌کند.",
    category: "engagement",
  },
];
