import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ClipboardList,
  Search,
  Save,
  Pencil,
  RotateCcw,
  Users,
  AlertCircle,
  UserRound,
  CalendarClock,
  Star,
} from "lucide-react";
import { STUDENTS } from "@/lib/mock/grade-students";
import { SUPERVISOR_BASE_URL } from "@/lib/api/config";
import { getAuthToken } from "@/lib/api/client";

// ---------- Types ----------
type ReportType =
  | "student"
  | "followup"
  | "meeting"
  | "parent"
  | "checkup"
  | "dose";

type Report = {
  id?: string | number;
  student_id: string;
  student_name: string;
  report_type: ReportType;
  date: string; // ISO
  topics: string[];
  mood: number;
  notes: string;
  follow_up: boolean;
  parent_who?: string;
  parent_channel?: string;
};

// ---------- Constants ----------
const REPORT_TYPES: { key: ReportType; label: string }[] = [
  { key: "student", label: "گزارش دانش‌آموز" },
  { key: "followup", label: "پیگیری" },
  { key: "meeting", label: "یادداشت جلسه" },
  { key: "parent", label: "تماس با اولیا" },
  { key: "checkup", label: "معاینه/چکاپ" },
  { key: "dose", label: "نسخه مطالعه" },
];

const TYPE_BADGE: Record<ReportType, string> = {
  student: "bg-emerald-50 text-emerald-700 border-emerald-100",
  followup: "bg-amber-50 text-amber-700 border-amber-100",
  meeting: "bg-sky-50 text-sky-700 border-sky-100",
  parent: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100",
  checkup: "bg-teal-50 text-teal-700 border-teal-100",
  dose: "bg-indigo-50 text-indigo-700 border-indigo-100",
};

const MOODS: { value: number; label: string; dot: string }[] = [
  { value: 5, label: "عالی", dot: "#16a34a" },
  { value: 4, label: "خوب", dot: "#16a34a" },
  { value: 3, label: "متوسط", dot: "#f59e0b" },
  { value: 2, label: "نگران", dot: "#f59e0b" },
  { value: 1, label: "نیازمند توجه جدی", dot: "#dc2626" },
];

const TOPICS = [
  "افت درسی",
  "برنامه‌ریزی مطالعه",
  "اضطراب امتحان",
  "انگیزه و هدف",
  "کنکور و انتخاب رشته",
  "خانوادگی",
  "ارتباط با همسالان",
  "حضور و غیاب",
  "سلامت و خواب",
  "استفاده از موبایل",
];

const SESSION_TYPES = [
  "مشاوره فردی",
  "مشاوره با اولیا",
  "مشاوره دانش‌آموز و اولیا",
];

const OVERALL_RANKS = ["C", "+C", "B", "+B", "A", "+A", "D"];

const ACTIONS_TAKEN = [
  "تماس با اولیا",
  "برنامه مطالعاتی داده شد",
  "ارجاع به مشاور مدرسه",
  "پیگیری هفته آینده",
  "هماهنگی با دبیر",
  "تشویق و دلگرمی",
  "تذکر",
];

const RATING_ROWS: { key: string; label: string }[] = [
  { key: "motivation", label: "روحیه و انگیزه" },
  { key: "focus", label: "تمرکز" },
  { key: "timeManagement", label: "مدیریت زمان" },
  { key: "sleep", label: "خواب و انرژی" },
  { key: "familyCooperation", label: "همکاری خانواده" },
];

const PARENT_WHO = ["پدر", "مادر", "سرپرست"];
const PARENT_CHANNELS = ["تماس تلفنی", "پیامک", "حضوری", "پیام‌رسان"];

const JALALI_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

