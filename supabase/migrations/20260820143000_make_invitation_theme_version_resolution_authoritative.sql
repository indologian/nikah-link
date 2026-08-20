create or replace function public.ensure_invitation_theme_version()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  resolved_theme_id uuid;
  resolved_version_id uuid;
  version_fields jsonb;
  field jsonb;
  field_name text;
  field_required boolean;
  field_enabled boolean;
begin
  if new.theme_id is not null then
    select t.id into resolved_theme_id
    from public.themes t
    where t.id = new.theme_id;

    if resolved_theme_id is null then
      raise exception 'Invalid theme: %', new.theme_id;
    end if;
  elsif new.theme_version_id is not null then
    select tv.theme_id into resolved_theme_id
    from public.theme_versions tv
    where tv.id = new.theme_version_id;

    if resolved_theme_id is null then
      raise exception 'Invalid theme version: %', new.theme_version_id;
    end if;

    new.theme_id := resolved_theme_id;
  end if;

  if tg_op = 'UPDATE'
     and new.theme_id = old.theme_id
     and new.theme_version_id is null then
    new.theme_version_id := old.theme_version_id;
  end if;

  if new.theme_id is not null and new.theme_version_id is not null then
    select tv.theme_id, tv.fields_schema
      into resolved_theme_id, version_fields
    from public.theme_versions tv
    where tv.id = new.theme_version_id;

    if resolved_theme_id is null then
      raise exception 'Invalid theme version: %', new.theme_version_id;
    end if;

    if resolved_theme_id <> new.theme_id then
      new.theme_version_id := null;
      version_fields := null;
    end if;
  end if;

  if new.theme_version_id is null and new.theme_id is not null then
    select tv.id, tv.fields_schema
      into resolved_version_id, version_fields
    from public.theme_versions tv
    where tv.theme_id = new.theme_id
      and (tv.lifecycle_status = 'published' or tv.is_published = true)
    order by tv.version desc
    limit 1;

    if resolved_version_id is null then
      raise exception 'No published theme version exists for theme %', new.theme_id;
    end if;

    new.theme_version_id := resolved_version_id;
  end if;

  if new.theme_version_id is not null and version_fields is null then
    select tv.fields_schema
      into version_fields
    from public.theme_versions tv
    where tv.id = new.theme_version_id;
  end if;

  if version_fields is not null and jsonb_typeof(version_fields) = 'array' then
    for field in select value from jsonb_array_elements(version_fields)
    loop
      field_name := field->>'name';
      field_required := coalesce((field->>'required')::boolean, false);
      field_enabled := coalesce((field->>'enabled')::boolean, true);

      if field_required and field_enabled
         and (new.custom_data is null
              or nullif(btrim(coalesce(new.custom_data->>field_name, '')), '') is null) then
        raise exception 'Required theme field is missing: %', field_name;
      end if;
    end loop;
  end if;

  return new;
end;
$$;
