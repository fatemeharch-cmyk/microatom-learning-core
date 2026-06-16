/**
 * Atomia — School Admin mock data
 * --------------------------------
 * Modular, reusable structures designed to mirror the future Xano API shape.
 * Replace each exported constant with the equivalent API call when the
 * backend is wired up. UI components should keep importing from here only.
 */

export type SchoolPulse = {
  activeStudents: number;
  activeTeachers: number;
  classesToday: number;
  registrationRate: number; // %
  weeklyGrowth: number; // % positive
};

export const schoolPulse: SchoolPulse = {
  activeStudents: 1248,
  activeTeachers: 86,
  classesToday: 54,
  registrationRate: 92,
  weeklyGrowth: 8,
};

export type TodayRegistration = {
  grade: string;
  scheduled: number;
  registered: number;
  open: number;
};

export const todayRegistrations: TodayRegistration[] = [
  { grade: "پایه دهم", scheduled: 18, registered: 17, open: 1 },
  { grade: "پایه یازدهم", scheduled: 16, registered: 15, open: 1 },
  { grade: "پایه دوازدهم", scheduled: 20, registered: 19, open: 1 },
];

export type WeeklyEvent = {
  id: string;
  title: string;
  type: "exam" | "meeting" | "event" | "holiday";
  day: string;
  audience: string;
};

export const weeklyEvents: WeeklyEvent[] = [
  { id: "e1", title: "آزمون میان‌ترم ریاضی", type: "exam", day: "یکشنبه", audience: "پایه یازدهم" },
  { id: "e2", title: "جلسه دبیران علوم تجربی", type: "meeting", day: "دوشنبه", audience: "دبیران" },
  { id: "e3", title: "همایش مهارت‌های یادگیری", type: "event", day: "چهارشنبه", audience: "همه دانش‌آموزان" },
  { id: "e4", title: "ملاقات والدین پایه دهم", type: "meeting", day: "پنجشنبه", audience: "والدین" },
];

export type TeacherActivity = {
  id: string;
  name: string;
  subject: string;
  logsCompleted: number;
  logsExpected: number;
};

export const teacherActivity: TeacherActivity[] = [
  { id: "t1", name: "خانم احمدی", subject: "ریاضی", logsCompleted: 12, logsExpected: 12 },
  { id: "t2", name: "آقای رضایی", subject: "فیزیک", logsCompleted: 10, logsExpected: 11 },
  { id: "t3", name: "خانم کریمی", subject: "ادبیات", logsCompleted: 9, logsExpected: 10 },
  { id: "t4", name: "آقای مرادی", subject: "شیمی", logsCompleted: 11, logsExpected: 11 },
];

export type GradeSummary = {
  grade: string;
  students: number;
  classes: number;
  supervisor: string;
  growthIndex: number; // 0-100 positive index
};

export const gradeSummaries: GradeSummary[] = [
  { grade: "پایه دهم", students: 420, classes: 14, supervisor: "استاد نوری", growthIndex: 84 },
  { grade: "پایه یازدهم", students: 408, classes: 13, supervisor: "استاد محمدی", growthIndex: 88 },
  { grade: "پایه دوازدهم", students: 420, classes: 15, supervisor: "استاد صابری", growthIndex: 91 },
];

export type FeedbackChannel = {
  source: "students" | "parents" | "teachers";
  label: string;
  satisfaction: number; // 0-100
  responses: number;
  trend: "up" | "steady";
};

export const feedbackSummary: FeedbackChannel[] = [
  { source: "students", label: "دانش‌آموزان", satisfaction: 86, responses: 412, trend: "up" },
  { source: "parents", label: "والدین", satisfaction: 89, responses: 287, trend: "up" },
  { source: "teachers", label: "دبیران", satisfaction: 92, responses: 74, trend: "steady" },
];

// -------- Users --------
export type RoleKey = "student" | "parent" | "teacher" | "supervisor" | "admin";

export type ManagedUser = {
  id: string;
  name: string;
  role: RoleKey;
  reference: string; // class / grade / department
  status: "active" | "paused";
  joinedAt: string;
};

