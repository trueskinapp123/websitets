# Razorpay Payment Gateway Integration

This document explains how to set up and use the Razorpay payment gateway integration in the TrueSkin web application.

## Features

✅ **Complete Payment Integration**
- Razorpay payment gateway integration
- Automatic amount calculation from cart
- Secure payment processing
- Payment verification
- Order management
- Email notifications

✅ **Responsive Design**
- Mobile-first approach
- Responsive checkout form
- Touch-friendly payment buttons
- Optimized for all screen sizes

✅ **User Experience**
- Real-time payment status
- Payment success/failure handling
- Order confirmation pages
- Error handling and user feedback

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id_here
VITE_RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here

# Supabase Configuration (already configured)
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 2. Supabase Edge Functions

You'll need to create the following Supabase Edge Functions for server-side payment processing:

#### Create Razorpay Order Function
```typescript
// supabase/functions/create-razorpay-order/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { amount, currency, receipt, customer_info } = await req.json()
    
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(Deno.env.get('RAZORPAY_KEY_ID') + ':' + Deno.env.get('RAZORPAY_KEY_SECRET'))}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency,
        receipt,
        notes: customer_info
      })
    })

    const order = await response.json()
    
    return new Response(JSON.stringify(order), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
```

#### Verify Payment Function
```typescript
// supabase/functions/verify-payment/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createHmac } from "https://deno.land/std@0.168.0/crypto/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json()
    
    const secret = Deno.env.get('RAZORPAY_KEY_SECRET')
    const generated_signature = await createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .toString('hex')
    
    const isValid = generated_signature === razorpay_signature
    
    return new Response(JSON.stringify({ isValid }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
```

### 3. Database Schema

Ensure your Supabase database has the following tables:

```sql
-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  shipping_address JSONB NOT NULL,
  payment_id TEXT,
  razorpay_order_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Payment Flow

### 1. Checkout Process
1. User fills out checkout form with shipping details
2. System validates form data and cart contents
3. Payment service creates Razorpay order
4. Order is saved to database with 'pending' status
5. Razorpay checkout modal opens with pre-filled customer info

### 2. Payment Processing
1. User completes payment in Razorpay modal
2. Razorpay returns payment response
3. System verifies payment signature
4. Order status updated to 'paid' in database
5. Email confirmation sent to customer
6. Cart is cleared
7. User redirected to success page

### 3. Error Handling
1. Payment failures redirect to failure page
2. Order status updated to 'failed'
3. User can retry payment or contact support
4. Detailed error messages provided

## API Integration

### Payment Service Methods

```typescript
// Process payment
const paymentResponse = await paymentService.processPayment({
  amount: 1000,
  customerInfo: {
    name: 'John Doe',
    email: 'john@example.com',
    contact: '9876543210'
  },
  shippingAddress: {
    street: '123 Main St',
    city: 'Mumbai',
    state: 'Maharashtra',
    zip: '400001'
  },
  cartItems: [...],
  userId: 'user123'
});

// Get payment status
const status = await paymentService.getPaymentStatus(paymentId);

// Get payment history
const history = await paymentService.getPaymentHistory(userId);
```

## Responsive Design Features

### Mobile Optimization
- Touch-friendly payment buttons
- Optimized form layouts for small screens
- Responsive grid system
- Mobile-first CSS approach

### Desktop Enhancement
- Larger payment modals
- Better spacing and typography
- Hover effects and animations
- Multi-column layouts

## Security Features

- ✅ Server-side payment verification
- ✅ Environment variable protection
- ✅ Secure API endpoints
- ✅ Payment signature validation
- ✅ SSL encryption
- ✅ Input validation and sanitization

## Testing

### Test Cards (Razorpay Test Mode)
- **Success**: 4111 1111 1111 1111
- **Failure**: 4000 0000 0000 0002
- **CVV**: Any 3 digits
- **Expiry**: Any future date

### Test Scenarios
1. Successful payment
2. Failed payment
3. Payment cancellation
4. Network errors
5. Invalid form data

## Troubleshooting

### Common Issues

1. **"Razorpay credentials not found"**
   - Check environment variables
   - Ensure .env file is in root directory
   - Restart development server

2. **"Failed to create payment order"**
   - Verify Supabase Edge Functions are deployed
   - Check Razorpay API credentials
   - Ensure network connectivity

3. **Payment verification fails**
   - Check signature generation logic
   - Verify webhook endpoints
   - Ensure proper error handling

### Support

For technical support:
- Email: support@trueskin.com
- Phone: +91 98765 43210

## Production Checklist

Before going live:

- [ ] Replace test Razorpay keys with live keys
- [ ] Update webhook URLs to production domain
- [ ] Test all payment methods
- [ ] Verify email notifications
- [ ] Check SSL certificates
- [ ] Monitor error logs
- [ ] Set up payment analytics
- [ ] Configure backup procedures

## License

This payment integration is part of the TrueSkin web application and follows the same license terms.
