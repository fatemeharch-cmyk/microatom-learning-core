import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/dashboard-shell";

export const Route = createFileRoute("/supervisor/alerts")({
  component: () => (
    <PagePlaceholder title="Growth Alerts" description="Students who may benefit from support and Turbo Recommendations." />
  ),
});
