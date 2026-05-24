-- Insert mock products with proper UUIDs for testing
-- This will add sample products to test the checkout functionality

-- Insert mock products
INSERT INTO products (id, name, category, description, price, stock, is_active) VALUES
(
  '550e8400-e29b-41d4-a716-446655440001',
  'Sony Alpha A7 IV',
  'Kamera',
  'Mirrorless camera dengan sensor 33MP dan video 4K',
  25000000,
  5,
  true
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'Canon RF 24-70mm f/2.8L',
  'Lensa',
  'Lensa zoom profesional untuk Canon RF mount',
  18500000,
  3,
  true
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  'Manfrotto Carbon Tripod',
  'Tripod',
  'Tripod carbon fiber ringan dan stabil',
  3200000,
  8,
  true
),
(
  '550e8400-e29b-41d4-a716-446655440004',
  'Nikon Z6 II',
  'Kamera',
  'Full frame mirrorless dengan dual card slots',
  22000000,
  4,
  true
),
(
  '550e8400-e29b-41d4-a716-446655440005',
  'Sony FE 85mm f/1.4 GM',
  'Lensa',
  'Lensa portrait premium dengan bokeh yang indah',
  21000000,
  2,
  true
),
(
  '550e8400-e29b-41d4-a716-446655440006',
  'Godox AD200Pro',
  'Aksesoris',
  'Portable flash dengan power 200Ws',
  4500000,
  6,
  true
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  stock = EXCLUDED.stock,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Verify the insert
SELECT id, name, category, price, stock FROM products ORDER BY name;