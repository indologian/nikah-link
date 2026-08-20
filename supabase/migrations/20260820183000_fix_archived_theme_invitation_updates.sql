-- Existing invitations may continue using their pinned archived theme/version.
-- A theme change still requires an active published theme and entitlement.
CREATE OR REPLACE FUNCTION public.update_invitation(
  p_invitation_id uuid, p_username text, p_bride_name text, p_groom_name text,
  p_bride_photo_url text, p_groom_photo_url text, p_love_story text,
  p_akad_date date, p_akad_time text, p_akad_venue text, p_akad_address text, p_akad_maps_url text,
  p_reception_date date, p_reception_time text, p_reception_venue text, p_reception_address text, p_reception_maps_url text,
  p_theme_id uuid, p_theme_version_id uuid, p_music_url text, p_cover_image_url text,
  p_custom_message text, p_is_published boolean, p_show_rsvp boolean, p_show_gift boolean,
  p_show_gallery boolean, p_show_wishes boolean, p_custom_data jsonb,
  p_gift_account_id uuid, p_bank_name text, p_account_number text, p_account_name text
)
RETURNS void LANGUAGE plpgsql SET search_path TO 'public'
AS $$
declare
  v_owner_id uuid; v_current_theme_id uuid; v_current_theme_version_id uuid;
  v_effective_theme_version_id uuid; v_theme_component_key text; v_version_component_key text;
  v_theme_changed boolean;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  select i.user_id, i.theme_id, i.theme_version_id into v_owner_id, v_current_theme_id, v_current_theme_version_id
  from public.invitations i where i.id = p_invitation_id for update;
  if not found then raise exception 'Invitation not found'; end if;
  if v_owner_id <> auth.uid() then raise exception 'Not authorized to update this invitation'; end if;
  if p_theme_id is null or p_theme_version_id is null then raise exception 'Theme and theme version are required'; end if;

  v_theme_changed := v_current_theme_id IS DISTINCT FROM p_theme_id;
  select t.component_key into v_theme_component_key from public.themes t where t.id = p_theme_id;
  if not found then raise exception 'Selected theme does not exist'; end if;

  if v_theme_changed then
    if not exists (select 1 from public.themes t where t.id = p_theme_id and t.is_active = true) then
      raise exception 'Selected theme is not active';
    end if;
    if not public.user_can_use_theme(auth.uid(), p_theme_id) then
      raise exception 'Theme requires an active paid plan';
    end if;
    select tv.id, tv.component_key into v_effective_theme_version_id, v_version_component_key
    from public.theme_versions tv
    where tv.id = p_theme_version_id and tv.theme_id = p_theme_id
      and tv.is_published = true and tv.lifecycle_status = 'published';
    if not found then raise exception 'Selected theme version is not a published version of the selected theme'; end if;
    if v_version_component_key <> v_theme_component_key then raise exception 'Theme version component does not match theme component'; end if;
  else
    if v_current_theme_version_id is null then raise exception 'Current invitation theme version is missing'; end if;
    v_effective_theme_version_id := v_current_theme_version_id;
  end if;

  update public.invitations set
    username=p_username, bride_name=p_bride_name, groom_name=p_groom_name,
    bride_photo_url=p_bride_photo_url, groom_photo_url=p_groom_photo_url, love_story=p_love_story,
    akad_date=p_akad_date, akad_time=p_akad_time, akad_venue=p_akad_venue, akad_address=p_akad_address, akad_maps_url=p_akad_maps_url,
    reception_date=p_reception_date, reception_time=p_reception_time, reception_venue=p_reception_venue,
    reception_address=p_reception_address, reception_maps_url=p_reception_maps_url,
    theme_id=p_theme_id, theme_version_id=v_effective_theme_version_id, music_url=p_music_url,
    cover_image_url=p_cover_image_url, custom_message=p_custom_message, is_published=p_is_published,
    show_rsvp=p_show_rsvp, show_gift=p_show_gift, show_gallery=p_show_gallery, show_wishes=p_show_wishes,
    custom_data=p_custom_data, updated_at=now()
  where id=p_invitation_id;

  if p_bank_name is not null and p_bank_name <> '' and p_account_number is not null and p_account_number <> '' then
    if p_gift_account_id is not null then
      update public.gift_accounts set bank_name=p_bank_name, account_number=p_account_number, account_name=p_account_name
      where id=p_gift_account_id and invitation_id=p_invitation_id;
    else
      insert into public.gift_accounts(invitation_id,type,bank_name,account_number,account_name)
      values(p_invitation_id,'bank',p_bank_name,p_account_number,p_account_name);
    end if;
  elsif p_gift_account_id is not null then
    delete from public.gift_accounts where id=p_gift_account_id and invitation_id=p_invitation_id;
  end if;
end;
$$;
