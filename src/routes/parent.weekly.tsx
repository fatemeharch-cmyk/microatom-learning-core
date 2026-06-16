import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, BookOpen, NotebookPen, Heart } from "lucide-react";
import { weeklySummary, childName } from "@/lib/parent-mock";

export const Route = createFileRoute("/parent/weekly")({
  component: WeeklyPage,
});

function WeeklyPage() {
  return (
    <div className="space-y-6" dir="rtl">
      <Card className="overflow-hidden border-0 bg-[image:var(--gradient-primary)] text-primary-foreground">
        <CardContent className="p-6 md:p-8 flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-white/15 grid place-items-center">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold">خلاصه هفتگی توربو</h1>
            <p className="text-sm opacity-90 mt-1">
              نگاهی آرام و حمایت‌گرا به یک هفته یادگیری {childName}
            </p>
          </div>
          <Badge className="bg-white/20 text-white border-0">هفته جاری</Badge>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" /> مباحث مطالعه‌شده
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {weeklySummary.topics.map((t) => (
              <Badge key={t} variant="outline" className="text-sm py-1.5 px-3">
                {t}
              </Badge>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <NotebookPen className="h-4 w-4 text-success" /> تکمیل تکالیف
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">{weeklySummary.homeworkCompletion}</span>
              <span className="text-muted-foreground">٪</span>
            </div>
            <Progress value={weeklySummary.homeworkCompletion} className="h-2" />
            <p className="text-xs text-muted-foreground">
              روند هفتگی رو به رشد
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" /> نقاط درخشان هفته
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {weeklySummary.highlights.map((h, i) => (
              <li key={i} className="p-3 rounded-xl bg-accent/30 text-sm">{h}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="border-success/30 bg-success/5">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Heart className="h-4 w-4 text-success" /> پیشنهادهای ملایم برای حمایت خانواده
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {weeklySummary.familySuggestions.map((s, i) => (
              <li key={i} className="p-3 rounded-xl bg-card border text-sm">{s}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
