// Mock data for the Grade Supervisor workspace.
// Kept as plain TypeScript modules so the same shapes can later be
// swapped for Xano API responses without UI changes.

export type SessionType = "student" | "parent";
export type SessionStatus = "scheduled" | "completed" | "rescheduled";

export interface MentoringSession {
  id: string;
  studentName: string;
  studentClass: string;
  date: string; // ISO-like display string
  time: string;
  type: SessionType;
  status: SessionStatus;
  previousNote?: string;
}

export interface FollowUp {
  id: string;
  studentName: string;
  goal: string;
  nextDate: string;
  status: "open" | "in_progress" | "completed";
}

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  kind: "mentoring" | "parent" | "exam" | "school" | "teacher";
}

export interface PendingClassLog {
  class: string;
  teacher: string;
  subject: string;
  date: string;
}

export interface FeedbackTrend {
  label: string;
  values: number[]; // last 4 weeks
}

export interface TeacherNote {
  id: string;
  teacher: string;
  subject: string;
  topic: string;
  note: string;
  date: string;
  status: "new" | "in_progress" | "resolved";
}

export interface StudentProfile {
  name: string;
  class: string;
  journey: { date: string; title: string }[];
  recentExams: { title: string; date: string; score: number }[];
  homework: { completed: number; total: number };
  attendance: { present: number; total: number };
  focusTopics: string[];
  mentoringHistory: { date: string; summary: string }[];
  weeklyGoals: string[];
}

export const todaySessions: MentoringSession[] = [
  {
    id: "s1",
    studentName: "آرمان کریمی",
    studentClass: "یازدهم تجربی ۱",
    date: "امروز",
    time: "۱۴:۰۰",
    type: "student",
    status: "scheduled",
    previousNote: "تمرکز روی برنامه‌ریزی هفتگی و مرور درس‌های اصلی",
  },
  {
    id: "s2",
    studentName: "نیلوفر احمدی",
    studentClass: "یازدهم تجربی ۲",
    date: "امروز",
    time: "۱۵:۳۰",
    type: "student",
    status: "scheduled",
    previousNote: "ادامه مسیر تقویت مهارت تست‌زنی",
  },
];

export const upcomingParentMeetings: MentoringSession[] = [
  {
    id: "p1",
    studentName: "ساره موسوی",
    studentClass: "یازدهم تجربی ۱",
    date: "فردا",
    time: "۱۷:۰۰",
    type: "parent",
    status: "scheduled",
  },
  {
    id: "p2",
    studentName: "علی نوری",
    studentClass: "یازدهم تجربی ۲",
    date: "۳ روز دیگر",
    time: "۱۶:۰۰",
    type: "parent",
    status: "scheduled",
  },
];

export const followUps: FollowUp[] = [
  {
    id: "f1",
    studentName: "آرمان کریمی",
    goal: "تثبیت برنامه مطالعه ۹۰ دقیقه‌ای روزانه",
    nextDate: "۲۲ خرداد",
    status: "in_progress",
  },
  {
    id: "f2",
    studentName: "ساره موسوی",
    goal: "تقویت مهارت حل مسئله در ریاضی",
    nextDate: "۲۵ خرداد",
    status: "open",
  },
  {
    id: "f3",
    studentName: "محمد رضایی",
    goal: "ادامه مرور هوشمند توربو در زیست‌شناسی",
    nextDate: "۲۰ خرداد",
    status: "completed",
  },
  {
    id: "f4",
    studentName: "زهرا مرادی",
    goal: "تنظیم هدف هفتگی فیزیک",
    nextDate: "۲۸ خرداد",
    status: "open",
  },
];

export const pendingClassLogs: PendingClassLog[] = [
  { class: "یازدهم تجربی ۱", teacher: "آقای محمدی", subject: "ریاضی", date: "امروز" },
  { class: "یازدهم تجربی ۳", teacher: "خانم کریمی", subject: "شیمی", date: "دیروز" },
];

export const weeklyAISummary = [
  "روند رشد عمومی پایه ۱۱ تجربی در هفته اخیر مثبت بوده است.",
  "موضوع «تنفس سلولی» در چند کلاس فرصت رشد مشترکی است.",
  "تعداد جلسات همراهی فعال نسبت به هفته قبل افزایش یافته است.",
];

