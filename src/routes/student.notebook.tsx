import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Stethoscope,
  AlertCircle,
  Sparkles,
  BookOpen,
  Target,
  ArrowLeft,
} from "lucide-react";
import {
  getLearningClinic,
  type LearningClinicMistake,
  type LearningClinicResponse,
  type LearningClinicWeakArea,
} from "@/lib/services/content-service";

export const Route = createFileRoute("/student/notebook")({
  component: LearningClinicPage,
});

type FilterKey =
  | "all"
  | "wrong"
  | "blank"
  | "زیست"
  | "شیمی"
  | "فیزیک"
  | "ریاضی";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "همه" },
  { key: "wrong", label: "غلط‌ها" },
  { key: "blank", label: "نزده‌ها" },
  { key: "زیست", label: "زیست" },
  { key: "شیمی", label: "شیمی" },
  { key: "فیزیک", label: "فیزیک" },
  { key: "ریاضی", label: "ریاضی" },
];

function s(v: unknown): string {
  return v == null ? "" : String(v);
}
function n(v: unknown): number | null {
  if (v == null || v === "") return null;
  const x = typeof v === "number" ? v : Number(v);
  return Number.isFinite(x) ? x : null;
}

function isBlank(m: LearningClinicMistake): boolean {
  const st = s(m.status).toLowerCase();
  if (st) return st.includes("blank") || st.includes("نزده");
  const ans = s(m.student_answer).trim();
  return ans === "" || ans === "-" || ans.toLowerCase() === "null";
}

function LearningClinicPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<LearningClinicResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let alive = true;
    setLoading(true);
    getLearningClinic()
      .then((res) => {
        if (!alive) return;
        setData(res);
        setError(null);
      })
      .catch((e: unknown) => {
        if (!alive) return;
        setError(
          e instanceof Error ? e.message : "دریافت اطلاعات کلینیک با خطا مواجه شد.",
        );
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const mistakes = data?.mistakes ?? [];
  const filtered = useMemo(() => {
    if (filter === "all") return mistakes;
    if (filter === "wrong") return mistakes.filter((m) => !isBlank(m));
    if (filter === "blank") return mistakes.filter((m) => isBlank(m));
    return mistakes.filter((m) => s(m.subject).includes(filter));
  }, [mistakes, filter]);

  const summary = data?.summary ?? {};
  const summaryCards: { label: string; value: string | number; tone: string }[] = [
    {
      label: "کل اشتباهات",
      value:
        n(summary.total_mistakes) ??
        n((summary as { totalMistakes?: unknown }).totalMistakes) ??
        mistakes.length,
      tone: "text-rose-600 bg-rose-50 border-rose-100",
    },
    {
      label: "پاسخ‌های غلط",
      value:
        n(summary.wrong_count) ??
        n((summary as { wrongCount?: unknown }).wrongCount) ??
        mistakes.filter((m) => !isBlank(m)).length,
      tone: "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
      label: "سؤالات نزده",
      value:
        n(summary.blank_count) ??
        n((summary as { blankCount?: unknown }).blankCount) ??
        mistakes.filter(isBlank).length,
      tone: "text-slate-600 bg-slate-50 border-slate-100",
    },
    {
      label: "نقاط ضعف",
      value:
        n(summary.weak_area_count) ??
        n((summary as { weakAreaCount?: unknown }).weakAreaCount) ??
        (data?.weak_areas.length ?? 0),
      tone: "text-violet-600 bg-violet-50 border-violet-100",
    },
  ];

  const rec = data?.recommended_action ?? null;
  const smartAvailable = Boolean(rec?.smart_review_available);

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Stethoscope className="h-6 w-6 text-primary" /> کلینیک یادگیری
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            مرور اشتباهات و نقاط ضعف برای رشد سلامت یادگیری
          </p>
        </div>
        {smartAvailable && (
          <Button
            onClick={() => navigate({ to: "/student/smart-review" })}
            className="rounded-full gap-2"
          >
            <Sparkles className="h-4 w-4" />
            دریافت نسخه هوشمند
          </Button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))
          : summaryCards.map((c) => (
              <Card
                key={c.label}
                className={`rounded-2xl border ${c.tone.split(" ").slice(1).join(" ")}`}
              >
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                  <p className={`text-3xl font-bold mt-1 ${c.tone.split(" ")[0]}`}>
                    {c.value}
                  </p>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Recommended action */}
      {!loading && rec && (rec.message || rec.title) && (
        <Card className="rounded-2xl border-violet-200 bg-gradient-to-l from-violet-50 to-indigo-50">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-semibold text-violet-900">
                {s(rec.title) || "پیشنهاد آتومیا"}
              </p>
              {rec.message && (
                <p className="text-sm text-slate-700 leading-6">
                  {s(rec.message)}
                </p>
              )}
              {smartAvailable && (
                <div className="pt-2">
                  <Button
                    size="sm"
                    onClick={() => navigate({ to: "/student/smart-review" })}
                    className="rounded-full gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    شروع مرور هوشمند
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3.5 py-1.5 rounded-full text-sm border transition-all ${
              filter === f.key
                ? "bg-primary text-white border-primary shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:border-primary/40"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Weak areas */}
      {!loading && (data?.weak_areas.length ?? 0) > 0 && (
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4 text-rose-500" />
              ضعیف‌ترین مباحث
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2">
              {data!.weak_areas.map((w: LearningClinicWeakArea, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl border border-rose-100 bg-rose-50/40 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {s(w.title) ||
                        s(w.micro_atom) ||
                        s(w.goftar) ||
                        s(w.chapter) ||
                        s(w.subject) ||
                        "—"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {[s(w.subject), s(w.chapter), s(w.goftar)]
                        .filter(Boolean)
                        .join(" • ")}
                    </p>
                  </div>
                  <div className="text-left shrink-0">
                    {n(w.score) !== null && (
                      <p className="text-xs text-rose-600 font-semibold">
                        {n(w.score)}٪
                      </p>
                    )}
                    {n(w.mistake_count) !== null && (
                      <p className="text-[11px] text-muted-foreground">
                        {n(w.mistake_count)} اشتباه
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mistakes timeline */}
      <div className="relative">
        <div className="absolute right-4 top-2 bottom-2 w-px bg-border" />
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="pr-12">
                <Skeleton className="h-40 rounded-2xl" />
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="pr-12">
              <Card className="rounded-2xl">
                <CardContent className="p-8 text-center text-sm text-muted-foreground">
                  {mistakes.length === 0
                    ? "هنوز اشتباهی برای مرور ثبت نشده است."
                    : "با این فیلتر موردی یافت نشد."}
                </CardContent>
              </Card>
            </div>
          ) : (
            filtered.map((m, idx) => {
              const blank = isBlank(m);
              const key = s(m.id ?? m.question_id ?? idx);
              const isOpen = Boolean(expanded[key]);
              return (
                <div key={key} className="relative pr-12">
                  <div
                    className={`absolute right-2 top-4 h-5 w-5 rounded-full border-4 border-background ${
                      blank ? "bg-slate-400" : "bg-rose-500"
                    }`}
                  />
                  <Card className="rounded-2xl">
                    <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          {m.subject && (
                            <Badge variant="secondary" className="rounded-lg">
                              {s(m.subject)}
                            </Badge>
                          )}
                          {m.chapter && (
                            <Badge variant="outline" className="rounded-lg">
                              {s(m.chapter)}
                            </Badge>
                          )}
                          <Badge
                            className={
                              blank
                                ? "bg-slate-100 text-slate-700 border-slate-200"
                                : "bg-rose-100 text-rose-700 border-rose-200"
                            }
                          >
                            {blank ? "نزده" : "غلط"}
                          </Badge>
                        </div>
                        <CardTitle className="text-sm font-medium mt-2 leading-6">
                          {s(m.question_text) || "—"}
                        </CardTitle>
                        <p className="text-[11px] text-muted-foreground mt-1">
                          {[s(m.goftar), s(m.atom), s(m.micro_atom)]
                            .filter(Boolean)
                            .join(" › ")}
                          {m.exam_date ? ` • ${s(m.exam_date)}` : ""}
                        </p>
                      </div>
                      <AlertCircle
                        className={`h-4 w-4 shrink-0 mt-1 ${
                          blank ? "text-slate-400" : "text-rose-500"
                        }`}
                      />
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid gap-2 md:grid-cols-2">
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-100">
                          <p className="text-[11px] text-rose-600 mb-1">
                            پاسخ شما
                          </p>
                          <p className="text-sm text-slate-800">
                            {blank ? "—" : s(m.student_answer) || "—"}
                          </p>
                        </div>
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                          <p className="text-[11px] text-emerald-700 mb-1">
                            پاسخ صحیح
                          </p>
                          <p className="text-sm text-slate-800">
                            {s(m.correct_answer) || "—"}
                          </p>
                        </div>
                      </div>

                      {m.explanation && (
                        <Accordion
                          type="single"
                          collapsible
                          value={isOpen ? "exp" : ""}
                          onValueChange={(v) =>
                            setExpanded((prev) => ({
                              ...prev,
                              [key]: v === "exp",
                            }))
                          }
                        >
                          <AccordionItem value="exp" className="border-0">
                            <AccordionTrigger className="py-2 text-sm text-primary hover:no-underline gap-2">
                              <span className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                مشاهده توضیح
                              </span>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="p-3 rounded-xl bg-accent/30 text-sm leading-7 text-slate-700">
                                {s(m.explanation)}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      )}

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full gap-1"
                          onClick={() =>
                            setExpanded((prev) => ({
                              ...prev,
                              [key]: !prev[key],
                            }))
                          }
                          disabled={!m.explanation}
                        >
                          <BookOpen className="h-3.5 w-3.5" />
                          مشاهده توضیح
                        </Button>
                        <Button
                          size="sm"
                          className="rounded-full gap-1"
                          onClick={() =>
                            navigate({ to: "/student/smart-review" })
                          }
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          شروع مرور هوشمند
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
