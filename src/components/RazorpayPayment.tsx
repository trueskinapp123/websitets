import { useState } from "react";
import { useToast } from "../hooks/use-toast";
import { supabase } from "../lib/supabase";
import { CreditCard, Loader2 } from "lucide-react";
import { createRazorpayOrder, initializeRazorpay } from "../lib/razorpay";
import { sendOrderConfirmationToAdmin, sendOrderConfirmationToCustomer } from "../lib/email";

interface RazorpayPaymentProps {
  amount: number;
  orderId: string;
  customerEmail: string;
  customerPhone: string;
  customerName: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RazorpayPayment = ({ 
  amount, 
  orderId, 
  customerEmail,
  customerPhone,
  customerName,
  shippingAddress,
  items,
  onSuccess, 
  onError, 
  disabled = false 
}: RazorpayPaymentProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      // Check if script already exists
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

  const initiatePayment = async () => {
    setIsProcessing(true);
    
    try {
      console.log('Starting payment process...');
      
      // Load Razorpay script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Failed to load Razorpay SDK');
      }

      console.log('Razorpay script loaded successfully');

      // Create a simple order ID for Razorpay
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      console.log('Generated order ID:', orderId);

      // Create Razorpay order using our existing function
      const razorpayOrder = await createRazorpayOrder({
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        receipt: order.id,
      });

      console.log('Razorpay order created:', razorpayOrder);

      // Prepare customer info for Razorpay
      const customerInfo = {
        name: customerName,
        email: customerEmail,
        contact: customerPhone,
      };

      // Prepare order details for email
      const orderDetails = {
        id: orderId,
        customerName,
        customerEmail,
        customerPhone,
        totalAmount: amount,
        shippingAddress,
        items,
        createdAt: new Date().toISOString(),
        paymentId: '', // Will be filled after payment
        razorpayOrderId: razorpayOrder.id,
      };

      // Initialize Razorpay checkout
      await initializeRazorpay(
        razorpayOrder,
        customerInfo,
        async (payment) => {
          console.log('Payment successful:', payment);
          
          try {
            // Create order in database after successful payment
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              try {
                const { error: insertError } = await supabase
                  .from('orders')
                  .insert({
                    id: orderId,
                    user_id: user.id,
                    customer_name: customerName,
                    customer_email: customerEmail,
                    customer_phone: customerPhone,
                    total_amount: amount,
                    status: 'paid',
                    shipping_address: shippingAddress,
                    payment_id: payment.id,
                    razorpay_order_id: payment.order_id,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                  });

                if (insertError) {
                  console.error('Error creating order:', insertError);
                } else {
                  console.log('Order created successfully in database');
                  
                  // Create order items
                  const orderItems = items.map(item => ({
                    order_id: orderId,
                    product_id: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                    created_at: new Date().toISOString(),
                  }));

                  const { error: itemsError } = await supabase
                    .from('order_items')
                    .insert(orderItems);

                  if (itemsError) {
                    console.error('Error creating order items:', itemsError);
                  } else {
                    console.log('Order items created successfully');
                  }
                }
              } catch (error) {
                console.error('Error creating order:', error);
              }
            }

            // Update order details with payment ID
            orderDetails.paymentId = payment.id;

            // Send confirmation emails
            console.log('Sending confirmation emails...');
            
            const [adminEmailSent, customerEmailSent] = await Promise.all([
              sendOrderConfirmationToAdmin(orderDetails),
              sendOrderConfirmationToCustomer(orderDetails)
            ]);

            if (adminEmailSent) {
              console.log('Admin confirmation email sent successfully');
            } else {
              console.warn('Failed to send admin confirmation email');
            }

            if (customerEmailSent) {
              console.log('Customer confirmation email sent successfully');
            } else {
              console.warn('Failed to send customer confirmation email');
            }

            // Clear cart after successful payment
            if (user) {
              const { error: cartError } = await supabase
                .from('cart')
                .delete()
                .eq('user_id', user.id);

              if (cartError) {
                console.warn('Failed to clear cart:', cartError);
              } else {
                console.log('Cart cleared successfully');
              }
            }

            toast({
              title: "Payment Successful!",
              description: "Your payment has been processed successfully. Confirmation emails have been sent.",
            });

            onSuccess(payment.id);

          } catch (error) {
            console.error('Post-payment processing failed:', error);
            const errorMessage = error instanceof Error ? error.message : 'Payment processing failed';
            
            toast({
              title: "Payment Processing Error",
              description: "Payment was successful but there was an error processing your order. Please contact support.",
              variant: "destructive",
            });
            
            onError(errorMessage);
          }
        },
        (error) => {
          console.error('Payment failed:', error);
          const errorMessage = error instanceof Error ? error.message : 'Payment failed';
          
          toast({
            title: "Payment Failed",
            description: errorMessage,
            variant: "destructive",
          });
          
          onError(errorMessage);
        }
      );

    } catch (error) {
      console.error('Payment initiation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment failed to initiate';
      
      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={initiatePayment}
      disabled={disabled || isProcessing}
      className="w-full bg-[#306b59] hover:bg-[#306b59] disabled:bg-gray-400 text-white px-6 py-4 rounded-full font-lato font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:transform-none flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
    >
      {isProcessing ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Processing Payment...
        </>
      ) : (
        <>
          <CreditCard className="h-5 w-5" />
          Pay ₹{amount} with Razorpay
        </>
      )}
    </button>
  );
};

export default RazorpayPayment;
