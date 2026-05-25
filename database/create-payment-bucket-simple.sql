-- Simple script to create payment-proofs bucket
-- Run this in Supabase SQL Editor if bucket doesn't exist

-- Create bucket (will fail silently if already exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-proofs', 'payment-proofs', true)
ON CONFLICT (id) DO NOTHING;

-- Note: If you get an error about storage.buckets not existing,
-- you need to create the bucket manually through Supabase Dashboard:
-- 1. Go to Storage in Supabase Dashboard
-- 2. Click "New Bucket"
-- 3. Name: payment-proofs
-- 4. Public: Yes
-- 5. Click Create

COMMIT;