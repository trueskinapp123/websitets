# Google OAuth Setup Guide for TrueSkin

## Issue
Google authentication is not working because Google OAuth provider needs to be configured in Supabase.

## Solution Steps

### 1. Enable Google OAuth in Supabase Dashboard

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project: `xnlsijpognudxyoswajm`

2. **Navigate to Authentication Settings**
   - Go to `Authentication` → `Providers`
   - Find `Google` in the list of providers

3. **Enable Google Provider**
   - Toggle `Enable sign in with Google` to ON
   - You'll need to configure Google OAuth credentials

### 2. Create Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Create a new project or select existing one

2. **Enable Google+ API**
   - Go to `APIs & Services` → `Library`
   - Search for "Google+ API" and enable it

3. **Create OAuth 2.0 Credentials**
   - Go to `APIs & Services` → `Credentials`
   - Click `Create Credentials` → `OAuth 2.0 Client IDs`
   - Choose `Web application`
   - Add authorized redirect URIs:
     ```
     https://xnlsijpognudxyoswajm.supabase.co/auth/v1/callback
     ```

4. **Get Client ID and Secret**
   - Copy the `Client ID` and `Client Secret`
   - You'll need these for Supabase configuration

### 3. Configure Supabase with Google Credentials

1. **Back to Supabase Dashboard**
   - Go to `Authentication` → `Providers` → `Google`
   - Enter your Google `Client ID` and `Client Secret`
   - Save the configuration

### 4. Update Site URL (Important!)

1. **Set Site URL**
   - Go to `Authentication` → `URL Configuration`
   - Set `Site URL` to: `http://localhost:5173` (for development)
   - Add `http://localhost:5173` to `Redirect URLs`

### 5. Test Google Authentication

1. **Start your development server**
   ```bash
   npm run dev
   ```

2. **Test the login**
   - Go to `http://localhost:5173`
   - Click on login/signup
   - Click "Continue with Google"
   - Should redirect to Google OAuth flow

## Troubleshooting

### Common Issues:

1. **"Invalid redirect URI"**
   - Make sure redirect URI in Google Console matches Supabase callback URL exactly
   - Should be: `https://xnlsijpognudxyoswajm.supabase.co/auth/v1/callback`

2. **"Site URL not configured"**
   - Add `http://localhost:5173` to Site URL and Redirect URLs in Supabase

3. **"Google OAuth not enabled"**
   - Make sure Google provider is enabled in Supabase Authentication settings

4. **"Client ID not found"**
   - Verify Client ID and Secret are correctly entered in Supabase

## Current Status

✅ **Code is Ready**: Google authentication code is already implemented
✅ **Environment**: Supabase URL and keys are configured
❌ **Missing**: Google OAuth provider configuration in Supabase dashboard

## Next Steps

1. Follow the setup steps above
2. Test Google authentication
3. If issues persist, check browser console for specific error messages

---

**Note**: The Google authentication functionality is already implemented in the code. The issue is purely configuration-related in the Supabase dashboard.
