-- ALL IN ONE FIX
-- Run this ONCE to fix everything
-- Copy paste entire script into Supabase SQL Editor

-- ============================================
-- PART 1: Add Payment Columns to Orders Table
-- ============================================
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_proof_url TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_confirmed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_confirmed_by UUID REFERENCES users(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_notes TEXT;

-- Update existing orders
UPDATE orders SET payment_status = 'pending' WHERE payment_status IS NULL;

-- Add index
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);

-- ============================================
-- PART 2: Update Order Status Constraint
-- ============================================
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
  CHECK (status IN ('pending', 'awaiting_payment', 'confirmed', 'shipped', 'delivered', 'cancelled'));

-- ============================================
-- PART 3: Add Payment Method Constraint
-- ============================================
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_payment_method_check;
ALTER TABLE orders ADD CONSTRAINT orders_payment_method_check 
  CHECK (payment_method IS NULL OR payment_method IN ('bank_transfer', 'e_wallet', 'credit_card', 'cash_on_delivery'));

-- ============================================
-- PART 4: Add Payment Status Constraint
-- ============================================
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_payment_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_payment_status_check 
  CHECK (payment_status IN ('pending', 'uploaded', 'confirmed', 'rejected'));

-- ============================================
-- PART 5: Fix RLS Policies (Remove Recursion)
-- ============================================

-- Drop all existing policies on users table
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Allow user registration" ON users;

-- Create simple, non-recursive policies
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow user registration" ON users
    FOR INSERT WITH CHECK (true);

-- ============================================
-- PART 6: Add RLS Policy for Users to Update Orders
-- ============================================

-- Drop existing update policy if exists
DROP POLICY IF EXISTS "Users can update own orders" ON orders;

-- Allow users to update their own orders (for payment upload)
CREATE POLICY "Users can update own orders" ON orders
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ============================================
-- PART 7: Sync Auth Users to Users Table
-- ============================================

-- Insert missing user profiles
INSERT INTO public.users (id, email, full_name, role, created_at, updated_at)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'full_name', au.email) as full_name,
    'user' as role,
    au.created_at,
    NOW() as updated_at
FROM auth.users au
LEFT JOIN public.users u ON au.id = u.id
WHERE u.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- VERIFICATION
-- ============================================

-- Check payment columns exist
SELECT 
    'Payment Columns' as check_name,
    COUNT(*) as count
FROM information_schema.columns
WHERE table_name = 'orders'
AND column_name IN ('payment_proof_url', 'payment_method', 'payment_status');

-- Check RLS policies
SELECT 
    'RLS Policies' as check_name,
    COUNT(*) as count
FROM pg_policies
WHERE tablename = 'users';

-- Check synced users
SELECT 
    'Synced Users' as check_name,
    COUNT(*) as count
FROM public.users;

-- Show recent orders
SELECT 
    id,
    user_id,
    status,
    payment_status,
    total_amount,
    created_at
FROM orders
ORDER BY created_at DESC
LIMIT 5;

COMMIT;

-- ============================================
-- DONE! Now test:
-- 1. Refresh browser (Ctrl + F5)
-- 2. Login
-- 3. Checkout
-- 4. Upload payment proof
-- Should all work now! ✅
-- ============================================
