# Fix Google OAuth for Deployed Version

## 🚨 **Problem: OAuth works locally but not in production**

This is a **redirect URL configuration issue**. The deployed version has a different URL than `localhost:5173`.

## 🔧 **Solution Steps:**

### **Step 1: Update Supabase Configuration**

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select project: `xnlsijpognudxyoswajm`

2. **Update Site URL**
   - Go to `Authentication` → `URL Configuration`
   - Change Site URL from `http://localhost:5173` to your deployed URL
   - Example: `https://your-app-name.vercel.app` or `https://your-domain.com`

3. **Update Redirect URLs**
   - Add your deployed URL to Redirect URLs
   - Example: `https://your-app-name.vercel.app`
   - Example: `https://your-app-name.vercel.app/**`
   - Keep `http://localhost:5173` for local development

### **Step 2: Update Google OAuth Configuration**

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select your project
   - Go to `APIs & Services` → `Credentials`

2. **Update OAuth 2.0 Client**
   - Find your OAuth 2.0 Client ID
   - Click to edit
   - Add your deployed URL to "Authorized redirect URIs"
   - Example: `https://xnlsijpognudxyoswajm.supabase.co/auth/v1/callback`

### **Step 3: Common Deployed URLs**

**If you're using:**
- **Vercel**: `https://your-app-name.vercel.app`
- **Netlify**: `https://your-app-name.netlify.app`
- **GitHub Pages**: `https://username.github.io/repo-name`
- **Custom Domain**: `https://your-domain.com`

## 📋 **Quick Fix Checklist:**

- [ ] **Supabase Site URL** = Your deployed URL
- [ ] **Supabase Redirect URLs** = Include your deployed URL
- [ ] **Google OAuth Redirect URI** = `https://xnlsijpognudxyoswajm.supabase.co/auth/v1/callback`
- [ ] **Environment Variables** = Updated for production

## 🔍 **Find Your Deployed URL:**

**Tell me:**
1. **Where is your app deployed?** (Vercel, Netlify, etc.)
2. **What's your deployed URL?** (e.g., `https://trueskin.vercel.app`)

## 🚀 **Quick Test:**

After updating the URLs:
1. **Clear browser cache**
2. **Try Google sign-in on deployed version**
3. **Check browser console for errors**

---

**The issue is definitely redirect URL configuration - this is a very common OAuth problem!** 🎯
