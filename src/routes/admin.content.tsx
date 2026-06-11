import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronRight, Lock, Sparkles, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  HIERARCHY_LEVELS,
  HIERARCHY_LEVELS_FA,
  atomsForTopic,
  byId,
  chaptersForSubject,
  educationLevels,
  grades,
  majors,
  microAtomsForAtom,
  subjects,
  subjectsForScope,
  topicsForChapter,
} from "@/lib/content-taxonomy";
import { useScope } from "@/lib/scope";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin/content")({
  component: ContentLibrary,
});

function ContentLibrary() {
  const { lang } = useI18n();
  const fa = lang === "fa";
  const { scope, level, grade, major, locked } = useScope();
  const levels = fa ? HIERARCHY_LEVELS_FA : HIERARCHY_LEVELS;

  const activeSubjects = useMemo(() => subjectsForScope(scope), [scope]);
  const [subjectId, setSubjectId] = useState(activeSubjects[0]?.id ?? "");
  const [chapterId, setChapterId] = useState<string>(() => chaptersForSubject(activeSubjects[0]?.id ?? "")[0]?.id ?? "");
  const [topicId, setTopicId] = useState<string>(() => {
    const c = chaptersForSubject(activeSubjects[0]?.id ?? "")[0]?.id ?? "";
    return topicsForChapter(c)[0]?.id ?? "";
  });
  const [atomId, setAtomId] = useState<string>(() => {
    const c = chaptersForSubject(activeSubjects[0]?.id ?? "")[0]?.id ?? "";
    const t = topicsForChapter(c)[0]?.id ?? "";
    return atomsForTopic(t)[0]?.id ?? "";
  });

  const chapters = chaptersForSubject(subjectId);
  const topics = topicsForChapter(chapterId);
  const atomList = atomsForTopic(topicId);
  const micros = microAtomsForAtom(atomId);

  const name = (o: { nameFa: string; nameEn: string } | undefined) =>
    o ? (fa ? o.nameFa : o.nameEn) : "—";

  return (
    <div className="space-y-6 max-w-6xl p-6">
      {/* Scope banner */}
      <Card className="overflow-hidden border-0 bg-[image:var(--gradient-primary)] text-primary-foreground">
        <CardContent className="p-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <Badge variant="secondary" className="bg-white/15 text-primary-foreground border-0 mb-2">
              <Sparkles className="h-3 w-3 mx-1" />
              {fa ? "نسخه ۱ — دامنه فعال" : "v1 — Active scope"}
            </Badge>
            <h1 className="text-xl sm:text-2xl font-bold">
              {name(level)} • {name(grade)} • {name(major)}
            </h1>
            <p className="text-sm opacity-90 mt-1">
              {fa
                ? "تمام محتوا، آزمون‌ها و ماژول‌های AI نسخه اول روی همین دامنه کار می‌کنند. ساختار طوری طراحی شده که افزودن پایه‌ها و رشته‌های جدید بدون بازطراحی انجام شود."
                : "All content, exams and AI modules in v1 operate within this scope. The schema scales to new grades and majors without redesign."}
            </p>
          </div>
          {locked && (
            <Badge variant="secondary" className="bg-white/15 text-primary-foreground border-0 self-start">
              <Lock className="h-3 w-3 mx-1" />
              {fa ? "قفل نسخه ۱" : "v1 locked"}
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Hierarchy overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            {fa ? "ساختار محتوا" : "Content hierarchy"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {levels.map((l, i) => (
              <div key={l} className="flex items-center gap-2">
                <span className="rounded-full border px-2.5 py-1 font-medium bg-muted/40">{l}</span>
                {i < levels.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground rtl:rotate-180" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Level / Grade / Major status grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        <StatusList
          title={fa ? "مقاطع تحصیلی" : "Education levels"}
          rows={educationLevels.map((e) => ({
            id: e.id,
            label: fa ? e.nameFa : e.nameEn,
            active: e.active,
            current: e.id === scope.levelId,
          }))}
          fa={fa}
        />
        <StatusList
          title={fa ? "پایه‌ها" : "Grades"}
          rows={grades.map((g) => ({
            id: g.id,
            label: fa ? g.nameFa : g.nameEn,
            active: g.active,
            current: g.id === scope.gradeId,
          }))}
          fa={fa}
        />
        <StatusList
          title={fa ? "رشته‌ها" : "Majors"}
          rows={majors.map((m) => ({
            id: m.id,
            label: `${fa ? m.nameFa : m.nameEn} · ${byId(grades, m.gradeId)?.[fa ? "nameFa" : "nameEn"] ?? ""}`,
            active: m.active,
            current: m.id === scope.majorId,
          }))}
          fa={fa}
        />
      </div>

      {/* Drilldown explorer */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {fa ? "کاوشگر درس‌ها" : "Subject explorer"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 lg:grid-cols-4">
            <Column
              title={fa ? "درس" : "Subject"}
              items={activeSubjects.map((s) => ({ id: s.id, label: fa ? s.nameFa : s.nameEn }))}
              selectedId={subjectId}
              onSelect={(id) => {
                setSubjectId(id);
                const c = chaptersForSubject(id)[0]?.id ?? "";
                setChapterId(c);
                const t = topicsForChapter(c)[0]?.id ?? "";
                setTopicId(t);
                setAtomId(atomsForTopic(t)[0]?.id ?? "");
              }}
            />
            <Column
              title={fa ? "فصل" : "Chapter"}
              items={chapters.map((c) => ({ id: c.id, label: fa ? c.nameFa : c.nameEn }))}
              selectedId={chapterId}
              onSelect={(id) => {
                setChapterId(id);
                const t = topicsForChapter(id)[0]?.id ?? "";
                setTopicId(t);
                setAtomId(atomsForTopic(t)[0]?.id ?? "");
              }}
              empty={fa ? "محتوا به‌زودی اضافه می‌شود" : "Content coming soon"}
            />
            <Column
              title={fa ? "مبحث" : "Topic"}
              items={topics.map((t) => ({ id: t.id, label: fa ? t.nameFa : t.nameEn }))}
              selectedId={topicId}
              onSelect={(id) => {
                setTopicId(id);
                setAtomId(atomsForTopic(id)[0]?.id ?? "");
              }}
              empty={fa ? "—" : "—"}
            />
            <Column
              title={fa ? "اتم" : "Atom"}
              items={atomList.map((a) => ({ id: a.id, label: fa ? a.nameFa : a.nameEn }))}
              selectedId={atomId}
              onSelect={setAtomId}
              empty={fa ? "—" : "—"}
            />
          </div>

          <div className="mt-6">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              {fa ? "میکرواتم‌ها" : "MicroAtoms"} · {micros.length}
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {micros.map((m) => (
                <div key={m.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{fa ? m.nameFa : m.nameEn}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {fa ? "زمان تخمینی" : "Est."}: {m.estMinutes ?? "—"}′ · {fa ? "سختی" : "Difficulty"}: {m.difficulty ?? "—"}/5
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">{m.id}</Badge>
                </div>
              ))}
              {micros.length === 0 && (
                <p className="text-xs text-muted-foreground">{fa ? "میکرواتمی ثبت نشده." : "No MicroAtoms yet."}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatusList({
  title,
  rows,
  fa,
}: {
  title: string;
  rows: { id: string; label: string; active: boolean; current: boolean }[];
  fa: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {rows.map((r) => (
          <div
            key={r.id}
            className={`flex items-center justify-between rounded-lg border p-2.5 text-sm ${
              r.current ? "border-primary bg-primary/5" : ""
            }`}
          >
            <span className="truncate">{r.label}</span>
            <Badge
              variant="secondary"
              className={
                r.current
                  ? "bg-primary/15 text-primary border-0"
                  : r.active
                  ? "bg-success/15 text-success border-0"
                  : "bg-muted text-muted-foreground border-0"
              }
            >
              {r.current ? (fa ? "فعلی" : "Current") : r.active ? (fa ? "فعال" : "Active") : (fa ? "بعداً" : "Later")}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function Column({
  title,
  items,
  selectedId,
  onSelect,
  empty,
}: {
  title: string;
  items: { id: string; label: string }[];
  selectedId: string;
  onSelect: (id: string) => void;
  empty?: string;
}) {
  return (
    <div className="rounded-lg border">
      <div className="border-b p-2.5 text-xs font-medium text-muted-foreground">{title}</div>
      <div className="max-h-72 overflow-y-auto p-1.5 space-y-1">
        {items.length === 0 && (
          <p className="p-2 text-xs text-muted-foreground">{empty ?? "—"}</p>
        )}
        {items.map((i) => {
          const a = i.id === selectedId;
          return (
            <button
              key={i.id}
              onClick={() => onSelect(i.id)}
              className={`w-full text-start rounded-md px-2.5 py-2 text-sm transition ${
                a ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              {i.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
