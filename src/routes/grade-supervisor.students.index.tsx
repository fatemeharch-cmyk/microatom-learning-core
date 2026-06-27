import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Upload, Users, ChevronLeft } from "lucide-react";
import { STUDENTS, STATUS_META, CLASSES, type StudentStatus } from "@/lib/mock/grade-students";

export const Route = createFileRoute("/grade-supervisor/students/")({
  component: StudentsList,
});

function toFa(n: number | string) {
  return Number(n).toLocaleString("fa-IR");
}

function StudentsList() {
  const [query, setQuery] = useState("");
  const [cls, setCls] = useState<string>("all");
  const [status, setStatus] = useState<StudentStatus | "all">("all");

  const filtered = useMemo(() => {
    return STUDENTS.filter((s) => {
      if (cls !== "all" && s.className !== cls) return false;
      if (status !== "all" && s.status !== status) return false;
      if (query && !s.name.includes(query)) return false;
      return true;
    });
  }, [query, cls, status]);

  return (
    <div dir="rtl" className="font-vazir space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">دانش‌آموزان پایه</h1>
          <p className="text-sm text-slate-500 mt-1">مدیریت، جست‌وجو و پیگیری وضعیت سلامت آموزشی دانش‌آموزان</p>
        </div>
        <button className="inline-flex items-center gap-2 h-10 px-4 rounded-2xl bg-violet-600 text-white text-xs font-semibold shadow-sm hover:bg-violet-700 transition">
          <Upload className="h-4 w-4" />
          بارگذاری فایل اکسل
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-3xl shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)] border border-slate-100 p-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-5 relative">
            <Search className="h-4 w-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              dir="rtl"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جست‌وجوی نام دانش‌آموز..."
              className="w-full h-11 pr-10 pl-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-violet-200 focus:bg-white transition"
            />
          </div>
          <select
            value={cls}
            onChange={(e) => setCls(e.target.value)}
            className="md:col-span-4 h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm text-slate-700 focus:outline-none focus:border-violet-200 focus:bg-white transition"
          >
            <option value="all">همه کلاس‌ها</option>
            {CLASSES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="md:col-span-3 h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm text-slate-700 focus:outline-none focus:border-violet-200 focus:bg-white transition"
          >
            <option value="all">همه وضعیت‌ها</option>
            {(["healthy", "watch", "warning", "risk"] as StudentStatus[]).map((s) => (
              <option key={s} value={s}>{STATUS_META[s].label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)] border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-violet-600" />
            <h2 className="text-sm font-bold text-slate-800">فهرست دانش‌آموزان</h2>
          </div>
          <span className="text-[11px] text-slate-400">{toFa(filtered.length)} مورد</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50/60 text-[11px] text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">دانش‌آموز</th>
                <th className="px-5 py-3 font-semibold">کلاس</th>
                <th className="px-5 py-3 font-semibold">سلامت آموزشی</th>
                <th className="px-5 py-3 font-semibold">آخرین چکاب</th>
                <th className="px-5 py-3 font-semibold">وضعیت</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s) => {
                const meta = STATUS_META[s.status];
                return (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${s.avatarColor} grid place-items-center text-sm font-bold text-slate-700`}>
                          {s.name.charAt(0)}
                        </div>
                        <span className="text-sm font-semibold text-slate-800">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-600">{s.className}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-l from-violet-500 to-pink-400"
                            style={{ width: `${s.healthScore}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-700">{toFa(s.healthScore)}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-600">{s.lastCheckup}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full border ${meta.pill}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                        {meta.label}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-left">
                      <Link
                        to="/grade-supervisor/students/$id"
                        params={{ id: s.id }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 hover:text-violet-700"
                      >
                        پرونده رشد
                        <ChevronLeft className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-400">
                    دانش‌آموزی با این فیلتر یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
