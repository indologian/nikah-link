-- Keep static registry fields mirrored into themes.fields_schema for the DB editor fallback.
UPDATE public.themes
SET fields_schema = CASE component_key
  WHEN 'minimalis' THEN '[{"name":"greeting","label":"Salam Pembuka Khusus","type":"text","placeholder":"misal: Assalamualaikum Wr. Wb."}]'::jsonb
  WHEN 'vintage-elegance' THEN '[{"name":"quote","label":"Kutipan Pernikahan","type":"textarea","placeholder":"Dan di antara tanda-tanda kekuasaan-Nya..."},{"name":"gallery_1","label":"Foto Galeri 1","type":"image"},{"name":"gallery_2","label":"Foto Galeri 2","type":"image"},{"name":"gallery_3","label":"Foto Galeri 3","type":"image"}]'::jsonb
  WHEN 'royal-botanical' THEN '[{"name":"quote","label":"Kutipan Pernikahan","type":"textarea","placeholder":"Dan di antara tanda-tanda kekuasaan-Nya..."},{"name":"gallery_1","label":"Foto Galeri 1","type":"image"},{"name":"gallery_2","label":"Foto Galeri 2","type":"image"},{"name":"gallery_3","label":"Foto Galeri 3","type":"image"}]'::jsonb
  WHEN 'wayang-classic' THEN '[{"name":"quote","label":"Kutipan","type":"textarea","placeholder":"Maha Suci Allah yang telah menciptakan..."},{"name":"gallery_1","label":"Foto Galeri 1","type":"image"},{"name":"gallery_2","label":"Foto Galeri 2","type":"image"},{"name":"gallery_3","label":"Foto Galeri 3","type":"image"}]'::jsonb
  WHEN 'elegant-blush' THEN '[{"name":"quote","label":"Kutipan","type":"textarea","placeholder":"To love and to be loved is to feel the sun from both sides."},{"name":"gallery_1","label":"Foto Galeri 1","type":"image"},{"name":"gallery_2","label":"Foto Galeri 2","type":"image"},{"name":"gallery_3","label":"Foto Galeri 3","type":"image"}]'::jsonb
  WHEN 'midnight-sparkle' THEN '[{"name":"quote","label":"Kutipan","type":"textarea","placeholder":"You are the stars in my dark night."},{"name":"gallery_1","label":"Foto Galeri 1","type":"image"},{"name":"gallery_2","label":"Foto Galeri 2","type":"image"},{"name":"gallery_3","label":"Foto Galeri 3","type":"image"}]'::jsonb
  WHEN 'serein-white' THEN '[{"name":"quote","label":"Kutipan","type":"textarea","placeholder":"To love and be loved..."},{"name":"gallery_1","label":"Foto Galeri 1","type":"image"},{"name":"gallery_2","label":"Foto Galeri 2","type":"image"},{"name":"gallery_3","label":"Foto Galeri 3","type":"image"}]'::jsonb
  WHEN 'balinese-harmony' THEN '[{"name":"quote","label":"Kutipan","type":"textarea","placeholder":"Om Swastyastu..."},{"name":"gallery_1","label":"Foto Galeri 1","type":"image"},{"name":"gallery_2","label":"Foto Galeri 2","type":"image"},{"name":"gallery_3","label":"Foto Galeri 3","type":"image"}]'::jsonb
  WHEN 'magazine-cover' THEN '[{"name":"quote","label":"Kutipan","type":"textarea","placeholder":"A modern romance..."},{"name":"gallery_1","label":"Foto Galeri 1","type":"image"},{"name":"gallery_2","label":"Foto Galeri 2","type":"image"},{"name":"gallery_3","label":"Foto Galeri 3","type":"image"}]'::jsonb
  WHEN 'javanese-batik' THEN '[{"name":"quote","label":"Kutipan","type":"textarea","placeholder":"Tresno jalaran soko kulino..."},{"name":"gallery_1","label":"Foto Galeri 1","type":"image"},{"name":"gallery_2","label":"Foto Galeri 2","type":"image"},{"name":"gallery_3","label":"Foto Galeri 3","type":"image"}]'::jsonb
  WHEN 'line-art-botanical' THEN '[{"name":"quote","label":"Kutipan","type":"textarea","placeholder":"Growing together in love..."},{"name":"gallery_1","label":"Foto Galeri 1","type":"image"},{"name":"gallery_2","label":"Foto Galeri 2","type":"image"},{"name":"gallery_3","label":"Foto Galeri 3","type":"image"}]'::jsonb
  WHEN 'royal-gold' THEN '[{"name":"quote","label":"Kutipan","type":"textarea","placeholder":"A lifetime of luxury and love..."},{"name":"gallery_1","label":"Foto Galeri 1","type":"image"},{"name":"gallery_2","label":"Foto Galeri 2","type":"image"},{"name":"gallery_3","label":"Foto Galeri 3","type":"image"}]'::jsonb
  WHEN 'ocean-breeze' THEN '[{"name":"quote","label":"Kutipan","type":"textarea","placeholder":"Love like the ocean..."}]'::jsonb
  WHEN 'rustic-woodland' THEN '[{"name":"quote","label":"Kutipan","type":"textarea","placeholder":"Rooted in love..."}]'::jsonb
  WHEN 'modern-monochrome' THEN '[{"name":"quote","label":"Kutipan","type":"textarea","placeholder":"Elegance in simplicity..."}]'::jsonb
  WHEN 'cosmic-starlight' THEN '[{"name":"quote","label":"Kutipan","type":"textarea","placeholder":"Written in the stars..."}]'::jsonb
  WHEN 'ethereal-watercolor' THEN '[{"name":"quote","label":"Kutipan","type":"textarea","placeholder":"A dream painted in reality..."}]'::jsonb
  WHEN 'heritage-gunungan' THEN '[{"name":"quote","label":"Kutipan","type":"textarea","placeholder":"Pahargyan Ageng..."}]'::jsonb
  WHEN 'botanical-elegance' THEN '[{"name":"quote","label":"Kutipan Pernikahan","type":"textarea","placeholder":"Dan di antara tanda-tanda..."},{"name":"gallery_1","label":"Foto Galeri 1","type":"image"},{"name":"gallery_2","label":"Foto Galeri 2","type":"image"},{"name":"gallery_3","label":"Foto Galeri 3","type":"image"}]'::jsonb
  WHEN 'golden-arch' THEN '[{"name":"quote","label":"Kutipan","type":"textarea","placeholder":"Dan di antara tanda-tanda..."},{"name":"gallery_1","label":"Foto Galeri 1","type":"image"},{"name":"gallery_2","label":"Foto Galeri 2","type":"image"},{"name":"gallery_3","label":"Foto Galeri 3","type":"image"}]'::jsonb
  WHEN 'terracotta-rust' THEN '[{"name":"quote","label":"Kutipan","type":"textarea","placeholder":"Dan di antara tanda-tanda..."},{"name":"gallery_1","label":"Foto Galeri 1","type":"image"},{"name":"gallery_2","label":"Foto Galeri 2","type":"image"},{"name":"gallery_3","label":"Foto Galeri 3","type":"image"}]'::jsonb
  WHEN 'ethereal-snow' THEN '[{"name":"quote","label":"Kutipan","type":"textarea","placeholder":"Winter romance..."},{"name":"gallery_1","label":"Foto Galeri 1","type":"image"},{"name":"gallery_2","label":"Foto Galeri 2","type":"image"},{"name":"gallery_3","label":"Foto Galeri 3","type":"image"}]'::jsonb
  WHEN 'geometric-abstract' THEN '[{"name":"quote","label":"Kutipan","type":"textarea","placeholder":"Abstract love..."}]'::jsonb
  WHEN 'editorial-gallery' THEN '[{"name":"quote","label":"Kutipan Utama","type":"textarea","placeholder":"Dan di antara tanda-tanda..."},{"name":"gallery_1","label":"Foto Galeri 1","type":"image"},{"name":"gallery_2","label":"Foto Galeri 2","type":"image"},{"name":"gallery_3","label":"Foto Galeri 3","type":"image"}]'::jsonb
  ELSE fields_schema
