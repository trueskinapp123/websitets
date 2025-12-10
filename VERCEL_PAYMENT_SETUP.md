# 🚀 Vercel Payment Setup Guide

## Overview

Your project has **two deployment options** for payments on Vercel:

### Option 1: **Single Deployment (Recommended)** ✅
Deploy frontend + serverless API functions together (easiest, already configured)

### Option 2: **Separate Deployments**
Keep frontend and backend as separate Vercel projects

---

## ✅ **OPTION 1: Single Deployment (Recommended)**

If your frontend deployment includes the `/api` folder with serverless functions, you're all set! Just configure environment variables.

### **Step 1: Configure Environment Variables in Vercel**

Go to your **frontend project** on Vercel Dashboard:
1. Settings → Environment Variables
2. Add these variables:

```env
# Razorpay Configuration (Serverless Functions)
RAZORPAY_KEY_ID=rzp_live_RUxNePnU13x2DI
RAZORPAY_KEY_SECRET=3UuaVU6AriFoJEFJLSaBNxq4

# Frontend Razorpay Key (for client-side)
VITE_RAZORPAY_KEY_ID=rzp_live_RUxNePnU13x2DI

# Supabase Configuration
VITE_SUPABASE_URL=https://xnlsijpognudxyoswajm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhubHNpanBvZ251ZHh5b3N3YWptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzkxMzIsImV4cCI6MjA3NDA1NTEzMn0.7Oh90h9o3VUrsfVSYgP9h856Ve0yow76B1oXlK-l1Fs

# Email Configuration (Resend)
VITE_RESEND_API_KEY=re_YfWA73w2_HWuUUG4owqJnvjgzZRXEXQCc

# Backend API URL (Leave empty or don't set - uses relative URLs)
# VITE_API_URL= (optional - will use relative URLs automatically)
```

**Important Notes:**
- `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are used by **serverless functions** (no `VITE_` prefix)
- `VITE_RAZORPAY_KEY_ID` is used by the **frontend** React app
- Don't add `VITE_API_URL` - the code will automatically use relative URLs (`/api/*`)

### **Step 2: Redeploy**

After adding environment variables, trigger a new deployment:
- Push to your repository, OR
- Go to Vercel Dashboard → Deployments → Click "..." → Redeploy

### **Step 3: Verify**

1. Visit your deployed site
2. Try the checkout flow
3. Check browser console for any errors

---

## ⚙️ **OPTION 2: Separate Deployments**

If your backend is deployed as a separate Vercel project:

### **Backend Deployment (Separate Project)**

1. **Environment Variables:**
```env
RAZORPAY_KEY_ID=rzp_live_RUxNePnU13x2DI
RAZORPAY_KEY_SECRET=3UuaVU6AriFoJEFJLSaBNxq4
```

2. **Get Backend URL:**
   - Go to your backend project on Vercel
   - Copy the deployment URL (e.g., `https://your-backend.vercel.app`)

### **Frontend Deployment**

1. **Environment Variables:**
```env
# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=rzp_live_RUxNePnU13x2DI

# Supabase Configuration
VITE_SUPABASE_URL=https://xnlsijpognudxyoswajm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhubHNpanBvZ251ZHh5b3N3YWptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzkxMzIsImV4cCI6MjA3NDA1NTEzMn0.7Oh90h9o3VUrsfVSYgP9h856Ve0yow76B1oXlK-l1Fs

# Email Configuration
VITE_RESEND_API_KEY=re_YfWA73w2_HWuUUG4owqJnvjgzZRXEXQCc

# Backend API URL (Your separate backend URL)
VITE_API_URL=https://your-backend.vercel.app
```

2. **Enable CORS on Backend:**
   - Your serverless functions already have CORS headers ✅
   - But make sure your backend URL allows requests from your frontend domain

---

## 🔍 **Troubleshooting**

### Issue: "Razorpay Key ID not found"
**Solution:** Make sure `VITE_RAZORPAY_KEY_ID` is set in Vercel environment variables

### Issue: "API endpoint returned HTML instead of JSON"
**Solution:** 
- For Option 1: Make sure `/api` folder is included in deployment
- For Option 2: Check `VITE_API_URL` points to correct backend URL

### Issue: "Payment verification failed"
**Solution:** Check that `RAZORPAY_KEY_SECRET` is set correctly (without `VITE_` prefix)

### Issue: CORS errors
**Solution:** 
- Option 1: Should work automatically (same domain)
- Option 2: Verify CORS headers in serverless functions and backend URL

---

## 📋 **Checklist**

### Before Testing:
- [ ] Environment variables added to Vercel (for both projects if separate)
- [ ] Redeployed after adding environment variables
- [ ] Razorpay credentials are correct (live keys, not test keys)
- [ ] Supabase credentials are correct
- [ ] Resend API key is correct

### Testing:
- [ ] Add item to cart
- [ ] Go to checkout
- [ ] Fill shipping details
- [ ] Click "Pay Now"
- [ ] Complete Razorpay payment
- [ ] Verify order saved to database
- [ ] Check email notifications received

---

## 🔐 **Security Notes**

1. **Never commit `.env` files** with real credentials to Git
2. **Use Vercel Environment Variables** - they're encrypted and secure
3. **Separate Test/Live Keys:**
   - Test: `rzp_test_...`
   - Live: `rzp_live_...`
4. **Key Secret should NEVER be exposed to frontend** - only in serverless functions

---

## 📞 **Quick Reference**

**Razorpay Dashboard:** https://dashboard.razorpay.com/
**Vercel Dashboard:** https://vercel.com/dashboard
**Environment Variables:** Vercel Project → Settings → Environment Variables

---

## 🎯 **Recommended Setup**

For your case, **Option 1 (Single Deployment)** is recommended because:
- ✅ Already configured in `vercel.json`
- ✅ Simpler to manage (one deployment)
- ✅ No CORS issues
- ✅ Faster (same domain)
- ✅ Lower latency

If you need separate deployments for specific reasons, use Option 2 and make sure to set `VITE_API_URL` to your backend URL.

