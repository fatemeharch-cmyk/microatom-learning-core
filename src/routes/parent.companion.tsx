import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, MessageCircle, HeartHandshake, Star } from "lucide-react";
import { companionSuggestions, type CompanionSuggestion } from "@/lib/parent-mock";

export const Route = createFileRoute("/parent/companion")({
  component: CompanionPage,
});

const cats: Record<CompanionSuggestion["category"], { label: string; icon: typeof MessageCircle; cls: string }> = {
  conversation: { label: "ایده‌های گفت‌وگو", icon: MessageCircle, cls: "bg-primary/10 text-primary" },
  support: { label: "حمایت آموزشی ساده", icon: HeartHandshake, cls: "bg-info/10 text-info" },
  encouragement: { label: "تشویق و دلگرمی", icon: Star, cls: "bg-success/10 text-success" },
};

function CompanionPage() {
  const grouped = (Object.keys(cats) as CompanionSuggestion["category"][]).map((c) => ({
    cat: c,
    items: companionSuggestions.filter((s) => s.category === c),
  }));

  return (
    <div className="space-y-6" dir="rtl">
      <Card className="overflow-hidden border-0 bg-[image:var(--gradient-primary)] text-primary-foreground">
        <CardContent className="p-6 md:p-8 flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-white/15 grid place-items-center">
            <Lightbulb className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold">همراهی پیشنهادی توربو</h1>
            <p className="text-sm opacity-90 mt-1">
              ایده‌های ساده برای حضور گرم و حمایت‌گر در مسیر یادگیری فرزندتان
            </p>
          </div>
          <Badge className="bg-white/20 text-white border-0">هفته جاری</Badge>
        </CardContent>
      </Card>

      {grouped.map(({ cat, items }) => {
        const meta = cats[cat];
        const Icon = meta.icon;
        return (
          <section key={cat} className="space-y-3">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <span className={`h-8 w-8 rounded-xl grid place-items-center ${meta.cls}`}>
                <Icon className="h-4 w-4" />
              </span>
              {meta.label}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {items.map((s, i) => (
                <Card key={i} className="hover:shadow-md transition">
                  <CardHeader>
                    <CardTitle className="text-base">{s.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">{s.body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
