import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronRight,
  ChevronLeft as ChevronLeftIcon,
  CheckCircle2,
} from "lucide-react";
import type { ContentQuestion } from "@/lib/services/content-service";

export function ExamTakingView({
  questions,
  current,
  setCurrent,
  answers,
  setAnswers,
  onFinish,
  onExit,
  exitLabel = "خروج",
  finishLabel = "پایان آزمون",
  showMeta = false,
}: {
  questions: ContentQuestion[];
  current: number;
  setCurrent: (n: number) => void;
  answers: Record<string, number | string>;
  setAnswers: (a: Record<string, number | string>) => void;
  onFinish: () => void;
  onExit: () => void;
  exitLabel?: string;
  finishLabel?: string;
  showMeta?: boolean;
}) {
  const total = questions.length;

  if (total === 0) {
    return (
      <Card className="border-0 rounded-3xl shadow-sm bg-white">
        <CardContent className="py-6 space-y-4 text-center">
          <p className="text-sm text-slate-500">سؤالی برای نمایش پیدا نشد.</p>
          <div className="flex justify-end">
            <Button variant="outline" onClick={onExit} className="rounded-full">
              بازگشت
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const q = questions[current];
  const opts = useMemo(
    () =>
      [q.option1, q.option2, q.option3, q.option4]
        .map((text, idx) => ({ idx: idx + 1, text }))
        .filter((o) => o.text && o.text.trim().length > 0),
    [q],
  );
  const selected = answers[q.id];
  const isLast = current === total - 1;
  const isDescriptive =
    !!q.questionType && q.questionType.toLowerCase() !== "multiple_choice";
  const progress = Math.round(((current + 1) / total) * 100);

  function pick(idx: number) {
    setAnswers({ ...answers, [q.id]: idx });
  }

  function writeText(text: string) {
    setAnswers({ ...answers, [q.id]: text });
  }

  return (
    <Card className="border-0 rounded-3xl shadow-sm bg-white">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base text-slate-800">
            سؤال {current + 1} از {total}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onExit}
            className="text-slate-500 rounded-full"
          >
            {exitLabel}
          </Button>
        </div>
        <div className="pt-3">
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {showMeta && (q.subject || q.goftar || q.difficulty) && (
          <div className="flex flex-wrap gap-2 text-xs">
            {q.subject && (
              <span className="rounded-full bg-violet-50 text-violet-700 px-2.5 py-1">
                {q.subject}
              </span>
            )}
            {q.goftar && (
              <span className="rounded-full bg-sky-50 text-sky-700 px-2.5 py-1">
                {q.goftar}
              </span>
            )}
            {q.difficulty && (
              <span className="rounded-full bg-amber-50 text-amber-700 px-2.5 py-1">
                سطح: {q.difficulty}
              </span>
            )}
          </div>
        )}
        <p className="text-base leading-8 font-medium text-slate-800 whitespace-pre-wrap">
          {q.questionText || "—"}
        </p>


        {isDescriptive ? (
          <Textarea
            dir="rtl"
            value={typeof selected === "string" ? selected : ""}
            onChange={(e) => writeText(e.target.value)}
            placeholder="پاسخ خود را اینجا بنویسید…"
            className="min-h-[140px] rounded-2xl border-slate-200 bg-white text-right leading-8"
          />
        ) : (
          <div className="grid gap-2">
            {opts.map((o) => {
              const isSel = selected === o.idx;
              return (
                <button
                  key={o.idx}
                  onClick={() => pick(o.idx)}
                  className={`text-right rounded-2xl border p-3 transition ${
                    isSel
                      ? "border-violet-400 bg-violet-50 text-violet-800"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-xs text-slate-400 ml-2">گزینه {o.idx}</span>
                  {o.text}
                </button>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            className="rounded-full"
            disabled={current === 0}
            onClick={() => setCurrent(current - 1)}
          >
            <ChevronRight className="h-4 w-4 ml-1" />
            قبلی
          </Button>
          {isLast ? (
            <Button
              onClick={onFinish}
              className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              پایان آزمون
              <CheckCircle2 className="h-4 w-4 mr-1" />
            </Button>
          ) : (
            <Button
              onClick={() => setCurrent(current + 1)}
              className="rounded-full bg-violet-600 hover:bg-violet-700 text-white"
            >
              بعدی
              <ChevronLeftIcon className="h-4 w-4 mr-1" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
