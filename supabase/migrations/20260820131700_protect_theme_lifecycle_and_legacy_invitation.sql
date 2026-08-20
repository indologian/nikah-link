-- Theme lifecycle hardening.
-- Inactive themes remain readable when referenced by a published invitation.
-- Themes cannot be hard-deleted; archive via is_active=false instead.
-- Royal Blue is rebound to the stable minimalis renderer because its original
-- renderer is no longer present in the application registry.

DROP POLICY IF EXISTS "Super admin can do everything on themes" ON public.themes;
DROP POLICY IF EXISTS "Themes are publicly readable" ON public.themes;

CREATE POLICY "Themes are publicly readable"
ON public.themes
FOR SELECT
TO anon, authenticated
USING (
  is_active = TRUE
  OR EXISTS (
    SELECT 1
    FROM public.invitations i
    WHERE i.theme_id = themes.id
      AND i.is_published = TRUE
  )
);

CREATE POLICY "Super admins can view all themes"
ON public.themes
FOR SELECT
TO authenticated
USING (public.is_super_admin());

CREATE POLICY "Super admins can insert themes"
ON public.themes
FOR INSERT
TO authenticated
WITH CHECK (public.is_super_admin());

CREATE POLICY "Super admins can update themes"
ON public.themes
FOR UPDATE
TO authenticated
USING (public.is_super_admin())
WITH CHECK (public.is_super_admin());

-- Intentionally no DELETE policy. Theme records are historical catalog entities.

UPDATE public.themes
SET component_key = 'minimalis'
WHERE slug = 'royal-blue'
  AND component_key = 'royal-blue';
