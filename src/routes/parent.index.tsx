import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Download,
  FileBarChart,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/parent/")({
  component: ParentOverview,
});

const childrenFA = [
  { id: "c1", name: "آرش رضایی", grade: "پایه ۱۰", initial: "آ" },
  { id: "c2", name: "نازنین رضایی", grade: "پایه ۸", initial: "ن" },
];
const childrenEN = [
  { id: "c1", name: "Arash Rezaei", grade: "Grade 10", initial: "A" },
  { id: "c2", name: "Nazanin Rezaei", grade: "Grade 8", initial: "N" },
];

const weakFA = [
  { name: "حل معادله درجه دوم", subject: "ریاضی", mastery: 38 },
  { name: "قانون دوم نیوتن", subject: "فیزیک", mastery: 44 },
  { name: "موازنه واکنش", subject: "شیمی", mastery: 52 },
];
const weakEN = [
  { name: "Solving quadratic equations", subject: "Math", mastery: 38 },
  { name: "Newton's second law", subject: "Physics", mastery: 44 },
  { name: "Balancing reactions", subject: "Chemistry", mastery: 52 },
];

const strongFA = [
  { name: "ضرب چندجمله‌ای", subject: "ریاضی", mastery: 96 },
  { name: "زمان حال ساده", subject: "زبان انگلیسی", mastery: 94 },
  { name: "نسبت‌های مثلثاتی", subject: "ریاضی", mastery: 91 },
];
const strongEN = [
  { name: "Polynomial multiplication", subject: "Math", mastery: 96 },
  { name: "Present simple", subject: "English", mastery: 94 },
  { name: "Trigonometric ratios", subject: "Math", mastery: 91 },
];

const weekDaysFA = ["ش", "ی", "د", "س", "چ", "پ", "ج"];
const weekDaysEN = ["S", "M", "T", "W", "T", "F", "S"];
const studyMinutes = [55, 70, 40, 65, 80, 25, 60]; // per day

const reportsFA = [
  { week: "هفته ۲۳ خرداد", summary: "+۸٪ تسلط، ۲۸۰ دقیقه مطالعه، ۹ از ۱۰ تکلیف.", trend: "up" },
  { week: "هفته ۱۶ خرداد", summary: "+۳٪ تسلط، ۲۴۰ دقیقه مطالعه، ۷ از ۱۰ تکلیف.", trend: "up" },
  { week: "هفته ۹ خرداد", summary: "−۲٪ تسلط، ۱۸۰ دقیقه مطالعه، ۶ از ۹ تکلیف.", trend: "down" },
];
const reportsEN = [
  { week: "Week of Jun 13", summary: "+8% mastery, 280 min study, 9/10 homework.", trend: "up" },
  { week: "Week of Jun 6", summary: "+3% mastery, 240 min study, 7/10 homework.", trend: "up" },
  { week: "Week of May 30", summary: "−2% mastery, 180 min study, 6/9 homework.", trend: "down" },
];

function toFa(n: number | string) {
  const map = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(n).replace(/\d/g, (d) => map[Number(d)]);
}

