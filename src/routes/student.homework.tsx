import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NotebookPen, Clock3, CheckCircle2, Sparkles, Hourglass } from "lucide-react";

export const Route = createFileRoute("/student/homework")({
  component: HomeworkPage,
});

type Status = "pending" | "in_progress" | "completed" | "needs_more_time";

const statusMap: Record<Status, { label: string; cls: string; icon: typeof Clock3 }> = {
  pending: { label: "فرصت تکمیل", cls: "bg-info/15 text-info border-info/30", icon: Clock3 },
  in_progress: { label: "در حال انجام", cls: "bg-primary/15 text-primary border-primary/30", icon: Sparkles },
  completed: { label: "تکمیل شده", cls: "bg-success/15 text-success border-success/30", icon: CheckCircle2 },
  needs_more_time: { label: "نیاز به زمان بیشتر", cls: "bg-warning/15 text-warning border-warning/30", icon: Hourglass },
};

const homework: { id: number; title: string; subject: string; due: string; status: Status }[] = [
  { id: 1, title: "حل تمرین‌های فصل ۲ ریاضی", subject: "ریاضی", due: "فردا", status: "in_progress" },
  { id: 2, title: "گزارش آزمایش تیتراسیون", subject: "شیمی", due: "۳ روز دیگر", status: "pending" },
  { id: 3, title: "خلاصه فصل تنفس سلولی", subject: "زیست‌شناسی", due: "هفته آینده", status: "needs_more_time" },
  { id: 4, title: "حل مسائل حرکت پرتابی", subject: "فیزیک", due: "دیروز", status: "completed" },
  { id: 5, title: "نگارش انشاء", subject: "ادبیات", due: "۵ روز دیگر", status: "pending" },
];

function HomeworkPage() {
  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <NotebookPen className="h-6 w-6 text-primary" /> تکالیف من
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          همه تکالیف فعال و تکمیل شده در یک نگاه
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {homework.map((h) => {
          const s = statusMap[h.status];
          const Icon = s.icon;
          return (
            <Card key={h.id} className="hover:shadow-md transition">
              <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
                <div>
                  <CardTitle className="text-base">{h.title}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">{h.subject}</p>
                </div>
                <Badge className={`${s.cls} border gap-1`}>
                  <Icon className="h-3 w-3" /> {s.label}
                </Badge>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground inline-flex items-center gap-1">
                  <Clock3 className="h-3.5 w-3.5" /> مهلت: {h.due}
                </span>
                <Button size="sm" variant="outline" className="rounded-full">
                  مشاهده
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
