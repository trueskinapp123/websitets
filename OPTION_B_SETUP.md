# 🚀 Option B: Separate Backend Deployment - Complete Setup Guide

Since you're using **separate deployments** (backend and frontend are different Vercel projects), follow these steps:

---

## 📋 **STEP 1: Backend Deployment Configuration**

### **1.1: Environment Variables (Backend Project)**

Go to: **Vercel Dashboard → Your Backend Project → Settings → Environment Variables**

Add these variables (select **Production, Preview, and Development** for each):

```env
RAZORPAY_KEY_ID=rzp_live_RUxNePnU13x2DI
RAZORPAY_KEY_SECRET=3UuaVU6AriFoJEFJLSaBNxq4
```

**Important:**
- ✅ NO `VITE_` prefix (these are server-side only)
- ✅ These are used by `/api/create-order.js` and `/api/verify-payment.js`
- ✅ Make sure `/api` folder is deployed with your backend project

### **1.2: Verify Backend Structure**

Your backend project should have this structure:
```
your-backend-project/
├── api/
│   ├── index.js          (root endpoint - just created)
│   ├── health.js         (health check)
│   ├── create-order.js   (Razorpay order creation)
│   ├── verify-payment.js (payment verification)
│   └── admin/
│       ├── orders.js
│       └── users.js
├── package.json          (must include "razorpay" dependency)
└── vercel.json           (optional)
```

### **1.3: Test Backend**

After deploying with environment variables, test:

1. **Root endpoint:**
   ```
   GET https://your-backend-url.vercel.app/api
   ```
   Should return API info

2. **Health check:**
   ```
   GET https://your-backend-url.vercel.app/api/health
   ```
   Should show: `"razorpay": true` (means env vars are loaded)

---

## 📋 **STEP 2: Frontend Deployment Configuration**

### **2.1: Get Your Backend URL**

1. Go to your **backend project** on Vercel
2. Copy the **Production URL** (e.g., `https://your-backend-name.vercel.app`)
3. Keep this URL handy

### **2.2: Environment Variables (Frontend Project)**

Go to: **Vercel Dashboard → Your Frontend Project → Settings → Environment Variables**

Add these variables (select **Production, Preview, and Development** for each):

```env
# Backend API URL (REQUIRED - points to your backend deployment)
VITE_API_URL=https://your-backend-url.vercel.app

# Razorpay Client Key (for frontend)
VITE_RAZORPAY_KEY_ID=rzp_live_RUxNePnU13x2DI

# Supabase Configuration
VITE_SUPABASE_URL=https://xnlsijpognudxyoswajm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhubHNpanBvZ251ZHh5b3N3YWptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzkxMzIsImV4cCI6MjA3NDA1NTEzMn0.7Oh90h9o3VUrsfVSYgP9h856Ve0yow76B1oXlK-l1Fs

# Email Configuration (Resend)
VITE_RESEND_API_KEY=re_YfWA73w2_HWuUUG4owqJnvjgzZRXEXQCc
```

**Critical:**
- ✅ **Replace** `https://your-backend-url.vercel.app` with your **actual backend URL**
- ✅ `VITE_API_URL` tells the frontend where to find your backend API
- ✅ Do NOT include trailing slash (e.g., `https://api.example.com` not `https://api.example.com/`)

---

## 📋 **STEP 3: Redeploy Both Projects**

### **3.1: Redeploy Backend**
- After adding environment variables, trigger a new deployment
- OR push a commit to trigger auto-deploy
- Verify health endpoint works: `https://your-backend-url.vercel.app/api/health`

### **3.2: Redeploy Frontend**
- After adding environment variables, trigger a new deployment
- OR push a commit to trigger auto-deploy
- Verify frontend loads correctly

---

## 🧪 **STEP 4: Testing**

### **4.1: Test Backend First**

Open in browser or use curl:
```bash
curl https://your-backend-url.vercel.app/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "TrueSkin Backend API is running",
  "services": {
    "razorpay": true,    ← Should be true!
    "supabase": true
  }
}
```

