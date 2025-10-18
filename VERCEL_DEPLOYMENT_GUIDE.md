# 🚀 Vercel Deployment Guide for TrueSkin Web

## 📋 Prerequisites
- Vercel account (free tier available)
- Razorpay account with API keys
- Backend deployed (Railway/Render/Heroku)

## 🔧 Step 1: Deploy Backend First

### Option A: Railway (Recommended)
1. Go to [Railway.app](https://railway.app)
2. Connect your GitHub account
3. Create new project from GitHub
4. Select your repository
5. Choose the `backend` folder
6. Add environment variables:
   ```env
   RAZORPAY_KEY_ID=rzp_test_your_key_id_here
   RAZORPAY_KEY_SECRET=your_key_secret_here
   PORT=3001
   NODE_ENV=production
   ```
7. Deploy and get your backend URL (e.g., `https://your-app.railway.app`)

### Option B: Render
1. Go to [Render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Root Directory:** `backend`
5. Add environment variables (same as above)
6. Deploy and get your backend URL

## 🌐 Step 2: Deploy Frontend to Vercel

### Method 1: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name: trueskinweb
# - Directory: ./
# - Override settings? N
```

### Method 2: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

## 🔑 Step 3: Configure Environment Variables

In Vercel Dashboard → Project → Settings → Environment Variables:

```env
# Supabase (already configured in vercel.json)
VITE_SUPABASE_URL=https://xnlsijpognudxyoswajm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhubHNijanBvZ251ZHh5b3N3YWptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzkxMzIsImV4cCI6MjA3NDA1NTEzMn0.7Oh90h9o3VUrsfVSYgP9h856Ve0yow76B1oXlK-l1Fs

# Razorpay (REQUIRED - Add your actual keys)
VITE_RAZORPAY_KEY_ID=rzp_test_your_actual_key_id_here
VITE_RAZORPAY_KEY_SECRET=your_actual_key_secret_here

# Backend API URL (Update with your deployed backend URL)
VITE_API_URL=https://your-backend-domain.railway.app

# Email Service (Optional)
VITE_RESEND_API_KEY=re_your_resend_api_key_here
```

## 🔄 Step 4: Redeploy

After adding environment variables:
1. Go to Vercel Dashboard → Deployments
2. Click "Redeploy" on the latest deployment
3. Or trigger a new deployment by pushing to your main branch

## 🧪 Step 5: Test Deployment

### Frontend Tests
- [ ] Homepage loads: `https://your-app.vercel.app`
- [ ] Products display correctly
- [ ] Cart functionality works
- [ ] Authentication works
- [ ] Checkout form loads
- [ ] Payment button appears (should not show error)

### Backend Tests
- [ ] Health check: `https://your-backend.railway.app/health`
- [ ] Order creation: Test with Postman/curl
- [ ] Payment verification: Test with Postman/curl

## 🚨 Troubleshooting

### Error: "Razorpay Key ID not found"
**Solution:** Add `VITE_RAZORPAY_KEY_ID` to Vercel environment variables

### Error: "Failed to create order"
**Solution:** 
1. Check backend is deployed and running
2. Verify `VITE_API_URL` points to your backend
3. Check backend environment variables

### Error: "CORS error"
**Solution:** Update backend CORS configuration with your Vercel domain

### Error: "Payment verification failed"
**Solution:** Check Razorpay webhook configuration

## 📊 Production Checklist

### Frontend (Vercel)
- [ ] Environment variables configured
- [ ] Build successful
- [ ] Domain configured (optional)
- [ ] SSL certificate active

### Backend (Railway/Render)
- [ ] Environment variables configured
- [ ] Server running
- [ ] Health check responding
- [ ] CORS configured for production

### Payment Gateway
- [ ] Razorpay keys configured
- [ ] Webhook URLs updated
- [ ] Test payment successful

## 🔗 Quick Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Railway Dashboard:** https://railway.app/dashboard
- **Render Dashboard:** https://dashboard.render.com
- **Razorpay Dashboard:** https://dashboard.razorpay.com

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check backend server logs
3. Verify all environment variables
4. Test API endpoints manually
5. Check browser console for errors

---

**Ready to deploy! 🚀**
