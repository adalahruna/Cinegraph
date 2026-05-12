# Supabase Setup Instructions untuk LensaNusantara

## Langkah-langkah Setup

### 1. Persiapan
1. Buat akun di [supabase.com](https://supabase.com)
2. Buat project baru dengan nama `lensa-nusantara`
3. Copy Project URL dan API Keys ke file `.env.local`

### 2. Jalankan SQL Scripts
Masuk ke **Supabase Dashboard > SQL Editor** dan jalankan file-file SQL berikut **secara berurutan**:

1. `01-user-profiles.sql` - Buat tabel user profiles dan trigger
2. `02-products.sql` - Buat tabel products dengan index
3. `03-orders.sql` - Buat tabel orders dan order_items
4. `04-rls-policies.sql` - Setup Row Level Security policies
5. `05-storage-policies.sql` - Setup Storage policies (setelah buat bucket)
6. `06-functions-and-data.sql` - Buat functions dan sample data

### 3. Setup Storage Bucket
1. Masuk ke **Storage** di Supabase Dashboard
2. Klik **"New bucket"**
3. Nama: `product-images`
4. Centang **"Public bucket"**
5. Klik **"Create bucket"**

### 4. Buat Admin User
1. Daftar akun pertama melalui aplikasi Next.js
2. Copy User ID dari **Authentication > Users**
3. Jalankan query ini di SQL Editor:
```sql
UPDATE public.user_profiles 
SET role = 'admin' 
WHERE id = 'your-user-uuid-here';
```

### 5. Test Setup
Cek apakah setup berhasil:
- Tabel `user_profiles`, `products`, `orders`, `order_items` sudah ada
- RLS policies aktif di semua tabel
- Storage bucket `product-images` sudah dibuat
- Sample products sudah ter-insert

## Environment Variables
Pastikan file `.env.local` sudah diisi:
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Troubleshooting
- Jika ada error RLS, pastikan policies sudah dijalankan setelah enable RLS
- Jika storage upload gagal, cek apakah bucket sudah dibuat dan policies sudah aktif
- Jika trigger tidak jalan, pastikan function `handle_new_user()` sudah dibuat