import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import {
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Search,
  UserPlus,
  Loader2,
  ChevronLeft,
} from "lucide-react";
import { getAuthToken } from "@/lib/api/client";

// Xano API group for Grade Supervisor endpoints (from published API spec).
const GRADE_SUPERVISOR_BASE_URL =
  "https://x8ki-letl-twmt.n7.xano.io/api:grade-supervisor";

export const Route = createFileRoute("/grade-supervisor/students/")({
  component: StudentsPage,
});

// ---------------- Types ----------------
interface StudentRow {
  first_name: string;
  last_name: string;
  national_code: string;
  grade: string;
  major: string;
  class_name: string;
}
interface ParsedRow extends StudentRow {
  __rowIndex: number;
  __errors: string[];
}
interface ApiStudent {
  id?: number | string;
  first_name?: string;
  last_name?: string;
  national_code?: string;
  grade?: string;
  major?: string;
  class_name?: string;
  status?: string;
}
interface ImportResponse {
  success?: boolean | string;
  message?: string;
  created?: number;
  updated?: number;
  skipped?: number;
  failed?: number;
  summary?: {
    created?: number;
    updated?: number;
    skipped?: number;
    failed?: number;
    total?: number;
  } | null;
  errors?: Array<{
    row?: number;
    national_code?: string;
    message?: string;
    error?: string;
    reason?: string;
  }> | null;
}

// ---------------- Column mapping ----------------
const COLUMN_MAP: Record<string, keyof StudentRow> = {
  "نام": "first_name",
  "نام خانوادگی": "last_name",
  "کد ملی": "national_code",
  "پایه": "grade",
  "رشته": "major",
  "کلاس": "class_name",
};

const REQUIRED_FIELDS: (keyof StudentRow)[] = [
  "first_name",
  "last_name",
  "national_code",
  "grade",
  "major",
  "class_name",
];

