-- Safe Reset Orders Script
-- This script provides options to reset orders with safety checks

-- Option 1: Delete orders for a specific user only
-- Replace 'USER_ID_HERE' with the actual user ID
-- DELETE FROM order_items WHERE order_id IN (
--   SELECT id FROM orders WHERE user_id = 'USER_ID_HERE'
-- );
-- DELETE FROM orders WHERE user_id = 'USER_ID_HERE';

-- Option 2: Delete orders from last 24 hours only
-- DELETE FROM order_items WHERE order_id IN (
--   SELECT id FROM orders WHERE created_at >= NOW() - INTERVAL '24 hours'
-- );
-- DELETE FROM orders WHERE created_at >= NOW() - INTERVAL '24 hours';

-- Option 3: Delete orders with specific status only
-- DELETE FROM order_items WHERE order_id IN (
--   SELECT id FROM orders WHERE status = 'pending'
-- );
-- DELETE FROM orders WHERE status = 'pending';

-- Option 4: FULL RESET (uncomment to use)
-- WARNING: This will delete ALL orders and order items!

-- Step 1: Show current counts before deletion
SELECT 
  'BEFORE DELETION' as status,
  (SELECT COUNT(*) FROM orders) as orders_count,
  (SELECT COUNT(*) FROM order_items) as order_items_count;

-- Step 2: Delete all order items first (due to foreign key constraints)
-- DELETE FROM order_items;

-- Step 3: Delete all orders
-- DELETE FROM orders;

-- Step 4: Show counts after deletion
-- SELECT 
--   'AFTER DELETION' as status,
--   (SELECT COUNT(*) FROM orders) as orders_count,
--   (SELECT COUNT(*) FROM order_items) as order_items_count;

-- Step 5: Optional - Reset product stock to default values
-- UPDATE products SET stock = 
--   CASE 
--     WHEN category = 'Camera' THEN 50
--     WHEN category = 'Lens' THEN 30
--     WHEN category = 'Tripod' THEN 25
--     WHEN category = 'Lighting' THEN 40
--     WHEN category = 'Accessories' THEN 35
--     ELSE stock
--   END;

-- Uncomment the lines above (remove --) to execute the full reset