-- Sync existing auth.users to public.users table
-- This fixes the "User not authenticated" error when profile is missing

-- First, let's see which auth users don't have profiles
SELECT 
    au.id,
    au.email,
    au.created_at as auth_created,
    u.id as profile_id
FROM auth.users au
LEFT JOIN public.users u ON au.id = u.id
WHERE u.id IS NULL;

-- Insert missing user profiles
-- This will create profiles for any auth users that don't have them
INSERT INTO public.users (id, email, full_name, role, created_at, updated_at)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'full_name', au.email) as full_name,
    'user' as role,
    au.created_at,
    NOW() as updated_at
FROM auth.users au
LEFT JOIN public.users u ON au.id = u.id
WHERE u.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Verify sync
SELECT 
    COUNT(*) as total_auth_users,
    (SELECT COUNT(*) FROM public.users) as total_profiles,
    COUNT(*) - (SELECT COUNT(*) FROM public.users) as missing_profiles
FROM auth.users;

-- Show synced users
SELECT 
    u.id,
    u.email,
    u.full_name,
    u.role,
    u.created_at
FROM public.users u
ORDER BY u.created_at DESC
LIMIT 10;
