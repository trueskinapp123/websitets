-- ====================================================================
-- UPDATE ORDERS TABLE SCHEMA
-- ====================================================================
-- This script updates the orders table to match the required schema
-- Run this in your Supabase SQL editor

-- First, let's check if we need to add missing columns to orders table
-- Add customer_name, customer_email, customer_phone if they don't exist
DO $$ 
BEGIN
    -- Add customer_name column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'customer_name') THEN
        ALTER TABLE orders ADD COLUMN customer_name VARCHAR(255);
    END IF;
    
    -- Add customer_email column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'customer_email') THEN
        ALTER TABLE orders ADD COLUMN customer_email VARCHAR(255);
    END IF;
    
    -- Add customer_phone column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'customer_phone') THEN
        ALTER TABLE orders ADD COLUMN customer_phone VARCHAR(20);
    END IF;
    
    -- Add payment_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'payment_id') THEN
        ALTER TABLE orders ADD COLUMN payment_id VARCHAR(255);
    END IF;
    
    -- Add razorpay_order_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'razorpay_order_id') THEN
        ALTER TABLE orders ADD COLUMN razorpay_order_id VARCHAR(255);
    END IF;
END $$;

-- Update the orders table to make required fields NOT NULL
ALTER TABLE orders 
ALTER COLUMN customer_name SET NOT NULL,
ALTER COLUMN customer_email SET NOT NULL,
ALTER COLUMN customer_phone SET NOT NULL;

-- Update the status constraint to include all required statuses
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'paid', 'failed', 'processing', 'shipped', 'delivered', 'cancelled'));

-- Create index on razorpay_order_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON orders(razorpay_order_id);

-- Verify the updated schema
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;
