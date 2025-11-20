import { useState } from "react";
import { useToast } from "../hooks/use-toast";
import { supabase } from "../lib/supabase";
import { CreditCard, Loader2 } from "lucide-react";
// Removed unused imports
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
  customerEmail,
  customerPhone,
  customerName,
  shippingAddress,
  items,
  onSuccess,
  onError,
  disabled = false,
}: RazorpayPaymentProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const initiatePayment = async () => {
    setIsProcessing(true);

    try {
      // Check if Razorpay credentials are available
      const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKeyId) {
        throw new Error('Razorpay Key ID not found. Please add VITE_RAZORPAY_KEY_ID to your .env.local file.');
      }

      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) throw new Error("Failed to load Razorpay SDK");

      const generatedOrderId = `order_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Create order via backend API
      const apiUrl = import.meta.env.VITE_API_URL || 
        (import.meta.env.PROD ? '' : 'http://localhost:3001');
      const orderResponse = await fetch(`${apiUrl}/api/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'INR',
          receipt: generatedOrderId
        })
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      const customerInfo = {
        name: customerName || 'Customer',
        email: customerEmail || 'customer@example.com',
        contact: customerPhone || '9999999999',
      };

      // Initialize Razorpay checkout
      const options = {
        key: orderData.keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'TrueSkin',
        description: 'TrueSkin Bio Collagen Face Masks',
        order_id: orderData.order.id,
        handler: async function (response: any) {
          try {
            // Verify payment with backend
            const verifyApiUrl = import.meta.env.VITE_API_URL || 
              (import.meta.env.PROD ? '' : 'http://localhost:3001');
            const verifyResponse = await fetch(`${verifyApiUrl}/api/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyResponse.json();

            if (!verifyData.success) {
              throw new Error(verifyData.error || 'Payment verification failed');
            }

            // Save order to database (works with or without user authentication)
            const { data: { user } } = await supabase.auth.getUser();
            
            // Use orderService to create order properly
            const { orderService } = await import('../services/orderService');
            
            // Map items to CartItem format (minimal required fields)
            const cartItems = items.map(item => ({
              id: item.productId,
              name: `Product ${item.productId}`, // Fallback name
              count: '',
              originalPrice: item.price,
              price: item.price,
              discount: '',
              description: '',
              rating: 0,
              reviews: 0,
              images: [],
              quantity: item.quantity
            }));
            
            const orderData = {
              userId: user?.id || null, // null for guest orders
              customerName,
              customerEmail,
              customerPhone,
              shippingAddress,
              cartItems,
              razorpayOrderId: response.razorpay_order_id
            };

            // Create order in database
            const order = await orderService.createOrder(orderData);
            
            if (!order) {
              throw new Error('Failed to save order to database');
            }

            // Update order status to paid and add payment ID
            await orderService.updateOrderStatus(order.id, 'paid', response.razorpay_payment_id);

            // Get order items for email
            const orderItems = await orderService.getOrderItems(order.id);

            // Clear cart if user is logged in
            if (user) {
              await supabase.from("cart").delete().eq("user_id", user.id);
            }

            // Send confirmation emails using orderService
            const emailData = {
              id: order.id,
              customerName,
              customerEmail,
              customerPhone,
              totalAmount: amount,
              shippingAddress,
              items: orderItems.map(item => ({
                id: item.id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.price
              })),
              createdAt: order.createdAt,
              paymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id
            };

            // Send emails (don't fail if emails fail)
            try {
              await Promise.all([
                sendOrderConfirmationToAdmin(emailData),
                sendOrderConfirmationToCustomer(emailData),
              ]);
            } catch (emailError) {
              console.warn('Email sending failed, but order was saved:', emailError);
            }

            toast({
              title: "Payment Successful 🎉",
              description:
                "Your payment was successful! Confirmation emails have been sent.",
            });

            onSuccess(order.id);
          } catch (error) {
            toast({
              title: "Order Processing Error",
              description:
                "Payment succeeded but there was an issue saving your order. Please contact support.",
              variant: "destructive",
            });
            onError("Order processing failed");
          }
        },
        prefill: {
          name: customerInfo.name,
          email: customerInfo.email,
          contact: customerInfo.contact,
        },
        notes: {
          address: 'TrueSkin Office, India',
        },
        theme: {
          color: '#306b59',
        },
        modal: {
          ondismiss: function () {
            onError('Payment cancelled by user');
          },
        },
        retry: {
          enabled: true,
          max_count: 3,
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      toast({
        title: "Payment Error",
        description:
          error instanceof Error
            ? error.message
            : "Unable to initiate payment. Please try again.",
        variant: "destructive",
      });
      onError("Payment initiation failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={initiatePayment}
      disabled={disabled || isProcessing}
      className="w-full bg-[#306b59] hover:bg-[#3b7a65] disabled:bg-gray-400 text-white px-6 py-4 rounded-full font-lato font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:transform-none flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
    >
      {isProcessing ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Processing Payment...
        </>
      ) : (
        <>
          <CreditCard className="h-5 w-5" />
          Pay Now - ₹{amount}
        </>
      )}
    </button>
  );
};

export default RazorpayPayment;