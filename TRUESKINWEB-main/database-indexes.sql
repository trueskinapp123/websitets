-- ====================================================================
-- TRUE SKIN WEB APPLICATION - PERFORMANCE INDEXES
-- ====================================================================
-- Run this script in your Supabase SQL editor to add performance indexes
-- These indexes will significantly improve query performance

-- ====================================================================
-- PRODUCTS TABLE INDEXES
-- ====================================================================

-- Index for popular products (used in product listing)
CREATE INDEX IF NOT EXISTS idx_products_popular_created_at 
ON products (popular DESC, created_at DESC);

-- Index for product search and filtering
CREATE INDEX IF NOT EXISTS idx_products_name 
ON products USING gin(to_tsvector('english', name));

-- Index for price range queries
CREATE INDEX IF NOT EXISTS idx_products_price 
ON products (price);

-- Index for rating queries
CREATE INDEX IF NOT EXISTS idx_products_rating 
ON products (rating DESC);

-- Composite index for product listing with sorting
CREATE INDEX IF NOT EXISTS idx_products_listing 
ON products (popular, created_at, rating, price);

-- ====================================================================
-- ORDERS TABLE INDEXES
-- ====================================================================

-- Index for user orders (most common query)
CREATE INDEX IF NOT EXISTS idx_orders_user_id_created_at 
ON orders (user_id, created_at DESC);

-- Index for order status filtering
CREATE INDEX IF NOT EXISTS idx_orders_status_created_at 
ON orders (status, created_at DESC);

-- Index for Razorpay order lookup
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id 
ON orders (razorpay_order_id) WHERE razorpay_order_id IS NOT NULL;

-- Index for payment ID lookup
CREATE INDEX IF NOT EXISTS idx_orders_payment_id 
ON orders (payment_id) WHERE payment_id IS NOT NULL;

-- Composite index for admin order management
CREATE INDEX IF NOT EXISTS idx_orders_admin_view 
ON orders (status, created_at DESC, total_amount DESC);

-- ====================================================================
-- ORDER_ITEMS TABLE INDEXES
-- ====================================================================

-- Index for order items by order (most common query)
CREATE INDEX IF NOT EXISTS idx_order_items_order_id 
ON order_items (order_id);

-- Index for product sales analytics
CREATE INDEX IF NOT EXISTS idx_order_items_product_id_created_at 
ON order_items (product_id, created_at DESC);

-- Composite index for order item details
CREATE INDEX IF NOT EXISTS idx_order_items_details 
ON order_items (order_id, product_id, quantity, price);

-- ====================================================================
-- USER_PROFILES TABLE INDEXES
-- ====================================================================

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_email 
ON user_profiles (email);

-- Index for user profile updates
CREATE INDEX IF NOT EXISTS idx_user_profiles_updated_at 
ON user_profiles (updated_at DESC);

-- ====================================================================
-- CART TABLE INDEXES
-- ====================================================================

-- Index for user cart items (most common query)
CREATE INDEX IF NOT EXISTS idx_cart_user_id_created_at 
ON cart (user_id, created_at DESC);

-- Index for cart item updates
CREATE INDEX IF NOT EXISTS idx_cart_user_product 
ON cart (user_id, product_id);

-- Composite index for cart operations
CREATE INDEX IF NOT EXISTS idx_cart_operations 
ON cart (user_id, product_id, quantity, updated_at);

-- ====================================================================
-- USER_ADDRESSES TABLE INDEXES
-- ====================================================================

-- Index for user addresses
CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id_type 
ON user_addresses (user_id, type);

-- Index for default address lookups
CREATE INDEX IF NOT EXISTS idx_user_addresses_default 
ON user_addresses (user_id, is_default) WHERE is_default = true;

-- ====================================================================
-- WISHLIST TABLE INDEXES
-- ====================================================================

-- Index for user wishlist
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id_created_at 
ON wishlist (user_id, created_at DESC);

-- Index for product wishlist analytics
CREATE INDEX IF NOT EXISTS idx_wishlist_product_id 
ON wishlist (product_id);