function normalizeHeader(h: string): string {
  return String(h ?? "")
    .replace(/\u200c/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function validateRow(r: StudentRow): string[] {
  const errs: string[] = [];
  for (const f of REQUIRED_FIELDS) {
    if (!String(r[f] ?? "").trim()) errs.push("فیلد الزامی خالی است");
  }
  if (r.national_code && !/^\d{8,10}$/.test(String(r.national_code).trim())) {
    errs.push("کد ملی معتبر نیست");
  }
  return errs;
}

// ---------------- API ----------------
async function xanoFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAuthToken();
  const res = await fetch(`${SUPERVISOR_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });
  const text = await res.text();
  const data = text ? (JSON.parse(text) as unknown) : null;
  if (!res.ok) {
    const msg =
      (data && typeof data === "object" && "message" in data
        ? String((data as { message: unknown }).message ?? "")
        : "") || "";
    throw new Error(msg);
  }
  return data as T;
}

// ---------------- Sample file ----------------
function downloadSampleFile() {
  const headers = ["نام", "نام خانوادگی", "کد ملی", "پایه", "رشته", "کلاس"];
  const sample = [
    ["علی", "رضایی", "0012345678", "یازدهم", "تجربی", "الف"],
    ["زهرا", "کریمی", "0087654321", "یازدهم", "تجربی", "ب"],
  ];
  const ws = XLSX.utils.aoa_to_sheet([headers, ...sample]);
  ws["!views"] = [{ RTL: true }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "دانش‌آموزان");
  XLSX.writeFile(wb, "atomia-students-sample.xlsx");
}

// ---------------- Component ----------------
function StudentsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [parsed, setParsed] = useState<ParsedRow[] | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResponse | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [students, setStudents] = useState<ApiStudent[] | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [major, setMajor] = useState("all");
  const [className, setClassName] = useState("all");

  async function loadStudents() {
    setLoadingList(true);
    setListError(null);
    try {
      const data = await xanoFetch<ApiStudent[] | { students?: ApiStudent[] }>(
        "/grade-supervisor/students",
      );
      const list = Array.isArray(data) ? data : (data?.students ?? []);
      setStudents(list);
    } catch {
      setListError("دریافت فهرست دانش‌آموزان با خطا مواجه شد.");
      setStudents([]);
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setParsed(null);
    setParseError(null);
    setImportResult(null);
    setImportError(null);
  }

  async function handleParse() {
    if (!file) {
      setParseError("لطفاً ابتدا فایل اکسل را انتخاب کنید.");
      return;
    }
    setParseError(null);
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const firstSheet = wb.SheetNames[0];
      if (!firstSheet) throw new Error("empty");
      const ws = wb.Sheets[firstSheet];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, {
        defval: "",
        raw: false,
      });
      if (rows.length === 0) {
        setParseError("فایل انتخابی هیچ ردیفی ندارد.");
        setParsed([]);
        return;
      }
      const mapped: ParsedRow[] = rows.map((row, i) => {
        const out: StudentRow = {
          first_name: "",
          last_name: "",
          national_code: "",
          grade: "",
          major: "",
          class_name: "",
        };
        for (const [k, v] of Object.entries(row)) {
          const key = COLUMN_MAP[normalizeHeader(k)];
          if (key) out[key] = String(v ?? "").trim();
        }
        return { ...out, __rowIndex: i + 2, __errors: validateRow(out) };
      });
      setParsed(mapped);
    } catch {
      setParseError(
        "خواندن فایل اکسل امکان‌پذیر نبود. لطفاً از قالب نمونه استفاده کنید.",
      );
    }
  }

  function removeRow(idx: number) {
    if (!parsed) return;
    setParsed(parsed.filter((_, i) => i !== idx));
  }

  async function handleImport() {
    if (!parsed) return;
    const valid = parsed.filter((r) => r.__errors.length === 0);
    if (valid.length === 0) {
      setImportError("هیچ ردیف معتبری برای افزودن وجود ندارد.");
      return;
    }
    setImporting(true);
    setImportError(null);
    setImportResult(null);
    try {
      const payload = {
        students: valid.map(({ __rowIndex, __errors, ...s }) => {
          void __rowIndex;
          void __errors;
          return s;
        }),
      };
      const res = await xanoFetch<ImportResponse>(
        "/grade-supervisor/students/import",
        { method: "POST", body: JSON.stringify(payload) },
      );
      setImportResult(res ?? {});
      setParsed(null);
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      await loadStudents();
    } catch {
      setImportError("افزودن دانش‌آموزان با خطا مواجه شد. لطفاً دوباره تلاش کنید.");
    } finally {
      setImporting(false);
    }
  }

  const validCount = parsed?.filter((r) => r.__errors.length === 0).length ?? 0;
  const invalidCount = parsed?.filter((r) => r.__errors.length > 0).length ?? 0;

  const majors = useMemo(
    () => Array.from(new Set((students ?? []).map((s) => s.major).filter(Boolean))) as string[],
    [students],
  );
  const classes = useMemo(
    () => Array.from(new Set((students ?? []).map((s) => s.class_name).filter(Boolean))) as string[],
    [students],
  );

  const filteredStudents = useMemo(() => {
    return (students ?? []).filter((s) => {
      if (major !== "all" && s.major !== major) return false;
      if (className !== "all" && s.class_name !== className) return false;
      if (q) {
        const name = `${s.first_name ?? ""} ${s.last_name ?? ""}`.trim();
        if (!name.includes(q)) return false;
      }
      return true;
    });
  }, [students, q, major, className]);

  return (
    <div dir="rtl" className="font-vazir space-y-6 text-right">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">
          مدیریت دانش‌آموزان
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          فایل اکسل دانش‌آموزان را بارگذاری کن یا فهرست را مدیریت کن.
        </p>
      </div>

      {/* Import section */}
      <section dir="rtl" className="bg-white rounded-3xl shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)] border border-slate-100 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-violet-100 to-pink-100 text-violet-600 grid place-items-center">
            <FileSpreadsheet className="h-4 w-4" />
          </div>
          <h2 className="text-base font-extrabold text-slate-800">
            افزودن دانش‌آموزان از فایل اکسل
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <label className="md:col-span-5 h-11 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-sm text-slate-600 flex items-center gap-2 px-4 cursor-pointer hover:bg-white transition">
            <Upload className="h-4 w-4 text-slate-400" />
            <span className="truncate">
              {file ? file.name : "انتخاب فایل اکسل"}
            </span>
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={downloadSampleFile}
            className="md:col-span-3 h-11 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700 inline-flex items-center justify-center gap-1.5 hover:bg-white transition"
          >
            <Download className="h-4 w-4" />
            دانلود فایل نمونه
          </button>

          <button
            type="button"
            onClick={handleParse}
            disabled={!file}
            className="md:col-span-2 h-11 rounded-2xl bg-teal-600 text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <CheckCircle2 className="h-4 w-4" />
            بررسی فایل
          </button>

          <button
            type="button"
            onClick={handleImport}
            disabled={!parsed || validCount === 0 || importing}
            className="md:col-span-2 h-11 rounded-2xl bg-violet-600 text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {importing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            افزودن دانش‌آموزان
          </button>
        </div>

        {parseError && (
          <div className="rounded-2xl bg-rose-50 text-rose-700 text-xs px-4 py-3 border border-rose-100">
            {parseError}
          </div>
        )}
        {importError && (
          <div className="rounded-2xl bg-rose-50 text-rose-700 text-xs px-4 py-3 border border-rose-100">
            {importError}
          </div>
        )}

        {importResult && (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4 space-y-2">
            <p className="text-sm font-bold text-emerald-800">
              {importResult.message ?? "افزودن دانش‌آموزان با موفقیت انجام شد."}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <ResultChip label="ایجاد شده" value={importResult.created ?? 0} tone="emerald" />
              <ResultChip label="به‌روزرسانی" value={importResult.updated ?? 0} tone="teal" />
              <ResultChip label="نادیده گرفته شده" value={importResult.skipped ?? 0} tone="amber" />
              <ResultChip label="ناموفق" value={importResult.failed ?? 0} tone="rose" />
            </div>
          </div>
        )}

        {parsed && parsed.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap text-xs">
              <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {validCount.toLocaleString("fa-IR")} ردیف معتبر
              </span>
              <span className="px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100 inline-flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" />
                {invalidCount.toLocaleString("fa-IR")} ردیف نامعتبر
              </span>
            </div>

            <div dir="rtl" className="overflow-auto rounded-2xl border border-slate-100">
              <table dir="rtl" className="min-w-full text-xs text-right">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <Th>نام</Th>
                    <Th>نام خانوادگی</Th>
                    <Th>کد ملی</Th>
                    <Th>پایه</Th>
                    <Th>رشته</Th>
                    <Th>کلاس</Th>
                    <Th>وضعیت</Th>
                    <Th> </Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {parsed.map((r, i) => (
                    <tr key={i} className={r.__errors.length ? "bg-rose-50/40" : ""}>
                      <Td>{r.first_name}</Td>
                      <Td>{r.last_name}</Td>
                      <Td>{r.national_code}</Td>
                      <Td>{r.grade}</Td>
                      <Td>{r.major}</Td>
                      <Td>{r.class_name}</Td>
                      <Td>
                        {r.__errors.length === 0 ? (
                          <span className="text-emerald-600 font-semibold">معتبر</span>
                        ) : (
                          <span className="text-rose-600" title={r.__errors.join("، ")}>
                            نامعتبر
                          </span>
                        )}
                      </Td>
                      <Td>
                        <button
                          onClick={() => removeRow(i)}
                          className="h-7 w-7 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 grid place-items-center"
                          title="حذف ردیف"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Filters */}
      <section dir="rtl" className="bg-white rounded-3xl shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)] border border-slate-100 p-4">
        <div dir="rtl" className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search className="h-4 w-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              dir="rtl"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="جست‌وجوی نام"
              className="w-full h-11 pr-10 pl-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-violet-200 focus:bg-white transition text-right"
            />
          </div>
          <FilterSelect value={major} onChange={setMajor} label="همه رشته‌ها" options={majors} className="md:col-span-3" />
          <FilterSelect value={className} onChange={setClassName} label="همه کلاس‌ها" options={classes} className="md:col-span-3" />
        </div>
      </section>

      {/* Student list */}
      <section dir="rtl" className="bg-white rounded-3xl shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)] border border-slate-100 overflow-hidden">
        {loadingList ? (
          <div className="p-10 text-center text-sm text-slate-400 inline-flex items-center justify-center gap-2 w-full">
            <Loader2 className="h-4 w-4 animate-spin" />
            در حال بارگذاری...
          </div>
        ) : listError ? (
          <div className="p-10 text-center text-sm text-rose-600">{listError}</div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-400">
            هنوز دانش‌آموزی به این پایه اضافه نشده است.
          </div>
        ) : (
          <div dir="rtl" className="overflow-auto">
            <table dir="rtl" className="min-w-full text-xs text-right">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <Th>نام</Th>
                  <Th>نام خانوادگی</Th>
                  <Th>کد ملی</Th>
                  <Th>پایه</Th>
                  <Th>رشته</Th>
                  <Th>کلاس</Th>
                  <Th>وضعیت</Th>
                  <Th> </Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredStudents.map((s, i) => (
                  <tr key={s.id ?? i} className="hover:bg-slate-50/60">
                    <Td className="font-semibold text-slate-800">{s.first_name ?? "—"}</Td>
                    <Td className="font-semibold text-slate-800">{s.last_name ?? "—"}</Td>
                    <Td>{s.national_code ?? "—"}</Td>
                    <Td>{s.grade ?? "—"}</Td>
                    <Td>{s.major ?? "—"}</Td>
                    <Td>{s.class_name ?? "—"}</Td>
                    <Td>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px]">
                        {s.status ?? "فعال"}
                      </span>
                    </Td>
                    <Td>
                      {s.id != null && (
                        <Link
                          to="/grade-supervisor/students/$id"
                          params={{ id: String(s.id) }}
                          className="inline-flex items-center gap-1 text-violet-600 hover:text-violet-700 font-semibold"
                        >
                          پرونده
                          <ChevronLeft className="h-3 w-3" />
                        </Link>
                      )}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-right px-4 py-3 font-bold text-[11px] whitespace-nowrap">
      {children}
    </th>
  );
}
function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={`px-4 py-3 text-slate-700 whitespace-nowrap text-right ${className}`}>
      {children}
    </td>
  );
}

function ResultChip({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "emerald" | "teal" | "amber" | "rose";
}) {
  const map: Record<string, string> = {
    emerald: "bg-emerald-100 text-emerald-800",
    teal: "bg-teal-100 text-teal-800",
    amber: "bg-amber-100 text-amber-800",
    rose: "bg-rose-100 text-rose-800",
  };
  return (
    <div className={`rounded-xl px-3 py-2 ${map[tone]}`}>
      <p className="text-[10px] opacity-80">{label}</p>
      <p className="text-sm font-extrabold">{value.toLocaleString("fa-IR")}</p>
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  label,
  options,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  options: string[];
  className?: string;
}) {
  return (
    <select
      dir="rtl"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`h-11 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm text-slate-700 focus:outline-none focus:border-violet-200 focus:bg-white transition text-right ${className}`}
    >
      <option value="all">{label}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
