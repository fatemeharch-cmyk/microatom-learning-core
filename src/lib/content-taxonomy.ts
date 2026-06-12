/**
 * Content Taxonomy
 *
 * Canonical 9-level hierarchy used across the entire platform:
 *
 *   EducationLevel → Grade → Major → Subject → Chapter → Section → Atom → MicroAtom → Question
 *
 * v1 release ships ONLY with Grade 11 — Experimental Sciences content active.
 * Future levels, grades, and majors are intentionally not seeded. They can be
 * added as data later without changing this model or the surrounding UI.
 *
 * Stable string IDs (slugs) are used everywhere so DB rows, AI prompts,
 * analytics events, and URLs remain portable.
 */

export type ID = string;

export interface EducationLevel {
  id: ID;            // e.g. "secondary"
  nameFa: string;
  nameEn: string;
  active: boolean;
}

export interface Grade {
  id: ID;            // e.g. "g11"
  levelId: ID;
  nameFa: string;
  nameEn: string;
  order: number;
  active: boolean;
}

export interface Major {
  id: ID;            // e.g. "experimental"
  gradeId: ID;
  nameFa: string;
  nameEn: string;
  active: boolean;
}

export interface Subject {
  id: ID;            // e.g. "biology-11-exp"
  majorId: ID;
  nameFa: string;
  nameEn: string;
  color?: string;    // hex / token for UI accents
  active: boolean;
}

export interface Chapter {
  id: ID;
  subjectId: ID;
  nameFa: string;
  nameEn: string;
  order: number;
}

export interface Section {
  id: ID;
  chapterId: ID;
  nameFa: string;
  nameEn: string;
  order: number;
}

export interface Atom {
  id: ID;
  sectionId: ID;
  nameFa: string;
  nameEn: string;
  order: number;
}

export interface MicroAtom {
  id: ID;
  atomId: ID;
  nameFa: string;
  nameEn: string;
  /** estimated minutes to master */
  estMinutes?: number;
  /** difficulty 1..5 */
  difficulty?: number;
}

export interface Question {
  id: ID;
  microAtomId: ID;
  prompt: string;
  difficulty?: number;
}

// ---------------------------------------------------------------------------
// v1 catalog — only Grade 11 Experimental Sciences is seeded and visible.
// Future scopes are added as records, not hard-coded placeholders.
// ---------------------------------------------------------------------------

export const educationLevels: EducationLevel[] = [
  { id: "secondary", nameFa: "متوسطه دوم",  nameEn: "High School",    active: true  },
];

export const grades: Grade[] = [
  { id: "g11", levelId: "secondary", nameFa: "پایه یازدهم", nameEn: "Grade 11", order: 11, active: true  },
];

export const majors: Major[] = [
  { id: "experimental", gradeId: "g11", nameFa: "علوم تجربی", nameEn: "Experimental Sciences", active: true },
];

// Subjects for Grade 11 — Experimental (the v1 active set).
export const subjects: Subject[] = [
  { id: "biology-11-exp",   majorId: "experimental", nameFa: "زیست‌شناسی ۲", nameEn: "Biology 2",   color: "#16a34a", active: true },
  { id: "chemistry-11-exp", majorId: "experimental", nameFa: "شیمی ۲",       nameEn: "Chemistry 2", color: "#0ea5e9", active: true },
  { id: "physics-11-exp",   majorId: "experimental", nameFa: "فیزیک ۲",      nameEn: "Physics 2",   color: "#f59e0b", active: true },
  { id: "math-11-exp",      majorId: "experimental", nameFa: "ریاضی ۲",      nameEn: "Math 2",      color: "#8b5cf6", active: true },
  { id: "literature-11",    majorId: "experimental", nameFa: "ادبیات فارسی", nameEn: "Literature",  color: "#ef4444", active: true },
  { id: "english-11",       majorId: "experimental", nameFa: "زبان انگلیسی", nameEn: "English",     color: "#06b6d4", active: true },
];

// A representative chapter/section/atom/microatom tree for Biology 2 to make
// the architecture concrete. Other subjects use the same schema — content
// is added incrementally without code changes.
export const chapters: Chapter[] = [
  { id: "bio11-ch1", subjectId: "biology-11-exp", nameFa: "تنظیم عصبی",    nameEn: "Neural Regulation",  order: 1 },
  { id: "bio11-ch2", subjectId: "biology-11-exp", nameFa: "حواس",          nameEn: "Senses",             order: 2 },
  { id: "bio11-ch3", subjectId: "biology-11-exp", nameFa: "دستگاه حرکتی",  nameEn: "Musculoskeletal",    order: 3 },
  { id: "chem11-ch1", subjectId: "chemistry-11-exp", nameFa: "قدر هدایای زمینی", nameEn: "Earthly Gifts", order: 1 },
  { id: "phy11-ch1",  subjectId: "physics-11-exp",   nameFa: "الکتریسیته ساکن", nameEn: "Electrostatics", order: 1 },
];

