
-- ============ ROLES ============
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
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

-- ============ UPDATED_AT TRIGGER HELPER ============
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

-- ============ PROFILE (single row) ============
CREATE TABLE public.profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  bio_it text NOT NULL DEFAULT '',
  bio_en text NOT NULL DEFAULT '',
  seeking_it text NOT NULL DEFAULT '',
  seeking_en text NOT NULL DEFAULT '',
  interests jsonb NOT NULL DEFAULT '[]'::jsonb,
  avatar_url text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.profile TO anon, authenticated;
GRANT ALL ON public.profile TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.profile TO authenticated;

ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profile public read" ON public.profile FOR SELECT USING (true);
CREATE POLICY "profile admin write insert" ON public.profile FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "profile admin write update" ON public.profile FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "profile admin write delete" ON public.profile FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER profile_updated_at BEFORE UPDATE ON public.profile
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ SOCIALS ============
CREATE TABLE public.socials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  href text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.socials TO anon, authenticated;
GRANT ALL ON public.socials TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.socials TO authenticated;
ALTER TABLE public.socials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "socials public read" ON public.socials FOR SELECT USING (true);
CREATE POLICY "socials admin insert" ON public.socials FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "socials admin update" ON public.socials FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "socials admin delete" ON public.socials FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER socials_updated_at BEFORE UPDATE ON public.socials
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ UI STRINGS ============
CREATE TABLE public.ui_strings (
  key text PRIMARY KEY,
  value_it text NOT NULL DEFAULT '',
  value_en text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.ui_strings TO anon, authenticated;
GRANT ALL ON public.ui_strings TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.ui_strings TO authenticated;
ALTER TABLE public.ui_strings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ui_strings public read" ON public.ui_strings FOR SELECT USING (true);
CREATE POLICY "ui_strings admin insert" ON public.ui_strings FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "ui_strings admin update" ON public.ui_strings FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "ui_strings admin delete" ON public.ui_strings FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER ui_strings_updated_at BEFORE UPDATE ON public.ui_strings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ TIMELINE ============
CREATE TABLE public.timeline_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year int NOT NULL,
  title_it text NOT NULL DEFAULT '',
  title_en text NOT NULL DEFAULT '',
  body_it text NOT NULL DEFAULT '',
  body_en text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.timeline_entries TO anon, authenticated;
GRANT ALL ON public.timeline_entries TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.timeline_entries TO authenticated;
ALTER TABLE public.timeline_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "timeline public read" ON public.timeline_entries FOR SELECT USING (true);
CREATE POLICY "timeline admin insert" ON public.timeline_entries FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "timeline admin update" ON public.timeline_entries FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "timeline admin delete" ON public.timeline_entries FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER timeline_updated_at BEFORE UPDATE ON public.timeline_entries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ RESEARCH DIRECTIONS ============
CREATE TABLE public.research_directions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_it text NOT NULL DEFAULT '',
  title_en text NOT NULL DEFAULT '',
  body_it text NOT NULL DEFAULT '',
  body_en text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.research_directions TO anon, authenticated;
GRANT ALL ON public.research_directions TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.research_directions TO authenticated;
ALTER TABLE public.research_directions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "research public read" ON public.research_directions FOR SELECT USING (true);
CREATE POLICY "research admin insert" ON public.research_directions FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "research admin update" ON public.research_directions FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "research admin delete" ON public.research_directions FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER research_updated_at BEFORE UPDATE ON public.research_directions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ ADMIN WRITE POLICIES ON EXISTING TABLES ============
CREATE POLICY "projects admin insert" ON public.projects FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "projects admin update" ON public.projects FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "projects admin delete" ON public.projects FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
GRANT INSERT, UPDATE, DELETE ON public.projects TO authenticated;

CREATE POLICY "publications admin insert" ON public.publications FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "publications admin update" ON public.publications FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "publications admin delete" ON public.publications FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
GRANT INSERT, UPDATE, DELETE ON public.publications TO authenticated;

CREATE POLICY "tags admin insert" ON public.tags FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "tags admin update" ON public.tags FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "tags admin delete" ON public.tags FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
GRANT INSERT, UPDATE, DELETE ON public.tags TO authenticated;

CREATE POLICY "project_tags admin insert" ON public.project_tags FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "project_tags admin delete" ON public.project_tags FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
GRANT INSERT, UPDATE, DELETE ON public.project_tags TO authenticated;

CREATE POLICY "publication_tags admin insert" ON public.publication_tags FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "publication_tags admin delete" ON public.publication_tags FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
GRANT INSERT, UPDATE, DELETE ON public.publication_tags TO authenticated;
