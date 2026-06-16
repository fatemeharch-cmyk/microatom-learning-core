import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarRange } from "lucide-react";
import { weeklySchedule, weekDays } from "@/lib/admin-mock";

export const Route = createFileRoute("/admin/schedule")({
  component: AdminSchedule,
});

function AdminSchedule() {
  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CalendarRange className="h-6 w-6 text-primary" /> برنامه هفتگی مدرسه
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          نمای روزانه از کلاس‌ها، دبیران و موضوعات درسی در طول هفته.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {weekDays.map((day) => {
          const items = weeklySchedule.filter((s) => s.day === day);
          return (
            <Card key={day}>
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  <span>{day}</span>
                  <Badge variant="secondary" className="rounded-lg">
                    {items.length.toLocaleString("fa-IR")} کلاس
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {items.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    این روز کلاسی ثبت نشده است.
                  </p>
                ) : (
                  items.map((s, i) => (
                    <div key={i} className="p-3 rounded-xl bg-muted/40 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{s.subject}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {s.classroom} • {s.teacher}
                        </p>
                      </div>
                      <Badge variant="secondary" className="rounded-lg shrink-0">{s.period}</Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
