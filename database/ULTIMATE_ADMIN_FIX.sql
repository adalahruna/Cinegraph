-- ULTIMATE ADMIN FIX
-- Script ini akan fix semua masalah admin access sekaligus

-- ============================================
-- STEP 1: Drop semua policy lama yang conflict
-- ============================================
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Admin can read all users" ON users;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON users;
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Admin full access" ON users;
DROP POLICY IF EXISTS "Public read access" ON users;

-- ============================================
-- STEP 2: Buat policy baru yang simple dan jelas
-- ============================================

-- Policy 1: Semua authenticated user bisa baca profile sendiri
CREATE POLICY "authenticated_users_read_own_profile"
ON users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Policy 2: Semua authenticated user bisa update profile sendiri
CREATE POLICY "authenticated_users_update_own_profile"
ON users
FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- ============================================
-- STEP 3: Verify policies
-- ============================================
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;

-- ============================================
-- STEP 4: Test query (ganti dengan email kamu)
-- ============================================
-- Cek apakah role sudah admin
SELECT id, email, full_name, role, created_at 
FROM users 
WHERE email = 'emailkamu@example.com';

-- Kalau role masih 'user', update jadi 'admin'
-- UPDATE users SET role = 'admin' WHERE email = 'emailkamu@example.com';

-- ============================================
-- STEP 5: Cek semua admin
-- ============================================
SELECT id, email, full_name, role, created_at 
FROM users 
WHERE role = 'admin'
ORDER BY created_at DESC;

-- ============================================
-- NOTES:
-- ============================================
-- Policy yang dibuat sangat simple:
-- 1. User bisa baca profile sendiri (termasuk admin)
-- 2. User bisa update profile sendiri
-- 
-- Tidak ada policy khusus admin karena:
-- - Admin juga user, jadi bisa baca profile sendiri
-- - Untuk baca user lain, admin pakai service account atau API
-- 
-- Setelah jalankan script ini:
-- 1. Logout dari aplikasi
-- 2. Clear browser cache atau buka incognito
-- 3. Login lagi
-- 4. Sekarang harusnya bisa akses dashboard admin
