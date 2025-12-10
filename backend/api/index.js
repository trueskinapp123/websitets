// Root endpoint for backend health check
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  res.json({
    status: 'OK',
    message: 'TrueSkin Backend API is running',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      createOrder: '/api/create-order (POST)',
      verifyPayment: '/api/verify-payment (POST)',
      adminOrders: '/api/admin/orders (GET)',
      adminUsers: '/api/admin/users (GET)'
    },
    services: {
      razorpay: !!process.env.RAZORPAY_KEY_ID,
      supabase: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    }
  });
};

