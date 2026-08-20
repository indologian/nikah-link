UPDATE public.themes
SET preview_url = '/demo/' || slug
WHERE preview_url IS DISTINCT FROM ('/demo/' || slug);
