-- Database Connection Test Script
-- Run this in Supabase SQL Editor to test your database setup

-- Test 1: Check if all required tables exist
SELECT 
    'Tables Check' as test_name,
    COUNT(*) as table_count,
    CASE 
        WHEN COUNT(*) = 5 THEN '✅ PASS' 
        ELSE '❌ FAIL - Missing tables' 
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_profiles', 'products', 'cart', 'orders', 'order_items');

-- Test 2: Check if products are inserted
SELECT 
    'Products Check' as test_name,
    COUNT(*) as product_count,
    CASE 
        WHEN COUNT(*) >= 3 THEN '✅ PASS' 
        ELSE '❌ FAIL - No products found' 
    END as status
FROM products;

-- Test 3: Check RLS policies
SELECT 
    'RLS Policies Check' as test_name,
    COUNT(*) as policy_count,
    CASE 
        WHEN COUNT(*) >= 5 THEN '✅ PASS' 
        ELSE '❌ FAIL - Missing RLS policies' 
    END as status
FROM pg_policies 
WHERE schemaname = 'public';

-- Test 4: Check if user_profiles table has proper structure
SELECT 
    'User Profiles Structure' as test_name,
    COUNT(*) as column_count,
    CASE 
        WHEN COUNT(*) >= 10 THEN '✅ PASS' 
        ELSE '❌ FAIL - Missing columns' 
    END as status
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND table_schema = 'public';

-- Test 5: Check if orders table has proper structure
SELECT 
    'Orders Structure' as test_name,
    COUNT(*) as column_count,
    CASE 
        WHEN COUNT(*) >= 10 THEN '✅ PASS' 
        ELSE '❌ FAIL - Missing columns' 
    END as status
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND table_schema = 'public';

-- Test 6: Verify foreign key constraints
SELECT 
    'Foreign Keys Check' as test_name,
    COUNT(*) as fk_count,
    CASE 
        WHEN COUNT(*) >= 4 THEN '✅ PASS' 
        ELSE '❌ FAIL - Missing foreign keys' 
    END as status
FROM information_schema.table_constraints 
WHERE constraint_type = 'FOREIGN KEY' 
AND table_schema = 'public';

-- Test 7: Check if extensions are enabled
SELECT 
    'Extensions Check' as test_name,
    COUNT(*) as ext_count,
    CASE 
        WHEN COUNT(*) >= 1 THEN '✅ PASS' 
        ELSE '❌ FAIL - Missing extensions' 
    END as status
FROM pg_extension 
WHERE extname IN ('uuid-ossp');

-- Summary
SELECT 
    '=== DATABASE SETUP SUMMARY ===' as summary,
    'If all tests show ✅ PASS, your database is ready!' as message;
