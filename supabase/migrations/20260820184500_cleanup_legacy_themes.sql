-- Clean the testing theme catalog so every retained theme has a supported renderer.
-- Existing testing invitations pinned to inactive legacy themes are moved to the
-- current published Minimalis version before those legacy themes are removed.

DO $$
DECLARE
  v_minimalis_theme_id uuid;
  v_minimalis_version_id uuid;
BEGIN
  SELECT id
  INTO v_minimalis_theme_id
  FROM public.themes
  WHERE slug = 'minimalis'
  LIMIT 1;

  IF v_minimalis_theme_id IS NULL THEN
    RAISE EXCEPTION 'Minimalis theme not found';
  END IF;

  SELECT id
  INTO v_minimalis_version_id
  FROM public.theme_versions
  WHERE theme_id = v_minimalis_theme_id
    AND is_published = true
    AND lifecycle_status = 'published'
  ORDER BY version DESC
  LIMIT 1;

  IF v_minimalis_version_id IS NULL THEN
    RAISE EXCEPTION 'Published Minimalis theme version not found';
  END IF;

  UPDATE public.invitations AS i
  SET
    theme_id = v_minimalis_theme_id,
    theme_version_id = v_minimalis_version_id,
    updated_at = now()
  WHERE i.theme_id IN (
    SELECT t.id
    FROM public.themes AS t
    WHERE t.is_active = false
      AND t.id <> v_minimalis_theme_id
  );

  UPDATE public.themes
  SET thumbnail_url = 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop'
  WHERE id = v_minimalis_theme_id
    AND thumbnail_url IS NULL;

  DELETE FROM public.theme_versions AS tv
  WHERE tv.theme_id IN (
    SELECT t.id
    FROM public.themes AS t
    WHERE t.is_active = false
      AND t.id <> v_minimalis_theme_id
  );

  DELETE FROM public.themes AS t
  WHERE t.is_active = false
    AND t.id <> v_minimalis_theme_id;
END;
$$;
