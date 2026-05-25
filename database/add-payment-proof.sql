-- Add payment proof functionality to orders table
-- This allows users to upload payment proof and admins to confirm payments

-- Add payment proof columns to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_proof_url TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'uploaded', 'confirmed', 'rejected'));
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_confirmed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_confirmed_by UUID REFERENCES users(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_notes TEXT;

-- Update existing orders to have payment_status = 'pending'
UPDATE orders SET payment_status = 'pending' WHERE payment_status IS NULL;

-- Add index for payment status queries
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);

-- Update order status check constraint to include 'awaiting_payment'
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
  CHECK (status IN ('pending', 'awaiting_payment', 'confirmed', 'shipped', 'delivered', 'cancelled'));

-- Create payment methods enum-like constraint
ALTER TABLE orders ADD CONSTRAINT orders_payment_method_check 
  CHECK (payment_method IS NULL OR payment_method IN ('bank_transfer', 'e_wallet', 'credit_card', 'cash_on_delivery'));

COMMIT;