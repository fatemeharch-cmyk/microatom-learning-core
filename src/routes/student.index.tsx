import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  FlaskConical,
  ClipboardList,
  HeartPulse,
  Activity,
  Bell,
  Stethoscope,
  ChevronLeft,
  Sparkles,
  TrendingUp,
  BookOpen,
  Megaphone,
  Leaf,
  Atom,
  Sigma,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  CalendarDays,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import studentAvatar from "@/assets/student-avatar.png";
import bannerScience from "@/assets/banner-science.png";

export const Route = createFileRoute("/student/")({
  component: TodayPage,
});

const subjects = [
  { name: "زیست شناسی", value: 90, color: "bg-emerald-500", soft: "bg-emerald-100" },
  { name: "شیمی", value: 83, color: "bg-violet-500", soft: "bg-violet-100" },
  { name: "فیزیک", value: 78, color: "bg-sky-500", soft: "bg-sky-100" },
  { name: "ریاضی", value: 80, color: "bg-orange-500", soft: "bg-orange-100" },
  { name: "زمین شناسی", value: 85, color: "bg-teal-500", soft: "bg-teal-100" },
];

const chartData = [
  { w: "هفته ۱", v: 35 },
  { w: "هفته ۲", v: 52 },
  { w: "هفته ۳", v: 60 },
  { w: "هفته ۴", v: 72 },
  { w: "هفته ۵", v: 95 },
  { w: "هفته ۶", v: 88 },
];

const news = [
  {
    title: "وبینار: جمع‌بندی زیست فصل ۳",
    sub: "چهارشنبه ۲۷ اردیبهشت ساعت ۱۸",
    tag: "جدید",
    date: "اردیبهشت",
    Icon: FileText,
    iconTone: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "آپلود جزوه شیمی آلی ۲",
    sub: "فایل جدید در بخش منابع",
    date: "۲۴ اردیبهشت",
    Icon: ImageIcon,
    iconTone: "bg-violet-100 text-violet-600",
  },
  {
    title: "یادآوری چکاب فیزیک",
    sub: "چکاب فصل ۲ فردا برگزار می‌شود",
    date: "۲۳ اردیبهشت",
    Icon: CalendarDays,
    iconTone: "bg-orange-100 text-orange-600",
  },
];

const upcomingCheckups = [
  { subject: "زیست شناسی", date: "۲۸ اردیبهشت", Icon: Leaf, tone: "bg-emerald-100 text-emerald-600" },
  { subject: "شیمی", date: "۳۱ اردیبهشت", Icon: FlaskConical, tone: "bg-violet-100 text-violet-600" },
  { subject: "فیزیک", date: "۲۴ خرداد", Icon: Atom, tone: "bg-sky-100 text-sky-600" },
  { subject: "ریاضی", date: "۶ خرداد", Icon: Sigma, tone: "bg-orange-100 text-orange-600" },
];

const completedPrescriptions = [
  { title: "تمرین فصل ۲ زیست", Icon: Leaf, tone: "bg-emerald-100 text-emerald-600" },
  { title: "مسئله‌های شیمی آلی ۱", Icon: FlaskConical, tone: "bg-violet-100 text-violet-600" },
  { title: "آزمون آنلاین فیزیک", Icon: Atom, tone: "bg-sky-100 text-sky-600" },
  { title: "تمرین ریاضی دیفرانسیل", Icon: Sigma, tone: "bg-orange-100 text-orange-600" },
];

