-- Diagnostic Script for Auth Issues
-- Run this to identify why checkout is failing

-- ============================================
-- 1. CHECK AUTH USERS
-- ============================================
SELECT 
    '1. Auth Users' as check_name,
    COUNT(*) as count,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Users exist in auth'
        ELSE '❌ No users in auth'
    END as status
FROM auth.users;

-- ============================================
-- 2. CHECK PUBLIC USERS (PROFILES)
-- ============================================
SELECT 
    '2. Public Users' as check_name,
    COUNT(*) as count,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Profiles exist'
        ELSE '❌ No profiles'
    END as status
FROM public.users;

-- ============================================
-- 3. FIND MISSING PROFILES
-- ============================================
SELECT 
    '3. Missing Profiles' as check_name,
    COUNT(*) as count,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ All auth users have profiles'
        ELSE '❌ Some auth users missing profiles - Run sync-auth-users.sql'
    END as status
FROM auth.users au
LEFT JOIN public.users u ON au.id = u.id
WHERE u.id IS NULL;

-- ============================================
-- 4. LIST USERS WITH MISSING PROFILES
-- ============================================
SELECT 
    au.id,
    au.email,
    au.created_at,
    '❌ Missing Profile' as issue
FROM auth.users au
LEFT JOIN public.users u ON au.id = u.id
WHERE u.id IS NULL
ORDER BY au.created_at DESC;

-- ============================================
-- 5. CHECK TRIGGER EXISTS
-- ============================================
SELECT 
    '5. Auto-Create Trigger' as check_name,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.triggers 
            WHERE trigger_name = 'on_auth_user_created'
        ) THEN '✅ Trigger exists'
        ELSE '❌ Trigger missing - Run rls-policies-fixed.sql'
    END as status;

-- ============================================
-- 6. CHECK RLS POLICIES ON USERS TABLE
-- ============================================
SELECT 
    '6. RLS Policies' as check_name,
    COUNT(*) as policy_count,
    CASE 
        WHEN COUNT(*) >= 3 THEN '✅ Policies exist'
        ELSE '⚠️ May need more policies'
    END as status
FROM pg_policies
WHERE tablename = 'users';

-- ============================================
-- 7. LIST ALL POLICIES ON USERS TABLE
-- ============================================
SELECT 
    policyname,
    cmd,
    CASE 
        WHEN cmd = 'SELECT' THEN '👁️ Read'
        WHEN cmd = 'INSERT' THEN '➕ Create'
        WHEN cmd = 'UPDATE' THEN '✏️ Update'
        WHEN cmd = 'DELETE' THEN '🗑️ Delete'
    END as operation
FROM pg_policies
WHERE tablename = 'users'
ORDER BY cmd, policyname;

-- ============================================
-- 8. RECENT USERS (LAST 5)
-- ============================================
SELECT 
    u.id,
    u.email,
    u.full_name,
    u.role,
    u.created_at,
    '✅ Has Profile' as status
FROM public.users u
ORDER BY u.created_at DESC
LIMIT 5;

-- ============================================
-- SUMMARY REPORT
-- ============================================
SELECT 
    '═══════════════════════════════════════' as separator,
    'DIAGNOSTIC SUMMARY' as title,
    '═══════════════════════════════════════' as separator2;

SELECT 
    'Total Auth Users' as metric,
    COUNT(*)::text as value
FROM auth.users
UNION ALL
SELECT 
    'Total Profiles' as metric,
    COUNT(*)::text as value
FROM public.users
UNION ALL
SELECT 
    'Missing Profiles' as metric,
    COUNT(*)::text as value
FROM auth.users au
LEFT JOIN public.users u ON au.id = u.id
WHERE u.id IS NULL
UNION ALL
SELECT 
    'Trigger Status' as metric,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.triggers 
            WHERE trigger_name = 'on_auth_user_created'
        ) THEN '✅ Active'
        ELSE '❌ Missing'
    END as value
UNION ALL
SELECT 
    'RLS Policies' as metric,
    COUNT(*)::text || ' policies'
FROM pg_policies
WHERE tablename = 'users';

-- ============================================
-- ACTION ITEMS
-- ============================================
SELECT 
    '═══════════════════════════════════════' as separator,
    'ACTION ITEMS' as title,
    '═══════════════════════════════════════' as separator2;

SELECT 
    CASE 
        WHEN (SELECT COUNT(*) FROM auth.users au LEFT JOIN public.users u ON au.id = u.id WHERE u.id IS NULL) > 0 
        THEN '❌ ACTION REQUIRED: Run sync-auth-users.sql to fix missing profiles'
        ELSE '✅ No action needed - all users have profiles'
    END as action_1
UNION ALL
SELECT 
    CASE 
        WHEN NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created')
        THEN '❌ ACTION REQUIRED: Run rls-policies-fixed.sql to create trigger'
        ELSE '✅ Trigger is active'
    END as action_2
UNION ALL
SELECT 
    CASE 
        WHEN (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'users') < 3
        THEN '⚠️ WARNING: May need more RLS policies - check rls-policies-fixed.sql'
        ELSE '✅ RLS policies look good'
    END as action_3;
