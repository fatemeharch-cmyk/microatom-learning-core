import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "fa" | "en";
export type Dir = "rtl" | "ltr";

type Dict = Record<string, { fa: string; en: string }>;

// Central translation dictionary. Add keys here; both languages required.
export const translations = {
  // Brand & roles
  brand: { fa: "میکرواتم هوشمند", en: "Smart MicroAtom" },
  role_student: { fa: "پنل دانش‌آموز", en: "Student" },
  role_teacher: { fa: "پنل معلم", en: "Teacher" },
  role_parent: { fa: "پنل والدین", en: "Parent" },
  role_supervisor: { fa: "ناظر پایه", en: "Grade Supervisor" },
  role_admin: { fa: "مدیر سیستم", en: "Admin" },
  switch_role: { fa: "تغییر نقش", en: "Switch role" },
  main_menu: { fa: "منو اصلی", en: "Main menu" },

  // Header
  xp_short: { fa: "امتیاز", en: "XP" },
  streak_days: { fa: "{n} روز پیاپی", en: "{n}-day streak" },
  notifications: { fa: "اعلان‌ها", en: "Notifications" },
  language: { fa: "زبان", en: "Language" },

  // Nav (student)
  nav_dashboard: { fa: "داشبورد", en: "Dashboard" },
  nav_daily: { fa: "برنامه روزانه", en: "Daily Plan" },
  nav_weekly: { fa: "برنامه هفتگی", en: "Weekly Plan" },
  nav_homework: { fa: "مرکز تکالیف", en: "Homework" },
  nav_exams: { fa: "مرکز آزمون", en: "Exams" },
  nav_progress: { fa: "پیشرفت من", en: "Progress" },
  nav_profile: { fa: "پروفایل", en: "Profile" },
  nav_tracking: { fa: "ردیابی مطالعه", en: "Study Tracking" },
  nav_planner: { fa: "برنامه‌ساز هوشمند", en: "AI Planner" },

  // Nav (teacher)
  t_nav_overview: { fa: "نمای کلی", en: "Overview" },
  t_nav_homework: { fa: "ساخت تکلیف", en: "Homework" },
  t_nav_exams: { fa: "ساخت آزمون", en: "Exams" },
  t_nav_pdf: { fa: "آپلود PDF", en: "PDF Exams" },
  t_nav_class: { fa: "تحلیل کلاس", en: "Class Analytics" },
  t_nav_students: { fa: "تحلیل دانش‌آموز", en: "Student Analytics" },

  // Nav (parent)
  p_nav_overview: { fa: "نمای کلی", en: "Overview" },
  p_nav_children: { fa: "فرزندان", en: "Children" },
  p_nav_reports: { fa: "گزارش‌ها", en: "Reports" },
  p_nav_messages: { fa: "پیام‌ها", en: "Messages" },

  // Nav (supervisor)
  s_nav_overview: { fa: "نمای کلی", en: "Overview" },
  s_nav_grade: { fa: "پایه", en: "Grade" },
  s_nav_teachers: { fa: "معلم‌ها", en: "Teachers" },
  s_nav_analytics: { fa: "تحلیل‌ها", en: "Analytics" },
  s_nav_alerts: { fa: "هشدارها", en: "Alerts" },

  // Dashboard
  hello_user: { fa: "سلام {name} عزیز 👋", en: "Hi {name} 👋" },
  hero_title: { fa: "آماده‌ای امروز رو بترکونی؟", en: "Ready to crush today?" },
  hero_sub: { fa: "۵ میکرواتم جدید توی برنامه‌ی هوش مصنوعی امروزت منتظرته.", en: "5 fresh MicroAtoms are waiting in your AI plan." },
  start_learning: { fa: "شروع یادگیری", en: "Start learning" },
  total_xp: { fa: "امتیاز کل", en: "Total XP" },
  today_delta: { fa: "+{n} امروز", en: "+{n} today" },
  streak: { fa: "روزهای پیاپی", en: "Day streak" },
  record_n: { fa: "رکورد: {n}", en: "Record: {n}" },
  mastered_microatoms: { fa: "میکرواتم تسلط‌یافته", en: "Mastered MicroAtoms" },
  out_of: { fa: "از {n}", en: "of {n}" },
  study_time_today: { fa: "زمان مطالعه امروز", en: "Study time today" },
  goal_min: { fa: "هدف: {n}′", en: "Goal: {n}m" },

  // Feature cards
  feat_daily_title: { fa: "برنامه روزانه هوشمند", en: "Smart Daily Plan" },
  feat_daily_desc: { fa: "برنامه‌ای که AI براساس نقاط ضعف و قوتت برای امروزت ساخته.", en: "An AI plan built around your strengths and gaps for today." },
  feat_daily_meta: { fa: "۵ میکرواتم • ۶۰ دقیقه", en: "5 MicroAtoms • 60 min" },
  feat_weekly_title: { fa: "برنامه هفتگی", en: "Weekly Plan" },
  feat_weekly_desc: { fa: "نقشه راه ۷ روزه با اهداف و آزمون‌های جمع‌بندی.", en: "A 7-day roadmap with goals and review exams." },
  feat_weekly_meta: { fa: "۳۲ میکرواتم این هفته", en: "32 MicroAtoms this week" },
  feat_hw_title: { fa: "مرکز تکالیف", en: "Homework Center" },
  feat_hw_desc: { fa: "تکالیف معلم‌ها در یک جا، با مهلت و وضعیت تحویل.", en: "All teacher assignments in one place with deadlines & status." },
  feat_hw_meta: { fa: "۳ تکلیف فعال", en: "3 active assignments" },
  feat_exam_title: { fa: "مرکز آزمون", en: "Exam Center" },
  feat_exam_desc: { fa: "آزمون‌های تشخیصی، تمرینی و رسمی به صورت تطبیقی.", en: "Diagnostic, practice, and official adaptive exams." },
  feat_exam_meta: { fa: "آزمون بعدی: شنبه", en: "Next exam: Saturday" },
  feat_progress_title: { fa: "ردیابی پیشرفت", en: "Progress Tracking" },
  feat_progress_desc: { fa: "نمودار تسلط در هر فصل و توصیه‌های شخصی‌سازی شده.", en: "Mastery charts per chapter with personalized tips." },
  feat_progress_meta: { fa: "میانگین تسلط ۷۲٪", en: "Avg. mastery 72%" },
  badge_new: { fa: "جدید", en: "New" },

  // AI suggestion
  ai_suggest_title: { fa: "پیشنهاد هوش مصنوعی", en: "AI Suggestion" },
  ai_suggest_body: { fa: "توی مبحث «معادله درجه دوم» نیاز به تمرین بیشتری داری. ۱۰ دقیقه وقت بذاریم؟", en: "You need more practice on “Quadratic equations”. Spend 10 minutes?" },
  quick_practice: { fa: "شروع تمرین سریع", en: "Start quick practice" },

  // Today's plan
  today_plan: { fa: "برنامه امروز", en: "Today's plan" },
  view_full: { fa: "مشاهده کامل", en: "View all" },
  mastery_subjects: { fa: "تسلط بر دروس", en: "Mastery by subject" },
  in_progress: { fa: "در حال انجام", en: "In progress" },
  done: { fa: "انجام شد", en: "Done" },
  start: { fa: "شروع", en: "Start" },

  // Daily page
  badge_ai: { fa: "ساخته شده با هوش مصنوعی", en: "Built with AI" },
  daily_title: { fa: "برنامه روزانه شما", en: "Your daily plan" },
  daily_sub: { fa: "یکشنبه، ۲۰ خرداد • {n} میکرواتم • حدود ۶۰ دقیقه", en: "Sunday, Jun 10 • {n} MicroAtoms • ~60 min" },
  rebuild_plan: { fa: "بازسازی برنامه", en: "Rebuild plan" },
  today_progress: { fa: "پیشرفت امروز", en: "Today's progress" },
  done_of_total: { fa: "{a} از {b} ({p}٪)", en: "{a} of {b} ({p}%)" },
  todays_microatoms: { fa: "میکرواتم‌های امروز", en: "Today's MicroAtoms" },
  step: { fa: "گام", en: "Step" },
  now: { fa: "اکنون", en: "Now" },
  minutes: { fa: "{n} دقیقه", en: "{n} min" },

  // Weekly page
  weekly_title: { fa: "برنامه هفتگی شما", en: "Your weekly plan" },
  weekly_sub: { fa: "هفته ۲۵ خرداد • ۳۲ میکرواتم • ۱ آزمون جمع‌بندی", en: "Week of Jun 10 • 32 MicroAtoms • 1 review exam" },
  weekly_goals: { fa: "اهداف این هفته", en: "Weekly goals" },
  week_map: { fa: "نقشه هفته", en: "Week map" },
  today: { fa: "امروز", en: "Today" },
  exam: { fa: "آزمون", en: "Exam" },

  // Homework
  hw_title: { fa: "مرکز تکالیف", en: "Homework Center" },
  hw_sub: { fa: "همه تکالیف معلم‌هات در یک جا", en: "All teacher assignments in one place" },
  all: { fa: "همه", en: "All" },
  pending: { fa: "در انتظار", en: "Pending" },
  overdue: { fa: "تأخیری", en: "Overdue" },
  completed: { fa: "انجام شده", en: "Completed" },
  total: { fa: "کل", en: "Total" },
  submit: { fa: "ارسال", en: "Submit" },
  submitted: { fa: "تحویل شده", en: "Submitted" },
  grade_label: { fa: "نمره: {s}", en: "Grade: {s}" },
  deadline: { fa: "مهلت: {d}", en: "Due: {d}" },

  // Exams
  exam_title: { fa: "مرکز آزمون", en: "Exam Center" },
  exam_sub: { fa: "آزمون‌های رسمی، تطبیقی و تمرینی", en: "Official, adaptive, and practice exams" },
  upcoming: { fa: "پیش‌رو", en: "Upcoming" },
  practice: { fa: "تمرینی", en: "Practice" },
  past: { fa: "گذشته", en: "Past" },
  reminder: { fa: "یادآور", en: "Remind me" },
  start_practice: { fa: "شروع تمرین", en: "Start practice" },
  questions_n: { fa: "{n} سؤال", en: "{n} questions" },
  correct_of: { fa: "{a} از {b} صحیح", en: "{a} of {b} correct" },

  // Progress
  progress_title: { fa: "پیشرفت من", en: "My Progress" },
  progress_sub: { fa: "روند یادگیری، تسلط و XP شما", en: "Your learning trend, mastery, and XP" },
  level_n: { fa: "سطح {n}", en: "Level {n}" },
  level_to_next: { fa: "{a} / {b} XP تا سطح بعدی", en: "{a} / {b} XP to next level" },
  current_level: { fa: "سطح فعلی", en: "Current level" },
  personal_record_n: { fa: "رکورد شخصی: {n} روز", en: "Personal record: {n} days" },
  avg_mastery: { fa: "میانگین تسلط", en: "Average mastery" },
  vs_last_week: { fa: "+{n}٪ نسبت به هفته قبل", en: "+{n}% vs. last week" },
  weekly_xp: { fa: "XP این هفته", en: "Weekly XP" },
  recent_achievements: { fa: "دستاوردهای اخیر", en: "Recent achievements" },

  // Profile
  edit: { fa: "ویرایش", en: "Edit" },
  account_info: { fa: "اطلاعات حساب", en: "Account info" },
  email_label: { fa: "ایمیل", en: "Email" },
  school_label: { fa: "مدرسه", en: "School" },
  classroom_label: { fa: "کلاس", en: "Classroom" },
} satisfies Dict;

export type TKey = keyof typeof translations;

type Ctx = {
  lang: Lang;
  dir: Dir;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: TKey, vars?: Record<string, string | number>) => string;
};

const I18nCtx = createContext<Ctx | null>(null);
const STORAGE_KEY = "ma_lang";

function format(str: string, vars?: Record<string, string | number>) {
  if (!vars) return str;
  return str.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? String(vars[k]) : `{${k}}`));
}

export function I18nProvider({ children, defaultLang = "fa" }: { children: ReactNode; defaultLang?: Lang }) {
  const [lang, setLangState] = useState<Lang>(defaultLang);

  // Load saved preference on mount (client only)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved === "fa" || saved === "en") setLangState(saved);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const dir: Dir = lang === "fa" ? "rtl" : "ltr";

  // Reflect on <html> for global RTL/LTR + form controls
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      dir,
      setLang,
      toggle: () => setLang(lang === "fa" ? "en" : "fa"),
      t: (key, vars) => format(translations[key][lang], vars),
    }),
    [lang, dir, setLang],
  );

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}

export function useT() {
  return useI18n().t;
}