function ParentOverview() {
  const { lang } = useI18n();
  const fa = lang === "fa";

  const children = fa ? childrenFA : childrenEN;
  const weak = fa ? weakFA : weakEN;
  const strong = fa ? strongFA : strongEN;
  const reports = fa ? reportsFA : reportsEN;
  const weekDays = fa ? weekDaysFA : weekDaysEN;
  const [activeId, setActiveId] = useState(children[0].id);
  const active = children.find((c) => c.id === activeId) ?? children[0];

  const hwDone = 9;
  const hwTotal = 10;
  const hwPct = Math.round((hwDone / hwTotal) * 100);
  const totalMin = studyMinutes.reduce((a, b) => a + b, 0);
  const goalMin = 420;
  const studyPct = Math.min(100, Math.round((totalMin / goalMin) * 100));
  const maxDay = Math.max(...studyMinutes);
  const num = (n: number) => (fa ? toFa(n) : String(n));

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Hero / child switcher */}
      <Card className="overflow-hidden border-0 bg-[image:var(--gradient-primary)] text-primary-foreground">
        <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <Badge variant="secondary" className="bg-white/15 text-primary-foreground border-0 mb-2">
              <Sparkles className="h-3 w-3 mx-1" />
              {fa ? "پنل والدین" : "Parent panel"}
            </Badge>
            <h1 className="text-xl sm:text-2xl font-bold">
              {fa ? `پیشرفت ${active.name}` : `${active.name}'s progress`}
            </h1>
            <p className="text-sm opacity-90 mt-1">
              {fa
                ? "نگاهی سریع به عملکرد هفتگی، تکالیف و نقاط قوت و ضعف."
                : "A quick look at weekly performance, homework, and strengths & gaps."}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {children.map((c) => {
              const a = c.id === activeId;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={`flex items-center gap-2 rounded-full pl-1 pr-3 py-1 text-xs transition ${
                    a ? "bg-white text-primary" : "bg-white/15 text-primary-foreground hover:bg-white/25"
                  }`}
                >
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className={a ? "bg-primary text-primary-foreground text-[10px]" : "bg-white/30 text-[10px]"}>
                      {c.initial}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{c.name}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={<CheckCircle2 className="h-4 w-4" />}
          label={fa ? "تکالیف انجام‌شده" : "Homework done"}
          value={`${num(hwDone)}/${num(hwTotal)}`}
          sub={`${num(hwPct)}%`}
          tone="success"
        />
        <StatCard
          icon={<Clock className="h-4 w-4" />}
          label={fa ? "زمان مطالعه (هفته)" : "Study time (week)"}
          value={`${num(totalMin)} ${fa ? "د" : "m"}`}
          sub={fa ? `هدف: ${num(goalMin)} د` : `Goal: ${goalMin}m`}
          tone="primary"
        />
        <StatCard
          icon={<TrendingUp className="h-4 w-4" />}
          label={fa ? "میانگین تسلط" : "Avg. mastery"}
          value={`${num(72)}%`}
          sub={fa ? `+${num(5)}% از هفته قبل` : "+5% vs last week"}
          tone="xp"
        />
        <StatCard
          icon={<Activity className="h-4 w-4" />}
          label={fa ? "روزهای پیاپی" : "Active streak"}
          value={`${num(12)} ${fa ? "روز" : "d"}`}
          sub={fa ? `رکورد: ${num(18)}` : "Record: 18"}
          tone="warning"
        />
      </div>

      {/* Homework + Study chart */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span>{fa ? "تکمیل تکالیف این هفته" : "Homework completion this week"}</span>
              <Badge variant="secondary" className="bg-success/15 text-success border-0">
                {num(hwPct)}%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={hwPct} className="h-2.5" />
            <div className="grid grid-cols-3 gap-2 text-center">
              <MiniStat label={fa ? "تحویل‌شده" : "Submitted"} value={num(9)} tone="success" />
              <MiniStat label={fa ? "در انتظار" : "Pending"} value={num(1)} tone="warning" />
              <MiniStat label={fa ? "تأخیری" : "Overdue"} value={num(0)} tone="destructive" />
            </div>
            <div className="space-y-2">
              {(fa
                ? [
                    { t: "تمرین معادله درجه دوم", s: "تحویل‌شده", ok: true },
                    { t: "آزمایش حرکت پرتابی", s: "تحویل‌شده", ok: true },
                    { t: "گزارش کتاب ادبیات", s: "در انتظار", ok: false },
                  ]
                : [
                    { t: "Quadratic practice set", s: "Submitted", ok: true },
                    { t: "Projectile motion lab", s: "Submitted", ok: true },
                    { t: "Literature book report", s: "Pending", ok: false },
                  ]
              ).map((h, i) => (
                <div key={i} className="flex items-center justify-between text-sm p-2 rounded-lg border">
                  <span className="truncate">{h.t}</span>
                  <Badge
                    variant="secondary"
                    className={`${h.ok ? "bg-success/15 text-success" : "bg-warning/15 text-warning"} border-0 text-[10px]`}
                  >
                    {h.s}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span>{fa ? "زمان مطالعه روزانه" : "Daily study time"}</span>
              <Badge variant="secondary" className="bg-primary/15 text-primary border-0">
                {num(studyPct)}%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-2 h-36">
              {studyMinutes.map((m, i) => {
                const h = Math.max(6, Math.round((m / maxDay) * 100));
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex flex-col justify-end h-28">
                      <div
                        className="w-full rounded-md bg-[image:var(--gradient-primary)] transition-all"
                        style={{ height: `${h}%` }}
                        title={`${m} ${fa ? "دقیقه" : "min"}`}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground">{weekDays[i]}</span>
                    <span className="text-[10px] font-semibold">{num(m)}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              {fa
                ? `جمع هفته: ${num(totalMin)} دقیقه از هدف ${num(goalMin)} دقیقه`
                : `Total: ${totalMin} of ${goalMin} min goal`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Weak + Strong MicroAtoms */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              {fa ? "میکرواتم‌های ضعیف" : "Weak MicroAtoms"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {weak.map((w, i) => (
              <div key={i} className="p-3 rounded-xl border">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{w.name}</p>
                    <p className="text-[11px] text-muted-foreground">{w.subject}</p>
                  </div>
                  <Badge variant="secondary" className="bg-destructive/15 text-destructive border-0">
                    {num(w.mastery)}%
                  </Badge>
                </div>
                <Progress value={w.mastery} className="h-1.5" />
              </div>
            ))}
            <Button variant="outline" size="sm" className="rounded-full w-full">
              {fa ? "پیشنهاد تمرین تقویتی" : "Suggest reinforcement plan"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-success" />
              {fa ? "میکرواتم‌های قوی" : "Strong MicroAtoms"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {strong.map((s, i) => (
              <div key={i} className="p-3 rounded-xl border">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{s.name}</p>
                    <p className="text-[11px] text-muted-foreground">{s.subject}</p>
                  </div>
                  <Badge variant="secondary" className="bg-success/15 text-success border-0">
                    {num(s.mastery)}%
                  </Badge>
                </div>
                <Progress value={s.mastery} className="h-1.5" />
              </div>
            ))}
            <Button variant="outline" size="sm" className="rounded-full w-full">
              {fa ? "تشویق و پیام برای فرزند" : "Send encouragement"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Weekly reports */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileBarChart className="h-4 w-4 text-primary" />
              {fa ? "گزارش‌های هفتگی" : "Weekly reports"}
            </span>
            <Button size="sm" variant="outline" className="rounded-full">
              <Download className="h-3.5 w-3.5 mx-1" />
              {fa ? "دانلود همه" : "Download all"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {reports.map((r, i) => {
            const up = r.trend === "up";
            return (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl border hover:bg-muted/40 transition"
              >
                <div
                  className={`h-9 w-9 rounded-lg grid place-items-center shrink-0 ${
                    up ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
                  }`}
                >
                  {up ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{r.week}</p>
                  <p className="text-xs text-muted-foreground truncate">{r.summary}</p>
                </div>
                <Button size="sm" variant="ghost" className="rounded-full">
                  {fa ? "مشاهده" : "View"}
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  tone: "primary" | "success" | "warning" | "xp";
}) {
  const map: Record<string, string> = {
    primary: "bg-primary/15 text-primary",
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
    xp: "bg-xp/15 text-xp",
  };
  return (
    <Card>
      <CardContent className="p-4">
        <div className={`h-8 w-8 rounded-lg grid place-items-center mb-2 ${map[tone]}`}>
          {icon}
        </div>
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="text-lg font-bold mt-0.5 truncate">{value}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{sub}</p>
      </CardContent>
    </Card>
  );
}

function MiniStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "success" | "warning" | "destructive";
}) {
  const map: Record<string, string> = {
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    destructive: "bg-destructive/10 text-destructive",
  };
  return (
    <div className={`rounded-lg py-2 ${map[tone]}`}>
      <p className="text-lg font-bold">{value}</p>
      <p className="text-[10px]">{label}</p>
    </div>
  );
}
