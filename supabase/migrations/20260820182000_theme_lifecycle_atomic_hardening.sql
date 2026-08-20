-- NikahLink theme lifecycle hardening applied to project vyjqubgkkpapsovnrnab on 2026-08-20.
-- Keeps theme slugs independent from compiled renderer keys, makes draft editing safe,
-- enforces one draft/one published version per theme, and makes publish atomic.

ALTER TABLE public.themes
  DROP CONSTRAINT IF EXISTS themes_active_slug_component_key_check;

ALTER TABLE public.themes
  ADD CONSTRAINT themes_active_slug_component_key_check
  CHECK (
    NOT is_active
    OR (
      slug IS NOT NULL AND btrim(slug) <> ''
      AND component_key IS NOT NULL AND btrim(component_key) <> ''
    )
  );

CREATE UNIQUE INDEX IF NOT EXISTS theme_versions_one_draft_per_theme_idx
  ON public.theme_versions(theme_id)
  WHERE lifecycle_status = 'draft' AND is_published = false;

CREATE OR REPLACE FUNCTION public.protect_theme_version_snapshot()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF NEW.theme_id IS DISTINCT FROM OLD.theme_id
      OR NEW.version IS DISTINCT FROM OLD.version
      OR NEW.component_key IS DISTINCT FROM OLD.component_key
      OR NEW.created_at IS DISTINCT FROM OLD.created_at THEN
      RAISE EXCEPTION 'Theme version identity is immutable';
    END IF;

    IF OLD.lifecycle_status <> 'draft'
      AND (
        NEW.config IS DISTINCT FROM OLD.config
        OR NEW.fields_schema IS DISTINCT FROM OLD.fields_schema
        OR NEW.colors IS DISTINCT FROM OLD.colors
        OR NEW.assets IS DISTINCT FROM OLD.assets
        OR NEW.fields_schema_authoritative IS DISTINCT FROM OLD.fields_schema_authoritative
      ) THEN
      RAISE EXCEPTION 'Published and archived theme snapshots are immutable';
    END IF;

    RETURN NEW;
  END IF;

  RAISE EXCEPTION 'Theme versions can only be updated';
END;
$$;

DROP FUNCTION IF EXISTS public.create_theme_version_draft(uuid,text,jsonb,jsonb,jsonb,jsonb);
CREATE FUNCTION public.create_theme_version_draft(
  p_theme_id uuid,
  p_component_key text,
  p_config jsonb DEFAULT '{}'::jsonb,
  p_fields_schema jsonb DEFAULT '[]'::jsonb,
  p_colors jsonb DEFAULT '{}'::jsonb,
  p_assets jsonb DEFAULT '{}'::jsonb
)
RETURNS public.theme_versions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_next integer;
  v_row public.theme_versions;
  v_fields_schema jsonb;
BEGIN
  IF NOT public.is_super_admin() THEN RAISE EXCEPTION 'Forbidden'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.themes WHERE id = p_theme_id) THEN RAISE EXCEPTION 'Theme not found'; END IF;
  IF p_component_key IS NULL OR btrim(p_component_key) = '' THEN RAISE EXCEPTION 'component_key is required'; END IF;
  IF jsonb_typeof(coalesce(p_fields_schema, '[]'::jsonb)) <> 'array' THEN RAISE EXCEPTION 'fields_schema must be a JSON array'; END IF;
  IF EXISTS (
    SELECT 1 FROM public.theme_versions
    WHERE theme_id = p_theme_id AND lifecycle_status = 'draft' AND is_published = false
  ) THEN
    RAISE EXCEPTION 'A draft theme version already exists';
  END IF;

  v_fields_schema := coalesce(p_fields_schema, '[]'::jsonb);
  SELECT coalesce(max(version), 0) + 1 INTO v_next
  FROM public.theme_versions WHERE theme_id = p_theme_id;

  INSERT INTO public.theme_versions(
    theme_id, version, component_key, config, fields_schema,
    fields_schema_authoritative, colors, assets, is_published, lifecycle_status
  )
  VALUES(
    p_theme_id, v_next, p_component_key, coalesce(p_config, '{}'::jsonb),
    v_fields_schema, true, coalesce(p_colors, '{}'::jsonb),
    coalesce(p_assets, '{}'::jsonb), false, 'draft'
  )
  RETURNING * INTO v_row;

  RETURN v_row;
END;
$$;

