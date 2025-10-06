#!/bin/bash

# TrueSkin Payment Backend Setup Script

echo "🚀 Setting up TrueSkin Payment Backend..."

# Create backend directory if it doesn't exist
mkdir -p backend
cd backend

# Initialize npm project
npm init -y

# Install dependencies
echo "📦 Installing dependencies..."
npm install express cors razorpay dotenv
npm install --save-dev nodemon

# Create server.js
cat > server.js << 'EOF'
const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Razorpay configuration
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'test_secret_key'
});

// Create Razorpay order
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, customer_info } = req.body;

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt,
      notes: customer_info || {}
    };

    const order = await razorpay.orders.create(options);
    
    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create order'
    });
  }
});

// Verify payment
app.post('/api/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Create signature for verification
    const crypto = require('crypto');
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'test_secret_key')
      .update(body.toString())
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    res.json({
      success: isValid,
      isValid
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify payment'
    });
  }
});

// Get payment status
app.get('/api/payment-status/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    const payment = await razorpay.payments.fetch(paymentId);
    
    res.json({
      success: true,
      payment: {
        id: payment.id,
        status: payment.status,
        amount: payment.amount,
        method: payment.method,
        created_at: payment.created_at
      }
    });
  } catch (error) {
    console.error('Error fetching payment status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payment status'
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Payment API is running',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Payment API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
EOF

# Create .env file
cat > .env << 'EOF'
# Backend Server Configuration
PORT=3001

# Razorpay Configuration
# Replace these with your actual Razorpay credentials from https://dashboard.razorpay.com/
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here
EOF

# Update package.json scripts
cat > package.json << 'EOF'
{
  "name": "trueskin-payment-api",
  "version": "1.0.0",
  "description": "Payment API server for TrueSkin e-commerce",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "razorpay": "^2.9.6",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  },
  "keywords": ["razorpay", "payment", "api", "ecommerce"],
  "author": "TrueSkin",
  "license": "MIT"
}
EOF

echo "✅ Backend setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update the .env file with your actual Razorpay credentials:"
echo "   - Go to https://dashboard.razorpay.com/"
echo "   - Get your Test/Live Key ID and Key Secret"
echo "   - Update RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend/.env"
echo ""
echo "2. Start the backend server:"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "3. The API will be available at:"
echo "   - Health check: http://localhost:3001/api/health"
echo "   - Create order: http://localhost:3001/api/create-order"
echo "   - Verify payment: http://localhost:3001/api/verify-payment"
echo ""
echo "🎉 Your payment gateway is ready!"
