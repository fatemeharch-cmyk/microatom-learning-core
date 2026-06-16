/**
 * Parent service — async layer over mock providers.
 */
import {
  getParentCalendar,
  getParentGrowthIndicators,
  getParentWeeklySummary as mockParentWeeklySummary,
  getParentMeetings,
  getParentCompanionSuggestions as mockCompanionSuggestions,
  getDashboardFor,
} from "@/lib/mock";

export async function getParentDashboard() {
  return getDashboardFor("parent");
}

export async function getChildCalendar(_childId?: string) {
  return getParentCalendar();
}

export async function getChildGrowthPath(_childId?: string) {
  return getParentGrowthIndicators();
}

export async function getParentWeeklySummary() {
  return mockParentWeeklySummary();
}

export async function getParentMentoringMeetings() {
  return getParentMeetings();
}

export async function getParentCompanionSuggestions() {
  return mockCompanionSuggestions();
}
