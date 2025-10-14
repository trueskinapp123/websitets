# Razorpay Payment Gateway Setup Guide

## 🎯 **Complete Razorpay Integration**

This guide will help you set up Razorpay payment gateway for your TrueSkin e-commerce application.

---

## 📋 **Prerequisites**

- Razorpay account (Free to sign up)
- Test/Live API keys from Razorpay dashboard

---

## 🔑 **Step 1: Get Razorpay API Keys**

### **1.1 Create Razorpay Account**
1. Go to https://razorpay.com/
2. Click "Sign Up"
3. Complete registration

### **1.2 Get API Keys (Test Mode)**
1. Log in to Razorpay Dashboard
2. Go to Settings → API Keys
3. Click "Generate Test Key"
4. Copy your **Key ID** and **Key Secret**
5. You'll see something like:
   - **Key ID**: `rzp_test_xxxxxxxxxxxxx`
   - **Key Secret**: `xxxxxxxxxxxxxxxxxxxx`

### **1.3 Get API Keys (Live Mode)**
1. Complete KYC verification
2. Go to Settings → API Keys
3. Click "Generate Live Key"
4. Copy your **Key ID** and **Key Secret**

---

## ⚙️ **Step 2: Configure Environment Variables**

### **2.1 Local Development (.env)**

Create or update your `.env` file in the project root:

```bash
# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id_here
VITE_RAZORPAY_KEY_SECRET=your_key_secret_here
```

**Example:**
```bash
VITE_RAZORPAY_KEY_ID=rzp_test_1DP5mmOlF5G5ag
VITE_RAZORPAY_KEY_SECRET=WnwECUrjsIqMQShhdE4vqult
```

### **2.2 Production (Vercel)**

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add these variables:
   - **Name**: `VITE_RAZORPAY_KEY_ID`
   - **Value**: Your Razorpay Key ID
   - **Environment**: Production, Preview, Development

   - **Name**: `VITE_RAZORPAY_KEY_SECRET`
   - **Value**: Your Razorpay Key Secret
   - **Environment**: Production, Preview, Development

5. Click "Save"
6. Redeploy your application

---

## 🧪 **Step 3: Test the Integration**

### **3.1 Test Mode (Recommended for Testing)**

Use Razorpay test credentials:

**Test Card Details:**
- **Card Number**: `4111 1111 1111 1111`
- **Expiry Date**: Any future date (e.g., `12/25`)
- **CVV**: Any 3 digits (e.g., `123`)
- **Name**: Any name

**Test UPI ID:**
- `success@razorpay`

**Test Netbanking:**
- Select any bank
- Use any credentials

### **3.2 Test Payment Flow**

1. **Add items to cart**
2. **Go to checkout page**
3. **Fill in shipping details**
4. **Click "Pay Now" button**
5. **Razorpay payment window should open**
6. **Use test card details**
7. **Complete payment**
8. **You should be redirected to success page**

---

## 🎨 **How It Works**

### **Payment Flow:**

```
1. Customer clicks "Pay Now"
   ↓
2. Order created in database
   ↓
3. Razorpay order created
   ↓
4. Razorpay payment window opens
   ↓
5. Customer enters payment details
   ↓
6. Payment processed by Razorpay
   ↓
7. Payment success callback
   ↓
8. Order status updated to "paid"
   ↓
9. Email sent to admin (ceo@trueskin.app)
   ↓
10. Email sent to customer
   ↓
11. Cart cleared
   ↓
12. Redirect to success page
```

---

## 🔧 **Features Implemented**

### **✅ Automatic Amount Detection**
- Amount is automatically calculated from cart total
- No manual entry required
- Supports amounts from ₹1 to ₹1,00,000

### **✅ Razorpay Window**
- Opens automatically after clicking "Pay Now"
- Pre-filled customer information
- Custom branded theme (TrueSkin colors)
- Mobile-responsive design

### **✅ Payment Methods Supported**
- Credit/Debit Cards
- UPI
- Net Banking
- Wallets (Paytm, PhonePe, etc.)
- EMI (if enabled)

