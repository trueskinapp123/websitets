# 🚀 Complete Vercel Deployment Guide for TrueSkin

This guide will help you deploy both the frontend and backend to Vercel with full functionality.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub/GitLab/Bitbucket Account**: For connecting your repository
3. **Supabase Project**: Already set up
4. **Razorpay Account**: For payment processing
5. **Resend Account**: For email notifications

## 🏗️ Architecture

- **Frontend**: React/Vite app deployed as static site
- **Backend**: Express routes converted to Vercel serverless functions in `/api` directory
- **Database**: Supabase (external)
- **Payment**: Razorpay (external)

## 📦 Step 1: Prepare Your Repository

1. **Commit all changes**:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push
   ```

2. **Verify file structure**:
   - ✅ `api/` directory with serverless functions
   - ✅ `vercel.json` configuration
   - ✅ `package.json` with build scripts

## 🔧 Step 2: Install Vercel CLI (Optional)

```bash
npm i -g vercel
```

## 🚀 Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to [vercel.com](https://vercel.com)**
2. **Click "Add New Project"**
3. **Import your Git repository**
4. **Configure the project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Add Environment Variables** (see Step 4 below)

6. **Click "Deploy"**

### Option B: Deploy via CLI

```bash
# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# For production deployment
vercel --prod
```

## 🔐 Step 4: Configure Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables, add:

### Frontend Environment Variables

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://xnlsijpognudxyoswajm.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=rzp_live_your_key_id_here
VITE_RAZORPAY_KEY_SECRET=your_razorpay_secret_here

# Email Configuration (Resend)
VITE_RESEND_API_KEY=re_your_resend_api_key_here

# Backend API URL (leave empty for same domain, or set to your Vercel URL)
VITE_API_URL=
```

### Backend Environment Variables (for Serverless Functions)

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_live_your_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_secret_here

# Supabase Configuration (for admin endpoints)
SUPABASE_URL=https://xnlsijpognudxyoswajm.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Node Environment
NODE_ENV=production
```

### Important Notes:

1. **Service Role Key**: Get this from Supabase Dashboard → Settings → API → `service_role` key (NOT the anon key)
2. **Razorpay Keys**: Use production keys from Razorpay Dashboard
3. **Environment**: Set variables for **Production**, **Preview**, and **Development** environments

## 📁 Step 5: Verify File Structure

Your project should have:

```
TRUESKINWEB-main/
├── api/
│   ├── create-order.js          # Razorpay order creation
│   ├── verify-payment.js        # Payment verification
│   └── admin/
│       ├── orders.js            # Admin orders endpoint
│       └── users.js             # Admin users endpoint
├── src/
│   └── ... (frontend code)
├── vercel.json                  # Vercel configuration
├── package.json                 # Dependencies
└── vite.config.ts              # Vite configuration
```

## ✅ Step 6: Test Deployment

After deployment, test these endpoints:

1. **Frontend**: `https://your-project.vercel.app`
2. **Health Check**: `https://your-project.vercel.app/api/health` (if you add it)
3. **Create Order**: `POST https://your-project.vercel.app/api/create-order`
4. **Admin Orders**: `GET https://your-project.vercel.app/api/admin/orders`

## 🔍 Step 7: Verify Functionality

### Test Checklist:

- [ ] **Frontend loads correctly**
- [ ] **Products display**
- [ ] **User authentication works** (Google OAuth)
- [ ] **Cart functionality works**
- [ ] **Checkout form works**
- [ ] **Payment processing works** (Razorpay)
- [ ] **Order creation works**
- [ ] **Admin login works** (`/admin/login`)
- [ ] **Admin dashboard loads orders**
- [ ] **Admin dashboard loads users**

## 🐛 Troubleshooting

### Issue: API endpoints return 404

**Solution:**
- Check `vercel.json` routes configuration
- Verify files are in `api/` directory
- Check function names match routes

### Issue: Environment variables not working

**Solution:**
- Verify variables are set in Vercel Dashboard
- Check variable names match exactly (case-sensitive)
- Redeploy after adding variables
- Check function logs in Vercel Dashboard

### Issue: CORS errors

**Solution:**
- Verify CORS headers in serverless functions
- Check `Access-Control-Allow-Origin` headers
- Ensure frontend URL is in allowed origins

### Issue: Admin dashboard shows errors

**Solution:**
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set
- Check admin authentication headers
- Review function logs in Vercel Dashboard

### Issue: Payment not working

**Solution:**
- Verify Razorpay keys are correct
- Check Razorpay webhook configuration
- Review payment function logs
- Test with Razorpay test keys first

## 📊 Monitoring

### View Logs:

1. Go to Vercel Dashboard
2. Select your project
3. Click "Functions" tab
4. Click on any function to see logs

### View Analytics:

1. Go to Vercel Dashboard
2. Select your project
3. Click "Analytics" tab

## 🔄 Updating Deployment

### Automatic Updates:

- Push to your main branch → Vercel auto-deploys
- Push to other branches → Creates preview deployments

### Manual Updates:

```bash
vercel --prod
```

## 🔒 Security Best Practices

1. **Never commit** `.env` files
2. **Use environment variables** for all secrets
3. **Rotate API keys** regularly
4. **Use production keys** only in production
5. **Enable Vercel's DDoS protection**
6. **Set up rate limiting** (consider Vercel Edge Config)

## 📝 Custom Domain Setup

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)

## 🎯 Production Checklist

Before going live:

- [ ] All environment variables configured
- [ ] Production Razorpay keys set
- [ ] Supabase production database configured
- [ ] Email service (Resend) configured
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] All functionality tested
- [ ] Error tracking set up (optional)
- [ ] Analytics configured (optional)
- [ ] Backup strategy in place

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)

## 🆘 Support

If you encounter issues:

1. Check Vercel function logs
2. Review browser console errors
3. Check Supabase logs
4. Verify all environment variables
5. Test endpoints individually

---

**🎉 Your TrueSkin application is now deployed on Vercel with full functionality!**

