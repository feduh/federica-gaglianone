-- Add new columns
ALTER TABLE public.timeline_entries
  ADD COLUMN IF NOT EXISTS year_from integer,
  ADD COLUMN IF NOT EXISTS year_to integer,
  ADD COLUMN IF NOT EXISTS course_it text,
  ADD COLUMN IF NOT EXISTS course_en text,
  ADD COLUMN IF NOT EXISTS institution_it text,
  ADD COLUMN IF NOT EXISTS institution_en text;

-- Migrate data: year -> year_from, title split on em-dash or hyphen
UPDATE public.timeline_entries
SET
  year_from = COALESCE(year_from, year),
  year_to   = COALESCE(year_to, year),
  course_it = COALESCE(course_it,
    CASE WHEN position('—' in COALESCE(title_it,'')) > 0
         THEN btrim(split_part(title_it, '—', 1))
         ELSE COALESCE(title_it,'') END),
  course_en = COALESCE(course_en,
    CASE WHEN position('—' in COALESCE(title_en,'')) > 0
         THEN btrim(split_part(title_en, '—', 1))
         ELSE COALESCE(title_en,'') END),
  institution_it = COALESCE(institution_it,
    CASE WHEN position('—' in COALESCE(title_it,'')) > 0
         THEN btrim(split_part(title_it, '—', 2))
         ELSE '' END),
  institution_en = COALESCE(institution_en,
    CASE WHEN position('—' in COALESCE(title_en,'')) > 0
         THEN btrim(split_part(title_en, '—', 2))
         ELSE '' END);

-- Set defaults / not null on year_from
ALTER TABLE public.timeline_entries
  ALTER COLUMN year_from SET NOT NULL,
  ALTER COLUMN course_it SET DEFAULT '',
  ALTER COLUMN course_en SET DEFAULT '',
  ALTER COLUMN institution_it SET DEFAULT '',
  ALTER COLUMN institution_en SET DEFAULT '';

UPDATE public.timeline_entries
SET course_it = COALESCE(course_it,''),
    course_en = COALESCE(course_en,''),
    institution_it = COALESCE(institution_it,''),
    institution_en = COALESCE(institution_en,'');

ALTER TABLE public.timeline_entries
  ALTER COLUMN course_it SET NOT NULL,
  ALTER COLUMN course_en SET NOT NULL,
  ALTER COLUMN institution_it SET NOT NULL,
  ALTER COLUMN institution_en SET NOT NULL;

-- Drop legacy columns
ALTER TABLE public.timeline_entries
  DROP COLUMN IF EXISTS year,
  DROP COLUMN IF EXISTS title_it,
  DROP COLUMN IF EXISTS title_en;