export const sections: Section[] = [
  { id: "bio11-ch1-t1", chapterId: "bio11-ch1", nameFa: "یاخته عصبی",        nameEn: "The Neuron",         order: 1 },
  { id: "bio11-ch1-t2", chapterId: "bio11-ch1", nameFa: "پیام عصبی",         nameEn: "Nerve Impulse",      order: 2 },
  { id: "bio11-ch1-t3", chapterId: "bio11-ch1", nameFa: "سیناپس",            nameEn: "Synapse",            order: 3 },
];

export const atoms: Atom[] = [
  { id: "bio11-ch1-t1-a1", sectionId: "bio11-ch1-t1", nameFa: "ساختار نورون",       nameEn: "Neuron Structure",  order: 1 },
  { id: "bio11-ch1-t1-a2", sectionId: "bio11-ch1-t1", nameFa: "انواع نورون",        nameEn: "Types of Neurons",  order: 2 },
  { id: "bio11-ch1-t2-a1", sectionId: "bio11-ch1-t2", nameFa: "پتانسیل آرامش",      nameEn: "Resting Potential", order: 1 },
  { id: "bio11-ch1-t2-a2", sectionId: "bio11-ch1-t2", nameFa: "پتانسیل عمل",        nameEn: "Action Potential",  order: 2 },
];

export const microAtoms: MicroAtom[] = [
  { id: "ma-neuron-soma",       atomId: "bio11-ch1-t1-a1", nameFa: "جسم سلولی نورون", nameEn: "Soma",            estMinutes: 6,  difficulty: 1 },
  { id: "ma-neuron-dendrite",   atomId: "bio11-ch1-t1-a1", nameFa: "دندریت",          nameEn: "Dendrite",        estMinutes: 5,  difficulty: 1 },
  { id: "ma-neuron-axon",       atomId: "bio11-ch1-t1-a1", nameFa: "آکسون",           nameEn: "Axon",            estMinutes: 7,  difficulty: 2 },
  { id: "ma-neuron-myelin",     atomId: "bio11-ch1-t1-a1", nameFa: "غلاف میلین",      nameEn: "Myelin Sheath",   estMinutes: 8,  difficulty: 3 },
  { id: "ma-rest-potential-na", atomId: "bio11-ch1-t2-a1", nameFa: "نقش سدیم-پتاسیم", nameEn: "Na⁺/K⁺ Pump",     estMinutes: 10, difficulty: 4 },
  { id: "ma-action-threshold",  atomId: "bio11-ch1-t2-a2", nameFa: "آستانه تحریک",    nameEn: "Firing Threshold", estMinutes: 9, difficulty: 4 },
];

// ---------------------------------------------------------------------------
// Active scope — v1 default for the whole app.
// All feature modules (planner, exams, homework, analytics, AI) read from
// this object so when we add Grade 10 or Math major we just change the scope
// rather than touching feature code.
// ---------------------------------------------------------------------------

export interface ActiveScope {
  levelId: ID;
  gradeId: ID;
  majorId: ID;
}

export const DEFAULT_ACTIVE_SCOPE: ActiveScope = {
  levelId: "secondary",
  gradeId: "g11",
  majorId: "experimental",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export const byId = <T extends { id: ID }>(arr: T[], id: ID) => arr.find((x) => x.id === id);

export function subjectsForScope(scope: ActiveScope = DEFAULT_ACTIVE_SCOPE) {
  return subjects.filter((s) => s.majorId === scope.majorId && s.active);
}
export function chaptersForSubject(subjectId: ID) {
  return chapters.filter((c) => c.subjectId === subjectId).sort((a, b) => a.order - b.order);
}
export function sectionsForChapter(chapterId: ID) {
  return sections.filter((section) => section.chapterId === chapterId).sort((a, b) => a.order - b.order);
}
export function atomsForSection(sectionId: ID) {
  return atoms.filter((atom) => atom.sectionId === sectionId).sort((x, y) => x.order - y.order);
}
export function microAtomsForAtom(atomId: ID) {
  return microAtoms.filter((m) => m.atomId === atomId);
}

export const HIERARCHY_LEVELS = [
  "Education Level",
  "Grade",
  "Major",
  "Subject",
  "Chapter",
  "Section",
  "Atom",
  "MicroAtom",
  "Question",
] as const;

export const HIERARCHY_LEVELS_FA = [
  "مقطع تحصیلی",
  "پایه",
  "رشته",
  "درس",
  "فصل",
  "گفتار",
  "اتم",
  "میکرواتم",
  "سؤال",
] as const;
