-- Harden the themes Data API surface.
-- Public users only need to read the theme catalog.
-- Theme writes are restricted by RLS to authenticated super_admin users.

REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER
ON TABLE public.themes
FROM anon;

GRANT SELECT
ON TABLE public.themes
TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public.themes
TO authenticated;

REVOKE TRUNCATE, REFERENCES, TRIGGER
ON TABLE public.themes
FROM authenticated;
