# 🔐 Admin Panel Setup Guide

## ✅ **What's Been Implemented**

### **1. Order Storage After Payment**
- ✅ Orders are now stored in Supabase after successful payment
- ✅ Works with or without user authentication (guest orders supported)
- ✅ All customer details from checkout form are saved
- ✅ Order items are properly stored in `order_items` table

### **2. Admin Panel with Simple Authentication**
- ✅ Admin login page at `/admin/login`
- ✅ Simple authentication (not using Supabase or Google auth)
- ✅ Credentials:
  - **Email:** `ceo@trueskin.app`
  - **Password:** `123456789`
- ✅ Session stored in localStorage

### **3. Admin Dashboard**
- ✅ View all orders and customer details
- ✅ Search and filter orders
- ✅ View order statistics (total orders, revenue, etc.)
- ✅ Expandable order details with:
  - Customer information (name, email, phone)
  - Shipping address
  - Order items
  - Payment information
- ✅ Order status badges

### **4. Customer Email Confirmation**
- ✅ Order confirmation emails sent to customers via Resend API
- ✅ Professional email template with order details
- ✅ Sent automatically after successful payment

---

## 🚀 **Setup Instructions**

### **Step 1: Update Database Schema**

Run the SQL script to enable guest orders:

```sql
-- File: enable-guest-orders.sql
-- This makes user_id nullable in orders table to support guest orders
```

**Execute in Supabase SQL Editor:**
1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the contents of `enable-guest-orders.sql`
3. Run the script

### **Step 2: Configure Environment Variables**

Make sure these are set in your `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_RESEND_API_KEY=your_resend_api_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### **Step 3: Access Admin Panel**

1. **Login:** Go to `http://localhost:5173/admin/login`
2. **Credentials:**
   - Email: `ceo@trueskin.app`
   - Password: `123456789`
3. **Dashboard:** After login, you'll be redirected to `/admin/dashboard`

---

## 📋 **Features**

### **Admin Dashboard Features:**

#### **Statistics Cards:**
- Total Orders
- Total Revenue (from paid orders)
- Paid Orders Count
- Pending Orders Count

#### **Order Management:**
- View all orders in a list
- Search orders by:
  - Customer name
  - Email
  - Phone number
  - Order ID
- Filter by status:
  - All
  - Pending
  - Paid
  - Processing
  - Shipped
  - Delivered
  - Failed
  - Cancelled

#### **Order Details:**
Each order shows:
- Order ID
- Status badge
- Total amount
- Order date
- Customer information:
  - Name
  - Email (clickable mailto link)
  - Phone (clickable tel link)
- Shipping address
- Order items (product ID, quantity, price)
- Payment information (Payment ID, Razorpay Order ID)

---

## 🔧 **How It Works**

### **Order Storage Flow:**

1. **Customer completes checkout form**
2. **Payment processed via Razorpay**
3. **On successful payment:**
   - Order created in `orders` table
   - Order items created in `order_items` table
   - Order status set to "paid"
   - Payment ID stored
4. **Email notifications sent:**
   - Admin notification email
   - Customer confirmation email

### **Guest Orders:**

- Orders can be created without user authentication
- Guest orders have `user_id = NULL` in database
- All customer details are still stored
- Admin can view all orders (including guest orders)

### **Admin Authentication:**

- Simple email/password check (hardcoded in code)
- Session stored in localStorage
- No database queries for authentication
- Logout clears session

---

## 📧 **Email Configuration**

### **Customer Confirmation Email:**

- **From:** `TrueSkin Orders <orders@trueskin.app>`
- **To:** Customer email from checkout form
- **Subject:** `Order Confirmation #[ORDER_ID] - TrueSkin`
- **Content:**
  - Order confirmation message
  - Order details (ID, date, amount)
  - Order items table
  - Shipping address
  - Next steps information

### **Admin Notification Email:**

- **From:** `TrueSkin Orders <orders@trueskin.app>`
- **To:** `ceo@trueskin.app`
- **Subject:** `🎉 New Order #[ORDER_ID] - ₹[AMOUNT]`
- **Content:**
  - New order alert
  - Complete order details
  - Customer information
  - Shipping address
  - Order items
  - Payment information
  - Action steps

---

## 🛡️ **Security Notes**

### **Admin Authentication:**
- ⚠️ **Simple authentication is used (hardcoded credentials)**
- ⚠️ **Not suitable for production without additional security**
- ✅ **For production, consider:**
  - Using Supabase Auth for admin users
  - Implementing JWT tokens
  - Adding rate limiting
  - Using environment variables for credentials
  - Adding 2FA

### **Database Security:**
- ✅ RLS policies should be configured
- ✅ Admin dashboard uses service role key (if needed)
- ✅ Guest orders are properly handled

---

## 🧪 **Testing**

### **Test Order Creation:**
1. Go to checkout page
2. Fill in customer details
3. Complete payment
4. Check Supabase `orders` table for new order
5. Verify customer email received

### **Test Admin Panel:**
1. Go to `/admin/login`
2. Login with credentials
3. View all orders
4. Search and filter orders
5. Expand order details
6. Verify all information is displayed correctly

---

## 📝 **Files Created/Modified**

### **New Files:**
- `src/pages/AdminLogin.tsx` - Admin login page
- `src/pages/AdminDashboard.tsx` - Admin dashboard
- `enable-guest-orders.sql` - Database migration script
- `ADMIN_PANEL_SETUP.md` - This documentation

### **Modified Files:**
- `src/components/RazorpayPayment.tsx` - Updated to store orders
- `src/services/orderService.ts` - Updated to support guest orders
- `src/App.tsx` - Added admin routes
- `src/lib/email.ts` - Already has customer email function

---

## 🎯 **Next Steps (Optional Enhancements)**

1. **Add order status update functionality** in admin dashboard
2. **Add export orders to CSV/Excel**
3. **Add order analytics and charts**
4. **Add customer management section**
5. **Add product management section**
6. **Implement proper admin authentication** (Supabase Auth)
7. **Add order notes/comments**
8. **Add order tracking numbers**

---

## 🚨 **Troubleshooting**

### **Issue: Orders not saving**
- Check database schema (user_id should be nullable)
- Check Supabase connection
- Check browser console for errors

### **Issue: Admin login not working**
- Check credentials: `ceo@trueskin.app` / `123456789`
- Clear localStorage and try again
- Check browser console for errors

### **Issue: Emails not sending**
- Verify Resend API key is set
- Check Resend dashboard for email logs
- Verify email addresses are valid

### **Issue: Admin dashboard not loading orders**
- Check Supabase connection
- Verify RLS policies allow reading orders
- Check browser console for errors

---

**🎉 Your admin panel is now ready to use!** 🚀
