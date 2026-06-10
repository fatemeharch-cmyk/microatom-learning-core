import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/dashboard-shell";

export const Route = createFileRoute("/supervisor/analytics")({
  component: () => (
    <PagePlaceholder title="Analytics" description="Trends across subjects, classrooms and time." />
  ),
});
