import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import {
  Sparkles,
  FileSpreadsheet,
  FileText,
  ImagePlus,
  X,
  Loader2,
  ArrowRight,
  Search,
  CheckCircle2,
  RotateCcw,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toFa } from "@/components/analytics/analytics-shared";
import {
  analyzeStudentGrades,
  type GradeAnalysisResult,
  type StudentAnalysis,
} from "@/lib/api/grade-analysis.functions";

export const Route = createFileRoute("/grade-supervisor/ai-assistant")({
  component: AiAssistantPage,
});

type Attachment = { name: string; mediaType: string; base64: string };
type ImageAttachment = Attachment & { id: string; dataUrl: string; sizeBytes: number };
type ExcelSummary = { fileName: string; rowCount: number; studentCount: number };
type Step = "intake" | "loading" | "dashboard";

// OpenAI accepts up to 32MB of combined file content per request; stay well
// under that so a rejection surfaces as a clear message instead of a
// confusing "Failed to fetch" from an intermediate proxy's own body-size cap.
const MAX_PDF_BYTES = 20 * 1024 * 1024;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_TOTAL_ATTACHMENT_BYTES = 28 * 1024 * 1024;

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function summarizeCsv(csv: string) {
  const lines = csv
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const names = new Set(lines.map((l) => l.split(",")[0]?.trim()).filter(Boolean));
  return { rowCount: lines.length, studentCount: names.size };
}

function statusTone(s: StudentAnalysis["status"]) {
  if (s === "خوب") return "bg-emerald-50 text-emerald-700";
  if (s === "نیازمند توجه") return "bg-rose-50 text-rose-700";
  return "bg-amber-50 text-amber-700";
}

function trendTone(t: string) {
  if (t === "صعودی") return "text-emerald-600";
  if (t === "نزولی") return "text-rose-600";
  return "text-slate-500";
}

// Plain hex colors on purpose: the printable report is rasterized with
// html2canvas, which can't parse Tailwind v4's oklch()-based utility colors.
function statusHex(s: StudentAnalysis["status"]) {
  if (s === "خوب") return { background: "#d1fae5", color: "#047857" };
  if (s === "نیازمند توجه") return { background: "#ffe4e6", color: "#be123c" };
  return { background: "#fef3c7", color: "#b45309" };
}

function ReportTile({
  label,
  value,
  color = "#292524",
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div style={{ flex: 1, background: "#f8fafc", borderRadius: 12, padding: "12px 14px" }}>
      <div style={{ fontSize: 11, color: "#78716c" }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 800, color, marginTop: 4 }}>{value}</div>
    </div>
  );
}

