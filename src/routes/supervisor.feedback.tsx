import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquareHeart, TrendingUp, Eye, EyeOff } from "lucide-react";
import { feedbackTrends } from "@/lib/supervisor-mock";

export const Route = createFileRoute("/supervisor/feedback")({
  component: FeedbackPage,
});

function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(...values, 100);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const w = 120;
  const h = 36;
  const step = w / (values.length - 1);
  const pts = values
    .map((v, i) => `${i * step},${h - ((v - min) / range) * h}`)
    .join(" ");
  return (
    <svg width={w} height={h} className="shrink-0">
      <polyline
        fill="none"
        stroke="oklch(0.6 0.18 260)"
        strokeWidth={2}
        points={pts}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FeedbackPage() {
  const [showRaw, setShowRaw] = useState(false);

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquareHeart className="h-6 w-6 text-primary" /> بازخوردهای هفتگی
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            نگاه گروهی به نظرات دانش‌آموزان، دبیران و خانواده‌ها
          </p>
        </div>
        <Button
          variant="outline"
          className="rounded-full gap-1"
          onClick={() => setShowRaw((v) => !v)}
        >
          {showRaw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {showRaw ? "نمایش روند" : "نمایش نمونه‌ها"}
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {feedbackTrends.map((g) => (
          <Card key={g.group}>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-success" /> {g.group}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {g.trends.map((t) => {
                const last = t.values[t.values.length - 1];
                const first = t.values[0];
                const delta = last - first;
                return (
                  <div key={t.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{t.label}</span>
                      <Badge variant="secondary">{last}٪</Badge>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <Sparkline values={t.values} />
                      <span className="text-xs text-success">
                        +{delta}٪ در ۴ هفته
                      </span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>

      {showRaw && (
        <Card className="border-dashed bg-muted/30">
          <CardHeader>
            <CardTitle className="text-base">نمونه بازخوردها</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              نمایش بازخوردهای شخصی به صورت پیش‌فرض غیرفعال است تا حریم خصوصی پاسخ‌دهندگان حفظ شود.
            </p>
            <p>
              برای دسترسی به نمونه‌های کامل، با مدیر سامانه هماهنگ شوید.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
