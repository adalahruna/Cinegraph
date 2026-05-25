# Auth Fix Guide - User Not Authenticated Error

## Problem

Error saat checkout: "User not authenticated" atau "Profile tidak ditemukan"

### Root Cause
User sudah login di Supabase Auth (`auth.users`) tapi tidak punya record di tabel `users` (public schema).

Ini bisa terjadi karena:
1. User dibuat sebelum trigger `on_auth_user_created` di-setup
2. Trigger gagal execute saat signup
3. RLS policy blocking insert ke tabel users

## Quick Fix

### Option 1: Sync Existing Users (Recommended)
Jalankan script ini di Supabase SQL Editor:

```sql
-- File: cinegraph/database/sync-auth-users.sql
-- Script ini akan sync semua auth users ke tabel users
```

Script ini akan:
1. Cek auth users yang belum punya profile
2. Create profile untuk mereka
3. Verify hasilnya

### Option 2: Manual Fix (Jika hanya 1-2 user)
Jika kamu tahu user ID yang bermasalah:

```sql
-- Replace USER_ID dan EMAIL dengan data yang benar
INSERT INTO public.users (id, email, full_name, role, created_at, updated_at)
VALUES (
    'USER_ID',  -- UUID dari auth.users
    'user@example.com',
    'User Name',
    'user',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO NOTHING;
```

### Option 3: Logout & Re-register
User bisa:
1. Logout dari aplikasi
2. Register ulang dengan email yang sama
3. Trigger akan otomatis create profile

## Verification

Setelah run fix, verify dengan query ini:

```sql
-- Check if all auth users have profiles
SELECT 
    au.id,
    au.email,
    u.id as profile_id,
    CASE 
        WHEN u.id IS NULL THEN '❌ Missing Profile'
        ELSE '✅ Has Profile'
    END as status
FROM auth.users au
LEFT JOIN public.users u ON au.id = u.id
ORDER BY au.created_at DESC;
```

Expected: Semua user harus punya status "✅ Has Profile"

## Prevention

Pastikan trigger sudah aktif untuk prevent masalah ini di future:

```sql
-- Check if trigger exists
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

Expected: Harus ada 1 row dengan trigger details

Jika tidak ada, run script ini:

```sql
-- File: cinegraph/database/rls-policies-fixed.sql
-- Bagian paling bawah ada trigger setup
```

## Testing

Setelah fix, test flow ini:

### Test 1: Existing User
1. Login dengan user yang tadi error
2. Coba checkout
3. Should work now ✅

### Test 2: New User
1. Register user baru
2. Check di database: `SELECT * FROM users WHERE email = 'new@user.com'`
3. Profile harus otomatis terbuat ✅
4. Coba checkout
5. Should work ✅

## Error Messages

### Before Fix
```
User not authenticated: {}
at OrderService.createOrder
```

### After Fix
```
Order created successfully
Checkout completed in 2-5 seconds
```

## Common Issues

### Issue 1: "Profile tidak ditemukan"
**Cause**: User ada di auth.users tapi tidak di users table
**Fix**: Run `sync-auth-users.sql`

### Issue 2: "new row violates row-level security policy"
**Cause**: RLS policy blocking insert
**Fix**: Check RLS policies, pastikan ada policy "Allow user registration"

### Issue 3: Trigger tidak jalan
**Cause**: Trigger belum dibuat atau disabled
**Fix**: Run trigger creation script dari `rls-policies-fixed.sql`

## Files

### Fix Scripts
1. `cinegraph/database/sync-auth-users.sql` - Sync existing users
2. `cinegraph/database/rls-policies-fixed.sql` - Contains trigger setup

### Code Changes
1. `cinegraph/lib/services/orders.js` - Better error messages

## Checklist

Before testing:
- [ ] Run `sync-auth-users.sql`
- [ ] Verify all auth users have profiles
- [ ] Check trigger exists and is active
- [ ] Test with existing user
- [ ] Test with new registration

## Support

If still having issues:

1. **Check auth user exists**:
```sql
SELECT id, email FROM auth.users WHERE email = 'user@example.com';
```

2. **Check profile exists**:
```sql
SELECT id, email, role FROM public.users WHERE email = 'user@example.com';
```

3. **Check RLS policies**:
```sql
SELECT * FROM pg_policies WHERE tablename = 'users';
```

4. **Check trigger**:
```sql
SELECT * FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created';
```

Share results if problem persists.
