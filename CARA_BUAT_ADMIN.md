# Cara Membuat Akun Admin

## ⚠️ MASALAH: Sudah Jadi Admin Tapi Masih Kebaca User?

Kalau kamu sudah update role jadi 'admin' di database tapi di web masih kebaca 'user', **masalahnya adalah RLS Policy memblokir aplikasi membaca profile kamu**.

### SOLUSI CEPAT (3 Langkah):

1. **Jalankan script ini di Supabase SQL Editor:**
   ```sql
   -- File: cinegraph/database/ULTIMATE_ADMIN_FIX.sql
   -- Copy paste SEMUA isi file itu
   ```

2. **Logout dari aplikasi** (PENTING!)

3. **Login lagi** → Sekarang harusnya bisa akses dashboard

---

## Diagnose Masalah (Opsional)

Kalau masih tidak bisa, jalankan script diagnostic:

```sql
-- File: cinegraph/database/diagnose-admin-issue.sql
-- Ganti 'emailkamu@example.com' dengan email kamu
-- Script ini akan cek semua kemungkinan masalah
```

Script akan kasih tau:
- ✅ User ada di database atau tidak
- ✅ Role sudah 'admin' atau masih 'user'
- ✅ RLS policy apa yang aktif
- ✅ Kenapa aplikasi tidak bisa baca profile

---

## Cara Membuat Akun Admin (Dari Awal)

Ada 3 cara untuk membuat akun admin di CineGraph:

### Cara 1: Update User yang Sudah Ada (PALING MUDAH)

Kalau kamu sudah punya akun user biasa, tinggal upgrade jadi admin:

#### Langkah-langkah:
1. **Buka Supabase Dashboard** → Project kamu → SQL Editor
2. **Jalankan query ini** (ganti emailnya):
   ```sql
   UPDATE users 
   SET role = 'admin' 
   WHERE email = 'emailkamu@example.com';
   ```
3. **Jalankan ULTIMATE_ADMIN_FIX.sql** untuk fix RLS:
   ```sql
   -- Copy paste semua isi file ULTIMATE_ADMIN_FIX.sql
   ```
4. **Logout** dari aplikasi
5. **Login lagi** dengan akun yang sama
6. **Sekarang kamu admin!** Akan langsung redirect ke `/dashboard`

---

### Cara 2: Daftar Akun Baru Lalu Jadikan Admin

Kalau belum punya akun sama sekali:

#### Langkah-langkah:
1. **Buka aplikasi** → Klik "Login" atau buka `/login`
2. **Daftar akun baru** dengan email dan password
3. **Buka Supabase Dashboard** → SQL Editor
4. **Jalankan query ini** (ganti emailnya):
   ```sql
   UPDATE users 
   SET role = 'admin' 
   WHERE email = 'emailbarukami@example.com';
   ```
5. **Jalankan ULTIMATE_ADMIN_FIX.sql**
6. **Logout** dari aplikasi
7. **Login lagi** dengan akun baru
8. **Sekarang kamu admin!**

---

### Cara 3: Insert Admin Langsung ke Database (ADVANCED)

Kalau mau insert admin langsung tanpa daftar lewat UI:

#### Langkah-langkah:
1. **Buka Supabase Dashboard** → Authentication → Users
2. **Klik "Add User"** atau "Invite User"
3. **Isi email dan password** untuk admin baru
4. **Copy User ID** yang baru dibuat
5. **Buka SQL Editor** dan jalankan:
   ```sql
   INSERT INTO users (id, email, full_name, role, created_at, updated_at)
   VALUES (
     'USER_ID_DARI_STEP_4',  -- Paste user ID di sini
     'admin@example.com',     -- Email admin
     'Admin CineGraph',       -- Nama lengkap
     'admin',                 -- Role: admin
     NOW(),
     NOW()
   )
   ON CONFLICT (id) DO UPDATE 
   SET role = 'admin';
   ```
6. **Jalankan ULTIMATE_ADMIN_FIX.sql**
7. **Login** dengan email dan password yang dibuat di step 2
8. **Sekarang kamu admin!**

