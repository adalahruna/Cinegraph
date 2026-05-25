-- FIX PAYMENT ACCESS FOR ADMIN
-- This script fixes RLS policies to allow admin to access payment confirmations

-- 1. Drop existing problematic policies on orders table
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can create own orders" ON orders;
DROP POLICY IF EXISTS "Users can update own orders" ON orders;
DROP POLICY IF EXISTS "Admin can view all orders" ON orders;
DROP POLICY IF EXISTS "Admin can update all orders" ON orders;

-- 2. Create simple policies for orders table
-- Allow users to view their own orders
CREATE POLICY "users_view_own_orders" ON orders
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to create their own orders
CREATE POLICY "users_create_own_orders" ON orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own orders
CREATE POLICY "users_update_own_orders" ON orders
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow admin to view all orders (without recursive check)
CREATE POLICY "admin_view_all_orders" ON orders
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Allow admin to update all orders
CREATE POLICY "admin_update_all_orders" ON orders
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- 3. Fix order_items policies
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
DROP POLICY IF EXISTS "Users can create order items" ON order_items;
DROP POLICY IF EXISTS "Admin can view all order items" ON order_items;

-- Allow users to view their own order items
CREATE POLICY "users_view_own_order_items" ON order_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Allow users to create order items for their orders
CREATE POLICY "users_create_order_items" ON order_items
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Allow admin to view all order items
CREATE POLICY "admin_view_all_order_items" ON order_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- 4. Verify RLS is enabled
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 5. Check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename IN ('orders', 'order_items', 'users', 'products')
ORDER BY tablename, policyname;
