import { WeeklySurvey, SurveyResponse, SurveySummary, SurveyAudience } from "./survey-types";

export const mockWeeklySurveys: Record<SurveyAudience, WeeklySurvey> = {
  student: {
    id: "survey-student-weekly",
    audience: "student",
    title: "بازتاب هفتگی شما",
    description: "با به اشتراک گذاشتن تجربیات هفتگی‌تان، به ما کمک کنید مسیر یادگیری شما را بهتر بسازیم.",
    questions: [
      {
        id: "q1",
        questionText: "این هفته چقدر از یادگیری خود راضی بودید؟",
        type: "rating",
      },
      {
        id: "q2",
        questionText: "درس‌های این هفته چقدر برایتان مفید بود؟",
        type: "rating",
      },
      {
        id: "q3",
        questionText: "دوست دارید هفته آینده روی چه موضوع‌هایی بیشتر تمرکز کنید؟",
        type: "text",
      },
    ],
  },
  teacher: {
    id: "survey-teacher-weekly",
    audience: "teacher",
    title: "بازخورد هفتگی مربی گرامی",
    description: "نظرات ارزشمند شما به ما کمک می‌کند کیفیت آموزش را ارتقا دهیم.",
    questions: [
      {
        id: "q1",
        questionText: "این هفته کلاس‌ها چقدر همراه و پربار بود؟",
        type: "rating",
      },
      {
        id: "q2",
        questionText: "چه ابزار یا روش تدریسی بیشترین تأثیر را داشت؟",
        type: "text",
      },
      {
        id: "q3",
        questionText: "پیشنهاد شما برای بهبود هفته آینده چیست؟",
        type: "text",
      },
    ],
  },
  parent: {
    id: "survey-parent-weekly",
    audience: "parent",
    title: "نظر سنجی هفتگی والدین گرامی",
    description: "با نظرات شما، ما می‌توانیم همراهی بهتری با فرزند دلبندتان داشته باشیم.",
    questions: [
      {
        id: "q1",
        questionText: "از پیشرفت فرزندتان در این هفته چقدر رضایت دارید؟",
        type: "rating",
      },
      {
        id: "q2",
        questionText: "چه موضوعی بیشترین تأثیر مثبت را روی فرزندتان داشت؟",
        type: "text",
      },
      {
        id: "q3",
        questionText: "پیشنهاد شما برای تقویت مسیر آموزشی چیست؟",
        type: "text",
      },
    ],
  },
};

export const mockSurveyResponses: SurveyResponse[] = [
  {
    surveyId: "survey-student-weekly",
    audience: "student",
    answers: { q1: 4, q2: 5, q3: "ریاضی و فیزیک" },
    submittedAt: new Date().toISOString(),
  },
  {
    surveyId: "survey-teacher-weekly",
    audience: "teacher",
    answers: { q1: 5, q2: "کار گروهی", q3: "برنامه‌های تعاملی بیشتر" },
    submittedAt: new Date().toISOString(),
  },
  {
    surveyId: "survey-parent-weekly",
    audience: "parent",
    answers: { q1: 4, q2: "فعالیت‌های هنری", q3: "تمرین‌های روزانه بیشتر" },
    submittedAt: new Date().toISOString(),
  },
];

export const mockSurveySummaries: Record<SurveyAudience, SurveySummary> = {
  student: {
    surveyId: "survey-student-weekly",
    audience: "student",
    totalResponses: 12,
    averages: { q1: 4.3, q2: 4.5 },
    highlights: ["ریاضی", "فیزیک", "علوم"],
  },
  teacher: {
    surveyId: "survey-teacher-weekly",
    audience: "teacher",
    totalResponses: 3,
    averages: { q1: 4.7 },
    highlights: ["کار گروهی", "تدریس تعاملی"],
  },
  parent: {
    surveyId: "survey-parent-weekly",
    audience: "parent",
    totalResponses: 8,
    averages: { q1: 4.2 },
    highlights: ["فعالیت‌های هنری", "برنامه ورزشی"],
  },
};
