import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { Clock, ChevronLeft } from "lucide-react";

type Search = { module?: string };

export const Route = createFileRoute("/grade-supervisor/coming-soon")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    module: typeof s.module === "string" ? s.module : undefined,
  }),
  component: ComingSoon,
});

function ComingSoon() {
  const { module } = useSearch({ from: "/grade-supervisor/coming-soon" });
  return (
    <div dir="rtl" className="font-vazir min-h-[60vh] grid place-items-center">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-100 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)] p-8 text-center">
        <div className="h-14 w-14 mx-auto rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 grid place-items-center text-violet-600">
          <Clock className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-lg font-extrabold text-slate-800">
          {module ? module : "این بخش"} به‌زودی فعال می‌شود
        </h1>
        <p className="mt-2 text-sm text-slate-500 leading-6">
          این ماژول در حال آماده‌سازی است و پس از اتصال به سرویس‌های واقعی
          در دسترس قرار می‌گیرد. تا آن زمان از داشبورد، دانش‌آموزان و دفتر
          مسئول پایه استفاده کنید.
        </p>
        <Link
          to="/grade-supervisor"
          className="mt-6 inline-flex items-center gap-1.5 h-10 px-4 rounded-2xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition"
        >
          بازگشت به داشبورد
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
