# Razorpay Payment Gateway - Troubleshooting Guide

## 🚨 **"Processing Payment..." Stuck - Quick Fix**

If the payment button shows "Processing Payment..." but nothing happens, follow these steps:

---

## 🔧 **Step 1: Check Browser Console**

1. **Open Developer Tools** (Press F12)
2. **Go to Console tab**
3. **Look for errors**

### **Common Errors:**

**Error 1: "Razorpay Key ID not found"**
```
Solution: Add VITE_RAZORPAY_KEY_ID to .env file
```

**Error 2: "Failed to load Razorpay script"**
```
Solution: Check internet connection or firewall blocking Razorpay CDN
```

**Error 3: "Invalid amount"**
```
Solution: Amount must be in paise (multiply by 100)
```

---

## 🛠️ **Step 2: Verify Environment Variables**

### **Check if .env file exists:**
```bash
# In project root
cat .env
```

### **Should contain:**
```bash
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_here
VITE_RAZORPAY_KEY_SECRET=your_secret_here
```

### **If missing:**
1. Create `.env` file in project root
2. Add the variables above
3. **Restart development server**
4. Clear browser cache

---

## 🔍 **Step 3: Check Razorpay Script Loading**

### **In Browser Console, type:**
```javascript
window.Razorpay
```

### **Expected Result:**
```
function Razorpay(options) { ... }
```

### **If undefined:**
- Razorpay script failed to load
- Check internet connection
- Try refreshing the page

---

## 🧪 **Step 4: Test Payment Flow**

### **Complete Test:**

1. **Add items to cart**
2. **Go to checkout page**
3. **Fill in all details**
4. **Click "Pay Now"**
5. **Check browser console for logs:**
   - "Starting payment process..."
   - "Razorpay order created..."
   - "Database order created..."
   - "Opening Razorpay checkout..."

6. **Razorpay window should open**

### **If window doesn't open:**

**Check 1: Amount is valid**
```javascript
// In console, check:
console.log(import.meta.env.VITE_RAZORPAY_KEY_ID)
```

**Check 2: Razorpay key is set**
```javascript
// Should show your key ID
```

**Check 3: Amount is correct**
```javascript
// Should be in paise (e.g., 30400 for ₹304)
```

---

## 🚨 **Common Issues & Solutions**

### **Issue 1: "Processing Payment..." Never Ends**

**Cause:** Razorpay window failed to open

**Solution:**
1. Check browser console for errors
2. Verify Razorpay Key ID is set
3. Check if Razorpay script loaded
4. Try in incognito mode
5. Clear browser cache

### **Issue 2: "Invalid Key ID"**

**Cause:** Wrong or missing Razorpay Key ID

**Solution:**
1. Go to Razorpay Dashboard
2. Copy correct Key ID
3. Update `.env` file
4. Restart server

### **Issue 3: "Amount must be greater than 0"**

**Cause:** Amount is 0 or invalid

**Solution:**
1. Check cart has items
2. Verify cart total is calculated
3. Ensure amount > ₹1

### **Issue 4: Razorpay window opens but payment fails**

**Cause:** Test credentials incorrect

**Solution:**
- Use test card: `4111 1111 1111 1111`
- Any future expiry date
- Any CVV

---

## 📋 **Quick Diagnostic Checklist**

Run through this checklist:

- [ ] `.env` file exists in project root
- [ ] `VITE_RAZORPAY_KEY_ID` is set
- [ ] `VITE_RAZORPAY_KEY_SECRET` is set
- [ ] Development server restarted after adding keys
- [ ] Browser cache cleared
- [ ] Razorpay script loads (check console)
- [ ] Amount is valid (> 0)
- [ ] Cart has items
- [ ] User is logged in
- [ ] All checkout fields filled

---

## 🔧 **Manual Test**

### **Test Razorpay Integration:**

1. **Open browser console (F12)**

2. **Run this code:**
```javascript
// Load Razorpay script
const script = document.createElement('script');
script.src = 'https://checkout.razorpay.com/v1/checkout.js';
script.onload = () => {
  console.log('Razorpay loaded!');
  
  // Test Razorpay initialization
  const options = {
    key: 'YOUR_KEY_ID_HERE',
    amount: 30400, // ₹304 in paise
    currency: 'INR',
    name: 'TrueSkin',
    description: 'Test Payment',
    handler: function(response) {
      console.log('Payment successful!', response);
    },
    prefill: {
      name: 'Test User',
      email: 'test@example.com',
      contact: '9999999999'
    }
  };
  
  const rzp = new Razorpay(options);
  rzp.open();
};
document.body.appendChild(script);
```

3. **If this works, the issue is in the app code**
4. **If this doesn't work, the issue is with Razorpay keys**

---

## 🎯 **Most Common Fix**

**90% of "stuck in loading" issues are caused by:**

1. **Missing environment variables**
   - Add keys to `.env`
   - Restart server

2. **Browser cache**
   - Clear cache
   - Hard refresh (Ctrl+Shift+R)

3. **Razorpay script not loading**
   - Check internet connection
   - Try different browser

---

## 📞 **Still Not Working?**

### **Check These:**

1. **Razorpay Dashboard:**
   - Log in to https://dashboard.razorpay.com/
   - Verify account is active
   - Check for any account issues

2. **Network Tab:**
   - Open Developer Tools → Network tab
   - Look for failed requests to Razorpay
   - Check for 403/404 errors

3. **Console Errors:**
   - Copy all console errors
   - Share with support

---

## ✅ **Expected Behavior**

When everything works correctly:

1. Click "Pay Now"
2. Button shows "Processing Payment..."
3. **Razorpay window opens immediately** (within 1-2 seconds)
4. Enter payment details
5. Click "Pay"
6. Payment processes
7. Redirect to success page

**If step 3 doesn't happen, there's an issue!**

---

## 🔄 **Quick Reset**

If nothing works, try this complete reset:

1. **Stop development server** (Ctrl+C)
2. **Delete `.env` file**
3. **Create new `.env` file** with correct keys
4. **Clear browser cache**
5. **Restart development server**
6. **Try payment again**

---

## 🎉 **Success Indicators**

You'll know it's working when:
- ✅ Razorpay window opens within 2 seconds
- ✅ Payment form appears
- ✅ Can enter card details
- ✅ Payment processes successfully
- ✅ Redirects to success page
- ✅ Emails received

---

**Follow these steps and the payment should work!** 🚀
