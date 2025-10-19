# 🚀 Complete TrueSkin Website Deployment Guide

## 📋 **Pre-Deployment Checklist**

### ✅ **Project Status:**
- ✅ Frontend built with React + Vite
- ✅ Backend API with Node.js
- ✅ Database with Supabase
- ✅ Payment gateway with Razorpay
- ✅ Email notifications with Resend
- ✅ Authentication with Google OAuth
- ✅ Responsive design with Tailwind CSS

---

## 🛠️ **Step 1: Prepare Your Project**

### **1.1 Navigate to Project Directory**
```bash
cd TRUESKINWEB-main
```

### **1.2 Install Dependencies**
```bash
npm install
```

### **1.3 Test Local Build**
```bash
npm run build
```

### **1.4 Preview Production Build**
```bash
npm run preview
```

---

## 🔑 **Step 2: Set Up Environment Variables**

### **2.1 Create Environment Files**

#### **Frontend (.env)**
Create `.env` file in root directory:
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id_here
VITE_RAZORPAY_KEY_SECRET=your_razorpay_secret_here

# Email Configuration
VITE_RESEND_API_KEY=your_resend_api_key_here

# Backend API (if using separate backend)
VITE_API_URL=https://your-backend-domain.com
```

#### **Backend (.env)** (if using separate backend)
```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_secret_here

# Server Configuration
PORT=3001
NODE_ENV=production

