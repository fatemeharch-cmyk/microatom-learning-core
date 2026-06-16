/**
 * Turbo Engine — Service Layer
 * Mock async functions for daily plans, insights, and next best actions.
 */

import type {
  TurboDailyPlan,
  LearningInsight,
  NextBestAction,
} from "./turbo-types";
import {
  mockDailyPlan,
  mockLearningInsight,
  mockNextBestAction,
} from "./turbo-mock";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Fetch the daily plan for a student */
export async function getDailyPlan(
  _studentId: string
): Promise<TurboDailyPlan> {
  await delay(400);
  return { ...mockDailyPlan, studentId: _studentId };
}

/** Fetch a personalized learning insight for a student */
export async function getLearningInsight(
  _studentId: string
): Promise<LearningInsight> {
  await delay(400);
  return { ...mockLearningInsight, studentId: _studentId };
}

/** Fetch the next best recommended action for a student */
export async function getNextBestAction(
  _studentId: string
): Promise<NextBestAction> {
  await delay(400);
  return { ...mockNextBestAction, studentId: _studentId };
}
