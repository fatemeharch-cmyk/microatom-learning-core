import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/dashboard-shell";

export const Route = createFileRoute("/teacher/students")({
  component: () => (
    <PagePlaceholder title="Students" description="Individual learner progress and intervention flags." />
  ),
});
