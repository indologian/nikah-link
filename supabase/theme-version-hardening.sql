-- NikahLink Theme Version Hardening
-- Applied to Supabase project vyjqubgkkpapsovnrnab on 2026-08-20.
-- This file documents the live hardening applied to the database.

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
CREATE UNIQUE INDEX IF NOT EXISTS theme_versions_one_published_per_theme_idx
  ON public.theme_versions(theme_id)
  WHERE is_published = true;

ALTER TABLE public.theme_versions ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.set_theme_component_key()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.component_key IS NULL OR btrim(NEW.component_key) = '' THEN
    NEW.component_key := NEW.slug;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

ALTER FUNCTION public.update_invitation(
  uuid,text,text,text,text,text,text,date,text,text,text,text,date,text,text,text,text,uuid,uuid,text,text,text,boolean,boolean,boolean,boolean,boolean,jsonb,uuid,text,text,text
) SET search_path = public;

DROP POLICY IF EXISTS "Users can CRUD own invitations" ON public.invitations;
CREATE POLICY "Users can CRUD own invitations"
ON public.invitations
FOR ALL
TO authenticated
USING ((select auth.uid()) = user_id)
WITH CHECK ((select auth.uid()) = user_id);

REVOKE ALL ON FUNCTION public.create_theme_version_snapshot() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.validate_theme_version_component_key() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.set_theme_component_key() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.create_theme_version_draft(uuid,text,jsonb,jsonb,jsonb,jsonb) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.publish_theme_version(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.rollback_theme_version(uuid) FROM PUBLIC, anon;

ALTER VIEW public.invitation_stats SET (security_invoker = true);

COMMIT;
