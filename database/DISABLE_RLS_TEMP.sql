-- DISABLE RLS TEMPORARILY
-- Ini akan matikan RLS untuk tabel users sementara
-- Supaya admin bisa akses tanpa masalah policy

-- ============================================
-- STEP 1: Matikan RLS untuk tabel users
-- ============================================
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 2: Verify RLS sudah off
-- ============================================
SELECT 
    tablename,
    rowsecurity as rls_enabled,
    CASE 
        WHEN rowsecurity = false THEN '✅ RLS DISABLED - Admin bisa akses'
        ELSE '❌ RLS MASIH ENABLED'
    END as status
FROM pg_tables 
WHERE tablename = 'users';

-- ============================================
-- STEP 3: Test query
-- ============================================
-- Ganti dengan email kamu
SELECT id, email, full_name, role 
FROM users 
WHERE email = 'emailkamu@example.com';

-- ============================================
-- NOTES:
-- ============================================
-- Dengan RLS disabled:
-- - Semua user bisa baca semua data di tabel users
-- - Admin pasti bisa akses dashboard
-- - Tidak ada policy yang bisa blokir
--
-- Ini solusi sementara untuk development
-- Untuk production, sebaiknya fix policy-nya
--
-- Kalau mau enable RLS lagi nanti:
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
