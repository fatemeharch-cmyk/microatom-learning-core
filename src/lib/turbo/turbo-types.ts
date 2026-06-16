/**
 * Turbo Engine — Type Definitions
 * Lightweight planning skeleton for future AI-driven daily scheduling.
 */

/** A single item inside a student's daily plan */
export interface TurboPlanItem {
  id: string;
  title: string;
  description?: string;
  studyRange: StudyRange;
  subject: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
}

/** Range of time suggested for a task (flexible, not exact) */
export interface StudyRange {
  startHour: number; // 0–23
  endHour: number; // 0–23, exclusive
  label: string; // e.g. "صبح", "بعد از ظهر", "عصر"
}

/** A complete daily plan generated for a student */
export interface TurboDailyPlan {
  id: string;
  studentId: string;
  date: string; // ISO date
  items: TurboPlanItem[];
  generatedAt: string;
  message: string; // Encouraging summary
}

/** An insight about a student's learning pattern */
export interface LearningInsight {
  id: string;
  studentId: string;
  title: string;
  description: string;
  subject?: string;
  strength: boolean; // true = strength, false = growth area (worded positively)
  suggestedFocus: string;
  generatedAt: string;
}

/** The next recommended action for a student */
export interface NextBestAction {
  id: string;
  studentId: string;
  actionTitle: string;
  actionDescription: string;
  reason: string; // Why this action helps
  subject?: string;
  expectedOutcome: string;
  suggestedRange: StudyRange;
}
