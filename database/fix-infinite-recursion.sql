-- Fix Infinite Recursion in RLS Policies
-- The admin policy causes recursion because it queries the users table within the users table policy

-- ============================================
-- STEP 1: Drop ALL existing policies on users table
-- ============================================
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Allow user registration" ON users;

-- ============================================
-- STEP 2: Create simple, non-recursive policies
-- ============================================

-- Allow users to view their own profile (no recursion)
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT 
    USING (auth.uid() = id);

-- Allow users to update their own profile (no recursion)
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE 
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Allow user registration (no recursion)
CREATE POLICY "Allow user registration" ON users
    FOR INSERT 
    WITH CHECK (true);

-- ============================================
-- STEP 3: Disable RLS temporarily for admin operations
-- ============================================
-- Instead of a recursive policy, we'll handle admin checks in application code
-- OR use a service role key for admin operations

-- ============================================
-- STEP 4: Verify policies
-- ============================================
SELECT 
    policyname,
    cmd as operation,
    qual as using_expression,
    with_check as check_expression
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;

-- ============================================
-- STEP 5: Test queries
-- ============================================

-- This should work (user viewing own profile)
-- SELECT * FROM users WHERE id = auth.uid();

-- This should work (user updating own profile)
-- UPDATE users SET full_name = 'New Name' WHERE id = auth.uid();

-- This should work (new user registration)
-- INSERT INTO users (id, email, role) VALUES ('...', '...', 'user');

COMMIT;