### **✅ Payment Verification**
- Automatic payment verification
- Signature validation
- Order status updates
- Transaction ID saved

### **✅ Error Handling**
- Payment failure handling
- User cancellation handling
- Network error handling
- Retry mechanism

---

## 📧 **Email Notifications**

After successful payment:
- ✅ Admin receives email at ceo@trueskin.app
- ✅ Customer receives confirmation email
- ✅ Includes transaction ID
- ✅ Includes complete order details

---

## 🔐 **Security Features**

- ✅ API keys stored in environment variables
- ✅ No hardcoded credentials
- ✅ Payment verification on backend
- ✅ SSL/TLS encryption
- ✅ PCI DSS compliant (via Razorpay)

---

## 🚨 **Troubleshooting**

### **Issue: "Pay Now" button not working**

**Solution:**
1. Check if Razorpay keys are set in `.env`
2. Check browser console for errors
3. Verify Razorpay script is loading
4. Check network tab for API calls

### **Issue: "Razorpay Key ID not found"**

**Solution:**
1. Add `VITE_RAZORPAY_KEY_ID` to `.env` file
2. Restart development server
3. Clear browser cache

### **Issue: Payment window not opening**

**Solution:**
1. Check browser console for errors
2. Verify Razorpay script is loaded
3. Check if amount is valid (₹1 - ₹1,00,000)
4. Try in incognito mode

### **Issue: Payment fails**

**Solution:**
1. Check if using test credentials in test mode
2. Verify card details are correct
3. Check if amount is within limits
4. Check Razorpay dashboard for error logs

---

## 📊 **Monitoring Payments**

### **Razorpay Dashboard:**
1. Go to https://dashboard.razorpay.com/
2. View all payments
3. Check payment status
4. Download reports
5. View analytics

### **Order Status:**
- **Pending**: Order created, payment not initiated
- **Paid**: Payment successful
- **Failed**: Payment failed
- **Cancelled**: Payment cancelled by user

---

## 🎯 **Testing Checklist**

- [ ] Razorpay account created
- [ ] API keys obtained
- [ ] Environment variables set
- [ ] Development server restarted
- [ ] Test payment successful
- [ ] Email notifications working
- [ ] Order created in database
- [ ] Cart cleared after payment
- [ ] Success page redirects correctly

---

## 🚀 **Production Deployment**

### **Before Going Live:**

1. **Complete Razorpay KYC**
   - Submit business documents
   - Complete verification

2. **Switch to Live Keys**
   - Generate live API keys
   - Update environment variables
   - Test with small amount

3. **Configure Webhooks** (Optional)
   - Set up payment webhooks
   - Handle payment status updates
   - Implement refund logic

4. **Enable Features**
   - Enable international payments (if needed)
   - Enable recurring payments (if needed)
   - Enable EMI options

---

## 💰 **Razorpay Pricing**

- **Setup Fee**: ₹0
- **Transaction Fee**: 2% + GST
- **International Cards**: 3% + GST
- **Refund Fee**: ₹0 (up to 1% of refund amount)

---

## 📞 **Support**

### **Razorpay Support:**
- Email: help@razorpay.com
- Phone: 1800-419-3333
- Documentation: https://razorpay.com/docs/

### **Common Issues:**
- Check Razorpay status page
- Review documentation
- Contact Razorpay support

---

## ✅ **Success Criteria**

Your Razorpay integration is working correctly if:
- ✅ Payment window opens on "Pay Now" click
- ✅ Amount is automatically populated
- ✅ Customer can complete payment
- ✅ Order is created in database
- ✅ Admin receives email notification
- ✅ Customer receives confirmation email
- ✅ Cart is cleared after payment
- ✅ Success page is displayed

---

## 🎉 **You're All Set!**

Your Razorpay payment gateway is now fully integrated and ready to accept payments!

**Test it now:**
1. Add items to cart
2. Go to checkout
3. Click "Pay Now"
4. Complete test payment
5. Verify emails received

**Happy selling!** 🚀
