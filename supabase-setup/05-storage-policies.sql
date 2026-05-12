-- Storage Policies for product-images bucket

-- Anyone can view product images (public read access)
CREATE POLICY "Public read access for product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- Only admins can upload images
CREATE POLICY "Admin upload access for product images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images' AND
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can update images
CREATE POLICY "Admin update access for product images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'product-images' AND
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can delete images
CREATE POLICY "Admin delete access for product images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'product-images' AND
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );