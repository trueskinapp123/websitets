# 🔧 Environment Variables Setup Guide

## ⚠️ IMPORTANT: Razorpay Credentials Missing

The error you're seeing indicates that the Razorpay Key ID is not configured. Here's how to fix it:

## 📋 Step 1: Create Environment File

Create a `.env` file in your project root directory with the following content:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://xnlsijpognudxyoswajm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhubHNijanBvZ251ZHh5b3N3YWptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzkxMzIsImV4cCI6MjA3NDA1NTEzMn0.7Oh90h9o3VUrsfVSYgP9h856Ve0yow76B1oXlK-l1Fs

# Razorpay Configuration (REPLACE WITH YOUR ACTUAL KEYS)
VITE_RAZORPAY_KEY_ID=rzp_test_your_actual_key_id_here
VITE_RAZORPAY_KEY_SECRET=your_actual_key_secret_here

# Email Service (Resend)
VITE_RESEND_API_KEY=your_resend_api_key_here

# Backend API URL
VITE_API_URL=http://localhost:3001
```

## 🔑 Step 2: Get Your Razorpay Keys

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Navigate to **Settings** → **API Keys**
3. Copy your **Key ID** and **Key Secret**
4. Replace the placeholder values in your `.env` file

## 🚀 Step 3: Start the Backend

The backend has been moved to `src/backend/`. Start it using:

```bash
# Option 1: Using npm script
npm run backend

# Option 2: Direct command
cd src/backend && npm start
```

## 🧪 Step 4: Test the Setup

1. Start the frontend: `npm run dev`
2. Start the backend: `npm run backend`
3. Test the payment flow

## 📁 New Project Structure

```
TRUESKINWEB-main/
├── src/
│   ├── backend/          # ← Backend moved here
│   │   ├── server.js
│   │   ├── package.json
│   │   └── .env
│   ├── components/
│   ├── contexts/
│   └── ...
├── .env                  # ← Create this file
└── package.json
```

## ⚡ Quick Commands

```bash
# Start frontend
npm run dev

# Start backend
npm run backend

# Start backend in development mode
npm run backend:dev
```

## 🔍 Troubleshooting

### Error: "Razorpay Key ID not found"
- ✅ Check that `.env` file exists in project root
- ✅ Verify `VITE_RAZORPAY_KEY_ID` is set correctly
- ✅ Restart the development server after adding environment variables

### Backend not starting
- ✅ Check that `src/backend/` directory exists
- ✅ Run `cd src/backend && npm install` if needed
- ✅ Verify backend `.env` file has Razorpay credentials

## 🎯 Next Steps

1. Create `.env` file with your actual Razorpay keys
2. Start both frontend and backend servers
3. Test the payment flow
4. Deploy to production

---

**Need Help?** Make sure to replace the placeholder Razorpay keys with your actual keys from the Razorpay dashboard!
