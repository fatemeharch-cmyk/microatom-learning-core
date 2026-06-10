import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/dashboard-shell";

export const Route = createFileRoute("/admin/roles")({
  component: () => (
    <PagePlaceholder title="Roles & permissions" description="Manage role assignments and access policies." />
  ),
});
