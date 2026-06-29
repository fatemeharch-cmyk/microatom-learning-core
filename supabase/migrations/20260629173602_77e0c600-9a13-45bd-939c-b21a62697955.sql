
-- Move has_role out of the exposed public schema into a private schema
CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

-- Recreate curriculum admin-write policies to use private.has_role
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['atoms','chapters','education_levels','grades','majors','micro_atoms','questions','sections','subjects']
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "admin write" ON public.%I', t);
    EXECUTE format(
      'CREATE POLICY "admin write" ON public.%I FOR ALL TO authenticated USING (private.has_role(auth.uid(), ''admin''::public.app_role)) WITH CHECK (private.has_role(auth.uid(), ''admin''::public.app_role))',
      t
    );
  END LOOP;
END $$;

-- Drop the public-schema version now that nothing references it
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
