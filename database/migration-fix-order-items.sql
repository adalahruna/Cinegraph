-- Migration to fix order_items table structure
-- This ensures the table has the correct column names

-- Check if order_items table exists and has correct structure
DO $$ 
BEGIN
    -- Check if price_at_purchase column exists (old name)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'order_items' 
        AND column_name = 'price_at_purchase'
    ) THEN
        -- Rename old column to new name
        ALTER TABLE order_items RENAME COLUMN price_at_purchase TO unit_price;
        
        -- Add total_price column if it doesn't exist
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'order_items' 
            AND column_name = 'total_price'
        ) THEN
            ALTER TABLE order_items ADD COLUMN total_price DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (total_price >= 0);
            
            -- Update total_price for existing records
            UPDATE order_items SET total_price = unit_price * quantity;
        END IF;
        
        RAISE NOTICE 'order_items table structure updated successfully';
    ELSE
        -- Check if table exists with correct structure
        IF EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_name = 'order_items'
        ) THEN
            -- Table exists, check if it has the correct columns
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'order_items' 
                AND column_name = 'unit_price'
            ) THEN
                -- Add missing unit_price column
                ALTER TABLE order_items ADD COLUMN unit_price DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (unit_price >= 0);
            END IF;
            
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'order_items' 
                AND column_name = 'total_price'
            ) THEN
                -- Add missing total_price column
                ALTER TABLE order_items ADD COLUMN total_price DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (total_price >= 0);
            END IF;
            
            RAISE NOTICE 'order_items table columns verified/added';
        ELSE
            RAISE NOTICE 'order_items table does not exist - please run the main schema.sql first';
        END IF;
    END IF;
END $$;

-- Ensure RLS is enabled on order_items table
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create or update RLS policies for order_items
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

-- Add helpful comments
COMMENT ON TABLE order_items IS 'Items within each order with pricing at time of purchase';
COMMENT ON COLUMN order_items.unit_price IS 'Price per unit at time of purchase';
COMMENT ON COLUMN order_items.total_price IS 'Total price for this line item (unit_price * quantity)';

-- Create function to automatically calculate total_price
CREATE OR REPLACE FUNCTION calculate_order_item_total()
RETURNS TRIGGER AS $$
BEGIN
    NEW.total_price = NEW.unit_price * NEW.quantity;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-calculate total_price
DROP TRIGGER IF EXISTS trigger_calculate_order_item_total ON order_items;
CREATE TRIGGER trigger_calculate_order_item_total
    BEFORE INSERT OR UPDATE ON order_items
    FOR EACH ROW
    EXECUTE FUNCTION calculate_order_item_total();