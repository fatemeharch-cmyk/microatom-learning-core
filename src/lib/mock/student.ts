/**
 * Atomia — Student mock provider.
 *
 * Returns typed data only. Replace the bodies of the `get*` functions with
 * Xano calls when the backend is wired up; UI consumers stay unchanged.
 */
import type {
  AtomBit,
  ClassSession,
  Exam,
  Homework,
  LearningInsight,
  Student,
  Subject,
} from "@/lib/types";

const subjects: Subject[] = [
  { id: "sub-math", name: "ریاضی", color: "primary" },
  { id: "sub-phys", name: "فیزیک", color: "info" },
  { id: "sub-bio", name: "زیست‌شناسی", color: "success" },
  { id: "sub-chem", name: "شیمی", color: "warning" },
  { id: "sub-lit", name: "ادبیات", color: "accent" },
];

const currentStudent: Student = {
  id: "stu-arman",
  name: "آرمان کریمی",
  role: "student",
  status: "active",
  joinedAt: "۱۴۰۳/۰۷/۰۱",
  classroomId: "cls-11-tajrobi-1",
  gradeId: "grade-11",
  major: "تجربی",
  guardianIds: ["par-karimi"],
  supervisorId: "sup-noori",
};

const atomBits: AtomBit[] = [
  { id: "ab-1", title: "تنفس سلولی", subjectId: "sub-bio", level: 3, estimatedMinutes: 18, status: "in_progress", progress: 60 },
  { id: "ab-2", title: "معادله درجه دوم", subjectId: "sub-math", level: 4, estimatedMinutes: 22, status: "in_progress", progress: 35 },
  { id: "ab-3", title: "حرکت پرتابی", subjectId: "sub-phys", level: 3, estimatedMinutes: 20, status: "new", progress: 0 },
  { id: "ab-4", title: "استوکیومتری پایه", subjectId: "sub-chem", level: 2, estimatedMinutes: 15, status: "completed", progress: 100 },
  { id: "ab-5", title: "تحلیل شعر معاصر", subjectId: "sub-lit", level: 2, estimatedMinutes: 12, status: "mastered", progress: 100 },
];

const todaySessions: ClassSession[] = [
  { id: "cs-1", classroomId: "cls-11-tajrobi-1", subjectId: "sub-bio", teacherId: "tch-rezaei", day: "امروز", period: "۸:۰۰-۹:۳۰", status: "scheduled", topic: "تنفس سلولی" },
  { id: "cs-2", classroomId: "cls-11-tajrobi-1", subjectId: "sub-math", teacherId: "tch-ahmadi", day: "امروز", period: "۹:۴۵-۱۱:۱۵", status: "scheduled", topic: "معادله درجه دوم" },
];

const homework: Homework[] = [
  { id: "hw-1", title: "تمرین معادله درجه دوم", subjectId: "sub-math", classroomId: "cls-11-tajrobi-1", assignedBy: "tch-ahmadi", dueDate: "پنجشنبه", status: "in_progress" },
  { id: "hw-2", title: "خلاصه فصل تنفس سلولی", subjectId: "sub-bio", classroomId: "cls-11-tajrobi-1", assignedBy: "tch-rezaei", dueDate: "شنبه", status: "assigned" },
];

const exams: Exam[] = [
  { id: "ex-1", title: "آزمونک زیست‌شناسی", subjectId: "sub-bio", date: "۲۸ خرداد", durationMinutes: 30, status: "upcoming" },
  { id: "ex-2", title: "آزمون جامع فیزیک", subjectId: "sub-phys", date: "شنبه ۲۶ خرداد", durationMinutes: 90, status: "upcoming" },
];

const insights: LearningInsight[] = [
  { id: "in-1", title: "تداوم ۱۲ روزه", body: "روند یادگیری شما در دو هفته اخیر پایدار و رو به رشد بوده است.", tone: "celebration", audience: "student", source: "turbo" },
  { id: "in-2", title: "گام بعدی پیشنهادی", body: "یک واحد یادگیری کوتاه درباره حرکت پرتابی برای تثبیت مفاهیم آماده است.", tone: "suggestion", audience: "student", source: "turbo" },
];

// ---- Provider functions (async-shaped for future Xano swap) -------------

export async function getCurrentStudent(): Promise<Student> {
  return currentStudent;
}

export async function getSubjects(): Promise<Subject[]> {
  return subjects;
}

export async function getAtomBits(): Promise<AtomBit[]> {
  return atomBits;
}

export async function getTodaySessions(): Promise<ClassSession[]> {
  return todaySessions;
}

export async function getStudentHomework(): Promise<Homework[]> {
  return homework;
}

export async function getStudentExams(): Promise<Exam[]> {
  return exams;
}

export async function getStudentInsights(): Promise<LearningInsight[]> {
  return insights;
}

export const studentMock = {
  subjects,
  currentStudent,
  atomBits,
  todaySessions,
  homework,
  exams,
  insights,
};
