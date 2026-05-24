-- Simple migration for order_items table
-- Run this if you need to fix column names

-- Step 1: Check if order_items table exists
-- If it doesn't exist, run the main schema.sql first

-- Step 2: Add missing columns if they don't exist
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS unit_price DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (unit_price >= 0);

ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS total_price DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (total_price >= 0);

-- Step 3: If you have old price_at_purchase column, copy data and drop it
-- Uncomment these lines if you have the old column:
-- UPDATE order_items SET unit_price = price_at_purchase WHERE unit_price = 0;
-- UPDATE order_items SET total_price = unit_price * quantity WHERE total_price = 0;
-- ALTER TABLE order_items DROP COLUMN IF EXISTS price_at_purchase;

-- Step 4: Enable RLS
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS policies
DROP POLICY IF EXISTS "Users can view their own order items" ON order_items;
CREATE POLICY "Users can view their own order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert their own order items" ON order_items;
CREATE POLICY "Users can insert their own order items" ON order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Admins can manage all order items" ON order_items;
CREATE POLICY "Admins can manage all order items" ON order_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Step 6: Create function to auto-calculate total_price
CREATE OR REPLACE FUNCTION calculate_order_item_total()
RETURNS TRIGGER AS $$
BEGIN
    NEW.total_price = NEW.unit_price * NEW.quantity;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 7: Create trigger
DROP TRIGGER IF EXISTS trigger_calculate_order_item_total ON order_items;
CREATE TRIGGER trigger_calculate_order_item_total
    BEFORE INSERT OR UPDATE ON order_items
    FOR EACH ROW
    EXECUTE FUNCTION calculate_order_item_total();

-- Step 8: Add comments
COMMENT ON TABLE order_items IS 'Items within each order with pricing at time of purchase';
COMMENT ON COLUMN order_items.unit_price IS 'Price per unit at time of purchase';
COMMENT ON COLUMN order_items.total_price IS 'Total price for this line item (unit_price * quantity)';