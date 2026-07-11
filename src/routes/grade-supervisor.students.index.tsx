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
  ChevronRight,
} from "lucide-react";
import { getAuthToken } from "@/lib/api/client";

// Xano API group for Grade Supervisor endpoints (from published API spec).
const GRADE_SUPERVISOR_BASE_URL =
  "https://x8ki-letl-twmt.n7.xano.io/api:grade-supervisor";

export const Route = createFileRoute("/grade-supervisor/students/")({
  component: StudentsPage,
});

// ---------------- Mapping options ----------------
type FieldKey =
  | "first_name"
  | "last_name"
  | "national_code"
  | "student_mobile"
  | "father_mobile"
  | "mother_mobile"
  | "major"
  | "grade_level"
  | "class_name"
  | "academic_year";

type MappingValue = "" | "__ignore__" | FieldKey;

const MAPPING_OPTIONS: { value: MappingValue; label: string }[] = [
  { value: "", label: "--" },
  { value: "first_name", label: "نام" },
  { value: "last_name", label: "نام خانوادگی" },
  { value: "national_code", label: "کد ملی" },
  { value: "student_mobile", label: "موبایل دانش‌آموز" },
  { value: "father_mobile", label: "موبایل پدر" },
  { value: "mother_mobile", label: "موبایل مادر" },
  { value: "major", label: "رشته" },
  { value: "grade_level", label: "پایه" },
  { value: "class_name", label: "کلاس" },
  { value: "academic_year", label: "سال تحصیلی" },
  { value: "__ignore__", label: "نادیده گرفتن ستون" },
];

const REQUIRED_FIELDS: FieldKey[] = [
  "first_name",
  "last_name",
  "national_code",
  "grade_level",
  "major",
  "class_name",
];

const TEXT_FIELDS: FieldKey[] = [
  "national_code",
  "student_mobile",
  "father_mobile",
  "mother_mobile",
];

const FIELD_LABEL: Record<FieldKey, string> = {
  first_name: "نام",
  last_name: "نام خانوادگی",
  national_code: "کد ملی",
  student_mobile: "موبایل دانش‌آموز",
  father_mobile: "موبایل پدر",
  mother_mobile: "موبایل مادر",
  major: "رشته",
  grade_level: "پایه",
  class_name: "کلاس",
  academic_year: "سال تحصیلی",
};

// header aliases → FieldKey
const HEADER_ALIASES: Record<string, FieldKey> = {
  "نام": "first_name",
  "نام دانش آموز": "first_name",
  "نام دانش‌آموز": "first_name",
  "نام خانوادگی": "last_name",
  "فامیلی": "last_name",
  "کد ملی": "national_code",
  "کدملی": "national_code",
  "موبایل دانش آموز": "student_mobile",
  "موبایل دانش‌آموز": "student_mobile",
  "شماره دانش آموز": "student_mobile",
  "شماره دانش‌آموز": "student_mobile",
  "شماره موبایل دانش آموز": "student_mobile",
  "شماره موبایل دانش‌آموز": "student_mobile",
  "موبایل پدر": "father_mobile",
  "شماره پدر": "father_mobile",
  "موبایل مادر": "mother_mobile",
  "شماره مادر": "mother_mobile",
  "رشته": "major",
  "پایه": "grade_level",
  "کلاس": "class_name",
  "نام کلاس": "class_name",
  "سال تحصیلی": "academic_year",

};

