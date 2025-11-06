const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const path = require('path');
const { Resend } = require('resend');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// -------------------- MIDDLEWARE --------------------
// CORS Configuration - Allow requests from frontend domains
const allowedOrigins = [
  'https://trueskinapp.vercel.app',
  'https://trueskin.app',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or curl requests)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Log the blocked origin for debugging
      console.log('⚠️ CORS: Blocked origin:', origin);
      console.log('⚠️ CORS: Allowed origins:', allowedOrigins);
      // For production, you might want to be more strict:
      // callback(new Error('Not allowed by CORS'));
      // For now, allow it to debug:
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400, // 24 hours - cache preflight requests
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

app.use(express.json());

// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin || 'none'}`);
  next();
});

// -------------------- RAZORPAY INIT --------------------
// Initialize Razorpay only if credentials are available
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  try {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log('✅ Razorpay initialized successfully');
  } catch (error) {
    console.warn('⚠️ Razorpay initialization failed:', error.message);
  }
} else {
  console.warn('⚠️ Razorpay credentials not found. Payment features will be disabled.');
}

// -------------------- RESEND EMAIL INIT --------------------
const resend = new Resend(process.env.RESEND_API_KEY || 're_LzohxFUg_MEqroxVFQ5F1CmDgEWvtkJzi');
const ADMIN_EMAIL = 'amaamafatima67@gmail.com';

// -------------------- HEALTH CHECK --------------------
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'TrueSkin Backend is running' });
});

// -------------------- CREATE ORDER --------------------
app.post('/api/create-order', async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        error: 'Payment service not configured. Please contact support.'
      });
    }

    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid amount' });
    }

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1
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
      },
      keyId: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create order'
    });
  }
});

// -------------------- VERIFY PAYMENT --------------------
app.post('/api/verify-payment', async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        error: 'Payment service not configured. Please contact support.'
      });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing payment verification data'
      });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      res.json({
        success: true,
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id
      });
    } else {
      res.status(400).json({ success: false, error: 'Payment verification failed' });
    }

  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Payment verification failed'
    });
  }
});

// -------------------- GET PAYMENT DETAILS --------------------
app.get('/api/payment/:paymentId', async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        error: 'Payment service not configured. Please contact support.'
      });
    }

    const { paymentId } = req.params;
    const payment = await razorpay.payments.fetch(paymentId);

    res.json({
      success: true,
      payment: {
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        method: payment.method,
        created_at: payment.created_at
      }
    });

  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch payment details'
    });
  }
});

// -------------------- EMAIL ENDPOINTS --------------------
// Send contact form email
app.post('/api/send-contact-email', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Email to admin
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #b66837 0%, #803716 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .contact-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
          .detail-label { font-weight: bold; color: #803716; min-width: 120px; }
          .detail-value { color: #333; flex: 1; }
          .message-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #b66837; }
          .message-text { color: #333; line-height: 1.8; white-space: pre-wrap; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">📧 New Contact Form Query</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">From: ${name}</p>
          </div>
          <div class="content">
            <div class="contact-details">
              <h2 style="color: #803716; margin-top: 0;">👤 Contact Information</h2>
              <div class="detail-row">
                <span class="detail-label">Name:</span>
                <span class="detail-value">${name}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value"><a href="mailto:${email}">${email}</a></span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Subject:</span>
                <span class="detail-value">${subject}</span>
              </div>
            </div>
            <div class="message-box">
              <h2 style="color: #803716; margin-top: 0;">💬 Message</h2>
              <div class="message-text">${message.replace(/\n/g, '<br>')}</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Email to customer (confirmation)
    const customerEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #b66837 0%, #803716 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .success { background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">✅ Message Received!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Thank you for contacting TrueSkin</p>
          </div>
          <div class="content">
            <div class="success">
              <strong>Hello ${name},</strong><br>
              We've received your message and will get back to you as soon as possible!
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Check if Resend is initialized
    if (!resend) {
      console.error('❌ Resend client not initialized');
      return res.status(500).json({
        success: false,
        error: 'Email service not configured',
        details: { message: 'Resend API client not initialized' }
      });
    }

    // Send both emails
    console.log('Attempting to send emails...', {
      adminEmail: ADMIN_EMAIL,
      customerEmail: email,
      hasResendClient: !!resend,
      apiKeyConfigured: !!process.env.RESEND_API_KEY
    });

    let adminResult, customerResult;
    try {
      [adminResult, customerResult] = await Promise.all([
        resend.emails.send({
          from: 'TrueSkin Contact <onboarding@resend.dev>',
          to: ADMIN_EMAIL,
          subject: `📧 Contact Form Query: ${subject} - From ${name}`,
          html: adminEmailHtml,
          replyTo: email,
        }),
        resend.emails.send({
          from: 'TrueSkin Contact <onboarding@resend.dev>',
          to: email,
          subject: `We've received your message: ${subject}`,
          html: customerEmailHtml,
        })
      ]);
    } catch (sendError) {
      console.error('❌ Error during email send:', sendError);
      return res.status(500).json({
        success: false,
        error: 'Failed to send email',
        details: {
          message: sendError.message,
          name: sendError.name,
          stack: sendError.stack
        }
      });
    }

    console.log('Email send results:', {
      adminResult: adminResult.error ? { error: adminResult.error } : { success: true, id: adminResult.data?.id },
      customerResult: customerResult.error ? { error: customerResult.error } : { success: true, id: customerResult.data?.id }
    });

    if (adminResult.error || customerResult.error) {
      const errorDetails = {
        adminError: adminResult.error,
        customerError: customerResult.error
      };
      console.error('❌ Email sending errors:', JSON.stringify(errorDetails, null, 2));
      return res.status(500).json({
        success: false,
        error: 'Failed to send email',
        details: errorDetails
      });
    }

    console.log('✅ Emails sent successfully');
    res.json({
      success: true,
      message: 'Emails sent successfully'
    });

  } catch (error) {
    console.error('❌ Error sending contact email:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send email',
      details: {
        message: error.message,
        stack: error.stack,
        name: error.name
      }
    });
  }
});

