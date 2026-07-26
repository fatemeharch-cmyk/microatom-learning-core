import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  getGradeBenchmarks,
  getStudentExamBreakdown,
  getStudentExamHistory,
  type BenchmarksResult,
  type ExamBreakdownResult,
  type ExamHistoryResult,
} from "@/lib/api/grade-supervisor-exams";
import { ComparisonStatTiles } from "./comparison-stat-tiles";
import { ExamTrendCard } from "./exam-trend-card";
import { SubjectBreakdownCard } from "./subject-breakdown-card";
import { StrengthWeaknessCard } from "./strength-weakness-card";
import { ExamHistoryTable } from "./exam-history-table";

interface Props {
  studentId: string | number;
  gradeLevel?: string;
  major?: string;
  className?: string;
  /** Rendered when the analytics endpoints are not available yet. */
  fallback?: React.ReactNode;
}

export function StudentExamAnalytics({
  studentId,
  gradeLevel = "یازدهم",
  major = "تجربی",
  className,
  fallback,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<ExamHistoryResult>({
    exams: [],
    available: false,
  });
  const [breakdown, setBreakdown] = useState<ExamBreakdownResult>({
    bySubject: [],
    byChapter: [],
    available: false,
  });
  const [bench, setBench] = useState<BenchmarksResult>({
    gradeAvgPercentage: null,
    classAvgPercentage: null,
    bySubject: [],
    perExam: {},
    available: false,
  });

  const load = useCallback(async () => {
    setLoading(true);
    // Sequential on purpose: keeps Xano rate-limit pressure low.
    const h = await getStudentExamHistory(studentId);
    setHistory(h);
    const b = await getStudentExamBreakdown(studentId);
    setBreakdown(b);
    const bm = await getGradeBenchmarks({ gradeLevel, major, className });
    setBench(bm);
    setLoading(false);
  }, [studentId, gradeLevel, major, className]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 p-10 flex flex-col items-center gap-3 text-slate-500">
        <Loader2 className="h-5 w-5 animate-spin text-violet-500" />
        <p className="text-xs">در حال دریافت تحلیل آزمون‌ها...</p>
      </div>
    );
  }

  const anyAvailable = history.available || breakdown.available;
  if (!anyAvailable) return <>{fallback ?? null}</>;

  const scored = history.exams.filter((e) => e.percentage !== null);
  const studentAvg =
    scored.length > 0
      ? Math.round(
          scored.reduce((s, e) => s + Number(e.percentage), 0) / scored.length,
        )
      : null;

  const totalQ = history.exams.reduce((s, e) => s + e.questionCount, 0);
  const totalCorrect = history.exams.reduce((s, e) => s + e.correct, 0);
  const accuracy = totalQ > 0 ? Math.round((totalCorrect / totalQ) * 100) : null;

  const gradeAvg = bench.classAvgPercentage ?? bench.gradeAvgPercentage;

  // Enrich subject rows with benchmark averages when the breakdown itself
  // does not carry a class average.
  const subjectRows = breakdown.bySubject.map((r) => {
    if (r.classAvgPercentage !== null) return r;
    const match = bench.bySubject.find(
      (b) => (b.id && b.id === r.id) || b.name === r.name,
    );
    return match ? { ...r, classAvgPercentage: match.avgPercentage } : r;
  });

  return (
    <div className="space-y-4">
      <ComparisonStatTiles
        examCount={history.exams.length}
        studentAvg={studentAvg}
        gradeAvg={gradeAvg}
        accuracy={accuracy}
      />
      <ExamTrendCard
        exams={history.exams}
        perExamGradeAvg={bench.perExam}
        gradeAvg={gradeAvg}
      />
      <SubjectBreakdownCard rows={subjectRows} />
      {breakdown.byChapter.length > 0 && (
        <SubjectBreakdownCard rows={breakdown.byChapter} title="تفکیک بر اساس سرفصل" />
      )}
      <StrengthWeaknessCard rows={subjectRows} gradeAvg={gradeAvg} />
      <ExamHistoryTable exams={history.exams} />
    </div>
  );
}
