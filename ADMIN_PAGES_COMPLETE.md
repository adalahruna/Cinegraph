# Admin Pages - Complete Setup

## Halaman Admin yang Tersedia

Semua halaman admin sudah dibuat dan berfungsi dengan baik:

### 1. Dashboard (`/dashboard`)
**Fitur:**
- Overview statistik (total users, products, orders, revenue)
- Recent orders (5 pesanan terbaru)
- Quick actions ke halaman lain
- Fallback mechanism untuk data yang tidak bisa diload

**File:** `cinegraph/app/dashboard/page.js`

### 2. Kelola Produk (`/dashboard/products`)
**Fitur:**
- Daftar semua produk dengan gambar
- Status aktif/nonaktif
- Info harga, stok, kategori
- Grid layout responsive

**File:** `cinegraph/app/dashboard/products/page.js`

### 3. Kelola Pesanan (`/dashboard/orders`)
**Fitur:**
- Daftar semua pesanan
- Filter berdasarkan status (pending, awaiting_payment, confirmed, shipped, delivered, cancelled)
- Detail order items
- Info pembayaran dan alamat pengiriman
- Status badge dengan warna berbeda

**File:** `cinegraph/app/dashboard/orders/page.js`

### 4. Kelola Pengguna (`/dashboard/users`)
**Fitur:**
- Tabel daftar semua pengguna
- Info lengkap (nama, email, telepon, role, tanggal daftar)
- Badge role (Admin/User)
- Statistik total users, admin, dan user biasa

**File:** `cinegraph/app/dashboard/users/page.js`

### 5. Konfirmasi Pembayaran (`/dashboard/payments`)
**Fitur:**
- Daftar pesanan yang menunggu konfirmasi pembayaran
- Modal konfirmasi (setujui/tolak)
- Catatan admin
- Link ke bukti pembayaran

**File:** `cinegraph/app/dashboard/payments/page.js`

## Perlindungan Admin

Semua halaman admin dilindungi dengan `AdminProtection` component yang:
- Cek autentikasi user
- Cek role admin dari database (bukan fallback profile)
- Redirect ke login jika belum login
- Redirect ke homepage jika bukan admin

**File:** `cinegraph/components/AdminProtection.js`

## Navigasi Dashboard

Dashboard utama punya navbar dengan link ke:
- Produk (`/dashboard/products`)
- Pesanan (`/dashboard/orders`)
- Pembayaran (`/dashboard/payments`)
- Pengguna (`/dashboard/users`)

## API Endpoints yang Digunakan

### Products
- `GET /api/products` - Ambil semua produk

### Orders
- `GET /api/admin/orders` - Ambil semua pesanan (admin only)

### Users
- `GET /api/admin/users` - Ambil semua pengguna (admin only)

### Payments
- `GET /api/admin/payment-confirmations` - Ambil pesanan menunggu konfirmasi
- `POST /api/admin/payment-confirmations` - Konfirmasi/tolak pembayaran

### Stats
- `GET /api/admin/stats` - Ambil statistik dashboard (digunakan oleh AdminService)

## Cara Akses

1. **Login sebagai Admin:**
   - Buka `/login`
   - Login dengan akun yang punya `role = 'admin'` di database
   - Otomatis redirect ke `/dashboard`

2. **Navigasi:**
   - Dari dashboard, klik menu di navbar untuk ke halaman lain
   - Atau akses langsung via URL (misal `/dashboard/products`)

## Troubleshooting

### "Access Denied" meskipun sudah login admin
**Penyebab:** Profile di database tidak punya `role = 'admin'`

**Solusi:**
1. Cek di Supabase dashboard, tabel `users`
2. Pastikan user yang login punya `role = 'admin'`
3. Kalau belum, update manual:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
   ```

### Halaman loading terus
**Penyebab:** API endpoint error atau RLS policy memblokir

**Solusi:**
1. Cek console browser untuk error detail
2. Pastikan sudah run `ALL_IN_ONE_FIX.sql`
3. Cek RLS policy di Supabase

### Data tidak muncul
**Penyebab:** Belum ada data di database atau RLS memblokir

**Solusi:**
1. Untuk products: Jalankan `insert-mock-products.sql`
2. Untuk orders: Buat order dari user biasa
3. Untuk users: Daftar user baru dari `/login`

## Fitur yang Bisa Ditambahkan Nanti

- Edit/delete produk
- Update status pesanan
- Edit role user
- Delete user
- Export data ke CSV/Excel
- Search dan pagination
- Upload gambar produk baru
- Bulk actions
