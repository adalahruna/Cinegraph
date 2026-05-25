# Admin Dashboard & Login Fix

## Masalah yang Diperbaiki

### 1. Error di Dashboard Admin
**Error**: `Error getting recent orders: {}`
**Penyebab**: Query dengan JOIN ke tabel `users` diblokir oleh RLS policy

**Solusi**:
- Tambah fallback mechanism: coba query dengan JOIN dulu, kalau gagal query tanpa JOIN
- Dashboard tetap bisa load meskipun RLS memblokir JOIN
- Recent orders tetap muncul (tanpa user detail kalau RLS blokir)
- Ganti `console.error` jadi `console.warn` untuk error yang di-handle

### 2. Login Admin Auto-Redirect
**Masalah**: Login page tidak handle fallback profile dengan baik
**Penyebab**: Login page mengharapkan profile dari database, tapi RLS bisa memblokir akses

**Solusi**:
- `AuthService.signIn()` sekarang selalu return profile (fallback jika perlu)
- Login page disederhanakan - tidak perlu cek RLS lagi
- Admin langsung redirect ke `/dashboard` setelah login
- User biasa redirect ke `/` (homepage)

### 3. Admin Access Denied di Halaman Payments
**Error**: "Access Denied" meskipun sudah login sebagai admin
**Penyebab**: `AdminProtection` pakai `getCurrentUser()` yang return fallback profile dengan `role='user'`

**Solusi**:
- Buat method baru `getCurrentUserStrict()` yang tidak pakai fallback
- `AdminProtection` sekarang pakai strict mode untuk cek role admin
- Kalau profile tidak bisa diambil dari DB, tampilkan error yang jelas
- Tambah SQL script `fix-admin-access.sql` untuk fix RLS policy

## File yang Diubah

### 1. `cinegraph/lib/services/admin.js`
- ✅ `getDashboardStats()` - Tambah fallback query untuk recent orders
- ✅ `getDashboardStats()` - Tambah pengecekan authError
- ✅ `getAllUsers()` - Tambah pengecekan authError
- ✅ `getAllOrders()` - Tambah pengecekan authError
- ✅ `updateUserRole()` - Tambah pengecekan authError
- ✅ `deleteUser()` - Tambah pengecekan authError

### 2. `cinegraph/lib/services/auth.js`
- ✅ `signIn()` - Gunakan fallback profile seperti `getCurrentUser()`
- ✅ `getCurrentUser()` - Tetap pakai fallback untuk compatibility
- ✅ `getCurrentUserStrict()` - NEW: Tanpa fallback, untuk admin check
- ✅ Hapus console.log yang tidak perlu
- ✅ Return tempProfile jika profile fetch gagal

### 3. `cinegraph/app/login/page.js`
- ✅ Sederhanakan handleSubmit
- ✅ Hapus console.log yang tidak perlu
- ✅ Redirect otomatis berdasarkan role

### 4. `cinegraph/app/dashboard/page.js`
- ✅ Handle orders tanpa user data (fallback ke user_id)
- ✅ Tampilkan "No email" kalau user data tidak ada

### 5. `cinegraph/components/AdminProtection.js`
- ✅ Pakai `getCurrentUserStrict()` untuk admin check
- ✅ Tidak terima fallback profile
- ✅ Error message lebih jelas kalau RLS blokir

### 6. `cinegraph/database/fix-admin-access.sql`
- ✅ NEW: SQL script untuk fix RLS policy
- ✅ Drop policy lama yang conflict
- ✅ Buat policy baru: user baca profile sendiri + admin baca semua

## Cara Kerja Fallback Mechanism

### Recent Orders Query:
1. **Coba dengan JOIN**: Query orders + user data
2. **Kalau gagal**: Query orders saja tanpa user data
3. **Dashboard tetap load**: Meskipun tanpa detail user

### Profile Fallback (getCurrentUser):
Jika RLS memblokir akses ke tabel `users`, sistem akan membuat temporary profile dari data auth:

```javascript
const tempProfile = {
  id: user.id,
  email: user.email,
  full_name: user.user_metadata?.full_name || user.email,
  role: 'user', // ALWAYS 'user' for fallback
  phone: user.user_metadata?.phone || null,
  address: null,
  created_at: user.created_at,
  updated_at: user.updated_at
}
```

### Strict Mode (getCurrentUserStrict):
Untuk admin check, pakai strict mode yang **TIDAK** pakai fallback:
- Return `profile: null` kalau RLS blokir
- `AdminProtection` pakai ini untuk validasi admin
- Memastikan role admin benar-benar dari database

**PENTING**: Fallback profile selalu punya `role: 'user'`. Untuk admin, pastikan:
1. User ada di tabel `users` dengan `role = 'admin'`
2. RLS policy mengizinkan admin membaca data sendiri
3. Jalankan `fix-admin-access.sql` untuk fix RLS

## Testing

### Test Login Admin:
1. Login dengan akun admin
2. Harus langsung redirect ke `/dashboard`
3. Dashboard harus load tanpa error
4. Stats harus muncul (user count, product count, order count, revenue)
5. Recent orders harus muncul (meskipun tanpa user detail)

### Test Akses Halaman Admin:
1. Dari dashboard, klik menu "Pembayaran"
2. Harus bisa akses tanpa "Access Denied"
3. Halaman payments harus load normal
4. Coba juga menu Products, Orders, Users

### Test Login User Biasa:
1. Login dengan akun user
2. Harus redirect ke `/` (homepage)
3. Tidak bisa akses `/dashboard` (akan redirect ke home)

## Troubleshooting

### Dashboard masih error?
1. Cek console browser untuk error detail
2. Pastikan sudah run `ALL_IN_ONE_FIX.sql`
3. Cek RLS policy di Supabase dashboard
4. Pastikan user admin ada di tabel `users` dengan `role = 'admin'`

### Recent orders tidak muncul user name?
- Ini normal kalau RLS memblokir JOIN ke tabel users
- Order tetap muncul dengan user_id sebagai fallback
- Untuk fix: update RLS policy agar admin bisa read users table

### "Access Denied" di halaman payments meskipun sudah login admin?
**Penyebab**: RLS policy memblokir admin membaca profile sendiri

**Solusi**:
1. Jalankan SQL script ini di Supabase SQL Editor:
   ```sql
   -- File: cinegraph/database/fix-admin-access.sql
   ```
2. Atau manual update policy di Supabase dashboard
3. Logout dan login lagi
4. Coba akses `/dashboard/payments` lagi

### Login tidak redirect?
1. Cek console browser untuk error
2. Pastikan `AuthService.signIn()` return profile
3. Cek `result.profile.role` di console

### Masih muncul "Profile not found - RLS may be blocking access"?
- Ini berarti RLS policy benar-benar memblokir akses
- Jalankan `fix-admin-access.sql` untuk fix
- Pastikan policy "Users can read own profile" ada dan aktif
- Pastikan policy "Admin can read all users" ada dan aktif
