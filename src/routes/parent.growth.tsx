import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sprout, CheckCircle2, BookOpenCheck, Flame, Target } from "lucide-react";
import { childName, growthIndicators, weeklyTopics, weeklySummary } from "@/lib/parent-mock";

export const Route = createFileRoute("/parent/growth")({
  component: GrowthPage,
});

const icons = [CheckCircle2, BookOpenCheck, Flame, Target];

function GrowthPage() {
  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sprout className="h-6 w-6 text-success" /> مسیر رشد {childName}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          فقط نشانه‌های مثبت رشد — این مسیر متعلق به خودِ {childName} است.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {growthIndicators.map((g, i) => {
          const Icon = icons[i % icons.length];
          return (
            <Card key={g.label}>
              <CardContent className="p-5 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-success/10 text-success grid place-items-center">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{g.label}</p>
                  <p className="text-xl font-bold">
                    {g.value}{g.unit ?? ""}
                  </p>
                  {g.hint && <p className="text-[10px] text-muted-foreground mt-0.5">{g.hint}</p>}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpenCheck className="h-4 w-4 text-primary" /> مباحث مرور شده این هفته
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {weeklyTopics.map((t) => (
              <Badge key={t} variant="outline" className="text-sm py-1.5 px-3">{t}</Badge>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4 text-success" /> اهداف هفتگی
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {weeklySummary.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-muted/40">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  <span className="text-sm">{h}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-muted/40 border-dashed">
        <CardContent className="p-4 text-sm text-muted-foreground">
          در این بخش هیچ رتبه‌بندی، مقایسه با همکلاسی‌ها یا اطلاعات خصوصی مشاوره‌ای نمایش داده نمی‌شود. تمرکز ما فقط بر مسیر رشد {childName} است.
        </CardContent>
      </Card>
    </div>
  );
}
