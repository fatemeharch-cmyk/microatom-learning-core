import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/dashboard-shell";

export const Route = createFileRoute("/teacher/classrooms")({
  component: () => (
    <PagePlaceholder title="Classrooms" description="Manage your classes, rosters and assignments." />
  ),
});
