CREATE OR REPLACE FUNCTION public.consume_free_trial_on_invitation_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.user_id IS NOT NULL THEN
    UPDATE public.profiles
    SET has_used_free_trial = true,
        updated_at = now()
    WHERE user_id = NEW.user_id
      AND plan = 'free'
      AND COALESCE(has_used_free_trial, false) = false;
  END IF;

  RETURN NEW;
END;
$function$;

REVOKE ALL ON FUNCTION public.consume_free_trial_on_invitation_insert() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.consume_free_trial_on_invitation_insert() TO authenticated;

DROP TRIGGER IF EXISTS invitations_consume_free_trial ON public.invitations;
CREATE TRIGGER invitations_consume_free_trial
AFTER INSERT ON public.invitations
FOR EACH ROW
EXECUTE FUNCTION public.consume_free_trial_on_invitation_insert();
