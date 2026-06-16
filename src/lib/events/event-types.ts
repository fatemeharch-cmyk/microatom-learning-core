/**
 * Atomia domain event types.
 *
 * Typed payloads for every event the platform can emit. Services dispatch
 * these onto the event bus and the notification engine maps them to
 * role-based notifications. No real network or backend calls happen yet —
 * this is the contract that future Turbo AI / Xano handlers will implement.
 */

import type { RoleId } from "@/lib/roles";

export type AtomiaEventName =
  | "class_logged"
  | "homework_created"
  | "exam_created"
  | "exam_result_published"
  | "mentoring_session_created"
  | "mentoring_session_completed"
  | "weekly_feedback_submitted"
  | "student_absence_recorded"
  | "daily_plan_generated";

export interface BaseEventMeta {
  /** Stable id so handlers can de-duplicate */
  id: string;
  /** ISO timestamp of when the event was emitted */
  emittedAt: string;
  /** Role that triggered the event, when known */
  actorRole?: RoleId;
  /** Free-form correlation id for tracing across services */
  correlationId?: string;
}

export interface ClassLoggedPayload {
  classroomId: string;
  subjectId: string;
  teacherId: string;
  sessionDate: string;
  topicsCovered: string[];
  studentIds: string[];
}

export interface HomeworkCreatedPayload {
  homeworkId: string;
  classroomId: string;
  subjectId: string;
  teacherId: string;
  dueAt: string;
  title: string;
}

export interface ExamCreatedPayload {
  examId: string;
  classroomId: string;
  subjectId: string;
  teacherId: string;
  scheduledFor: string;
  title: string;
}

export interface ExamResultPublishedPayload {
  examId: string;
  classroomId: string;
  subjectId: string;
  publishedBy: string;
  studentIds: string[];
}

export interface MentoringSessionCreatedPayload {
  sessionId: string;
  studentId: string;
  supervisorId: string;
  scheduledFor: string;
}

export interface MentoringSessionCompletedPayload {
  sessionId: string;
  studentId: string;
  supervisorId: string;
  summary?: string;
  followUpRequired: boolean;
}

export interface WeeklyFeedbackSubmittedPayload {
  feedbackId: string;
  studentId: string;
  weekOf: string;
  authorRole: RoleId;
}

export interface StudentAbsenceRecordedPayload {
  studentId: string;
  classroomId: string;
  sessionDate: string;
  recordedBy: string;
}

export interface DailyPlanGeneratedPayload {
  studentId: string;
  planId: string;
  forDate: string;
  generatedBy: "turbo" | "supervisor" | "teacher";
}

/** Map of event name → payload. Drives the typed bus API. */
export interface AtomiaEventPayloads {
  class_logged: ClassLoggedPayload;
  homework_created: HomeworkCreatedPayload;
  exam_created: ExamCreatedPayload;
  exam_result_published: ExamResultPublishedPayload;
  mentoring_session_created: MentoringSessionCreatedPayload;
  mentoring_session_completed: MentoringSessionCompletedPayload;
  weekly_feedback_submitted: WeeklyFeedbackSubmittedPayload;
  student_absence_recorded: StudentAbsenceRecordedPayload;
  daily_plan_generated: DailyPlanGeneratedPayload;
}

export type AtomiaEvent<N extends AtomiaEventName = AtomiaEventName> = {
  name: N;
  meta: BaseEventMeta;
  payload: AtomiaEventPayloads[N];
};

export type AnyAtomiaEvent = {
  [K in AtomiaEventName]: AtomiaEvent<K>;
}[AtomiaEventName];
