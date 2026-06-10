import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/dashboard-shell";

export const Route = createFileRoute("/admin/users")({
  component: () => (
    <PagePlaceholder title="Users" description="All students, teachers, parents and supervisors." />
  ),
});
