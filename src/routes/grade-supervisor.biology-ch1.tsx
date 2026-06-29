import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CHAPTER,
  MICRO_ATOMS,
  DEMO_STUDENTS,
  getDoses,
  getCheckups,
  ensureSeed,
  useBioCh1Tick,
} from "@/lib/mock/biology-ch1";
import { Beaker, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/grade-supervisor/biology-ch1")({
  component: SupervisorBioCh1Page,
});

function SupervisorBioCh1Page() {
  ensureSeed();
  useBioCh1Tick();

  const doses = getDoses();
  const checkups = getCheckups();

  const rows = DEMO_STUDENTS.map((s) => {
    const sDoses = doses.filter((d) => d.studentId === s.id);
    const sChecks = checkups.filter((c) => c.studentId === s.id);
    const totalMinutes = sDoses.reduce((sum, d) => sum + d.minutes, 0);
    const latest = sChecks.sort((a, b) => b.at - a.at)[0] ?? null;
    const avg =
      sChecks.length === 0
        ? null
        : Math.round(sChecks.reduce((sum, c) => sum + c.score, 0) / sChecks.length);

    // weak micro_atoms (avg < 60 for this student)
    const byMicro = new Map<string, { sum: number; n: number }>();
    sChecks.forEach((c) => {
      const cur = byMicro.get(c.microAtomId) ?? { sum: 0, n: 0 };
      cur.sum += c.score;
      cur.n += 1;
      byMicro.set(c.microAtomId, cur);
    });
    const weak = MICRO_ATOMS.filter((m) => {
      const v = byMicro.get(m.id);
      return v && v.sum / v.n < 60;
    }).map((m) => m.title);

    const needsFollowUp =
      sDoses.length === 0 || (latest && latest.score < 60) || weak.length > 0;

    return { s, totalMinutes, doseCount: sDoses.length, latest, avg, weak, needsFollowUp };
  });

  const followUps = rows.filter((r) => r.needsFollowUp);

  return (
    <div dir="rtl" className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Beaker className="h-6 w-6 text-emerald-600" />
          پایش {CHAPTER.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          دوز مطالعه، آخرین چکاب و مفاهیم ضعیف هر دانش‌آموز در این فصل.
        </p>
      </header>

      <div className="grid sm:grid-cols-3 gap-3">
        <SummaryCard label="دانش‌آموزان" value={DEMO_STUDENTS.length.toString()} />
        <SummaryCard label="مجموع چکاب‌ها" value={checkups.length.toString()} />
        <SummaryCard label="نیازمند پیگیری" value={followUps.length.toString()} tone="rose" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">وضعیت دانش‌آموزان</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {rows.map((r) => (
            <div
              key={r.s.id}
              className="rounded-xl border p-4 bg-card flex flex-col gap-2"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <div className="font-medium">{r.s.name}</div>
                  <div className="text-xs text-muted-foreground">{r.s.className}</div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline">
                    دوز: {r.totalMinutes} دقیقه ({r.doseCount} بار)
                  </Badge>
                  <Badge
                    variant="outline"
                    className={
                      r.latest == null
                        ? ""
                        : r.latest.score < 60
                        ? "border-rose-300 text-rose-700"
                        : "border-emerald-300 text-emerald-700"
                    }
                  >
                    آخرین چکاب: {r.latest ? `${r.latest.score}٪` : "—"}
                  </Badge>
                  <Badge variant="outline">میانگین: {r.avg == null ? "—" : `${r.avg}٪`}</Badge>
                  {r.needsFollowUp && (
                    <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      نیازمند پیگیری
                    </Badge>
                  )}
                </div>
              </div>
              {r.weak.length > 0 && (
                <div className="text-xs text-rose-700">
                  مفاهیم ضعیف: {r.weak.join("، ")}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-rose-600" />
            دانش‌آموزان نیازمند پیگیری
          </CardTitle>
        </CardHeader>
        <CardContent>
          {followUps.length === 0 ? (
            <div className="text-sm text-muted-foreground">موردی برای پیگیری وجود ندارد.</div>
          ) : (
            <ul className="space-y-2 text-sm">
              {followUps.map((r) => (
                <li key={r.s.id} className="flex items-center justify-between">
                  <span>
                    {r.s.name} — {r.s.className}
                  </span>
                  <span className="text-muted-foreground">
                    {r.latest ? `چکاب ${r.latest.score}٪` : "بدون چکاب"}
                    {r.doseCount === 0 ? " · بدون دوز" : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "rose";
}) {
  return (
    <div
      className={`rounded-2xl border bg-card p-4 ${
        tone === "rose" ? "border-rose-200 bg-rose-50" : ""
      }`}
    >
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}
