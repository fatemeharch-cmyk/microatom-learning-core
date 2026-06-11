
-- Shared timestamp trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- 1. EDUCATION LEVELS
CREATE TABLE public.education_levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name_fa text NOT NULL,
  name_en text,
  order_index int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.education_levels TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.education_levels TO authenticated;
GRANT ALL ON public.education_levels TO service_role;
ALTER TABLE public.education_levels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read all" ON public.education_levels FOR SELECT USING (true);
CREATE POLICY "auth write" ON public.education_levels FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_education_levels_updated BEFORE UPDATE ON public.education_levels FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 2. GRADES
CREATE TABLE public.grades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name_fa text NOT NULL,
  name_en text,
  education_level_id uuid NOT NULL REFERENCES public.education_levels(id) ON DELETE CASCADE,
  order_index int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_grades_level ON public.grades(education_level_id);
GRANT SELECT ON public.grades TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.grades TO authenticated;
GRANT ALL ON public.grades TO service_role;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read all" ON public.grades FOR SELECT USING (true);
CREATE POLICY "auth write" ON public.grades FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_grades_updated BEFORE UPDATE ON public.grades FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3. MAJORS
CREATE TABLE public.majors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name_fa text NOT NULL,
  name_en text,
  grade_id uuid NOT NULL REFERENCES public.grades(id) ON DELETE CASCADE,
  is_active boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_majors_grade ON public.majors(grade_id);
GRANT SELECT ON public.majors TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.majors TO authenticated;
GRANT ALL ON public.majors TO service_role;
ALTER TABLE public.majors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read all" ON public.majors FOR SELECT USING (true);
CREATE POLICY "auth write" ON public.majors FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_majors_updated BEFORE UPDATE ON public.majors FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4. SUBJECTS
CREATE TABLE public.subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name_fa text NOT NULL,
  name_en text,
  major_id uuid NOT NULL REFERENCES public.majors(id) ON DELETE CASCADE,
  color text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_subjects_major ON public.subjects(major_id);
GRANT SELECT ON public.subjects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subjects TO authenticated;
GRANT ALL ON public.subjects TO service_role;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read all" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "auth write" ON public.subjects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_subjects_updated BEFORE UPDATE ON public.subjects FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5. CHAPTERS
CREATE TABLE public.chapters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  title_fa text NOT NULL,
  title_en text,
  subject_id uuid NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  order_index int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_chapters_subject ON public.chapters(subject_id);
GRANT SELECT ON public.chapters TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chapters TO authenticated;
GRANT ALL ON public.chapters TO service_role;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read all" ON public.chapters FOR SELECT USING (true);
CREATE POLICY "auth write" ON public.chapters FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_chapters_updated BEFORE UPDATE ON public.chapters FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 6. SECTIONS (Goftar)
CREATE TABLE public.sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  title_fa text NOT NULL,
  title_en text,
  chapter_id uuid NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  order_index int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_sections_chapter ON public.sections(chapter_id);
GRANT SELECT ON public.sections TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sections TO authenticated;
GRANT ALL ON public.sections TO service_role;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read all" ON public.sections FOR SELECT USING (true);
CREATE POLICY "auth write" ON public.sections FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_sections_updated BEFORE UPDATE ON public.sections FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 7. ATOMS
CREATE TABLE public.atoms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  title_fa text NOT NULL,
  title_en text,
  section_id uuid NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  order_index int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_atoms_section ON public.atoms(section_id);
GRANT SELECT ON public.atoms TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.atoms TO authenticated;
GRANT ALL ON public.atoms TO service_role;
ALTER TABLE public.atoms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read all" ON public.atoms FOR SELECT USING (true);
CREATE POLICY "auth write" ON public.atoms FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_atoms_updated BEFORE UPDATE ON public.atoms FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 8. MICRO ATOMS
CREATE TABLE public.micro_atoms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  title_fa text NOT NULL,
  title_en text,
  description text,
  parent_atom_id uuid NOT NULL REFERENCES public.atoms(id) ON DELETE CASCADE,
  section_id uuid REFERENCES public.sections(id) ON DELETE SET NULL,
  chapter_id uuid REFERENCES public.chapters(id) ON DELETE SET NULL,
  subject_id uuid REFERENCES public.subjects(id) ON DELETE SET NULL,
  grade_id uuid REFERENCES public.grades(id) ON DELETE SET NULL,
  major_id uuid REFERENCES public.majors(id) ON DELETE SET NULL,
  difficulty_level int NOT NULL DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
  estimated_study_time int NOT NULL DEFAULT 0,
  prerequisites uuid[] NOT NULL DEFAULT '{}',
  learning_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_micro_atoms_parent ON public.micro_atoms(parent_atom_id);
CREATE INDEX idx_micro_atoms_subject ON public.micro_atoms(subject_id);
GRANT SELECT ON public.micro_atoms TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.micro_atoms TO authenticated;
GRANT ALL ON public.micro_atoms TO service_role;
ALTER TABLE public.micro_atoms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read all" ON public.micro_atoms FOR SELECT USING (true);
CREATE POLICY "auth write" ON public.micro_atoms FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_micro_atoms_updated BEFORE UPDATE ON public.micro_atoms FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 9. QUESTIONS
CREATE TABLE public.questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  micro_atom_id uuid NOT NULL REFERENCES public.micro_atoms(id) ON DELETE CASCADE,
  prompt text NOT NULL,
  options jsonb,
  answer text,
  explanation text,
  difficulty_level int NOT NULL DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
  estimated_time int NOT NULL DEFAULT 60,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_questions_micro_atom ON public.questions(micro_atom_id);
GRANT SELECT ON public.questions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.questions TO authenticated;
GRANT ALL ON public.questions TO service_role;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read all" ON public.questions FOR SELECT USING (true);
CREATE POLICY "auth write" ON public.questions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_questions_updated BEFORE UPDATE ON public.questions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
