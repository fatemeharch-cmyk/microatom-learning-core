import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/dashboard-shell";

export const Route = createFileRoute("/supervisor/analytics")({
  component: () => (
    <PagePlaceholder title="Turbo Analytics" description="Growth trends and learning opportunities across subjects, classrooms, and time." />
  ),
});
