import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarRange, ChevronLeft, ChevronRight } from "lucide-react";
import { calendarEvents, type CalendarEvent } from "@/lib/supervisor-mock";

export const Route = createFileRoute("/supervisor/calendar")({
  component: SupervisorCalendar,
});

const kindMap: Record<CalendarEvent["kind"], { label: string; cls: string }> = {
  mentoring: { label: "همراهی", cls: "bg-primary/15 text-primary border-primary/30" },
  parent: { label: "والدین", cls: "bg-info/15 text-info border-info/30" },
  exam: { label: "آزمون", cls: "bg-warning/15 text-warning border-warning/30" },
  school: { label: "رویداد", cls: "bg-accent text-accent-foreground border-accent" },
  teacher: { label: "دبیران", cls: "bg-success/15 text-success border-success/30" },
};

const weekDays = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

function SupervisorCalendar() {
  const [cursor, setCursor] = useState(new Date(2026, 5, 1)); // June 2026

  const grid = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const leading = first.getDay();
    const cells: ({ day: number; iso: string } | null)[] = [];
    for (let i = 0; i < leading; i++) cells.push(null);
    for (let d = 1; d <= last.getDate(); d++) {
      const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({ day: d, iso });
    }
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [cursor]);

  const eventsByDate = useMemo(() => {
    const m = new Map<string, CalendarEvent[]>();
    for (const e of calendarEvents) {
      const arr = m.get(e.date) || [];
      arr.push(e);
      m.set(e.date, arr);
    }
    return m;
  }, []);

  const monthLabel = cursor.toLocaleDateString("fa-IR", { year: "numeric", month: "long" });

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CalendarRange className="h-6 w-6 text-primary" /> تقویم آموزشی
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            نمای یکپارچه از جلسات، ملاقات‌ها، رویدادها و آزمون‌ها
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(kindMap).map(([k, v]) => (
            <Badge key={k} className={`${v.cls} border`}>{v.label}</Badge>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
          <CardTitle className="text-base">{monthLabel}</CardTitle>
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="outline"
              className="rounded-full h-8 w-8"
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
              aria-label="ماه قبل"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="rounded-full h-8 w-8"
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
              aria-label="ماه بعد"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="min-w-[700px]">
            <div className="grid grid-cols-7 gap-2 mb-2">
              {weekDays.map((d) => (
                <div key={d} className="text-center text-xs text-muted-foreground font-medium py-1">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {grid.map((cell, i) => {
                if (!cell) return <div key={i} className="h-24 rounded-xl bg-muted/20" />;
                const events = eventsByDate.get(cell.iso) || [];
                return (
                  <div
                    key={i}
                    className="h-24 rounded-xl border p-1.5 flex flex-col gap-1 overflow-hidden hover:border-primary/40 transition"
                  >
                    <span className="text-xs text-muted-foreground">{cell.day}</span>
                    <div className="flex-1 space-y-1 overflow-hidden">
                      {events.slice(0, 2).map((e) => (
                        <div
                          key={e.id}
                          className={`text-[10px] px-1.5 py-0.5 rounded ${kindMap[e.kind].cls} border truncate`}
                        >
                          {e.title}
                        </div>
                      ))}
                      {events.length > 2 && (
                        <div className="text-[10px] text-muted-foreground">
                          +{events.length - 2} مورد
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
