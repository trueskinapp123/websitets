# Database Setup Guide - Fix Google Auth Error

## Issue
Google authentication is failing with error: "Database error saving new user"

## Root Cause
The Supabase database doesn't have the required tables to store user profiles and other data.

## Solution

### Step 1: Run Database Setup Script

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project: `xnlsijpognudxyoswajm`

2. **Open SQL Editor**
   - Go to `SQL Editor` in the left sidebar
   - Click `New Query`

3. **Run the Setup Script**
   - Copy the entire content from `complete-database-setup.sql`
   - Paste it into the SQL Editor
   - Click `Run` to execute

### Step 2: Verify Setup

After running the script, you should see:
- ✅ "Tables created successfully"
- ✅ "3" products inserted
- ✅ "Database setup completed successfully!"

### Step 3: Test Google Authentication

1. **Go to your app**: `http://localhost:5173`
2. **Click "Sign In"**
3. **Click "Continue with Google"**
4. **Complete Google OAuth flow**
5. **Should redirect back successfully**

## What the Script Does

The database setup script creates:

1. **User Profiles Table** - Stores user information
2. **Products Table** - Stores product data
3. **Cart Items Table** - Stores shopping cart data
4. **Orders Table** - Stores order information
5. **Order Items Table** - Stores order line items
6. **Indexes** - For better performance
7. **RLS Policies** - For security
8. **Triggers** - For automatic profile creation
9. **Sample Products** - 3 product packs

## Key Features

- ✅ **Automatic Profile Creation**: When a user signs up with Google, their profile is automatically created
- ✅ **Row Level Security**: Users can only access their own data
- ✅ **Performance Optimized**: Proper indexes for fast queries
- ✅ **Sample Data**: Products are pre-loaded for testing

## Troubleshooting

If you still get errors:

1. **Check Supabase Logs**
   - Go to `Logs` in Supabase dashboard
   - Look for any error messages

2. **Verify Tables Exist**
   - Go to `Table Editor` in Supabase
   - You should see: `user_profiles`, `products`, `cart_items`, `orders`, `order_items`

3. **Check RLS Policies**
   - Go to `Authentication` → `Policies`
   - Verify policies are enabled

## Expected Result

After running the script, Google authentication should work perfectly:
- ✅ User can sign in with Google
- ✅ Profile is automatically created
- ✅ User can access the app
- ✅ Cart and orders functionality works

---

**Note**: This script is safe to run multiple times - it uses `IF NOT EXISTS` and `ON CONFLICT` clauses to prevent errors.
