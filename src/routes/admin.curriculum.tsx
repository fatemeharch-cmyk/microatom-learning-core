import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Database, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/curriculum")({
  component: CurriculumAdmin,
});

// ---------------------------------------------------------------------------
// Entity descriptors
// ---------------------------------------------------------------------------

type FieldType = "text" | "textarea" | "number" | "bool" | "ref" | "csv";

interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  refTable?: EntityKey;
  required?: boolean;
  placeholder?: string;
}

type EntityKey =
  | "education_levels"
  | "grades"
  | "majors"
  | "subjects"
  | "chapters"
  | "sections"
  | "atoms"
  | "micro_atoms"
  | "questions";

interface EntityDef {
  key: EntityKey;
  title: string;
  description: string;
  primaryLabel: string; // column to show as the row title
  fields: FieldDef[];
  list: string[]; // columns shown in table
}

const ENTITIES: EntityDef[] = [
  {
    key: "education_levels",
    title: "Education Levels",
    description: "Top of the hierarchy (Primary, Middle, High School, University).",
    primaryLabel: "name_fa",
    list: ["code", "name_fa", "name_en", "order_index", "is_active"],
    fields: [
      { key: "code", label: "Code", type: "text", required: true, placeholder: "secondary" },
      { key: "name_fa", label: "Name (FA)", type: "text", required: true },
      { key: "name_en", label: "Name (EN)", type: "text" },
      { key: "order_index", label: "Order", type: "number" },
      { key: "is_active", label: "Active", type: "bool" },
    ],
  },
  {
    key: "grades",
    title: "Grades",
    description: "Grade levels within an Education Level.",
    primaryLabel: "name_fa",
    list: ["code", "name_fa", "name_en", "education_level_id", "order_index", "is_active"],
    fields: [
      { key: "code", label: "Code", type: "text", required: true, placeholder: "g11" },
      { key: "name_fa", label: "Name (FA)", type: "text", required: true },
      { key: "name_en", label: "Name (EN)", type: "text" },
      { key: "education_level_id", label: "Education Level", type: "ref", refTable: "education_levels", required: true },
      { key: "order_index", label: "Order", type: "number" },
      { key: "is_active", label: "Active", type: "bool" },
    ],
  },
  {
    key: "majors",
    title: "Majors",
    description: "Majors (Experimental, Math, Humanities…).",
    primaryLabel: "name_fa",
    list: ["code", "name_fa", "name_en", "grade_id", "is_active"],
    fields: [
      { key: "code", label: "Code", type: "text", required: true, placeholder: "experimental" },
      { key: "name_fa", label: "Name (FA)", type: "text", required: true },
      { key: "name_en", label: "Name (EN)", type: "text" },
      { key: "grade_id", label: "Grade", type: "ref", refTable: "grades", required: true },
      { key: "is_active", label: "Active", type: "bool" },
    ],
  },
  {
    key: "subjects",
    title: "Subjects",
    description: "Subjects taught for a major.",
    primaryLabel: "name_fa",
    list: ["code", "name_fa", "name_en", "major_id", "color", "is_active"],
    fields: [
      { key: "code", label: "Code", type: "text", required: true, placeholder: "biology-11-exp" },
      { key: "name_fa", label: "Name (FA)", type: "text", required: true },
      { key: "name_en", label: "Name (EN)", type: "text" },
      { key: "major_id", label: "Major", type: "ref", refTable: "majors", required: true },
      { key: "color", label: "Color (hex)", type: "text", placeholder: "#16a34a" },
      { key: "is_active", label: "Active", type: "bool" },
    ],
  },
  {
    key: "chapters",
    title: "Chapters",
    description: "Chapters of a subject.",
    primaryLabel: "title_fa",
    list: ["code", "title_fa", "title_en", "subject_id", "order_index"],
    fields: [
      { key: "code", label: "Code", type: "text", required: true },
      { key: "title_fa", label: "Title (FA)", type: "text", required: true },
      { key: "title_en", label: "Title (EN)", type: "text" },
      { key: "subject_id", label: "Subject", type: "ref", refTable: "subjects", required: true },
      { key: "order_index", label: "Order", type: "number" },
    ],
  },
  {
    key: "sections",
    title: "Sections (Goftar)",
    description: "Goftar / sections inside a chapter.",
    primaryLabel: "title_fa",
    list: ["code", "title_fa", "title_en", "chapter_id", "order_index"],
    fields: [
      { key: "code", label: "Code", type: "text", required: true },
      { key: "title_fa", label: "Title (FA)", type: "text", required: true },
      { key: "title_en", label: "Title (EN)", type: "text" },
      { key: "chapter_id", label: "Chapter", type: "ref", refTable: "chapters", required: true },
      { key: "order_index", label: "Order", type: "number" },
    ],
  },
  {
    key: "atoms",
    title: "Atoms",
    description: "Learning atoms inside a section.",
    primaryLabel: "title_fa",
    list: ["code", "title_fa", "title_en", "section_id", "order_index"],
    fields: [
      { key: "code", label: "Code", type: "text", required: true },
      { key: "title_fa", label: "Title (FA)", type: "text", required: true },
      { key: "title_en", label: "Title (EN)", type: "text" },
      { key: "section_id", label: "Section", type: "ref", refTable: "sections", required: true },
      { key: "order_index", label: "Order", type: "number" },
    ],
  },
  {
    key: "micro_atoms",
    title: "MicroAtoms",
    description: "Smallest learning unit; carries the full path back to grade/major.",
    primaryLabel: "title_fa",
    list: ["code", "title_fa", "parent_atom_id", "difficulty_level", "estimated_study_time", "learning_order"],
    fields: [
      { key: "code", label: "Code", type: "text", required: true },
      { key: "title_fa", label: "Title (FA)", type: "text", required: true },
      { key: "title_en", label: "Title (EN)", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "parent_atom_id", label: "Parent Atom", type: "ref", refTable: "atoms", required: true },
      { key: "section_id", label: "Section", type: "ref", refTable: "sections" },
      { key: "chapter_id", label: "Chapter", type: "ref", refTable: "chapters" },
      { key: "subject_id", label: "Subject", type: "ref", refTable: "subjects" },
      { key: "grade_id", label: "Grade", type: "ref", refTable: "grades" },
      { key: "major_id", label: "Major", type: "ref", refTable: "majors" },
      { key: "difficulty_level", label: "Difficulty (1–5)", type: "number" },
      { key: "estimated_study_time", label: "Est. Study Time (min)", type: "number" },
      { key: "prerequisites", label: "Prerequisites (comma-separated UUIDs)", type: "csv" },
      { key: "learning_order", label: "Learning Order", type: "number" },
    ],
  },
  {
    key: "questions",
    title: "Questions",
    description: "Questions attached to a MicroAtom.",
    primaryLabel: "code",
    list: ["code", "micro_atom_id", "difficulty_level", "estimated_time"],
    fields: [
      { key: "code", label: "Code", type: "text", required: true },
      { key: "micro_atom_id", label: "MicroAtom", type: "ref", refTable: "micro_atoms", required: true },
      { key: "prompt", label: "Prompt", type: "textarea", required: true },
      { key: "answer", label: "Answer", type: "text" },
      { key: "explanation", label: "Explanation", type: "textarea" },
      { key: "difficulty_level", label: "Difficulty (1–5)", type: "number" },
      { key: "estimated_time", label: "Est. Time (sec)", type: "number" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type Row = Record<string, unknown> & { id: string };

function CurriculumAdmin() {
  const [active, setActive] = useState<EntityKey>("education_levels");

  return (
    <div className="space-y-6 max-w-6xl p-6">
      <Card className="overflow-hidden border-0 bg-[image:var(--gradient-primary)] text-primary-foreground">
        <CardContent className="p-5 flex items-start gap-3">
          <Database className="h-5 w-5 mt-0.5" />
          <div>
            <h1 className="text-xl font-bold">Curriculum Database</h1>
            <p className="text-sm opacity-90 mt-1">
              Manage the 9-level content hierarchy: Education Level → Grade → Major → Subject → Chapter →
              Section → Atom → MicroAtom → Question. Designed for Grade 11 — Experimental in v1, scales to
              any future grade or major.
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs value={active} onValueChange={(v) => setActive(v as EntityKey)}>
        <TabsList className="flex flex-wrap h-auto">
          {ENTITIES.map((e) => (
            <TabsTrigger key={e.key} value={e.key} className="text-xs">
              {e.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {ENTITIES.map((e) => (
          <TabsContent key={e.key} value={e.key} className="mt-4">
            <EntityCrud entity={e} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function EntityCrud({ entity }: { entity: EntityDef }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [open, setOpen] = useState(false);

  // ref data per referenced entity
  const refKeys = useMemo(
    () => Array.from(new Set(entity.fields.filter((f) => f.type === "ref" && f.refTable).map((f) => f.refTable!))),
    [entity],
  );
  const [refs, setRefs] = useState<Record<string, Row[]>>({});

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from(entity.key)
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows((data ?? []) as Row[]);
    setLoading(false);
  };

  const loadRefs = async () => {
    const next: Record<string, Row[]> = {};
    for (const k of refKeys) {
      const { data } = await supabase.from(k).select("*").limit(500);
      next[k] = (data ?? []) as Row[];
    }
    setRefs(next);
  };

  useEffect(() => {
    void load();
    void loadRefs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entity.key]);

  const refLabel = (table: string, id: unknown) => {
    if (!id) return "—";
    const list = refs[table] ?? [];
    const found = list.find((r) => r.id === id);
    if (!found) return String(id).slice(0, 8);
    return (found.name_fa as string) ?? (found.title_fa as string) ?? (found.code as string) ?? String(id);
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this record?")) return;
    const { error } = await supabase.from(entity.key).delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    void load();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base">{entity.title}</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">{entity.description}</p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mx-1" /> Add
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-10 text-muted-foreground text-sm">
            <Loader2 className="h-4 w-4 animate-spin mx-2" /> Loading…
          </div>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            No records yet. Click "Add" to create the first one.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {entity.list.map((c) => (
                  <TableHead key={c}>{c}</TableHead>
                ))}
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  {entity.list.map((c) => {
                    const f = entity.fields.find((x) => x.key === c);
                    let v: React.ReactNode = String(r[c] ?? "—");
                    if (f?.type === "bool")
                      v = (
                        <Badge variant={r[c] ? "default" : "secondary"} className="text-[10px]">
                          {r[c] ? "Yes" : "No"}
                        </Badge>
                      );
                    else if (f?.type === "ref" && f.refTable) v = refLabel(f.refTable, r[c]);
                    return <TableCell key={c} className="text-xs">{v}</TableCell>;
                  })}
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditing(r);
                        setOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(r.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <RecordDialog
        open={open}
        onOpenChange={setOpen}
        entity={entity}
        record={editing}
        refs={refs}
        onSaved={() => {
          setOpen(false);
          void load();
        }}
      />
    </Card>
  );
}

function RecordDialog({
  open,
  onOpenChange,
  entity,
  record,
  refs,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  entity: EntityDef;
  record: Row | null;
  refs: Record<string, Row[]>;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (record) {
      const next: Record<string, unknown> = {};
      for (const f of entity.fields) {
        const v = record[f.key];
        next[f.key] = f.type === "csv" && Array.isArray(v) ? (v as unknown[]).join(",") : v ?? "";
      }
      setForm(next);
    } else {
      const next: Record<string, unknown> = {};
      for (const f of entity.fields) {
        next[f.key] = f.type === "bool" ? false : f.type === "number" ? 0 : "";
      }
      setForm(next);
    }
  }, [record, entity]);

  const set = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  const save = async () => {
    setSaving(true);
    const payload: Record<string, unknown> = {};
    for (const f of entity.fields) {
      const v = form[f.key];
      if (f.required && (v === "" || v === null || v === undefined)) {
        setSaving(false);
        return toast.error(`${f.label} is required`);
      }
      if (v === "" || v === undefined) continue;
      if (f.type === "number") payload[f.key] = Number(v);
      else if (f.type === "bool") payload[f.key] = Boolean(v);
      else if (f.type === "csv")
        payload[f.key] = String(v)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      else payload[f.key] = v;
    }

    const tbl = supabase.from(entity.key) as unknown as {
      update: (p: Record<string, unknown>) => { eq: (k: string, v: string) => Promise<{ error: { message: string } | null }> };
      insert: (p: Record<string, unknown>) => Promise<{ error: { message: string } | null }>;
    };
    const { error } = record
      ? await tbl.update(payload).eq("id", record.id)
      : await tbl.insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(record ? "Updated" : "Created");
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {record ? "Edit" : "New"} {entity.title}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          {entity.fields.map((f) => (
            <div key={f.key} className={f.type === "textarea" || f.type === "csv" ? "sm:col-span-2" : ""}>
              <Label className="text-xs">
                {f.label} {f.required && <span className="text-destructive">*</span>}
              </Label>
              {f.type === "textarea" ? (
                <Textarea
                  value={String(form[f.key] ?? "")}
                  onChange={(e) => set(f.key, e.target.value)}
                  rows={3}
                />
              ) : f.type === "bool" ? (
                <Select
                  value={String(Boolean(form[f.key]))}
                  onValueChange={(v) => set(f.key, v === "true")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              ) : f.type === "ref" && f.refTable ? (
                <Select
                  value={String(form[f.key] ?? "")}
                  onValueChange={(v) => set(f.key, v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent>
                    {(refs[f.refTable] ?? []).map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {(r.name_fa as string) ??
                          (r.title_fa as string) ??
                          (r.code as string) ??
                          r.id}
                      </SelectItem>
                    ))}
                    {(refs[f.refTable] ?? []).length === 0 && (
                      <div className="px-2 py-1.5 text-xs text-muted-foreground">
                        No options yet — create one in its tab.
                      </div>
                    )}
                  </SelectContent>
                </Select>
              ) : f.type === "number" ? (
                <Input
                  type="number"
                  value={String(form[f.key] ?? 0)}
                  onChange={(e) => set(f.key, e.target.value)}
                />
              ) : (
                <Input
                  value={String(form[f.key] ?? "")}
                  placeholder={f.placeholder}
                  onChange={(e) => set(f.key, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin mx-1" />}
            {record ? "Save" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