-- ====================================================================
-- REVIEWS TABLE INDEXES
-- ====================================================================

-- Index for product reviews
CREATE INDEX IF NOT EXISTS idx_reviews_product_id_created_at 
ON reviews (product_id, created_at DESC);

-- Index for user reviews
CREATE INDEX IF NOT EXISTS idx_reviews_user_id_created_at 
ON reviews (user_id, created_at DESC);

-- Index for verified reviews
CREATE INDEX IF NOT EXISTS idx_reviews_verified 
ON reviews (product_id, is_verified, rating) WHERE is_verified = true;

-- ====================================================================
-- NOTIFICATIONS TABLE INDEXES
-- ====================================================================

-- Index for user notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_created_at 
ON notifications (user_id, created_at DESC);

-- Index for unread notifications
CREATE INDEX IF NOT EXISTS idx_notifications_unread 
ON notifications (user_id, is_read, created_at DESC) WHERE is_read = false;

-- ====================================================================
-- ANALYTICS INDEXES
-- ====================================================================

-- Index for sales analytics (orders by date)
CREATE INDEX IF NOT EXISTS idx_orders_analytics_date 
ON orders (DATE(created_at), status, total_amount);

-- Index for product performance analytics
CREATE INDEX IF NOT EXISTS idx_order_items_analytics 
ON order_items (product_id, created_at, quantity, price);

-- ====================================================================
-- SEARCH OPTIMIZATION
-- ====================================================================

-- Full-text search index for products
CREATE INDEX IF NOT EXISTS idx_products_search 
ON products USING gin(
  to_tsvector('english', 
    coalesce(name, '') || ' ' || 
    coalesce(description, '')
  )
);

-- ====================================================================
-- PARTIAL INDEXES FOR COMMON FILTERS
-- ====================================================================

-- Index for active products only
CREATE INDEX IF NOT EXISTS idx_products_active 
ON products (popular, created_at) WHERE popular = true;

-- Index for pending orders only
CREATE INDEX IF NOT EXISTS idx_orders_pending 
ON orders (created_at DESC) WHERE status = 'pending';

-- Index for paid orders only
CREATE INDEX IF NOT EXISTS idx_orders_paid 
ON orders (created_at DESC) WHERE status = 'paid';

-- ====================================================================
-- VERIFICATION QUERIES
-- ====================================================================

-- Check all indexes were created
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- Check index usage (run after some time)
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes 
WHERE schemaname = 'public'
  AND indexname LIKE 'idx_%'
ORDER BY idx_scan DESC;

-- ====================================================================
-- PERFORMANCE MONITORING
-- ====================================================================

-- Query to monitor slow queries (enable log_min_duration_statement)
-- This should be run periodically to identify slow queries
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  rows
FROM pg_stat_statements 
WHERE query LIKE '%products%' 
   OR query LIKE '%orders%'
   OR query LIKE '%cart%'
ORDER BY mean_time DESC
LIMIT 10;

-- ====================================================================
-- INDEX MAINTENANCE
-- ====================================================================

-- Regular maintenance: Update table statistics
-- Run this periodically (weekly/monthly)
ANALYZE products;
ANALYZE orders;
ANALYZE order_items;
ANALYZE cart;
ANALYZE user_profiles;
ANALYZE user_addresses;
ANALYZE wishlist;
ANALYZE reviews;
ANALYZE notifications;

-- ====================================================================
-- SETUP COMPLETE
-- ====================================================================
-- Your TrueSkin database now has optimized indexes for:
-- ✅ Fast product loading and filtering
-- ✅ Efficient order management
-- ✅ Quick cart operations
-- ✅ Fast user profile lookups
-- ✅ Optimized search functionality
-- ✅ Analytics and reporting queries
-- ✅ Admin dashboard performance

-- Next steps:
-- 1. Monitor query performance using pg_stat_statements
-- 2. Run ANALYZE regularly to update statistics
-- 3. Consider partitioning for very large tables
-- 4. Set up query monitoring and alerting
