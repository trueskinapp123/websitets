# 🔍 Backend URL Testing Guide

## ✅ **This is NOT an error!**

When you access just the root URL of a Vercel serverless function deployment (e.g., `https://your-backend.vercel.app`), you'll get "Not Found" **by default**.

However, I've now added a root endpoint so you can test it!

---

## 🧪 **How to Test Your Backend**

### **1. Test Root URL (Now Available!)**
```
GET https://your-backend-url.vercel.app/api
```

You should see:
```json
{
  "status": "OK",
  "message": "TrueSkin Backend API is running",
  "timestamp": "2024-...",
  "endpoints": {
    "health": "/api/health",
    "createOrder": "/api/create-order (POST)",
    "verifyPayment": "/api/verify-payment (POST)",
    "adminOrders": "/api/admin/orders (GET)",
    "adminUsers": "/api/admin/users (GET)"
  },
  "services": {
    "razorpay": true,
    "supabase": true
  }
}
```

### **2. Test Health Endpoint**
```
GET https://your-backend-url.vercel.app/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "TrueSkin Backend API is running",
  "timestamp": "2024-...",
  "services": {
    "razorpay": true,
    "supabase": true
  }
}
```

### **3. Test Create Order Endpoint**
```
POST https://your-backend-url.vercel.app/api/create-order
Content-Type: application/json

{
  "amount": 100,
  "currency": "INR",
  "receipt": "test_receipt_123"
}
```

---

## 🔧 **Important Notes**

### **For Separate Backend Deployment:**

If you deployed the backend as a **separate Vercel project**, make sure:

1. ✅ The `/api` folder is in the root of that project
2. ✅ You have `vercel.json` configured (or let Vercel auto-detect)
3. ✅ Environment variables are set in that project

### **For Single Deployment (Recommended):**

If your frontend includes the `/api` folder:
- ✅ Backend endpoints are at: `https://your-frontend-url.vercel.app/api/health`
- ✅ No separate backend URL needed
- ✅ Use relative URLs in frontend (already configured)

---

## 📋 **Quick Checklist**

- [ ] Try accessing: `https://your-backend-url.vercel.app/api` (should work now!)
- [ ] Try: `https://your-backend-url.vercel.app/api/health` 
- [ ] Check that `services.razorpay` shows `true` (means env vars are set)
- [ ] If `razorpay: false`, add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to Vercel env vars

---

## 🚨 **If Still Getting "Not Found":**

### **Check 1: Is the `/api` folder deployed?**
- Go to your Vercel project → Deployments
- Check the build logs
- Make sure `/api` folder files are included

### **Check 2: Is it a separate backend project?**
If yes, make sure your backend project structure is:
```
your-backend-project/
├── api/
│   ├── index.js          (NEW - I just created this!)
│   ├── health.js
│   ├── create-order.js
│   ├── verify-payment.js
│   └── admin/
│       ├── orders.js
│       └── users.js
├── package.json          (with razorpay dependency)
└── vercel.json           (optional, auto-detected)
```

### **Check 3: Redeploy**
After adding the new `api/index.js` file:
- Commit and push to your repo
- OR manually redeploy on Vercel

---

## 💡 **Pro Tip:**

Instead of accessing the root URL, always test specific endpoints:
- Health: `/api/health`
- Create Order: `/api/create-order`
- Verify Payment: `/api/verify-payment`

These are the actual working endpoints!

