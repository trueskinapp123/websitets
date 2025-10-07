import { supabase } from '../lib/supabase';
import { createRazorpayOrder, initializeRazorpay, verifyPayment, getPaymentStatus, RazorpayOrder, RazorpayPayment } from '../lib/razorpay';
import { CartItem } from '../contexts/CartContext';
import { orderService } from './orderService';

export interface PaymentRequest {
  amount: number;
  customerInfo: {
    name: string;
    email: string;
    contact: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  cartItems: CartItem[];
  userId?: string;
}

export interface PaymentResponse {
  success: boolean;
  orderId?: string;
  paymentId?: string;
  error?: string;
  redirectUrl?: string;
}

export interface PaymentStatus {
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  paymentId?: string;
  orderId?: string;
  amount?: number;
  method?: string;
  createdAt?: string;
}

class PaymentService {
  private isProcessing = false;

  /**
   * Process payment for the given order
   */
  async processPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    if (this.isProcessing) {
      return {
        success: false,
        error: 'Payment is already being processed. Please wait.'
      };
    }

    this.isProcessing = true;

    try {
      // Generate unique order ID
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Create Razorpay order
      const razorpayOrder = await createRazorpayOrder(
        paymentRequest.amount,
        orderId,
        paymentRequest.customerInfo
      );

      // Create order in database
      const order = await orderService.createOrder({
        userId: paymentRequest.userId || 'guest',
        customerName: paymentRequest.customerInfo.name,
        customerEmail: paymentRequest.customerInfo.email,
        customerPhone: paymentRequest.customerInfo.contact,
        shippingAddress: paymentRequest.shippingAddress,
        cartItems: paymentRequest.cartItems,
        razorpayOrderId: razorpayOrder.id,
      });

      if (!order) {
        throw new Error('Failed to create order in database');
      }

      // Initialize Razorpay payment
      return new Promise((resolve) => {
        initializeRazorpay(
          razorpayOrder,
          paymentRequest.customerInfo,
          async (payment: RazorpayPayment) => {
            try {
              // Verify payment
              const isValid = await verifyPayment(
                razorpayOrder.id,
                payment.id,
                payment.id // In a real implementation, you'd get the signature from Razorpay response
              );

              if (isValid) {
                // Update order status to paid
                const updateSuccess = await orderService.updateOrderStatus(
                  order.id,
                  'paid',
                  payment.id
                );

                if (updateSuccess) {
                  resolve({
                    success: true,
                    orderId: order.id,
                    paymentId: payment.id
                  });
                } else {
                  resolve({
                    success: false,
                    error: 'Failed to update order status'
                  });
                }
              } else {
                // Payment verification failed
                await orderService.updateOrderStatus(order.id, 'failed');
                resolve({
                  success: false,
                  error: 'Payment verification failed'
                });
              }
            } catch (error) {
              console.error('Payment processing error:', error);
              await orderService.updateOrderStatus(order.id, 'failed');
              resolve({
                success: false,
                error: 'Payment processing failed'
              });
            }
          },
          async (error: any) => {
            console.error('Payment failed:', error);
            await orderService.updateOrderStatus(order.id, 'failed');
            resolve({
              success: false,
              error: error.message || 'Payment failed'
            });
          }
        );
      });

    } catch (error) {
      console.error('Payment service error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed'
      };
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Get payment status by payment ID
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentStatus | null> {
    try {
      const paymentData = await getPaymentStatus(paymentId);
      
      if (!paymentData) {
        return null;
      }

      return {
        status: paymentData.status === 'captured' ? 'paid' : 'pending',
        paymentId: paymentData.id,
        amount: paymentData.amount / 100, // Convert from paise to rupees
        method: paymentData.method,
        createdAt: new Date(paymentData.created_at * 1000).toISOString()
      };
    } catch (error) {
      console.error('Error getting payment status:', error);
      return null;
    }
  }

  /**
   * Get order status by order ID
   */
  async getOrderStatus(orderId: string): Promise<PaymentStatus | null> {
    try {
      const order = await orderService.getOrderById(orderId);
      
      if (!order) {
        return null;
      }

      return {
        status: order.status,
        orderId: order.id,
        amount: order.totalAmount,
        createdAt: order.createdAt
      };
    } catch (error) {
      console.error('Error getting order status:', error);
      return null;
    }
  }

  /**
   * Cancel a pending order
   */
  async cancelOrder(orderId: string): Promise<boolean> {
    try {
      const success = await orderService.updateOrderStatus(orderId, 'cancelled');
      return success;
    } catch (error) {
      console.error('Error cancelling order:', error);
      return false;
    }
  }

  /**
   * Refund a payment
   */
  async refundPayment(paymentId: string, amount?: number): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('refund-payment', {
        body: {
          payment_id: paymentId,
          amount: amount ? Math.round(amount * 100) : undefined // Convert to paise if amount specified
        }
      });

      if (error) {
        console.error('Error processing refund:', error);
        return false;
      }

      return data.success;
    } catch (error) {
      console.error('Error processing refund:', error);
      return false;
    }
  }

  /**
   * Get payment history for a user
   */
  async getPaymentHistory(userId: string): Promise<any[]> {
    try {
      const orders = await orderService.getOrders(userId);
      
      return orders.map(order => ({
        orderId: order.id,
        amount: order.totalAmount,
        status: order.status,
        paymentId: order.paymentId,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }));
    } catch (error) {
      console.error('Error getting payment history:', error);
      return [];
    }
  }

  /**
   * Validate payment amount
   */
  validatePaymentAmount(amount: number): boolean {
    // Minimum amount validation (₹1)
    if (amount < 1) {
      return false;
    }

    // Maximum amount validation (₹1,00,000)
    if (amount > 100000) {
      return false;
    }

    return true;
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
   * Get supported payment methods
   */
  getSupportedPaymentMethods(): string[] {
    return [
      'card',
      'netbanking',
      'wallet',
      'upi',
      'emi'
    ];
  }

  /**
   * Check if payment is being processed
   */
  isPaymentProcessing(): boolean {
    return this.isProcessing;
  }
}

export const paymentService = new PaymentService();
