-- Update product prices (run in Supabase SQL Editor)
UPDATE products SET price = 499.00, updated_at = NOW() WHERE id = 'heal-pack';
UPDATE products SET price = 898.00, updated_at = NOW() WHERE id = 'fresh-pack';
UPDATE products SET price = 1272.00, updated_at = NOW() WHERE id = 'glow-pack';
