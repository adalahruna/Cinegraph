-- Utility function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_uuid UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role FROM public.user_profiles 
    WHERE id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role = 'admin' FROM public.user_profiles 
    WHERE id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert sample products (for development/testing)
INSERT INTO public.products (name, category, description, price, stock) VALUES
('Canon EOS R5', 'Camera', 'Professional mirrorless camera with 45MP full-frame sensor', 3899.99, 10),
('Sony Alpha A7 IV', 'Camera', '33MP full-frame mirrorless camera with advanced autofocus', 2499.99, 8),
('Nikon Z9', 'Camera', 'Professional flagship mirrorless camera with 45.7MP sensor', 5499.99, 5),
('Sony FE 24-70mm f/2.8 GM', 'Lens', 'Professional standard zoom lens for Sony E-mount', 2199.99, 12),
('Canon RF 50mm f/1.2L', 'Lens', 'Premium portrait lens with exceptional bokeh', 2299.99, 7),
('Sigma 85mm f/1.4 DG DN Art', 'Lens', 'High-performance portrait lens for mirrorless cameras', 1199.99, 15),
('Manfrotto Carbon Fiber Tripod', 'Accessory', 'Lightweight professional tripod for travel photography', 599.99, 20),
('Peak Design Camera Strap', 'Accessory', 'Quick-release camera strap for professional photographers', 59.99, 50),
('SanDisk Extreme Pro CFexpress', 'Accessory', 'High-speed memory card for professional cameras', 199.99, 30),
('Godox AD200Pro Flash', 'Accessory', 'Portable studio flash with TTL support', 329.99, 18);

-- Create an admin user (you'll need to replace the UUID with actual user ID after registration)
-- This is just a template - you'll run this after creating your first user account
-- UPDATE public.user_profiles 
-- SET role = 'admin' 
-- WHERE id = 'your-user-uuid-here';