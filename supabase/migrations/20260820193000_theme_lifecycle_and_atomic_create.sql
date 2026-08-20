-- Keep invitation publication state and the legacy is_published flag consistent.
CREATE OR REPLACE FUNCTION public.sync_invitation_publication_status()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.is_published = true THEN
    NEW.status := 'published';
  ELSIF COALESCE(NEW.status, 'draft') <> 'archived' THEN
    NEW.status := 'draft';
  END IF;
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS invitations_publication_status_sync ON public.invitations;
CREATE TRIGGER invitations_publication_status_sync
BEFORE INSERT OR UPDATE OF is_published, status ON public.invitations
FOR EACH ROW
EXECUTE FUNCTION public.sync_invitation_publication_status();

UPDATE public.invitations
SET status = CASE
  WHEN is_published = true THEN 'published'
  WHEN status = 'archived' THEN 'archived'
  ELSE 'draft'
END
WHERE status IS DISTINCT FROM CASE
  WHEN is_published = true THEN 'published'
  WHEN status = 'archived' THEN 'archived'
  ELSE 'draft'
END;

ALTER TABLE public.invitations
  DROP CONSTRAINT IF EXISTS invitations_publication_state_check;
ALTER TABLE public.invitations
  ADD CONSTRAINT invitations_publication_state_check
  CHECK (
    (is_published = true AND status = 'published')
    OR
    (is_published = false AND status IN ('draft', 'archived'))
  );

-- A user-level secure helper for consuming the free trial inside the same transaction.
CREATE OR REPLACE FUNCTION public.consume_free_trial()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  UPDATE public.profiles
  SET has_used_free_trial = true,
      updated_at = now()
  WHERE user_id = auth.uid()
    AND plan = 'free'
    AND COALESCE(has_used_free_trial, false) = false;
END;
$function$;

REVOKE ALL ON FUNCTION public.consume_free_trial() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.consume_free_trial() TO authenticated;

-- Atomic creation of an invitation, its first gift account, and free-trial consumption.
CREATE OR REPLACE FUNCTION public.create_invitation(
  p_user_id uuid,
  p_username text,
  p_bride_name text,
  p_groom_name text,
  p_bride_photo_url text,
  p_groom_photo_url text,
  p_love_story text,
  p_akad_date date,
  p_akad_time text,
  p_akad_venue text,
  p_akad_address text,
  p_akad_maps_url text,
  p_reception_date date,
  p_reception_time text,
  p_reception_venue text,
  p_reception_address text,
  p_reception_maps_url text,
  p_theme_id uuid,
  p_theme_version_id uuid,
  p_music_url text,
  p_cover_image_url text,
  p_custom_message text,
  p_is_published boolean,
  p_show_rsvp boolean,
  p_show_gift boolean,
  p_show_gallery boolean,
  p_show_wishes boolean,
  p_custom_data jsonb,
  p_bank_name text DEFAULT NULL,
  p_account_number text DEFAULT NULL,
  p_account_name text DEFAULT NULL
)
RETURNS public.invitations
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
DECLARE
  v_invitation public.invitations;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF p_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Not authorized to create invitation for another user';
  END IF;

  IF p_username IS NULL OR btrim(p_username) = '' THEN
    RAISE EXCEPTION 'Invitation username is required';
  END IF;

  IF NOT public.can_create_invitation(p_user_id) THEN
    RAISE EXCEPTION 'Invitation limit reached or plan is not eligible';
  END IF;

  INSERT INTO public.invitations (
    user_id,
    username,
    bride_name,
    groom_name,
    bride_photo_url,
    groom_photo_url,
    love_story,
    akad_date,
    akad_time,
    akad_venue,
    akad_address,
    akad_maps_url,
    reception_date,
    reception_time,
    reception_venue,
    reception_address,
    reception_maps_url,
    theme_id,
    theme_version_id,
    music_url,
    cover_image_url,
    custom_message,
    is_published,
    show_rsvp,
    show_gift,
    show_gallery,
    show_wishes,
    custom_data
  ) VALUES (
    p_user_id,
    lower(regexp_replace(p_username, '[^a-z0-9-]', '', 'g')),
    p_bride_name,
    p_groom_name,
    p_bride_photo_url,
    p_groom_photo_url,
    p_love_story,
    p_akad_date,
    p_akad_time,
    p_akad_venue,
    p_akad_address,
    p_akad_maps_url,
    p_reception_date,
    p_reception_time,
    p_reception_venue,
    p_reception_address,
    p_reception_maps_url,
    p_theme_id,
    p_theme_version_id,
    p_music_url,
    p_cover_image_url,
    p_custom_message,
    COALESCE(p_is_published, false),
    COALESCE(p_show_rsvp, true),
    COALESCE(p_show_gift, true),
    COALESCE(p_show_gallery, true),
    COALESCE(p_show_wishes, true),
    COALESCE(p_custom_data, '{}'::jsonb)
  )
  RETURNING * INTO v_invitation;

  IF p_bank_name IS NOT NULL AND btrim(p_bank_name) <> ''
     AND p_account_number IS NOT NULL AND btrim(p_account_number) <> '' THEN
    INSERT INTO public.gift_accounts (
      invitation_id,
      type,
      bank_name,
      account_number,
      account_name
    ) VALUES (
      v_invitation.id,
      'bank',
      p_bank_name,
      p_account_number,
      p_account_name
    );
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = auth.uid()
      AND plan = 'free'
      AND COALESCE(has_used_free_trial, false) = false
  ) THEN
    PERFORM public.consume_free_trial();
  END IF;

  RETURN v_invitation;
END;
$function$;

REVOKE ALL ON FUNCTION public.create_invitation(
  uuid,text,text,text,text,text,text,date,text,text,text,text,date,text,text,text,text,uuid,uuid,text,text,text,boolean,boolean,boolean,boolean,boolean,jsonb,text,text,text
) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_invitation(
  uuid,text,text,text,text,text,text,date,text,text,text,text,date,text,text,text,text,uuid,uuid,text,text,text,boolean,boolean,boolean,boolean,boolean,jsonb,text,text,text
) TO authenticated;