function TodayPage() {
  return (
    <div className="space-y-5">
      {/* Greeting */}
      <section className="text-right">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 leading-tight">
          سلام{" "}
          <span className="bg-gradient-to-l from-pink-500 to-rose-500 bg-clip-text text-transparent">
            آرمان
          </span>{" "}
          عزیز
        </h1>
        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
          <Leaf className="h-3.5 w-3.5" />
          یازدهم تجربی
        </div>
      </section>

      {/* Profile card */}
      <section>
        <Card className="border-0 rounded-[22px] shadow-sm bg-white w-full">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[160px] md:min-h-[180px] items-stretch">
              {/* Right column: info */}
              <div className="text-right order-1 flex flex-col justify-start">
                <h2 className="text-xl font-extrabold text-slate-800">آرمان محمدی</h2>
                <p className="text-sm text-slate-500 mt-1">یازدهم تجربی</p>
                <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-[11px] font-semibold self-start">
                  <span className="text-amber-500">★</span> سطح فعلی: برتر
                </div>
                <div className="mt-3">
                  <p className="text-[11px] text-slate-400">امتیاز سلامتی آموزشی</p>
                  <div className="flex items-center justify-start gap-2 mt-1">
                    <span className="text-3xl font-extrabold text-emerald-600">۸۴۶</span>
                    <HeartPulse className="h-5 w-5 text-emerald-500" />
                  </div>
                </div>
              </div>

              {/* Center column: heartbeat */}
              <div className="order-2 flex items-center justify-center h-full">
                <div className="relative w-full max-w-[320px]">
                  <div className="absolute inset-0 -m-3 rounded-3xl bg-gradient-to-r from-emerald-100/60 via-emerald-50 to-violet-100/50 blur-xl" />
                  <svg
                    viewBox="0 0 320 80"
                    className="relative w-full h-20 drop-shadow-[0_2px_8px_rgba(16,185,129,0.25)]"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="hbLine" x1="0" x2="1" y1="0" y2="0">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="75%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#a78bfa" />
                      </linearGradient>
                    </defs>
                    <polyline
                      fill="none"
                      stroke="url(#hbLine)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points="0,40 60,40 80,40 95,20 110,60 125,10 140,70 160,40 200,40 220,40 235,18 250,62 265,40 320,40"
                    />
                    <circle cx="305" cy="40" r="4" fill="#a78bfa" />
                    <circle cx="305" cy="40" r="8" fill="#a78bfa" opacity="0.25" />
                  </svg>
                </div>
              </div>

              {/* Left column: avatar */}
              <div className="order-3 flex items-center justify-start md:justify-end h-full">
                <div className="h-28 w-28 rounded-full p-[3px] bg-gradient-to-tr from-violet-400 via-pink-300 to-sky-300 shrink-0">
                  <img
                    src={studentAvatar}
                    alt="آرمان محمدی"
                    width={112}
                    height={112}
                    className="h-full w-full rounded-full object-cover bg-white"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Metric cards */}
      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <MetricCard
          icon={<Trophy className="h-7 w-7 text-amber-500 drop-shadow" />}
          iconBg="bg-gradient-to-br from-amber-100 to-orange-100"
          title="رتبه شما"
          value="۲۱"
          hint="از ۱۳۰ نفر در کلاس یازدهم تجربی"
        />
        <MetricDonut
          title="وضعیت کلی"
          value={85}
          hint="رشد عالی"
        />
        <MetricCard
          icon={<FlaskConical className="h-7 w-7 text-emerald-500 drop-shadow" />}
          iconBg="bg-gradient-to-br from-emerald-100 to-teal-100"
          title="دوز مطالعه"
          value="۳۲"
          hint="دوز این هفته"
        />
        <MetricCard
          icon={<ClipboardList className="h-7 w-7 text-violet-500 drop-shadow" />}
          iconBg="bg-gradient-to-br from-violet-100 to-indigo-100"
          title="چکاب‌های انجام شده"
          value="۴"
          hint="چکاب"
        />
        <MetricCard
          icon={<HeartPulse className="h-7 w-7 text-rose-500 drop-shadow" />}
          iconBg="bg-gradient-to-br from-rose-100 to-pink-100"
          title="سلامت یادگیری"
          value="۹۲٪"
          hint="عالی"
        />
      </section>

      {/* Subjects + Chart */}
      <section className="grid lg:grid-cols-5 gap-5">
        <Card className="lg:col-span-2 border-0 rounded-[22px] shadow-sm bg-white">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <span className="h-8 w-8 rounded-xl bg-violet-50 grid place-items-center text-violet-600">
                <BookOpen className="h-4 w-4" />
              </span>
              <h3 className="font-bold text-slate-800">وضعیت دروس</h3>
            </div>
            <div className="space-y-4">
              {subjects.map((s) => (
                <div key={s.name} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 w-10 text-left">
                    {toFa(s.value)}٪
                  </span>
                  <div className="flex-1">
                    <div className={`relative h-2 rounded-full ${s.soft}`}>
                      <div
                        className={`h-full rounded-full ${s.color}`}
                        style={{ width: `${s.value}%` }}
                      />
                      <span
                        className={`absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full ${s.color} shadow ring-2 ring-white`}
                        style={{ right: `calc(${s.value}% - 6px)` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-slate-700 w-20 text-right">{s.name}</span>
                </div>
              ))}
            </div>
            <Button
              asChild
              variant="ghost"
              className="w-full rounded-full bg-emerald-50/70 hover:bg-emerald-100 text-emerald-700 font-semibold"
            >
              <Link to="/student/progress">مشاهده جزئیات دروس</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-0 rounded-[22px] shadow-sm bg-white">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="px-3 py-1.5 rounded-full bg-slate-50 text-slate-500 text-[11px] font-semibold inline-flex items-center gap-1">
                این ماه ▾
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-semibold">
                <Sparkles className="h-3 w-3" /> رشد پیوسته عالیه!
              </span>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800">نمودار پیشرفت</h3>
                <span className="h-8 w-8 rounded-xl bg-violet-50 grid place-items-center text-violet-600">
                  <TrendingUp className="h-4 w-4" />
                </span>
              </div>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 12, left: 12, bottom: 0 }}>
                  <CartesianGrid stroke="#eef0fb" vertical={false} />
                  <XAxis
                    dataKey="w"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    reversed
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    width={32}
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}٪`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #ede9fe",
                      fontSize: 12,
                    }}
                    formatter={(v: number) => [`${v}٪`, "پیشرفت"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="v"
                    stroke="#7c3aed"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "#7c3aed", stroke: "#fff", strokeWidth: 2 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Bottom three cards */}
      <section className="grid lg:grid-cols-3 gap-5">
        {/* Completed prescriptions */}
        <Card className="border-0 rounded-[22px] shadow-sm bg-white">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <Link to="/student/planner" className="text-[11px] text-slate-400 hover:text-violet-600">
                مشاهده همه
              </Link>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800">نسخه‌های تکمیل شده</h3>
                <span className="h-8 w-8 rounded-xl bg-emerald-50 grid place-items-center text-emerald-600">
                  <ClipboardList className="h-4 w-4" />
                </span>
              </div>
            </div>
            <div className="space-y-2">
              {completedPrescriptions.map((p) => (
                <div
                  key={p.title}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50/70"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-700">{p.title}</span>
                    <span className={`h-9 w-9 rounded-xl grid place-items-center ${p.tone}`}>
                      <p.Icon className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Button
              asChild
              variant="ghost"
              className="w-full rounded-full bg-emerald-50/70 hover:bg-emerald-100 text-emerald-700 font-semibold"
            >
              <Link to="/student/planner">مشاهده همه نسخه‌ها</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Checkups */}
        <Card className="border-0 rounded-[22px] shadow-sm bg-white">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <Link to="/student/exams" className="text-[11px] text-slate-400 hover:text-violet-600">
                مشاهده همه
              </Link>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800">چکاب‌های آینده</h3>
                <span className="h-8 w-8 rounded-xl bg-sky-50 grid place-items-center text-sky-600">
                  <Stethoscope className="h-4 w-4" />
                </span>
              </div>
            </div>
            <div className="space-y-2">
              {upcomingCheckups.map((c) => (
                <div
                  key={c.subject}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50/70"
                >
                  <span className="text-[11px] text-slate-500">{c.date}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-700">{c.subject}</span>
                    <span className={`h-9 w-9 rounded-xl grid place-items-center ${c.tone}`}>
                      <c.Icon className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Button
              asChild
              variant="ghost"
              className="w-full rounded-full bg-violet-50/70 hover:bg-violet-100 text-violet-700 font-semibold"
            >
              <Link to="/student/exams">مشاهده همه چکاب‌ها</Link>
            </Button>
          </CardContent>
        </Card>

        {/* News */}
        <Card className="border-0 rounded-[22px] shadow-sm bg-white">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <Link to="/student/notebook" className="text-[11px] text-slate-400 hover:text-violet-600">
                مشاهده همه
              </Link>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800">اخبار و هشدارهای پزشکی آموزشی</h3>
                <span className="h-8 w-8 rounded-xl bg-violet-50 grid place-items-center text-violet-600">
                  <Megaphone className="h-4 w-4" />
                </span>
              </div>
            </div>
            <div className="space-y-2">
              {news.map((n) => (
                <div
                  key={n.title}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50/70"
                >
                  <div className="flex flex-col items-start gap-1">
                    {n.tag && (
                      <Badge className="bg-emerald-100 text-emerald-700 border-0 rounded-full text-[9px] h-4 px-1.5">
                        {n.tag}
                      </Badge>
                    )}
                    <span className="text-[10px] text-slate-400">{n.date}</span>
                  </div>
                  <div className="flex items-center gap-3 flex-1 justify-end min-w-0">
                    <div className="min-w-0 text-right">
                      <p className="text-sm font-semibold text-slate-700 truncate">{n.title}</p>
                      <p className="text-[11px] text-slate-400 truncate">{n.sub}</p>
                    </div>
                    <span className={`h-9 w-9 rounded-xl grid place-items-center shrink-0 ${n.iconTone}`}>
                      <n.Icon className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Button
              asChild
              variant="ghost"
              className="w-full rounded-full bg-violet-50/70 hover:bg-violet-100 text-violet-700 font-semibold"
            >
              <Link to="/student/notebook">مشاهده همه اطلاعیه‌ها</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Banner */}
      <section>
        <Card className="border-0 rounded-[22px] overflow-hidden bg-gradient-to-l from-violet-100 via-pink-50 to-sky-100 shadow-sm">
          <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
            <img
              src={bannerScience}
              alt=""
              width={320}
              height={160}
              loading="lazy"
              className="h-28 md:h-32 w-auto object-contain shrink-0"
            />
            <div className="flex-1 text-center md:text-right">
              <p className="text-lg md:text-xl font-extrabold text-slate-800 leading-snug">
                "موفقیت مجموعه‌ای از تلاش‌های کوچک تکرارشونده است."
              </p>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed flex items-center justify-center md:justify-end gap-1.5">
                امروز یک قدم کوچک‌تر بردار، فردا یک نسخه قوی‌تر برای آینده‌ات بنویس
                <HeartPulse className="h-4 w-4 text-rose-500" />
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function MetricCard({
  icon,
  iconBg,
  title,
  value,
  hint,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  value: string;
  hint: string;
}) {
  return (
    <Card className="border-0 rounded-[22px] shadow-sm bg-white">
      <CardContent className="p-4 flex items-center gap-4">
        <div className={`h-14 w-14 rounded-2xl grid place-items-center shrink-0 ${iconBg}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0 text-right">
          <p className="text-[11px] text-slate-400">{title}</p>
          <p className="text-2xl font-extrabold text-slate-800 mt-0.5">{value}</p>
          <p className="text-[10px] text-slate-400 mt-1 leading-snug">{hint}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function MetricDonut({
  title,
  value,
  hint,
}: {
  title: string;
  value: number;
  hint: string;
}) {
  const dash = (value / 100) * 100.5;
  return (
    <Card className="border-0 rounded-[22px] shadow-sm bg-white">
      <CardContent className="p-4 flex items-center gap-4">
        <div className="relative h-14 w-14 shrink-0">
          <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
            <defs>
              <linearGradient id="donutGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f472b6" />
                <stop offset="60%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
            <circle cx="18" cy="18" r="16" fill="none" stroke="#f3eefe" strokeWidth="4" />
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="url(#donutGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${dash} 100.5`}
            />
          </svg>
          <span className="absolute inset-0 grid place-items-center text-[11px] font-extrabold text-violet-700">
            {toFa(value)}٪
          </span>
        </div>
        <div className="flex-1 min-w-0 text-right">
          <p className="text-[11px] text-slate-400">{title}</p>
          <p className="text-2xl font-extrabold text-slate-800 mt-0.5">{toFa(value)}٪</p>
          <p className="text-[10px] text-slate-400 mt-1">{hint}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function toFa(n: number | string): string {
  const map: Record<string, string> = {
    "0": "۰", "1": "۱", "2": "۲", "3": "۳", "4": "۴",
    "5": "۵", "6": "۶", "7": "۷", "8": "۸", "9": "۹",
  };
  return String(n).replace(/[0-9]/g, (d) => map[d] ?? d);
}

// Suppress unused import warnings for icons reserved for future cards.
void Activity;
void Bell;
void ChevronLeft;
