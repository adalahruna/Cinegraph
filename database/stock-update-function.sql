-- Create RPC function for atomic stock updates
-- This function updates product stock atomically and safely

-- Drop function if exists
DROP FUNCTION IF EXISTS update_product_stock(UUID, INTEGER);

-- Create atomic stock update function
CREATE OR REPLACE FUNCTION update_product_stock(
  product_id UUID,
  quantity_to_subtract INTEGER
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_stock INTEGER;
  new_stock INTEGER;
  result JSON;
BEGIN
  -- Get current stock with row lock to prevent race conditions
  SELECT stock INTO current_stock
  FROM products
  WHERE id = product_id
  FOR UPDATE;
  
  -- Check if product exists
  IF current_stock IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Product not found',
      'product_id', product_id
    );
  END IF;
  
  -- Calculate new stock (don't allow negative stock)
  new_stock := GREATEST(0, current_stock - quantity_to_subtract);
  
  -- Update stock
  UPDATE products
  SET stock = new_stock,
      updated_at = NOW()
  WHERE id = product_id;
  
  -- Return success result
  RETURN json_build_object(
    'success', true,
    'product_id', product_id,
    'old_stock', current_stock,
    'new_stock', new_stock,
    'quantity_subtracted', quantity_to_subtract
  );
  
EXCEPTION
  WHEN OTHERS THEN
    -- Return error result
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM,
      'product_id', product_id
    );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION update_product_stock(UUID, INTEGER) TO authenticated;

COMMIT;