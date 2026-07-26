import { CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";
import type { BreakdownRow } from "@/lib/api/grade-supervisor-exams";
import { AnalyticsCard, AnalyticsEmpty, pct, toFa } from "./analytics-shared";

interface Props {
  rows: BreakdownRow[];
  /** Fallback reference when a row has no class average of its own. */
  gradeAvg?: number | null;
}

function diffOf(r: BreakdownRow, gradeAvg?: number | null): number | null {
  const v = r.avgPercentage;
  const base = r.classAvgPercentage ?? gradeAvg ?? null;
  if (v === null || base === null) return null;
  return Math.round(Number(v) - Number(base));
}

export function StrengthWeaknessCard({ rows, gradeAvg }: Props) {
  const scored = rows
    .map((r) => ({ row: r, diff: diffOf(r, gradeAvg) }))
    .filter((x) => x.diff !== null) as { row: BreakdownRow; diff: number }[];

  const strengths = scored.filter((x) => x.diff > 0).sort((a, b) => b.diff - a.diff);
  const weaknesses = scored.filter((x) => x.diff < 0).sort((a, b) => a.diff - b.diff);

  return (
    <AnalyticsCard title="نقاط قوت و نیازمند توجه" icon={<Sparkles className="h-4 w-4" />}>
      {scored.length === 0 ? (
        <AnalyticsEmpty title="برای تحلیل قوت و ضعف، به داده‌ی آزمون و میانگین پایه نیاز است." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> نقاط قوت
            </p>
            {strengths.length === 0 ? (
              <p className="text-[11px] text-slate-400">موردی ثبت نشده است.</p>
            ) : (
              <div className="space-y-2">
                {strengths.map(({ row, diff }) => (
                  <div
                    key={`s-${row.id}-${row.name}`}
                    className="flex items-center justify-between text-xs px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-100"
                  >
                    <span className="text-emerald-800 truncate">{row.name}</span>
                    <span className="text-emerald-700 font-bold shrink-0">
                      {pct(row.avgPercentage)} (+{toFa(diff)})
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mb-2">
              <AlertTriangle className="h-3.5 w-3.5 text-rose-500" /> نیازمند توجه
            </p>
            {weaknesses.length === 0 ? (
              <p className="text-[11px] text-slate-400">موردی ثبت نشده است.</p>
            ) : (
              <div className="space-y-2">
                {weaknesses.map(({ row, diff }) => (
                  <div
                    key={`w-${row.id}-${row.name}`}
                    className="flex items-center justify-between text-xs px-3 py-2 rounded-xl bg-rose-50 border border-rose-100"
                  >
                    <span className="text-rose-800 truncate">{row.name}</span>
                    <span className="text-rose-700 font-bold shrink-0">
                      {pct(row.avgPercentage)} ({toFa(diff)})
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </AnalyticsCard>
  );
}
