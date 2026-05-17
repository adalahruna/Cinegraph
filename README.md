# LensaNusantara - Photography Equipment E-commerce

Platform e-commerce sederhana untuk penjualan kamera, lensa, dan peralatan fotografi.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Akun Supabase
- Git

### Installation

1. **Navigate to project directory**
   ```bash
   cd cinegraph
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` dengan kredensial Supabase Anda:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

4. **Setup database**
   
   Jalankan SQL scripts berikut di Supabase SQL Editor (urutan penting):
   - `database/schema.sql` - Membuat tabel dan struktur database
   - `database/rls-policies-fixed.sql` - Setup Row Level Security
   - `database/storage-setup-fixed.sql` - Setup storage buckets

5. **Run development server**
   ```bash
   npm run dev
   ```

   Buka [http://localhost:3000](http://localhost:3000) di browser.

## 📁 Project Structure

```
cinegraph/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.js            # Homepage
│   │   ├── products/          # Products pages
│   │   ├── cart/              # Shopping cart
│   │   └── login/             # Authentication
│   └── components/            # Reusable components
│       ├── Navbar.js
│       └── Footer.js
├── lib/
│   ├── supabase.js           # Supabase client configuration
│   └── services/             # Business logic services
│       ├── auth.js           # Authentication service
│       └── products.js       # Products service
├── pages/api/                # API routes
│   ├── auth/                 # Authentication endpoints
│   └── products/             # Products endpoints
├── database/                 # Database setup files
│   ├── schema.sql
│   ├── rls-policies-fixed.sql
│   └── storage-setup-fixed.sql
└── README.md                 # This file
```

## 🎯 Features

### Frontend (Sudah Dibuat)
- ✅ **Homepage** - Hero section, kategori produk, produk unggulan
- ✅ **Product Catalog** - Daftar produk dengan filter dan search
- ✅ **Product Detail** - Detail produk lengkap dengan spesifikasi
- ✅ **Shopping Cart** - Keranjang belanja dengan quantity control
- ✅ **Authentication** - Login/Register form
- ✅ **Responsive Design** - Mobile-friendly dengan Tailwind CSS

### Backend (Sudah Dibuat)
- ✅ **Database Schema** - Users, products, orders, order_items
- ✅ **Authentication API** - Register, login dengan Supabase Auth
- ✅ **Row Level Security** - Data isolation dan access control
- ✅ **Storage Setup** - Product image upload dengan security policies
- ✅ **API Services** - Auth, Products, Orders, Storage services

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Authentication**: Supabase Auth dengan RLS
- **Styling**: Tailwind CSS dengan responsive design

## 📝 Usage Examples

### Authentication
```javascript
import { AuthService } from '../lib/services/auth'

// Register user
const { user, error } = await AuthService.signUp(
  'user@example.com', 
  'password123',
  { full_name: 'John Doe' }
)

// Login user
const { user, session, profile } = await AuthService.signIn(
  'user@example.com', 
  'password123'
)
```

### API Endpoints
```bash
POST /api/auth/signup    # User registration
POST /api/auth/signin    # User login
GET  /api/products       # Get products (akan dibuat)
POST /api/products       # Create product (akan dibuat)
GET  /api/orders         # Get orders (akan dibuat)
POST /api/orders         # Create order (akan dibuat)
```

## 🎨 UI Components

### Pages
- **Homepage** (`/`) - Landing page dengan hero dan featured products
- **Products** (`/products`) - Product catalog dengan filter
- **Product Detail** (`/products/[id]`) - Detailed product view
- **Cart** (`/cart`) - Shopping cart management
- **Login** (`/login`) - Authentication forms

### Components
- **Navbar** - Navigation dengan responsive menu
- **Footer** - Site footer dengan links dan contact info

## 🔧 Customization

### Styling
- Edit `src/app/globals.css` untuk global styles
- Modify Tailwind classes dalam components
- Customize color scheme di Tailwind config

### Backend Integration
- Semua backend services sudah siap di `lib/services/`
- API endpoints sudah dibuat di `pages/api/`
- Database schema dan policies sudah setup

## 📚 Next Steps

### Untuk Development Lanjutan:
1. **Integrate Real Data** - Connect frontend dengan backend APIs
2. **Add Admin Panel** - Interface untuk manage products dan orders
3. **Payment Integration** - Integrate payment gateway
4. **Order Management** - Complete order workflow
5. **Image Upload** - Product image management
6. **Search & Filter** - Advanced product filtering
7. **User Dashboard** - Order history dan profile management

### Untuk Production:
1. **Environment Setup** - Production environment variables
2. **Performance Optimization** - Image optimization, caching
3. **SEO** - Meta tags, sitemap, structured data
4. **Analytics** - Google Analytics integration
5. **Error Monitoring** - Sentry atau similar service

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

Untuk pertanyaan atau bantuan:
- Email: info@lensanusantara.com
- WhatsApp: +62 812 3456 7890

---

**LensaNusantara** - Toko Peralatan Fotografi Terlengkap di Indonesia 📷