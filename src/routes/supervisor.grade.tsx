import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/dashboard-shell";

export const Route = createFileRoute("/supervisor/grade")({
  component: () => (
    <PagePlaceholder title="Grade overview" description="All classrooms in your assigned grade level." />
  ),
});
