/**
 * Atomia — Shared Domain Types
 * ----------------------------
 * Single source of truth for the platform's core entities. Every UI
 * component and mock provider must depend on these interfaces (never on
 * inline shapes) so the Xano integration only has to replace the provider
 * functions, not the consumers.
 *
 * Naming policy: positive, growth-oriented only. Statuses use neutral
 * vocabulary (paused / in_progress / completed) — never "weak", "behind",
 * "poor", etc.
 */

// ============================================================
// Identity & roles
// ============================================================

export type RoleId =
  | "student"
  | "teacher"
  | "supervisor"
  | "parent"
  | "admin";

export type AccountStatus = "active" | "paused";

export interface User {
  id: string;
  name: string;
  role: RoleId;
  email?: string;
  avatarUrl?: string;
  status: AccountStatus;
  joinedAt: string; // display string (locale-formatted)
}

export interface Student extends User {
  role: "student";
  classroomId: string;
  gradeId: string;
  major?: string;
  guardianIds: string[];
  supervisorId?: string;
}

export interface Teacher extends User {
  role: "teacher";
  subjects: string[];
  classroomIds: string[];
}

export interface Parent extends User {
  role: "parent";
  childIds: string[];
}

export interface GradeSupervisor extends User {
  role: "supervisor";
  gradeId: string;
}

export interface Admin extends User {
  role: "admin";
  scope?: string;
}

// ============================================================
// Academic structure
// ============================================================

export interface Subject {
  id: string;
  name: string;
  color?: string;
}

export interface Grade {
  id: string;
  name: string;          // e.g. "پایه دهم"
  level: number;         // numeric grade level
  supervisorId?: string;
}

export interface Classroom {
  id: string;
  name: string;          // e.g. "دهم ریاضی ۱"
  gradeId: string;
  major?: string;
  studentCount: number;
  supervisorId?: string;
}

// ============================================================
// Learning content — the AtomBit core unit
// ============================================================

export type AtomBitStatus = "new" | "in_progress" | "completed" | "mastered";

export interface AtomBit {
  id: string;
  title: string;
  subjectId: string;
  /** 1-5; pedagogical complexity, not student "ability" */
  level: number;
  estimatedMinutes: number;
  status: AtomBitStatus;
  progress: number; // 0-100
  tags?: string[];
}

// ============================================================
// Sessions, homework and exams
// ============================================================

export type ClassSessionStatus = "scheduled" | "held" | "logged" | "open";

export interface ClassSession {
  id: string;
  classroomId: string;
  subjectId: string;
  teacherId: string;
  day: string;       // localized day name
  period: string;    // e.g. "۸:۰۰-۹:۳۰"
  date?: string;     // YYYY-MM-DD when known
  status: ClassSessionStatus;
  topic?: string;
}

export type HomeworkStatus = "assigned" | "in_progress" | "submitted" | "reviewed";

export interface Homework {
  id: string;
  title: string;
  subjectId: string;
  classroomId: string;
  assignedBy: string; // teacher id
  dueDate: string;
  status: HomeworkStatus;
  completionRate?: number; // 0-100 across class
  description?: string;
}

export type ExamStatus = "upcoming" | "active" | "completed";

export interface Exam {
  id: string;
  title: string;
  subjectId: string;
  classroomId?: string;
  date: string;
  durationMinutes: number;
  status: ExamStatus;
  averageScore?: number; // 0-100 aggregated, never per-student labels
}

// ============================================================
// Calendar
// ============================================================

export type CalendarEventKind =
  | "class"
  | "exam"
  | "mentoring"
  | "parent"
  | "teacher"
  | "school"
  | "holiday"
  | "event";

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  kind: CalendarEventKind;
  audience?: string;
  relatedClassroomId?: string;
}

// ============================================================
// Mentoring & insights
// ============================================================

export type MentoringSessionType = "student" | "parent";
export type MentoringSessionStatus = "scheduled" | "completed" | "rescheduled";

export interface MentoringSession {
  id: string;
  studentName: string;
  studentClass: string;
  date: string;
  time: string;
  type: MentoringSessionType;
  status: MentoringSessionStatus;
  with?: string;
  summary?: string;
  followUp?: string;
  previousNote?: string;
}

export type InsightTone = "celebration" | "opportunity" | "suggestion";

export interface LearningInsight {
  id: string;
  title: string;
  body: string;
  tone: InsightTone;
  audience: RoleId | "all";
  source?: "turbo" | "teacher" | "supervisor";
}

// ============================================================
// Feedback
// ============================================================

export type FeedbackChannelKey = "students" | "parents" | "teachers";

export interface WeeklyFeedback {
  channel: FeedbackChannelKey;
  label: string;
  satisfaction: number; // 0-100
  responses: number;
  trend: "up" | "steady";
}

// ============================================================
// Notifications
// ============================================================

export type NotificationKind =
  | "info"
  | "celebration"
  | "reminder"
  | "announcement"
  | "mentoring";

export interface Notification {
  id: string;
  title: string;
  body: string;
  kind: NotificationKind;
  audience: RoleId | "all";
  createdAt: string;
  read?: boolean;
  href?: string;
}
