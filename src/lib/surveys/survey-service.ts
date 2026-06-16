import { SurveyAudience, WeeklySurvey, SurveyResponse, SurveySummary } from "./survey-types";
import { mockWeeklySurveys, mockSurveyResponses, mockSurveySummaries } from "./survey-mock";

export async function getWeeklySurvey(audience: SurveyAudience): Promise<WeeklySurvey> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return mockWeeklySurveys[audience];
}

export async function submitSurveyResponse(response: SurveyResponse): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  mockSurveyResponses.push({ ...response, submittedAt: new Date().toISOString() });
}

export async function getSurveySummary(audience: SurveyAudience): Promise<SurveySummary> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return mockSurveySummaries[audience];
}
