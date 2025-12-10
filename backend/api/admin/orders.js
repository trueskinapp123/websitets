const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-admin-email, x-admin-token'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  // Admin authentication
  const adminToken = req.headers['x-admin-token'];
  const adminEmail = req.headers['x-admin-email'];
  
  if (adminEmail !== 'ceo@trueskin.app' || adminToken !== 'admin_authenticated') {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(503).json({
      success: false,
      error: 'Supabase service role key not configured. Please set SUPABASE_SERVICE_ROLE_KEY in your environment variables.'
    });
  }

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Fetch all orders
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
      return res.status(500).json({
        success: false,
        error: ordersError.message || 'Failed to fetch orders'
      });
    }

    // Fetch order items for each order
    const ordersWithItems = await Promise.all(
      (ordersData || []).map(async (order) => {
        const { data: itemsData } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', order.id);

        // Parse shipping_address if it's a string
        let shippingAddress = order.shipping_address;
        if (typeof shippingAddress === 'string') {
          try {
            shippingAddress = JSON.parse(shippingAddress);
          } catch (e) {
            console.warn('Failed to parse shipping_address:', e);
            shippingAddress = { street: '', city: '', state: '', zip: '' };
          }
        }

        return {
          id: order.id,
          userId: order.user_id,
          customerName: order.customer_name,
          customerEmail: order.customer_email,
          customerPhone: order.customer_phone,
          totalAmount: parseFloat(order.total_amount),
          status: order.status,
          shippingAddress: shippingAddress,
          paymentId: order.payment_id,
          razorpayOrderId: order.razorpay_order_id,
          createdAt: order.created_at,
          updatedAt: order.updated_at,
          items: (itemsData || []).map(item => ({
            id: item.id,
            orderId: item.order_id,
            productId: item.product_id,
            quantity: item.quantity,
            price: parseFloat(item.price),
            createdAt: item.created_at
          }))
        };
      })
    );

    res.json({
      success: true,
      data: ordersWithItems
    });
  } catch (error) {
    console.error('Error in admin orders endpoint:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch orders'
    });
  }
};

