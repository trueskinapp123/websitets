# 🚀 Deployment Guide - TrueSkin Web App

## 📋 Pre-Deployment Checklist

### ✅ Environment Variables
Make sure these are set in your deployment platform:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_RAZORPAY_KEY_SECRET=your_razorpay_key_secret
VITE_RESEND_API_KEY=your_resend_api_key
```

### ✅ Build Configuration
- **Vite Config**: Updated with proper build settings
- **Error Boundary**: Added for better error handling
- **Routing**: Configured for SPA deployment

## 🌐 Platform-Specific Deployment

### Vercel Deployment
1. **vercel.json**: ✅ Created with proper rewrites
2. **Build Command**: `npm run build`
3. **Output Directory**: `dist`
4. **Node Version**: 18.x or higher

### Netlify Deployment
1. **_redirects**: ✅ Created in public folder
2. **Build Command**: `npm run build`
3. **Publish Directory**: `dist`
4. **Node Version**: 18.x or higher

### Other Platforms
- Ensure SPA routing is configured
- Set up proper redirects for client-side routing
- Configure environment variables

## 🔧 Common Deployment Issues & Solutions

### Issue 1: Main Page Not Loading
**Symptoms**: Blank page, 404 errors on refresh
**Solution**: 
- Check if `vercel.json` or `_redirects` is properly configured
- Verify build output includes `index.html`
- Check browser console for JavaScript errors

### Issue 2: Environment Variables Not Working
**Symptoms**: API calls failing, authentication not working
**Solution**:
- Ensure all `VITE_` prefixed variables are set
- Check variable names match exactly
- Redeploy after adding new variables

### Issue 3: Assets Not Loading
**Symptoms**: Images, CSS, or JS files not loading
**Solution**:
- Check if assets are in `public/` folder
- Verify build process includes all assets
- Check for case-sensitive file paths

### Issue 4: Routing Issues
**Symptoms**: Direct URL access returns 404
**Solution**:
- Verify SPA redirect configuration
- Check if `BrowserRouter` is used correctly
- Ensure all routes are properly defined

## 🚀 Deployment Steps

### For Vercel:
1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### For Netlify:
1. Connect your GitHub repository
2. Set environment variables in Netlify dashboard
3. Deploy automatically on push

### Manual Deployment:
1. Run `npm run build`
2. Upload `dist` folder to your hosting service
3. Configure redirects for SPA routing

## 🔍 Debugging Deployment Issues

### Check Browser Console
- Look for JavaScript errors
- Check network tab for failed requests
- Verify environment variables are loaded

### Check Build Output
- Ensure `dist` folder contains all necessary files
- Verify `index.html` is present
- Check for any build warnings

### Test Locally
- Run `npm run build`
- Serve the `dist` folder locally
- Test all routes and functionality

## 📞 Support

If you're still experiencing issues:
1. Check the browser console for errors
2. Verify all environment variables are set
3. Ensure your deployment platform supports SPA routing
4. Check the build logs for any errors

## ✅ Success Indicators

Your deployment is successful when:
- ✅ Main page loads correctly
- ✅ All routes work (including direct URL access)
- ✅ Authentication works
- ✅ Cart functionality works
- ✅ Payment gateway works
- ✅ Images and assets load properly
- ✅ No console errors
