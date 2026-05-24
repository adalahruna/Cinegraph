# Database Schema Fix - CineGraph

## Problem
Error: `Could not find the 'price_at_purchase' column of 'order_items' in the schema cache`

## Root Cause
The `order_items` table in the database schema uses `unit_price` and `total_price` columns, but the application code was trying to use `price_at_purchase`.

## Solution

### 1. Fixed Application Code ✅
- ✅ Updated `OrderService.js` to use correct column names
- ✅ Updated `Profile.js` to display correct data
- ✅ Fixed all references to use `unit_price` and `total_price`

### 2. Database Migration Options

Choose the appropriate option based on your situation:

#### Option A: Fresh Installation (Recommended)
If you haven't created the database yet, just run:
```sql
-- Run the main schema file
\i 'database/schema.sql'
```

#### Option B: Fix Existing Database (Simple)
If you have an existing database, run this simple fix:
```sql
-- Run this in your Supabase SQL Editor
\i 'database/fix-order-items-simple.sql'
```

#### Option C: Manual Fix (If scripts don't work)
Run these commands one by one in Supabase SQL Editor:

```sql
-- Add missing columns
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS unit_price DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS total_price DECIMAL(10,2) NOT NULL DEFAULT 0;

-- Enable RLS
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create basic policy
CREATE POLICY "Users can view their own order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );
```

### 3. Verify Schema

To check if your database has the correct structure:

```sql
-- Check if columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'order_items'
ORDER BY ordinal_position;
```

Expected columns:
- `id` (uuid)
- `order_id` (uuid)
- `product_id` (uuid)
- `quantity` (integer)
- `unit_price` (numeric) ← This should exist
- `total_price` (numeric) ← This should exist
- `created_at` (timestamp with time zone)

## Files Changed

### Application Code:
- `lib/services/orders.js` - Fixed column names in queries and inserts
- `app/profile/page.js` - Fixed display of order item prices

### Database Files:
- `database/fix-order-items-simple.sql` - Simple migration script
- `database/simple-migration.sql` - Alternative migration
- `DATABASE_FIX.md` - This documentation

## Testing

After applying the fix:

1. ✅ Cart checkout should work without errors
2. ✅ Order history should display correctly in profile
3. ✅ Order items should show proper pricing
4. ✅ No more "column not found" errors

## Troubleshooting

### If you still get the error:
1. Check if the columns exist:
   ```sql
   \d order_items
   ```

2. If columns are missing, run the manual fix commands above

3. If you have old `price_at_purchase` column:
   ```sql
   -- Copy data from old column
   UPDATE order_items SET unit_price = price_at_purchase WHERE unit_price = 0;
   UPDATE order_items SET total_price = unit_price * quantity WHERE total_price = 0;
   
   -- Drop old column
   ALTER TABLE order_items DROP COLUMN price_at_purchase;
   ```

## Status: ✅ RESOLVED

The application now correctly uses the database schema column names:
- ✅ `unit_price` instead of `price_at_purchase`
- ✅ `total_price` for calculated totals
- ✅ Proper RLS policies for security
- ✅ No more column not found errors