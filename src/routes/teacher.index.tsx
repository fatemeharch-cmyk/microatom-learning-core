import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sun,
  Clock,
  ClipboardEdit,
  NotebookPen,
  FileCheck2,
  Sparkles,
  ChevronLeft,
} from "lucide-react";

export const Route = createFileRoute("/teacher/")({
  component: TeacherDashboard,
});

const today = [
  { period: "زنگ ۱", time: "۸:۰۰", class: "یازدهم تجربی ۱", subject: "زیست‌شناسی" },
  { period: "زنگ ۲", time: "۹:۰۰", class: "یازدهم تجربی ۲", subject: "زیست‌شناسی" },
  { period: "زنگ ۴", time: "۱۱:۱۵", class: "یازدهم تجربی ۳", subject: "زیست‌شناسی" },
];

const pendingLogs = [
  { class: "یازدهم تجربی ۱", date: "امروز", period: "زنگ ۱" },
  { class: "یازدهم تجربی ۲", date: "دیروز", period: "زنگ ۳" },
];

const activeHomework = [
  { title: "تمرین‌های فصل ۲", class: "یازدهم تجربی ۱", due: "فردا" },
  { title: "خلاصه مبحث تنفس سلولی", class: "یازدهم تجربی ۲", due: "۳ روز دیگر" },
];

const activeQuizzes = [
  { title: "آزمونک تنفس سلولی", class: "یازدهم تجربی ۱", participation: "۲۲ از ۲۸" },
];

const reminders = [
  "ثبت کلاس امروز را تا پایان روز تکمیل کنید.",
  "بازخورد آزمونک یازدهم ۲ آماده مشاهده است.",
];

function TeacherDashboard() {
  return (
    <div className="space-y-6" dir="rtl">
      <Card className="overflow-hidden border-0 bg-[image:var(--gradient-primary)] text-primary-foreground">
        <CardContent className="p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-white/15 grid place-items-center">
            <Sun className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold">سلام استاد رضایی 👋</h1>
            <p className="text-sm md:text-base opacity-90 mt-1">
              امروز ۳ کلاس فعال داری. توربو در کنارت است تا روز خوبی بسازی.
            </p>
          </div>
          <Button asChild variant="secondary" size="lg" className="rounded-full">
            <Link to="/teacher/log">
              ثبت کلاس <ChevronLeft className="h-4 w-4 mr-1" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> برنامه کلاس‌های امروز
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {today.map((c) => (
              <div
                key={c.period}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/40"
              >
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="rounded-lg">{c.period}</Badge>
                  <div>
                    <p className="font-medium">{c.class}</p>
                    <p className="text-xs text-muted-foreground">{c.subject}</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">{c.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-accent/30 border-accent">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> یادآورهای دوستانه
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {reminders.map((r, i) => (
                <li key={i} className="flex gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ClipboardEdit className="h-4 w-4 text-info" /> در انتظار ثبت کلاس
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {pendingLogs.map((p, i) => (
              <div key={i} className="p-3 rounded-xl bg-muted/40">
                <p className="text-sm font-medium">{p.class}</p>
                <p className="text-xs text-muted-foreground">{p.date} • {p.period}</p>
              </div>
            ))}
            <Button asChild variant="ghost" size="sm" className="w-full">
              <Link to="/teacher/log">رفتن به ثبت کلاس</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <NotebookPen className="h-4 w-4 text-success" /> تکالیف فعال
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {activeHomework.map((h, i) => (
              <div key={i} className="p-3 rounded-xl bg-muted/40">
                <p className="text-sm font-medium">{h.title}</p>
                <p className="text-xs text-muted-foreground">{h.class} • مهلت: {h.due}</p>
              </div>
            ))}
            <Button asChild variant="ghost" size="sm" className="w-full">
              <Link to="/teacher/homework">مشاهده تکالیف</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileCheck2 className="h-4 w-4 text-primary" /> آزمونک‌های فعال
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {activeQuizzes.map((q, i) => (
              <div key={i} className="p-3 rounded-xl bg-muted/40">
                <p className="text-sm font-medium">{q.title}</p>
                <p className="text-xs text-muted-foreground">{q.class} • شرکت: {q.participation}</p>
              </div>
            ))}
            <Button asChild variant="ghost" size="sm" className="w-full">
              <Link to="/teacher/exams">مشاهده آزمون‌ها</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
