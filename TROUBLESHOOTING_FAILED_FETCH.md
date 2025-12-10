# 🔧 Troubleshooting "Failed to fetch" Error

## The Problem
You're getting: **"Error: Payment Error - Failed to fetch"**

This means the frontend cannot reach your backend API.

---

## 🔍 **Step-by-Step Troubleshooting**

### **Step 1: Check Browser Console**

1. Open your website
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Try the payment again
5. Look for error messages - they'll tell you exactly what's wrong

**Common errors you might see:**
- `Failed to fetch` - Network error (CORS, wrong URL, or backend down)
- `404 Not Found` - Wrong URL path
- `CORS policy` - CORS issue
- `503 Service Unavailable` - Backend not deployed or env vars missing

---

### **Step 2: Check Network Tab**

1. In Developer Tools, go to **Network** tab
2. Try payment again
3. Look for the API call to `/api/create-order`
4. Check:
   - **URL**: Is it pointing to the correct backend?
   - **Status**: 200 (success), 404 (not found), 503 (error), or CORS error?
   - **Response**: What does the response say?

---

### **Step 3: Verify Environment Variables**

#### **Check Frontend Vercel Environment Variables:**

Go to: **Vercel Dashboard → Frontend Project → Settings → Environment Variables**

Make sure these are set:

| Variable | Example Value | Status |
|----------|--------------|--------|
| `VITE_API_URL` | `https://your-backend.vercel.app` | ⚠️ **MUST BE SET** |
| `VITE_RAZORPAY_KEY_ID` | `rzp_live_RUxNePnU13x2DI` | ✅ Required |

**Important:**
- ✅ `VITE_API_URL` must **NOT** have trailing slash (e.g., `https://api.example.com` not `https://api.example.com/`)
- ✅ Must be set for **Production** environment
- ✅ Redeploy after adding/changing

#### **Test if VITE_API_URL is loaded:**

Add this temporarily to your component to debug:
```javascript
console.log('API URL:', import.meta.env.VITE_API_URL);
console.log('Is Prod:', import.meta.env.PROD);
```

---

### **Step 4: Test Backend Directly**

Test your backend in a new browser tab:

```
GET https://your-backend-url.vercel.app/api/health
```

**Expected response:**
```json
{
  "status": "OK",
  "message": "TrueSkin Backend API is running",
  "services": {
    "razorpay": true
  }
}
```

**If this doesn't work:**
- Backend might not be deployed
- Backend URL might be wrong
- Check backend project on Vercel

---

### **Step 5: Check CORS**

Your backend already has CORS headers ✅, but if you're still getting CORS errors:

**Symptoms:**
- Error: `Access to fetch at '...' from origin '...' has been blocked by CORS policy`
- Error in Network tab shows CORS error

**Solution:**
- Backend already has CORS enabled ✅
- Make sure backend is deployed correctly
- Check that backend URL in `VITE_API_URL` is correct

---

## 🚨 **Common Issues & Fixes**

### **Issue 1: VITE_API_URL Not Set**

**Symptom:**
- Frontend tries to use relative URL or localhost
- Console shows: `http://localhost:3001/api/create-order` (in production)

**Fix:**
1. Go to Vercel → Frontend Project → Environment Variables
2. Add `VITE_API_URL` with your backend URL
3. Redeploy frontend

---

### **Issue 2: Wrong Backend URL**

**Symptom:**
- Network tab shows 404 or connection error
- URL doesn't match your backend

**Fix:**
1. Get exact backend URL from Vercel Dashboard
2. Copy it exactly (without trailing slash)
3. Update `VITE_API_URL` in frontend env vars
4. Redeploy

---

### **Issue 3: Backend Not Deployed**

**Symptom:**
- Backend health check fails
- 503 or connection refused errors

**Fix:**
1. Check backend project on Vercel
2. Make sure it's deployed
3. Check deployment logs for errors
4. Redeploy backend if needed

---

### **Issue 4: Environment Variables Not Applied**

**Symptom:**
- Env vars set but still not working
- Old values in console

**Fix:**
1. Make sure env vars are set for **Production** environment
2. **Redeploy** after adding/changing env vars (important!)
3. Clear browser cache
4. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

---

## ✅ **Quick Fix Checklist**

- [ ] Check browser console for exact error message
- [ ] Check Network tab to see what URL is being called
- [ ] Verify `VITE_API_URL` is set in Vercel frontend project
- [ ] Test backend directly: `https://your-backend.vercel.app/api/health`
- [ ] Redeploy frontend after setting env vars
- [ ] Clear browser cache and hard refresh
- [ ] Check that both projects are deployed on Vercel

---

## 🧪 **Manual Test**

You can test the backend API directly using curl or Postman:

```bash
# Test health endpoint
curl https://your-backend-url.vercel.app/api/health

# Test create order (should return error without proper data, but shows if endpoint exists)
curl -X POST https://your-backend-url.vercel.app/api/create-order \
  -H "Content-Type: application/json" \
  -d '{"amount": 100}'
```

---

## 💡 **Debug Steps**

1. **Add console logs** to see what URL is being used:
   ```javascript
   console.log('Calling API:', `${apiUrl}/api/create-order`);
   ```

2. **Check if fetch is even being called:**
   - Add a console.log before the fetch
   - See if it reaches the fetch call

3. **Test with Postman/curl:**
   - If Postman works but browser doesn't = CORS issue
   - If neither works = Backend issue

---

## 🎯 **Most Likely Causes (in order)**

1. **VITE_API_URL not set** (most common)
2. **Wrong backend URL** in VITE_API_URL
3. **Frontend not redeployed** after setting env vars
4. **Backend not deployed** or not accessible
5. **CORS issue** (less likely - backend has CORS enabled)

---

## 📞 **Need More Help?**

Please share:
1. Exact error from browser console
2. Network tab screenshot (showing the failed request)
3. Your `VITE_API_URL` value (without revealing secrets)
4. Result of backend health check

This will help pinpoint the exact issue!

