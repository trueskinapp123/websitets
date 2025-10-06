-- Cart table setup for persistent cart functionality
-- This extends the existing database schema

-- Create cart table
CREATE TABLE IF NOT EXISTS cart (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id) -- Ensure one cart entry per user per product
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON cart(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_product_id ON cart(product_id);
CREATE INDEX IF NOT EXISTS idx_cart_created_at ON cart(created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cart_updated_at 
    BEFORE UPDATE ON cart 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see and modify their own cart items
CREATE POLICY "Users can view their own cart items" ON cart
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items" ON cart
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items" ON cart
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items" ON cart
    FOR DELETE USING (auth.uid() = user_id);

-- Create a function to get user's cart with product details
CREATE OR REPLACE FUNCTION get_user_cart(user_uuid UUID)
RETURNS TABLE (
  id UUID,
  product_id UUID,
  quantity INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  product_name TEXT,
  product_price DECIMAL,
  product_images TEXT[],
  product_count TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.product_id,
    c.quantity,
    c.created_at,
    c.updated_at,
    p.name as product_name,
    p.price as product_price,
    p.images as product_images,
    p.count as product_count
  FROM cart c
  JOIN products p ON c.product_id = p.id
  WHERE c.user_id = user_uuid
  ORDER BY c.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON cart TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_cart(UUID) TO authenticated;

-- Insert some sample cart data (optional - for testing)
-- This will be populated when users add items to cart
