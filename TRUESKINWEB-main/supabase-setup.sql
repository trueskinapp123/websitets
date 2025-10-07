-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  count VARCHAR(50) NOT NULL,
  original_price DECIMAL(10,2) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  discount VARCHAR(20) NOT NULL,
  description TEXT NOT NULL,
  rating DECIMAL(3,1) DEFAULT 0.0,
  reviews INTEGER DEFAULT 0,
  popular BOOLEAN DEFAULT FALSE,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  shipping_address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Insert sample products
INSERT INTO products (id, name, count, original_price, price, discount, description, rating, reviews, popular, images) VALUES
(
  'heal-pack',
  'Heal Pack',
  '4 Masks',
  420.00,
  304.00,
  '5% OFF',
  'Perfect starter pack for first-time users. Experience the power of premium collagen with our carefully curated 4-mask collection designed to introduce your skin to the TrueSkin difference.',
  4.8,
  124,
  false,
  ARRAY['https://i.ibb.co/bMTNmmqR/Whats-App-Image-2025-08-13-at-18-16-29-1832814a.jpg', 'https://i.ibb.co/bMTNmmqR/Whats-App-Image-2025-08-13-at-18-16-29-1832814a.jpg']
),
(
  'fresh-pack',
  'Fresh Pack',
  '8 Masks',
  800.00,
  576.00,
  '5% OFF',
  'Most popular choice for regular users. Transform your skincare routine with our 8-mask collection, perfect for maintaining that radiant glow throughout the month.',
  4.9,
  286,
  true,
  ARRAY['https://i.ibb.co/bMTNmmqR/Whats-App-Image-2025-08-13-at-18-16-29-1832814a.jpg', 'https://i.ibb.co/bMTNmmqR/Whats-App-Image-2025-08-13-at-18-16-29-1832814a.jpg']
),
(
  'glow-pack',
  'Glow Pack',
  '12 Masks',
  1158.00,
  816.00,
  '5% OFF',
  'Best value for skincare enthusiasts. Our premium 12-mask collection offers the ultimate skincare experience with maximum savings and long-lasting results.',
  4.9,
  198,
  false,
  ARRAY['https://i.ibb.co/bMTNmmqR/Whats-App-Image-2025-08-13-at-18-16-29-1832814a.jpg', 'https://i.ibb.co/bMTNmmqR/Whats-App-Image-2025-08-13-at-18-16-29-1832814a.jpg']
)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Products are publicly readable
CREATE POLICY "Products are publicly readable" ON products
  FOR SELECT USING (true);

-- Cart items are user-specific
CREATE POLICY "Users can view their own cart items" ON cart_items
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own cart items" ON cart_items
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own cart items" ON cart_items
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own cart items" ON cart_items
  FOR DELETE USING (auth.uid()::text = user_id);

-- Orders are user-specific
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Order items are readable by users who own the order
CREATE POLICY "Users can view order items for their orders" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert order items for their orders" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()::text
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