function AiAssistantPage() {
  const [step, setStep] = useState<Step>("intake");
  const [csvText, setCsvText] = useState("");
  const [excelSummary, setExcelSummary] = useState<ExcelSummary | null>(null);
  const [maxScore, setMaxScore] = useState(20);
  const [attentionThreshold, setAttentionThreshold] = useState(12);
  const [examPdf, setExamPdf] = useState<Attachment | null>(null);
  const [examPdfSizeBytes, setExamPdfSizeBytes] = useState(0);
  const [images, setImages] = useState<ImageAttachment[]>([]);
  const [error, setError] = useState("");
  const [result, setResult] = useState<GradeAnalysisResult | null>(null);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [exportingPdf, setExportingPdf] = useState(false);

  const reportRef = useRef<HTMLDivElement>(null);

  const onExcelFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const sheetName = wb.SheetNames[0];
      if (!sheetName) throw new Error("empty");
      const csv = XLSX.utils.sheet_to_csv(wb.Sheets[sheetName], { blankrows: false }).trim();
      if (!csv) throw new Error("empty");
      setCsvText(csv);
      setExcelSummary({ fileName: file.name, ...summarizeCsv(csv) });
      setError("");
    } catch {
      setError("فایل اکسل قابل خواندن نبود. لطفاً یک فایل xlsx/xls معتبر انتخاب کنید.");
    }
  };

  const clearExcel = () => {
    setCsvText("");
    setExcelSummary(null);
  };

  const onPdfFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > MAX_PDF_BYTES) {
      setError("حجم فایل PDF نباید بیشتر از ۲۰ مگابایت باشد.");
      return;
    }
    const dataUrl = await readFileAsDataUrl(file);
    setExamPdf({ name: file.name, mediaType: "application/pdf", base64: dataUrl.split(",")[1] });
    setExamPdfSizeBytes(file.size);
    setError("");
  };

  const clearPdf = () => {
    setExamPdf(null);
    setExamPdfSizeBytes(0);
  };

  const onImageFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    const room = 5 - images.length;
    const tooBig = files.some((f) => f.size > MAX_IMAGE_BYTES);
    const picked = files.filter((f) => f.size <= MAX_IMAGE_BYTES).slice(0, room);
    const next: ImageAttachment[] = [];
    for (const file of picked) {
      const dataUrl = await readFileAsDataUrl(file);
      next.push({
        id: Math.random().toString(36).slice(2),
        name: file.name,
        mediaType: file.type || "image/jpeg",
        base64: dataUrl.split(",")[1],
        dataUrl,
        sizeBytes: file.size,
      });
    }
    setImages((prev) => [...prev, ...next]);
    setError(tooBig ? "برخی عکس‌ها بیشتر از ۵ مگابایت بودند و اضافه نشدند." : "");
  };

  const runAnalysis = async () => {
    if (!csvText.trim()) return;
    const totalAttachmentBytes =
      examPdfSizeBytes + images.reduce((sum, img) => sum + img.sizeBytes, 0);
    if (totalAttachmentBytes > MAX_TOTAL_ATTACHMENT_BYTES) {
      setError(
        "مجموع حجم پیوست‌ها (PDF + عکس‌ها) بیش از حد مجاز است. تعداد یا حجم فایل‌ها را کم کنید.",
      );
      return;
    }
    setStep("loading");
    setError("");
    try {
      const data = await analyzeStudentGrades({
        data: {
          csvText,
          maxScore,
          attentionThreshold,
          examPdf: examPdf ?? undefined,
          images: images.length
            ? images.map(({ id: _id, dataUrl: _dataUrl, sizeBytes: _sizeBytes, ...a }) => a)
            : undefined,
        },
      });
      setResult(data);
      setSelectedIndex(null);
      setStep("dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "تحلیل با خطا مواجه شد. دوباره تلاش کنید.");
      setStep("intake");
    }
  };

  const downloadReportPdf = async () => {
    if (!reportRef.current) return;
    setExportingPdf(true);
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2, backgroundColor: "#ffffff" });
      const pdf = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgData = canvas.toDataURL("image/jpeg", 0.92);

      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save("گزارش-تحلیل-دانش‌آموزان.pdf");
    } catch {
      setError("خروجی PDF ساخته نشد. دوباره تلاش کنید.");
    } finally {
      setExportingPdf(false);
    }
  };

  const filteredStudents = useMemo(() => {
    const students = result?.students ?? [];
    const q = search.trim();
    return q ? students.filter((s) => s.name.includes(q)) : students;
  }, [result, search]);

  const selectedStudent = selectedIndex != null ? (filteredStudents[selectedIndex] ?? null) : null;

  return (
    <div dir="rtl" className="font-vazir max-w-4xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 grid place-items-center text-white shrink-0">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-extrabold text-slate-800">دستیار تحلیل هوشمند دانش‌آموزان</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            فایل نمرات را بارگذاری کن تا هوش مصنوعی نقاط ضعف/قوت هر دانش‌آموز و یک برنامه مطالعاتی
            پیشنهاد بدهد.
          </p>
        </div>
      </div>

      {step === "intake" && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)] p-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="h-7 w-7 rounded-lg bg-violet-50 text-violet-600 grid place-items-center text-xs font-bold">
                ۱
              </span>
              <h2 className="text-sm font-bold text-slate-800">فایل نمرات دانش‌آموزان</h2>
            </div>
            <p className="text-xs text-slate-500 mr-9 mb-3 leading-6">
              فایل اکسل نمرات را بارگذاری کنید. ستون اول نام دانش‌آموز، ستون دوم درس و ستون‌های بعدی
              نمرات آزمون‌ها هستند.
            </p>

            {excelSummary ? (
              <div className="mr-9 flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-emerald-800 truncate">
                    {excelSummary.fileName}
                  </p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    {toFa(excelSummary.studentCount)} دانش‌آموز · {toFa(excelSummary.rowCount)} ردیف
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl text-xs bg-white"
                  onClick={clearExcel}
                >
                  <RotateCcw className="h-3.5 w-3.5 ml-1" />
                  تغییر فایل
                </Button>
              </div>
            ) : (
              <label className="mr-9 flex flex-col items-center justify-center gap-2 h-32 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 cursor-pointer hover:bg-slate-50 hover:border-violet-200 hover:text-violet-500 transition">
                <FileSpreadsheet className="h-6 w-6" />
                <span className="text-xs font-semibold">آپلود فایل اکسل (xlsx/xls)</span>
                <input type="file" accept=".xlsx,.xls" onChange={onExcelFile} className="hidden" />
              </label>
            )}
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)] p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-7 w-7 rounded-lg bg-indigo-50 text-indigo-600 grid place-items-center text-xs font-bold">
                ۲
              </span>
              <h2 className="text-sm font-bold text-slate-800">
                پیوست‌های تکمیلی <span className="font-normal text-slate-400">(اختیاری)</span>
              </h2>
            </div>

            <div className="mr-9 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <label className="h-9 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600 flex items-center gap-2 cursor-pointer hover:bg-slate-100 transition">
                  <FileText className="h-3.5 w-3.5" />
                  فایل سوال و پاسخ امتحان (PDF)
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={onPdfFile}
                    className="hidden"
                  />
                </label>
                {examPdf && (
                  <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-1.5 text-xs">
                    <span className="text-slate-600">{examPdf.name}</span>
                    <button onClick={clearPdf} className="text-rose-500 font-bold cursor-pointer">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <label className="h-9 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600 flex items-center gap-2 cursor-pointer hover:bg-slate-100 transition">
                  <ImagePlus className="h-3.5 w-3.5" />
                  تصاویر برگه‌های امتحان (حداکثر ۵ عکس)
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onImageFiles}
                    className="hidden"
                  />
                </label>
                {images.map((img) => (
                  <div
                    key={img.id}
                    className="relative w-11 h-11 rounded-lg overflow-hidden border border-slate-200"
                  >
                    <img src={img.dataUrl} alt={img.name} className="w-full h-full object-cover" />
                    <button
                      onClick={() => setImages((prev) => prev.filter((i) => i.id !== img.id))}
                      className="absolute top-0.5 left-0.5 w-[16px] h-[16px] rounded-full bg-black/60 text-white grid place-items-center cursor-pointer"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)] p-6">
            <h2 className="text-sm font-bold text-slate-800 mb-3">تنظیمات تحلیل</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">نمره کامل هر آزمون</Label>
                <Input
                  type="number"
                  dir="ltr"
                  min={1}
                  value={maxScore}
                  onChange={(e) => setMaxScore(Math.max(1, Number(e.target.value) || 1))}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">آستانه نیاز به توجه</Label>
                <Input
                  type="number"
                  dir="ltr"
                  min={0}
                  value={attentionThreshold}
                  onChange={(e) => setAttentionThreshold(Math.max(0, Number(e.target.value) || 0))}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-700 rounded-2xl px-4 py-3 text-sm">{error}</div>
          )}

          <Button
            onClick={runAnalysis}
            disabled={!csvText.trim()}
            className="rounded-2xl bg-violet-600 hover:bg-violet-700 h-12 px-8 text-sm font-bold"
          >
            <Sparkles className="h-4 w-4 ml-1.5" />
            شروع تحلیل هوشمند
          </Button>
        </div>
      )}

      {step === "loading" && (
        <div className="flex flex-col items-center justify-center gap-4 py-24">
          <Loader2 className="h-10 w-10 animate-spin text-violet-500" />
          <p className="text-sm text-slate-600 font-semibold">
            در حال تحلیل دانش‌آموزان توسط هوش مصنوعی... ممکن است تا حدود یک دقیقه طول بکشد
          </p>
        </div>
      )}

      {step === "dashboard" && result && (
        <div className="space-y-5">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl text-xs"
              onClick={() => setStep("intake")}
            >
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
              بازگشت و ویرایش داده
            </Button>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="h-3.5 w-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="جست‌وجوی دانش‌آموز..."
                  className="w-48 pr-9 h-9 text-xs"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl text-xs"
                onClick={downloadReportPdf}
                disabled={exportingPdf}
              >
                {exportingPdf ? (
                  <Loader2 className="h-3.5 w-3.5 ml-1 animate-spin" />
                ) : (
                  <Download className="h-3.5 w-3.5 ml-1" />
                )}
                دانلود گزارش PDF
              </Button>
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-700 rounded-2xl px-4 py-3 text-sm">{error}</div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <p className="text-xs text-slate-500">میانگین کلاس</p>
              <p className="text-2xl font-extrabold text-slate-800 mt-1">
                {toFa(result.classSummary.averageScore)}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <p className="text-xs text-slate-500">نیازمند توجه</p>
              <p className="text-2xl font-extrabold text-rose-600 mt-1">
                {toFa(result.classSummary.studentsNeedingAttention)} نفر
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <p className="text-xs text-slate-500">پرتکرارترین درس مشکل‌دار</p>
              <p className="text-lg font-extrabold text-slate-800 mt-1">
                {result.classSummary.topIssueSubject}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            {filteredStudents.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-sm text-slate-400">
                دانش‌آموزی یافت نشد.
              </div>
            )}
            {filteredStudents.map((student, idx) => (
              <button
                key={`${student.name}-${idx}`}
                onClick={() => setSelectedIndex(idx)}
                className="bg-white rounded-2xl border border-slate-100 px-5 py-3.5 flex items-center gap-4 text-right hover:shadow-md transition shadow-sm cursor-pointer"
              >
                <div className="h-9 w-9 rounded-full bg-slate-100 grid place-items-center text-sm font-bold text-slate-600 shrink-0">
                  {student.name.trim().slice(0, 1)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-slate-800">{student.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {student.weakSubjects.length
                      ? `ضعف در: ${student.weakSubjects.join("، ")}`
                      : "بدون نقطه ضعف بارز"}
                  </p>
                </div>
                <p className="font-bold text-sm text-slate-700">{toFa(student.overallAverage)}</p>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${statusTone(student.status)}`}
                >
                  {student.status}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <Sheet
        open={selectedStudent != null}
        onOpenChange={(open) => !open && setSelectedIndex(null)}
      >
        <SheetContent
          side="left"
          className="w-full sm:max-w-md overflow-y-auto font-vazir"
          dir="rtl"
        >
          {selectedStudent && (
            <>
              <SheetHeader className="text-right">
                <SheetTitle>{selectedStudent.name}</SheetTitle>
              </SheetHeader>
              <div className="flex items-center gap-2 mt-2 mb-5">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${statusTone(selectedStudent.status)}`}
                >
                  {selectedStudent.status}
                </span>
                <span className="text-xs text-slate-500">
                  میانگین کل: {toFa(selectedStudent.overallAverage)}
                </span>
              </div>

              <div className="text-xs text-slate-600 bg-indigo-50/60 rounded-xl px-4 py-3 mb-5 leading-6">
                {selectedStudent.classComparison}
              </div>

              <h3 className="text-sm font-bold text-slate-800 mb-2.5">روند نمرات به تفکیک درس</h3>
              <div className="flex flex-col gap-3 mb-6">
                {selectedStudent.subjects.map((subj, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl p-3.5">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-bold text-xs text-slate-800">{subj.subject}</p>
                      <p className={`text-[11px] font-semibold ${trendTone(subj.trend)}`}>
                        {subj.trend}
                      </p>
                    </div>
                    <div className="flex items-end gap-1 h-11">
                      {subj.scores.map((v, si) => (
                        <div
                          key={si}
                          title={String(v)}
                          className={`w-4 rounded-t ${v < attentionThreshold ? "bg-rose-300" : "bg-indigo-300"}`}
                          style={{ height: `${Math.max(4, Math.round((v / maxScore) * 40))}px` }}
                        />
                      ))}
                      <span className="text-[11px] text-slate-400 mr-1.5">
                        {subj.scores.join(" ← ")}
                      </span>
                    </div>
                    {subj.issue && <p className="text-[11px] text-rose-600 mt-2">{subj.issue}</p>}
                  </div>
                ))}
              </div>

              <h3 className="text-sm font-bold text-slate-800 mb-2.5">راهکارهای پیشنهادی</h3>
              <div className="flex flex-col gap-2.5">
                <div className="bg-slate-50 rounded-xl p-3.5">
                  <p className="text-[11px] font-bold text-amber-600 mb-1">توصیه کلی</p>
                  <p className="text-xs leading-6">{selectedStudent.recGeneral}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3.5">
                  <p className="text-[11px] font-bold text-indigo-600 mb-1">برنامه مطالعاتی</p>
                  <p className="text-xs leading-6 whitespace-pre-wrap">
                    {selectedStudent.recStudyPlan}
                  </p>
                </div>
                {selectedStudent.recReferral && (
                  <div className="bg-slate-50 rounded-xl p-3.5">
                    <p className="text-[11px] font-bold text-rose-600 mb-1">
                      پیشنهاد ارجاع به دبیر
                    </p>
                    <p className="text-xs leading-6">{selectedStudent.recReferral}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {result && (
        <div
          ref={reportRef}
          style={{
            position: "fixed",
            top: 0,
            left: "-10000px",
            width: "780px",
            background: "#ffffff",
            padding: "40px",
            direction: "rtl",
            fontFamily: "Vazirmatn, sans-serif",
            color: "#292524",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 24,
              borderBottom: "2px solid #ede9fe",
              paddingBottom: 16,
            }}
          >
            <div>
              <div style={{ fontSize: 20, fontWeight: 800 }}>گزارش تحلیل هوشمند دانش‌آموزان</div>
              <div style={{ fontSize: 12, color: "#78716c", marginTop: 4 }}>
                تاریخ تولید: {new Date().toLocaleDateString("fa-IR")}
              </div>
            </div>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: "linear-gradient(135deg,#8b5cf6,#6366f1)",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
            <ReportTile label="میانگین کلاس" value={toFa(result.classSummary.averageScore)} />
            <ReportTile
              label="نیازمند توجه"
              value={`${toFa(result.classSummary.studentsNeedingAttention)} نفر`}
              color="#e11d48"
            />
            <ReportTile
              label="پرتکرارترین درس مشکل‌دار"
              value={result.classSummary.topIssueSubject}
            />
          </div>

          {result.students.map((student, i) => (
            <div
              key={i}
              style={{
                marginBottom: 22,
                paddingBottom: 22,
                borderBottom: i < result.students.length - 1 ? "1px solid #e7e5e4" : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ fontSize: 15, fontWeight: 800 }}>{student.name}</div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: 999,
                    ...statusHex(student.status),
                  }}
                >
                  {student.status}
                </span>
                <span style={{ fontSize: 12, color: "#57534e" }}>
                  میانگین: {toFa(student.overallAverage)}
                </span>
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#44403c",
                  background: "#f5f3ff",
                  borderRadius: 10,
                  padding: "8px 12px",
                  marginBottom: 10,
                  lineHeight: 1.8,
                }}
              >
                {student.classComparison}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                {student.subjects.map((subj, si) => (
                  <div
                    key={si}
                    style={{
                      fontSize: 11.5,
                      background: "#f5f5f4",
                      borderRadius: 8,
                      padding: "6px 10px",
                    }}
                  >
                    <b>{subj.subject}</b>: {subj.scores.join(" ← ")} ({subj.trend})
                    {subj.issue ? ` — ${subj.issue}` : ""}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11.5, lineHeight: 1.9 }}>
                <div>
                  <b style={{ color: "#b45309" }}>توصیه کلی: </b>
                  {student.recGeneral}
                </div>
                <div style={{ marginTop: 4 }}>
                  <b style={{ color: "#4338ca" }}>برنامه مطالعاتی: </b>
                  <span style={{ whiteSpace: "pre-wrap" }}>{student.recStudyPlan}</span>
                </div>
                {student.recReferral && (
                  <div style={{ marginTop: 4 }}>
                    <b style={{ color: "#be123c" }}>ارجاع به دبیر: </b>
                    {student.recReferral}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
