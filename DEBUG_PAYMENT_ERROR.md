# 🔍 Debug Payment Error - Step by Step

## What I Just Fixed

I've improved the error handling to give you **much better error messages**. Now when you test payment, you'll see exactly what's wrong.

---

## 🧪 **How to Debug (Do This Now)**

### **Step 1: Open Browser Console**

1. Go to your **frontend website**
2. Press **F12** (or right-click → Inspect)
3. Click **Console** tab
4. **Clear the console** (click the 🚫 icon)

### **Step 2: Try Payment**

1. Add item to cart
2. Go to checkout
3. Fill form
4. Click **"Pay Now"**

### **Step 3: Check Console Output**

You should see detailed logs like:

```
🔍 Payment Debug Info:
- VITE_API_URL (raw): https://your-backend.vercel.app
- Is Production: true
- Resolved API URL: https://your-backend.vercel.app
- Full Order URL: https://your-backend.vercel.app/api/create-order
```

**OR** if there's an error, you'll see:

```
❌ Configuration Error: VITE_API_URL is not set in production!
```

or

```
❌ Fetch Error Details: ...
- Error Type: TypeError
- Error Message: Failed to fetch
```

---

## 📋 **What to Look For**

### **Scenario 1: VITE_API_URL Not Set**

**Console shows:**
```
- VITE_API_URL (raw): undefined
- Is Production: true
```

**Error message:**
```
VITE_API_URL is not set in production! Please set VITE_API_URL environment variable...
```

**Fix:**
1. Go to Vercel → Frontend Project → Environment Variables
2. Add `VITE_API_URL` = your backend URL
3. Redeploy frontend

---

### **Scenario 2: Backend Not Reachable**

**Console shows:**
```
- Full Order URL: https://your-backend.vercel.app/api/create-order
❌ Fetch Error Details: Failed to fetch
```

**Error message:**
```
Cannot reach backend server. Tried to reach: https://...
Please check:
1. Backend is deployed and accessible at: ...
2. Test backend: Open .../api/health in browser
...
```

**Fix:**
1. Test backend URL directly: `https://your-backend-url.vercel.app/api/health`
2. If backend doesn't respond:
   - Check backend project on Vercel
   - Make sure backend is deployed
   - Check backend deployment logs
3. If backend works but frontend can't reach it:
   - Check `VITE_API_URL` is correct
   - Make sure no trailing slash
   - Redeploy frontend

---

### **Scenario 3: CORS Error**

**Console shows:**
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```

**Fix:**
- Backend already has CORS headers ✅
- Check backend is deployed correctly
- Make sure backend URL is correct

---

### **Scenario 4: Backend Returns Error**

**Console shows:**
```
- Full Order URL: https://.../api/create-order
API returned non-JSON response: <!DOCTYPE html>...
```

**Fix:**
- Backend endpoint might not be deployed correctly
- Check backend project structure
- Verify `/api/create-order.js` exists

---

## 🎯 **Quick Checklist**

Copy this and check each item:

- [ ] **Browser console is open** (F12)
- [ ] **Console is cleared**
- [ ] **Try payment**
- [ ] **Check debug logs** - What does `VITE_API_URL (raw)` show?
- [ ] **Check error message** - What's the exact error?
- [ ] **Test backend directly** - Does `https://your-backend/api/health` work?

---

## 📸 **What to Share**

If it's still not working, please share:

1. **Console output** - Copy the entire console log after trying payment
2. **Network tab** - Screenshot of the failed request (F12 → Network tab)
3. **Backend health check** - Does `https://your-backend/api/health` work?
4. **VITE_API_URL value** - What URL is set? (don't share secrets)

---

## ✅ **Expected Working Output**

When everything is configured correctly, you should see:

```
🔍 Payment Debug Info:
- VITE_API_URL (raw): https://your-backend.vercel.app
- Is Production: true
- Resolved API URL: https://your-backend.vercel.app
- Full Order URL: https://your-backend.vercel.app/api/create-order
```

And then the Razorpay popup should open! 🎉

---

## 🔧 **Common Issues**

### **Issue: Console shows VITE_API_URL as undefined**

**Cause:** Environment variable not set or not loaded

**Fix:**
1. Check Vercel → Frontend → Environment Variables
2. Make sure `VITE_API_URL` is set
3. Make sure it's set for **Production**
4. **Redeploy** frontend
5. Clear browser cache

### **Issue: Backend URL has double slashes**

**Example:** `https://backend.com//api/create-order`

**Fix:** Already handled - code removes trailing slashes ✅

### **Issue: Relative URL in production**

**Console shows:** `Full Order URL: /api/create-order`

**Cause:** `VITE_API_URL` not set, using relative URL

**Fix:** Set `VITE_API_URL` in Vercel and redeploy

---

## 🚀 **Next Steps**

1. **Test payment** with console open
2. **Copy the console output**
3. **Share it** if it's still not working
4. **Check backend health** endpoint works
5. **Verify VITE_API_URL** is set correctly

The improved error messages will tell you exactly what's wrong! 🎯

