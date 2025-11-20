-- Update orders table to allow guest orders (nullable user_id)
-- This allows orders to be created even without user authentication

-- First, check if we need to make user_id nullable
-- If user_id is already nullable, this will not cause an error

-- Option 1: Make user_id nullable (if you want to allow NULL)
-- ALTER TABLE orders ALTER COLUMN user_id DROP NOT NULL;

-- Option 2: Use a default guest UUID (recommended for better data integrity)
-- This ensures all orders have a user_id, but guest orders use a special UUID

-- Create a function to get or create guest user ID
CREATE OR REPLACE FUNCTION get_guest_user_id()
RETURNS UUID AS $$
BEGIN
  RETURN '00000000-0000-0000-0000-000000000000'::UUID;
END;
$$ LANGUAGE plpgsql;

-- Update existing orders with NULL user_id to use guest UUID (if any)
UPDATE orders 
SET user_id = get_guest_user_id() 
WHERE user_id IS NULL;

-- If you want to allow NULL user_id, uncomment the line below:
-- ALTER TABLE orders ALTER COLUMN user_id DROP NOT NULL;

-- Note: The current implementation uses a guest UUID instead of NULL
-- This is better for data integrity and foreign key constraints
