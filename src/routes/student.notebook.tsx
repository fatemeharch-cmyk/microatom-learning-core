import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpenCheck, FileText, MessageCircleQuestion, Paperclip, Sparkles } from "lucide-react";

export const Route = createFileRoute("/student/notebook")({
  component: NotebookPage,
});

type Period = {
  period: number;
  subject: string;
  teacher: string;
  topics: string[];
  question?: string;
  homework?: string;
  resources?: string[];
  absent?: boolean;
};

const periods: Period[] = [
  {
    period: 1,
    subject: "زیست‌شناسی",
    teacher: "خانم رضایی",
    topics: ["مقدمه تنفس سلولی", "تفاوت تنفس هوازی و بی‌هوازی"],
    question: "چرا میتوکندری را نیروگاه سلول می‌نامند؟",
    homework: "خلاصه‌نویسی صفحات ۳۲ تا ۳۸",
    resources: ["جزوه فصل ۲.pdf"],
  },
  {
    period: 2,
    subject: "ریاضی",
    teacher: "آقای محمدی",
    topics: ["معادلات درجه دوم", "روش مربع کامل"],
    homework: "تمرین‌های ۵ تا ۱۲ صفحه ۴۵",
  },
  {
    period: 3,
    subject: "شیمی",
    teacher: "خانم کریمی",
    topics: ["استوکیومتری", "محاسبات مولی"],
    absent: true,
  },
  {
    period: 4,
    subject: "فیزیک",
    teacher: "آقای احمدی",
    topics: ["حرکت پرتابی", "تحلیل برداری"],
    resources: ["ویدئو حل مثال", "اسلایدهای کلاس"],
  },
];

function NotebookPage() {
  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BookOpenCheck className="h-6 w-6 text-primary" /> دفتر یادگیری
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            یکشنبه، ۲۰ خرداد ۱۴۰۴
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="absolute right-4 top-2 bottom-2 w-px bg-border" />
        <div className="space-y-4">
          {periods.map((p) => (
            <div key={p.period} className="relative pr-12">
              <div className="absolute right-2 top-4 h-5 w-5 rounded-full bg-primary border-4 border-background" />
              <Card>
                <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="rounded-lg">
                        زنگ {p.period}
                      </Badge>
                      <CardTitle className="text-base">{p.subject}</CardTitle>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">دبیر: {p.teacher}</p>
                  </div>
                  {p.absent && (
                    <Badge className="bg-info/15 text-info border-info/30">
                      فرصت جبران
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">مباحث تدریس شده</p>
                    <div className="flex flex-wrap gap-1.5">
                      {p.topics.map((t) => (
                        <Badge key={t} variant="outline">{t}</Badge>
                      ))}
                    </div>
                  </div>

                  {p.question && (
                    <div className="p-3 rounded-xl bg-accent/30 flex gap-2">
                      <MessageCircleQuestion className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">پرسش کلاس</p>
                        <p className="text-sm">{p.question}</p>
                      </div>
                    </div>
                  )}

                  {p.homework && (
                    <div className="p-3 rounded-xl bg-muted/40 flex gap-2">
                      <FileText className="h-4 w-4 text-success shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">ماموریت</p>
                        <p className="text-sm">{p.homework}</p>
                      </div>
                    </div>
                  )}

                  {p.resources && (
                    <div className="flex flex-wrap gap-2">
                      {p.resources.map((r) => (
                        <Badge key={r} variant="secondary" className="gap-1">
                          <Paperclip className="h-3 w-3" /> {r}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {p.absent && (
                    <div className="p-3 rounded-xl bg-info/10 border border-info/30 flex gap-2 items-center">
                      <Sparkles className="h-4 w-4 text-info" />
                      <p className="text-sm flex-1">
                        توربو یک مسیر کوتاه برای جبران این درس برایت آماده کرده است.
                      </p>
                      <Button size="sm" variant="outline" className="rounded-full">
                        مشاهده
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
