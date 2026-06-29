import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  Home,
  Stethoscope,
  HeartPulse,
  ScanLine,
  NotebookPen,
  ShieldCheck,
  CalendarCheck2,
  Compass,
  Target,
  FolderHeart,
  Trophy,
  Beaker,
} from "lucide-react";
import { StudentShell, type NavItem } from "@/components/student/student-shell";
import { useHealthGlossary } from "@/lib/health-glossary";
import { useTheme, resolveIcon } from "@/lib/theme";

const medicalItems: NavItem[] = [
  { title: "کلینیک من", url: "/student", icon: Home },
  { title: "زیست فصل ۱", url: "/student/biology-ch1", icon: Beaker },
  { title: "شرح حال", url: "/student/profile", icon: Stethoscope },
  { title: "نبض دانش", url: "/student/progress", icon: HeartPulse },
  { title: "اسکن", url: "/student/tracking", icon: ScanLine },
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
  const { theme } = useTheme();

  // Priority: Atomia Theme Engine menus → Health glossary → defaults.
  let items: NavItem[];
  const sidebar = theme?.menus?.sidebar;
  if (sidebar && sidebar.length > 0) {
    items = sidebar.map((m) => ({
      title: m.title,
      url: m.url,
      icon: resolveIcon(m.icon),
    }));
  } else {
    items = studentItems ?? medicalItems;
  }

  return (
    <StudentShell items={items}>
      <Outlet />
    </StudentShell>
  );
}

export const Route = createFileRoute("/student")({
  component: StudentLayout,
});
