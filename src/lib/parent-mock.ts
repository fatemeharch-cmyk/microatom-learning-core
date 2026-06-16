// Mock data for the Parent Companion workspace.
// Structures kept modular so they can be replaced with Xano API calls later
// without touching the UI components that consume them.

export interface DailySummary {
  studiedMinutes: number;
  reviewedTopics: string[];
  completedActivities: number;
  highlight: string;
}

export interface UpcomingExam {
  title: string;
  subject: string;
  date: string;
}

export interface MentoringMeeting {
  id: string;
  type: "student" | "parent";
  date: string;
  time: string;
  with: string; // mentor name
  summary?: string;
  followUp?: string;
  status: "upcoming" | "completed";
}

export interface WeeklyPulse {
  label: string;
  value: number; // 0–100
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  date: string;
  category: "event" | "news" | "message" | "education";
}

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  kind: "class" | "exam" | "mentoring" | "parent" | "school";
}

export interface GrowthIndicator {
  label: string;
  value: number;
  unit?: string;
  hint?: string;
}

export interface WeeklySummary {
  topics: string[];
  homeworkCompletion: number; // percent
  highlights: string[];
  familySuggestions: string[];
}

export interface CompanionSuggestion {
  category: "conversation" | "support" | "encouragement";
  title: string;
  body: string;
}

export const childName = "آرمان";

export const dailySummary: DailySummary = {
  studiedMinutes: 95,
  reviewedTopics: ["تنفس سلولی", "معادله درجه دوم"],
  completedActivities: 4,
  highlight: "امروز یک واحد یادگیری تازه به مسیر رشد آرمان اضافه شد.",
};

export const upcomingExams: UpcomingExam[] = [
  { title: "آزمون جامع فیزیک", subject: "فیزیک", date: "شنبه ۲۶ خرداد" },
  { title: "آزمونک زیست‌شناسی", subject: "زیست‌شناسی", date: "۲۸ خرداد" },
];

export const mentoringMeetings: MentoringMeeting[] = [
  {
    id: "m1",
    type: "parent",
    date: "فردا",
    time: "۱۷:۰۰",
    with: "استاد نوری",
    status: "upcoming",
  },
  {
    id: "m2",
    type: "student",
    date: "امروز",
    time: "۱۴:۰۰",
    with: "استاد نوری",
    status: "upcoming",
  },
  {
    id: "m3",
    type: "parent",
    date: "۱۰ خرداد",
    time: "۱۶:۳۰",
    with: "استاد نوری",
    status: "completed",
    summary: "هماهنگی برنامه هفتگی مطالعه با خانواده و تعیین اهداف کوتاه‌مدت.",
    followUp: "ادامه برنامه ۹۰ دقیقه‌ای روزانه و گفت‌وگوی هفتگی درباره مسیر یادگیری.",
  },
  {
    id: "m4",
    type: "parent",
    date: "۲۸ اردیبهشت",
    time: "۱۷:۰۰",
    with: "استاد نوری",
    status: "completed",
    summary: "آشنایی با مسیر یادگیری توربو و نقش خانواده در حمایت یادگیری.",
    followUp: "ایجاد یک فضای آرام مطالعه در خانه.",
  },
];

export const weeklyPulse: WeeklyPulse[] = [
  { label: "تداوم یادگیری", value: 82 },
  { label: "تکمیل تکالیف", value: 78 },
  { label: "مشارکت در کلاس", value: 86 },
  { label: "آمادگی برای آزمون‌ها", value: 74 },
];

