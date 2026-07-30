# ⚡ IMMEDIATE FIX: CORS & Redirect Error

## 🚨 **Your Error:**
- `ERR_INVALID_REDIRECT` on preflight
- CORS error

**This means your backend URL is wrong or redirecting!**

---

## ✅ **FIX NOW (2 Steps)**

### **Step 1: Get Your Correct Backend URL**

1. Go to **Vercel Dashboard**
2. Click on your **Backend Project**
3. Click on the **latest deployment**
4. Copy the **Production URL** (looks like: `https://backend-name-xxxxx.vercel.app`)
5. **Test it in browser:** `https://your-backend-url/api/health`
   - Should return JSON (not redirect)

### **Step 2: Update VITE_API_URL**

1. Go to **Vercel → Frontend Project**
2. **Settings → Environment Variables**
3. Find `VITE_API_URL` or create it
4. **Set value to:**
   ```
   https://your-exact-backend-url.vercel.app
   ```
   
   **CRITICAL:**
   - ✅ Must start with `https://`
   - ✅ NO trailing slash (`/`)
   - ✅ Use the EXACT URL from Step 1
   
5. **Save**
6. **Redeploy frontend** (Deployments → ... → Redeploy)

---

## 🔍 **How to Verify Backend URL is Correct**

### **Test 1: Browser Test**
Open this in your browser:
```
https://your-backend-url/api/health
```

**✅ Should show:** JSON like `{"status":"OK",...}`
**❌ If redirects:** URL is wrong

### **Test 2: Check for Redirects**

1. Open browser **Developer Tools → Network tab**
2. Go to: `https://your-backend-url/api/health`
3. Look at the request:
   - **If Status = 200:** ✅ Good!
   - **If Status = 301/302:** ❌ URL redirects (wrong URL)
   - **If Status = 404:** ❌ Backend not deployed correctly

---

## 🎯 **Common Backend URL Mistakes**

### ❌ **Wrong Examples:**
```
http://backend.vercel.app          ← HTTP instead of HTTPS
https://backend.vercel.app/        ← Trailing slash
backend.vercel.app                 ← Missing https://
https://backend.vercel.app/api/    ← Should not include /api
```

### ✅ **Correct:**
```
https://backend-name-xxxxx.vercel.app
```

---

## 🚨 **If Still Not Working**

### **Check 1: Backend Deployment**

Is your backend actually deployed?

1. Go to **Vercel → Backend Project**
2. Check **Deployments** tab
3. Make sure there's a successful deployment
4. Click on it to get the URL

### **Check 2: Backend Has API Files**

Your backend project should have `/api` folder with:
- `create-order.js`
- `verify-payment.js`
- `health.js`

### **Check 3: Test Backend Endpoint**

Try this in browser:
```
https://your-backend-url/api/health
```

**If it doesn't work:**
- Backend might not be deployed
- Backend URL might be wrong
- Backend project structure might be wrong

---

## 📋 **Quick Checklist**

- [ ] Got backend URL from Vercel Dashboard
- [ ] Tested backend URL: `https://backend-url/api/health` works
- [ ] Set `VITE_API_URL` = `https://backend-url` (NO trailing slash)
- [ ] Redeployed frontend
- [ ] Cleared browser cache
- [ ] Tested payment again

---

## 💡 **After Fix**

Once `VITE_API_URL` is correct:
- ✅ No redirect errors
- ✅ No CORS errors
- ✅ Preflight (OPTIONS) succeeds
- ✅ Payment works!

---

**The fix is literally just setting the correct backend URL in `VITE_API_URL`!** 🎯

