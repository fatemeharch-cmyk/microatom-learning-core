import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileCheck2, Plus, Users, TrendingUp, History } from "lucide-react";

export const Route = createFileRoute("/teacher/exams")({
  component: TeacherExams,
});

const active = [
  { title: "آزمونک تنفس سلولی", class: "یازدهم ۱", participated: 22, total: 28, avg: 78 },
  { title: "آزمونک ATP", class: "یازدهم ۲", participated: 14, total: 26, avg: 71 },
];

const history = [
  { title: "آزمون فصل ۱", class: "یازدهم ۱", date: "۱۰ خرداد", avg: 74 },
  { title: "آزمونک مقدمات", class: "یازدهم ۳", date: "۳ خرداد", avg: 81 },
  { title: "آزمون تشخیصی", class: "یازدهم ۲", date: "۲۸ اردیبهشت", avg: 68 },
];

function TeacherExams() {
  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileCheck2 className="h-6 w-6 text-primary" /> آزمون‌ها
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            آزمونک‌های کلاسی و تحلیل ساده عملکرد
          </p>
        </div>
        <Button className="rounded-full gap-1">
          <Plus className="h-4 w-4" /> ساخت آزمون جدید
        </Button>
      </div>

      <div>
        <h2 className="text-base font-semibold mb-3">آزمون‌های فعال</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {active.map((q, i) => (
            <Card key={i} className="hover:shadow-md transition">
              <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
                <div>
                  <CardTitle className="text-base">{q.title}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">{q.class}</p>
                </div>
                <Badge className="bg-success/15 text-success border-success/30">
                  فعال
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Users className="h-3.5 w-3.5" /> شرکت‌کنندگان
                  </span>
                  <span className="font-medium">{q.participated} از {q.total}</span>
                </div>
                <Progress value={(q.participated / q.total) * 100} className="h-2" />
                <div className="flex items-center justify-between text-sm pt-1">
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <TrendingUp className="h-3.5 w-3.5" /> میانگین رشد
                  </span>
                  <span className="font-semibold text-primary">{q.avg}٪</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="rounded-full flex-1">مشاهده</Button>
                  <Button size="sm" className="rounded-full flex-1">تحلیل</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
          <History className="h-4 w-4" /> تاریخچه آزمون‌ها
        </h2>
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y">
              {history.map((h, i) => (
                <li key={i} className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">{h.title}</p>
                    <p className="text-xs text-muted-foreground">{h.class} • {h.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">میانگین {h.avg}٪</Badge>
                    <Button size="sm" variant="ghost">جزئیات</Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
