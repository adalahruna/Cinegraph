-- Fix Admin Access to Users Table
-- This ensures admin can read their own profile and other users

-- Drop existing policies that might be blocking
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Admin can read all users" ON users;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON users;

-- Create new policies with correct logic

-- 1. Allow users to read their own profile
CREATE POLICY "Users can read own profile"
ON users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- 2. Allow admin to read all users (check role from same table)
CREATE POLICY "Admin can read all users"
ON users
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;