// ---------- Jalali <-> Gregorian ----------
function jalaliToGregorian(jy: number, jm: number, jd: number): [number, number, number] {
  let gy: number, gm: number, gd: number, days: number;
  jy += 1595;
  days =
    -355668 +
    365 * jy +
    Math.floor(jy / 33) * 8 +
    Math.floor(((jy % 33) + 3) / 4) +
    jd +
    (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);
  gy = 400 * Math.floor(days / 146097);
  days %= 146097;
  if (days > 36524) {
    gy += 100 * Math.floor(--days / 36524);
    days %= 36524;
    if (days >= 365) days++;
  }
  gy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    gy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  gd = days + 1;
  const sal_a = [
    0,
    31,
    (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0 ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  for (gm = 0; gm < 13 && gd > sal_a[gm]; gm++) gd -= sal_a[gm];
  return [gy, gm, gd];
}

function gregorianToJalali(gy: number, gm: number, gd: number): [number, number, number] {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    355666 +
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) +
    gd +
    g_d_m[gm - 1];
  let jy = -1595 + 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  const jm = days < 186 ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  return [jy, jm, jd];
}

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
function toFa(n: number | string): string {
  return String(n).replace(/\d/g, (d) => FA_DIGITS[+d]);
}
function formatJalali(iso: string): string {
  try {
    const d = new Date(iso);
    const [jy, jm, jd] = gregorianToJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());
    return `${toFa(jd)} ${JALALI_MONTHS[jm - 1]} ${toFa(jy)}`;
  } catch {
    return iso;
  }
}

// ---------- API ----------
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
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}

// ---------- UI helpers ----------
function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[16px] border bg-white p-5 ${className}`}
      style={{ borderColor: "#E4ECE9" }}
    >
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm transition ${
        active
          ? "text-white"
          : "bg-white text-slate-700 hover:bg-slate-50"
      }`}
      style={
        active
          ? { background: "#1F8A6D", borderColor: "#1F8A6D" }
          : { borderColor: "#E4ECE9" }
      }
    >
      {children}
    </button>
  );
}

