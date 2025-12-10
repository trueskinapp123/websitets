-- Enhanced Address Storage for Orders
-- This script ensures proper address storage in the orders table
-- Run this in your Supabase SQL Editor

-- ====================================================================
-- 1. ENSURE ORDERS TABLE HAS PROPER ADDRESS STRUCTURE
-- ====================================================================

-- Check if shipping_address column exists and is JSONB
-- If not, we'll add it (though it should already exist from complete-database-setup.sql)

-- Ensure shipping_address column is JSONB type
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'shipping_address'
        AND data_type = 'jsonb'
    ) THEN
        -- Add shipping_address column if it doesn't exist
        ALTER TABLE orders ADD COLUMN shipping_address JSONB;
        
        -- Make it NOT NULL with a default empty object
        ALTER TABLE orders ALTER COLUMN shipping_address SET DEFAULT '{}'::jsonb;
        ALTER TABLE orders ALTER COLUMN shipping_address SET NOT NULL;
    ELSE
        -- Ensure it's NOT NULL
        ALTER TABLE orders ALTER COLUMN shipping_address SET NOT NULL;
    END IF;
END $$;

-- ====================================================================
-- 2. CREATE INDEX FOR ADDRESS QUERIES (Optional but recommended)
-- ====================================================================

-- Create GIN index for JSONB queries (helps with address searches)
CREATE INDEX IF NOT EXISTS idx_orders_shipping_address_gin 
ON orders USING GIN (shipping_address);

-- ====================================================================
-- 3. ENSURE ADDRESS STRUCTURE IS CONSISTENT
-- ====================================================================

-- Update any existing orders with incomplete address data
UPDATE orders
SET shipping_address = jsonb_build_object(
    'street', COALESCE(shipping_address->>'street', ''),
    'city', COALESCE(shipping_address->>'city', ''),
    'state', COALESCE(shipping_address->>'state', ''),
    'zip', COALESCE(shipping_address->>'zip', ''),
    'country', COALESCE(shipping_address->>'country', 'India')
)
WHERE shipping_address IS NULL 
   OR shipping_address = '{}'::jsonb
   OR NOT (shipping_address ? 'street' AND shipping_address ? 'city' AND shipping_address ? 'state' AND shipping_address ? 'zip');

-- ====================================================================
-- 4. ADD VALIDATION FUNCTION (Optional)
-- ====================================================================

-- Function to validate address structure
CREATE OR REPLACE FUNCTION validate_shipping_address(address JSONB)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        address ? 'street' AND
        address ? 'city' AND
        address ? 'state' AND
        address ? 'zip' AND
        address->>'street' IS NOT NULL AND
        address->>'city' IS NOT NULL AND
        address->>'state' IS NOT NULL AND
        address->>'zip' IS NOT NULL
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ====================================================================
-- 5. ADD CHECK CONSTRAINT (Optional - can be strict)
-- ====================================================================

-- Uncomment if you want strict validation
-- ALTER TABLE orders ADD CONSTRAINT check_shipping_address_valid
-- CHECK (validate_shipping_address(shipping_address));

-- ====================================================================
-- 6. VERIFY SETUP
-- ====================================================================

-- Check column exists and is correct type
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'orders'
AND column_name = 'shipping_address';

-- Check index exists
SELECT 
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'orders'
AND indexname = 'idx_orders_shipping_address_gin';

-- Sample query to verify address structure
SELECT 
    id,
    customer_name,
    shipping_address->>'street' as street,
    shipping_address->>'city' as city,
    shipping_address->>'state' as state,
    shipping_address->>'zip' as zip
FROM orders
LIMIT 5;

SELECT 'Address storage enhancement completed successfully!' as message;