# CORS Configuration
FRONTEND_URL=https://your-frontend-domain.com
```

---

## 🌐 **Step 3: Deploy Frontend (Choose One Platform)**

### **Option A: Vercel Deployment (Recommended)**

#### **3A.1 Install Vercel CLI**
```bash
npm i -g vercel
```

#### **3A.2 Login to Vercel**
```bash
vercel login
```

#### **3A.3 Deploy to Vercel**
```bash
vercel --prod
```

#### **3A.4 Set Environment Variables in Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Select your project
3. Go to Settings → Environment Variables
4. Add all `VITE_` prefixed variables

#### **3A.5 Configure Vercel Settings**
The `vercel.json` file is already configured:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### **Option B: Netlify Deployment**

#### **3B.1 Install Netlify CLI**
```bash
npm i -g netlify-cli
```

#### **3B.2 Login to Netlify**
```bash
netlify login
```

#### **3B.3 Build Project**
```bash
npm run build
```

#### **3B.4 Deploy to Netlify**
```bash
netlify deploy --prod --dir=dist
```

#### **3B.5 Configure Netlify Settings**
The `public/_redirects` file is already configured:
```
/*    /index.html   200
```

#### **3B.6 Set Environment Variables**
1. Go to [netlify.com](https://netlify.com)
2. Select your site
3. Go to Site Settings → Environment Variables
4. Add all `VITE_` prefixed variables

### **Option C: Manual Deployment (Any Hosting Service)**

#### **3C.1 Build Project**
```bash
npm run build
```

#### **3C.2 Upload Files**
Upload the entire `dist` folder to your hosting service:
- cPanel File Manager
- FTP Client
- Cloud Storage (AWS S3, Google Cloud, etc.)

#### **3C.3 Configure Server**
- Set up redirects for SPA routing
- Configure HTTPS
- Set up environment variables

---

## 🖥️ **Step 4: Deploy Backend (If Using Separate Backend)**

### **Option A: Railway Deployment**

#### **4A.1 Install Railway CLI**
```bash
npm install -g @railway/cli
```

#### **4A.2 Login to Railway**
```bash
railway login
```

#### **4A.3 Deploy Backend**
```bash
cd backend
railway deploy
```

#### **4A.4 Set Environment Variables**
```bash
railway variables set RAZORPAY_KEY_ID=your_key_id
railway variables set RAZORPAY_KEY_SECRET=your_secret
railway variables set PORT=3001
railway variables set NODE_ENV=production
```

### **Option B: Render Deployment**

#### **4B.1 Connect Repository**
1. Go to [render.com](https://render.com)
2. Connect your GitHub repository
3. Select the `backend` folder

#### **4B.2 Configure Build Settings**
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Environment:** Node.js

#### **4B.3 Set Environment Variables**
Add all backend environment variables in Render dashboard

### **Option C: Heroku Deployment**

#### **4C.1 Install Heroku CLI**
```bash
npm install -g heroku
```

#### **4C.2 Login to Heroku**
```bash
heroku login
```

#### **4C.3 Create Heroku App**
```bash
heroku create your-app-name
```

#### **4C.4 Deploy Backend**
```bash
cd backend
git subtree push --prefix=backend heroku main
```

#### **4C.5 Set Environment Variables**
```bash
heroku config:set RAZORPAY_KEY_ID=your_key_id
heroku config:set RAZORPAY_KEY_SECRET=your_secret
heroku config:set NODE_ENV=production
```

---

## 🗄️ **Step 5: Database Setup (Supabase)**

### **5.1 Create Supabase Project**
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Note down URL and API keys

### **5.2 Run Database Setup Scripts**
Execute these SQL files in Supabase SQL Editor:

#### **5.2.1 Complete Database Setup**
```sql
-- Run: complete-database-setup.sql
-- This creates all tables, RLS policies, and triggers
```

#### **5.2.2 Fix Cart Setup**
```sql
-- Run: fix-cart-setup.sql
-- This fixes cart persistence issues
```

#### **5.2.3 Google OAuth Fix**
```sql
-- Run: fix-google-oauth-signup.sql
-- This fixes Google OAuth signup issues
```

### **5.3 Configure Authentication**
1. Go to Authentication → Settings
2. Enable Google OAuth
3. Add your domain to allowed origins
4. Configure OAuth credentials

---

## 💳 **Step 6: Payment Gateway Setup (Razorpay)**

### **6.1 Create Razorpay Account**
1. Go to [razorpay.com](https://razorpay.com)
2. Sign up for account
3. Complete KYC verification

### **6.2 Get API Keys**
1. Go to Dashboard → Settings → API Keys
2. Copy Key ID and Key Secret
3. Use test keys for development, live keys for production

### **6.3 Configure Webhooks**
1. Go to Settings → Webhooks
2. Add webhook URL: `https://your-backend-domain.com/webhook`
3. Select events: `payment.captured`, `payment.failed`

---

## 📧 **Step 7: Email Setup (Resend)**

### **7.1 Create Resend Account**
1. Go to [resend.com](https://resend.com)
2. Sign up for account
3. Verify your domain

### **7.2 Get API Key**
1. Go to API Keys section
2. Create new API key
3. Copy the key for environment variables

### **7.3 Configure Email Templates**
- Admin notification emails
- Customer confirmation emails
- Order status updates

---

## 🔐 **Step 8: Google OAuth Setup**

### **8.1 Create Google Cloud Project**
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create new project
3. Enable Google+ API

### **8.2 Configure OAuth Consent Screen**
1. Go to APIs & Services → OAuth consent screen
2. Configure app information
3. Add authorized domains

### **8.3 Create OAuth Credentials**
1. Go to APIs & Services → Credentials
2. Create OAuth 2.0 Client ID
3. Add authorized redirect URIs:
   - `https://your-domain.com/auth/callback`
   - `http://localhost:5173/auth/callback` (for development)

---

## 🧪 **Step 9: Testing Checklist**

### **9.1 Frontend Testing**
- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Product pages display properly
- [ ] Cart functionality works
- [ ] Checkout form validates
- [ ] Authentication works (Google & Email)
- [ ] Payment gateway integration
- [ ] Responsive design on all devices
- [ ] No console errors

### **9.2 Backend Testing**
- [ ] API endpoints respond correctly
- [ ] Database connections work
- [ ] Order creation functions
- [ ] Payment verification works
- [ ] Email notifications send
- [ ] CORS headers configured
- [ ] Error handling works

### **9.3 Payment Testing**
- [ ] Test payment with Razorpay test cards
- [ ] Payment success flow
- [ ] Payment failure handling
- [ ] Order status updates
- [ ] Email confirmations

---

## 🚨 **Step 10: Common Issues & Solutions**

### **Issue: CORS Errors**
**Solution:**
```javascript
// Backend CORS configuration
app.use(cors({
  origin: ['https://your-frontend-domain.com'],
  credentials: true
}));
```

### **Issue: Environment Variables Not Loading**
**Solution:**
- Ensure all variables start with `VITE_` for frontend
- Restart development server after adding variables
- Check deployment platform environment variable settings

### **Issue: Payment Gateway Not Working**
**Solution:**
- Verify Razorpay API keys are correct
- Check webhook URLs are accessible
- Test with Razorpay test cards first

### **Issue: Database Connection Failed**
**Solution:**
- Verify Supabase URL and API keys
- Check RLS policies are configured
- Ensure database tables exist

### **Issue: Authentication Not Working**
**Solution:**
- Check Google OAuth configuration
- Verify redirect URIs are correct
- Ensure Supabase auth settings are configured

---

## 📊 **Step 11: Performance Optimization**

### **11.1 Frontend Optimization**
- ✅ Code splitting configured
- ✅ Image optimization enabled
- ✅ Bundle size optimized
- ✅ Caching headers set

### **11.2 Backend Optimization**
- ✅ Error handling implemented
- ✅ CORS configured
- ✅ Security headers set
- ✅ Logging implemented

---

## 🔐 **Step 12: Security Checklist**

- [ ] Environment variables secured
- [ ] API keys not exposed in code
- [ ] CORS properly configured
- [ ] Input validation implemented
- [ ] Error messages sanitized
- [ ] HTTPS enabled
- [ ] Security headers configured

---

## 📞 **Step 13: Post-Deployment Support**

### **13.1 Monitoring**
- Set up error tracking (Sentry, LogRocket)
- Monitor performance metrics
- Track user analytics

### **13.2 Maintenance**
- Regular security updates
- Database backups
- Performance monitoring
- User feedback collection

---

## 🎉 **Deployment Complete!**

### **Your TrueSkin website is now live with:**
- ✅ Complete e-commerce functionality
- ✅ Secure payment processing
- ✅ User authentication
- ✅ Order management
- ✅ Email notifications
- ✅ Responsive design
- ✅ Production-ready code

### **Next Steps:**
1. Test all functionality thoroughly
2. Set up monitoring and analytics
3. Configure backups
4. Plan for scaling
5. Collect user feedback

---

## 📚 **Additional Resources**

- [Vercel Deployment Guide](https://vercel.com/docs)
- [Netlify Deployment Guide](https://docs.netlify.com)
- [Supabase Documentation](https://supabase.com/docs)
- [Razorpay Integration Guide](https://razorpay.com/docs)
- [Resend Documentation](https://resend.com/docs)

---

**🚀 Your TrueSkin website is ready for production! 🎯**
