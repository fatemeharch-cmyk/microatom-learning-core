import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type DataPoint = Record<string, string | number>;

interface LineChartCardProps {
  title: string;
  data: DataPoint[];
  lines: { key: string; color: string; name?: string }[];
  xKey?: string;
  yUnit?: string;
}

export function LineChartCard({
  title,
  data,
  lines,
  xKey = "label",
  yUnit = "",
}: LineChartCardProps) {
  const maxValue = Math.max(
    ...data.flatMap((d) => lines.map((l) => Number(d[l.key]) || 0)),
    0,
  );
  const yMax = maxValue > 0 ? Math.ceil(maxValue * 1.15) : 10;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold tracking-tight">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis
                dataKey={xKey}
                tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                axisLine={{ stroke: "var(--color-border)" }}
                tickLine={false}
              />
              <YAxis
                domain={[0, yMax]}
                tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                unit={yUnit}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "0.75rem",
                  fontSize: 13,
                }}
                labelStyle={{ color: "var(--color-foreground)", fontWeight: 600 }}
                itemStyle={{ color: "var(--color-foreground)" }}
                formatter={(value: number, name: string) => [`${value}${yUnit}`, name]}
              />
              {lines.map((ln) => (
                <Line
                  key={ln.key}
                  type="monotone"
                  dataKey={ln.key}
                  name={ln.name || ln.key}
                  stroke={ln.color}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: ln.color, strokeWidth: 0 }}
                  activeDot={{ r: 5, stroke: ln.color, strokeWidth: 2, fill: "var(--color-card)" }}
                  animationDuration={800}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
