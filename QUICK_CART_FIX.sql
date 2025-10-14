-- QUICK FIX: Cart Loading Issue
-- This script fixes slow cart loading and cart not adding items

-- ====================================================================
-- 1. Check if cart table exists and has correct structure
-- ====================================================================

-- Drop and recreate cart table if it exists
DROP TABLE IF EXISTS cart CASCADE;

-- Create cart table with correct schema
CREATE TABLE cart (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- ====================================================================
-- 2. Create indexes for fast queries
-- ====================================================================

CREATE INDEX idx_cart_user_id ON cart(user_id);
CREATE INDEX idx_cart_product_id ON cart(product_id);
CREATE INDEX idx_cart_created_at ON cart(created_at DESC);

-- ====================================================================
-- 3. Create trigger for updated_at
-- ====================================================================

CREATE OR REPLACE FUNCTION update_cart_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cart_updated_at_trigger
    BEFORE UPDATE ON cart
    FOR EACH ROW
    EXECUTE FUNCTION update_cart_updated_at();

-- ====================================================================
-- 4. Enable RLS
-- ====================================================================

ALTER TABLE cart ENABLE ROW LEVEL SECURITY;

-- ====================================================================
-- 5. Drop existing policies and create new ones
-- ====================================================================

DROP POLICY IF EXISTS "Users can view own cart items" ON cart;
DROP POLICY IF EXISTS "Users can insert own cart items" ON cart;
DROP POLICY IF EXISTS "Users can update own cart items" ON cart;
DROP POLICY IF EXISTS "Users can delete own cart items" ON cart;

-- Create policies
CREATE POLICY "Users can view own cart items" ON cart
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart items" ON cart
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart items" ON cart
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items" ON cart
    FOR DELETE USING (auth.uid() = user_id);

-- ====================================================================
-- 6. Grant permissions (CRITICAL FOR PERFORMANCE)
-- ====================================================================

-- Grant all permissions to authenticated users
GRANT ALL ON cart TO authenticated;
GRANT ALL ON cart TO anon;

-- Grant usage on sequence
GRANT USAGE ON SCHEMA public TO authenticated, anon;

-- ====================================================================
-- 7. Verify setup
-- ====================================================================

SELECT 'Cart table created successfully' as status;

-- Check RLS status
SELECT 
    tablename, 
    rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'cart';

-- Check policies
SELECT 
    policyname,
    permissive,
    cmd
FROM pg_policies
WHERE tablename = 'cart';

SELECT 'Cart setup completed! Cart should now work fast!' as message;
