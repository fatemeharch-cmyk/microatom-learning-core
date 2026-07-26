import { pct, toFa, toneForScore } from "./analytics-shared";

interface Props {
  examCount: number;
  studentAvg: number | null;
  gradeAvg: number | null;
  accuracy: number | null;
}

function Tile({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className={`rounded-2xl px-3 py-2.5 ${tone}`}>
      <p className="text-[10px] opacity-80">{label}</p>
      <p className="text-sm font-extrabold mt-1 truncate">{value}</p>
    </div>
  );
}

export function ComparisonStatTiles({
  examCount,
  studentAvg,
  gradeAvg,
  accuracy,
}: Props) {
  const diff =
    studentAvg !== null && gradeAvg !== null
      ? Math.round(Number(studentAvg) - Number(gradeAvg))
      : null;

  const diffTone =
    diff === null
      ? "bg-slate-50 text-slate-700"
      : diff >= 0
        ? "bg-emerald-50 text-emerald-700"
        : "bg-rose-50 text-rose-700";

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      <Tile label="تعداد آزمون" value={toFa(examCount)} tone="bg-slate-50 text-slate-700" />
      <Tile label="میانگین دانش‌آموز" value={pct(studentAvg)} tone={toneForScore(studentAvg)} />
      <Tile label="میانگین پایه" value={pct(gradeAvg)} tone="bg-sky-50 text-sky-700" />
      <Tile
        label="اختلاف با پایه"
        value={
          diff === null ? "—" : `${diff >= 0 ? "+" : ""}${toFa(diff)} واحد`
        }
        tone={diffTone}
      />
      <Tile
        label="دقت پاسخ‌گویی"
        value={pct(accuracy)}
        tone={toneForScore(accuracy)}
      />
    </div>
  );
}
