import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  GraduationCap,
  Layers,
  MessageSquare,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/supervisor/")({
  component: SupervisorOverview,
});

const gradesFA = ["پایه ۹", "پایه ۱۰", "پایه ۱۱", "پایه ۱۲"];
const gradesEN = ["Grade 9", "Grade 10", "Grade 11", "Grade 12"];

const subjectsFA = [
  { name: "ادبیات", mastery: 58, delta: -3 },
  { name: "شیمی", mastery: 61, delta: -1 },
  { name: "فیزیک", mastery: 64, delta: 2 },
  { name: "ریاضی", mastery: 68, delta: 4 },
  { name: "زبان انگلیسی", mastery: 76, delta: 5 },
];
const subjectsEN = [
  { name: "Literature", mastery: 58, delta: -3 },
  { name: "Chemistry", mastery: 61, delta: -1 },
  { name: "Physics", mastery: 64, delta: 2 },
  { name: "Math", mastery: 68, delta: 4 },
  { name: "English", mastery: 76, delta: 5 },
];

const microFA = [
  { name: "تحلیل شعر کلاسیک", subject: "ادبیات", mastery: 34, students: 142 },
  { name: "موازنه واکنش‌های شیمیایی", subject: "شیمی", mastery: 38, students: 156 },
  { name: "حل معادله درجه دوم", subject: "ریاضی", mastery: 41, students: 168 },
  { name: "قانون دوم نیوتن", subject: "فیزیک", mastery: 44, students: 151 },
  { name: "زمان گذشته کامل", subject: "زبان انگلیسی", mastery: 47, students: 139 },
];
const microEN = [
  { name: "Classical poetry analysis", subject: "Literature", mastery: 34, students: 142 },
  { name: "Balancing reactions", subject: "Chemistry", mastery: 38, students: 156 },
  { name: "Solving quadratic equations", subject: "Math", mastery: 41, students: 168 },
  { name: "Newton's second law", subject: "Physics", mastery: 44, students: 151 },
  { name: "Past perfect tense", subject: "English", mastery: 47, students: 139 },
];

const supportFA = [
  { name: "مهدی کاظمی", cls: "۱۰-الف", mastery: 38, missed: 5, reason: "فرصت تقویت تداوم تکالیف و تسلط" },
  { name: "سارا محمدی", cls: "۱۰-ب", mastery: 42, missed: 4, reason: "فرصت رشد پس از آزمون اخیر" },
  { name: "علی نوری", cls: "۱۱-ج", mastery: 45, missed: 6, reason: "فرصت بازگشت به مسیر یادگیری" },
  { name: "نگار حسینی", cls: "۹-الف", mastery: 47, missed: 3, reason: "فرصت همراهی برای رشد هفتگی" },
];
const supportEN = [
  { name: "Mehdi Kazemi", cls: "10-A", mastery: 38, missed: 5, reason: "Opportunity to strengthen homework consistency and mastery" },
  { name: "Sara Mohammadi", cls: "10-B", mastery: 42, missed: 4, reason: "Growth opportunity after the recent exam" },
  { name: "Ali Nouri", cls: "11-C", mastery: 45, missed: 6, reason: "Opportunity to reconnect with the learning journey" },
  { name: "Negar Hosseini", cls: "9-A", mastery: 47, missed: 3, reason: "Support opportunity for weekly growth" },
];

const teachersFA = [
  { name: "خانم رحیمی", subject: "ریاضی", classes: 4, students: 112, classAvg: 74, trend: 4 },
  { name: "آقای کریمی", subject: "فیزیک", classes: 3, students: 86, classAvg: 67, trend: 2 },
  { name: "خانم احمدی", subject: "شیمی", classes: 3, students: 92, classAvg: 61, trend: -2 },
  { name: "آقای جعفری", subject: "ادبیات", classes: 4, students: 104, classAvg: 58, trend: -3 },
  { name: "خانم نیک‌نام", subject: "زبان انگلیسی", classes: 5, students: 130, classAvg: 78, trend: 5 },
];
const teachersEN = [
  { name: "Ms. Rahimi", subject: "Math", classes: 4, students: 112, classAvg: 74, trend: 4 },
  { name: "Mr. Karimi", subject: "Physics", classes: 3, students: 86, classAvg: 67, trend: 2 },
  { name: "Ms. Ahmadi", subject: "Chemistry", classes: 3, students: 92, classAvg: 61, trend: -2 },
  { name: "Mr. Jafari", subject: "Literature", classes: 4, students: 104, classAvg: 58, trend: -3 },
  { name: "Ms. Niknam", subject: "English", classes: 5, students: 130, classAvg: 78, trend: 5 },
];

function toFa(n: number | string) {
  const map = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(n).replace(/\d/g, (d) => map[Number(d)]);
}

