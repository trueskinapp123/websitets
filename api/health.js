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

  res.json({
    status: 'OK',
    message: 'TrueSkin Backend API is running',
    timestamp: new Date().toISOString(),
    services: {
      razorpay: !!process.env.RAZORPAY_KEY_ID,
      supabase: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    }
  });
};

