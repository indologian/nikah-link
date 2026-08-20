-- NikahLink Theme Version Hardening
-- Applied to Supabase project vyjqubgkkpapsovnrnab on 2026-08-20.
-- This file documents the live hardening and draft lifecycle used by the theme admin.

BEGIN;

ALTER TABLE public.themes
  ADD COLUMN IF NOT EXISTS component_key text,
  ADD COLUMN IF NOT EXISTS editor_config jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS fields_schema jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS assets jsonb NOT NULL DEFAULT '{}'::jsonb;

UPDATE public.themes
SET component_key = slug
WHERE component_key IS NULL OR btrim(component_key) = '';

ALTER TABLE public.themes
  ALTER COLUMN component_key SET NOT NULL;

CREATE TABLE IF NOT EXISTS public.theme_versions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  theme_id uuid NOT NULL REFERENCES public.themes(id) ON DELETE CASCADE,
  version integer NOT NULL,
  component_key text NOT NULL,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  fields_schema jsonb NOT NULL DEFAULT '[]'::jsonb,
  colors jsonb NOT NULL DEFAULT '{}'::jsonb,
  assets jsonb NOT NULL DEFAULT '{}'::jsonb,
  fields_schema_authoritative boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT false,
  lifecycle_status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT theme_versions_version_positive CHECK (version > 0),
  CONSTRAINT theme_versions_lifecycle_status_check CHECK (lifecycle_status IN ('draft','published','archived')),
  CONSTRAINT theme_versions_theme_version_unique UNIQUE (theme_id, version)
);

ALTER TABLE public.invitations
  ADD COLUMN IF NOT EXISTS theme_version_id uuid REFERENCES public.theme_versions(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS invitations_theme_id_idx ON public.invitations(theme_id);
CREATE INDEX IF NOT EXISTS invitations_theme_version_id_idx ON public.invitations(theme_version_id);
CREATE INDEX IF NOT EXISTS theme_versions_theme_id_version_idx ON public.theme_versions(theme_id, version DESC);
CREATE UNIQUE INDEX IF NOT EXISTS theme_versions_one_published_per_theme_idx ON public.theme_versions(theme_id) WHERE is_published = true;

ALTER TABLE public.theme_versions ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.set_theme_component_key()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.component_key IS NULL OR btrim(NEW.component_key) = '' THEN NEW.component_key := NEW.slug; END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

ALTER FUNCTION public.update_invitation(uuid,text,text,text,text,text,text,date,text,text,text,text,date,text,text,text,text,uuid,uuid,text,text,text,boolean,boolean,boolean,boolean,boolean,jsonb,uuid,text,text,text) SET search_path = public;

DROP POLICY IF EXISTS "Users can CRUD own invitations" ON public.invitations;
CREATE POLICY "Users can CRUD own invitations" ON public.invitations FOR ALL TO authenticated USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);

REVOKE ALL ON FUNCTION public.create_theme_version_snapshot() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.validate_theme_version_component_key() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.set_theme_component_key() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.create_theme_version_draft(uuid,text,jsonb,jsonb,jsonb,jsonb) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.publish_theme_version(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.rollback_theme_version(uuid) FROM PUBLIC, anon;

CREATE OR REPLACE FUNCTION public.create_theme_draft(
  p_name text,
  p_slug text,
  p_category text,
  p_component_key text,
  p_is_premium boolean DEFAULT false,
  p_thumbnail_url text DEFAULT NULL,
  p_colors jsonb DEFAULT '{}'::jsonb,
  p_config jsonb DEFAULT '{}'::jsonb,
  p_fields_schema jsonb DEFAULT '[]'::jsonb,
  p_assets jsonb DEFAULT '{}'::jsonb
)
RETURNS public.themes
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_theme public.themes;
BEGIN
  IF NOT public.is_super_admin() THEN RAISE EXCEPTION 'Forbidden'; END IF;
  IF p_fields_schema IS NULL OR jsonb_typeof(p_fields_schema) <> 'array' THEN RAISE EXCEPTION 'fields_schema must be a JSON array'; END IF;
  IF p_component_key IS NULL OR btrim(p_component_key) = '' THEN RAISE EXCEPTION 'component_key is required'; END IF;
  PERFORM set_config('nikahlink.skip_theme_snapshot','1',true);
  INSERT INTO public.themes(name,slug,category,thumbnail_url,is_premium,is_active,colors,component_key,editor_config,fields_schema,assets)
  VALUES (btrim(p_name),lower(btrim(p_slug)),p_category,p_thumbnail_url,coalesce(p_is_premium,false),false,coalesce(p_colors,'{}'::jsonb),p_component_key,coalesce(p_config,'{}'::jsonb),coalesce(p_fields_schema,'[]'::jsonb),coalesce(p_assets,'{}'::jsonb))
  RETURNING * INTO v_theme;
  INSERT INTO public.theme_versions(theme_id,version,component_key,config,fields_schema,fields_schema_authoritative,colors,assets,is_published,lifecycle_status)
  VALUES(v_theme.id,1,p_component_key,coalesce(p_config,'{}'::jsonb),coalesce(p_fields_schema,'[]'::jsonb),true,coalesce(p_colors,'{}'::jsonb),coalesce(p_assets,'{}'::jsonb),false,'draft');
  RETURN v_theme;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_theme_draft(
  p_version_id uuid,
  p_component_key text,
  p_config jsonb DEFAULT '{}'::jsonb,
  p_fields_schema jsonb DEFAULT '[]'::jsonb,
  p_colors jsonb DEFAULT '{}'::jsonb,
  p_assets jsonb DEFAULT '{}'::jsonb
)
RETURNS public.theme_versions
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_row public.theme_versions;
BEGIN
  IF NOT public.is_super_admin() THEN RAISE EXCEPTION 'Forbidden'; END IF;
  SELECT * INTO v_row FROM public.theme_versions WHERE id = p_version_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Theme version not found'; END IF;
  IF v_row.is_published OR v_row.lifecycle_status <> 'draft' THEN RAISE EXCEPTION 'Only draft theme versions can be edited'; END IF;
  IF p_component_key IS DISTINCT FROM v_row.component_key THEN RAISE EXCEPTION 'Draft component_key cannot be changed'; END IF;
  IF p_fields_schema IS NULL OR jsonb_typeof(p_fields_schema) <> 'array' THEN RAISE EXCEPTION 'fields_schema must be a JSON array'; END IF;
  UPDATE public.theme_versions SET config=coalesce(p_config,'{}'::jsonb), fields_schema=coalesce(p_fields_schema,'[]'::jsonb), colors=coalesce(p_colors,'{}'::jsonb), assets=coalesce(p_assets,'{}'::jsonb) WHERE id=p_version_id RETURNING * INTO v_row;
  RETURN v_row;
END;
$$;

REVOKE ALL ON FUNCTION public.create_theme_draft(text,text,text,text,boolean,text,jsonb,jsonb,jsonb,jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_theme_draft(text,text,text,text,boolean,text,jsonb,jsonb,jsonb,jsonb) TO authenticated;
REVOKE ALL ON FUNCTION public.update_theme_draft(uuid,text,jsonb,jsonb,jsonb,jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.update_theme_draft(uuid,text,jsonb,jsonb,jsonb,jsonb) TO authenticated;

ALTER VIEW public.invitation_stats SET (security_invoker = true);

COMMIT;