function SupervisorOverview() {
  const { lang } = useI18n();
  const fa = lang === "fa";
  const grades = fa ? gradesFA : gradesEN;
  const subjects = fa ? subjectsFA : subjectsEN;
  const micro = fa ? microFA : microEN;
  const support = fa ? supportFA : supportEN;
  const teachers = fa ? teachersFA : teachersEN;
  const [grade, setGrade] = useState(grades[1]);
  const num = (n: number | string) => (fa ? toFa(n) : String(n));

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Hero */}
      <Card className="overflow-hidden border-0 bg-[image:var(--gradient-primary)] text-primary-foreground">
        <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <Badge variant="secondary" className="bg-white/15 text-primary-foreground border-0 mb-2">
              <Sparkles className="h-3 w-3 mx-1" />
              {fa ? "ناظر پایه" : "Grade Supervisor"}
            </Badge>
            <h1 className="text-xl sm:text-2xl font-bold">
              {fa ? `نمای ${grade}` : `${grade} overview`}
            </h1>
            <p className="text-sm opacity-90 mt-1">
              {fa
                 ? "روند رشد، فرصت‌های یادگیری و مسیر همراهی دانش‌آموزان و معلم‌ها."
                 : "Growth trends, learning opportunities, and support pathways for students and teachers."}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {grades.map((g) => {
              const a = g === grade;
              return (
                <button
                  key={g}
                  onClick={() => setGrade(g)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    a ? "bg-white text-primary" : "bg-white/15 hover:bg-white/25"
                  }`}
                >
                  {g}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={<Users className="h-4 w-4" />} label={fa ? "دانش‌آموزان" : "Students"} value={num(428)} sub={fa ? `${num(18)} کلاس` : "18 classes"} tone="primary" />
        <StatCard icon={<GraduationCap className="h-4 w-4" />} label={fa ? "معلم‌ها" : "Teachers"} value={num(22)} sub={fa ? `۵ درس` : "5 subjects"} tone="success" />
        <StatCard icon={<TrendingUp className="h-4 w-4" />} label={fa ? "میانگین تسلط" : "Avg. mastery"} value={`${num(67)}%`} sub={fa ? `+${num(3)}% هفتگی` : "+3% weekly"} tone="xp" />
        <StatCard icon={<AlertTriangle className="h-4 w-4" />} label={fa ? "فرصت همراهی" : "Support opportunities"} value={num(24)} sub={fa ? `${num(6)}% کل` : "6% of total"} tone="warning" />
      </div>

      {/* Subject and AtomBit growth opportunities */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
               {fa ? "فرصت‌های رشد دروس" : "Subject Growth Opportunities"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {subjects.map((s) => {
              const down = s.delta < 0;
              return (
                <div key={s.name}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-medium truncate">{s.name}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] flex items-center gap-0.5 ${down ? "text-destructive" : "text-success"}`}>
                        {down ? <ArrowDownRight className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
                        {num(Math.abs(s.delta))}%
                      </span>
                      <span className="text-muted-foreground text-xs w-10 text-end">{num(s.mastery)}%</span>
                    </div>
                  </div>
                  <Progress value={s.mastery} className="h-1.5" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-destructive" />
               {fa ? "فرصت‌های رشد اتم‌بیت" : "AtomBit Growth Opportunities"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {micro.map((m, i) => (
              <div key={i} className="p-3 rounded-xl border">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{m.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {m.subject} • {num(m.students)} {fa ? "نفر" : "students"}
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-destructive/15 text-destructive border-0">
                    {num(m.mastery)}%
                  </Badge>
                </div>
                <Progress value={m.mastery} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* At-risk students */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
               {fa ? "فرصت‌های همراهی دانش‌آموزان" : "Student Support Opportunities"}
            </span>
            <Badge variant="secondary" className="bg-destructive/15 text-destructive border-0">
               {num(support.length)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
           {support.map((s, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl border hover:bg-muted/40 transition">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-destructive/15 text-destructive text-xs">
                  {s.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-sm truncate">{s.name}</p>
                  <Badge variant="secondary" className="text-[10px]">{s.cls}</Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">{s.reason}</p>
              </div>
              <div className="text-end shrink-0">
                <p className="text-sm font-bold text-destructive">{num(s.mastery)}%</p>
                <p className="text-[10px] text-muted-foreground">
                  {num(s.missed)} {fa ? "غیبت" : "missed"}
                </p>
              </div>
              <Button size="sm" variant="outline" className="rounded-full shrink-0">
                <MessageSquare className="h-3.5 w-3.5 mx-1" />
                {fa ? "تماس" : "Contact"}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Teachers overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            {fa ? "نمای کلی معلم‌ها" : "Teacher overview"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {teachers.map((t, i) => {
            const up = t.trend >= 0;
            return (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl border hover:bg-muted/40 transition">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/15 text-primary text-xs">
                    {t.name.split(" ").pop()?.charAt(0) ?? "T"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm truncate">{t.name}</p>
                    <Badge variant="secondary" className="text-[10px]">{t.subject}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {num(t.classes)} {fa ? "کلاس" : "classes"} • {num(t.students)} {fa ? "دانش‌آموز" : "students"}
                  </p>
                </div>
                <div className="text-end shrink-0">
                  <p className="text-sm font-bold">{num(t.classAvg)}%</p>
                  <p className={`text-[10px] flex items-center gap-0.5 justify-end ${up ? "text-success" : "text-destructive"}`}>
                    {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {num(Math.abs(t.trend))}%
                  </p>
                </div>
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
        <div className={`h-8 w-8 rounded-lg grid place-items-center mb-2 ${map[tone]}`}>{icon}</div>
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="text-lg font-bold mt-0.5 truncate">{value}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{sub}</p>
      </CardContent>
    </Card>
  );
}
