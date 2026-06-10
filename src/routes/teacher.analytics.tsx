import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/dashboard-shell";

export const Route = createFileRoute("/teacher/analytics")({
  component: () => (
    <PagePlaceholder title="Analytics" description="Mastery distribution and time-on-task across MicroAtoms." />
  ),
});
