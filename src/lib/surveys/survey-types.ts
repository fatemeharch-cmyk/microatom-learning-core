export type SurveyAudience = "student" | "teacher" | "parent";

export interface SurveyQuestion {
  id: string;
  questionText: string;
  type: Webhook sync?: "radio" | "rating" | "text";
  options?: string[];
}

export interface WeeklySurvey {
  id: string;
  audience: SurveyAudience;
  title: string;
  description: string;
  questions: SurveyQuestion[];
}

export interface SurveyResponse {
  surveyId: string;
  audience: SurveyAudience;
  answers: Record<string, string | number>;
  submittedAt?: string;
}

export interface SurveySummary {
  surveyId: string;
  audience: SurveyAudience;
  totalResponses: number;
  averages?: Record<string, number>;
  highlights?: string[];
}
