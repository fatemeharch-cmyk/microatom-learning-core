import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, FileSpreadsheet, Info, Upload } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/admin/curriculum-import")({
  component: CurriculumImportPlaceholder,
});

const IMPORT_LEVELS = [
  "Grade",
  "Major",
  "Subject",
  "Chapter",
  "Section",
  "Atom",
  "MicroAtom",
  "Question",
] as const;

function CurriculumImportPlaceholder() {
  return (
    <div className="max-w-6xl space-y-6 p-6">
      <div>
        <Badge variant="secondary" className="mb-2">MVP scope</Badge>
        <h1 className="text-2xl font-bold tracking-tight">Import Curriculum CSV</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Prepare curriculum records for Grade 11 — Experimental Sciences without generating content automatically.
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Import is not enabled yet</AlertTitle>
        <AlertDescription>
          This page reserves the CSV workflow. No file is uploaded and no curriculum, MicroAtoms, or questions are created.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileSpreadsheet className="h-4 w-4 text-primary" />
            Import-ready hierarchy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {IMPORT_LEVELS.map((level, index) => (
              <div key={level} className="flex items-center gap-2">
                <span className="rounded-full border bg-muted/40 px-2.5 py-1 font-medium">{level}</span>
                {index < IMPORT_LEVELS.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-dashed p-8 text-center">
            <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium">CSV upload placeholder</p>
            <p className="mt-1 text-xs text-muted-foreground">
              A validated template and import controls will be added when curriculum data is ready.
            </p>
            <Button className="mt-4" disabled>
              Choose CSV file
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}