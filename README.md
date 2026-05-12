# LensaNusantara - E-commerce Photography Equipment

Platform e-commerce untuk penjualan kamera, lensa, dan peralatan fotografi dengan sistem role-based access control.

## Tech Stack
- **Frontend**: Next.js 14+ (App Router), Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Authentication**: Supabase Auth dengan role management
- **Database**: PostgreSQL dengan Row Level Security (RLS)

## Quick Start

### 1. Clone dan Install Dependencies
```bash
git clone <repository-url>
cd lensa-nusantara
npm install
```

### 2. Setup Environment Variables
```bash
cp .env.local.example .env.local
# Edit .env.local dengan Supabase credentials kamu
```

### 3. Setup Supabase Backend
Ikuti instruksi lengkap di [`supabase-setup/README.md`](./supabase-setup/README.md)

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) dengan browser.

## Features

### User Features
- 🔐 User registration dan login
- 📱 Product catalog dengan grid layout
- 🛒 Shopping cart management
- 💳 Checkout process (payment simulation)
- 📋 Order history

### Admin Features
- 👨‍💼 Admin dashboard dengan role-based access
- 📦 Product management (CRUD operations)
- 🖼️ Image upload ke Supabase Storage
- 📊 Order monitoring dan management
- 🔒 Row Level Security enforcement

## Project Structure
```
├── src/
│   ├── app/              # Next.js App Router pages
│   └── lib/
│       └── supabase.js   # Supabase client configuration
├── supabase-setup/       # Database setup scripts
│   ├── 01-user-profiles.sql
│   ├── 02-products.sql
│   ├── 03-orders.sql
│   ├── 04-rls-policies.sql
│   ├── 05-storage-policies.sql
│   ├── 06-functions-and-data.sql
│   └── README.md
└── .kiro/specs/          # Project specifications
```

## Database Schema
- **user_profiles**: Extends auth.users dengan role field
- **products**: Catalog produk dengan category, price, stock
- **orders**: Order records dengan status tracking
- **order_items**: Detail items per order dengan price snapshot

## Development Team
Tim 2 orang dengan pembagian tugas:
- **Developer 1**: Frontend & UI/UX (Next.js, Tailwind CSS)
- **Developer 2**: Backend, Database & Auth (Supabase setup, API functions)

## Security Features
- Row Level Security (RLS) policies
- Role-based access control (User/Admin)
- Secure file upload dengan validation
- Session management dengan role persistence

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
