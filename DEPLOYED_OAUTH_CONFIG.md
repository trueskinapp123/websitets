# Fix Google OAuth for trueskinapp.vercel.app and trueskin.app

## 🎯 **Exact Configuration for Your Domains**

### **Step 1: Update Supabase Configuration**

**Go to:** https://supabase.com/dashboard → Project `xnlsijpognudxyoswajm` → Authentication → URL Configuration

**Update these settings:**

#### **Site URL:**
```
https://trueskin.app
```

#### **Redirect URLs (add all of these):**
```
http://localhost:5173
http://localhost:5173/**
https://trueskinapp.vercel.app
https://trueskinapp.vercel.app/**
https://trueskin.app
https://trueskin.app/**
```

### **Step 2: Update Google OAuth Configuration**

**Go to:** https://console.cloud.google.com/ → Your Project → APIs & Services → Credentials

**Find your OAuth 2.0 Client ID and update:**

#### **Authorized JavaScript origins:**
```
http://localhost:5173
https://trueskinapp.vercel.app
https://trueskin.app
```

#### **Authorized redirect URIs:**
```
https://xnlsijpognudxyoswajm.supabase.co/auth/v1/callback
```

### **Step 3: Environment Variables for Production**

**In your Vercel deployment, add these environment variables:**

```bash
VITE_SUPABASE_URL=https://xnlsijpognudxyoswajm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhubHNpanBvZ251ZHh5b3N3YWptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzkxMzIsImV4cCI6MjA3NDA1NTEzMn0.7Oh90h9o3VUrsfVSYgP9h856Ve0yow76B1oXlK-l1Fs
```

### **Step 4: Test Both Domains**

After updating the configuration:

1. **Test trueskinapp.vercel.app:**
   - Go to `https://trueskinapp.vercel.app`
   - Click "Sign In" → "Continue with Google"
   - Should work!

2. **Test trueskin.app:**
   - Go to `https://trueskin.app`
   - Click "Sign In" → "Continue with Google"
   - Should work!

### **Step 5: Clear Cache**

**Important:** After making changes:
1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Try incognito/private mode**
3. **Wait 2-3 minutes** for changes to propagate

## 🚀 **Quick Checklist:**

- [ ] **Supabase Site URL** = `https://trueskin.app`
- [ ] **Supabase Redirect URLs** = Include both domains + localhost
- [ ] **Google OAuth Origins** = Include both domains + localhost
- [ ] **Google OAuth Redirect** = `https://xnlsijpognudxyoswajm.supabase.co/auth/v1/callback`
- [ ] **Vercel Environment Variables** = Supabase keys added
- [ ] **Browser Cache Cleared** = Fresh test

## 🔧 **If Still Not Working:**

**Check browser console for errors:**
1. Open Developer Tools (F12)
2. Go to Console tab
3. Try Google sign-in
4. Look for error messages

**Common issues:**
- **"Invalid redirect URI"** = Google OAuth not updated
- **"Site URL not configured"** = Supabase URL not updated
- **"CORS error"** = Origins not added to Google OAuth

---

**This configuration will make Google OAuth work on both your domains!** 🎯
