// Simplified Razorpay integration for frontend
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

// Load Razorpay script dynamically
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
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

// Create a simple order ID for testing
export const generateOrderId = (): string => {
  return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Initialize Razorpay checkout
export const initializeRazorpay = async (
  orderId: string,
  amount: number,
  customerInfo: { name: string; email: string; contact: string },
  onSuccess: (payment: any) => void,
  onError: (error: any) => void
) => {
  try {
    // Load Razorpay script if not already loaded
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      onError(new Error('Failed to load Razorpay checkout script'));
      return;
    }

    // Get Razorpay key from environment (you'll need to set this)
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag';
    
    console.log('Using Razorpay Key:', razorpayKey);
    
    const options: RazorpayOptions = {
      key: razorpayKey,
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      name: 'TrueSkin',
      description: 'TrueSkin Bio Collagen Face Masks',
      order_id: orderId,
      handler: function (response: any) {
        console.log('Payment successful:', response);
        onSuccess(response);
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
          console.log('Payment cancelled by user');
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

// Declare Razorpay in window object for TypeScript
declare global {
  interface Window {
    Razorpay: any;
  }
}
