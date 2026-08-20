-- Harden theme entitlement and invitation creation limits.
-- Existing invitations keep their pinned archived theme/version.

CREATE OR REPLACE FUNCTION public.user_can_use_theme(p_user_id uuid, p_theme_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.themes t
    LEFT JOIN public.profiles p ON p.user_id = p_user_id
    WHERE t.id = p_theme_id
      AND (
        t.is_premium = false
        OR p.role = 'super_admin'
        OR (p.plan IN ('premium', 'pro') AND (p.plan_expires_at IS NULL OR p.plan_expires_at > now()))
      )
  );
$$;

CREATE OR REPLACE FUNCTION public.can_create_invitation(p_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  WITH profile AS (
    SELECT role, plan, has_used_free_trial, plan_expires_at FROM public.profiles WHERE user_id = p_user_id
  ), usage AS (
    SELECT count(*)::integer AS invitation_count FROM public.invitations WHERE user_id = p_user_id
  )
  SELECT EXISTS (
    SELECT 1 FROM profile p CROSS JOIN usage u
    WHERE p.role = 'super_admin'
       OR (p.plan = 'free' AND COALESCE(p.has_used_free_trial,false) = false AND u.invitation_count < 1)
       OR (p.plan = 'premium' AND (p.plan_expires_at IS NULL OR p.plan_expires_at > now()) AND u.invitation_count < 1)
       OR (p.plan = 'pro' AND (p.plan_expires_at IS NULL OR p.plan_expires_at > now()) AND u.invitation_count < 2)
  );
$$;

REVOKE ALL ON FUNCTION public.user_can_use_theme(uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.can_create_invitation(uuid) FROM PUBLIC, anon, authenticated;

DROP POLICY IF EXISTS "Users can CRUD own invitations" ON public.invitations;
CREATE POLICY "Users can view own invitations" ON public.invitations FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);
CREATE POLICY "Users can create invitations within plan" ON public.invitations FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id AND public.can_create_invitation((SELECT auth.uid())));
CREATE POLICY "Users can update own invitations" ON public.invitations FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = user_id) WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE POLICY "Users can delete own invitations" ON public.invitations FOR DELETE TO authenticated USING ((SELECT auth.uid()) = user_id);

-- The trigger enforces active + entitled access only for INSERT/theme changes.
CREATE OR REPLACE FUNCTION public.ensure_invitation_theme_version()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
declare
  resolved_theme_id uuid; resolved_version_id uuid; version_fields jsonb; field jsonb;
  field_name text; field_required boolean; field_enabled boolean; theme_changed boolean;
begin
  theme_changed := tg_op = 'INSERT' OR new.theme_id IS DISTINCT FROM old.theme_id;
  if new.theme_id is not null then
    select t.id into resolved_theme_id from public.themes t where t.id = new.theme_id;
    if resolved_theme_id is null then raise exception 'Invalid theme: %', new.theme_id; end if;
  elsif new.theme_version_id is not null then
    select tv.theme_id into resolved_theme_id from public.theme_versions tv where tv.id = new.theme_version_id;
    if resolved_theme_id is null then raise exception 'Invalid theme version: %', new.theme_version_id; end if;
    new.theme_id := resolved_theme_id; theme_changed := true;
  end if;

  if new.theme_id is not null and theme_changed then
    if not exists (select 1 from public.themes t where t.id = new.theme_id and t.is_active = true) then raise exception 'Selected theme is not active'; end if;
    if auth.uid() is not null and not public.user_can_use_theme(auth.uid(), new.theme_id) then raise exception 'Theme requires an active paid plan'; end if;
  end if;

  if tg_op = 'UPDATE' and new.theme_id = old.theme_id and new.theme_version_id is null then new.theme_version_id := old.theme_version_id; end if;

  if new.theme_id is not null and new.theme_version_id is not null then
    select tv.theme_id, tv.fields_schema into resolved_theme_id, version_fields from public.theme_versions tv where tv.id = new.theme_version_id;
    if resolved_theme_id is null then raise exception 'Invalid theme version: %', new.theme_version_id; end if;
    if resolved_theme_id <> new.theme_id then
      if not theme_changed then new.theme_version_id := old.theme_version_id; version_fields := null;
      else new.theme_version_id := null; version_fields := null; end if;
    end if;
  end if;

  if new.theme_version_id is null and new.theme_id is not null then
    select tv.id, tv.fields_schema into resolved_version_id, version_fields
    from public.theme_versions tv where tv.theme_id = new.theme_id and (tv.lifecycle_status = 'published' or tv.is_published = true)
    order by tv.version desc limit 1;
    if resolved_version_id is null then raise exception 'No published theme version exists for theme %', new.theme_id; end if;
    new.theme_version_id := resolved_version_id;
  end if;

  if new.theme_version_id is not null and version_fields is null then
    select tv.fields_schema into version_fields from public.theme_versions tv where tv.id = new.theme_version_id;
  end if;

  if version_fields is not null and jsonb_typeof(version_fields) = 'array' then
    for field in select value from jsonb_array_elements(version_fields) loop
      field_name := field->>'name'; field_required := coalesce((field->>'required')::boolean,false); field_enabled := coalesce((field->>'enabled')::boolean,true);
      if field_required and field_enabled and (new.custom_data is null or nullif(btrim(coalesce(new.custom_data->>field_name,'')),'') is null) then
        raise exception 'Required theme field is missing: %', field_name;
      end if;
    end loop;
  end if;
  return new;
end;
$$;
