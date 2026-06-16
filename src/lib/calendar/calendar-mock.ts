/**
 * Mock dataset for the Academic Calendar Engine.
 *
 * All values are static, deterministic and built around "today" so the UI
 * can render meaningful schedules without a backend. Replace with Xano
 * fetches at the service layer when the API is ready.
 */

import type {
  AcademicYear,
  ClassPeriod,
  DaySchedule,
  ExamEvent,
  IsoDate,
  MentoringEvent,
  ParentMeeting,
  SchoolAnnouncement,
  SchoolHoliday,
  SchoolTerm,
  SchoolWeek,
  TeacherMeeting,
  WeeklyReflectionWindow,
} from "./calendar-types";

const toIsoDate = (d: Date): IsoDate => d.toISOString().slice(0, 10);

const startOfWeek = (base: Date): Date => {
  const d = new Date(base);
  const day = d.getDay(); // 0 Sun .. 6 Sat
  // Treat Saturday as the first school day (common in IR calendars).
  const diff = (day + 1) % 7;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const addDays = (base: Date, n: number): Date => {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return d;
};

const atTime = (date: Date, hours: number, minutes = 0): string => {
  const d = new Date(date);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
};

const TODAY = new Date();
const WEEK_START = startOfWeek(TODAY);

export const MOCK_ACADEMIC_YEAR: AcademicYear = {
  id: "ay-1404",
  label: "سال تحصیلی ۱۴۰۴-۱۴۰۵",
  startsOn: "2025-09-23",
  endsOn: "2026-06-15",
  status: "active",
  termIds: ["term-1", "term-2"],
};

export const MOCK_TERMS: SchoolTerm[] = [
  {
    id: "term-1",
    academicYearId: MOCK_ACADEMIC_YEAR.id,
    label: "نیم‌سال اول",
    kind: "semester",
    startsOn: "2025-09-23",
    endsOn: "2026-01-20",
    weekIds: ["week-current"],
  },
  {
    id: "term-2",
    academicYearId: MOCK_ACADEMIC_YEAR.id,
    label: "نیم‌سال دوم",
    kind: "semester",
    startsOn: "2026-01-25",
    endsOn: "2026-06-15",
    weekIds: [],
  },
];

export const MOCK_WEEKS: SchoolWeek[] = [
  {
    id: "week-current",
    termId: "term-1",
    index: 12,
    label: "هفته جاری",
    startsOn: toIsoDate(WEEK_START),
    endsOn: toIsoDate(addDays(WEEK_START, 6)),
    reflectionWindowId: "reflection-current",
  },
];

export const MOCK_DAY_SCHEDULES: DaySchedule[] = Array.from({ length: 7 }).map(
  (_, i) => {
    const day = addDays(WEEK_START, i);
    const dow = day.getDay();
    const isWeekend = dow === 4 || dow === 5; // Thu/Fri
    return {
      date: toIsoDate(day),
      weekId: "week-current",
      kind: isWeekend ? "weekend" : "school",
      periodIds: isWeekend ? [] : [`period-${i}-1`, `period-${i}-2`],
    };
  },
);

export const MOCK_CLASS_PERIODS: ClassPeriod[] =
  MOCK_DAY_SCHEDULES.flatMap((day, i) => {
    if (day.kind !== "school") return [];
    const base = addDays(WEEK_START, i);
    return [
      {
        id: `period-${i}-1`,
        date: day.date,
        classroomId: "cls-10a",
        subjectId: "subj-math",
        teacherId: "tch-1",
        startsAt: atTime(base, 8, 0),
        endsAt: atTime(base, 9, 30),
        room: "۲۰۱",
        topic: "مرور مبحث هفته",
      },
      {
        id: `period-${i}-2`,
        date: day.date,
        classroomId: "cls-10a",
        subjectId: "subj-physics",
        teacherId: "tch-2",
        startsAt: atTime(base, 10, 0),
        endsAt: atTime(base, 11, 30),
        room: "۲۰۳",
        topic: "حرکت‌شناسی",
      },
    ];
  });

export const MOCK_EXAMS: ExamEvent[] = [
  {
    id: "exam-1",
    date: toIsoDate(addDays(WEEK_START, 3)),
    startsAt: atTime(addDays(WEEK_START, 3), 9, 0),
    endsAt: atTime(addDays(WEEK_START, 3), 10, 30),
    subjectId: "subj-math",
    scope: "classroom",
    classroomId: "cls-10a",
    title: "آزمون میان‌ترم ریاضی",
  },
];

export const MOCK_MENTORING: MentoringEvent[] = [
  {
    id: "mentor-1",
    date: toIsoDate(addDays(WEEK_START, 2)),
    startsAt: atTime(addDays(WEEK_START, 2), 14, 0),
    endsAt: atTime(addDays(WEEK_START, 2), 14, 45),
    mentorId: "sup-1",
    studentId: "stu-1",
    mode: "in_person",
    topic: "بررسی برنامه هفتگی",
  },
];

export const MOCK_PARENT_MEETINGS: ParentMeeting[] = [
  {
    id: "pmeet-1",
    date: toIsoDate(addDays(WEEK_START, 5)),
    startsAt: atTime(addDays(WEEK_START, 5), 16, 0),
    endsAt: atTime(addDays(WEEK_START, 5), 16, 30),
    parentId: "par-1",
    studentId: "stu-1",
    hostId: "sup-1",
    topic: "گفت‌وگوی هفتگی با والدین",
  },
];

export const MOCK_TEACHER_MEETINGS: TeacherMeeting[] = [
  {
    id: "tmeet-1",
    date: toIsoDate(addDays(WEEK_START, 1)),
    startsAt: atTime(addDays(WEEK_START, 1), 13, 0),
    endsAt: atTime(addDays(WEEK_START, 1), 13, 45),
    organizerId: "adm-1",
    participantIds: ["tch-1", "tch-2"],
    topic: "هماهنگی گروه ریاضی و فیزیک",
  },
];

export const MOCK_HOLIDAYS: SchoolHoliday[] = [
  {
    id: "hol-1",
    startsOn: "2026-03-20",
    endsOn: "2026-04-02",
    title: "تعطیلات نوروز",
    countrywide: true,
  },
];

export const MOCK_ANNOUNCEMENTS: SchoolAnnouncement[] = [
  {
    id: "ann-1",
    publishedAt: atTime(TODAY, 8, 0),
    title: "یادآوری برنامه هفته جاری",
    body: "لطفاً برنامه هفتگی خود را در داشبورد بررسی کنید.",
    audiences: ["all"],
  },
];

export const MOCK_REFLECTION_WINDOWS: WeeklyReflectionWindow[] = [
  {
    id: "reflection-current",
    weekId: "week-current",
    opensAt: atTime(addDays(WEEK_START, 4), 8, 0),
    closesAt: atTime(addDays(WEEK_START, 6), 22, 0),
    audiences: ["student", "parent"],
  },
];
