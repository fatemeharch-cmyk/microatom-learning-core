import { createFileRoute, Link } from "@tanstack/react-router";
import {
  NotebookPen,
  FileCheck2,
  BarChart3,
  Users,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/teacher/")({
  component: TeacherHome,
});

function TeacherHome() {
  const { t, lang, dir } = useI18n();
  const fa = lang === "fa";
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  const stats = [
    {
      label: fa ? "کلاس‌های فعال" : "Active classes",
      value: fa ? "۴" : "4",
      sub: fa ? "پایه ۱۰ و ۱۱" : "Grades 10 & 11",
    },
    {
      label: fa ? "دانش‌آموزان" : "Students",
      value: fa ? "۱۲۸" : "128",
      sub: fa ? "+۴ این هفته" : "+4 this week",
    },
    {
      label: fa ? "تکالیف باز" : "Open homework",
      value: fa ? "۶" : "6",
      sub: fa ? "۳ مهلت این هفته" : "3 due this week",
    },
    {
      label: fa ? "آزمون‌های پیش‌رو" : "Upcoming exams",
      value: fa ? "۲" : "2",
      sub: fa ? "ریاضی، فیزیک" : "Math, Physics",
    },
  ];

  const features = [
    {
      icon: NotebookPen,
      to: "/teacher/homework",
      title: fa ? "ساخت تکلیف" : "Create homework",
      desc: fa
        ? "تکلیف جدید با میکرواتم‌ها، مهلت و کلاس‌های هدف بساز."
        : "Build a new assignment from AtomBits with deadline and target classes.",
    },
    {
      icon: FileCheck2,
      to: "/teacher/exams",
      title: fa ? "ساخت آزمون" : "Create exam",
      desc: fa
        ? "آزمون چندبخشی با بانک سؤال و زمان‌بندی بساز."
        : "Compose a multi-section exam with question bank & schedule.",
    },
    {
      icon: BarChart3,
      to: "/teacher/analytics",
      title: fa ? "تحلیل کلاس" : "Class analytics",
      desc: fa
        ? "میانگین تسلط، فرصت‌های رشد و مشارکت هر کلاس."
        : "Mastery, growth opportunities, and engagement per class.",
    },
    {
      icon: Users,
      to: "/teacher/students",
      title: fa ? "تحلیل دانش‌آموز" : "Student analytics",
      desc: fa
        ? "گزارش فردی هر دانش‌آموز، روند رشد و هشدارها."
        : "Per-student reports, growth trend and alerts.",
    },
  ];

  const todo = [
    {
      icon: FileCheck2,
      title: fa ? "تصحیح آزمون شیمی - پایه ۱۰" : "Grade Chemistry exam - Grade 10",
      meta: fa ? "۲۴ پاسخ‌نامه" : "24 submissions",
      done: false,
    },
    {
      icon: NotebookPen,
      title: fa ? "بازبینی تکلیف ریاضی - فصل ۲" : "Review Math homework - Ch.2",
      meta: fa ? "۱۸ از ۳۰ تحویل داده‌اند" : "18 of 30 submitted",
      done: false,
    },
    {
      icon: CheckCircle2,
      title: fa ? "بازخورد آزمون فیزیک ارسال شد" : "Physics exam feedback sent",
      meta: fa ? "امروز ۱۰:۳۰" : "Today 10:30",
      done: true,
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <Badge variant="secondary" className="mb-2">
            {fa ? "پنل معلم" : "Teacher panel"}
          </Badge>
          <h1 className="text-2xl font-bold tracking-tight">
            {fa ? "سلام استاد 👋" : "Hi, Teacher 👋"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {fa
              ? "خلاصه‌ای از کلاس‌ها، تکالیف و آزمون‌های این هفته."
              : "A snapshot of your classes, homework and exams this week."}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild className="rounded-full">
            <Link to="/teacher/homework">
              <NotebookPen className="h-4 w-4" />
              {fa ? "تکلیف جدید" : "New homework"}
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/teacher/exams">
              <FileCheck2 className="h-4 w-4" />
              {fa ? "آزمون جدید" : "New exam"}
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-3xl font-extrabold mt-2">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {features.map((f) => (
          <Link key={f.to} to={f.to}>
            <Card className="hover:bg-accent/40 transition cursor-pointer h-full">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary grid place-items-center shrink-0">
                  <f.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold">{f.title}</h3>
                    <Arrow className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{fa ? "کارهای امروز" : "Today's tasks"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {todo.map((it, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl border bg-card"
            >
              <div
                className={`h-10 w-10 rounded-lg grid place-items-center shrink-0 ${
                  it.done
                    ? "bg-success/15 text-success"
                    : "bg-primary/10 text-primary"
                }`}
              >
                <it.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{it.title}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Clock className="h-3 w-3" />
                  {it.meta}
                </p>
              </div>
              {it.done ? (
                <Badge variant="secondary" className="bg-success/15 text-success border-0">
                  {fa ? "انجام شد" : "Done"}
                </Badge>
              ) : (
                <Button size="sm" variant="outline" className="rounded-full">
                  {fa ? "باز کردن" : "Open"}
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