---

## Cara Cek Siapa Aja yang Admin

Jalankan query ini di SQL Editor:

```sql
SELECT id, email, full_name, role, created_at 
FROM users 
WHERE role = 'admin'
ORDER BY created_at DESC;
```

---

## Troubleshooting

### 1. Sudah update role tapi masih tidak bisa akses dashboard?

**Penyebab:** RLS policy memblokir aplikasi membaca profile

**Solusi:**
1. **Jalankan ULTIMATE_ADMIN_FIX.sql** (file lengkap ada di `cinegraph/database/`)
2. **Logout** dari aplikasi (penting!)
3. **Clear browser cache** atau buka incognito/private window
4. **Login lagi**

### 2. Muncul "Access Denied" atau "Profile not found"?

**Penyebab:** RLS policy terlalu strict atau recursive

**Solusi:**
1. Jalankan script diagnostic:
   ```sql
   -- File: cinegraph/database/diagnose-admin-issue.sql
   ```
2. Lihat hasil CHECK 1-6
3. Jalankan ULTIMATE_ADMIN_FIX.sql
4. Logout dan login lagi

### 3. User tidak muncul di tabel users?

**Penyebab:** User baru daftar tapi belum masuk ke tabel `users`

**Solusi:**
1. Jalankan script `sync-auth-users.sql`:
   ```sql
   -- File: cinegraph/database/sync-auth-users.sql
   ```
2. Atau manual insert:
   ```sql
   -- Cek user di auth
   SELECT id, email FROM auth.users WHERE email = 'emailkamu@example.com';
   
   -- Insert ke users table
   INSERT INTO users (id, email, full_name, role)
   VALUES (
     'USER_ID_DARI_QUERY_ATAS',
     'emailkamu@example.com',
     'Nama Kamu',
     'admin'
   );
   ```

### 4. Di database role sudah 'admin' tapi di web masih 'user'?

**Penyebab:** Ini masalah RLS policy 100%

**Solusi PASTI:**
```sql
-- 1. Drop semua policy lama
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Admin can read all users" ON users;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON users;

-- 2. Buat policy simple
CREATE POLICY "authenticated_users_read_own_profile"
ON users FOR SELECT TO authenticated
USING (auth.uid() = id);

-- 3. Verify
SELECT * FROM users WHERE email = 'emailkamu@example.com';
```

Atau lebih mudah: **Jalankan ULTIMATE_ADMIN_FIX.sql**

---

## Quick Reference

### Update user jadi admin:
```sql
UPDATE users SET role = 'admin' WHERE email = 'email@example.com';
```

### Fix RLS policy (PENTING!):
```sql
-- Jalankan file: ULTIMATE_ADMIN_FIX.sql
```

### Cek semua admin:
```sql
SELECT * FROM users WHERE role = 'admin';
```

### Cek semua user:
```sql
SELECT id, email, full_name, role FROM users ORDER BY created_at DESC;
```

### Downgrade admin jadi user biasa:
```sql
UPDATE users SET role = 'user' WHERE email = 'email@example.com';
```

---

## File SQL yang Berguna

- **`ULTIMATE_ADMIN_FIX.sql`** ⭐ - Fix RLS policy (WAJIB JALANKAN!)
- **`diagnose-admin-issue.sql`** - Cek masalah admin access
- `create-admin-account.sql` - Template untuk buat admin
- `fix-admin-access.sql` - Fix RLS policy (versi lama)
- `sync-auth-users.sql` - Sync user dari auth ke users table
- `ALL_IN_ONE_FIX.sql` - Fix semua masalah sekaligus

Semua file ada di folder `cinegraph/database/`

---

## Kenapa Harus Logout dan Login Lagi?

Karena aplikasi **cache profile di browser**. Kalau tidak logout:
- Browser masih pakai profile lama (role='user')
- Meskipun di database sudah 'admin'
- Aplikasi tidak tau ada perubahan

Setelah logout dan login lagi:
- Aplikasi fetch profile baru dari database
- Dapat role='admin' yang benar
- Bisa akses dashboard admin