REVOKE ALL ON FUNCTION public.create_theme_version_draft(uuid,text,jsonb,jsonb,jsonb,jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_theme_version_draft(uuid,text,jsonb,jsonb,jsonb,jsonb) TO authenticated;

CREATE OR REPLACE FUNCTION public.update_theme_draft(
  p_version_id uuid,
  p_component_key text,
  p_config jsonb DEFAULT '{}'::jsonb,
  p_fields_schema jsonb DEFAULT '[]'::jsonb,
  p_colors jsonb DEFAULT '{}'::jsonb,
  p_assets jsonb DEFAULT '{}'::jsonb
)
RETURNS public.theme_versions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_row public.theme_versions;
BEGIN
  IF NOT public.is_super_admin() THEN RAISE EXCEPTION 'Forbidden'; END IF;
  IF p_fields_schema IS NULL OR jsonb_typeof(p_fields_schema) <> 'array' THEN RAISE EXCEPTION 'fields_schema must be a JSON array'; END IF;

  SELECT * INTO v_row FROM public.theme_versions WHERE id = p_version_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Theme version not found'; END IF;
  IF v_row.is_published OR v_row.lifecycle_status <> 'draft' THEN RAISE EXCEPTION 'Only draft theme versions can be edited'; END IF;
  IF p_component_key IS DISTINCT FROM v_row.component_key THEN RAISE EXCEPTION 'Draft component_key cannot be changed'; END IF;

  UPDATE public.theme_versions
  SET config = coalesce(p_config, '{}'::jsonb),
      fields_schema = p_fields_schema,
      fields_schema_authoritative = true,
      colors = coalesce(p_colors, '{}'::jsonb),
      assets = coalesce(p_assets, '{}'::jsonb),
      is_published = false,
      lifecycle_status = 'draft'
  WHERE id = p_version_id
  RETURNING * INTO v_row;

  RETURN v_row;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_theme_and_draft(
  p_version_id uuid,
  p_name text,
  p_category text,
  p_is_premium boolean,
  p_thumbnail_url text,
  p_config jsonb,
  p_fields_schema jsonb,
  p_colors jsonb,
  p_assets jsonb
)
RETURNS public.theme_versions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_version public.theme_versions;
BEGIN
  IF NOT public.is_super_admin() THEN RAISE EXCEPTION 'Forbidden'; END IF;
  IF p_name IS NULL OR btrim(p_name) = '' THEN RAISE EXCEPTION 'Theme name is required'; END IF;
  IF p_category IS NULL OR p_category NOT IN ('minimalis','floral','elegan','budaya','dark','romantic') THEN RAISE EXCEPTION 'Invalid theme category'; END IF;
  IF p_fields_schema IS NULL OR jsonb_typeof(p_fields_schema) <> 'array' THEN RAISE EXCEPTION 'fields_schema must be a JSON array'; END IF;

  SELECT * INTO v_version FROM public.theme_versions WHERE id = p_version_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Theme version not found'; END IF;
  IF v_version.is_published OR v_version.lifecycle_status <> 'draft' THEN RAISE EXCEPTION 'Only draft theme versions can be edited'; END IF;

  PERFORM set_config('nikahlink.skip_theme_snapshot', '1', true);

  UPDATE public.themes
  SET name = btrim(p_name), category = p_category,
      thumbnail_url = p_thumbnail_url, is_premium = coalesce(p_is_premium, false)
  WHERE id = v_version.theme_id;

  UPDATE public.theme_versions
  SET config = coalesce(p_config, '{}'::jsonb),
      fields_schema = p_fields_schema,
      fields_schema_authoritative = true,
      colors = coalesce(p_colors, '{}'::jsonb),
      assets = coalesce(p_assets, '{}'::jsonb),
      is_published = false,
      lifecycle_status = 'draft'
  WHERE id = v_version.id
  RETURNING * INTO v_version;

  RETURN v_version;
END;
$$;

REVOKE ALL ON FUNCTION public.update_theme_and_draft(uuid,text,text,boolean,text,jsonb,jsonb,jsonb,jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.update_theme_and_draft(uuid,text,text,boolean,text,jsonb,jsonb,jsonb,jsonb) TO authenticated;

CREATE OR REPLACE FUNCTION public.publish_theme_version(p_version_id uuid)
RETURNS public.theme_versions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v public.theme_versions;
  result_row public.theme_versions;
BEGIN
  IF NOT public.is_super_admin() THEN RAISE EXCEPTION 'Forbidden'; END IF;

  SELECT * INTO v FROM public.theme_versions WHERE id = p_version_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Theme version not found'; END IF;
  IF v.is_published OR v.lifecycle_status <> 'draft' THEN RAISE EXCEPTION 'Only an unpublished draft can be published'; END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.themes t
    WHERE t.id = v.theme_id AND btrim(t.component_key) = btrim(v.component_key)
  ) THEN
    RAISE EXCEPTION 'Theme/component mismatch';
  END IF;

  UPDATE public.theme_versions
  SET is_published = false, lifecycle_status = 'archived'
  WHERE theme_id = v.theme_id AND is_published = true;

  UPDATE public.theme_versions
  SET is_published = true, lifecycle_status = 'published'
  WHERE id = p_version_id
  RETURNING * INTO result_row;

  PERFORM set_config('nikahlink.skip_theme_snapshot', '1', true);

  UPDATE public.themes
  SET component_key = result_row.component_key,
      colors = result_row.colors,
      editor_config = result_row.config,
      fields_schema = result_row.fields_schema,
      assets = result_row.assets,
      is_active = true
  WHERE id = result_row.theme_id;

  RETURN result_row;
END;
$$;