export const managedUsers: ManagedUser[] = [
  { id: "u1", name: "آرمیتا رضایی", role: "student", reference: "یازدهم تجربی ۲", status: "active", joinedAt: "۱۴۰۳/۰۷/۰۱" },
  { id: "u2", name: "محمد یوسفی", role: "student", reference: "دهم ریاضی ۱", status: "active", joinedAt: "۱۴۰۳/۰۷/۰۲" },
  { id: "u3", name: "خانم احمدی", role: "teacher", reference: "ریاضی", status: "active", joinedAt: "۱۴۰۲/۰۶/۱۵" },
  { id: "u4", name: "آقای رضایی", role: "teacher", reference: "فیزیک", status: "active", joinedAt: "۱۴۰۲/۰۶/۱۵" },
  { id: "u5", name: "خانواده رضایی", role: "parent", reference: "ولی آرمیتا", status: "active", joinedAt: "۱۴۰۳/۰۷/۰۱" },
  { id: "u6", name: "استاد نوری", role: "supervisor", reference: "پایه دهم", status: "active", joinedAt: "۱۴۰۱/۰۵/۱۰" },
  { id: "u7", name: "مدیر اصلی", role: "admin", reference: "مدیریت کل", status: "active", joinedAt: "۱۴۰۰/۰۱/۰۱" },
  { id: "u8", name: "سارا میرزایی", role: "student", reference: "دوازدهم انسانی ۱", status: "paused", joinedAt: "۱۴۰۲/۰۷/۱۰" },
];

// -------- Grades / Classes --------
export type ClassRoom = {
  id: string;
  grade: string;
  major: string;
  name: string;
  students: number;
  supervisor: string;
};

export const classrooms: ClassRoom[] = [
  { id: "c1", grade: "دهم", major: "ریاضی", name: "دهم ریاضی ۱", students: 32, supervisor: "استاد نوری" },
  { id: "c2", grade: "دهم", major: "تجربی", name: "دهم تجربی ۱", students: 30, supervisor: "استاد نوری" },
  { id: "c3", grade: "یازدهم", major: "ریاضی", name: "یازدهم ریاضی ۲", students: 28, supervisor: "استاد محمدی" },
  { id: "c4", grade: "یازدهم", major: "تجربی", name: "یازدهم تجربی ۲", students: 31, supervisor: "استاد محمدی" },
  { id: "c5", grade: "دوازدهم", major: "ریاضی", name: "دوازدهم ریاضی ۱", students: 27, supervisor: "استاد صابری" },
  { id: "c6", grade: "دوازدهم", major: "انسانی", name: "دوازدهم انسانی ۱", students: 24, supervisor: "استاد صابری" },
];

// -------- Weekly schedule --------
export type ScheduleSlot = {
  day: string;
  period: string;
  classroom: string;
  subject: string;
  teacher: string;
};

export const weeklySchedule: ScheduleSlot[] = [
  { day: "شنبه", period: "۸:۰۰-۹:۳۰", classroom: "دهم ریاضی ۱", subject: "ریاضی", teacher: "خانم احمدی" },
  { day: "شنبه", period: "۹:۴۵-۱۱:۱۵", classroom: "یازدهم تجربی ۲", subject: "فیزیک", teacher: "آقای رضایی" },
  { day: "یکشنبه", period: "۸:۰۰-۹:۳۰", classroom: "دوازدهم ریاضی ۱", subject: "شیمی", teacher: "آقای مرادی" },
  { day: "یکشنبه", period: "۱۱:۳۰-۱۳:۰۰", classroom: "دهم تجربی ۱", subject: "ادبیات", teacher: "خانم کریمی" },
  { day: "دوشنبه", period: "۸:۰۰-۹:۳۰", classroom: "یازدهم ریاضی ۲", subject: "ریاضی", teacher: "خانم احمدی" },
  { day: "سه‌شنبه", period: "۹:۴۵-۱۱:۱۵", classroom: "دوازدهم انسانی ۱", subject: "ادبیات", teacher: "خانم کریمی" },
  { day: "چهارشنبه", period: "۸:۰۰-۹:۳۰", classroom: "دهم ریاضی ۱", subject: "فیزیک", teacher: "آقای رضایی" },
];

export const weekDays = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه"];

