import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, ChevronLeft, Loader2 } from "lucide-react";
import {
  findBiologySubject,
  listChaptersBySubject,
} from "@/lib/services/content-service";

export const Route = createFileRoute("/student/biology/")({
  component: BiologyHome,
});

function BiologyHome() {
  const subjectQ = useQuery({
    queryKey: ["content", "biology-subject"],
    queryFn: () => findBiologySubject(),
    staleTime: 5 * 60_000,
  });
  const subject = subjectQ.data ?? null;

  const chaptersQ = useQuery({
    queryKey: ["content", "chapters", subject?.id],
    queryFn: () => listChaptersBySubject(subject!.id),
    enabled: !!subject?.id,
    staleTime: 5 * 60_000,
  });
  const chapters = chaptersQ.data ?? [];
  const subjectTitle = subject?.title || "زیست‌شناسی";

  return (
    <div dir="rtl" className="font-vazir space-y-6">
      <nav className="text-xs text-slate-500 flex items-center gap-1">
        <Link to="/student" className="hover:text-emerald-600">
          کلینیک من
        </Link>
        <span>/</span>
        <span className="text-slate-700 font-semibold">{subjectTitle}</span>
      </nav>

      <header className="flex items-center gap-3">
        <span className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-600 grid place-items-center">
          <Leaf className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">{subjectTitle}</h1>
          <p className="text-sm text-slate-500">فصل‌های فعال این درس را در ادامه می‌بینی.</p>
        </div>
      </header>

      <Card className="border-0 rounded-3xl shadow-sm bg-white overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-base text-slate-800">فصل‌ها</CardTitle>
            <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50">
              {chapters.length} فصل فعال
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {subjectQ.isLoading || chaptersQ.isLoading ? (
            <div className="flex items-center justify-center text-slate-400 py-10">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="mr-2 text-sm">در حال دریافت فصل‌ها…</span>
            </div>
          ) : subjectQ.isError || chaptersQ.isError ? (
            <div className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-2xl p-4">
              دریافت محتوای درس با خطا روبه‌رو شد. لطفاً دوباره تلاش کن.
            </div>
          ) : chapters.length === 0 ? (
            <div className="text-sm text-slate-500 bg-slate-50 border border-slate-100 rounded-2xl p-6 text-center">
              هنوز فصلی برای این درس ثبت نشده است.
            </div>
          ) : (
            <div className="grid gap-3">
              {chapters.map((c, idx) => (
                <Link
                  key={c.id}
                  to="/student/biology/$chapterId"
                  params={{ chapterId: c.id }}
                  className="block rounded-2xl border border-emerald-100 bg-emerald-50/40 hover:bg-emerald-50 transition p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs text-emerald-700 font-bold">
                        {c.number ? `فصل ${c.number}` : `فصل ${idx + 1}`}
                      </div>
                      <div className="mt-1 text-lg font-extrabold text-slate-800">
                        {c.title}
                      </div>
                      <p className="text-sm text-slate-500 mt-1">
                        میکرواتم‌های کلیدی این فصل را گام‌به‌گام کار کن.
                      </p>
                    </div>
                    <ChevronLeft className="h-5 w-5 text-emerald-600 mt-1" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