// Send order confirmation emails
app.post('/api/send-order-email', async (req, res) => {
  try {
    const orderData = req.body;

    if (!orderData || !orderData.customerEmail || !orderData.items) {
      return res.status(400).json({
        success: false,
        error: 'Invalid order data'
      });
    }

    // Format order items
    const itemsHtml = orderData.items.map((item, index) => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 12px; text-align: left;">${index + 1}</td>
        <td style="padding: 12px; text-align: left;">${item.productId}</td>
        <td style="padding: 12px; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; text-align: right;">₹${item.price.toFixed(2)}</td>
        <td style="padding: 12px; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    // Admin email HTML (simplified for brevity - you can expand this)
    const adminEmailHtml = `
      <h1>🎉 New Order Received!</h1>
      <p>Order #${orderData.id.slice(0, 8).toUpperCase()}</p>
      <p>Customer: ${orderData.customerName} (${orderData.customerEmail})</p>
      <p>Total: ₹${orderData.totalAmount.toFixed(2)}</p>
    `;

    // Customer email HTML (simplified)
    const customerEmailHtml = `
      <h1>✨ Order Confirmed!</h1>
      <p>Thank you for your order, ${orderData.customerName}!</p>
      <p>Order ID: ${orderData.id}</p>
      <p>Total: ₹${orderData.totalAmount.toFixed(2)}</p>
    `;

    // Send emails
    const [adminResult, customerResult] = await Promise.all([
      resend.emails.send({
        from: 'TrueSkin Orders <onboarding@resend.dev>',
        to: ADMIN_EMAIL,
        subject: `🎉 New Order #${orderData.id.slice(0, 8).toUpperCase()} - ₹${orderData.totalAmount.toFixed(2)}`,
        html: adminEmailHtml,
      }),
      resend.emails.send({
        from: 'TrueSkin Orders <onboarding@resend.dev>',
        to: orderData.customerEmail,
        subject: `Order Confirmation #${orderData.id.slice(0, 8).toUpperCase()} - TrueSkin`,
        html: customerEmailHtml,
      })
    ]);

    if (adminResult.error || customerResult.error) {
      console.error('Order email errors:', { adminResult, customerResult });
      return res.status(500).json({
        success: false,
        error: 'Failed to send order emails'
      });
    }

    res.json({
      success: true,
      message: 'Order emails sent successfully'
    });

  } catch (error) {
    console.error('Error sending order email:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send order email'
    });
  }
});

// -------------------- SERVE FRONTEND (dist) --------------------
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Serve index.html for all non-API routes (SPA support)
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(distPath, 'index.html'));
  } else {
    res.status(404).json({ success: false, error: 'API route not found' });
  }
});

// -------------------- START SERVER --------------------
app.listen(PORT, () => {
  console.log(`🚀 TrueSkin Backend running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`💳 Razorpay: ${razorpay ? '✅ Configured' : '❌ Not configured (payment features disabled)'}`);
  console.log(`📧 Email Service: ${resend ? '✅ Ready' : '❌ Not configured'}`);
  console.log(`🪶 Serving frontend from: ${distPath}`);
});

module.exports = app;
