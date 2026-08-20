BEGIN;

CREATE OR REPLACE FUNCTION public.ensure_invitation_theme_version()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  resolved_theme_id uuid;
  resolved_version_id uuid;
  version_fields jsonb;
  field jsonb;
  field_name text;
  field_required boolean;
  field_enabled boolean;
  theme_changed boolean;
BEGIN
  theme_changed := TG_OP = 'INSERT' OR NEW.theme_id IS DISTINCT FROM OLD.theme_id;

  IF NEW.theme_id IS NULL AND NEW.theme_version_id IS NOT NULL THEN
    SELECT tv.theme_id
      INTO resolved_theme_id
    FROM public.theme_versions tv
    WHERE tv.id = NEW.theme_version_id;

    IF resolved_theme_id IS NULL THEN
      RAISE EXCEPTION 'Invalid theme version: %', NEW.theme_version_id;
    END IF;

    NEW.theme_id := resolved_theme_id;
    theme_changed := true;
  END IF;

  IF NEW.theme_id IS NOT NULL THEN
    SELECT t.id
      INTO resolved_theme_id
    FROM public.themes t
    WHERE t.id = NEW.theme_id;

    IF resolved_theme_id IS NULL THEN
      RAISE EXCEPTION 'Invalid theme: %', NEW.theme_id;
    END IF;

    IF theme_changed THEN
      IF NOT EXISTS (
        SELECT 1
        FROM public.themes t
        WHERE t.id = NEW.theme_id
          AND t.is_active = true
      ) THEN
        RAISE EXCEPTION 'Selected theme is not active';
      END IF;

      IF auth.uid() IS NOT NULL
         AND NOT public.user_can_use_theme(auth.uid(), NEW.theme_id) THEN
        RAISE EXCEPTION 'Theme requires an active paid plan';
      END IF;
    END IF;
  END IF;

  IF TG_OP = 'UPDATE'
     AND NEW.theme_id = OLD.theme_id
     AND NEW.theme_version_id IS NULL THEN
    NEW.theme_version_id := OLD.theme_version_id;
  END IF;

  IF TG_OP = 'UPDATE'
     AND NEW.theme_id = OLD.theme_id
     AND NEW.theme_version_id IS DISTINCT FROM OLD.theme_version_id THEN
    RAISE EXCEPTION 'Theme version cannot be changed without changing the theme';
  END IF;

  IF NEW.theme_id IS NOT NULL AND NEW.theme_version_id IS NOT NULL THEN
    SELECT tv.theme_id, tv.fields_schema
      INTO resolved_theme_id, version_fields
    FROM public.theme_versions tv
    WHERE tv.id = NEW.theme_version_id;

    IF resolved_theme_id IS NULL THEN
      RAISE EXCEPTION 'Invalid theme version: %', NEW.theme_version_id;
    END IF;

    IF resolved_theme_id <> NEW.theme_id THEN
      RAISE EXCEPTION 'Theme version does not belong to selected theme';
    END IF;

    IF theme_changed THEN
      IF NOT EXISTS (
        SELECT 1
        FROM public.theme_versions tv
        WHERE tv.id = NEW.theme_version_id
          AND tv.is_published = true
          AND tv.lifecycle_status = 'published'
      ) THEN
        RAISE EXCEPTION 'Selected theme version must be a published version of the selected theme';
      END IF;
    ELSIF TG_OP = 'INSERT' THEN
      RAISE EXCEPTION 'Selected theme version must be a published version of the selected theme';
    END IF;
  END IF;

  IF NEW.theme_id IS NOT NULL AND NEW.theme_version_id IS NULL THEN
    SELECT tv.id, tv.fields_schema
      INTO resolved_version_id, version_fields
    FROM public.theme_versions tv
    WHERE tv.theme_id = NEW.theme_id
      AND tv.is_published = true
      AND tv.lifecycle_status = 'published'
    ORDER BY tv.version DESC
    LIMIT 1;

    IF resolved_version_id IS NULL THEN
      RAISE EXCEPTION 'No published theme version exists for theme %', NEW.theme_id;
    END IF;

    NEW.theme_version_id := resolved_version_id;
  END IF;

  IF NEW.theme_version_id IS NOT NULL AND version_fields IS NULL THEN
    SELECT tv.fields_schema
      INTO version_fields
    FROM public.theme_versions tv
    WHERE tv.id = NEW.theme_version_id;
  END IF;

  IF version_fields IS NOT NULL
     AND jsonb_typeof(version_fields) = 'array' THEN
    FOR field IN
      SELECT value
      FROM jsonb_array_elements(version_fields)
    LOOP
      field_name := field->>'name';
      field_required := coalesce((field->>'required')::boolean, false);
      field_enabled := coalesce((field->>'enabled')::boolean, true);

      IF field_required
         AND field_enabled
         AND (
           NEW.custom_data IS NULL
           OR nullif(btrim(coalesce(NEW.custom_data->>field_name, '')), '') IS NULL
         ) THEN
        RAISE EXCEPTION 'Required theme field is missing: %', field_name;
      END IF;
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$;

-- Existing invitations may legitimately point to archived snapshots.
-- New theme selections may only point to published versions, and an existing
-- invitation cannot swap its pinned version without changing its theme.

COMMIT;
