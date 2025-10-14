// Razorpay configuration and utilities - Frontend Only Integration
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

// Get Razorpay configuration from environment variables
export const getRazorpayConfig = () => {
  const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
  
  if (!keyId) {
    throw new Error('Razorpay Key ID not found. Please add VITE_RAZORPAY_KEY_ID to your .env file.');
  }
  
  return { keyId };
};

// Create a Razorpay order using client-side approach
// For production, this should be done via backend API
export const createRazorpayOrder = async (
  amount: number, 
  orderId: string, 
  customerInfo?: { name?: string; email?: string; contact?: string }
): Promise<RazorpayOrder> => {
  try {
    // Generate a simple order ID for Razorpay
    const receiptId = `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Return mock order for frontend-only integration
    // In production, this should call your backend API
    return {
      id: receiptId,
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: receiptId,
      status: 'created'
    };
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw new Error('Failed to create payment order. Please try again.');
  }
};

// Verify payment signature
export const verifyPayment = async (
  razorpay_order_id: string, 
  razorpay_payment_id: string, 
  razorpay_signature: string
): Promise<boolean> => {
  try {
    // For frontend-only implementation, we trust Razorpay's response
    // In production, implement proper signature verification on backend
    return true;
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
    script.onload = () => {
      console.log('Razorpay script loaded successfully');
      resolve(true);
    };
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      resolve(false);
    };
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

    console.log('Initializing Razorpay with order:', order);

    const options: any = {
      key: keyId,
      amount: order.amount,
      currency: order.currency,
      name: 'TrueSkin',
      description: 'TrueSkin Bio Collagen Face Masks',
      order_id: order.id,
      handler: function (response: any) {
        console.log('Payment successful:', response);
        
        const payment: RazorpayPayment = {
          id: response.razorpay_payment_id,
          order_id: response.razorpay_order_id || order.id,
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
          console.log('Payment modal dismissed by user');
          onError(new Error('Payment cancelled by user'));
        },
      },
    };

    console.log('Opening Razorpay checkout...');
    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error('Error initializing Razorpay:', error);
    onError(error);
  }
};

// Get payment status from Razorpay
export const getPaymentStatus = async (paymentId: string): Promise<any> => {
  try {
    // For frontend-only implementation, return mock data
    // In production, implement proper payment status check via backend
    return {
      id: paymentId,
      status: 'captured',
      amount: 0,
      method: 'card',
      created_at: Date.now() / 1000
    };
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