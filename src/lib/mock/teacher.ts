// TODO(xano): replace this mock module with real Xano API calls.
import { warnMock } from "./_warn";
warnMock("mock/teacher");

/**
 * Atomia — Teacher mock provider.
 */
import type {
  ClassSession,
  Classroom,
  Exam,
  Homework,
  LearningInsight,
  Teacher,
} from "@/lib/types";

const currentTeacher: Teacher = {
  id: "tch-ahmadi",
  name: "خانم احمدی",
  role: "teacher",
  status: "active",
  joinedAt: "۱۴۰۲/۰۶/۱۵",
  subjects: ["sub-math"],
  classroomIds: ["cls-10-riazi-1", "cls-11-riazi-2"],
};

const classrooms: Classroom[] = [
  { id: "cls-10-riazi-1", name: "دهم ریاضی ۱", gradeId: "grade-10", major: "ریاضی", studentCount: 32, supervisorId: "sup-noori" },
  { id: "cls-11-riazi-2", name: "یازدهم ریاضی ۲", gradeId: "grade-11", major: "ریاضی", studentCount: 28, supervisorId: "sup-mohammadi" },
];

const todaySessions: ClassSession[] = [
  { id: "tcs-1", classroomId: "cls-10-riazi-1", subjectId: "sub-math", teacherId: "tch-ahmadi", day: "امروز", period: "۸:۰۰-۹:۳۰", status: "scheduled", topic: "معادله درجه دوم" },
  { id: "tcs-2", classroomId: "cls-11-riazi-2", subjectId: "sub-math", teacherId: "tch-ahmadi", day: "امروز", period: "۱۱:۳۰-۱۳:۰۰", status: "scheduled", topic: "مثلثات" },
];

const homework: Homework[] = [
  { id: "thw-1", title: "تمرین معادله درجه دوم", subjectId: "sub-math", classroomId: "cls-10-riazi-1", assignedBy: "tch-ahmadi", dueDate: "پنجشنبه", status: "assigned", completionRate: 64 },
  { id: "thw-2", title: "مرور مثلثات", subjectId: "sub-math", classroomId: "cls-11-riazi-2", assignedBy: "tch-ahmadi", dueDate: "شنبه", status: "in_progress", completionRate: 42 },
];

const exams: Exam[] = [
  { id: "tex-1", title: "آزمون فصل ۱ ریاضی", subjectId: "sub-math", classroomId: "cls-10-riazi-1", date: "۲۵ خرداد", durationMinutes: 60, status: "upcoming", averageScore: 78 },
];

const insights: LearningInsight[] = [
  { id: "tin-1", title: "فرصت رشد مشترک", body: "موضوع «معادله درجه دوم» در پایه دهم فرصت تمرین بیشتری دارد.", tone: "opportunity", audience: "teacher", source: "turbo" },
  { id: "tin-2", title: "مشارکت بالا", body: "میزان مشارکت کلاس یازدهم ریاضی ۲ این هفته رو به رشد بوده است.", tone: "celebration", audience: "teacher", source: "turbo" },
];

export async function getCurrentTeacher(): Promise<Teacher> {
  return currentTeacher;
}
export async function getTeacherClassrooms(): Promise<Classroom[]> {
  return classrooms;
}
export async function getTeacherTodaySessions(): Promise<ClassSession[]> {
  return todaySessions;
}
export async function getTeacherHomework(): Promise<Homework[]> {
  return homework;
}
export async function getTeacherExams(): Promise<Exam[]> {
  return exams;
}
export async function getTeacherInsights(): Promise<LearningInsight[]> {
  return insights;
}

export const teacherMock = {
  currentTeacher,
  classrooms,
  todaySessions,
  homework,
  exams,
  insights,
};
