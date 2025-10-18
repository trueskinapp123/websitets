#!/bin/bash

# TrueSkin Web - Production Build Script

echo "🚀 Starting TrueSkin Web Production Build..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Build frontend
echo "🔨 Building frontend for production..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Frontend build completed successfully!"
else
    echo "❌ Frontend build failed!"
    exit 1
fi

# Check if backend directory exists
if [ -d "backend" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend
    npm install
    
    if [ $? -eq 0 ]; then
        echo "✅ Backend dependencies installed successfully!"
    else
        echo "❌ Backend dependencies installation failed!"
        exit 1
    fi
    
    cd ..
else
    echo "⚠️  Backend directory not found. Skipping backend setup."
fi

echo ""
echo "🎉 Production build completed successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Update environment variables for production"
echo "2. Deploy frontend to Vercel/Netlify"
echo "3. Deploy backend to Railway/Render/Heroku"
echo "4. Update VITE_API_URL with your backend URL"
echo "5. Test the complete application"
echo ""
echo "📁 Build output: ./dist"
echo "🔗 Preview: npm run preview"
