import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/dashboard-shell";

export const Route = createFileRoute("/student/lessons")({
  component: () => (
    <PagePlaceholder title="Lessons" description="Explore subjects, chapters, topics, and AtomBits at your own pace." />
  ),
});
