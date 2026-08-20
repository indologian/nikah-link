BEGIN;

DROP POLICY IF EXISTS "Auth Insert" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload invitation assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update own invitation assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete own invitation assets" ON storage.objects;
DROP POLICY IF EXISTS "Invitation assets are publicly readable" ON storage.objects;

CREATE POLICY "Invitation assets are publicly readable"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'invitations');

CREATE POLICY "Authenticated users can upload invitation assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'invitations'
  AND (storage.foldername(name))[1] = (select auth.uid()::text)
  AND storage.extension(name) IN ('jpg','jpeg','png','gif','webp','svg','bmp','tif','tiff','ico','avif','mp3','wav','ogg','m4a','mp4','aac')
);

CREATE POLICY "Authenticated users can update own invitation assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'invitations'
  AND owner_id = (select auth.uid()::text)
)
WITH CHECK (
  bucket_id = 'invitations'
  AND owner_id = (select auth.uid()::text)
  AND (storage.foldername(name))[1] = (select auth.uid()::text)
);

CREATE POLICY "Authenticated users can delete own invitation assets"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'invitations'
  AND owner_id = (select auth.uid()::text)
);

UPDATE storage.buckets
SET file_size_limit = 5242880,
    allowed_mime_types = ARRAY[
      'image/jpeg','image/png','image/gif','image/webp','image/svg+xml',
      'image/bmp','image/tiff','image/x-icon','image/avif',
      'audio/mpeg','audio/mp3','audio/wav','audio/ogg','audio/x-m4a',
      'audio/mp4','audio/aac','audio/x-wav'
    ]
WHERE id = 'invitations';

COMMIT;
