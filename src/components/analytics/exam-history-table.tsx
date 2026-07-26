import { ListChecks } from "lucide-react";
import type { ExamAttemptRow } from "@/lib/api/grade-supervisor-exams";
import {
  AnalyticsCard,
  AnalyticsEmpty,
  formatJalali,
  pct,
  toFa,
} from "./analytics-shared";

export function ExamHistoryTable({ exams }: { exams: ExamAttemptRow[] }) {
  const rows = [...exams].sort((a, b) =>
    a.examDate < b.examDate ? 1 : a.examDate > b.examDate ? -1 : 0,
  );

  return (
    <AnalyticsCard title="تاریخچه آزمون‌ها" icon={<ListChecks className="h-4 w-4" />}>
      {rows.length === 0 ? (
        <AnalyticsEmpty title="هنوز آزمونی برای این دانش‌آموز ثبت نشده است." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-slate-500 text-[11px]">
                <th className="text-right font-medium py-2 px-2">آزمون</th>
                <th className="text-right font-medium py-2 px-2">درس</th>
                <th className="text-right font-medium py-2 px-2">تاریخ</th>
                <th className="text-center font-medium py-2 px-2">درست</th>
                <th className="text-center font-medium py-2 px-2">غلط</th>
                <th className="text-center font-medium py-2 px-2">نزده</th>
                <th className="text-center font-medium py-2 px-2">درصد</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((e, i) => {
                const p = Number(e.percentage);
                return (
                  <tr key={`${e.examId}-${e.attemptId}-${i}`} className="border-t border-slate-100">
                    <td className="py-2 px-2 text-slate-800 font-medium">{e.title}</td>
                    <td className="py-2 px-2 text-slate-600">{e.subjectName || "—"}</td>
                    <td className="py-2 px-2 text-slate-500">{formatJalali(e.examDate)}</td>
                    <td className="py-2 px-2 text-center text-emerald-600">{toFa(e.correct)}</td>
                    <td className="py-2 px-2 text-center text-rose-600">{toFa(e.wrong)}</td>
                    <td className="py-2 px-2 text-center text-slate-500">{toFa(e.unanswered)}</td>
                    <td
                      className={
                        "py-2 px-2 text-center font-bold " +
                        (Number.isFinite(p) && p < 60 ? "text-rose-600" : "text-emerald-600")
                      }
                    >
                      {pct(e.percentage)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AnalyticsCard>
  );
}
