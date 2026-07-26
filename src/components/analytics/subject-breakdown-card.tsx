import { BarChart3 } from "lucide-react";
import type { BreakdownRow } from "@/lib/api/grade-supervisor-exams";
import { AnalyticsCard, AnalyticsEmpty, pct, toFa } from "./analytics-shared";

interface Props {
  rows: BreakdownRow[];
  title?: string;
}

export function SubjectBreakdownCard({ rows, title = "تفکیک بر اساس درس" }: Props) {
  const sorted = [...rows].sort(
    (a, b) => Number(b.avgPercentage ?? -1) - Number(a.avgPercentage ?? -1),
  );

  return (
    <AnalyticsCard title={title} icon={<BarChart3 className="h-4 w-4" />}>
      {sorted.length === 0 ? (
        <AnalyticsEmpty title="هنوز داده‌ای برای تفکیک درسی ثبت نشده است." />
      ) : (
        <div className="space-y-3">
          {sorted.map((r) => {
            const v = Number(r.avgPercentage ?? 0);
            const c = r.classAvgPercentage;
            const barTone =
              v >= 75 ? "bg-emerald-500" : v >= 50 ? "bg-amber-500" : "bg-rose-500";
            return (
              <div key={`${r.id}-${r.name}`}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-700 font-medium truncate">{r.name}</span>
                  <span className="flex items-center gap-2 shrink-0">
                    <span className="text-slate-800 font-bold">
                      {pct(r.avgPercentage)}
                    </span>
                    {c !== null && c !== undefined && (
                      <span className="text-[10px] text-slate-500">
                        میانگین پایه {pct(c)}
                      </span>
                    )}
                  </span>
                </div>
                <div className="relative h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${barTone}`}
                    style={{ width: `${Math.min(100, Math.max(0, v))}%` }}
                  />
                  {c !== null && c !== undefined && (
                    <span
                      className="absolute top-0 h-full w-0.5 bg-slate-500/70"
                      style={{ right: `${Math.min(100, Math.max(0, Number(c)))}%` }}
                    />
                  )}
                </div>
                {r.examCount > 0 && (
                  <p className="text-[10px] text-slate-400 mt-1">
                    {toFa(r.examCount)} آزمون
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AnalyticsCard>
  );
}
