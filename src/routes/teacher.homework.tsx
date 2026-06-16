import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { NotebookPen, Plus, Clock3, Users } from "lucide-react";

export const Route = createFileRoute("/teacher/homework")({
  component: TeacherHomework,
});

const homework = [
  { title: "حل تمرین‌های فصل ۲", class: "یازدهم ۱", due: "فردا", completed: 18, total: 28 },
  { title: "خلاصه مبحث تنفس سلولی", class: "یازدهم ۲", due: "۳ روز دیگر", completed: 8, total: 26 },
  { title: "گزارش مشاهده میکروسکوپی", class: "یازدهم ۳", due: "هفته آینده", completed: 4, total: 27 },
  { title: "پاسخ به ۱۰ سوال مفهومی", class: "یازدهم ۱", due: "تکمیل شد", completed: 28, total: 28 },
];

function TeacherHomework() {
  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <NotebookPen className="h-6 w-6 text-primary" /> تکالیف
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            مدیریت تکالیف کلاس‌ها و نگاهی به روند تکمیل
          </p>
        </div>
        <Button className="rounded-full gap-1">
          <Plus className="h-4 w-4" /> تکلیف جدید
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {homework.map((h, i) => {
          const pct = Math.round((h.completed / h.total) * 100);
          return (
            <Card key={i} className="hover:shadow-md transition">
              <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
                <div>
                  <CardTitle className="text-base">{h.title}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1 inline-flex items-center gap-1">
                    <Clock3 className="h-3 w-3" /> مهلت: {h.due}
                  </p>
                </div>
                <Badge variant="secondary">{h.class}</Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Users className="h-3.5 w-3.5" /> تکمیل
                  </span>
                  <span className="font-medium">{h.completed} از {h.total} ({pct}٪)</span>
                </div>
                <Progress value={pct} className="h-2" />
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="rounded-full flex-1">مشاهده تحویل‌ها</Button>
                  <Button size="sm" variant="ghost" className="rounded-full">ویرایش</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
