# Solusi Error "User Not Authenticated"

## 🔴 Error yang Muncul

```
User not authenticated: {}
at OrderService.createOrder (lib/services/orders.js:25:17)
```

Atau:

```
Profile tidak ditemukan. Silakan logout dan login kembali, atau hubungi admin.
```

## 🎯 Penyebab

User sudah **login** di Supabase Auth, tapi **tidak punya profile** di tabel `users`.

Ini terjadi karena:
1. User dibuat sebelum trigger auto-create profile di-setup
2. Trigger gagal execute saat signup
3. Ada masalah dengan RLS policy

## ✅ Solusi Cepat

### Langkah 1: Diagnose Masalah

Buka **Supabase SQL Editor** dan jalankan:

```sql
-- File: cinegraph/database/diagnose-auth-issue.sql
-- Script ini akan cek semua masalah auth
```

Script ini akan show:
- ✅ Apa yang sudah OK
- ❌ Apa yang perlu diperbaiki
- 📋 Action items yang harus dilakukan

### Langkah 2: Fix Missing Profiles

Jika ada user yang missing profile, jalankan:

```sql
-- File: cinegraph/database/sync-auth-users.sql
-- Script ini akan create profile untuk semua auth users
```

Script ini akan:
1. Cari auth users yang belum punya profile
2. Create profile untuk mereka otomatis
3. Verify hasilnya

### Langkah 3: Verify Fix

Jalankan lagi diagnostic script untuk verify:

```sql
-- File: cinegraph/database/diagnose-auth-issue.sql
```

Sekarang semua harus ✅

## 🧪 Testing

Setelah run fix:

### Test 1: Login & Checkout
1. Login dengan user yang tadi error
2. Add produk ke cart
3. Klik "Beli Sekarang"
4. **Expected**: Checkout berhasil, payment modal muncul ✅

### Test 2: New User Registration
1. Register user baru
2. Login
3. Coba checkout
4. **Expected**: Langsung bisa checkout ✅

## 📊 Verification Queries

### Cek Auth User
```sql
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'your@email.com';
```

### Cek Profile
```sql
SELECT id, email, full_name, role 
FROM public.users 
WHERE email = 'your@email.com';
```

### Cek Semua Users
```sql
SELECT 
    au.email,
    CASE 
        WHEN u.id IS NULL THEN '❌ Missing Profile'
        ELSE '✅ Has Profile'
    END as status
FROM auth.users au
LEFT JOIN public.users u ON au.id = u.id
ORDER BY au.created_at DESC;
```

## 🔧 Manual Fix (Jika Perlu)

Jika hanya 1-2 user yang bermasalah, bisa fix manual:

```sql
-- Ganti USER_ID dan EMAIL dengan data yang benar
INSERT INTO public.users (id, email, full_name, role, created_at, updated_at)
VALUES (
    'USER_ID_DARI_AUTH_USERS',  -- UUID
    'user@example.com',
    'Nama User',
    'user',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO NOTHING;
```

## 🛡️ Prevention (Agar Tidak Terjadi Lagi)

### Pastikan Trigger Aktif

Cek trigger:
```sql
SELECT trigger_name, event_object_table, action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

Jika tidak ada, run:
```sql
-- File: cinegraph/database/rls-policies-fixed.sql
-- Bagian bawah ada trigger setup
```

### Pastikan RLS Policies OK

Cek policies:
```sql
SELECT policyname, cmd
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;
```

Expected policies:
- ✅ "Allow user registration" (INSERT)
- ✅ "Users can view own profile" (SELECT)
- ✅ "Users can update own profile" (UPDATE)
- ✅ "Admins can view all users" (SELECT)

## 🚨 Common Issues

### Issue 1: Trigger Tidak Ada
**Symptom**: User baru register tapi profile tidak terbuat
**Fix**: Run `rls-policies-fixed.sql`

### Issue 2: RLS Policy Blocking
**Symptom**: Error "row-level security policy violation"
**Fix**: Check dan update RLS policies

### Issue 3: Multiple Missing Profiles
**Symptom**: Banyak user tidak bisa checkout
**Fix**: Run `sync-auth-users.sql` untuk sync semua

## 📁 Files

### Diagnostic
- `cinegraph/database/diagnose-auth-issue.sql` - Cek masalah

### Fix Scripts
- `cinegraph/database/sync-auth-users.sql` - Sync users
- `cinegraph/database/rls-policies-fixed.sql` - Setup trigger & policies

### Documentation
- `cinegraph/AUTH_FIX_GUIDE.md` - Detailed guide (English)
- `cinegraph/SOLUSI_ERROR_AUTH.md` - Panduan ini

## ✅ Checklist

Sebelum test:
- [ ] Run `diagnose-auth-issue.sql`
- [ ] Run `sync-auth-users.sql` (jika ada missing profiles)
- [ ] Verify trigger exists
- [ ] Verify RLS policies
- [ ] Test login & checkout
- [ ] Test new user registration

## 💡 Tips

1. **Selalu run diagnostic dulu** sebelum fix
2. **Backup database** sebelum run script
3. **Test dengan 1 user dulu** sebelum production
4. **Monitor logs** untuk error tracking
5. **Setup trigger** untuk prevent masalah di future

## 🆘 Masih Error?

Jika masih ada masalah:

1. **Run diagnostic script** dan share hasilnya
2. **Check browser console** (F12) untuk error details
3. **Check Supabase logs** untuk server-side errors
4. **Share error message** lengkap dengan stack trace

### Info yang Dibutuhkan:
- Output dari `diagnose-auth-issue.sql`
- Error message dari browser console
- User email yang bermasalah
- Screenshot jika perlu

## 🎯 Expected Result

Setelah fix:
- ✅ Semua auth users punya profile
- ✅ Trigger aktif untuk user baru
- ✅ RLS policies configured
- ✅ Checkout works untuk semua user
- ✅ No more "User not authenticated" error
