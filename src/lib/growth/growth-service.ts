/**
 * Growth Analytics — Service Layer
 * Mock async functions for growth summaries, focus topics, progress trends, and weekly signals.
 */

import type {
  GrowthSummary,
  FocusTopic,
  LearningProgressPoint,
  WeeklyGrowthSignal,
} from "./growth-types";
import {
  mockGrowthSummary,
  mockFocusTopics,
  mockLearningProgressTrend,
  mockWeeklyGrowthSignals,
} from "./growth-mock";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Fetch the growth summary for a student */
export async function getGrowthSummary(
  _studentId: string
): Promise<GrowthSummary> {
  await delay(400);
  return { ...mockGrowthSummary, studentId: _studentId };
}

/** Fetch the current focus topics for a student */
export async function getFocusTopics(
  _studentId: string
): Promise<FocusTopic[]> {
  await delay(400);
  return mockFocusTopics.map((t) => ({ ...t }));
}

/** Fetch the learning progress trend for a student */
export async function getLearningProgressTrend(
  _studentId: string
): Promise<LearningProgressPoint[]> {
  await delay(400);
  return mockLearningProgressTrend.map((p) => ({ ...p }));
}

/** Fetch the weekly growth signals for a student */
export async function getWeeklyGrowthSignals(
  _studentId: string
): Promise<WeeklyGrowthSignal[]> {
  await delay(400);
  return mockWeeklyGrowthSignals.map((s) => ({ ...s }));
}
