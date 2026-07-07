
CREATE POLICY "public-assets read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'public-assets');

CREATE POLICY "public-assets admin insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'public-assets' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "public-assets admin update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'public-assets' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'public-assets' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "public-assets admin delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'public-assets' AND public.has_role(auth.uid(), 'admin'));
