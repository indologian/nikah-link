-- Theme creation is intentionally code-defined now.
-- New themes must add a renderer to components/themes, register it in
-- lib/themes/registry.tsx, and seed the catalog through a migration.
-- Theme version drafts remain available because existing themes still need
-- safe edit -> preview -> publish lifecycle management.

DROP FUNCTION IF EXISTS public.create_theme_draft(text,text,text,text,boolean,text,jsonb,jsonb,jsonb,jsonb);
