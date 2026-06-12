import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, BookOpen, Users, ShieldCheck, Settings } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Atomia — Personalized Learning Intelligence" },
      { name: "description", content: "Atomia adapts to every student's unique learning journey with its proprietary Turbo Engine." },
    ],
  }),
  component: Index,
});

const roles = [
  { to: "/student", label: "Student", desc: "Grow through personalized AtomBits", icon: GraduationCap },
  { to: "/teacher", label: "Teacher", desc: "Create content & track classes", icon: BookOpen },
  { to: "/parent", label: "Parent", desc: "Follow your child's progress", icon: Users },
  { to: "/supervisor", label: "Grade Supervisor", desc: "Oversee grade-wide performance", icon: ShieldCheck },
  { to: "/admin", label: "Admin", desc: "Manage platform & users", icon: Settings },
] as const;

function Index() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-10">
          <p className="text-sm text-muted-foreground">Atomia</p>
          <h1 className="text-4xl font-bold tracking-tight mt-2">Choose your dashboard</h1>
          <p className="text-muted-foreground mt-2">Personalized learning intelligence that adapts to every journey.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((r) => (
            <Link
              key={r.to}
              to={r.to}
              className="group rounded-lg border bg-card p-5 transition hover:border-primary hover:shadow-sm"
            >
              <r.icon className="h-6 w-6 text-primary" />
              <h2 className="mt-3 font-semibold">{r.label}</h2>
              <p className="text-sm text-muted-foreground mt-1">{r.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
