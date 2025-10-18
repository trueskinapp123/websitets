# 🚀 TrueSkin Web - Production Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ Frontend Requirements
- [ ] Environment variables configured
- [ ] Production build tested
- [ ] All API endpoints working
- [ ] Payment gateway integrated
- [ ] Database connections verified

### ✅ Backend Requirements
- [ ] Razorpay credentials configured
- [ ] CORS settings updated
- [ ] Environment variables set
- [ ] Server tested and running

## 🌐 Frontend Deployment (Vercel/Netlify)

### Environment Variables
Set these in your deployment platform:

```env
VITE_SUPABASE_URL=https://xnlsijpognudxyoswajm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhubHNijanBvZ251ZHh5b3N3YWptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzkxMzIsImV4cCI6MjA3NDA1NTEzMn0.7Oh90h9o3VUrsfVSYgP9h856Ve0yow76B1oXlK-l1Fs
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id_here
VITE_RESEND_API_KEY=your_resend_api_key_here
VITE_API_URL=https://your-backend-domain.com
```

### Build Commands
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Vercel Configuration
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Netlify Configuration
Create `public/_redirects`:
```
/*    /index.html   200
```

## 🖥️ Backend Deployment (Railway/Render/Heroku)

### Environment Variables
```env
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
PORT=3001
NODE_ENV=production
```

### Build Commands
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Node Version:** `18.x`

## 🔧 Production Configuration

### 1. Update API URLs
The frontend automatically uses `VITE_API_URL` for backend communication. Update this to your deployed backend URL.

### 2. Razorpay Configuration
- Update Razorpay webhook URLs
- Configure production API keys
- Test payment flow

### 3. Database Configuration
- Ensure Supabase is configured for production
- Update RLS policies if needed
- Test authentication flow

## 🧪 Testing Checklist

### Frontend Tests
- [ ] Homepage loads correctly
- [ ] Product pages display properly
- [ ] Cart functionality works
- [ ] Checkout form validates
- [ ] Authentication works
- [ ] Payment integration functions

### Backend Tests
- [ ] Health check endpoint responds
- [ ] Order creation works
- [ ] Payment verification functions
- [ ] CORS headers correct
- [ ] Error handling works

## 🚨 Common Issues & Solutions

### Issue: CORS Errors
**Solution:** Update backend CORS configuration with production domains

### Issue: Environment Variables Not Loading
**Solution:** Ensure all `VITE_` prefixed variables are set in deployment platform

### Issue: Payment Gateway Not Working
**Solution:** Verify Razorpay credentials and webhook URLs

### Issue: Database Connection Failed
**Solution:** Check Supabase configuration and RLS policies

## 📊 Performance Optimization

### Frontend
- ✅ Code splitting configured
- ✅ Image optimization enabled
- ✅ Bundle size optimized
- ✅ Caching headers set

### Backend
- ✅ Error handling implemented
- ✅ CORS configured
- ✅ Security headers set
- ✅ Logging implemented

## 🔐 Security Checklist

- [ ] Environment variables secured
- [ ] API keys not exposed
- [ ] CORS properly configured
- [ ] Input validation implemented
- [ ] Error messages sanitized

## 📞 Support

If you encounter issues during deployment:
1. Check environment variables
2. Verify API endpoints
3. Test payment flow
4. Check browser console for errors
5. Review server logs

---

**Ready for Production! 🎉**