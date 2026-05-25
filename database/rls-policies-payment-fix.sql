-- Fix RLS policies to allow users to update their own orders for payment proof upload
-- This adds the missing UPDATE policy for users on their own orders

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can update own orders" ON orders;

-- Allow users to update their own orders (for payment proof upload)
CREATE POLICY "Users can update own orders" ON orders
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'orders'
ORDER BY policyname;
