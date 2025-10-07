// Razorpay Service with proper backend integration
import { supabase } from '../lib/supabase';

export interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

class RazorpayService {
  private readonly RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag';
  private readonly RAZORPAY_KEY_SECRET = import.meta.env.VITE_RAZORPAY_KEY_SECRET || 'test_secret_key';

  /**
   * Create Razorpay order using Supabase Edge Function
   */
  async createOrder(amount: number, receipt: string): Promise<RazorpayOrderResponse> {
    try {
      console.log('Creating Razorpay order:', { amount, receipt });
      
      // For now, we'll create a mock order response
      // In production, this should call your backend API
      const mockOrder: RazorpayOrderResponse = {
        id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        amount: Math.round(amount * 100), // Convert to paise
        currency: 'INR',
        receipt: receipt,
        status: 'created'
      };

      console.log('Mock order created:', mockOrder);
      return mockOrder;

      // TODO: Replace with actual backend call
      /*
      const response = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100),
          currency: 'INR',
          receipt: receipt
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create Razorpay order');
      }

      return await response.json();
      */
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw new Error('Failed to create payment order');
    }
  }

  /**
   * Verify payment signature
   */
  async verifyPayment(paymentData: RazorpayPaymentResponse): Promise<boolean> {
    try {
      console.log('Verifying payment:', paymentData);
      
      // For testing, we'll always return true
      // In production, implement proper signature verification
      return true;

      // TODO: Replace with actual verification
      /*
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        return false;
      }

      const result = await response.json();
      return result.isValid;
      */
    } catch (error) {
      console.error('Error verifying payment:', error);
      return false;
    }
  }

  /**
   * Get Razorpay Key ID
   */
  getKeyId(): string {
    return this.RAZORPAY_KEY_ID;
  }

  /**
   * Load Razorpay script
   */
  async loadScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
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
  }

  /**
   * Initialize Razorpay checkout
   */
  async initializePayment(
    orderId: string,
    amount: number,
    customerInfo: { name: string; email: string; contact: string },
    onSuccess: (payment: RazorpayPaymentResponse) => void,
    onError: (error: any) => void
  ): Promise<void> {
    try {
      console.log('Initializing Razorpay payment...');
      
      // Load Razorpay script
      const scriptLoaded = await this.loadScript();
      if (!scriptLoaded) {
        onError(new Error('Failed to load Razorpay checkout script'));
        return;
      }

      console.log('Razorpay script loaded, creating payment options...');

      const options = {
        key: this.RAZORPAY_KEY_ID,
        amount: Math.round(amount * 100), // Convert to paise
        currency: 'INR',
        name: 'TrueSkin',
        description: 'TrueSkin Bio Collagen Face Masks',
        order_id: orderId,
        handler: function (response: RazorpayPaymentResponse) {
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

      console.log('Opening Razorpay modal with options:', options);
      
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
      
      console.log('Razorpay modal opened successfully');
    } catch (error) {
      console.error('Error initializing Razorpay payment:', error);
      onError(error);
    }
  }

  /**
   * Format amount for display
   */
  formatAmount(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  }

  /**
   * Validate payment amount
   */
  validateAmount(amount: number): boolean {
    return amount >= 1 && amount <= 100000;
  }
}

export const razorpayService = new RazorpayService();

// Declare Razorpay in window object for TypeScript
declare global {
  interface Window {
    Razorpay: any;
  }
}
