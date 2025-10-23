-- Create storage bucket for claim photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('claim-photos', 'claim-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for claim photos
-- Allow authenticated users to upload their own claim photos
CREATE POLICY "Users can upload claim photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'claim-photos');

-- Allow authenticated users to view all claim photos (for now - can be restricted later)
CREATE POLICY "Users can view claim photos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'claim-photos');

-- Allow users to delete their own claim photos
CREATE POLICY "Users can delete their own claim photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'claim-photos');
