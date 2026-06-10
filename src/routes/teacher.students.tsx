import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Search,
  TrendingDown,
  TrendingUp,
  Users,
  Mail,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/teacher/students")({
  component: StudentAnalytics,
});

type Student = {
  id: string;
  name: string;
  cls: string;
  mastery: number;
  xp: number;
  trend: number;
  alert?: string;
};

const studentsFA: Student[] = [
  { id: "1", name: "آرین رضایی", cls: "پایه ۱۰ - الف", mastery: 87, xp: 2480, trend: 6 },
  { id: "2", name: "سارا محمدی", cls: "پایه ۱۰ - الف", mastery: 92, xp: 3100, trend: 4 },
  { id: "3", name: "علی کریمی", cls: "پایه ۱۰ - ب", mastery: 54, xp: 1320, trend: -8, alert: "افت محسوس در فیزیک" },
  { id: "4", name: "نگار صالحی", cls: "پایه ۱۱ - الف", mastery: 78, xp: 2210, trend: 2 },
  { id: "5", name: "محمد حسینی", cls: "پایه ۱۰ - ب", mastery: 41, xp: 980, trend: -12, alert: "۳ تکلیف تحویل نشده" },
  { id: "6", name: "زهرا اکبری", cls: "پایه ۱۱ - الف", mastery: 83, xp: 2650, trend: 5 },
];
const studentsEN: Student[] = [
  { id: "1", name: "Arian Rezaei", cls: "Grade 10-A", mastery: 87, xp: 2480, trend: 6 },
  { id: "2", name: "Sara Mohammadi", cls: "Grade 10-A", mastery: 92, xp: 3100, trend: 4 },
  { id: "3", name: "Ali Karimi", cls: "Grade 10-B", mastery: 54, xp: 1320, trend: -8, alert: "Drop in Physics" },
  { id: "4", name: "Negar Salehi", cls: "Grade 11-A", mastery: 78, xp: 2210, trend: 2 },
  { id: "5", name: "Mohammad Hosseini", cls: "Grade 10-B", mastery: 41, xp: 980, trend: -12, alert: "3 missing homework" },
  { id: "6", name: "Zahra Akbari", cls: "Grade 11-A", mastery: 83, xp: 2650, trend: 5 },
];

function StudentAnalytics() {
  const { lang } = useI18n();
  const fa = lang === "fa";
  const all = fa ? studentsFA : studentsEN;
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "top" | "risk">("all");

  const filtered = useMemo(() => {
    let list = all;
    if (filter === "top") list = list.filter((s) => s.mastery >= 80);
    if (filter === "risk") list = list.filter((s) => s.mastery < 60 || s.alert);
    if (q) list = list.filter((s) => s.name.includes(q) || s.cls.includes(q));
    return list;
  }, [all, q, filter]);

  const top = [...all].sort((a, b) => b.mastery - a.mastery).slice(0, 3);
  const risk = all.filter((s) => s.mastery < 60 || s.alert);

  const initials = (n: string) =>
    n
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("");

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <Badge variant="secondary" className="mb-2">
          <Users className="h-3 w-3 mx-1" />
          {fa ? "تحلیل دانش‌آموز" : "Student analytics"}
        </Badge>
        <h1 className="text-2xl font-bold tracking-tight">
          {fa ? "گزارش فردی دانش‌آموزان" : "Per-student reports"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {fa
            ? "روند رشد، تسلط و هشدارهای هر دانش‌آموز را دنبال کن."
            : "Track growth, mastery and alerts for every student."}
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground">{fa ? "کل دانش‌آموزان" : "Total students"}</p>
            <p className="text-3xl font-extrabold mt-2">{all.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground">{fa ? "برترین‌ها" : "Top performers"}</p>
            <p className="text-3xl font-extrabold mt-2 text-success">{top.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground">{fa ? "نیازمند توجه" : "At risk"}</p>
            <p className="text-3xl font-extrabold mt-2 text-destructive">{risk.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            {fa ? "هشدارها" : "Alerts"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {risk.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {fa ? "هیچ هشداری وجود ندارد." : "No alerts."}
            </p>
          ) : (
            risk.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-3 p-3 rounded-xl border bg-card"
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-warning/15 text-warning text-xs">
                    {initials(s.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{s.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {s.cls} • {s.alert ?? (fa ? "تسلط پایین" : "Low mastery")}
                  </p>
                </div>
                <Button size="sm" variant="outline" className="rounded-full">
                  <Mail className="h-3.5 w-3.5" />
                  {fa ? "پیام" : "Message"}
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {fa ? "همه دانش‌آموزان" : "All students"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute top-2.5 start-3 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={fa ? "جستجوی نام یا کلاس..." : "Search name or class..."}
                className="ps-9"
              />
            </div>
            <div className="flex gap-1">
              {(["all", "top", "risk"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-xs px-3 py-1.5 rounded-full border ${
                    filter === f
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card hover:bg-accent"
                  }`}
                >
                  {f === "all"
                    ? fa ? "همه" : "All"
                    : f === "top"
                      ? fa ? "برترین‌ها" : "Top"
                      : fa ? "نیازمند توجه" : "At risk"}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {filtered.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-3 p-3 rounded-xl border bg-card hover:bg-accent/30 transition"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/15 text-primary text-xs">
                    {initials(s.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold truncate">{s.name}</p>
                    {s.trend >= 0 ? (
                      <span className="text-[11px] flex items-center gap-0.5 text-success">
                        <TrendingUp className="h-3 w-3" />+{s.trend}٪
                      </span>
                    ) : (
                      <span className="text-[11px] flex items-center gap-0.5 text-destructive">
                        <TrendingDown className="h-3 w-3" />
                        {s.trend}٪
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {s.cls} • {s.xp} XP
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <Progress value={s.mastery} className="h-1.5 flex-1" />
                    <span className="text-[11px] text-muted-foreground w-10 text-end">
                      {s.mastery}٪
                    </span>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="rounded-full">
                  {fa ? "پروفایل" : "Profile"}
                </Button>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">
                {fa ? "نتیجه‌ای یافت نشد." : "No results."}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
