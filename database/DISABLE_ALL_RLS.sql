-- DISABLE ALL RLS FOR DEVELOPMENT
-- WARNING: Only use this in development environment!
-- For production, you need proper RLS policies

-- Disable RLS on all tables
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "users_view_own_orders" ON orders;
DROP POLICY IF EXISTS "users_create_own_orders" ON orders;
DROP POLICY IF EXISTS "users_update_own_orders" ON orders;
DROP POLICY IF EXISTS "admin_view_all_orders" ON orders;
DROP POLICY IF EXISTS "admin_update_all_orders" ON orders;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can create own orders" ON orders;
DROP POLICY IF EXISTS "Users can update own orders" ON orders;
DROP POLICY IF EXISTS "Admin can view all orders" ON orders;
DROP POLICY IF EXISTS "Admin can update all orders" ON orders;

DROP POLICY IF EXISTS "users_view_own_order_items" ON order_items;
DROP POLICY IF EXISTS "users_create_order_items" ON order_items;
DROP POLICY IF EXISTS "admin_view_all_order_items" ON order_items;
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
DROP POLICY IF EXISTS "Users can create order items" ON order_items;
DROP POLICY IF EXISTS "Admin can view all order items" ON order_items;

DROP POLICY IF EXISTS "users_read_own_profile" ON users;
DROP POLICY IF EXISTS "users_update_own_profile" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admin can view all users" ON users;

DROP POLICY IF EXISTS "Public can view products" ON products;
DROP POLICY IF EXISTS "Admin can manage products" ON products;

-- Verify RLS is disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'products', 'orders', 'order_items');

-- Should show 'f' (false) for all tables
