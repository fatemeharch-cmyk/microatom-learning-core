/**
 * AI grade-analysis assistant — server-side only.
 *
 * Takes grades pasted/uploaded by a grade supervisor (plus an optional exam
 * PDF and photos of answer sheets) and asks an OpenAI model to produce a
 * structured, per-student analysis: weak/strong subjects, trend, class
 * comparison, and a concrete study plan. The OpenAI API key never reaches
 * the browser — the call happens inside this `createServerFn` handler.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const attachmentSchema = z.object({
  name: z.string().optional(),
  mediaType: z.string().min(1),
  base64: z.string().min(1),
});

const inputSchema = z.object({
  csvText: z.string().min(1, "داده نمرات نمی‌تواند خالی باشد."),
  maxScore: z.number().min(1).max(1000).default(20),
  attentionThreshold: z.number().min(0).max(1000).default(12),
  examPdf: attachmentSchema.optional(),
  images: z.array(attachmentSchema).max(5).optional(),
});

export type SubjectAnalysis = {
  subject: string;
  scores: number[];
  trend: "صعودی" | "نزولی" | "ثابت";
  issue: string | null;
};

export type StudentAnalysis = {
  name: string;
  status: "خوب" | "متوسط" | "نیازمند توجه";
  overallAverage: number;
  classComparison: string;
  subjects: SubjectAnalysis[];
  weakSubjects: string[];
  recGeneral: string;
  recStudyPlan: string;
  recReferral: string | null;
};

export type ClassSummary = {
  averageScore: number | string;
  studentsNeedingAttention: number | string;
  topIssueSubject: string;
};

export type GradeAnalysisResult = {
  classSummary: ClassSummary;
  students: StudentAnalysis[];
};

const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MODEL = "gpt-4o-mini";

function str(v: unknown, fallback = ""): string {
  return typeof v === "string" && v.trim() ? v.trim() : fallback;
}

function num(v: unknown, fallback = 0): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function trend(v: unknown): SubjectAnalysis["trend"] {
  return v === "صعودی" || v === "نزولی" ? v : "ثابت";
}

function status(v: unknown): StudentAnalysis["status"] {
  return v === "خوب" || v === "نیازمند توجه" ? v : "متوسط";
}

/** Model output is prompted as strict JSON but may still arrive fenced or
 * with stray prose around it — strip that before parsing. */
