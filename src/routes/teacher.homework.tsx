import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  CalendarClock,
  ClipboardList,
  NotebookPen,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/teacher/homework")({
  component: HomeworkBuilder,
});

const microAtomsFA = [
  { id: "m1", title: "تعریف تابع و دامنه", chapter: "ریاضی • فصل ۲" },
  { id: "m2", title: "حل معادله درجه دوم", chapter: "ریاضی • فصل ۲" },
  { id: "m3", title: "قانون اول نیوتن", chapter: "فیزیک • فصل ۳" },
  { id: "m4", title: "ساختار اتم", chapter: "شیمی • فصل ۱" },
  { id: "m5", title: "زمان حال کامل", chapter: "زبان • درس ۴" },
];
const microAtomsEN = [
  { id: "m1", title: "Function & domain", chapter: "Math • Ch.2" },
  { id: "m2", title: "Quadratic equations", chapter: "Math • Ch.2" },
  { id: "m3", title: "Newton's first law", chapter: "Physics • Ch.3" },
  { id: "m4", title: "Atomic structure", chapter: "Chemistry • Ch.1" },
  { id: "m5", title: "Present perfect", chapter: "English • L.4" },
];

const classesFA = ["پایه ۱۰ - الف", "پایه ۱۰ - ب", "پایه ۱۱ - الف"];
const classesEN = ["Grade 10-A", "Grade 10-B", "Grade 11-A"];

const existingFA = [
  { title: "تمرین فصل ۲ ریاضی", due: "۲۲ خرداد", target: "پایه ۱۰", subm: 18, total: 30, status: "active" },
  { title: "تحقیق درباره اتم", due: "۲۵ خرداد", target: "پایه ۱۰", subm: 6, total: 30, status: "active" },
  { title: "تمرین زمان‌های زبان", due: "۱۸ خرداد", target: "پایه ۱۱", subm: 28, total: 28, status: "closed" },
];
const existingEN = [
  { title: "Math Ch.2 exercises", due: "Jun 22", target: "Grade 10", subm: 18, total: 30, status: "active" },
  { title: "Research on atoms", due: "Jun 25", target: "Grade 10", subm: 6, total: 30, status: "active" },
  { title: "English tenses practice", due: "Jun 18", target: "Grade 11", subm: 28, total: 28, status: "closed" },
];

function HomeworkBuilder() {
  const { lang } = useI18n();
  const fa = lang === "fa";
  const microAtoms = fa ? microAtomsFA : microAtomsEN;
  const classes = fa ? classesFA : classesEN;
  const existing = fa ? existingFA : existingEN;

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [due, setDue] = useState("");
  const [selectedAtoms, setSelectedAtoms] = useState<string[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([classes[0]]);
  const [search, setSearch] = useState("");

  const toggle = <T,>(arr: T[], v: T) =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  const filtered = microAtoms.filter(
    (m) => !search || m.title.includes(search) || m.chapter.includes(search),
  );

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <Badge variant="secondary" className="mb-2">
          <NotebookPen className="h-3 w-3 mx-1" />
          {fa ? "ساخت تکلیف" : "Create homework"}
        </Badge>
        <h1 className="text-2xl font-bold tracking-tight">
          {fa ? "مرکز ساخت تکلیف" : "Homework builder"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {fa
            ? "تکلیف جدید بساز یا تکالیف فعلی رو مدیریت کن."
            : "Create new assignments or manage existing ones."}
        </p>
      </div>

      <Tabs defaultValue="create">
        <TabsList>
          <TabsTrigger value="create">
            <Plus className="h-4 w-4 mx-1" />
            {fa ? "تکلیف جدید" : "New"}
          </TabsTrigger>
          <TabsTrigger value="existing">
            <ClipboardList className="h-4 w-4 mx-1" />
            {fa ? "تکالیف موجود" : "Existing"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4 mt-4">
          <div className="grid lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">{fa ? "جزئیات تکلیف" : "Assignment details"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>{fa ? "عنوان" : "Title"}</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={fa ? "مثلاً: تمرین فصل ۲ ریاضی" : "e.g. Math Ch.2 exercises"}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>{fa ? "توضیحات" : "Instructions"}</Label>
                  <Textarea
                    rows={4}
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder={fa ? "دستورالعمل برای دانش‌آموزان..." : "Instructions for students..."}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>{fa ? "مهلت تحویل" : "Due date"}</Label>
                    <Input
                      type="date"
                      value={due}
                      onChange={(e) => setDue(e.target.value)}
                      dir="ltr"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>{fa ? "کلاس‌های هدف" : "Target classes"}</Label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {classes.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setSelectedClasses(toggle(selectedClasses, c))}
                          className={`text-xs px-3 py-1.5 rounded-full border transition ${
                            selectedClasses.includes(c)
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-card hover:bg-accent"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{fa ? "میکرواتم‌های مرتبط" : "Linked MicroAtoms"}</Label>
                  <div className="relative">
                    <Search className="h-4 w-4 absolute top-2.5 start-3 text-muted-foreground" />
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={fa ? "جستجو..." : "Search..."}
                      className="ps-9"
                    />
                  </div>
                  <div className="border rounded-lg max-h-64 overflow-auto divide-y">
                    {filtered.map((m) => {
                      const sel = selectedAtoms.includes(m.id);
                      return (
                        <label
                          key={m.id}
                          className="flex items-center gap-3 p-3 hover:bg-accent/40 cursor-pointer"
                        >
                          <Checkbox
                            checked={sel}
                            onCheckedChange={() => setSelectedAtoms(toggle(selectedAtoms, m.id))}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{m.title}</p>
                            <p className="text-[11px] text-muted-foreground">{m.chapter}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">{fa ? "پیش‌نمایش" : "Preview"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">{fa ? "عنوان" : "Title"}</p>
                  <p className="font-semibold">{title || (fa ? "بدون عنوان" : "Untitled")}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarClock className="h-3.5 w-3.5" />
                  {due || (fa ? "بدون مهلت" : "No deadline")}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  {selectedClasses.length} {fa ? "کلاس" : "classes"}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {fa ? "میکرواتم‌ها" : "MicroAtoms"} ({selectedAtoms.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAtoms.length === 0 ? (
                      <span className="text-[11px] text-muted-foreground">
                        {fa ? "هنوز انتخاب نشده" : "None selected"}
                      </span>
                    ) : (
                      microAtoms
                        .filter((m) => selectedAtoms.includes(m.id))
                        .map((m) => (
                          <Badge key={m.id} variant="secondary" className="text-[10px]">
                            {m.title}
                          </Badge>
                        ))
                    )}
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1 rounded-full">
                    {fa ? "انتشار" : "Publish"}
                  </Button>
                  <Button variant="outline" className="rounded-full">
                    {fa ? "پیش‌نویس" : "Draft"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="existing" className="space-y-3 mt-4">
          {existing.map((h, i) => {
            const pct = Math.round((h.subm / h.total) * 100);
            return (
              <Card key={i}>
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">{h.title}</h3>
                      <Badge
                        variant="secondary"
                        className={
                          h.status === "active"
                            ? "bg-primary/15 text-primary border-0"
                            : "bg-muted text-muted-foreground border-0"
                        }
                      >
                        {h.status === "active"
                          ? fa ? "فعال" : "Active"
                          : fa ? "بسته شده" : "Closed"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {h.target} • {fa ? "مهلت:" : "Due:"} {h.due} • {h.subm}/{h.total} ({pct}٪)
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="rounded-full">
                      {fa ? "مشاهده" : "View"}
                    </Button>
                    <Button size="sm" variant="ghost" className="rounded-full" aria-label="delete">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}
