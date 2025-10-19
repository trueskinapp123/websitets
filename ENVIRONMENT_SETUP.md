# 🔑 Environment Variables Setup Guide

## 📋 **Required Environment Variables**

### **Frontend Environment Variables (.env)**

Create a `.env` file in your project root with these variables:

```env
# ============================================
# SUPABASE CONFIGURATION
# ============================================
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# ============================================
# RAZORPAY CONFIGURATION
# ============================================
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id_here
VITE_RAZORPAY_KEY_SECRET=your_razorpay_secret_here

# ============================================
# EMAIL CONFIGURATION (RESEND)
# ============================================
VITE_RESEND_API_KEY=your_resend_api_key_here

# ============================================
# BACKEND API (OPTIONAL - if using separate backend)
# ============================================
VITE_API_URL=https://your-backend-domain.com

# ============================================
# GOOGLE OAUTH (OPTIONAL - if using custom OAuth)
# ============================================
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

---

## 🗄️ **How to Get Each API Key**

### **1. Supabase Keys**

#### **Step 1: Create Supabase Project**
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization and enter project details
4. Wait for project to be created

#### **Step 2: Get API Keys**
1. Go to Settings → API
2. Copy **Project URL** → `VITE_SUPABASE_URL`
3. Copy **anon public** key → `VITE_SUPABASE_ANON_KEY`

#### **Step 3: Database Setup**
Run these SQL files in Supabase SQL Editor:
- `complete-database-setup.sql`
- `fix-cart-setup.sql`
- `fix-google-oauth-signup.sql`

---

### **2. Razorpay Keys**

#### **Step 1: Create Razorpay Account**
1. Go to [razorpay.com](https://razorpay.com)
2. Sign up for account
3. Complete KYC verification

#### **Step 2: Get API Keys**
1. Go to Dashboard → Settings → API Keys
2. Copy **Key ID** → `VITE_RAZORPAY_KEY_ID`
3. Copy **Key Secret** → `VITE_RAZORPAY_KEY_SECRET`

#### **Step 3: Configure Webhooks**
1. Go to Settings → Webhooks
2. Add webhook URL: `https://your-domain.com/webhook`
3. Select events: `payment.captured`, `payment.failed`

---

### **3. Resend Email Keys**

#### **Step 1: Create Resend Account**
1. Go to [resend.com](https://resend.com)
2. Sign up for account
3. Verify your email

#### **Step 2: Get API Key**
1. Go to API Keys section
2. Click "Create API Key"
3. Copy the key → `VITE_RESEND_API_KEY`

#### **Step 3: Verify Domain (Optional)**
1. Go to Domains section
2. Add your domain
3. Verify DNS records

---

### **4. Google OAuth Keys (Optional)**

#### **Step 1: Create Google Cloud Project**
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create new project
3. Enable Google+ API

#### **Step 2: Configure OAuth Consent Screen**
1. Go to APIs & Services → OAuth consent screen
2. Choose "External" user type
3. Fill in app information
4. Add authorized domains

#### **Step 3: Create OAuth Credentials**
1. Go to APIs & Services → Credentials
2. Click "Create Credentials" → OAuth 2.0 Client ID
3. Choose "Web application"
4. Add authorized redirect URIs:
   - `https://your-domain.com/auth/callback`
   - `http://localhost:5173/auth/callback`
5. Copy **Client ID** → `VITE_GOOGLE_CLIENT_ID`

---

## 🚀 **Deployment Platform Setup**

### **Vercel Deployment**

#### **Step 1: Set Environment Variables**
1. Go to [vercel.com](https://vercel.com)
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable with its value

#### **Step 2: Deploy**
```bash
vercel --prod
```

### **Netlify Deployment**

#### **Step 1: Set Environment Variables**
1. Go to [netlify.com](https://netlify.com)
2. Select your site
3. Go to Site Settings → Environment Variables
4. Add each variable with its value

#### **Step 2: Deploy**
```bash
netlify deploy --prod --dir=dist
```

---

## 🧪 **Testing Your Environment Variables**

### **Test Script**
Create a test file to verify all variables are loaded:

```javascript
// test-env.js
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Razorpay Key ID:', import.meta.env.VITE_RAZORPAY_KEY_ID);
console.log('Resend API Key:', import.meta.env.VITE_RESEND_API_KEY);
```

### **Run Test**
```bash
npm run dev
# Check browser console for variable values
```

---

## 🚨 **Common Issues & Solutions**

### **Issue: Variables Not Loading**
**Solution:**
- Ensure all variables start with `VITE_`
- Restart development server
- Check `.env` file is in root directory

### **Issue: Undefined Variables**
**Solution:**
- Check variable names are correct
- Ensure no spaces around `=`
- Verify `.env` file syntax

### **Issue: Production Variables Not Working**
**Solution:**
- Set variables in deployment platform
- Redeploy after adding variables
- Check platform-specific documentation

---

## 🔐 **Security Best Practices**

### **Do's:**
- ✅ Use environment variables for all sensitive data
- ✅ Use test keys for development
- ✅ Use production keys only for production
- ✅ Never commit `.env` files to git
- ✅ Rotate keys regularly

### **Don'ts:**
- ❌ Hardcode API keys in source code
- ❌ Share API keys in chat/email
- ❌ Use production keys for testing
- ❌ Commit `.env` files to version control

---

## 📝 **Environment Variables Checklist**

- [ ] `VITE_SUPABASE_URL` - Supabase project URL
- [ ] `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- [ ] `VITE_RAZORPAY_KEY_ID` - Razorpay key ID
- [ ] `VITE_RAZORPAY_KEY_SECRET` - Razorpay key secret
- [ ] `VITE_RESEND_API_KEY` - Resend API key
- [ ] `VITE_API_URL` - Backend API URL (optional)
- [ ] `VITE_GOOGLE_CLIENT_ID` - Google OAuth client ID (optional)

---

**🎯 Your environment is now properly configured for deployment! 🚀**