export const announcements: Announcement[] = [
  {
    id: "a1",
    title: "همایش خانواده و یادگیری",
    body: "همایش حمایت خانواده از مسیر یادگیری، روز پنجشنبه در سالن اجتماعات برگزار می‌شود.",
    date: "۲۲ خرداد",
    category: "event",
  },
  {
    id: "a2",
    title: "برنامه آزمون‌های پایان فصل",
    body: "برنامه کامل آزمون‌های پایان فصل در تقویم آموزشی اضافه شد.",
    date: "۲۰ خرداد",
    category: "education",
  },
  {
    id: "a3",
    title: "پیام مدیر مدرسه",
    body: "از همراهی همیشگی خانواده‌های عزیز سپاسگزاریم.",
    date: "۱۸ خرداد",
    category: "message",
  },
  {
    id: "a4",
    title: "کارگاه مهارت‌های مطالعه",
    body: "ثبت‌نام کارگاه مهارت‌های مطالعه برای اولیا و دانش‌آموزان آغاز شد.",
    date: "۱۵ خرداد",
    category: "news",
  },
];

export const calendarEvents: CalendarEvent[] = [
  { id: "e1", date: "2026-06-16", title: "جلسه همراهی آرمان", kind: "mentoring" },
  { id: "e2", date: "2026-06-17", title: "ملاقات والدین با استاد نوری", kind: "parent" },
  { id: "e3", date: "2026-06-18", title: "آزمون جامع فیزیک", kind: "exam" },
  { id: "e4", date: "2026-06-19", title: "کلاس فوق‌برنامه ریاضی", kind: "class" },
  { id: "e5", date: "2026-06-20", title: "همایش خانواده و یادگیری", kind: "school" },
  { id: "e6", date: "2026-06-23", title: "آزمونک زیست‌شناسی", kind: "exam" },
  { id: "e7", date: "2026-06-25", title: "کارگاه مهارت‌های مطالعه", kind: "school" },
];

export const growthIndicators: GrowthIndicator[] = [
  { label: "فعالیت‌های یادگیری کامل شده", value: 48, hint: "این ماه" },
  { label: "مباحث مرور شده", value: 23, hint: "هفته‌های اخیر" },
  { label: "تداوم یادگیری", value: 12, unit: " روز" },
  { label: "اهداف هفتگی محقق‌شده", value: 4, unit: "/۵" },
];

export const weeklyTopics = ["تنفس سلولی", "معادله درجه دوم", "حرکت پرتابی", "استوکیومتری"];

export const weeklySummary: WeeklySummary = {
  topics: weeklyTopics,
  homeworkCompletion: 82,
  highlights: [
    "تکمیل ۵ واحد یادگیری تازه در زیست‌شناسی",
    "تداوم ۷ روزه یادگیری بدون وقفه",
    "رشد ملایم در میانگین تست‌های ریاضی",
  ],
  familySuggestions: [
    "یک گفت‌وگوی کوتاه درباره یکی از مباحث این هفته می‌تواند مسیر یادگیری را تقویت کند.",
    "یک زمان ثابت روزانه برای مطالعه به تثبیت تداوم یادگیری کمک می‌کند.",
    "تشویق به یادگیری بدون مقایسه، حس اعتماد را افزایش می‌دهد.",
  ],
};

export const companionSuggestions: CompanionSuggestion[] = [
  {
    category: "conversation",
    title: "گفت‌وگوی هفتگی کوتاه",
    body: "بپرسید این هفته کدام موضوع برایش جذاب‌تر بود و چرا.",
  },
  {
    category: "conversation",
    title: "اشتراک تجربه شخصی",
    body: "خاطره‌ای از مسیر یادگیری خودتان را با او در میان بگذارید.",
  },
  {
    category: "support",
    title: "زمان آرام مطالعه",
    body: "یک بازه ۹۰ دقیقه‌ای بدون صدای محیط فراهم کنید.",
  },
  {
    category: "support",
    title: "همراهی در مرور",
    body: "از او بخواهید مفهومی را برایتان توضیح دهد — این کار یادگیری را عمیق‌تر می‌کند.",
  },
  {
    category: "encouragement",
    title: "تشویق به تداوم",
    body: "یک جمله مثبت درباره تلاش این هفته‌اش بگویید، فارغ از نتیجه آزمون.",
  },
  {
    category: "encouragement",
    title: "جشن گرفتن گام‌های کوچک",
    body: "هر گام رشد، ارزش جشن گرفتن دارد — حتی پنج دقیقه مطالعه بیشتر.",
  },
];
