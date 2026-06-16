import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarRange } from "lucide-react";

export const Route = createFileRoute("/student/schedule")({
  component: SchedulePage,
});

const days = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه"];
const periods = [1, 2, 3, 4, 5];

const grid: Record<string, { subject: string; teacher: string } | null> = {
  "شنبه-1": { subject: "ریاضی", teacher: "آقای محمدی" },
  "شنبه-2": { subject: "فیزیک", teacher: "آقای احمدی" },
  "شنبه-3": { subject: "ادبیات", teacher: "خانم نوری" },
  "شنبه-4": { subject: "زبان", teacher: "آقای حسینی" },
  "شنبه-5": null,
  "یکشنبه-1": { subject: "زیست‌شناسی", teacher: "خانم رضایی" },
  "یکشنبه-2": { subject: "ریاضی", teacher: "آقای محمدی" },
  "یکشنبه-3": { subject: "شیمی", teacher: "خانم کریمی" },
  "یکشنبه-4": { subject: "فیزیک", teacher: "آقای احمدی" },
  "یکشنبه-5": { subject: "ورزش", teacher: "آقای صالحی" },
  "دوشنبه-1": { subject: "شیمی", teacher: "خانم کریمی" },
  "دوشنبه-2": { subject: "زیست‌شناسی", teacher: "خانم رضایی" },
  "دوشنبه-3": { subject: "ریاضی", teacher: "آقای محمدی" },
  "دوشنبه-4": null,
  "دوشنبه-5": { subject: "عربی", teacher: "آقای کاظمی" },
  "سه‌شنبه-1": { subject: "فیزیک", teacher: "آقای احمدی" },
  "سه‌شنبه-2": { subject: "زبان", teacher: "آقای حسینی" },
  "سه‌شنبه-3": { subject: "ادبیات", teacher: "خانم نوری" },
  "سه‌شنبه-4": { subject: "زیست‌شناسی", teacher: "خانم رضایی" },
  "سه‌شنبه-5": null,
  "چهارشنبه-1": { subject: "ریاضی", teacher: "آقای محمدی" },
  "چهارشنبه-2": { subject: "شیمی", teacher: "خانم کریمی" },
  "چهارشنبه-3": { subject: "فیزیک", teacher: "آقای احمدی" },
  "چهارشنبه-4": { subject: "دینی", teacher: "آقای موسوی" },
  "چهارشنبه-5": null,
};

const colors: Record<string, string> = {
  ریاضی: "bg-primary/10 text-primary border-primary/20",
  فیزیک: "bg-info/10 text-info border-info/20",
  شیمی: "bg-success/10 text-success border-success/20",
  "زیست‌شناسی": "bg-accent text-accent-foreground border-accent",
  ادبیات: "bg-warning/10 text-warning border-warning/20",
  زبان: "bg-secondary text-secondary-foreground border-border",
  ورزش: "bg-muted text-foreground border-border",
  عربی: "bg-warning/10 text-warning border-warning/20",
  دینی: "bg-secondary text-secondary-foreground border-border",
};

function SchedulePage() {
  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CalendarRange className="h-6 w-6 text-primary" /> برنامه هفتگی
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          برنامه مدرسه — پایه یازدهم تجربی
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
                <th className="text-xs text-muted-foreground font-medium w-20"></th>
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
                    const cell = grid[`${d}-${p}`];
                    if (!cell) {
                      return (
                        <td key={d} className="p-2">
                          <div className="h-16 rounded-xl border border-dashed border-border" />
                        </td>
                      );
                    }
                    return (
                      <td key={d} className="p-2">
                        <div
                          className={`h-16 rounded-xl border px-2 py-1.5 flex flex-col justify-center ${colors[cell.subject] || ""}`}
                        >
                          <p className="text-sm font-semibold leading-tight">{cell.subject}</p>
                          <p className="text-[10px] opacity-80 truncate">{cell.teacher}</p>
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
