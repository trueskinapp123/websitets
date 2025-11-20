-- Enable guest orders in the database
-- This script allows orders to be created without user authentication

-- Option 1: Make user_id nullable (Recommended)
-- This allows orders to be created with NULL user_id for guest customers

-- First, drop the foreign key constraint temporarily
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;

-- Make user_id nullable
ALTER TABLE orders ALTER COLUMN user_id DROP NOT NULL;

-- Re-add the foreign key constraint but allow NULL values
-- Note: PostgreSQL foreign keys allow NULL by default, so we don't need to re-add it
-- But if you want to keep the constraint for non-null values, you can use:
-- ALTER TABLE orders ADD CONSTRAINT orders_user_id_fkey 
--   FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Option 2: Create a guest user (Alternative approach)
-- If you prefer to keep user_id NOT NULL, create a guest user:
-- INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
-- VALUES (
--   '00000000-0000-0000-0000-000000000000'::uuid,
--   'guest@trueskin.app',
--   crypt('guest', gen_salt('bf')),
--   NOW(),
--   NOW(),
--   NOW()
-- )
-- ON CONFLICT (id) DO NOTHING;

-- For now, we'll use Option 1 (nullable user_id) as it's simpler and more flexible
-- Guest orders will have user_id = NULL

-- Update RLS policies to allow reading orders with NULL user_id (if needed)
-- The admin dashboard should be able to see all orders regardless of user_id

-- Note: Make sure your RLS policies allow:
-- 1. Admins to see all orders
-- 2. Users to see only their own orders
-- 3. Guest orders (user_id = NULL) to be visible to admins only
