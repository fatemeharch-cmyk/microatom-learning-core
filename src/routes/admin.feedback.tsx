import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MessageCircleHeart, ShieldCheck } from "lucide-react";
import { feedbackSummary, feedbackThemes } from "@/lib/admin-mock";

export const Route = createFileRoute("/admin/feedback")({
  component: AdminFeedback,
});

function AdminFeedback() {
  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MessageCircleHeart className="h-6 w-6 text-primary" /> بازخوردهای مدرسه
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          نمای جمعی از بازخورد دانش‌آموزان، والدین و دبیران. کامنت‌های شخصی به‌صورت پیش‌فرض پنهان هستند.
        </p>
      </div>

      <Card className="border-info/30 bg-info/5">
        <CardContent className="p-4 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-info shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            برای حفظ حریم خصوصی، فقط داده‌های تجمیعی و موضوعی نمایش داده می‌شود. متن‌های شخصی فقط با مجوز قابل مشاهده‌اند.
          </p>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-3 gap-4">
        {feedbackSummary.map((f) => (
          <Card key={f.source}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{f.label}</p>
                <Badge variant="secondary" className="rounded-lg">{f.satisfaction}%</Badge>
              </div>
              <Progress value={f.satisfaction} />
              <p className="text-xs text-muted-foreground">
                {f.responses.toLocaleString("fa-IR")} پاسخ • روند {f.trend === "up" ? "رو به رشد" : "پایدار"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {(["students", "parents", "teachers"] as const).map((ch) => {
        const list = feedbackThemes.filter((t) => t.channel === ch);
        return (
          <Card key={ch}>
            <CardHeader>
              <CardTitle className="text-base">
                موضوعات بازخورد — {feedbackSummary.find((f) => f.source === ch)?.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {list.map((t) => (
                <div key={t.theme} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{t.theme}</span>
                    <span className="text-muted-foreground">{t.positiveScore}% مثبت</span>
                  </div>
                  <Progress value={t.positiveScore} />
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
