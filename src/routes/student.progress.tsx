import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/dashboard-shell";

export const Route = createFileRoute("/student/progress")({
  component: () => (
    <PagePlaceholder title="Progress" description="Mastery levels across MicroAtoms, with adaptive recommendations." />
  ),
});
