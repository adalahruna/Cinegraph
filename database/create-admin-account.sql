-- Create Admin Account
-- Script untuk membuat akun admin baru

-- CARA 1: Update user yang sudah ada jadi admin
-- Ganti 'user@example.com' dengan email akun yang mau dijadikan admin
UPDATE users 
SET role = 'admin' 
WHERE email = 'user@example.com';

-- Verify
SELECT id, email, full_name, role, created_at 
FROM users 
WHERE email = 'user@example.com';


-- CARA 2: Insert admin baru langsung (kalau belum punya akun)
-- PENTING: User harus daftar dulu lewat /login, baru jalankan script ini
-- Karena kita perlu user ID dari auth.users

-- Cek user ID dari auth
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'admin@example.com';

-- Insert ke tabel users dengan role admin
-- Ganti 'USER_ID_DARI_AUTH' dengan ID yang didapat dari query di atas
INSERT INTO users (id, email, full_name, phone, role, created_at, updated_at)
VALUES (
  'USER_ID_DARI_AUTH',  -- Ganti dengan user ID dari auth.users
  'admin@example.com',   -- Email admin
  'Admin CineGraph',     -- Nama lengkap
  '081234567890',        -- Nomor telepon (opsional)
  'admin',               -- Role: admin
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE 
SET role = 'admin';


-- CARA 3: Cari semua user dan pilih mana yang mau dijadikan admin
SELECT id, email, full_name, role, created_at 
FROM users 
ORDER BY created_at DESC;

-- Setelah tahu ID-nya, update role jadi admin
UPDATE users 
SET role = 'admin' 
WHERE id = 'USER_ID_YANG_MAU_DIJADIKAN_ADMIN';


-- Verify semua admin
SELECT id, email, full_name, role, created_at 
FROM users 
WHERE role = 'admin'
ORDER BY created_at DESC;