END
WHERE is_active = true;

CREATE OR REPLACE FUNCTION public.create_theme_version_draft(
  p_theme_id uuid, p_component_key text, p_config jsonb DEFAULT '{}'::jsonb,
  p_fields_schema jsonb DEFAULT '[]'::jsonb, p_colors jsonb DEFAULT '{}'::jsonb,
  p_assets jsonb DEFAULT '{}'::jsonb
)
RETURNS public.theme_versions
LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public'
AS $$
declare v_next integer; v_row public.theme_versions; v_fields_schema jsonb;
begin
  if not public.is_super_admin() then raise exception 'Forbidden'; end if;
  if not exists (select 1 from public.themes where id = p_theme_id) then raise exception 'Theme not found'; end if;
  if jsonb_typeof(coalesce(p_fields_schema,'[]'::jsonb)) <> 'array' then raise exception 'fields_schema must be a JSON array'; end if;
  v_fields_schema := coalesce(p_fields_schema,'[]'::jsonb);
  if jsonb_array_length(v_fields_schema) = 0 then
    select coalesce(t.fields_schema,'[]'::jsonb) into v_fields_schema from public.themes t where t.id = p_theme_id;
  end if;
  select coalesce(max(version),0)+1 into v_next from public.theme_versions where theme_id = p_theme_id;
  insert into public.theme_versions(theme_id,version,component_key,config,fields_schema,fields_schema_authoritative,colors,assets,is_published,lifecycle_status)
  values(p_theme_id,v_next,p_component_key,coalesce(p_config,'{}'::jsonb),v_fields_schema,jsonb_array_length(v_fields_schema) > 0,coalesce(p_colors,'{}'::jsonb),coalesce(p_assets,'{}'::jsonb),false,'draft')
  returning * into v_row;
  return v_row;
