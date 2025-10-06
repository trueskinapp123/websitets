# Checkout System Setup Guide

This guide will help you set up the complete checkout system with Razorpay payment integration and email notifications.

## 🚀 Features Implemented

✅ **Complete Checkout Form** - Customer details collection with validation  
✅ **Razorpay Payment Integration** - Secure payment processing  
✅ **Supabase Order Management** - Order storage and status tracking  
✅ **Email Notifications** - Admin notifications via Resend  
✅ **Order Success Page** - Confirmation and next steps  
✅ **Responsive Design** - Mobile and desktop optimized  

## 📋 Prerequisites

1. **Supabase Project** - Already configured
2. **Razorpay Account** - For payment processing
3. **Resend Account** - For email notifications

## 🔧 Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Supabase Configuration (Already configured)
VITE_SUPABASE_URL=https://iqkyzoybguicxuxiksmd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlxa3l6b3liZ3VpY3h1eGlrc21kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMjI1MzYsImV4cCI6MjA3Mzc5ODUzNn0.vVVVoV5yvVvbDGAcw8Yqn5UeDg-qovOdL5MXDCFv7JU

# Razorpay Configuration (Get from Razorpay Dashboard)
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id_here
VITE_RAZORPAY_KEY_SECRET=your_razorpay_secret_key_here

# Email Configuration (Get from Resend Dashboard)
VITE_RESEND_API_KEY=your_resend_api_key_here
VITE_ADMIN_EMAIL=admin@trueskin.com
```

## 🏦 Razorpay Setup

1. **Create Razorpay Account**
   - Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
   - Sign up or log in
   - Complete KYC verification

2. **Get API Keys**
   - Go to Settings → API Keys
   - Copy your Test Key ID and Test Key Secret
   - Add them to your `.env` file

3. **Configure Webhook (Optional)**
   - Go to Settings → Webhooks
   - Add webhook URL: `https://yourdomain.com/api/razorpay-webhook`
   - Select events: `payment.captured`, `payment.failed`

## 📧 Resend Email Setup

1. **Create Resend Account**
   - Go to [Resend Dashboard](https://resend.com/)
   - Sign up for a free account

2. **Get API Key**
   - Go to API Keys section
   - Create a new API key
   - Copy the key and add to `.env` file

3. **Verify Domain (Optional)**
   - Add your domain for better deliverability
   - Update sender email in the code

## 🗄️ Database Schema Updates

The checkout system requires additional columns in your existing tables. Run this SQL in your Supabase SQL editor:

```sql
-- Add new columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS customer_name TEXT,
ADD COLUMN IF NOT EXISTS customer_email TEXT,
ADD COLUMN IF NOT EXISTS customer_phone TEXT,
ADD COLUMN IF NOT EXISTS payment_id TEXT,
ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT;

-- Update the status enum to include new statuses
ALTER TABLE orders 
ALTER COLUMN status TYPE TEXT;

-- Add check constraint for status
ALTER TABLE orders 
ADD CONSTRAINT check_status 
CHECK (status IN ('pending', 'paid', 'failed', 'processing', 'shipped', 'delivered', 'cancelled'));
```

## 🎯 How to Use

### 1. **Add Items to Cart**
- Browse products on the Shop page
- Click "Add to Cart" on any product
- Items are added with quantity controls

### 2. **Proceed to Checkout**
- Click the cart icon in the navbar
- Click "Proceed to Checkout" button
- Fill in customer details and shipping address

### 3. **Complete Payment**
- Click "Pay Now" button
- Razorpay payment popup opens
- Complete payment using test cards
- Order is automatically created in Supabase

### 4. **Order Confirmation**
- Success page shows order details
- Admin receives email notification
- Cart is automatically cleared

## 🧪 Testing

### Test Payment Cards (Razorpay Test Mode)

**Success Cards:**
- Card: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date
- Name: Any name

**Failure Cards:**
- Card: `4000 0000 0000 0002`
- CVV: Any 3 digits
- Expiry: Any future date

### Test Scenarios

1. **Successful Payment**
   - Use success test card
   - Verify order creation in Supabase
   - Check admin email notification

2. **Failed Payment**
   - Use failure test card
   - Verify order status is "failed"
   - No email notification sent

3. **Form Validation**
   - Try submitting empty form
   - Test invalid email format
   - Test invalid phone number

## 🔒 Security Features

- **Form Validation** - Client and server-side validation
- **Payment Verification** - Razorpay signature verification
- **Secure Storage** - Sensitive data stored in Supabase
- **RLS Policies** - Row-level security for data access
- **Environment Variables** - API keys stored securely

## 📱 Mobile Responsiveness

The checkout form is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🚨 Troubleshooting

### Common Issues

1. **Razorpay Not Loading**
   - Check if Razorpay script is loaded
   - Verify API keys are correct
   - Check browser console for errors

2. **Email Not Sending**
   - Verify Resend API key
   - Check email address format
   - Check Resend dashboard for logs

3. **Order Not Creating**
   - Check Supabase connection
   - Verify table schema
   - Check RLS policies

### Debug Steps

1. **Check Browser Console**
   - Look for JavaScript errors
   - Check network requests

2. **Check Supabase Logs**
   - Go to Supabase Dashboard → Logs
   - Look for database errors

3. **Check Razorpay Logs**
   - Go to Razorpay Dashboard → Logs
   - Look for payment errors

## 📞 Support

If you encounter any issues:

1. Check this guide first
2. Review the error logs
3. Test with different browsers
4. Verify all environment variables

## 🎉 Success!

Once everything is set up, you'll have a complete e-commerce checkout system with:

- ✅ Secure payment processing
- ✅ Order management
- ✅ Email notifications
- ✅ Mobile responsiveness
- ✅ Professional UI/UX

Your customers can now complete purchases seamlessly!
