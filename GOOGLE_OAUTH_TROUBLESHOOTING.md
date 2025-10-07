# Google OAuth Troubleshooting Guide

## 🔍 **Common Issues & Solutions**

### **Issue 1: Google OAuth Provider Not Enabled**

**Check:** Go to Supabase Dashboard → Authentication → Providers
**Solution:** 
1. Find "Google" in the list
2. Toggle "Enable sign in with Google" to ON
3. You'll need Google OAuth credentials

### **Issue 2: Missing Google OAuth Credentials**

**Check:** Authentication → Providers → Google
**Solution:**
1. Go to Google Cloud Console: https://console.cloud.google.com/
2. Create/select a project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `https://xnlsijpognudxyoswajm.supabase.co/auth/v1/callback`
6. Copy Client ID and Secret to Supabase

### **Issue 3: Incorrect Site URL Configuration**

**Check:** Authentication → URL Configuration
**Solution:**
1. Set Site URL to: `http://localhost:5173`
2. Add to Redirect URLs: `http://localhost:5173`
3. Add to Redirect URLs: `http://localhost:5173/**`

### **Issue 4: Database Tables Missing**

**Check:** Table Editor in Supabase
**Solution:**
1. Verify these tables exist:
   - `user_profiles`
   - `products`
   - `cart_items`
   - `orders`
   - `order_items`
2. If missing, re-run `complete-database-setup.sql`

### **Issue 5: RLS Policies Not Enabled**

**Check:** Authentication → Policies
**Solution:**
1. Verify Row Level Security is enabled
2. Check that policies exist for all tables
3. Re-run the database setup script if needed

## 🚀 **Step-by-Step Fix Process**

### **Step 1: Verify Google OAuth Setup**

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select project: `xnlsijpognudxyoswajm`

2. **Check Authentication Settings**
   - Go to `Authentication` → `Providers`
   - Verify Google is enabled
   - Check if Client ID and Secret are set

### **Step 2: Check URL Configuration**

1. **Go to URL Configuration**
   - Authentication → URL Configuration
   - Site URL: `http://localhost:5173`
   - Redirect URLs should include:
     - `http://localhost:5173`
     - `http://localhost:5173/**`

### **Step 3: Verify Database Setup**

1. **Check Tables Exist**
   - Go to `Table Editor`
   - Verify these tables exist:
     - `user_profiles`
     - `products`
     - `cart_items`
     - `orders`
     - `order_items`

2. **Check RLS Policies**
   - Go to `Authentication` → `Policies`
   - Verify policies are enabled for all tables

### **Step 4: Test Google OAuth**

1. **Clear Browser Cache**
   - Clear cookies and cache
   - Try incognito/private mode

2. **Test Authentication**
   - Go to `http://localhost:5173`
   - Click "Sign In"
   - Click "Continue with Google"
   - Check browser console for errors

## 🔧 **Quick Diagnostic Commands**

### **Check Supabase Connection**
```javascript
// Open browser console and run:
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY);
```

### **Test Supabase Connection**
```javascript
// In browser console:
import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://xnlsijpognudxyoswajm.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhubHNpanBvZ251ZHh5b3N3YWptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzkxMzIsImV4cCI6MjA3NDA1NTEzMn0.7Oh90h9o3VUrsfVSYgP9h856Ve0yow76B1oXlK-l1Fs');
supabase.auth.getSession().then(console.log);
```

## 📋 **Error Messages & Solutions**

### **"Invalid redirect URI"**
- **Cause:** Google OAuth redirect URI doesn't match
- **Solution:** Update Google Cloud Console with correct redirect URI

### **"Site URL not configured"**
- **Cause:** Supabase Site URL not set
- **Solution:** Set Site URL to `http://localhost:5173`

### **"Database error saving new user"**
- **Cause:** Database tables missing
- **Solution:** Run `complete-database-setup.sql`

### **"Provider not enabled"**
- **Cause:** Google OAuth not enabled in Supabase
- **Solution:** Enable Google provider in Supabase dashboard

## 🎯 **Most Likely Issues**

Based on your symptoms, check these in order:

1. **Google OAuth Provider Not Enabled** (Most Common)
2. **Missing Google OAuth Credentials**
3. **Incorrect Site URL Configuration**
4. **Database Tables Missing**

## 🚨 **Emergency Fix**

If nothing works, try this complete reset:

1. **Re-run Database Setup**
   - Copy `complete-database-setup.sql`
   - Run in Supabase SQL Editor

2. **Reset Google OAuth**
   - Disable Google provider
   - Re-enable Google provider
   - Re-enter credentials

3. **Clear All Caches**
   - Browser cache
   - Supabase cache
   - Restart development server

---

**Follow this guide step by step - one of these solutions will fix your Google OAuth issue!** 🔧
