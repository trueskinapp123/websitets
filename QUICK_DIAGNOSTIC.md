# Google OAuth Quick Diagnostic

## 🔍 **Most Common Issues (Check These First)**

### **1. Google OAuth Provider Not Enabled**
**Check:** Supabase Dashboard → Authentication → Providers
- Find "Google" in the list
- Toggle "Enable sign in with Google" to ON
- **This is the #1 cause of Google auth not working**

### **2. Missing Google OAuth Credentials**
**Check:** Authentication → Providers → Google
- If you see "Client ID" and "Client Secret" fields empty
- You need to set up Google OAuth credentials

**Quick Setup:**
1. Go to https://console.cloud.google.com/
2. Create/select project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add redirect URI: `https://xnlsijpognudxyoswajm.supabase.co/auth/v1/callback`
6. Copy Client ID and Secret to Supabase

### **3. Incorrect Site URL**
**Check:** Authentication → URL Configuration
- Site URL should be: `http://localhost:5173`
- Redirect URLs should include: `http://localhost:5173`

### **4. Database Tables Missing**
**Check:** Table Editor in Supabase
- Should see: `user_profiles`, `products`, `cart_items`, `orders`, `order_items`
- If missing, re-run `complete-database-setup.sql`

## 🚀 **Quick Test Steps**

### **Step 1: Test Current Setup**
1. Go to `http://localhost:5173`
2. Click "Sign In"
3. Click "Continue with Google"
4. **What happens?**
   - Redirects to Google? ✅ OAuth is working
   - Shows error? ❌ Check Supabase configuration
   - Nothing happens? ❌ Check browser console

### **Step 2: Check Browser Console**
1. Open browser developer tools (F12)
2. Go to Console tab
3. Try Google sign-in
4. **Look for error messages**

### **Step 3: Check Supabase Logs**
1. Go to Supabase Dashboard
2. Go to `Logs` section
3. Look for authentication errors

## 🔧 **Emergency Fix Checklist**

**Run through this checklist:**

- [ ] Google OAuth provider enabled in Supabase?
- [ ] Google OAuth credentials set in Supabase?
- [ ] Site URL set to `http://localhost:5173`?
- [ ] Redirect URLs include `http://localhost:5173`?
- [ ] Database tables exist?
- [ ] RLS policies enabled?
- [ ] Browser cache cleared?
- [ ] Development server restarted?

## 📞 **Need Help?**

**Tell me:**
1. What happens when you click "Continue with Google"?
2. Any error messages in browser console?
3. What do you see in Supabase Authentication → Providers?

**Most likely fix:** Enable Google OAuth provider in Supabase dashboard! 🎯
