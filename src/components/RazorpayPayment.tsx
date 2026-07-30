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
    country?: string;
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
      const getApiUrl = () => {
        const viteApiUrl = import.meta.env.VITE_API_URL;
        
        if (viteApiUrl) {
          // Clean up URL: remove trailing slash, ensure HTTPS
          let cleanUrl = viteApiUrl.trim().replace(/\/$/, '');
          
          // Warn if using HTTP (should use HTTPS)
          if (cleanUrl.startsWith('http://') && !cleanUrl.includes('localhost')) {
            console.warn('⚠️ Using HTTP instead of HTTPS for backend URL. This may cause CORS/redirect issues.');
          }
          
          // Ensure HTTPS for production
          if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
            cleanUrl = 'https://' + cleanUrl;
          }
          
          return cleanUrl;
        }
        
        // In production without VITE_API_URL, this is an error for separate deployments
        if (import.meta.env.PROD) {
          throw new Error(
            'VITE_API_URL is not set in production! ' +
            'Please set VITE_API_URL environment variable in Vercel pointing to your backend URL. ' +
            'Example: https://your-backend-name.vercel.app'
          );
        }
        
        return 'http://localhost:3001';
      };
      
      let apiUrl: string;
      try {
        apiUrl = getApiUrl();
      } catch (configError: any) {
        console.error('❌ Configuration Error:', configError);
        toast({
          title: "Configuration Error",
          description: configError.message,
          variant: "destructive",
        });
        onError(configError.message);
        return;
      }
      
      // Construct URL properly (avoid double slashes)
      const orderUrl = `${apiUrl}/api/create-order`;
      
      // Debug logging
      console.log('🔍 Payment Debug Info:');
      console.log('- VITE_API_URL (raw):', import.meta.env.VITE_API_URL);
      console.log('- Is Production:', import.meta.env.PROD);
      console.log('- Resolved API URL:', apiUrl);
      console.log('- Full Order URL:', orderUrl);
      
      // Test backend URL first to check for redirects (which break CORS preflight)
      try {
        console.log('🔍 Testing backend URL for redirects...');
        const healthUrl = `${apiUrl}/api/health`;
        const healthResponse = await fetch(healthUrl, {
          method: 'GET',
          redirect: 'manual', // Don't follow redirects automatically
          credentials: 'omit'
        });
        
        // Check if there's a redirect
        if (healthResponse.type === 'opaqueredirect' || healthResponse.status === 0) {
          throw new Error('Backend URL is redirecting. This breaks CORS preflight requests. Please use the final URL (after redirect) in VITE_API_URL.');
        }
        
        // If we get here, the URL is accessible
        console.log('✅ Backend URL is accessible');
      } catch (preCheckError: any) {
        console.error('❌ Backend URL Pre-check Failed:', preCheckError);
        
        // Check for specific redirect error
        if (preCheckError.message && preCheckError.message.includes('redirect')) {
          const viteApiUrl = import.meta.env.VITE_API_URL;
          const errorMsg = `Backend URL is redirecting! This causes CORS errors.\n\n` +
            `Your VITE_API_URL: ${viteApiUrl}\n\n` +
            `🔧 Fix:\n` +
            `1. Open ${viteApiUrl}/api/health in your browser\n` +
            `2. Check if it redirects (look at the final URL in address bar)\n` +
            `3. Use the FINAL URL (after redirect) in VITE_API_URL\n` +
            `4. Make sure it starts with https:// and has NO trailing slash\n` +
            `5. Redeploy frontend after updating`;
          
          toast({
            title: "Backend URL Redirect Error",
            description: errorMsg,
            variant: "destructive",
          });
          
          throw new Error(errorMsg);
        }
        
        // For other errors, continue and let the actual request fail with better error
        console.warn('⚠️ Pre-check failed, but continuing with request...');
      }
      
      let orderResponse;
      try {
        orderResponse = await fetch(orderUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: amount,
            currency: 'INR',
            receipt: generatedOrderId
          }),
          credentials: 'omit'
        });
      } catch (fetchError: any) {
        console.error('❌ Fetch Error Details:', fetchError);
        console.error('- Error Type:', fetchError.name);
        console.error('- Error Message:', fetchError.message);
        console.error('- Network Error:', fetchError instanceof TypeError);
        console.error('- Stack:', fetchError.stack);
        
        // Check for redirect/CORS errors specifically
        const errorMessage = fetchError.message || '';
        const isRedirectError = errorMessage.includes('redirect') || 
                                errorMessage.includes('ERR_INVALID_REDIRECT') ||
                                errorMessage.includes('CORS');
        
        if (isRedirectError || (fetchError instanceof TypeError && fetchError.message === 'Failed to fetch')) {
          const viteApiUrl = import.meta.env.VITE_API_URL;
          
          let helpfulMessage = '';
          
          if (isRedirectError) {
            helpfulMessage = `🚨 CORS/Redirect Error Detected!\n\n` +
              `This usually means your backend URL is redirecting (HTTP→HTTPS or trailing slash).\n\n` +
              `Your VITE_API_URL: ${viteApiUrl || 'NOT SET'}\n\n` +
              `🔧 How to Fix:\n` +
              `1. Open ${viteApiUrl || 'your-backend-url'}/api/health in browser\n` +
              `2. Check the final URL in address bar (after any redirects)\n` +
              `3. Update VITE_API_URL to the FINAL URL\n` +
              `4. Must start with https:// (not http://)\n` +
              `5. Must NOT have trailing slash (e.g., https://backend.com not https://backend.com/)\n` +
              `6. Redeploy frontend after updating`;
          } else {
            helpfulMessage = 'Cannot reach backend server. ';
            
            if (!viteApiUrl) {
              helpfulMessage += 'VITE_API_URL is not set. Please set it in Vercel environment variables pointing to your backend URL.';
            } else {
              helpfulMessage += `Tried to reach: ${orderUrl}\n\nPlease check:\n` +
                `1. Backend is deployed and accessible at: ${viteApiUrl}\n` +
                `2. Test backend: Open ${viteApiUrl}/api/health in browser\n` +
                `3. VITE_API_URL is correct: ${viteApiUrl}\n` +
                `4. Frontend was redeployed after setting VITE_API_URL\n` +
                `5. No CORS issues (backend should have CORS enabled)\n` +
                `6. Backend URL doesn't redirect (use final URL after redirect)`;
            }
          }
          
          console.error('❌ Detailed Error:', helpfulMessage);
          
          toast({
            title: isRedirectError ? "CORS/Redirect Error" : "Connection Error",
            description: helpfulMessage,
            variant: "destructive",
          });
          
          throw new Error(helpfulMessage);
        }
        throw fetchError;
      }

      // Check if response is JSON
      const contentType = orderResponse.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await orderResponse.text();
        console.error('API returned non-JSON response:', text.substring(0, 200));
        throw new Error(`API endpoint returned HTML instead of JSON. Check if the serverless function is deployed correctly. URL: ${orderUrl}`);
      }

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
            const verifyApiUrl = getApiUrl();
            const verifyUrl = `${verifyApiUrl}/api/verify-payment`;
            const verifyResponse = await fetch(verifyUrl, {
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

            // Check if response is JSON
            const verifyContentType = verifyResponse.headers.get('content-type');
            if (!verifyContentType || !verifyContentType.includes('application/json')) {
              const text = await verifyResponse.text();
              console.error('API returned non-JSON response:', text.substring(0, 200));
              throw new Error(`Payment verification API returned HTML instead of JSON. Check if the serverless function is deployed correctly. URL: ${verifyUrl}`);
            }

            const verifyData = await verifyResponse.json();

            if (!verifyData.success) {
              throw new Error(verifyData.error || 'Payment verification failed');
            }

            // Save order to database (works with or without user authentication)
            const { data: { user } } = await supabase.auth.getUser();
            if (!user?.id) {
              throw new Error('Please sign in before placing an order.');
            }
            
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
              userId: user.id,
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
      console.error('❌ Payment Initiation Error:', error);
      
      let errorMessage = "Unable to initiate payment. Please try again.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
        console.error('Error details:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
      }
      
      toast({
        title: "Payment Error",
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