end;
$$;

CREATE OR REPLACE FUNCTION public.update_theme_draft(
  p_version_id uuid, p_component_key text, p_config jsonb DEFAULT '{}'::jsonb,
  p_fields_schema jsonb DEFAULT '[]'::jsonb, p_colors jsonb DEFAULT '{}'::jsonb,
  p_assets jsonb DEFAULT '{}'::jsonb
)
RETURNS public.theme_versions
LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public'
AS $$
declare v_row public.theme_versions; v_fields_schema jsonb;
begin
  if not public.is_super_admin() then raise exception 'Forbidden'; end if;
  if p_fields_schema is null or jsonb_typeof(p_fields_schema) <> 'array' then raise exception 'fields_schema must be a JSON array'; end if;
  select * into v_row from public.theme_versions where id = p_version_id for update;
  if not found then raise exception 'Theme version not found'; end if;
  if v_row.is_published or v_row.lifecycle_status <> 'draft' then raise exception 'Only draft theme versions can be edited'; end if;
  if p_component_key is distinct from v_row.component_key then raise exception 'Draft component_key cannot be changed'; end if;
  v_fields_schema := coalesce(p_fields_schema,'[]'::jsonb);
  if jsonb_array_length(v_fields_schema) = 0 then
    select coalesce(t.fields_schema,'[]'::jsonb) into v_fields_schema from public.themes t where t.id = v_row.theme_id;
    if jsonb_array_length(v_fields_schema) = 0 then v_fields_schema := coalesce(v_row.fields_schema,'[]'::jsonb); end if;
  end if;
  update public.theme_versions
  set config=coalesce(p_config,'{}'::jsonb), fields_schema=v_fields_schema,
      fields_schema_authoritative=jsonb_array_length(v_fields_schema) > 0,
      colors=coalesce(p_colors,'{}'::jsonb), assets=coalesce(p_assets,'{}'::jsonb)
  where id = p_version_id
  returning * into v_row;
  return v_row;
end;
$$;
