-- Verification script to check if payment system is properly set up
-- Run this to diagnose issues with checkout and payment upload

-- 1. Check if payment columns exist in orders table
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'orders'
AND column_name IN (
    'payment_proof_url',
    'payment_method', 
    'payment_status',
    'payment_confirmed_at',
    'payment_confirmed_by',
    'payment_notes'
)
ORDER BY column_name;

-- Expected: 6 rows (all payment columns)
-- If 0 rows: Run add-payment-proof.sql

-- 2. Check RLS policies on orders table
SELECT 
    policyname,
    cmd,
    roles,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'orders'
ORDER BY policyname;

-- Expected: Should include "Users can update own orders" policy
-- If missing: Run rls-policies-payment-fix.sql

-- 3. Check if payment-proofs storage bucket exists
SELECT 
    id,
    name,
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets
WHERE name = 'payment-proofs';

-- Expected: 1 row with bucket details
-- If 0 rows: Run create-payment-bucket-simple.sql (optional - system works without it)

-- 4. Check order status constraint
SELECT 
    conname,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conname LIKE '%orders%status%'
AND conrelid = 'orders'::regclass;

-- Expected: Should include 'awaiting_payment' in status check
-- If not: Run add-payment-proof.sql

-- 5. Sample query to check recent orders
SELECT 
    id,
    user_id,
    status,
    COALESCE(payment_status, 'column_missing') as payment_status,
    total_amount,
    created_at
FROM orders
ORDER BY created_at DESC
LIMIT 5;

-- 6. Check products stock levels
SELECT 
    id,
    name,
    stock,
    price,
    is_active
FROM products
WHERE is_active = true
ORDER BY stock ASC
LIMIT 10;

-- Summary Report
SELECT 
    'Payment Columns' as check_type,
    CASE 
        WHEN COUNT(*) = 6 THEN '✅ All columns exist'
        ELSE '❌ Missing columns - Run add-payment-proof.sql'
    END as status
FROM information_schema.columns
WHERE table_name = 'orders'
AND column_name IN (
    'payment_proof_url',
    'payment_method', 
    'payment_status',
    'payment_confirmed_at',
    'payment_confirmed_by',
    'payment_notes'
)

UNION ALL

SELECT 
    'RLS Policies' as check_type,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'orders' 
            AND policyname LIKE '%update%own%'
        ) THEN '✅ Update policy exists'
        ELSE '❌ Missing policy - Run rls-policies-payment-fix.sql'
    END as status

UNION ALL

SELECT 
    'Storage Bucket' as check_type,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM storage.buckets 
            WHERE name = 'payment-proofs'
        ) THEN '✅ Bucket exists'
        ELSE '⚠️ Bucket missing - Optional, system works without it'
    END as status;
