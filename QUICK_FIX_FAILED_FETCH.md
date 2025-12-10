# ⚡ Quick Fix: "Failed to fetch" Error

## 🎯 **Most Common Cause: VITE_API_URL Not Set**

If you're getting "Failed to fetch", it's **99% likely** that `VITE_API_URL` is not set in your frontend Vercel deployment.

---

## ✅ **IMMEDIATE FIX (2 Steps)**

### **Step 1: Check Your Backend URL**

1. Go to **Vercel Dashboard**
2. Click on your **Backend Project**
3. Copy the **Production URL** (e.g., `https://your-backend-name.vercel.app`)
4. Test it works: Open `https://your-backend-name.vercel.app/api/health` in browser

---

### **Step 2: Set VITE_API_URL in Frontend**

1. Go to **Vercel Dashboard**
2. Click on your **Frontend Project**
3. Go to **Settings → Environment Variables**
4. Add this variable:

```
Variable Name: VITE_API_URL
Value: https://your-backend-name.vercel.app
```

**Important:**
- ✅ **NO trailing slash** (e.g., `https://api.example.com` not `https://api.example.com/`)
- ✅ Select **Production, Preview, and Development**
- ✅ **Save**

5. **Redeploy Frontend:**
   - Go to **Deployments** tab
   - Click **"..."** on latest deployment
   - Click **"Redeploy"**
   - OR push a commit to trigger auto-deploy

---

## 🔍 **Verify It's Working**

After redeploying:

1. **Open your frontend website**
2. **Press F12** (Developer Console)
3. **Go to Console tab**
4. **Try payment again**
5. **Look for debug logs** - you should see:
   ```
   🔍 Payment Debug Info:
   - VITE_API_URL: https://your-backend-name.vercel.app
   - Resolved API URL: https://your-backend-name.vercel.app
   - Full Order URL: https://your-backend-name.vercel.app/api/create-order
   ```

If you see:
- ❌ `VITE_API_URL: undefined` → Environment variable not set
- ❌ `Resolved API URL: ` (empty) → Using relative URL (wrong for separate deployments)
- ✅ `Resolved API URL: https://...` → Correct! Should work now

---

## 🚨 **Still Not Working?**

### **Check 1: Is VITE_API_URL Really Set?**

1. In browser console, check the debug logs
2. If it shows `undefined`, the env var isn't loaded
3. **Solution:** Redeploy after setting env vars

### **Check 2: Can You Access Backend Directly?**

Open in browser:
```
https://your-backend-url.vercel.app/api/health
```

**Expected:** JSON response with `"status": "OK"`

**If not working:**
- Backend might not be deployed
- Check backend project on Vercel

### **Check 3: Network Tab**

1. Open **Network tab** in Developer Tools (F12)
2. Try payment
3. Look for `/api/create-order` request
4. Check:
   - **Status:** Should be 200 or 503 (not failed)
   - **URL:** Should match your backend URL
   - **Error:** Check error message

---

## 📋 **Complete Checklist**

### Frontend Environment Variables (All Required):
- [ ] `VITE_API_URL` = `https://your-backend-url.vercel.app` ← **MOST IMPORTANT**
- [ ] `VITE_RAZORPAY_KEY_ID` = `rzp_live_RUxNePnU13x2DI`
- [ ] `VITE_SUPABASE_URL` = `https://xnlsijpognudxyoswajm.supabase.co`
- [ ] `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- [ ] `VITE_RESEND_API_KEY` = `re_YfWA73w2_HWuUUG4owqJnvjgzZRXEXQCc`

### After Setting:
- [ ] **Redeploy frontend** (IMPORTANT!)
- [ ] Clear browser cache
- [ ] Test payment flow
- [ ] Check console logs

---

## 💡 **Why This Happens**

For **Option B (Separate Deployments)**, the frontend needs to know where your backend is.

Without `VITE_API_URL`:
- Frontend tries to use relative URLs (e.g., `/api/create-order`)
- This only works if backend is on the same domain
- Since backend is separate, it fails with "Failed to fetch"

With `VITE_API_URL` set:
- Frontend calls: `https://your-backend-url.vercel.app/api/create-order`
- This works because backend is accessible at that URL ✅

---

## 🎉 **That's It!**

After setting `VITE_API_URL` and redeploying, payments should work!

The new debug logs will help you see exactly what's happening if there are any other issues.

