import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Leaf } from "lucide-react";
import {
  summarizeStudent as bioSummarize,
  refreshDosesFor as bioRefreshDoses,
  useBioCh1Tick,
} from "@/lib/mock/biology-ch1";
import {
  findBiologySubject,
  listChaptersBySubject,
  listAllMicroAtomsForChapter,
  type ContentMicroAtom,
} from "@/lib/services/content-service";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const Route = createFileRoute("/grade-supervisor/students/$id")({
  component: StudentProfilePage,
});

function toFa(n: number | string) {
  return Number(n).toLocaleString("fa-IR");
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-3xl shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)] border border-slate-100 ${className}`}
    >
      {children}
    </div>
  );
}

function MiniStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className={`rounded-2xl px-3 py-2 ${tone}`}>
      <p className="text-[10px] opacity-80">{label}</p>
      <p className="text-xs font-extrabold mt-0.5 truncate">{value}</p>
    </div>
  );
}

function StudentProfilePage() {
  const { id } = Route.useParams();
  useBioCh1Tick();
  useEffect(() => {
    bioRefreshDoses(id);
  }, [id]);

  // Biology Chapter 1 panel — pulled from the real Xano Content Engine.
  const subjectQ = useQuery({
    queryKey: ["content", "biology-subject"],
    queryFn: () => findBiologySubject(),
    staleTime: 5 * 60_000,
  });
  const chaptersQ = useQuery({
    queryKey: ["content", "chapters", subjectQ.data?.id],
    queryFn: () => listChaptersBySubject(subjectQ.data!.id),
    enabled: !!subjectQ.data?.id,
    staleTime: 5 * 60_000,
  });
  const activeChapter = chaptersQ.data?.[0] ?? null;
  const microsQ = useQuery({
    queryKey: ["content", "chapter-micros", activeChapter?.id],
    queryFn: () => listAllMicroAtomsForChapter(activeChapter!.id),
    enabled: !!activeChapter?.id,
    staleTime: 5 * 60_000,
  });
  const bioMicros: ContentMicroAtom[] = microsQ.data ?? [];
  const bioChapterTitle = activeChapter?.title ?? "زیست‌شناسی";
  const bio = bioSummarize(id, bioMicros);

  return (
    <div dir="rtl" className="font-vazir space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Link
          to="/grade-supervisor/students"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-violet-600 transition"
        >
          <ArrowRight className="h-3.5 w-3.5" />
          بازگشت به مرکز پایش
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-800">
          پرونده رشد دانش‌آموز
        </h1>
      </div>

      {/* Honest empty state — no per-student profile endpoint yet */}
      <Card className="p-10 text-center">
        <div className="mx-auto h-14 w-14 rounded-2xl bg-violet-50 text-violet-600 grid place-items-center">
          <Sparkles className="h-6 w-6" />
        </div>
        <h2 className="text-base font-bold text-slate-800 mt-4">
          پرونده کامل دانش‌آموز در راه است
        </h2>
        <p className="text-sm text-slate-500 mt-2 leading-7 max-w-md mx-auto">
          این بخش هنوز به داده واقعی وصل نشده و به‌زودی فعال می‌شود.
        </p>
      </Card>

      {/* Biology Chapter 1 — pulled from shared student doses & checkups */}
      <Card className="p-5">
        <div className="flex items-center justify-between gap-2 flex-wrap mb-4">
          <div className="flex items-center gap-2">
            <span className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 grid place-items-center">
              <Leaf className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-800">
                {bioChapterTitle}
              </h2>
              <p className="text-[11px] text-slate-500">
                عملکرد این دانش‌آموز در فصل فعال زیست‌شناسی
              </p>
            </div>
          </div>
          {bio.needsFollowUp && (
            <span className="text-[10px] px-2.5 py-1 rounded-full border border-rose-100 bg-rose-50 text-rose-700">
              نیازمند پیگیری
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          <MiniStat
            label="مجموع دوز"
            value={`${toFa(bio.totalMinutes)} دق`}
            tone="bg-indigo-50 text-indigo-700"
          />
          <MiniStat
            label="تعداد دوز"
            value={toFa(bio.doseCount)}
            tone="bg-violet-50 text-violet-700"
          />
          <MiniStat
            label="آخرین چکاب"
            value={bio.latest ? `${toFa(bio.latest.score)}٪` : "—"}
            tone={
              bio.latest && bio.latest.score < 60
                ? "bg-rose-50 text-rose-700"
                : "bg-emerald-50 text-emerald-700"
            }
          />
          <MiniStat
            label="میانگین چکاب"
            value={bio.avg == null ? "—" : `${toFa(bio.avg)}٪`}
            tone="bg-teal-50 text-teal-700"
          />
        </div>
        <div className="space-y-2">
          {bioMicros.map((m) => {
            const cs = bio.checkups.filter((c) => c.microAtomId === m.id);
            const avg =
              cs.length === 0
                ? null
                : Math.round(
                    cs.reduce((s, c) => s + c.score, 0) / cs.length,
                  );
            const minutes = bio.doses
              .filter((d) => d.microAtomId === m.id)
              .reduce((s, d) => s + d.minutes, 0);
            return (
              <div
                key={m.id}
                className="flex items-center justify-between text-xs gap-3 px-3 py-2 rounded-xl border border-slate-100"
              >
                <span className="text-slate-700 truncate">{m.title}</span>
                <span className="flex items-center gap-2 shrink-0">
                  <span className="text-slate-500">
                    دوز {toFa(minutes)} دق
                  </span>
                  <span
                    className={
                      avg == null
                        ? "text-slate-400"
                        : avg < 60
                          ? "text-rose-600 font-bold"
                          : "text-emerald-600 font-bold"
                    }
                  >
                    {avg == null ? "—" : `${toFa(avg)}٪`}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
        {bio.weak.length > 0 && (
          <div className="mt-3 text-xs text-rose-700 bg-rose-50 border border-rose-100 rounded-xl p-3">
            مفاهیم نیازمند مرور: {bio.weak.map((w) => w.title).join("، ")}
          </div>
        )}
      </Card>
    </div>
  );
}
