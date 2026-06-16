import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";
import { academicCalendar } from "@/lib/admin-mock";

export const Route = createFileRoute("/admin/calendar")({
  component: AdminCalendar,
});

const typeMeta: Record<string, { label: string; tone: string }> = {
  exam: { label: "آزمون", tone: "bg-primary/10 text-primary" },
  holiday: { label: "تعطیلی", tone: "bg-warning/15 text-warning" },
  event: { label: "رویداد", tone: "bg-success/10 text-success" },
  parent: { label: "ملاقات والدین", tone: "bg-info/10 text-info" },
  teacher: { label: "جلسه دبیران", tone: "bg-accent/40 text-foreground" },
};

function AdminCalendar() {
  const groups = Object.keys(typeMeta) as (keyof typeof typeMeta)[];

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CalendarDays className="h-6 w-6 text-primary" /> تقویم آموزشی مدرسه
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          نمای یکپارچه از آزمون‌ها، رویدادها، تعطیلات و ملاقات‌های مدرسه.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">رویدادهای پیش رو</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {academicCalendar.map((c) => (
            <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/40 gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{c.title}</p>
                <p className="text-xs text-muted-foreground">{c.date}</p>
              </div>
              <Badge className={`rounded-lg ${typeMeta[c.type].tone}`} variant="secondary">
                {typeMeta[c.type].label}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {groups.map((g) => {
          const count = academicCalendar.filter((c) => c.type === g).length;
          return (
            <Card key={g}>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{typeMeta[g].label}</p>
                <p className="text-2xl font-bold mt-2">{count.toLocaleString("fa-IR")}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
