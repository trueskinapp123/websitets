# CORS Fix - Backend Deployment Guide

## 🔧 Problem
The frontend at `https://trueskinapp.vercel.app` is getting CORS errors when trying to access the backend at `https://trueskin.app/api/create-order`.

## ✅ Solution Applied
Updated the backend CORS configuration to:
1. Explicitly allow requests from `https://trueskinapp.vercel.app`
2. Handle preflight OPTIONS requests properly
3. Include all necessary CORS headers

## 🚀 Deployment Steps

### 1. Update Backend Code
The backend `server.js` has been updated with the new CORS configuration. Make sure you have the latest version.

### 2. Deploy Backend to Production
Deploy your backend to `https://trueskin.app` with the updated code.

**If using Railway/Render/Heroku:**
```bash
# Commit and push changes
git add backend/server.js
git commit -m "Fix CORS configuration for production"
git push origin main

# The platform should auto-deploy
```

### 3. Verify Backend is Running
Test the backend health endpoint:
```bash
curl https://trueskin.app/health
```

Expected response:
```json
{"status":"OK","message":"TrueSkin Backend is running"}
```

### 4. Test CORS from Frontend
After deployment, test from the browser console on `https://trueskinapp.vercel.app`:
```javascript
fetch('https://trueskin.app/api/create-order', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    amount: 100,
    currency: 'INR',
    receipt: 'test_receipt'
  })
})
.then(res => res.json())
.then(data => console.log('Success:', data))
.catch(err => console.error('Error:', err));
```

### 5. Check Backend Logs
The backend now logs all incoming requests. Check your backend logs to see:
- Incoming request origins
- Any CORS blocking messages
- Request paths and methods

## 🔍 Troubleshooting

### If CORS errors persist:

1. **Check Backend Logs:**
   - Look for "⚠️ CORS: Blocked origin" messages
   - Verify the origin matches exactly (including https://)

2. **Verify Backend is Accessible:**
   ```bash
   curl -I https://trueskin.app/health
   ```
   Should return 200 OK

3. **Check Preflight Request:**
   ```bash
   curl -X OPTIONS https://trueskin.app/api/create-order \
     -H "Origin: https://trueskinapp.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -v
   ```
   Should include `Access-Control-Allow-Origin` header

4. **Verify Environment Variables:**
   - Make sure `NODE_ENV` is set correctly on the backend
   - Check that the backend is actually running the updated code

## 📋 Allowed Origins
The backend currently allows requests from:
- `https://trueskinapp.vercel.app` (Production frontend)
- `https://trueskin.app` (Production backend/domain)
- `http://localhost:5173` (Development)
- `http://localhost:5174` (Development)
- `http://localhost:3000` (Development)

## 🔒 Security Note
Currently, the CORS configuration allows all origins if they're not in the list (for debugging). For production, you should change line 39 in `backend/server.js` to:
```javascript
callback(new Error('Not allowed by CORS'));
```
This will block unauthorized origins.

## ✅ Success Indicators
After deployment, you should see:
1. ✅ No CORS errors in browser console
2. ✅ API requests succeed from frontend
3. ✅ Backend logs show incoming requests with correct origins
4. ✅ Payment flow works end-to-end

