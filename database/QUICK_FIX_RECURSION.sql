-- QUICK FIX: Infinite Recursion
-- Copy paste this entire script into Supabase SQL Editor and run

-- Drop all policies causing recursion
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Allow user registration" ON users;

-- Create simple policies (NO RECURSION)
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow user registration" ON users
    FOR INSERT WITH CHECK (true);

-- Done! Test checkout now.
