-- ====================================================================
-- UPDATE PRODUCT IMAGES IN SUPABASE
-- ====================================================================
-- This script updates the product images to use the new local images
-- Run this in your Supabase SQL editor

-- Update Heal Pack (4 Masks) with p4.png, prd.jpg, tsp.jpg
UPDATE products 
SET images = ARRAY['./images/p4.png', './images/prd.jpg', './images/tsp.jpg']
WHERE id = 'heal-pack';

-- Update Fresh Pack (8 Masks) with p8.png, prd.jpg, tsp.jpg
UPDATE products 
SET images = ARRAY['./images/p8.png', './images/prd.jpg', './images/tsp.jpg']
WHERE id = 'fresh-pack';

-- Update Glow Pack (12 Masks) with p12.png, prd.jpg, tsp.jpg
UPDATE products 
SET images = ARRAY['./images/p12.png', './images/prd.jpg', './images/tsp.jpg']
WHERE id = 'glow-pack';

-- Verify the updates
SELECT id, name, count, images FROM products ORDER BY created_at DESC;
