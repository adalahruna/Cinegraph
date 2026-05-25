-- DIAGNOSE ADMIN ISSUE
-- Script untuk cek kenapa admin tidak bisa akses dashboard

-- ============================================
-- CHECK 1: Apakah user ada di tabel users?
-- ============================================
SELECT 
    'CHECK 1: User exists in users table' as check_name,
    COUNT(*) as user_count,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ PASS'
        ELSE '❌ FAIL - User tidak ada di tabel users'
    END as status
FROM users 
WHERE email = 'emailkamu@example.com';  -- GANTI DENGAN EMAIL KAMU

-- ============================================
-- CHECK 2: Apakah role sudah 'admin'?
-- ============================================
SELECT 
    'CHECK 2: User role is admin' as check_name,
    email,
    role,
    CASE 
        WHEN role = 'admin' THEN '✅ PASS'
        ELSE '❌ FAIL - Role masih: ' || role
    END as status
FROM users 
WHERE email = 'emailkamu@example.com';  -- GANTI DENGAN EMAIL KAMU

-- ============================================
-- CHECK 3: Apakah RLS enabled di tabel users?
-- ============================================
SELECT 
    'CHECK 3: RLS status' as check_name,
    schemaname,
    tablename,
    rowsecurity as rls_enabled,
    CASE 
        WHEN rowsecurity = true THEN '⚠️ RLS ENABLED - Perlu policy yang benar'
        ELSE '✅ RLS DISABLED - Tidak perlu policy'
    END as status
FROM pg_tables 
WHERE tablename = 'users';

-- ============================================
-- CHECK 4: Policy apa saja yang ada?
-- ============================================
SELECT 
    'CHECK 4: Existing policies' as check_name,
    policyname,
    cmd as command,
    qual as condition,
    CASE 
        WHEN policyname LIKE '%own%' OR policyname LIKE '%authenticated%' THEN '✅ GOOD'
        WHEN policyname LIKE '%admin%' AND qual LIKE '%EXISTS%' THEN '⚠️ RECURSIVE - Bisa bikin masalah'
        ELSE '⚠️ CHECK MANUALLY'
    END as status
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;

-- ============================================
-- CHECK 5: Coba query sebagai user (simulate app)
-- ============================================
-- Ini akan gagal kalau RLS blokir
SELECT 
    'CHECK 5: Can read own profile' as check_name,
    id,
    email,
    role,
    '✅ PASS - Bisa baca profile' as status
FROM users 
WHERE email = 'emailkamu@example.com';  -- GANTI DENGAN EMAIL KAMU

-- ============================================
-- CHECK 6: Cek auth.users (user di authentication)
-- ============================================
SELECT 
    'CHECK 6: User exists in auth' as check_name,
    id,
    email,
    created_at,
    '✅ User ada di auth.users' as status
FROM auth.users 
WHERE email = 'emailkamu@example.com';  -- GANTI DENGAN EMAIL KAMU

-- ============================================
-- SUMMARY: Semua admin yang ada
-- ============================================
SELECT 
    '=== SUMMARY: All Admins ===' as info,
    id,
    email,
    full_name,
    role,
    created_at
FROM users 
WHERE role = 'admin'
ORDER BY created_at DESC;

-- ============================================
-- QUICK FIX: Kalau role masih 'user'
-- ============================================
-- Uncomment baris di bawah dan ganti emailnya, lalu jalankan
-- UPDATE users SET role = 'admin' WHERE email = 'emailkamu@example.com';

-- ============================================
-- INTERPRETASI HASIL:
-- ============================================
-- ✅ CHECK 1 PASS + CHECK 2 PASS = User ada dan role sudah admin
--    → Masalahnya di RLS policy, jalankan ULTIMATE_ADMIN_FIX.sql
--
-- ❌ CHECK 1 FAIL = User tidak ada di tabel users
--    → Jalankan sync-auth-users.sql atau insert manual
--
-- ❌ CHECK 2 FAIL = Role masih 'user'
--    → Jalankan: UPDATE users SET role = 'admin' WHERE email = '...';
--
-- ⚠️ CHECK 3 = RLS ENABLED + CHECK 4 ada policy recursive
--    → Jalankan ULTIMATE_ADMIN_FIX.sql untuk fix policy
--
-- ❌ CHECK 5 FAIL (no rows) = RLS blokir query
--    → Jalankan ULTIMATE_ADMIN_FIX.sql
