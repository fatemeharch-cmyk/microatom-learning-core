import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  Home,
  Stethoscope,
  HeartPulse,
  ScanLine,
  NotebookPen,
  ScrollText,
  ShieldCheck,
  CalendarCheck2,
  Compass,
  Target,
  FolderHeart,
  Trophy,
} from "lucide-react";
import { StudentShell, type NavItem } from "@/components/student/student-shell";
import { useHealthGlossary } from "@/lib/health-glossary";

const medicalItems: NavItem[] = [
  { title: "کلینیک من", url: "/student", icon: Home },
  { title: "شرح حال", url: "/student/profile", icon: Stethoscope },
  { title: "نبض دانش", url: "/student/progress", icon: HeartPulse },
  { title: "اسکن و نسخه", url: "/student/tracking", icon: ScanLine },
  { title: "کلینیک یادگیری", url: "/student/notebook", icon: NotebookPen },
  { title: "مراقبت", url: "/student/schedule", icon: ShieldCheck },
  { title: "چکاب", url: "/student/exams", icon: CalendarCheck2 },
  { title: "کاوش", url: "/student/analytics", icon: Compass },
  { title: "ماموریت", url: "/student/homework", icon: Target },
  { title: "پرونده رشد", url: "/student/growth", icon: FolderHeart },
];

void Trophy;

function StudentLayout() {
  const { studentItems } = useHealthGlossary();
  const items: NavItem[] = studentItems ?? medicalItems;
  return (
    <StudentShell items={items}>
      <Outlet />
    </StudentShell>
  );
}

export const Route = createFileRoute("/student")({
  component: StudentLayout,
});