// ---------- Component ----------
function NotebookPage() {
  const now = new Date();
  const [jy0, jm0, jd0] = gregorianToJalali(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate(),
  );

  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [reportType, setReportType] = useState<ReportType>("student");
  const [jYear, setJYear] = useState(jy0);
  const [jMonth, setJMonth] = useState(jm0);
  const [jDay, setJDay] = useState(jd0);
  const [mood, setMood] = useState(4);
  const [topics, setTopics] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [followUp, setFollowUp] = useState(false);
  const [parentWho, setParentWho] = useState("مادر");
  const [parentChannel, setParentChannel] = useState("تماس تلفنی");
  const [editingId, setEditingId] = useState<string | number | null>(null);

  const [studentReports, setStudentReports] = useState<Report[]>([]);
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [followUps, setFollowUps] = useState<Report[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [scope, setScope] = useState<"selected" | "all">("selected");
  const [filterType, setFilterType] = useState<ReportType | "all">("all");

  const selectedStudent = useMemo(
    () => STUDENTS.find((s) => s.id === selectedStudentId) ?? null,
    [selectedStudentId],
  );

  const filteredStudents = useMemo(() => {
    const q = search.trim();
    if (!q) return STUDENTS;
    return STUDENTS.filter(
      (s) => s.name.includes(q) || s.className.includes(q),
    );
  }, [search]);

  // Load all + follow-ups on mount
  useEffect(() => {
    xanoFetch<Report[]>("/supervisor/reports/all")
      .then((d) => setAllReports(Array.isArray(d) ? d : []))
      .catch(() => setAllReports([]));
    xanoFetch<Report[]>("/supervisor/reports/follow-ups")
      .then((d) => setFollowUps(Array.isArray(d) ? d : []))
      .catch(() => setFollowUps([]));
  }, []);

  // Load student history when selected
  useEffect(() => {
    if (!selectedStudentId) {
      setStudentReports([]);
      return;
    }
    xanoFetch<Report[]>(`/supervisor/reports/student/${selectedStudentId}`)
      .then((d) => setStudentReports(Array.isArray(d) ? d : []))
      .catch(() => setStudentReports([]));
  }, [selectedStudentId]);

  function resetForm() {
    setEditingId(null);
    setReportType("student");
    setJYear(jy0);
    setJMonth(jm0);
    setJDay(jd0);
    setMood(4);
    setTopics([]);
    setNotes("");
    setFollowUp(false);
    setParentWho("مادر");
    setParentChannel("تماس تلفنی");
  }

  function toggleTopic(t: string) {
    setTopics((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  }

  function beginEdit(r: Report) {
    setEditingId(r.id ?? null);
    setReportType(r.report_type);
    setMood(r.mood ?? 3);
    setTopics(Array.isArray(r.topics) ? r.topics : []);
    setNotes(r.notes ?? "");
    setFollowUp(!!r.follow_up);
    setParentWho(r.parent_who ?? "مادر");
    setParentChannel(r.parent_channel ?? "تماس تلفنی");
    if (r.student_id) setSelectedStudentId(r.student_id);
    try {
      const d = new Date(r.date);
      const [y, m, day] = gregorianToJalali(
        d.getFullYear(),
        d.getMonth() + 1,
        d.getDate(),
      );
      setJYear(y);
      setJMonth(m);
      setJDay(day);
    } catch {
      /* ignore */
    }
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit() {
    if (!selectedStudent) {
      setMessage("ابتدا یک دانش‌آموز را انتخاب کنید.");
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const [gy, gm, gd] = jalaliToGregorian(jYear, jMonth, jDay);
      const iso = new Date(Date.UTC(gy, gm - 1, gd, 9, 0, 0)).toISOString();
      const payload: Report = {
        ...(editingId != null ? { id: editingId } : {}),
        student_id: selectedStudent.id,
        student_name: selectedStudent.name,
        report_type: reportType,
        date: iso,
        topics,
        mood,
        notes,
        follow_up: followUp,
        ...(reportType === "parent"
          ? { parent_who: parentWho, parent_channel: parentChannel }
          : {}),
      };
      const saved = await xanoFetch<Report>("/supervisor/reports/create", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setMessage("گزارش با موفقیت ثبت شد.");
      // Refresh lists
      const [all, fu, mine] = await Promise.all([
        xanoFetch<Report[]>("/supervisor/reports/all").catch(() => allReports),
        xanoFetch<Report[]>("/supervisor/reports/follow-ups").catch(() => followUps),
        xanoFetch<Report[]>(
          `/supervisor/reports/student/${selectedStudent.id}`,
        ).catch(() => studentReports),
      ]);
      setAllReports(Array.isArray(all) ? all : []);
      setFollowUps(Array.isArray(fu) ? fu : []);
      setStudentReports(Array.isArray(mine) ? mine : []);
      resetForm();
      void saved;
    } catch (e) {
      setMessage("ثبت گزارش ناموفق بود. لطفاً دوباره تلاش کنید.");
    } finally {
      setSaving(false);
    }
  }

  // KPIs
  const totalReports = allReports.length;
  const followCount = followUps.length;
  const studentReportCount = studentReports.length;

  // Notes label
  const notesLabel =
    reportType === "dose"
      ? "مشاهدات نسخه مطالعه"
      : reportType === "checkup"
        ? "یادداشت معاینه"
        : "یادداشت";

  // Filter list
  const visibleReports = useMemo(() => {
    const source = scope === "selected" ? studentReports : allReports;
    return source.filter((r) =>
      filterType === "all" ? true : r.report_type === filterType,
    );
  }, [scope, filterType, studentReports, allReports]);

  const yearOptions = Array.from({ length: 5 }, (_, i) => jy0 - 2 + i);
  const daysInMonth = jMonth <= 6 ? 31 : jMonth <= 11 ? 30 : 29;
  const dayOptions = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div
      dir="rtl"
      className="min-h-screen p-6 md:p-8"
      style={{ background: "#F4F7F6", fontFamily: "Vazirmatn, sans-serif" }}
    >
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div
          className="grid h-11 w-11 place-items-center rounded-xl text-white"
          style={{ background: "#1F8A6D" }}
        >
          <ClipboardList className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#123B32" }}>
            دفتر مسئول پایه
          </h1>
          <p className="text-sm text-slate-500">
            ثبت گزارش‌ها، پیگیری‌ها، جلسات و مشاهدات مسئول پایه یازدهم تجربی
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card className="flex items-center gap-3">
          <ClipboardList className="h-6 w-6" style={{ color: "#1F8A6D" }} />
          <div>
            <div className="text-xs text-slate-500">مجموع گزارش‌ها</div>
            <div className="text-lg font-bold" style={{ color: "#123B32" }}>
              {toFa(totalReports)}
            </div>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-amber-600" />
          <div>
            <div className="text-xs text-slate-500">نیازمند پیگیری</div>
            <div className="text-lg font-bold" style={{ color: "#123B32" }}>
              {toFa(followCount)}
            </div>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <UserRound className="h-6 w-6" style={{ color: "#1F8A6D" }} />
          <div>
            <div className="text-xs text-slate-500">دانش‌آموز فعال</div>
            <div className="truncate text-lg font-bold" style={{ color: "#123B32" }}>
              {selectedStudent?.name ?? "—"}
            </div>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <CalendarClock className="h-6 w-6" style={{ color: "#1F8A6D" }} />
          <div>
            <div className="text-xs text-slate-500">گزارش این دانش‌آموز</div>
            <div className="text-lg font-bold" style={{ color: "#123B32" }}>
              {toFa(studentReportCount)}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Right column (narrow) */}
        <div className="space-y-6 lg:col-span-4">
          {/* Student picker */}
          <Card>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" style={{ color: "#1F8A6D" }} />
                <h3 className="font-semibold" style={{ color: "#123B32" }}>
                  انتخاب دانش‌آموز
                </h3>
              </div>
              <span className="text-xs text-slate-500">
                {toFa(filteredStudents.length)} نفر
              </span>
            </div>
            <div className="relative mb-3">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجوی نام یا کلاس..."
                className="w-full rounded-xl border bg-white py-2 pr-9 pl-3 text-sm outline-none focus:ring-2"
                style={{ borderColor: "#E4ECE9" }}
              />
            </div>
            <div className="max-h-[380px] space-y-1.5 overflow-auto pr-1">
              {filteredStudents.map((s) => {
                const active = s.id === selectedStudentId;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStudentId(s.id)}
                    className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-right transition ${
                      active ? "bg-emerald-50" : "bg-white hover:bg-slate-50"
                    }`}
                    style={{
                      borderColor: active ? "#1F8A6D" : "#E4ECE9",
                    }}
                  >
                    <div>
                      <div className="text-sm font-semibold" style={{ color: "#123B32" }}>
                        {s.name}
                      </div>
                      <div className="text-xs text-slate-500">{s.className}</div>
                    </div>
                    <div className="text-xs text-slate-400">
                      {toFa(s.healthScore)}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Follow-ups */}
          <Card>
            <div className="mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <h3 className="font-semibold" style={{ color: "#123B32" }}>
                گزارش‌های نیازمند پیگیری
              </h3>
            </div>
            {followUps.length === 0 ? (
              <div className="rounded-lg bg-slate-50 p-3 text-center text-sm text-slate-500">
                موردی برای پیگیری ثبت نشده است.
              </div>
            ) : (
              <div className="space-y-2">
                {followUps.slice(0, 8).map((r, i) => (
                  <button
                    key={String(r.id ?? i)}
                    onClick={() => r.student_id && setSelectedStudentId(r.student_id)}
                    className="w-full rounded-xl border bg-white p-3 text-right hover:bg-slate-50"
                    style={{ borderColor: "#E4ECE9" }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold" style={{ color: "#123B32" }}>
                        {r.student_name || "—"}
                      </span>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[11px] ${TYPE_BADGE[r.report_type]}`}
                      >
                        {REPORT_TYPES.find((t) => t.key === r.report_type)?.label ?? r.report_type}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {formatJalali(r.date)}
                    </div>
                    {r.notes && (
                      <div className="mt-1 truncate text-xs text-slate-600">
                        {r.notes}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Left column (wide) */}
        <div className="space-y-6 lg:col-span-8">
          {/* Form */}
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold" style={{ color: "#123B32" }}>
                فرم ثبت گزارش
              </h3>
              {editingId != null && (
                <button
                  onClick={resetForm}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> شروع فرم جدید
                </button>
              )}
            </div>

            {/* Report type chips */}
            <div className="mb-4">
              <div className="mb-2 text-xs text-slate-500">نوع گزارش</div>
              <div className="flex flex-wrap gap-2">
                {REPORT_TYPES.map((t) => (
                  <Chip
                    key={t.key}
                    active={reportType === t.key}
                    onClick={() => setReportType(t.key)}
                  >
                    {t.label}
                  </Chip>
                ))}
              </div>
            </div>

            {/* Jalali date */}
            <div className="mb-4">
              <div className="mb-2 text-xs text-slate-500">تاریخ</div>
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={jDay}
                  onChange={(e) => setJDay(Number(e.target.value))}
                  className="rounded-xl border bg-white px-3 py-2 text-sm"
                  style={{ borderColor: "#E4ECE9" }}
                >
                  {dayOptions.map((d) => (
                    <option key={d} value={d}>
                      {toFa(d)}
                    </option>
                  ))}
                </select>
                <select
                  value={jMonth}
                  onChange={(e) => setJMonth(Number(e.target.value))}
                  className="rounded-xl border bg-white px-3 py-2 text-sm"
                  style={{ borderColor: "#E4ECE9" }}
                >
                  {JALALI_MONTHS.map((m, i) => (
                    <option key={m} value={i + 1}>
                      {m}
                    </option>
                  ))}
                </select>
                <select
                  value={jYear}
                  onChange={(e) => setJYear(Number(e.target.value))}
                  className="rounded-xl border bg-white px-3 py-2 text-sm"
                  style={{ borderColor: "#E4ECE9" }}
                >
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>
                      {toFa(y)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mood */}
            <div className="mb-4">
              <div className="mb-2 text-xs text-slate-500">وضعیت روحی/تحصیلی</div>
              <div className="flex flex-wrap gap-2">
                {MOODS.map((m) => (
                  <Chip
                    key={m.value}
                    active={mood === m.value}
                    onClick={() => setMood(m.value)}
                  >
                    {m.label}
                  </Chip>
                ))}
              </div>
            </div>

            {/* Topics */}
            <div className="mb-4">
              <div className="mb-2 text-xs text-slate-500">موضوع‌ها</div>
              <div className="flex flex-wrap gap-2">
                {TOPICS.map((t) => (
                  <Chip
                    key={t}
                    active={topics.includes(t)}
                    onClick={() => toggleTopic(t)}
                  >
                    {t}
                  </Chip>
                ))}
              </div>
            </div>

            {/* Parent fields */}
            {reportType === "parent" && (
              <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <div className="mb-2 text-xs text-slate-500">طرف تماس</div>
                  <div className="flex flex-wrap gap-2">
                    {PARENT_WHO.map((p) => (
                      <Chip
                        key={p}
                        active={parentWho === p}
                        onClick={() => setParentWho(p)}
                      >
                        {p}
                      </Chip>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mb-2 text-xs text-slate-500">کانال تماس</div>
                  <div className="flex flex-wrap gap-2">
                    {PARENT_CHANNELS.map((c) => (
                      <Chip
                        key={c}
                        active={parentChannel === c}
                        onClick={() => setParentChannel(c)}
                      >
                        {c}
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="mb-4">
              <div className="mb-2 text-xs text-slate-500">{notesLabel}</div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="جزئیات مشاهدات و اقدامات را اینجا بنویسید..."
                className="w-full rounded-xl border bg-white p-3 text-sm outline-none"
                style={{ borderColor: "#E4ECE9" }}
              />
            </div>

            {/* Follow-up */}
            <label className="mb-4 flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={followUp}
                onChange={(e) => setFollowUp(e.target.checked)}
                className="h-4 w-4 accent-emerald-600"
              />
              نیاز به پیگیری دارد
            </label>

            {message && (
              <div className="mb-3 rounded-lg bg-emerald-50 p-2 text-sm text-emerald-700">
                {message}
              </div>
            )}

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={resetForm}
                className="rounded-xl border bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                style={{ borderColor: "#E4ECE9" }}
              >
                پاک کردن
              </button>
              <button
                onClick={submit}
                disabled={saving}
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                style={{ background: "#1F8A6D" }}
              >
                <Save className="h-4 w-4" />
                {editingId != null ? "به‌روزرسانی گزارش" : "ثبت گزارش"}
              </button>
            </div>
          </Card>

          {/* Filters */}
          <Card>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">دامنه:</span>
                <Chip
                  active={scope === "selected"}
                  onClick={() => setScope("selected")}
                >
                  دانش‌آموز انتخاب‌شده
                </Chip>
                <Chip active={scope === "all"} onClick={() => setScope("all")}>
                  همه دانش‌آموزان
                </Chip>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-500">نوع:</span>
                <Chip
                  active={filterType === "all"}
                  onClick={() => setFilterType("all")}
                >
                  همه
                </Chip>
                {REPORT_TYPES.map((t) => (
                  <Chip
                    key={t.key}
                    active={filterType === t.key}
                    onClick={() => setFilterType(t.key)}
                  >
                    {t.label}
                  </Chip>
                ))}
              </div>
            </div>
          </Card>

          {/* History */}
          <Card>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold" style={{ color: "#123B32" }}>
                {scope === "selected"
                  ? `تاریخچه گزارش‌های ${selectedStudent?.name ?? "دانش‌آموز"}`
                  : "همه گزارش‌ها"}
              </h3>
              <span className="text-xs text-slate-500">
                {toFa(visibleReports.length)} مورد
              </span>
            </div>

            {scope === "selected" && !selectedStudent ? (
              <div className="rounded-lg bg-slate-50 p-4 text-center text-sm text-slate-500">
                برای دیدن تاریخچه، یک دانش‌آموز را انتخاب کنید.
              </div>
            ) : visibleReports.length === 0 ? (
              <div className="rounded-lg bg-slate-50 p-4 text-center text-sm text-slate-500">
                گزارشی برای نمایش وجود ندارد.
              </div>
            ) : (
              <div className="space-y-2">
                {visibleReports.map((r, i) => (
                  <div
                    key={String(r.id ?? i)}
                    className="rounded-xl border bg-white p-3"
                    style={{ borderColor: "#E4ECE9" }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full border px-2 py-0.5 text-[11px] ${TYPE_BADGE[r.report_type]}`}
                          >
                            {REPORT_TYPES.find((t) => t.key === r.report_type)?.label ?? r.report_type}
                          </span>
                          <span className="text-xs text-slate-500">
                            {formatJalali(r.date)}
                          </span>
                          {scope === "all" && (
                            <span className="text-xs font-medium" style={{ color: "#123B32" }}>
                              — {r.student_name}
                            </span>
                          )}
                          {r.follow_up && (
                            <span className="rounded-full border border-amber-100 bg-amber-50 px-2 py-0.5 text-[11px] text-amber-700">
                              نیازمند پیگیری
                            </span>
                          )}
                        </div>
                        {Array.isArray(r.topics) && r.topics.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {r.topics.map((t) => (
                              <span
                                key={t}
                                className="rounded-full border bg-slate-50 px-2 py-0.5 text-[11px] text-slate-600"
                                style={{ borderColor: "#E4ECE9" }}
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                        {r.notes && (
                          <div className="mt-2 text-sm text-slate-700">{r.notes}</div>
                        )}
                      </div>
                      <button
                        onClick={() => beginEdit(r)}
                        className="flex items-center gap-1 rounded-lg border bg-white px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
                        style={{ borderColor: "#E4ECE9" }}
                      >
                        <Pencil className="h-3.5 w-3.5" /> ویرایش
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/grade-supervisor/notebook")({
  component: NotebookPage,
});
