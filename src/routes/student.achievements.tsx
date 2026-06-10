import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/dashboard-shell";

export const Route = createFileRoute("/student/achievements")({
  component: () => (
    <PagePlaceholder title="Achievements" description="Badges, streaks and milestones earned through MicroAtom mastery." />
  ),
});