export const calendarEvents: CalendarEvent[] = [
  { id: "e1", date: "2026-06-16", title: "جلسه همراهی — آرمان کریمی", kind: "mentoring" },
  { id: "e2", date: "2026-06-16", title: "جلسه همراهی — نیلوفر احمدی", kind: "mentoring" },
  { id: "e3", date: "2026-06-17", title: "ملاقات والدین — ساره موسوی", kind: "parent" },
  { id: "e4", date: "2026-06-18", title: "آزمون جامع فیزیک", kind: "exam" },
  { id: "e5", date: "2026-06-19", title: "جلسه شورای دبیران", kind: "teacher" },
  { id: "e6", date: "2026-06-20", title: "همایش رشد یادگیری", kind: "school" },
  { id: "e7", date: "2026-06-22", title: "ملاقات والدین — علی نوری", kind: "parent" },
  { id: "e8", date: "2026-06-23", title: "آزمونک زیست‌شناسی", kind: "exam" },
];

export const feedbackTrends: { group: string; trends: FeedbackTrend[] }[] = [
  {
    group: "بازخورد دانش‌آموزان",
    trends: [
      { label: "رضایت از مسیر یادگیری", values: [68, 72, 75, 80] },
      { label: "احساس حمایت", values: [70, 74, 78, 82] },
    ],
  },
  {
    group: "بازخورد دبیران",
    trends: [
      { label: "همکاری کلاسی", values: [72, 76, 78, 81] },
      { label: "آمادگی دانش‌آموزان", values: [60, 66, 70, 74] },
    ],
  },
  {
    group: "بازخورد والدین",
    trends: [
      { label: "ارتباط با مدرسه", values: [74, 76, 80, 83] },
      { label: "رشد فرزند", values: [66, 72, 75, 79] },
    ],
  },
];

export const teacherNotes: TeacherNote[] = [
  {
    id: "tn1",
    teacher: "خانم رضایی",
    subject: "زیست‌شناسی",
    topic: "تنفس سلولی",
    note: "یک تمرین گروهی کوتاه می‌تواند درک کلاس را تقویت کند.",
    date: "امروز",
    status: "new",
  },
  {
    id: "tn2",
    teacher: "آقای محمدی",
    subject: "ریاضی",
    topic: "معادله درجه دوم",
    note: "پیشنهاد یک کارگاه حل تمرین برای تثبیت بیشتر مفهوم.",
    date: "دیروز",
    status: "in_progress",
  },
  {
    id: "tn3",
    teacher: "خانم کریمی",
    subject: "شیمی",
    topic: "استوکیومتری",
    note: "کلاس آماده ورود به فصل بعدی است.",
    date: "۲ روز پیش",
    status: "resolved",
  },
];

export const sampleStudentProfile: StudentProfile = {
  name: "آرمان کریمی",
  class: "یازدهم تجربی ۱",
  journey: [
    { date: "هفته ۱", title: "آغاز مسیر یادگیری توربو" },
    { date: "هفته ۲", title: "تکمیل اولین واحد یادگیری" },
    { date: "هفته ۳", title: "۷ روز تداوم یادگیری" },
    { date: "هفته ۴", title: "رشد ۱۰٪ در میانگین آزمون‌ها" },
    { date: "هفته ۵", title: "ورود به مسیر همراهی هفتگی" },
  ],
  recentExams: [
    { title: "آزمون زیست‌شناسی", date: "۱۱ خرداد", score: 85 },
    { title: "آزمون شیمی فصل ۱", date: "۱۸ خرداد", score: 78 },
    { title: "آزمون ریاضی فصل ۲", date: "۴ خرداد", score: 64 },
  ],
  homework: { completed: 22, total: 28 },
  attendance: { present: 38, total: 40 },
  focusTopics: ["تنفس سلولی", "معادله درجه دوم", "حرکت پرتابی"],
  mentoringHistory: [
    { date: "۱۲ خرداد", summary: "تنظیم برنامه هفتگی مطالعه" },
    { date: "۵ خرداد", summary: "تمرین تمرکز در جلسات کوتاه" },
    { date: "۲۹ اردیبهشت", summary: "آشنایی با مسیر یادگیری توربو" },
  ],
  weeklyGoals: [
    "تکمیل ۵ واحد یادگیری تازه",
    "مرور هفتگی زیست‌شناسی",
    "شرکت فعال در آزمونک پایان هفته",
  ],
};
