import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Sparkles, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const Route = createFileRoute("/teacher/analytics")({
  component: TeacherAnalytics;
});

const trend = [
  { week: "هفته ۱", value: 62 },
  { week: "هفته ۲", value: 66 },
  { week: "هفته ۳", value: 70 },
  { week: "هفته ۴", value: 73 },
  { week: "هفته ۵", value: 78 },
];

const topics = [
  { name: "مقدمه تنفس سلولی", value: 84, level: "تسلط خوب" },
  { name: "تنفس هوازی", value: 72, level: "در حال شکل‌گیری" },
  { name: "تنفس بی‌هوازی", value: 58, level: "فرصت رشد" },
  { name: "نقش میتوکندری", value: 76, level: "تسلط خوب" },
  { name: "ATP و انرژی سلولی", value: 64, level: "در حال شکل‌گیری" },
];

const suggestions = [
  "یک تمرین گروهی کوتاه روی «تنفس بی‌هوازی» می‌تواند درک کلاس را تقویت کند.",
  "یک ویدئو ۵ دقیقه‌ای درباره چرخه ATP، یادگیری را عمیق‌تر می‌کند.",
  "یک کوییز سه‌سوالی پایان زنگ، ماندگاری مفاهیم را افزایش می‌دهد.",
];

function TeacherAnalytics() {
  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" /> تحلیل کلاس
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          نگاهی آموزشی به روند یادگیری کلاس — فقط درباره درس شما
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" /> روند رشد میانگین کلاس
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[40, 100]} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="oklch(0.6 0.18 260)"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[image:var(--gradient-primary)] text-primary-foreground border-0">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-primary-foreground">
              <Sparkles className="h-4 w-4" /> پیشنهادهای آموزشی توربو
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              {suggestions.map((s, i) => (
                <li key={i} className="flex gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-white mt-2 shrink-0" />
                  <span className="opacity-95">{s}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">وضعیت درک مفاهیم</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {topics.map((t) => (
            <div key={t.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{t.name}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{t.level}</Badge>
                  <span className="text-muted-foreground">{t.value}٪</span>
                </div>
              </div>
              <Progress value={t.value} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
