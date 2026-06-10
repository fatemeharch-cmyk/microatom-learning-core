import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/dashboard-shell";

export const Route = createFileRoute("/teacher/content")({
  component: () => (
    <PagePlaceholder title="Content authoring" description="Create and curate Atoms, MicroAtoms and Questions." />
  ),
});