interface ApiStudent {
  id?: number | string;
  first_name?: string;
  last_name?: string;
  national_code?: string;
  grade?: string;
  grade_level?: string;
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

function normalizeHeader(h: string): string {
  return String(h ?? "")
    .replace(/\u200c/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toEnDigits(s: string): string {
  return s
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
}

// ---------------- API ----------------
async function xanoFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAuthToken();
  const res = await fetch(`${GRADE_SUPERVISOR_BASE_URL}${path}`, {
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
interface ExcelParseState {
  headers: string[];
  rows: string[][]; // as strings, preserving text
}
interface ValidatedRow {
  data: Partial<Record<FieldKey, string>>;
  errors: string[];
  __rowIndex: number;
}

function StudentsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [excel, setExcel] = useState<ExcelParseState | null>(null);
  const [mapping, setMapping] = useState<MappingValue[]>([]);
  const [mappingWarning, setMappingWarning] = useState<string | null>(null);
  const [validated, setValidated] = useState<ValidatedRow[] | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResponse | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [credentialsPayload, setCredentialsPayload] = useState<
    { first_name: string; last_name: string; national_code: string }[] | null
  >(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [previewPage, setPreviewPage] = useState(1);
  const PREVIEW_PAGE_SIZE = 8;

  const [students, setStudents] = useState<ApiStudent[] | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [className, setClassName] = useState("all");

  // Fixed scope for this Grade Supervisor
  const FIXED_GRADE = "یازدهم";
  const FIXED_MAJOR = "تجربی";

  async function loadStudents() {
    setLoadingList(true);
    setListError(null);
    try {
      const qs = new URLSearchParams({
        grade_level: FIXED_GRADE,
        major: FIXED_MAJOR,
      }).toString();
      const data = await xanoFetch<unknown>(`/students?${qs}`);
      let list: ApiStudent[] = [];
      if (Array.isArray(data)) {
        list = data as ApiStudent[];
      } else if (data && typeof data === "object") {
        const obj = data as Record<string, unknown>;
        const raw = obj.students ?? obj.data ?? obj.items ?? obj.result;
        if (Array.isArray(raw)) {
          list = raw as ApiStudent[];
        } else if (typeof raw === "string") {
          try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) list = parsed as ApiStudent[];
          } catch {
            /* ignore */
          }
        }
      }
      setStudents(list);
    } catch (err) {
      const msg = err instanceof Error && err.message ? err.message : "";
      setListError(
        msg
          ? `دریافت فهرست دانش‌آموزان با خطا مواجه شد: ${msg}`
          : "دریافت فهرست دانش‌آموزان با خطا مواجه شد.",
      );
      setStudents([]);
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setExcel(null);
    setMapping([]);
    setValidated(null);
    setParseError(null);
    setImportResult(null);
    setImportError(null);
    setMappingWarning(null);
    setPreviewPage(1);
    if (!f) return;
    try {
      const buf = await f.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const first = wb.SheetNames[0];
      if (!first) throw new Error("empty");
      const ws = wb.Sheets[first];
      // read as array-of-arrays, all as strings to preserve leading zeros
      const aoa = XLSX.utils.sheet_to_json<unknown[]>(ws, {
        header: 1,
        defval: "",
        raw: false,
        blankrows: false,
      });
      if (aoa.length === 0) {
        setParseError("فایل انتخابی هیچ ردیفی ندارد.");
        return;
      }
      const headerRow = (aoa[0] as unknown[]).map((h) =>
        normalizeHeader(String(h ?? "")),
      );
      const dataRows = aoa.slice(1).map((r) =>
        headerRow.map((_, i) => String((r as unknown[])[i] ?? "").trim()),
      );
      const auto: MappingValue[] = headerRow.map((h) => {
        const key = HEADER_ALIASES[h];
        return key ? (key as MappingValue) : "";
      });
      // ensure uniqueness in auto-map (first occurrence wins)
      const seen = new Set<string>();
      const unique = auto.map((v) => {
        if (!v || v === "__ignore__") return v;
        if (seen.has(v)) return "" as MappingValue;
        seen.add(v);
        return v;
      });
      setExcel({ headers: headerRow, rows: dataRows });
      setMapping(unique);
    } catch {
      setParseError(
        "خواندن فایل اکسل امکان‌پذیر نبود. لطفاً از قالب نمونه استفاده کنید.",
      );
    }
  }

  function updateMapping(colIdx: number, value: MappingValue) {
    setMappingWarning(null);
    setMapping((prev) => {
      const next = [...prev];
      if (value && value !== "__ignore__") {
        // Reset any other column that had the same field
        for (let i = 0; i < next.length; i++) {
          if (i !== colIdx && next[i] === value) {
            next[i] = "";
            setMappingWarning(
              `ستون قبلی متناظر با «${FIELD_LABEL[value as FieldKey]}» پاک شد. هر فیلد فقط می‌تواند به یک ستون اختصاص یابد.`,
            );
          }
        }
      }
      next[colIdx] = value;
      return next;
    });
    setValidated(null);
  }

  const missingRequired = useMemo<FieldKey[]>(() => {
    const chosen = new Set(mapping.filter(Boolean));
    return REQUIRED_FIELDS.filter((f) => !chosen.has(f));
  }, [mapping]);

  function validateRowData(
    data: Partial<Record<FieldKey, string>>,
  ): string[] {
    const errs: string[] = [];
    for (const f of REQUIRED_FIELDS) {
      if (!String(data[f] ?? "").trim()) {
        errs.push(`فیلد «${FIELD_LABEL[f]}» خالی است`);
      }
    }
    const nc = String(data.national_code ?? "").trim();
    if (nc && !/^\d{8,10}$/.test(toEnDigits(nc))) {
      errs.push("کد ملی معتبر نیست");
    }
    return errs;
  }

  function handleValidate() {
    if (!excel) return;
    if (missingRequired.length > 0) {
      setValidated(null);
      setImportError(null);
      setMappingWarning(
        "لطفاً ستون‌های نام، نام خانوادگی، کد ملی، پایه، رشته و کلاس را مشخص کنید.",
      );
      return;
    }
    setMappingWarning(null);
    const rows: ValidatedRow[] = excel.rows.map((row, i) => {
      const data: Partial<Record<FieldKey, string>> = {};
      mapping.forEach((m, colIdx) => {
        if (!m || m === "__ignore__") return;
        const key = m as FieldKey;
        let val = String(row[colIdx] ?? "").trim();
        if (TEXT_FIELDS.includes(key)) {
          val = toEnDigits(val);
        }
        data[key] = val;
      });
      return { data, errors: validateRowData(data), __rowIndex: i + 2 };
    });
    // Duplicate national_code detection across the sheet
    const counts = new Map<string, number>();
    rows.forEach((r) => {
      const nc = String(r.data.national_code ?? "").trim();
      if (nc) counts.set(nc, (counts.get(nc) ?? 0) + 1);
    });
    rows.forEach((r) => {
      const nc = String(r.data.national_code ?? "").trim();
      if (nc && (counts.get(nc) ?? 0) > 1) {
        r.errors.push("کد ملی تکراری در فایل");
      }
    });
    setValidated(rows);
  }

  function removeRow(idx: number) {
    if (!validated) return;
    setValidated(validated.filter((_, i) => i !== idx));
  }

  function downloadCredentialsFile(
    rows: { first_name: string; last_name: string; national_code: string }[],
  ) {
    const headers = [
      "نام",
      "نام خانوادگی",
      "کد ملی",
      "نام کاربری",
      "رمز عبور",
    ];
    const body = rows.map((r) => [
      r.first_name,
      r.last_name,
      r.national_code,
      r.national_code,
      r.national_code,
    ]);
    const ws = XLSX.utils.aoa_to_sheet([headers, ...body]);
    ws["!views"] = [{ RTL: true }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "اطلاعات ورود");
    XLSX.writeFile(wb, "atomia-students-credentials.xlsx");
  }

  async function handleImport() {
    if (!validated) return;
    const valid = validated.filter((r) => r.errors.length === 0);
    const invalid = validated.filter((r) => r.errors.length > 0);
    if (valid.length === 0) {
      setImportError("هیچ ردیف معتبری برای افزودن وجود ندارد.");
      return;
    }
    setImporting(true);
    setImportError(null);
    setImportResult(null);
    try {
      const students = valid.map((r) => {
        const nc = String(r.data.national_code ?? "").trim();
        return {
          ...r.data,
          role: "student",
          username: nc,
          password: nc,
          must_change_password: false,
        };
      });
      const payload = { students };
      const res = await xanoFetch<ImportResponse>("/students/import", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const result: ImportResponse = {
        ...(res ?? {}),
        summary: {
          ...(res?.summary ?? {}),
          created:
            res?.summary?.created ??
            res?.created ??
            valid.length,
          failed:
            res?.summary?.failed ??
            res?.failed ??
            invalid.length,
        },
      };
      setImportResult(result);
      // Build downloadable credentials file from what we sent
      setCredentialsPayload(
        students.map((s) => ({
          first_name: String(s.first_name ?? ""),
          last_name: String(s.last_name ?? ""),
          national_code: String(s.national_code ?? ""),
        })),
      );
      setValidated(null);
      setExcel(null);
      setMapping([]);
      setFile(null);
      setPreviewPage(1);
      if (fileRef.current) fileRef.current.value = "";
      await loadStudents();
    } catch (err) {
      const msg = err instanceof Error && err.message ? err.message : "";
      setImportError(
        msg
          ? `افزودن دانش‌آموزان با خطا مواجه شد: ${msg}`
          : "افزودن دانش‌آموزان با خطا مواجه شد. لطفاً دوباره تلاش کنید.",
      );
    } finally {
      setImporting(false);
    }
  }


  const validCount = validated?.filter((r) => r.errors.length === 0).length ?? 0;
  const invalidCount = validated?.filter((r) => r.errors.length > 0).length ?? 0;

  // Enforce fixed scope client-side too: never show students from other grades/majors.
  const scopedStudents = useMemo(
    () =>
      (students ?? []).filter((s) => {
        const g = s.grade ?? s.grade_level;
        if (g && g !== FIXED_GRADE) return false;
        if (s.major && s.major !== FIXED_MAJOR) return false;
        return true;
      }),
    [students],
  );

  const classes = useMemo(
    () =>
      Array.from(
        new Set(scopedStudents.map((s) => s.class_name).filter(Boolean)),
      ) as string[],
    [scopedStudents],
  );

  const filteredStudents = useMemo(() => {
    return scopedStudents.filter((s) => {
      if (className !== "all" && s.class_name !== className) return false;
      if (q) {
        const name = `${s.first_name ?? ""} ${s.last_name ?? ""}`.trim();
        if (!name.includes(q)) return false;
      }
      return true;
    });
  }, [scopedStudents, q, className]);

  const totalRows = excel?.rows.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalRows / PREVIEW_PAGE_SIZE));
  const currentPage = Math.min(previewPage, totalPages);
  const pageStart = (currentPage - 1) * PREVIEW_PAGE_SIZE;
  const previewRows = excel?.rows.slice(pageStart, pageStart + PREVIEW_PAGE_SIZE) ?? [];
  const canValidate = !!excel && missingRequired.length === 0;

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
      <section
        dir="rtl"
        className="bg-white rounded-3xl shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)] border border-slate-100 p-5 space-y-4"
      >
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
            onClick={handleValidate}
            disabled={!canValidate}
            className="md:col-span-2 h-11 rounded-2xl bg-teal-600 text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <CheckCircle2 className="h-4 w-4" />
            بررسی فایل
          </button>

          <button
            type="button"
            onClick={handleImport}
            disabled={!validated || validCount === 0 || importing}
            className="md:col-span-2 h-11 rounded-2xl bg-violet-600 text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {importing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            {importing ? "در حال افزودن دانش‌آموزان..." : "افزودن دانش‌آموزان"}
          </button>
        </div>

        {parseError && (
          <div className="rounded-2xl bg-rose-50 text-rose-700 text-xs px-4 py-3 border border-rose-100">
            {parseError}
          </div>
        )}
        {mappingWarning && (
          <div className="rounded-2xl bg-amber-50 text-amber-800 text-xs px-4 py-3 border border-amber-100">
            {mappingWarning}
          </div>
        )}
        {importError && (
          <div className="rounded-2xl bg-rose-50 text-rose-700 text-xs px-4 py-3 border border-rose-100">
            {importError}
          </div>
        )}

        {/* Mapping + preview */}
        {excel && excel.headers.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500">
              برای هر ستون اکسل، فیلد متناظر را از منوی بالای ستون انتخاب کنید.
              ستون‌های غیرضروری را روی «نادیده گرفتن ستون» بگذارید.
            </p>
            <div dir="rtl" className="overflow-auto rounded-2xl border border-slate-100">
              <table dir="rtl" className="min-w-full text-xs text-right">
                <thead className="bg-slate-50">
                  <tr>
                    {excel.headers.map((_, colIdx) => (
                      <th key={colIdx} className="px-3 py-2 align-bottom">
                        <select
                          dir="rtl"
                          value={mapping[colIdx] ?? ""}
                          onChange={(e) =>
                            updateMapping(colIdx, e.target.value as MappingValue)
                          }
                          className="w-full h-9 px-2 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-700 focus:outline-none focus:border-violet-300 text-right"
                        >
                          {MAPPING_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </th>
                    ))}
                  </tr>
                  <tr className="text-slate-600">
                    {excel.headers.map((h, i) => (
                      <th
                        key={i}
                        className="text-right px-3 py-2 font-bold text-[11px] whitespace-nowrap border-t border-slate-100"
                      >
                        {h || `ستون ${(i + 1).toLocaleString("fa-IR")}`}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {previewRows.map((row, ri) => (
                    <tr key={ri}>
                      {excel.headers.map((_, ci) => (
                        <td
                          key={ci}
                          className="px-3 py-2 text-slate-700 whitespace-nowrap text-right"
                        >
                          {row[ci] ?? ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalRows > 0 && (
              <div dir="rtl" className="flex items-center justify-between flex-wrap gap-2">
                <p className="text-[11px] text-slate-400">
                  نمایش {previewRows.length.toLocaleString("fa-IR")} ردیف از{" "}
                  {totalRows.toLocaleString("fa-IR")} ردیف
                </p>
                {totalPages > 1 && (
                  <div dir="rtl" className="inline-flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setPreviewPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="h-8 px-3 rounded-lg bg-slate-50 border border-slate-100 text-[11px] font-semibold text-slate-700 inline-flex items-center gap-1 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                      قبلی
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setPreviewPage(n)}
                        className={`h-8 min-w-8 px-2 rounded-lg text-[11px] font-bold border transition ${
                          n === currentPage
                            ? "bg-violet-600 text-white border-violet-600"
                            : "bg-white text-slate-600 border-slate-100 hover:bg-slate-50"
                        }`}
                      >
                        {n.toLocaleString("fa-IR")}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setPreviewPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="h-8 px-3 rounded-lg bg-slate-50 border border-slate-100 text-[11px] font-semibold text-slate-700 inline-flex items-center gap-1 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      بعدی
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
            {missingRequired.length > 0 && (
              <p className="text-xs text-amber-700">
                فیلدهای الزامی بدون ستون:{" "}
                {missingRequired.map((f) => FIELD_LABEL[f]).join("، ")}
              </p>
            )}
          </div>
        )}

        {/* Validation result */}
        {validated && validated.length > 0 && (
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
                  {validated.map((r, i) => (
                    <tr key={i} className={r.errors.length ? "bg-rose-50/40" : ""}>
                      <Td>{r.data.first_name ?? ""}</Td>
                      <Td>{r.data.last_name ?? ""}</Td>
                      <Td>{r.data.national_code ?? ""}</Td>
                      <Td>{r.data.grade_level ?? ""}</Td>
                      <Td>{r.data.major ?? ""}</Td>
                      <Td>{r.data.class_name ?? ""}</Td>
                      <Td>
                        {r.errors.length === 0 ? (
                          <span className="text-emerald-600 font-semibold">
                            معتبر
                          </span>
                        ) : (
                          <span
                            className="text-rose-600"
                            title={r.errors.join("، ")}
                          >
                            {r.errors.join("، ")}
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

        {importResult && (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4 space-y-3">
            <p className="text-sm font-bold text-emerald-800">
              {importResult.message ?? "افزودن دانش‌آموزان با موفقیت انجام شد."}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <ResultChip
                label="ایجاد شده"
                value={importResult.summary?.created ?? importResult.created ?? 0}
                tone="emerald"
              />
              <ResultChip
                label="به‌روزرسانی شده"
                value={
                  (importResult.summary as { updated?: number } | undefined)?.updated ??
                  (importResult as { updated?: number }).updated ??
                  0
                }
                tone="emerald"
              />
              <ResultChip
                label="نامعتبر"
                value={importResult.summary?.failed ?? importResult.failed ?? 0}
                tone="rose"
              />
              <ResultChip
                label="نادیده گرفته شده"
                value={
                  (importResult.summary as { skipped?: number } | undefined)?.skipped ??
                  (importResult as { skipped?: number }).skipped ??
                  0
                }
                tone="rose"
              />
            </div>
            {credentialsPayload && credentialsPayload.length > 0 && (
              <button
                type="button"
                onClick={() => downloadCredentialsFile(credentialsPayload)}
                className="h-10 px-4 rounded-2xl bg-emerald-600 text-white text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-emerald-700 transition"
              >
                <Download className="h-4 w-4" />
                دانلود فایل اطلاعات ورود دانش‌آموزان
              </button>
            )}
            {Array.isArray(importResult.errors) && importResult.errors.length > 0 && (
              <div className="rounded-xl bg-white border border-rose-100 p-3">
                <p className="text-xs font-bold text-rose-700 mb-2">
                  خطاهای ردیف‌ها
                </p>
                <ul className="space-y-1 text-xs text-rose-700 max-h-48 overflow-auto">
                  {importResult.errors.map((e, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="font-semibold shrink-0">
                        {e.row != null
                          ? `ردیف ${Number(e.row).toLocaleString("fa-IR")}`
                          : "—"}
                        {e.national_code ? ` • کد ملی ${e.national_code}` : ""}
                      </span>
                      <span>{e.message ?? e.error ?? e.reason ?? "خطای نامشخص"}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Filters */}
      <section
        dir="rtl"
        className="bg-white rounded-3xl shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)] border border-slate-100 p-4"
      >
        <div dir="rtl" className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-5 relative">
            <Search className="h-4 w-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              dir="rtl"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="جست‌وجوی نام"
              className="w-full h-11 pr-10 pl-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-violet-200 focus:bg-white transition text-right"
            />
          </div>
          <FilterSelect
            value={className}
            onChange={setClassName}
            label="همه کلاس‌ها"
            options={classes}
            className="md:col-span-3"
          />
          <div
            dir="rtl"
            className="md:col-span-4 flex items-center justify-end gap-2 text-[11px] font-bold"
          >
            <span className="inline-flex items-center h-8 px-3 rounded-full bg-violet-50 text-violet-700 border border-violet-100">
              پایه یازدهم
            </span>
            <span className="inline-flex items-center h-8 px-3 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              رشته تجربی
            </span>
          </div>
        </div>
      </section>

      {/* Student list */}
      <section
        dir="rtl"
        className="bg-white rounded-3xl shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)] border border-slate-100 overflow-hidden"
      >
        {loadingList ? (
          <div className="p-10 text-center text-sm text-slate-400 inline-flex items-center justify-center gap-2 w-full">
            <Loader2 className="h-4 w-4 animate-spin" />
            در حال بارگذاری...
          </div>
        ) : listError ? (
          <div className="p-10 text-center text-sm text-rose-600">{listError}</div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-400">
            هنوز دانش‌آموزی برای پایه یازدهم تجربی ثبت نشده است.
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
                    <Td className="font-semibold text-slate-800">
                      {s.first_name ?? "—"}
                    </Td>
                    <Td className="font-semibold text-slate-800">
                      {s.last_name ?? "—"}
                    </Td>
                    <Td>{s.national_code ?? "—"}</Td>
                    <Td>{s.grade ?? s.grade_level ?? "—"}</Td>
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
