#!/bin/bash

# TrueSkin Web - Quick Vercel Deployment Script

echo "🚀 TrueSkin Web - Vercel Deployment Helper"
echo "=========================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "✅ Vercel CLI is ready"

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel:"
    vercel login
fi

echo "✅ Logged in to Vercel"

# Check if backend is deployed
echo ""
echo "🔍 Backend Deployment Check:"
echo "Please ensure your backend is deployed to Railway/Render and you have the URL."
echo "You'll need to add this URL as VITE_API_URL in Vercel environment variables."

# Deploy frontend
echo ""
echo "🌐 Deploying frontend to Vercel..."
vercel --prod

echo ""
echo "🎉 Deployment initiated!"
echo ""
echo "📋 Next Steps:"
echo "1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables"
echo "2. Add these environment variables:"
echo "   - VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id_here"
echo "   - VITE_RAZORPAY_KEY_SECRET=your_key_secret_here"
echo "   - VITE_API_URL=https://your-backend-domain.railway.app"
echo "   - VITE_RESEND_API_KEY=re_your_resend_api_key_here"
echo "3. Redeploy the project"
echo "4. Test the complete flow"
echo ""
echo "🔗 Vercel Dashboard: https://vercel.com/dashboard"
