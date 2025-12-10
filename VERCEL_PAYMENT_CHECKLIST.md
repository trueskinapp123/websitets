# ✅ Vercel Payment Setup - Quick Checklist

## 🎯 **What to Do Now**

### **Step 1: Determine Your Setup** 
- [ ] Do you have the `/api` folder deployed with your frontend? 
  - ✅ YES → Use **Option 1** (Single Deployment)
  - ❌ NO → Use **Option 2** (Separate Deployments)

---

## 📝 **Option 1: Single Deployment (Recommended)**

### Environment Variables (Frontend Project Only):

Go to: **Vercel Dashboard → Your Frontend Project → Settings → Environment Variables**

Add these variables:

| Variable Name | Value | Where Used |
|--------------|-------|------------|
| `RAZORPAY_KEY_ID` | `rzp_live_RUxNePnU13x2DI` | Serverless functions (`/api/*`) |
| `RAZORPAY_KEY_SECRET` | `3UuaVU6AriFoJEFJLSaBNxq4` | Serverless functions (`/api/*`) |
| `VITE_RAZORPAY_KEY_ID` | `rzp_live_RUxNePnU13x2DI` | Frontend React app |
| `VITE_SUPABASE_URL` | `https://xnlsijpognudxyoswajm.supabase.co` | Frontend |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Frontend |
| `VITE_RESEND_API_KEY` | `re_YfWA73w2_HWuUUG4owqJnvjgzZRXEXQCc` | Frontend |

**Important:** 
- DO NOT set `VITE_API_URL` (will use relative URLs automatically)
- Make sure to select **Production, Preview, and Development** for each variable

### After Adding Variables:
- [ ] Redeploy your frontend project
- [ ] Test payment flow on your live site

---

## 📝 **Option 2: Separate Deployments**

### Backend Project Environment Variables:

| Variable Name | Value |
|--------------|-------|
| `RAZORPAY_KEY_ID` | `rzp_live_RUxNePnU13x2DI` |
| `RAZORPAY_KEY_SECRET` | `3UuaVU6AriFoJEFJLSaBNxq4` |

### Frontend Project Environment Variables:

| Variable Name | Value |
|--------------|-------|
| `VITE_RAZORPAY_KEY_ID` | `rzp_live_RUxNePnU13x2DI` |
| `VITE_API_URL` | `https://your-backend-url.vercel.app` |
| `VITE_SUPABASE_URL` | `https://xnlsijpognudxyoswajm.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `VITE_RESEND_API_KEY` | `re_YfWA73w2_HWuUUG4owqJnvjgzZRXEXQCc` |

### After Adding Variables:
- [ ] Redeploy both projects
- [ ] Test payment flow on your live site

---

## 🧪 **Testing Checklist**

1. [ ] Add product to cart
2. [ ] Go to checkout page
3. [ ] Fill shipping information
4. [ ] Click "Pay Now" button
5. [ ] Razorpay popup should open
6. [ ] Complete test payment
7. [ ] Verify order created in database
8. [ ] Check email notifications received
9. [ ] Cart should be cleared

---

## 🔧 **Common Issues & Fixes**

### ❌ "Razorpay Key ID not found"
**Fix:** Add `VITE_RAZORPAY_KEY_ID` to environment variables

### ❌ "API endpoint returned HTML instead of JSON"
**Fix:** 
- Option 1: Check that `/api` folder exists in your deployment
- Option 2: Verify `VITE_API_URL` points to correct backend URL

### ❌ "Payment verification failed"
**Fix:** Check `RAZORPAY_KEY_SECRET` is set (without `VITE_` prefix)

### ❌ CORS errors
**Fix:** 
- Option 1: Should work automatically (same domain)
- Option 2: Backend already has CORS headers ✅

---

## 📞 **Quick Links**

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Razorpay Dashboard:** https://dashboard.razorpay.com/
- **Your Supabase Project:** https://supabase.com/dashboard

---

## ⚠️ **Important Reminders**

1. ✅ Never commit real credentials to Git
2. ✅ Use Vercel Environment Variables (encrypted & secure)
3. ✅ Redeploy after adding/changing environment variables
4. ✅ Test with real payment in production
5. ✅ Keep your Razorpay keys secure

---

## 🎉 **You're Done!**

Once you've:
1. Added all environment variables
2. Redeployed your project(s)
3. Tested the payment flow

Your payments should work perfectly! 🚀

