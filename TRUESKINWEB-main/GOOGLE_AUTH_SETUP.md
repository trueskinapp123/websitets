# Google Authentication Setup Guide

This guide will help you set up Google OAuth authentication for your TrueSkin website using Supabase.

## 🚀 Features Implemented

✅ **Google OAuth Integration** - Sign in with Google using Supabase Auth  
✅ **AuthModal Enhancement** - Google sign-in button in authentication modal  
✅ **Checkout Integration** - Quick Google sign-in during checkout process  
✅ **Auto-fill Forms** - User details automatically populated from Google profile  
✅ **Seamless Experience** - One-click authentication for better UX  

## 📋 Prerequisites

1. **Supabase Project** - Already configured
2. **Google Cloud Console Account** - For OAuth credentials
3. **Domain Setup** - Your website domain for OAuth redirects

## 🔧 Google Cloud Console Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: "TrueSkin Authentication"
4. Click "Create"

### Step 2: Enable Google+ API

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

### Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. If prompted, configure the OAuth consent screen first:
   - Choose "External" user type
   - Fill in app information:
     - App name: "TrueSkin"
     - User support email: your email
     - Developer contact: your email
   - Add scopes: `email`, `profile`, `openid`
   - Add test users (your email for testing)

4. Create OAuth 2.0 Client ID:
   - Application type: "Web application"
   - Name: "TrueSkin Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:5173` (for development)
     - `https://yourdomain.com` (for production)
   - Authorized redirect URIs:
     - `https://iqkyzoybguicxuxiksmd.supabase.co/auth/v1/callback`
     - `http://localhost:5173` (for development)

5. Copy the **Client ID** and **Client Secret**

## 🗄️ Supabase Configuration

### Step 1: Enable Google Provider

1. Go to your Supabase Dashboard
2. Navigate to "Authentication" → "Providers"
3. Find "Google" and toggle it ON
4. Enter your Google OAuth credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console
5. Click "Save"

### Step 2: Configure Site URL

1. In Supabase Dashboard, go to "Authentication" → "URL Configuration"
2. Set **Site URL**: `https://yourdomain.com` (or `http://localhost:5173` for development)
3. Add **Redirect URLs**:
   - `https://yourdomain.com/**` (for production)
   - `http://localhost:5173/**` (for development)

## 🔧 Environment Variables

Add these to your `.env` file (if not already present):

```env
# Supabase Configuration (Already configured)
VITE_SUPABASE_URL=https://iqkyzoybguicxuxiksmd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlxa3l6b3liZ3VpY3h1eGlrc21kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMjI1MzYsImV4cCI6MjA3Mzc5ODUzNn0.vVVVoV5yvVvbDGAcw8Yqn5UeDg-qovOdL5MXDCFv7JU

# Google OAuth (Configured in Supabase Dashboard)
# No additional environment variables needed for Google OAuth
# Supabase handles the OAuth flow internally
```

## 🎯 How It Works

### 1. **AuthModal Integration**
- Users can click "Continue with Google" in the sign-in/sign-up modal
- Redirects to Google OAuth consent screen
- Returns to your app with user authenticated

### 2. **Checkout Integration**
- Non-authenticated users see a Google sign-in option
- Clicking it authenticates and auto-fills form details
- Seamless checkout experience

### 3. **User Profile Creation**
- When user signs in with Google, Supabase automatically creates a user profile
- User details (name, email) are populated from Google account
- Profile is stored in your `user_profiles` table

## 🧪 Testing Google Authentication

### Test Flow

1. **Open your website** in a browser
2. **Click "Sign In"** in the navigation
3. **Click "Continue with Google"** in the modal
4. **Sign in with Google** account
5. **Verify redirect** back to your website
6. **Check user profile** is created in Supabase

### Test Checkout Flow

1. **Add items to cart** without being signed in
2. **Go to checkout** page
3. **Click "Continue with Google"** in the blue box
4. **Sign in with Google**
5. **Verify form auto-fills** with Google profile data
6. **Complete checkout** process

## 🔒 Security Features

- **OAuth 2.0 Standard** - Industry-standard authentication
- **Supabase Security** - Built-in security features
- **HTTPS Required** - Secure communication
- **Token Management** - Automatic token refresh
- **Profile Validation** - User data validation

## 📱 Mobile Support

Google authentication works seamlessly on:
- **Desktop browsers** - Full OAuth flow
- **Mobile browsers** - Responsive OAuth popup
- **PWA** - Works in installed apps

## 🚨 Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**
   - Check Google Cloud Console redirect URIs
   - Ensure Supabase callback URL is correct
   - Verify domain matches exactly

2. **"OAuth consent screen" error**
   - Complete OAuth consent screen setup
   - Add required scopes (email, profile, openid)
   - Verify app information

3. **"Client ID not found" error**
   - Check Supabase Google provider configuration
   - Verify Client ID and Secret are correct
   - Ensure Google+ API is enabled

4. **User profile not created**
   - Check Supabase RLS policies
   - Verify `user_profiles` table exists
   - Check browser console for errors

### Debug Steps

1. **Check Browser Console**
   - Look for JavaScript errors
   - Check network requests to Supabase

2. **Check Supabase Logs**
   - Go to Supabase Dashboard → Logs
   - Look for authentication errors

3. **Check Google Cloud Console**
   - Verify OAuth credentials are active
   - Check redirect URIs are correct

## 🎉 Success!

Once configured, users can:

- ✅ **Sign in with Google** from any page
- ✅ **Quick checkout** with Google authentication
- ✅ **Auto-fill forms** with Google profile data
- ✅ **Seamless experience** across devices
- ✅ **Secure authentication** with industry standards

## 📞 Support

If you encounter issues:

1. **Check this guide** first
2. **Verify all configurations** match exactly
3. **Test with different browsers**
4. **Check Supabase and Google Cloud Console logs**

Your Google authentication is now ready! 🚀
