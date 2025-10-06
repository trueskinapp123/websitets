// Razorpay configuration and utilities
export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export interface RazorpayPayment {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  created_at: number;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: {
    address: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

// Get Razorpay configuration from environment variables or use test credentials
export const getRazorpayConfig = () => {
  const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag';
  const keySecret = import.meta.env.VITE_RAZORPAY_KEY_SECRET || 'test_secret_key';
  
  if (!keyId) {
    throw new Error('Razorpay credentials not found. Please check your environment variables.');
  }
  
  return { keyId, keySecret };
};

// Create a Razorpay order using backend API
export const createRazorpayOrder = async (amount: number, orderId: string, customerInfo?: { name?: string; email?: string; contact?: string }): Promise<RazorpayOrder> => {
  try {
    const response = await fetch('http://localhost:3001/api/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency: 'INR',
        receipt: orderId,
        customer_info: customerInfo || {}
      })
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to create order');
    }

    console.log('Created Razorpay order:', data.order);
    return data.order;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw new Error('Failed to create payment order');
  }
};

// Verify payment signature using backend API
export const verifyPayment = async (razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:3001/api/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      })
    });

    const data = await response.json();
    return data.success && data.isValid;
  } catch (error) {
    console.error('Error verifying payment:', error);
    return false;
  }
};

// Load Razorpay script dynamically
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Initialize Razorpay checkout with enhanced configuration
export const initializeRazorpay = async (
  order: RazorpayOrder, 
  customerInfo: { name: string; email: string; contact: string },
  onSuccess: (payment: RazorpayPayment) => void, 
  onError: (error: any) => void
) => {
  try {
    // Load Razorpay script if not already loaded
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      onError(new Error('Failed to load Razorpay checkout script'));
      return;
    }

    const { keyId } = getRazorpayConfig();

    const options: RazorpayOptions = {
      key: keyId,
      amount: order.amount,
      currency: order.currency,
      name: 'TrueSkin',
      description: 'TrueSkin Bio Collagen Face Masks',
      order_id: order.id,
      handler: function (response: any) {
        const payment: RazorpayPayment = {
          id: response.razorpay_payment_id,
          order_id: response.razorpay_order_id,
          amount: order.amount,
          currency: order.currency,
          status: 'captured',
          method: response.razorpay_payment_method || 'card',
          created_at: Date.now(),
        };
        onSuccess(payment);
      },
      prefill: {
        name: customerInfo.name || '',
        email: customerInfo.email || '',
        contact: customerInfo.contact || '',
      },
      notes: {
        address: 'TrueSkin Office, India',
      },
      theme: {
        color: '#b66837',
      },
      modal: {
        ondismiss: function() {
          onError(new Error('Payment cancelled by user'));
        },
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error('Error initializing Razorpay:', error);
    onError(error);
  }
};

// Get payment status from Razorpay using backend API
export const getPaymentStatus = async (paymentId: string): Promise<any> => {
  try {
    const response = await fetch(`http://localhost:3001/api/payment-status/${paymentId}`);
    const data = await response.json();

    if (!data.success) {
      return null;
    }

    return data.payment;
  } catch (error) {
    console.error('Error getting payment status:', error);
    return null;
  }
};

// Declare Razorpay in window object for TypeScript
declare global {
  interface Window {
    Razorpay: any;
  }
}