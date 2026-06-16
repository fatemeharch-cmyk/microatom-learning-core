/**
 * Growth Analytics — Type Definitions
 * Lightweight skeleton for future student growth dashboards and Turbo insights.
 */

/** A single measurable growth metric */
export interface GrowthMetric {
  id: string;
  label: string; // e.g. "مشارکت در کلاس", "پیشرفت مطالعاتی"
  value: number; // 0–100 or raw count
  unit: string; // e.g. "%", "بار", "ساعت"
  trend: "up" | "stable" | "upward";
  period: string; // e.g. "این هفته", "این ماه"
}

/** A point on the learning progress trend line */
export interface LearningProgressPoint {
  date: string; // ISO date
  score: number; // 0–100
  label: string; // e.g. "ریاضی — فصل ۳"
}

/** A topic the student is currently focusing on */
export interface FocusTopic {
  id: string;
  title: string;
  description: string;
  subject: string;
  progress: number; // 0–100
  encouragement: string;
}

/** A weekly signal highlighting a positive growth moment */
export interface WeeklyGrowthSignal {
  id: string;
  weekStart: string; // ISO date
  title: string;
  description: string;
  category: "engagement" | "mastery" | "consistency" | "curiosity";
}

/** Complete growth summary for a student */
export interface GrowthSummary {
  id: string;
  studentId: string;
  generatedAt: string;
  overallMessage: string; // Encouraging summary
  metrics: GrowthMetric[];
}
