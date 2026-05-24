-- Verify database schema for CineGraph e-commerce
-- Run this to check if all tables and columns exist correctly

-- Check if all required tables exist
SELECT 
    table_name,
    CASE 
        WHEN table_name IN ('users', 'products', 'orders', 'order_items') THEN '✅ Required'
        ELSE '❓ Additional'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Check order_items table structure specifically
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    CASE 
        WHEN column_name IN ('id', 'order_id', 'product_id', 'quantity', 'unit_price', 'total_price', 'created_at') THEN '✅ Required'
        WHEN column_name = 'price_at_purchase' THEN '❌ Old column name'
        ELSE '❓ Additional'
    END as status
FROM information_schema.columns 
WHERE table_name = 'order_items'
ORDER BY ordinal_position;

-- Check if RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity,
    CASE 
        WHEN rowsecurity THEN '✅ RLS Enabled'
        ELSE '❌ RLS Disabled'
    END as rls_status
FROM pg_tables 
WHERE tablename IN ('users', 'products', 'orders', 'order_items')
ORDER BY tablename;

-- Check RLS policies for order_items
SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'order_items'
ORDER BY policyname;

-- Sample query to test order_items structure
-- This will show if the columns exist and are accessible
SELECT 
    'order_items table structure test' as test_name,
    COUNT(*) as total_columns
FROM information_schema.columns 
WHERE table_name = 'order_items'
AND column_name IN ('id', 'order_id', 'product_id', 'quantity', 'unit_price', 'total_price');

-- Expected result should be 6 columns