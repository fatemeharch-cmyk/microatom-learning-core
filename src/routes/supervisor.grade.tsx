import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  BookOpen,
  Stethoscope,
} from "lucide-react";

const summary = [
  {
    label: "تعداد دانش‌آموزان",
    value: "۱۲۸",
    icon: Users,
    tint: "bg-sky-50 text-sky-600",
  },
  {
    label: "کلاس‌ها",
    value: "۴",
    icon: GraduationCap,
    tint: "bg-violet-50 text-violet-600",
  },
  {
    label: "میانگین رشد",
    value: "۷۸٪",
    icon: TrendingUp,
    tint: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "هشدارهای فعال",
    value: "۶",
    icon: AlertTriangle,
    tint: "bg-amber-50 text-amber-600",
  },
];

type ClassStatus = "خوب" | "نیاز به پیگیری" | "پایدار" | "هشدار آموزشی";

const classes: {
  name: string;
  growth: number;
  growthLabel: string;
  checkups: string;
  status: ClassStatus;
}[] = [
  {
    name: "یازدهم تجربی ۱",
    growth: 82,
    growthLabel: "۸۲٪",
    checkups: "۲۴",
    status: "خوب",
  },
  {
    name: "یازدهم تجربی ۲",
    growth: 74,
    growthLabel: "۷۴٪",
    checkups: "۱۹",
    status: "نیاز به پیگیری",
  },
  {
    name: "یازدهم تجربی ۳",
    growth: 80,
    growthLabel: "۸۰٪",
    checkups: "۲۱",
    status: "پایدار",
  },
  {
    name: "یازدهم تجربی ۴",
    growth: 69,
    growthLabel: "۶۹٪",
    checkups: "۱۶",
    status: "هشدار آموزشی",
  },
];

const statusStyles: Record<ClassStatus, string> = {
  "خوب": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "پایدار": "bg-sky-50 text-sky-700 border-sky-200",
  "نیاز به پیگیری": "bg-amber-50 text-amber-700 border-amber-200",
  "هشدار آموزشی": "bg-rose-50 text-rose-700 border-rose-200",
};

const weakConcepts = [
  { title: "تنفس سلولی", subject: "زیست‌شناسی", tint: "bg-emerald-50 text-emerald-600" },
  { title: "معادله درجه دوم", subject: "ریاضی", tint: "bg-violet-50 text-violet-600" },
  { title: "الکتریسیته ساکن", subject: "فیزیک", tint: "bg-sky-50 text-sky-600" },
  { title: "آرایه‌های ادبی", subject: "ادبیات", tint: "bg-rose-50 text-rose-600" },
];

function GradeStatusPage() {
  return (
    <div dir="rtl" className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">وضعیت پایه</h1>
        <p className="text-sm text-muted-foreground">
          نمای کلی کلاس‌ها، سلامت آموزشی و روند رشد پایه یازدهم تجربی
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summary.map((s) => {
          const Icon = s.icon;
          return (
            <Card
              key={s.label}
              className="rounded-2xl border-none bg-white shadow-sm shadow-slate-100"
            >
              <CardContent className="flex items-center justify-between gap-4 p-5">
                <div className="space-y-1 text-right">
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${s.tint}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">عملکرد کلاس‌ها</h2>
          <span className="text-xs text-muted-foreground">به‌روزرسانی این هفته</span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {classes.map((c) => (
            <Card
              key={c.name}
              className="rounded-2xl border-none bg-white shadow-sm shadow-slate-100"
            >
              <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base font-semibold text-foreground">
                    {c.name}
                  </CardTitle>
                </div>
                <Badge
                  variant="outline"
                  className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[c.status]}`}
                >
                  {c.status}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">رشد</span>
                    <span className="font-semibold text-foreground">{c.growthLabel}</span>
                  </div>
                  <Progress value={c.growth} className="h-2" />
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Stethoscope className="h-4 w-4 text-sky-500" />
                    چکاب‌های انجام‌شده
                  </span>
                  <span className="font-semibold text-foreground">{c.checkups}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <Card className="rounded-2xl border-none bg-white shadow-sm shadow-slate-100">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <BookOpen className="h-5 w-5" />
              </div>
              مفاهیم نیازمند توجه
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {weakConcepts.map((w) => (
                <li
                  key={w.title}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${w.tint}`}>
                      <BookOpen className="h-4 w-4" />
                    </span>
                    <span className="font-medium text-foreground">{w.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{w.subject}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export const Route = createFileRoute("/supervisor/grade")({
  component: GradeStatusPage,
});
