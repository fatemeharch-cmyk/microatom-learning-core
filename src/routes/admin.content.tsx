import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/dashboard-shell";

export const Route = createFileRoute("/admin/content")({
  component: () => (
    <PagePlaceholder title="Content library" description="Global subjects, chapters, topics, atoms and MicroAtoms." />
  ),
});
