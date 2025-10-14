# Order Email Notification Setup Guide

## 📧 **Complete Email Notification System**

This guide will help you set up automatic email notifications to the admin (ceo@trueskin.app) whenever a customer places an order.

---

## 🎯 **What's Included**

### **✅ Features Implemented:**
- ✅ Admin receives email with complete order details
- ✅ Customer receives order confirmation email
- ✅ Real-time email notifications after payment
- ✅ Beautiful HTML email templates
- ✅ Transaction ID included in admin email
- ✅ Product details, quantities, and prices
- ✅ Customer information (name, email, phone)
- ✅ Shipping address details
- ✅ Total amount and order summary

---

## 📋 **Setup Steps**

### **Step 1: Get Resend API Key**

1. **Sign up for Resend**
   - Go to https://resend.com/
   - Create a free account (100 emails/day free)

2. **Get API Key**
   - Go to API Keys section
   - Click "Create API Key"
   - Copy your API key

3. **Verify Domain (Optional but Recommended)**
   - Add your domain (trueskin.app)
   - Add DNS records as instructed
   - This allows you to send from orders@trueskin.app

### **Step 2: Update Environment Variables**

1. **Open your `.env` file**
   ```bash
   VITE_RESEND_API_KEY=re_your_actual_api_key_here
   ```

2. **Update `.env.local` for production**
   ```bash
   VITE_RESEND_API_KEY=re_your_actual_api_key_here
   ```

3. **Restart your development server**
   ```bash
   npm run dev
   ```

### **Step 3: Update Vercel Environment Variables**

1. **Go to Vercel Dashboard**
   - Select your project
   - Go to Settings → Environment Variables

2. **Add Environment Variable**
   - Name: `VITE_RESEND_API_KEY`
   - Value: Your Resend API key
   - Environment: Production, Preview, Development

3. **Redeploy your application**

---

## 📧 **Email Details**

### **Admin Email (ceo@trueskin.app):**
**Subject:** `🎉 New Order #ORDER_ID - ₹AMOUNT`

**Includes:**
- ✅ Order ID and Date
- ✅ Payment ID (Transaction ID)
- ✅ Razorpay Order ID
- ✅ Customer Name, Email, Phone
- ✅ Complete Shipping Address
- ✅ Product List with Quantities
- ✅ Individual Item Prices
- ✅ Total Amount
- ✅ Action Items for Admin

### **Customer Email:**
**Subject:** `Order Confirmation #ORDER_ID - TrueSkin`

**Includes:**
- ✅ Order Confirmation
- ✅ Order Details
- ✅ Product List
- ✅ Shipping Address
- ✅ Next Steps Information

---

## 🚀 **How It Works**

### **Order Flow:**
1. Customer fills checkout form
2. Customer makes payment via Razorpay
3. Payment is successful
4. Order is created in database
5. **Email sent to admin (ceo@trueskin.app)** ✉️
6. **Email sent to customer** ✉️
7. Cart is cleared
8. Customer redirected to success page

### **Email Trigger:**
- Emails are sent automatically after successful payment
- No manual intervention required
- Real-time notifications
- Works on both local and production

---

## 🧪 **Testing**

### **Test Order Email:**

1. **Place a test order:**
   - Go to your app
   - Add items to cart
   - Proceed to checkout
   - Use Razorpay test mode
   - Complete payment

2. **Check admin email:**
   - Go to ceo@trueskin.app inbox
   - You should receive email within seconds
   - Verify all details are correct

3. **Check customer email:**
   - Check the email used during checkout
   - Should receive confirmation email

### **Test Mode (Razorpay):**
- Use test card: 4111 1111 1111 1111
- Any future expiry date
- Any CVV
- Any name

---

## 🔧 **Troubleshooting**

### **Emails Not Sending:**

1. **Check Resend API Key:**
   ```bash
   # In browser console
   console.log(import.meta.env.VITE_RESEND_API_KEY)
   ```

2. **Check Resend Dashboard:**
   - Go to https://resend.com/emails
   - See if emails are being sent
   - Check for errors

3. **Check Browser Console:**
   - Look for email-related errors
   - Check network tab for API calls

4. **Verify Domain:**
   - Make sure domain is verified in Resend
   - Check DNS records

### **Common Issues:**

**Issue:** "Resend API key not configured"
**Solution:** Add `VITE_RESEND_API_KEY` to `.env` file

**Issue:** "Email not received"
**Solution:** 
- Check spam folder
- Verify email address is correct
- Check Resend dashboard for delivery status

**Issue:** "Rate limit exceeded"
**Solution:** Upgrade Resend plan or wait for rate limit reset

---

## 📊 **Email Template Preview**

### **Admin Email Includes:**
- 🎉 Eye-catching header with order number
- 📦 Complete order information
- 👤 Customer contact details
- 📍 Full shipping address
- 🛍️ Detailed product list with prices
- 💰 Total amount highlighted
- 📋 Action steps for admin
- ⚠️ Alert box for urgent action

### **Customer Email Includes:**
- ✨ Thank you message
- ✅ Payment confirmation
- 📦 Order details
- 🛍️ Product list
- 📍 Shipping address
- 📬 Delivery information
- 💬 Support contact

---

## 🎨 **Email Customization**

To customize email templates, edit:
```
src/lib/email.ts
```

You can modify:
- Colors and styling
- Email content
- Additional information
- Branding elements

---

## 🔐 **Security**

- ✅ API keys stored in environment variables
- ✅ No hardcoded credentials
- ✅ Secure email delivery via Resend
- ✅ GDPR compliant email service

---

## 📈 **Monitoring**

### **Track Email Delivery:**
1. Go to Resend Dashboard
2. View email logs
3. Check delivery status
4. Monitor bounce rates

### **Analytics:**
- Track email opens (if enabled)
- Monitor click rates
- View delivery reports

---

## ✅ **Verification Checklist**

- [ ] Resend account created
- [ ] API key obtained
- [ ] Environment variable set
- [ ] Domain verified (optional)
- [ ] Test order placed
- [ ] Admin email received
- [ ] Customer email received
- [ ] All details correct
- [ ] Production environment configured

---

## 🎉 **Success!**

Once set up, you'll receive an email at **ceo@trueskin.app** every time a customer places an order with:
- Complete order details
- Customer information
- Product list
- Transaction ID
- Shipping address

**No manual intervention required - fully automated!** 🚀

---

## 📞 **Support**

If you need help:
1. Check Resend documentation: https://resend.com/docs
2. Check browser console for errors
3. Verify environment variables
4. Test with a new order

**Your order notification system is now fully functional!** ✨
