-- Reset All Orders and Order Items
-- This script will delete all order history from the database

-- WARNING: This will permanently delete all order data!
-- Make sure you want to do this before running.

-- Delete all order items first (due to foreign key constraints)
DELETE FROM order_items;

-- Delete all orders
DELETE FROM orders;

-- Reset any auto-increment sequences (if using serial IDs)
-- Note: Since we're using UUIDs, this is not necessary, but included for completeness
-- ALTER SEQUENCE orders_id_seq RESTART WITH 1;
-- ALTER SEQUENCE order_items_id_seq RESTART WITH 1;

-- Verify deletion
SELECT 
  (SELECT COUNT(*) FROM orders) as orders_count,
  (SELECT COUNT(*) FROM order_items) as order_items_count;

-- Optional: Reset product stock to original values
-- Uncomment the lines below if you want to reset product stock as well

-- UPDATE products SET stock = 50 WHERE category = 'Camera';
-- UPDATE products SET stock = 30 WHERE category = 'Lens';
-- UPDATE products SET stock = 25 WHERE category = 'Tripod';
-- UPDATE products SET stock = 40 WHERE category = 'Lighting';
-- UPDATE products SET stock = 35 WHERE category = 'Accessories';

COMMIT;