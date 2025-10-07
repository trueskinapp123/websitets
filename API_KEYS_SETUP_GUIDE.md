# API Keys Setup Guide for TrueSkin

## 🎯 **Priority: Google Authentication First**

**For Google authentication to work, you only need:**
- ✅ Supabase URL and Key (already configured)
- ✅ Database setup (run complete-database-setup.sql)

**You can test Google authentication without Razorpay or Resend keys!**

## 🔑 **API Keys Breakdown**

### 1. **Razorpay Keys** (For Payment Processing)

**Purpose:** Process customer payments for orders

**How to get:**
1. Go to https://dashboard.razorpay.com/
2. Sign up/Login
3. Go to `Settings` → `API Keys`
4. Copy `Key ID` and `Key Secret`

**Replace in .env:**
```
VITE_RAZORPAY_KEY_ID=rzp_test_your_actual_key_id
VITE_RAZORPAY_KEY_SECRET=your_actual_key_secret
```

**Example:**
```
VITE_RAZORPAY_KEY_ID=rzp_test_1234567890abcdef
VITE_RAZORPAY_KEY_SECRET=abcd1234efgh5678ijkl9012mnop3456
```

### 2. **Resend API Key** (For Email Notifications)

**Purpose:** Send order confirmation emails to customers

**How to get:**
1. Go to https://resend.com/
2. Sign up/Login
3. Go to `API Keys` section
4. Create new API key
5. Copy the key

**Replace in .env:**
```
VITE_RESEND_API_KEY=re_your_actual_api_key
```

**Example:**
```
VITE_RESEND_API_KEY=re_1234567890abcdef_1234567890abcdef
```

### 3. **Backend API URL** (Optional for now)

**Purpose:** Payment processing backend

**Current setting:** `VITE_API_URL=http://localhost:3001`

**You can leave this as is for now.**

## 🚀 **Recommended Setup Order**

### **Phase 1: Google Authentication (Do This First)**
1. ✅ Supabase is already configured
2. Run `complete-database-setup.sql` in Supabase
3. Test Google authentication
4. **No additional API keys needed!**

### **Phase 2: Payment Processing (Later)**
1. Set up Razorpay account
2. Get Razorpay API keys
3. Update environment file
4. Test payment processing

### **Phase 3: Email Notifications (Later)**
1. Set up Resend account
2. Get Resend API key
3. Update environment file
4. Test email sending

## 📝 **Current Environment File Status**

**Working for Google Auth:**
- ✅ VITE_SUPABASE_URL
- ✅ VITE_SUPABASE_ANON_KEY

**Not needed for Google Auth:**
- ⏳ VITE_RAZORPAY_KEY_ID (for payments)
- ⏳ VITE_RAZORPAY_KEY_SECRET (for payments)
- ⏳ VITE_RESEND_API_KEY (for emails)
- ⏳ VITE_API_URL (for backend)

## 🎯 **Next Steps**

1. **Focus on Google Authentication first**
   - Run the database setup script
   - Test Google login

2. **Add payment processing later**
   - Get Razorpay keys when ready
   - Update environment file

3. **Add email notifications later**
   - Get Resend key when ready
   - Update environment file

## 💡 **Pro Tip**

You can test your entire e-commerce app with Google authentication working, even without payment processing. Users can:
- ✅ Sign in with Google
- ✅ Browse products
- ✅ Add items to cart
- ✅ View their profile
- ✅ See order history (when implemented)

Payment processing and email notifications can be added later as separate features!

---

**Focus on getting Google authentication working first - everything else can be added incrementally!** 🚀
