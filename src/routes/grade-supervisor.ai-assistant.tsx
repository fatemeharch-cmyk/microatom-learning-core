import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Sparkles,
  Upload,
  FileText,
  ImagePlus,
  X,
  Loader2,
  ArrowRight,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
type ImageAttachment = Attachment & { id: string; dataUrl: string };
type Step = "intake" | "loading" | "dashboard";

const SAMPLE_CSV = [
  "علی رضایی,ریاضی,14,16,18",
  "علی رضایی,فیزیک,12,10,9",
  "علی رضایی,شیمی,15,15,14",
  "سارا احمدی,ریاضی,18,19,19",
  "سارا احمدی,فیزیک,17,18,18",
  "سارا احمدی,شیمی,16,17,18",
  "محمد کریمی,ریاضی,9,8,7",
  "محمد کریمی,فیزیک,10,9,8",
  "محمد کریمی,شیمی,11,10,9",
].join("\n");

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
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

function AiAssistantPage() {
  const [step, setStep] = useState<Step>("intake");
  const [csvText, setCsvText] = useState("");
  const [maxScore, setMaxScore] = useState(20);
  const [attentionThreshold, setAttentionThreshold] = useState(12);
  const [examPdf, setExamPdf] = useState<Attachment | null>(null);
  const [images, setImages] = useState<ImageAttachment[]>([]);
  const [error, setError] = useState("");
  const [result, setResult] = useState<GradeAnalysisResult | null>(null);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const onCsvFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setCsvText(await file.text());
  };

  const onPdfFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    setExamPdf({ name: file.name, mediaType: "application/pdf", base64: dataUrl.split(",")[1] });
  };

  const onImageFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    const room = 5 - images.length;
    const picked = files.slice(0, room);
    const next: ImageAttachment[] = [];
    for (const file of picked) {
      const dataUrl = await readFileAsDataUrl(file);
      next.push({
        id: Math.random().toString(36).slice(2),
        name: file.name,
        mediaType: file.type || "image/jpeg",
        base64: dataUrl.split(",")[1],
        dataUrl,
      });
    }
    setImages((prev) => [...prev, ...next]);
  };

  const runAnalysis = async () => {
    if (!csvText.trim()) return;
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
            ? images.map(({ id: _id, dataUrl: _dataUrl, ...a }) => a)
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
            نمرات را وارد کن تا هوش مصنوعی نقاط ضعف/قوت هر دانش‌آموز و یک برنامه مطالعاتی پیشنهاد
            بدهد.
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
              <h2 className="text-sm font-bold text-slate-800">نمرات دانش‌آموزان</h2>
            </div>
            <p className="text-xs text-slate-500 mr-9 mb-3 leading-6">
              جدول نمرات را از اکسل کپی و اینجا پیست کنید، یا فایل CSV/متنی بارگذاری کنید. فرمت هر
              سطر: <b>نام، درس، نمره۱، نمره۲، ...</b>
            </p>
            <Textarea
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder={"مثال:\nعلی رضایی,ریاضی,14,16,18\nعلی رضایی,فیزیک,12,10,9"}
              className="mr-9 w-[calc(100%-2.25rem)] min-h-[150px] font-mono text-xs"
              dir="ltr"
            />
            <div className="flex flex-wrap gap-2 mr-9 mt-3">
              <label className="h-9 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600 flex items-center gap-2 cursor-pointer hover:bg-slate-100 transition">
                <Upload className="h-3.5 w-3.5" />
                آپلود فایل CSV/متنی
                <input type="file" accept=".csv,.txt" onChange={onCsvFile} className="hidden" />
              </label>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl text-xs"
                onClick={() => setCsvText(SAMPLE_CSV)}
              >
                پر کردن با نمونه
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)] p-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="h-7 w-7 rounded-lg bg-indigo-50 text-indigo-600 grid place-items-center text-xs font-bold">
                ۲
              </span>
              <h2 className="text-sm font-bold text-slate-800">
                فایل سوال و پاسخ امتحان{" "}
                <span className="font-normal text-slate-400">(اختیاری، PDF)</span>
              </h2>
            </div>
            <div className="mr-9 mt-2 flex items-center gap-2 flex-wrap">
              <label className="h-9 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600 flex items-center gap-2 cursor-pointer hover:bg-slate-100 transition">
                <FileText className="h-3.5 w-3.5" />
                انتخاب فایل PDF
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
                  <button
                    onClick={() => setExamPdf(null)}
                    className="text-rose-500 font-bold cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)] p-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-600 grid place-items-center text-xs font-bold">
                ۳
              </span>
              <h2 className="text-sm font-bold text-slate-800">
                تصاویر برگه‌های امتحان{" "}
                <span className="font-normal text-slate-400">(اختیاری، حداکثر ۵ عکس)</span>
              </h2>
            </div>
            <div className="mr-9 mt-2 flex items-center gap-2 flex-wrap">
              <label className="h-9 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600 flex items-center gap-2 cursor-pointer hover:bg-slate-100 transition">
                <ImagePlus className="h-3.5 w-3.5" />
                انتخاب عکس‌ها
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
                  className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-200"
                >
                  <img src={img.dataUrl} alt={img.name} className="w-full h-full object-cover" />
                  <button
                    onClick={() => setImages((prev) => prev.filter((i) => i.id !== img.id))}
                    className="absolute top-0.5 left-0.5 w-[18px] h-[18px] rounded-full bg-black/60 text-white grid place-items-center cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
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
            <div className="relative">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جست‌وجوی دانش‌آموز..."
                className="w-56 pr-9 h-9 text-xs"
              />
            </div>
          </div>

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
    </div>
  );
}
