-- Disable RLS for orders table temporarily
-- Supaya admin bisa query orders tanpa masalah

ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;

-- Verify
SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('orders', 'order_items');
