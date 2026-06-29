import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, ChevronLeft } from "lucide-react";
import { SUBJECT, CHAPTER, GOFTARS } from "@/lib/mock/biology-ch1";

export const Route = createFileRoute("/student/biology/")({
  component: BiologyHome,
});

function BiologyHome() {
  return (
    <div dir="rtl" className="font-vazir space-y-6">
      <nav className="text-xs text-slate-500 flex items-center gap-1">
        <Link to="/student" className="hover:text-emerald-600">کلینیک من</Link>
        <span>/</span>
        <span className="text-slate-700 font-semibold">{SUBJECT.title}</span>
      </nav>

      <header className="flex items-center gap-3">
        <span className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-600 grid place-items-center">
          <Leaf className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">{SUBJECT.title}</h1>
          <p className="text-sm text-slate-500">فصل‌های فعال این درس را در ادامه می‌بینی.</p>
        </div>
      </header>

      <Card className="border-0 rounded-3xl shadow-sm bg-white overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-base text-slate-800">فصل‌ها</CardTitle>
            <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50">
              ۱ فصل فعال
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Link
            to="/student/biology/$chapterId"
            params={{ chapterId: CHAPTER.id }}
            className="block rounded-2xl border border-emerald-100 bg-emerald-50/40 hover:bg-emerald-50 transition p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs text-emerald-700 font-bold">آماده برای شروع</div>
                <div className="mt-1 text-lg font-extrabold text-slate-800">{CHAPTER.title}</div>
                <p className="text-sm text-slate-500 mt-1">
                  {GOFTARS.length} گفتار · میکرواتم‌های کلیدی این فصل را گام‌به‌گام کار کن.
                </p>
              </div>
              <ChevronLeft className="h-5 w-5 text-emerald-600 mt-1" />
            </div>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
