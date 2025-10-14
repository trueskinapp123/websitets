-- Complete Cart Table Setup with RLS Policies
-- Run this in Supabase SQL Editor to ensure cart functionality works properly

-- ====================================================================
-- 1. DROP EXISTING TABLE (if exists) and recreate
-- ====================================================================

DROP TABLE IF EXISTS cart CASCADE;

-- ====================================================================
-- 2. CREATE CART TABLE
-- ====================================================================

CREATE TABLE cart (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id TEXT REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- ====================================================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- ====================================================================

CREATE INDEX idx_cart_user_id ON cart(user_id);
CREATE INDEX idx_cart_product_id ON cart(product_id);
CREATE INDEX idx_cart_created_at ON cart(created_at DESC);

-- ====================================================================
-- 4. CREATE UPDATED_AT TRIGGER
-- ====================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_cart_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_cart_updated_at_trigger
    BEFORE UPDATE ON cart
    FOR EACH ROW
    EXECUTE FUNCTION update_cart_updated_at();

-- ====================================================================
-- 5. ENABLE ROW LEVEL SECURITY (RLS)
-- ====================================================================

ALTER TABLE cart ENABLE ROW LEVEL SECURITY;

-- ====================================================================
-- 6. DROP EXISTING POLICIES (if any)
-- ====================================================================

DROP POLICY IF EXISTS "Users can view own cart items" ON cart;
DROP POLICY IF EXISTS "Users can insert own cart items" ON cart;
DROP POLICY IF EXISTS "Users can update own cart items" ON cart;
DROP POLICY IF EXISTS "Users can delete own cart items" ON cart;

-- ====================================================================
-- 7. CREATE RLS POLICIES
-- ====================================================================

-- Users can view their own cart items
CREATE POLICY "Users can view own cart items" ON cart
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own cart items
CREATE POLICY "Users can insert own cart items" ON cart
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own cart items
CREATE POLICY "Users can update own cart items" ON cart
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own cart items
CREATE POLICY "Users can delete own cart items" ON cart
    FOR DELETE USING (auth.uid() = user_id);

-- ====================================================================
-- 8. GRANT PERMISSIONS
-- ====================================================================

-- Grant necessary permissions to authenticated users
GRANT ALL ON cart TO authenticated;
GRANT ALL ON cart TO anon;

-- ====================================================================
-- 9. VERIFY SETUP
-- ====================================================================

-- Check if table was created
SELECT 'Cart table created successfully' as status;

-- Check if RLS is enabled
SELECT 
    tablename, 
    rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'cart';

-- Check if policies exist
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename = 'cart';

SELECT 'Cart setup completed successfully!' as message;
