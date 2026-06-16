import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarRange } from "lucide-react";

export const Route = createFileRoute("/teacher/schedule")({
  component: TeacherSchedule,
});

const days = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه"];
const periods = [1, 2, 3, 4, 5];

const grid: Record<string, { cls: string; subject: string } | null> = {
  "شنبه-1": { cls: "یازدهم ۱", subject: "زیست‌شناسی" },
  "شنبه-2": { cls: "یازدهم ۲", subject: "زیست‌شناسی" },
  "شنبه-3": null,
  "شنبه-4": { cls: "یازدهم ۳", subject: "زیست‌شناسی" },
  "شنبه-5": null,
  "یکشنبه-1": { cls: "یازدهم ۱", subject: "زیست‌شناسی" },
  "یکشنبه-2": { cls: "یازدهم ۲", subject: "زیست‌شناسی" },
  "یکشنبه-3": null,
  "یکشنبه-4": { cls: "یازدهم ۳", subject: "زیست‌شناسی" },
  "یکشنبه-5": null,
  "دوشنبه-1": null,
  "دوشنبه-2": { cls: "یازدهم ۲", subject: "زیست‌شناسی" },
  "دوشنبه-3": { cls: "یازدهم ۱", subject: "زیست‌شناسی" },
  "دوشنبه-4": { cls: "یازدهم ۳", subject: "زیست‌شناسی" },
  "دوشنبه-5": null,
  "سه‌شنبه-1": { cls: "یازدهم ۳", subject: "زیست‌شناسی" },
  "سه‌شنبه-2": null,
  "سه‌شنبه-3": { cls: "یازدهم ۱", subject: "زیست‌شناسی" },
  "سه‌شنبه-4": { cls: "یازدهم ۲", subject: "زیست‌شناسی" },
  "سه‌شنبه-5": null,
  "چهارشنبه-1": { cls: "یازدهم ۲", subject: "زیست‌شناسی" },
  "چهارشنبه-2": { cls: "یازدهم ۳", subject: "زیست‌شناسی" },
  "چهارشنبه-3": null,
  "چهارشنبه-4": { cls: "یازدهم ۱", subject: "زیست‌شناسی" },
  "چهارشنبه-5": null,
};

function TeacherSchedule() {
  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CalendarRange className="h-6 w-6 text-primary" /> برنامه هفتگی من
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          برنامه تدریس هفته جاری
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">جدول هفته</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-separate border-spacing-2">
            <thead>
              <tr>
                <th className="w-20"></th>
                {days.map((d) => (
                  <th key={d} className="text-sm font-semibold p-2">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map((p) => (
                <tr key={p}>
                  <td className="text-xs text-muted-foreground text-center">زنگ {p}</td>
                  {days.map((d) => {
                    const c = grid[`${d}-${p}`];
                    if (!c) {
                      return (
                        <td key={d} className="p-2">
                          <div className="h-16 rounded-xl border border-dashed border-border" />
                        </td>
                      );
                    }
                    return (
                      <td key={d} className="p-2">
                        <div className="h-16 rounded-xl border border-primary/20 bg-primary/5 px-2 py-1.5 flex flex-col justify-center">
                          <p className="text-sm font-semibold text-primary leading-tight">{c.cls}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{c.subject}</p>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
