import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ClipboardCheck, Sparkles, Clock, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/student/next-step")({
  component: NextStepPage,
});

const steps = [
  { icon: BookOpen, title: "مطالعه مبحث امروز", desc: "خواندن بخش تنفس سلولی از کتاب درسی", time: "۴۵–۶۰ دقیقه" },
  { icon: ClipboardCheck, title: "۵ تست تثبیت", desc: "تمرین‌های کوتاه برای جا افتادن مفهوم", time: "۲۰–۳۰ دقیقه" },
  { icon: Sparkles, title: "مرور هوشمند کوتاه", desc: "مرور توربو بر اساس نکات کلیدی", time: "۱۰–۱۵ دقیقه" },
];

function NextStepPage() {
  return (
    <div className="space-y-6" dir="rtl">
      <Card className="overflow-hidden border-0 bg-[image:var(--gradient-primary)] text-primary-foreground">
        <CardContent className="p-6 md:p-8">
          <Badge className="bg-white/20 hover:bg-white/20 text-white border-0 mb-3">
            پیشنهاد توربو
          </Badge>
          <h1 className="text-2xl md:text-3xl font-bold">زیست‌شناسی</h1>
          <p className="text-base opacity-90 mt-1">واحد یادگیری: تنفس سلولی — فصل ۲</p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15">
            <Clock className="h-4 w-4" />
            <span className="font-semibold">بازه پیشنهادی: ۹۰ تا ۱۲۰ دقیقه</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        {steps.map((s, i) => (
          <Card key={i} className="hover:shadow-md transition">
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center">
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">گام {i + 1}</p>
                <CardTitle className="text-base">{s.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{s.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {s.time}
                </span>
                <Button size="sm" variant="outline" className="rounded-full">
                  شروع
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-success/30 bg-success/5">
        <CardContent className="p-5 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-success" />
          <p className="text-sm">
            با کامل کردن این سه گام، یک واحد یادگیری دیگر به مسیر رشدت اضافه می‌شود.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