### **4.2: Test Payment Flow on Frontend**

1. Visit your **frontend website**
2. Open browser **Developer Console** (F12)
3. Go to checkout page
4. Fill form and click "Pay Now"
5. Check console for any errors

**Look for:**
- ✅ API calls to: `https://your-backend-url.vercel.app/api/create-order`
- ❌ CORS errors (shouldn't happen - backend has CORS headers)
- ❌ 404 errors (means wrong URL)
- ❌ 503 errors (means env vars not set)

---

## 🔍 **Troubleshooting**

### ❌ **Issue: Frontend can't reach backend**

**Symptoms:**
- Error: "Failed to fetch"
- Error: "Network error"
- Error: "API endpoint returned HTML"

**Fix:**
1. Check `VITE_API_URL` is set correctly in frontend env vars
2. Verify backend URL is accessible: `https://your-backend-url.vercel.app/api/health`
3. Make sure both projects are deployed
4. Check browser console for exact error message

### ❌ **Issue: "Razorpay Key ID not found"**

**Fix:**
- Add `VITE_RAZORPAY_KEY_ID` to **frontend** environment variables

### ❌ **Issue: "Payment verification failed"**

**Fix:**
- Check `RAZORPAY_KEY_SECRET` is set in **backend** environment variables
- Must NOT have `VITE_` prefix

### ❌ **Issue: Backend returns 503 "Razorpay not configured"**

**Fix:**
1. Verify `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are in **backend** project
2. Check they're set for **Production** environment
3. Redeploy backend after adding variables

### ❌ **Issue: CORS errors**

**Fix:**
- Backend already has CORS headers ✅
- If still getting CORS errors, check backend URL in `VITE_API_URL` is correct
- Make sure backend deployment includes CORS headers (already in code)

---

## ✅ **Final Checklist**

### Backend Project:
- [ ] Environment variables added: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
- [ ] `/api` folder exists with all functions
- [ ] `package.json` includes `razorpay` dependency
- [ ] Health endpoint works: `/api/health` shows `razorpay: true`
- [ ] Project is deployed and accessible

### Frontend Project:
- [ ] `VITE_API_URL` set to your backend URL (e.g., `https://backend-name.vercel.app`)
- [ ] `VITE_RAZORPAY_KEY_ID` set
- [ ] `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` set
- [ ] `VITE_RESEND_API_KEY` set
- [ ] Project is deployed
- [ ] Browser console shows no API errors

### Testing:
- [ ] Backend health check works
- [ ] Frontend loads without errors
- [ ] Checkout page loads
- [ ] "Pay Now" button works
- [ ] Razorpay popup opens
- [ ] Payment completes successfully
- [ ] Order saved to database
- [ ] Email notifications sent

---

## 🎯 **Quick Reference**

| Component | Location | Environment Variables |
|-----------|----------|---------------------|
| **Backend** | Separate Vercel Project | `RAZORPAY_KEY_ID`<br>`RAZORPAY_KEY_SECRET` |
| **Frontend** | Separate Vercel Project | `VITE_API_URL` (backend URL)<br>`VITE_RAZORPAY_KEY_ID`<br>`VITE_SUPABASE_URL`<br>`VITE_SUPABASE_ANON_KEY`<br>`VITE_RESEND_API_KEY` |

---

## 📞 **Need Help?**

If you're still having issues:

1. **Check Backend:**
   - URL: `https://your-backend-url.vercel.app/api/health`
   - Should return JSON with `razorpay: true`

2. **Check Frontend Console:**
   - Open Developer Tools (F12)
   - Look for network errors
   - Check if API calls are going to correct URL

3. **Verify Environment Variables:**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Make sure variables are set for **Production**
   - Redeploy after adding/changing variables

---

## 🎉 **You're All Set!**

Once you've:
1. ✅ Set environment variables in both projects
2. ✅ Redeployed both projects
3. ✅ Verified backend health endpoint works
4. ✅ Tested payment flow on frontend

Your payments should work perfectly! 🚀

