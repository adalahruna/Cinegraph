# LensaNusantara Backend Setup Guide

## Overview

Backend lengkap untuk platform e-commerce peralatan fotografi menggunakan Supabase, Next.js, dan PostgreSQL dengan Row Level Security.

## Prerequisites

- Node.js 18+ 
- Akun Supabase
- Next.js project (sudah ada)

## Setup Instructions

### 1. Environment Variables

Copy `.env.local.example` ke `.env.local` dan isi dengan kredensial Supabase:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 2. Database Setup

Jalankan SQL scripts di Supabase SQL Editor:

1. **Schema & Tables**: `database/schema.sql`
2. **RLS Policies**: `database/rls-policies.sql`  
3. **Storage Setup**: `database/storage-setup.sql`

### 3. Supabase Configuration

Di Supabase Dashboard:

1. **Authentication**:
   - Enable Email/Password provider
   - Disable email confirmation untuk development
   - Set site URL ke `http://localhost:3000`

2. **Storage**:
   - Bucket `product-images` akan dibuat otomatis via SQL
   - Pastikan public access enabled

3. **Database**:
   - RLS enabled pada semua tabel
   - Policies sudah dikonfigurasi via SQL

## Backend Architecture

### Services Layer

- **AuthService** (`lib/services/auth.js`): Authentication & user management
- **ProductService** (`lib/services/products.js`): Product CRUD operations
- **OrderService** (`lib/services/orders.js`): Order processing & management
- **StorageService** (`lib/services/storage.js`): File upload & management

### API Routes

- **Authentication**:
  - `POST /api/auth/signup` - User registration
  - `POST /api/auth/signin` - User login

- **Products**:
  - `GET /api/products` - List products (with filters)
  - `POST /api/products` - Create product (admin only)
  - `GET /api/products/[id]` - Get single product
  - `PUT /api/products/[id]` - Update product (admin only)
  - `DELETE /api/products/[id]` - Delete product (admin only)

- **Orders**:
  - `GET /api/orders` - List orders
  - `POST /api/orders` - Create order
  - `GET /api/orders/[id]` - Get order details
  - `PUT /api/orders/[id]/status` - Update order status (admin only)

### Database Schema

#### Users Table
```sql
- id (UUID, PK)
- email (TEXT, UNIQUE)
- role (TEXT: 'admin'|'user')
- full_name (TEXT)
- phone (TEXT)
- address (JSONB)
- created_at, updated_at (TIMESTAMP)
```

#### Products Table
```sql
- id (UUID, PK)
- name (TEXT)
- category (TEXT)
- description (TEXT)
- price (DECIMAL)
- stock (INTEGER)
- image_url (TEXT)
- specifications (JSONB)
- is_active (BOOLEAN)
- created_at, updated_at (TIMESTAMP)
```

#### Orders Table
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- status (TEXT)
- total_amount (DECIMAL)
- shipping_address (JSONB)
- notes (TEXT)
- created_at, updated_at (TIMESTAMP)
```

#### Order Items Table
```sql
- id (UUID, PK)
- order_id (UUID, FK)
- product_id (UUID, FK)
- quantity (INTEGER)
- unit_price (DECIMAL)
- total_price (DECIMAL)
- created_at (TIMESTAMP)
```

## Usage Examples

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

// Get current user
const { user, profile } = await AuthService.getCurrentUser()
```

### Products

```javascript
import { ProductService } from '../lib/services/products'

// Create product (admin only)
const { product, error } = await ProductService.createProduct({
  name: 'Sony Alpha A7 IV',
  category: 'Kamera',
  description: 'Mirrorless camera with 33MP sensor',
  price: 25000000,
  stock: 10,
  specifications: { sensor: '33MP', mount: 'E-mount' }
})

// Get products with filters
const { products, count } = await ProductService.getProducts({
  category: 'Kamera',
  search: 'Sony',
  page: 1,
  limit: 20
})

// Update product (admin only)
const { product } = await ProductService.updateProduct(productId, {
  price: 24000000,
  stock: 8
})
```

### Orders

```javascript
import { OrderService } from '../lib/services/orders'

// Create order
const { order, error } = await OrderService.createOrder(
  {
    shipping_address: {
      name: 'John Doe',
      address: 'Jl. Sudirman No. 1',
      city: 'Jakarta',
      postal_code: '12345'
    },
    notes: 'Please handle with care'
  },
  [
    { product_id: 'product-uuid', quantity: 1 },
    { product_id: 'product-uuid-2', quantity: 2 }
  ]
)

// Get user orders
const { orders, count } = await OrderService.getOrders(userId, {
  status: 'pending',
  page: 1,
  limit: 10
})

// Update order status (admin only)
const { order } = await OrderService.updateOrderStatus(orderId, 'confirmed')
```

### File Upload

```javascript
import { StorageService } from '../lib/services/storage'

// Upload product image (admin only)
const { url, path, error } = await StorageService.uploadProductImage(
  file, 
  productId
)

// Get image URL
const { url } = await StorageService.getImageUrl(imagePath)
```

## Security Features

### Row Level Security (RLS)
- Users can only access their own data
- Admins have full access to system data
- Products are publicly readable but admin-only writable
- Orders are user-isolated with admin oversight

### Input Validation
- Email format validation
- Password strength requirements
- Product data validation (price, stock constraints)
- Order validation (item availability, total calculation)

### Error Handling
- Standardized error response format
- Appropriate HTTP status codes
- Detailed error messages for development
- Sanitized errors for production

## Admin Setup

Untuk membuat user admin pertama:

1. Register user normal via API
2. Di Supabase Dashboard, update role di tabel users:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
   ```

## Testing

Backend sudah siap untuk testing dengan:
- Unit tests untuk service functions
- Integration tests untuk API endpoints
- Property-based tests untuk comprehensive coverage

## Production Deployment

1. Set environment variables di hosting platform
2. Configure Supabase production settings
3. Enable email confirmation
4. Set proper CORS origins
5. Configure rate limiting
6. Enable logging and monitoring

## Frontend Integration

Backend menyediakan semua API yang dibutuhkan frontend:
- Authentication dengan session management
- Product catalog dengan filtering & pagination
- Shopping cart & checkout functionality
- Order management & tracking
- File upload untuk product images

Frontend developer tinggal consume API endpoints yang sudah tersedia dengan response format yang konsisten.