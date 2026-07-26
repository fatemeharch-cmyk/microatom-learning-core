import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";
import type { ExamAttemptRow } from "@/lib/api/grade-supervisor-exams";
import {
  AnalyticsCard,
  AnalyticsEmpty,
  formatJalali,
  toFa,
} from "./analytics-shared";

interface Props {
  exams: ExamAttemptRow[];
  /** Grade average per exam id, when the backend provides it. */
  perExamGradeAvg?: Record<string, number>;
  /** Overall grade average, drawn as a reference line. */
  gradeAvg?: number | null;
}

export function ExamTrendCard({ exams, perExamGradeAvg, gradeAvg }: Props) {
  const data = exams
    .filter((e) => e.percentage !== null)
    .map((e) => ({
      label: formatJalali(e.examDate),
      title: e.title,
      student: Math.round(Number(e.percentage)),
      grade: perExamGradeAvg?.[e.examId] ?? undefined,
    }));

  const hasGradeSeries = data.some((d) => typeof d.grade === "number");

  return (
    <AnalyticsCard title="روند نمرات در طول زمان" icon={<TrendingUp className="h-4 w-4" />}>
      {data.length === 0 ? (
        <AnalyticsEmpty title="هنوز آزمون نمره‌داری برای رسم روند ثبت نشده است." />
      ) : (
        <div className="h-60 w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                axisLine={{ stroke: "var(--color-border)" }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                unit="%"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "0.75rem",
                  fontSize: 12,
                  direction: "rtl",
                }}
                formatter={(value: number, name: string) => [`${toFa(value)}٪`, name]}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {typeof gradeAvg === "number" && (
                <ReferenceLine
                  y={Math.round(gradeAvg)}
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                />
              )}
              <Line
                type="monotone"
                dataKey="student"
                name="دانش‌آموز"
                stroke="#7c3aed"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#7c3aed", strokeWidth: 0 }}
              />
              {hasGradeSeries && (
                <Line
                  type="monotone"
                  dataKey="grade"
                  name="میانگین پایه"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  strokeDasharray="5 4"
                  dot={false}
                  connectNulls
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </AnalyticsCard>
  );
}
