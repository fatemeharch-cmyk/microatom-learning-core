import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, BookOpen, TrendingUp, Lightbulb } from "lucide-react";
import { weeklyAISummary } from "@/lib/supervisor-mock";

export const Route = createFileRoute("/supervisor/turbo")({
  component: TurboCopilot,
});

const mentoringTopics = [
  { topic: "تنظیم برنامه مطالعه هفتگی", reason: "بر اساس الگوی مطالعه چند دانش‌آموز" },
  { topic: "تمرین تمرکز در جلسات کوتاه", reason: "روندی مثبت در ۲ هفته اخیر" },
  { topic: "گفتگو درباره اهداف کوتاه‌مدت", reason: "مناسب برای جلسات این هفته" },
];

const patterns = [
  "تداوم یادگیری در پایه یازدهم تجربی روند رو به رشدی دارد.",
  "بیشترین فعالیت یادگیری در ساعات ۱۸ تا ۲۱ ثبت شده است.",
  "مباحث «تنفس سلولی» و «معادله درجه دوم» در چند کلاس نقاط مشترک تمرکز هستند.",
];

const recommendations = [
  "برگزاری یک نشست کوتاه با دبیران زیست‌شناسی برای هم‌راستاسازی مسیر آموزشی.",
  "اشتراک یک کاربرگ تمرین گروهی در کلاس‌های ریاضی برای تقویت تثبیت مفاهیم.",
  "پیگیری نرم با خانواده‌هایی که این هفته در ملاقات شرکت داشتند.",
];

function TurboCopilot() {
  return (
    <div className="space-y-6" dir="rtl">
      <Card className="overflow-hidden border-0 bg-[image:var(--gradient-primary)] text-primary-foreground">
        <CardContent className="p-6 md:p-8 flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-white/15 grid place-items-center">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold">خلاصه هوشمند توربو</h1>
            <p className="text-sm opacity-90 mt-1">
              نگاهی آرام، حمایت‌گرا و آموزشی به مسیر هفتگی پایه
            </p>
          </div>
          <Badge className="bg-white/20 text-white border-0">به‌روز شد</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-success" /> خلاصه هفته
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {weeklyAISummary.map((w, i) => (
              <li key={i} className="flex gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-success mt-2 shrink-0" />
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" /> موضوعات پیشنهادی برای همراهی
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mentoringTopics.map((m, i) => (
              <div key={i} className="p-3 rounded-xl bg-accent/30">
                <p className="text-sm font-medium">{m.topic}</p>
                <p className="text-xs text-muted-foreground mt-1">{m.reason}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-info" /> الگوهای یادگیری هفته
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {patterns.map((p, i) => (
                <li key={i} className="flex gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-info mt-2 shrink-0" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="border-success/30 bg-success/5">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-success" /> پیشنهادهای آموزشی ملایم
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {recommendations.map((r, i) => (
              <li key={i} className="p-3 rounded-xl bg-card border">{r}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
