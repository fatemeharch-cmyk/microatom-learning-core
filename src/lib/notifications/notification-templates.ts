/**
 * Persian notification templates.
 *
 * Supportive, growth-oriented wording. Each template returns a title and
 * body for a given event payload. Keep tone warm and avoid negative phrasing
 * — these strings surface in student, parent and teacher inboxes.
 */

import type {
  ClassLoggedPayload,
  ExamCreatedPayload,
  ExamResultPublishedPayload,
  HomeworkCreatedPayload,
  MentoringSessionCompletedPayload,
  MentoringSessionCreatedPayload,
  StudentAbsenceRecordedPayload,
  WeeklyFeedbackSubmittedPayload,
  DailyPlanGeneratedPayload,
} from "@/lib/events/event-types";

export interface RenderedNotification {
  title: string;
  body: string;
}

export const notificationTemplates = {
  class_logged: (p: ClassLoggedPayload): RenderedNotification => ({
    title: "گزارش کلاس امروز ثبت شد",
    body: `یک جلسه با ${p.topicsCovered.length} سرفصل آموزشی برای کلاس شما ثبت شد.`,
  }),
  homework_created: (p: HomeworkCreatedPayload): RenderedNotification => ({
    title: "تکلیف تازه‌ای برای شما آماده شد",
    body: `«${p.title}» تا تاریخ ${new Date(p.dueAt).toLocaleDateString("fa-IR")} برای انجام در نظر گرفته شده است.`,
  }),
  exam_created: (p: ExamCreatedPayload): RenderedNotification => ({
    title: "آزمون جدید برنامه‌ریزی شد",
    body: `«${p.title}» برای ${new Date(p.scheduledFor).toLocaleDateString("fa-IR")} زمان‌بندی شد. با آرامش آماده شوید.`,
  }),
  exam_result_published: (p: ExamResultPublishedPayload): RenderedNotification => ({
    title: "نتایج آزمون منتشر شد",
    body: `نتایج آزمون برای ${p.studentIds.length} دانش‌آموز در دسترس قرار گرفت.`,
  }),
  mentoring_session_created: (p: MentoringSessionCreatedPayload): RenderedNotification => ({
    title: "جلسه همراهی برنامه‌ریزی شد",
    body: `یک جلسه همراهی برای ${new Date(p.scheduledFor).toLocaleString("fa-IR")} تنظیم شد.`,
  }),
  mentoring_session_completed: (p: MentoringSessionCompletedPayload): RenderedNotification => ({
    title: "جلسه همراهی به پایان رسید",
    body: p.followUpRequired
      ? "خلاصه جلسه آماده است و یک گام بعدی برای پیگیری در نظر گرفته شده."
      : "خلاصه جلسه آماده مشاهده است.",
  }),
  weekly_feedback_submitted: (p: WeeklyFeedbackSubmittedPayload): RenderedNotification => ({
    title: "بازخورد هفتگی ثبت شد",
    body: `بازخورد هفته منتهی به ${new Date(p.weekOf).toLocaleDateString("fa-IR")} برای مرور آماده است.`,
  }),
  student_absence_recorded: (_p: StudentAbsenceRecordedPayload): RenderedNotification => ({
    title: "یادداشت حضور به‌روزرسانی شد",
    body: "یک یادداشت حضور برای جلسه امروز ثبت شد. در صورت نیاز با مدرسه هماهنگ شوید.",
  }),
  daily_plan_generated: (p: DailyPlanGeneratedPayload): RenderedNotification => ({
    title: "برنامه امروز آماده شد",
    body: `برنامه یادگیری امروز برای ${new Date(p.forDate).toLocaleDateString("fa-IR")} توسط ${
      p.generatedBy === "turbo" ? "Turbo AI" : p.generatedBy === "supervisor" ? "مسئول پایه" : "دبیر"
    } آماده شد.`,
  }),
};

export type NotificationTemplates = typeof notificationTemplates;