// -------- Academic calendar --------
export type CalendarItem = {
  id: string;
  date: string;
  title: string;
  type: "exam" | "holiday" | "event" | "parent" | "teacher";
};

export const academicCalendar: CalendarItem[] = [
  { id: "k1", date: "۱۴۰۳/۰۸/۰۵", title: "آزمون جامع پایه دوازدهم", type: "exam" },
  { id: "k2", date: "۱۴۰۳/۰۸/۱۰", title: "تعطیلات رسمی", type: "holiday" },
  { id: "k3", date: "۱۴۰۳/۰۸/۱۴", title: "همایش مهارت‌های یادگیری", type: "event" },
  { id: "k4", date: "۱۴۰۳/۰۸/۱۷", title: "ملاقات والدین پایه دهم", type: "parent" },
  { id: "k5", date: "۱۴۰۳/۰۸/۲۰", title: "شورای دبیران", type: "teacher" },
  { id: "k6", date: "۱۴۰۳/۰۸/۲۵", title: "آزمون میان‌ترم پایه یازدهم", type: "exam" },
];

// -------- Class registration status --------
export type ClassRegistrationItem = {
  id: string;
  classroom: string;
  teacher: string;
  subject: string;
  status: "held" | "logged" | "open";
  time: string;
};

export const classRegistration: ClassRegistrationItem[] = [
  { id: "r1", classroom: "دهم ریاضی ۱", teacher: "خانم احمدی", subject: "ریاضی", status: "logged", time: "۸:۰۰" },
  { id: "r2", classroom: "یازدهم تجربی ۲", teacher: "آقای رضایی", subject: "فیزیک", status: "logged", time: "۹:۴۵" },
  { id: "r3", classroom: "دوازدهم ریاضی ۱", teacher: "آقای مرادی", subject: "شیمی", status: "held", time: "۱۱:۳۰" },
  { id: "r4", classroom: "دهم تجربی ۱", teacher: "خانم کریمی", subject: "ادبیات", status: "open", time: "۱۳:۰۰" },
  { id: "r5", classroom: "یازدهم ریاضی ۲", teacher: "خانم احمدی", subject: "ریاضی", status: "open", time: "۱۴:۳۰" },
];

// -------- Feedback aggregates --------
export type FeedbackTheme = {
  theme: string;
  positiveScore: number; // 0-100
  channel: "students" | "parents" | "teachers";
};

export const feedbackThemes: FeedbackTheme[] = [
  { theme: "کیفیت تدریس", positiveScore: 88, channel: "students" },
  { theme: "همراهی مسئول پایه", positiveScore: 92, channel: "students" },
  { theme: "ارتباط با مدرسه", positiveScore: 90, channel: "parents" },
  { theme: "گزارش رشد فرزند", positiveScore: 87, channel: "parents" },
  { theme: "پشتیبانی آموزشی", positiveScore: 93, channel: "teachers" },
  { theme: "ابزارهای پلتفرم", positiveScore: 89, channel: "teachers" },
];

// -------- System settings --------
export type SystemSettings = {
  schoolYear: string;
  language: "fa" | "en";
  branding: { name: string; tagline: string };
  notifications: { email: boolean; sms: boolean; inApp: boolean };
  rolePermissions: { role: RoleKey; scope: string }[];
};

export const systemSettings: SystemSettings = {
  schoolYear: "۱۴۰۳-۱۴۰۴",
  language: "fa",
  branding: { name: "آتومیا", tagline: "هوش یادگیری شخصی‌سازی‌شده" },
  notifications: { email: true, sms: false, inApp: true },
  rolePermissions: [
    { role: "student", scope: "مشاهده مسیر یادگیری شخصی" },
    { role: "parent", scope: "همراهی رشد فرزند" },
    { role: "teacher", scope: "مدیریت کلاس و محتوای آموزشی" },
    { role: "supervisor", scope: "همراهی و راهبری پایه" },
    { role: "admin", scope: "مدیریت کامل مدرسه و سیستم" },
  ],
};

export const roleLabelsFa: Record<RoleKey, string> = {
  student: "دانش‌آموز",
  parent: "والدین",
  teacher: "دبیر",
  supervisor: "مسئول پایه",
  admin: "مدیر مدرسه",
};
