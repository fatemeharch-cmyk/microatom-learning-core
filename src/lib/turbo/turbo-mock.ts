/**
 * Turbo Engine — Mock Data
 * Sample plans, insights, and actions for development & demo.
 */

import type {
  TurboDailyPlan,
  LearningInsight,
  NextBestAction,
} from "./turbo-types";

export const mockDailyPlan: TurboDailyPlan = {
  id: "plan-001",
  studentId: "student-001",
  date: "2026-06-16",
  items: [
    {
      id: "item-001",
      title: "مرور درس ریاضی",
      description: "تمرین‌های فصل ۳ را مرور کن و نکات مهم را یادداشت بگذار.",
      studyRange: {
        startHour: 8,
        endHour: 10,
        label: "صبح",
      },
      subject: "ریاضی",
      priority: "high",
      completed: false,
    },
    {
      id: "item-002",
      title: "خواندن داستان انگلیسی",
      description: "یک صفحه از کتاب داستان انگلیسی بخوان و لغات جدید را بنویس.",
      studyRange: {
        startHour: 10,
        endHour: 11,
        label: "صبح",
      },
      subject: "زبان انگلیسی",
      priority: "medium",
      completed: false,
    },
    {
      id: "item-003",
      title: "تمرین علوم تجربی",
      description: "آزمایش ساده فشار هوا را انجام بده و نتیجه را ثبت کن.",
      studyRange: {
        startHour: 16,
        endHour: 18,
        label: "عصر",
      },
      subject: "علوم تجربی",
      priority: "medium",
      completed: false,
    },
    {
      id: "item-004",
      title: "استراحت فعال",
      description: "کمی پیاده‌روی یا کشش بدن برای تجدید قوای ذهنی.",
      studyRange: {
        startHour: 14,
        endHour: 15,
        label: "بعد از ظهر",
      },
      subject: "تندرستی",
      priority: "low",
      completed: false,
    },
  ],
  generatedAt: "2026-06-16T06:00:00Z",
  message:
    "امروز فرصت خوبی برای تقویت مبانی ریاضی و کشف علوم است. با انرژی شروع کن!",
};

export const mockLearningInsight: LearningInsight = {
  id: "insight-001",
  studentId: "student-001",
  title: "تسلط خوب بر محاسبات ذهنی",
  description:
    "در حل مسائل سریع ریاضی، عملکرد قابل قبولی داری. ادامه تمرین باعث افزایش سرعت و اعتماد به نفس می‌شود.",
  subject: "ریاضی",
  strength: true,
  suggestedFocus: "حل مسائل چندمرحله‌ای با تمرکز بیشتر بر جزئیات",
  generatedAt: "2026-06-15T12:00:00Z",
};

export const mockNextBestAction: NextBestAction = {
  id: "action-001",
  studentId: "student-001",
  actionTitle: "تمرین نوشتاری خلاقانه",
  actionDescription:
    "یک پاراگراف دربارهٔ موضوع دلخواهت بنویس و سعی کن از صفات تازه استفاده کنی.",
  reason:
    "نوشتن خلاقانه به تقویت بیان و دقت زبانی کمک می‌کند و لذت‌بخش است.",
  subject: "زبان فارسی",
  expectedOutcome: "افزایش روان‌نویسی و یادگیری لغات جدید",
  suggestedRange: {
    startHour: 18,
    endHour: 19,
    label: "عصر",
  },
};
