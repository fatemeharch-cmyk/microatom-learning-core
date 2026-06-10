import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/dashboard-shell";

export const Route = createFileRoute("/student/lessons")({
  component: () => (
    <PagePlaceholder title="Lessons" description="Browse subjects, chapters, topics, atoms and MicroAtoms." />
  ),
});
