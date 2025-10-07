-- Script to populate the products table with sample data
-- Run this in your Supabase SQL editor

-- First, check if products table exists
-- If not, create it first using the supabase-setup.sql script

-- Insert sample products
INSERT INTO products (
  id,
  name,
  count,
  original_price,
  price,
  discount,
  description,
  rating,
  reviews,
  popular,
  images,
  created_at,
  updated_at
) VALUES 
(
  'heal-pack',
  'Heal Pack',
  '4 Masks',
  420,
  304,
  '5% OFF',
  'Perfect starter pack for first-time users. Experience the power of premium collagen with our carefully curated 4-mask collection designed to introduce your skin to the TrueSkin difference.',
  4.8,
  124,
  false,
  ARRAY[
    'https://i.ibb.co/bMTNmmqR/Whats-App-Image-2025-08-13-at-18-16-29-1832814a.jpg',
    'https://i.ibb.co/bMTNmmqR/Whats-App-Image-2025-08-13-at-18-16-29-1832814a.jpg'
  ],
  NOW(),
  NOW()
),
(
  'fresh-pack',
  'Fresh Pack',
  '8 Masks',
  800,
  576,
  '5% OFF',
  'Most popular choice for regular users. Transform your skincare routine with our 8-mask collection, perfect for maintaining that radiant glow throughout the month.',
  4.9,
  286,
  true,
  ARRAY[
    'https://i.ibb.co/bMTNmmqR/Whats-App-Image-2025-08-13-at-18-16-29-1832814a.jpg',
    'https://i.ibb.co/bMTNmmqR/Whats-App-Image-2025-08-13-at-18-16-29-1832814a.jpg'
  ],
  NOW(),
  NOW()
),
(
  'glow-pack',
  'Glow Pack',
  '12 Masks',
  1158,
  816,
  '5% OFF',
  'Best value for skincare enthusiasts. Our premium 12-mask collection offers the ultimate skincare experience with maximum savings and long-lasting results.',
  4.9,
  198,
  false,
  ARRAY[
    'https://i.ibb.co/bMTNmmqR/Whats-App-Image-2025-08-13-at-18-16-29-1832814a.jpg',
    'https://i.ibb.co/bMTNmmqR/Whats-App-Image-2025-08-13-at-18-16-29-1832814a.jpg'
  ],
  NOW(),
  NOW()
);

-- Verify the data was inserted
SELECT * FROM products ORDER BY created_at DESC;
