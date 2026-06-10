import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/dashboard-shell";

export const Route = createFileRoute("/supervisor/alerts")({
  component: () => (
    <PagePlaceholder title="Alerts" description="Struggling students and intervention recommendations." />
  ),
});