function extractJson(text: string): unknown {
  let t = text.trim();
  t = t
    .replace(/^```json/i, "")
    .replace(/^```/, "")
    .replace(/```$/, "")
    .trim();
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start >= 0 && end > start) t = t.slice(start, end + 1);
  return JSON.parse(t);
}

/** Defensively normalize the model's JSON into a shape the UI can always
 * render, even if a field is missing or malformed. */
function normalize(raw: unknown): GradeAnalysisResult {
  const o = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const cs =
    o.classSummary && typeof o.classSummary === "object"
      ? (o.classSummary as Record<string, unknown>)
      : {};

  const students = Array.isArray(o.students) ? o.students : [];
  return {
    classSummary: {
      averageScore:
        typeof cs.averageScore === "number" ? cs.averageScore : str(cs.averageScore, "—"),
      studentsNeedingAttention:
        typeof cs.studentsNeedingAttention === "number"
          ? cs.studentsNeedingAttention
          : str(cs.studentsNeedingAttention, "—"),
      topIssueSubject: str(cs.topIssueSubject, "—"),
    },
    students: students
      .filter((s): s is Record<string, unknown> => !!s && typeof s === "object")
      .map((s) => ({
        name: str(s.name, "دانش‌آموز"),
        status: status(s.status),
        overallAverage: num(s.overallAverage),
        classComparison: str(s.classComparison),
        subjects: (Array.isArray(s.subjects) ? s.subjects : [])
          .filter((x): x is Record<string, unknown> => !!x && typeof x === "object")
          .map((subj) => ({
            subject: str(subj.subject, "—"),
            scores: Array.isArray(subj.scores) ? subj.scores.map((v) => num(v)) : [],
            trend: trend(subj.trend),
            issue: typeof subj.issue === "string" && subj.issue.trim() ? subj.issue : null,
          })),
        weakSubjects: Array.isArray(s.weakSubjects)
          ? s.weakSubjects.map((v) => str(v)).filter(Boolean)
          : [],
        recGeneral: str(s.recGeneral),
        recStudyPlan: str(s.recStudyPlan),
        recReferral:
          typeof s.recReferral === "string" && s.recReferral.trim() ? s.recReferral : null,
      })),
  };
}

export const analyzeStudentGrades = createServerFn({ method: "POST" })
  .inputValidator(inputSchema)
  .handler(async ({ data }): Promise<GradeAnalysisResult> => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "سرویس تحلیل هوشمند پیکربندی نشده است. متغیر محیطی OPENAI_API_KEY باید در سرور تنظیم شود.",
      );
    }

    const model = process.env.OPENAI_GRADE_ANALYSIS_MODEL || DEFAULT_MODEL;

    const introText = `شما دستیار تحلیل آموزشی برای مسئول پایه هستید.
مقیاس نمرات از ۰ تا ${data.maxScore} است. هر نمره کمتر از ${data.attentionThreshold} به‌عنوان نقطه ضعف در نظر گرفته شود.

داده نمرات (فرمت: نام,درس,نمره۱,نمره۲,...):
${data.csvText}

برای هر دانش‌آموز تحلیل کن: روند نمرات هر درس در طول زمان، درس‌های ضعیف و قوی، مقایسه با میانگین کلاس، و راهکار عملی شامل توصیه کلی، یک برنامه مطالعاتی هفتگی مشخص و قابل اجرا، و در صورت افت شدید در یک درس، پیشنهاد ارجاع به دبیر مربوطه.

خروجی را فقط و فقط به‌صورت یک JSON معتبر با این ساختار دقیق برگردان (بدون توضیح اضافه، بدون markdown fence):
{
  "classSummary": {"averageScore": number, "studentsNeedingAttention": number, "topIssueSubject": string},
  "students": [
    {
      "name": string,
      "status": "خوب" | "متوسط" | "نیازمند توجه",
      "overallAverage": number,
      "classComparison": string,
      "subjects": [{"subject": string, "scores": [number,...], "trend": "صعودی" | "نزولی" | "ثابت", "issue": string or null}],
      "weakSubjects": [string],
      "recGeneral": string,
      "recStudyPlan": string,
      "recReferral": string or null
    }
  ]
}`;

    const content: Array<Record<string, unknown>> = [{ type: "input_text", text: introText }];
    if (data.examPdf) {
      content.push({
        type: "input_file",
        filename: data.examPdf.name || "exam.pdf",
        file_data: `data:${data.examPdf.mediaType};base64,${data.examPdf.base64}`,
      });
    }
    for (const img of data.images ?? []) {
      content.push({
        type: "input_image",
        image_url: `data:${img.mediaType};base64,${img.base64}`,
      });
    }

    let res: Response;
    try {
      res = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          max_output_tokens: 16000,
          instructions: "خروجی را فقط به‌صورت JSON معتبر برگردان، بدون هیچ متن یا توضیح اضافه.",
          input: [{ role: "user", content }],
          text: { format: { type: "json_object" } },
        }),
      });
    } catch {
      throw new Error("اتصال به سرویس هوش مصنوعی برقرار نشد. دوباره تلاش کنید.");
    }

    if (!res.ok) {
      let detail = "";
      try {
        const errBody = (await res.json()) as { error?: { message?: string } };
        detail = errBody?.error?.message ?? "";
      } catch {
        /* ignore */
      }
      throw new Error(`تحلیل با خطا مواجه شد (${res.status}). ${detail}`.trim());
    }

    const body = (await res.json()) as {
      output?: Array<{ type: string; content?: Array<{ type: string; text?: string }> }>;
    };
    const message = (body.output ?? []).find((o) => o.type === "message");
    const textBlock = (message?.content ?? []).find((c) => c.type === "output_text" && c.text);
    if (!textBlock?.text) {
      throw new Error("پاسخ سرویس هوش مصنوعی قابل خواندن نبود. دوباره تلاش کنید.");
    }

    let parsed: unknown;
    try {
      parsed = extractJson(textBlock.text);
    } catch {
      throw new Error("پاسخ سرویس هوش مصنوعی به‌صورت JSON معتبر نبود. دوباره تلاش کنید.");
    }

    return normalize(parsed);
  });
