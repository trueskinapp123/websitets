# 🚀 TrueSkin Database Deployment Guide

## ✅ Issue: "Failed to Create Order" - RESOLVED

The "failed to create order" error is caused by missing database tables in Supabase. This guide will help you set up the complete database schema.

## 📋 Quick Setup (Recommended)

### Step 1: Access Supabase Dashboard
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your TrueSkin project
3. Navigate to **SQL Editor** in the left sidebar

### Step 2: Run Quick Setup Script
1. Copy the contents of `quick-database-setup.sql`
2. Paste it into the SQL Editor
3. Click **Run** to execute the script

### Step 3: Verify Setup
Run this query to verify tables were created:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_profiles', 'products', 'cart', 'orders', 'order_items');
```

## 🔧 Complete Setup (Advanced)

If you need the full database schema with all features:

1. Use `complete-database-setup.sql` instead
2. This includes:
   - All tables with proper constraints
   - Performance indexes
   - Row Level Security (RLS) policies
   - Triggers and functions
   - Sample data

## 📊 Database Schema Overview

### Tables Created:

1. **`user_profiles`** - User account information
2. **`products`** - Product catalog
3. **`cart`** - Shopping cart items
4. **`orders`** - Order information
5. **`order_items`** - Individual items in orders

### Key Features:

- ✅ **Row Level Security (RLS)** - Users can only access their own data
- ✅ **Foreign Key Constraints** - Data integrity
- ✅ **Indexes** - Optimized performance
- ✅ **Triggers** - Automatic timestamp updates
- ✅ **Sample Data** - Ready-to-test products

## 🧪 Testing the Setup

### Test Order Creation:
1. Start your frontend: `npm run dev`
2. Start your backend: `cd backend && node server.js`
3. Go to `http://localhost:5175/`
4. Add products to cart
5. Go to checkout
6. Fill in details and click "Pay Now"

### Expected Behavior:
- ✅ Order should be created in database
- ✅ Payment should process successfully
- ✅ Cart should be cleared after payment
- ✅ Order status should update to "paid"

## 🔍 Troubleshooting

### Common Issues:

1. **"relation does not exist" error**:
   - Run the SQL setup script again
   - Check if tables were created properly

2. **"permission denied" error**:
   - Ensure RLS policies are created
   - Check user authentication

3. **"foreign key constraint" error**:
   - Verify all tables exist
   - Check product IDs match

### Debug Queries:

Check if tables exist:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

Check RLS policies:
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies WHERE schemaname = 'public';
```

Check sample products:
```sql
SELECT id, name, price FROM products;
```

## 🚀 Production Deployment

### For Production:

1. **Update Razorpay Credentials**:
   - Replace test credentials with live ones
   - Update in both frontend and backend

2. **Database Security**:
   - Review RLS policies
   - Set up proper user roles
   - Enable audit logging

3. **Performance**:
   - Monitor query performance
   - Add additional indexes if needed
   - Set up database backups

## 📞 Support

If you encounter issues:

1. **Check Supabase Logs**:
   - Go to Logs in Supabase dashboard
   - Look for SQL errors

2. **Verify Environment Variables**:
   - Check Supabase URL and keys
   - Ensure backend is running

3. **Test Database Connection**:
   - Run a simple query in SQL Editor
   - Verify authentication works

## ✅ Success Checklist

After running the setup:

- [ ] All 5 tables created successfully
- [ ] RLS policies active
- [ ] Sample products inserted
- [ ] Frontend connects to database
- [ ] Order creation works
- [ ] Payment processing works
- [ ] Cart functionality works

Your TrueSkin e-commerce platform is now ready for production! 🎉
