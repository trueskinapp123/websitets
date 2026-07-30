# 🔧 Fix CORS & ERR_INVALID_REDIRECT Error

## The Problem

You're seeing:
- `CORS error`
- `ERR_INVALID_REDIRECT` on preflight requests

This happens when:
1. **Backend URL is redirecting** (HTTP → HTTPS, or trailing slash redirect)
2. **CORS preflight (OPTIONS)** request fails because redirects break CORS flow
3. **Backend URL might be wrong** or has issues

---

## ✅ **SOLUTION 1: Fix Backend URL**

### **Check Your Backend URL:**

1. Go to **Vercel Dashboard → Backend Project**
2. **Copy the EXACT Production URL**
3. Make sure it:
   - ✅ Starts with `https://` (NOT `http://`)
   - ✅ Has NO trailing slash
   - ✅ Is the correct domain

### **Update VITE_API_URL:**

1. Go to **Vercel → Frontend Project → Environment Variables**
2. Update `VITE_API_URL`:
   - **Wrong:** `http://backend.vercel.app` ❌
   - **Wrong:** `https://backend.vercel.app/` ❌ (trailing slash)
   - **Correct:** `https://backend.vercel.app` ✅

3. **Redeploy frontend**

---

## ✅ **SOLUTION 2: Test Backend Directly**

Test if your backend URL works:

### **Test 1: Health Endpoint**
Open in browser:
```
https://your-backend-url.vercel.app/api/health
```

**Expected:** JSON response
**If redirects:** URL might be wrong

### **Test 2: Check Redirects**

1. Open browser Developer Tools → Network tab
2. Go to `https://your-backend-url.vercel.app/api/health`
3. Check if there are any redirects (301, 302 status codes)

**If you see redirects:**
- Backend URL might be wrong
- HTTP → HTTPS redirect (use HTTPS in VITE_API_URL)
- Trailing slash redirect (remove trailing slash)

---

## ✅ **SOLUTION 3: Verify Backend Deployment**

### **Check Backend Project Structure:**

Your backend project on Vercel should have:

```
backend-project/
├── api/
│   ├── create-order.js
│   ├── verify-payment.js
│   └── health.js
└── package.json (with razorpay dependency)
```

### **Check Backend Has CORS:**

The backend API files should handle OPTIONS requests:

```javascript
// In create-order.js
if (req.method === 'OPTIONS') {
  res.status(200).end();
  return;
}
```

---

## 🔍 **Debug Steps**

### **Step 1: Check Console Logs**

Look for the debug output:
```
🔍 Payment Debug Info:
- Full Order URL: https://...
```

**Check:**
- Does the URL look correct?
- Does it start with `https://`?
- No trailing slash?
- Correct domain?

### **Step 2: Test Backend Manually**

```bash
# Test with curl
curl -X OPTIONS https://your-backend-url.vercel.app/api/create-order \
  -H "Origin: https://your-frontend-url.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

**Expected:** 
- Status 200
- CORS headers in response

**If fails:** Backend CORS not configured properly

### **Step 3: Check Network Tab**

1. Open Network tab (F12)
2. Try payment
3. Look at the failed request
4. Check:
   - **Request URL:** Is it correct?
   - **Status:** What status code?
   - **Response Headers:** Any CORS headers?
   - **Request Headers:** What's being sent?

---

## 🎯 **Most Likely Fix**

**99% of the time, it's one of these:**

1. **Backend URL is HTTP instead of HTTPS**
   - Fix: Use `https://` in `VITE_API_URL`

2. **Backend URL has trailing slash**
   - Fix: Remove trailing slash from `VITE_API_URL`

3. **Backend URL is wrong/redirects**
   - Fix: Get exact URL from Vercel backend project

4. **Frontend not redeployed**
   - Fix: Redeploy after updating `VITE_API_URL`

---

## 📋 **Quick Fix Checklist**

- [ ] Test backend directly: `https://your-backend/api/health`
- [ ] Check if backend URL redirects (use Network tab)
- [ ] Verify `VITE_API_URL` starts with `https://`
- [ ] Verify `VITE_API_URL` has NO trailing slash
- [ ] Verify `VITE_API_URL` is the exact backend URL from Vercel
- [ ] Redeploy frontend after updating `VITE_API_URL`
- [ ] Clear browser cache
- [ ] Test payment again

---

## 🚨 **If Still Not Working**

### **Check Backend CORS Configuration:**

Your backend API should return these headers for OPTIONS:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET,POST,OPTIONS
Access-Control-Allow-Headers: Content-Type
```

### **Test with Postman/curl:**

```bash
# Test OPTIONS (preflight)
curl -X OPTIONS https://your-backend/api/create-order \
  -H "Origin: https://your-frontend.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -v

# Test POST
curl -X POST https://your-backend/api/create-order \
  -H "Content-Type: application/json" \
  -H "Origin: https://your-frontend.vercel.app" \
  -d '{"amount": 100}' \
  -v
```

---

## 💡 **Common Backend URL Issues**

### **Issue 1: HTTP instead of HTTPS**
```
Wrong: http://backend.vercel.app
Right: https://backend.vercel.app
```

### **Issue 2: Trailing Slash**
```
Wrong: https://backend.vercel.app/
Right: https://backend.vercel.app
```

### **Issue 3: Wrong Domain**
```
Wrong: backend.vercel.app (missing https://)
Right: https://backend.vercel.app
```

### **Issue 4: Redirect Chain**
```
If backend redirects:
https://backend.vercel.app → https://www.backend.vercel.app

Use the final URL (after redirect)
```

---

## 🎉 **Expected Result**

After fixing:
- ✅ No CORS errors
- ✅ No redirect errors
- ✅ OPTIONS request succeeds (200)
- ✅ POST request succeeds
- ✅ Payment works!

---

## 📞 **Share This Info**

If still not working, share:
1. **Backend URL** you're using (just the domain, not secrets)
2. **Response from:** `https://your-backend/api/health`
3. **Network tab screenshot** showing the failed request
4. **Console logs** showing the full order URL

