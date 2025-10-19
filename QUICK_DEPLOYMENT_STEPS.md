# ⚡ Quick Deployment Steps - TrueSkin Website

## 🚀 **Fast Track Deployment (5 Minutes)**

### **Step 1: Prepare Project**
```bash
cd TRUESKINWEB-main
npm install
npm run build
```

### **Step 2: Deploy to Vercel (Recommended)**

#### **Option A: Using Vercel CLI**
```bash
npm i -g vercel
vercel login
vercel --prod
```

#### **Option B: Using Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Set build command: `npm run build`
5. Set output directory: `dist`

### **Step 3: Set Environment Variables**
In Vercel dashboard → Settings → Environment Variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
VITE_RAZORPAY_KEY_SECRET=your_razorpay_secret
VITE_RESEND_API_KEY=your_resend_api_key
```

### **Step 4: Test Deployment**
1. Visit your deployed URL
2. Test all functionality
3. Check console for errors

---

## 🌐 **Alternative Deployment Options**

### **Netlify Deployment**
```bash
npm i -g netlify-cli
netlify login
npm run build
netlify deploy --prod --dir=dist
```

### **Manual Deployment**
1. Run `npm run build`
2. Upload `dist` folder to your hosting service
3. Configure redirects for SPA routing

---

## 🔧 **Required Setup Before Deployment**

### **1. Supabase Database**
- Create project at [supabase.com](https://supabase.com)
- Run database setup scripts
- Get URL and API keys

### **2. Razorpay Account**
- Sign up at [razorpay.com](https://razorpay.com)
- Get API keys from dashboard
- Configure webhooks

### **3. Resend Email**
- Sign up at [resend.com](https://resend.com)
- Get API key
- Verify domain

### **4. Google OAuth**
- Create project at [console.cloud.google.com](https://console.cloud.google.com)
- Configure OAuth consent screen
- Create OAuth credentials

---

## ✅ **Post-Deployment Checklist**

- [ ] Website loads correctly
- [ ] All pages work
- [ ] Authentication works
- [ ] Cart functionality works
- [ ] Payment gateway works
- [ ] Email notifications work
- [ ] Mobile responsive
- [ ] No console errors

---

**🎯 Your TrueSkin website is now live! 🚀**
