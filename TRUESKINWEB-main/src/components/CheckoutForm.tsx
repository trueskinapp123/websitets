import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { paymentService } from '../services/paymentService';
import { orderService } from '../services/orderService';
import { CreditCard, MapPin, User, Mail, Phone, ShoppingBag, ArrowLeft, Shield, Clock, CheckCircle } from 'lucide-react';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

const CheckoutForm: React.FC = () => {
  const { state: cartState, clearCart } = useCart();
  const { user, profile, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    fullName: profile?.fullName || '',
    email: user?.email || '',
    phone: profile?.phone || '',
    street: '',
    city: '',
    state: '',
    zip: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [paymentError, setPaymentError] = useState<string>('');
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
    
    // Clear payment error when user makes changes
    if (paymentError) {
      setPaymentError('');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (!formData.street.trim()) {
      newErrors.street = 'Street address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.zip.trim()) {
      newErrors.zip = 'ZIP code is required';
    } else if (!/^\d{6}$/.test(formData.zip)) {
      newErrors.zip = 'ZIP code must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      return;
    }

    if (cartState.items.length === 0) {
      setPaymentError('Your cart is empty!');
      return;
    }

    // Check if user is logged in
    if (!user) {
      setPaymentError('Please log in to place an order.');
      return;
    }

    // Validate payment amount
    if (!paymentService.validatePaymentAmount(cartState.total)) {
      setPaymentError('Invalid payment amount. Please check your cart.');
      return;
    }

    setIsProcessing(true);
    setPaymentError('');

    try {
      // Create order first
      const orderData = {
        userId: user.id,
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
        },
        cartItems: cartState.items,
      };

      const order = await orderService.createOrder(orderData);

      if (!order) {
        setPaymentError('Failed to create order. Please try again.');
        return;
      }

      // Process payment
      const paymentRequest = {
        amount: cartState.total,
        customerInfo: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
        },
        cartItems: cartState.items,
        userId: user.id,
        orderId: order.id,
      };

      const paymentResponse = await paymentService.processPayment(paymentRequest);

      if (paymentResponse.success && paymentResponse.paymentId) {
        // Update order with payment details
        await orderService.updateOrderStatus(order.id, 'paid', paymentResponse.paymentId);

        // Get order items for email
        const orderItems = await orderService.getOrderItems(order.id);

        // Send email notification
        try {
          await orderService.sendOrderConfirmationEmail(order, orderItems);
        } catch (emailError) {
          console.error('Failed to send email notification:', emailError);
          // Don't fail the payment for email errors
        }

        // Clear cart
        await orderService.clearUserCart(user.id);
        await clearCart();

        // Redirect to success page
        navigate('/order-success', { 
          state: { 
            orderId: order.id,
            paymentId: paymentResponse.paymentId,
            totalAmount: cartState.total 
          } 
        });
      } else {
        // Update order status to failed
        await orderService.updateOrderStatus(order.id, 'failed');
        
        const errorMessage = paymentResponse.error || 'Payment failed. Please try again.';
        setPaymentError(errorMessage);
        
        // Redirect to payment failure page after a short delay
        setTimeout(() => {
          navigate('/payment-failure', {
            state: {
              error: errorMessage,
              orderId: order.id
            }
          });
        }, 2000);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setPaymentError('Checkout failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartState.items.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-playfair font-bold text-[#306b59] mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to your cart before checkout.</p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-[#306b59] hover:bg-[#306b59] text-white px-6 py-3 rounded-full font-lato font-semibold transition-all duration-300"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#306b59] hover:text-[#306b59] transition-colors duration-300 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-lato font-medium">Back</span>
          </button>
          <h1 className="text-3xl font-playfair font-bold text-[#306b59]">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your order securely</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Checkout Form */}
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
            <h2 className="text-2xl font-playfair font-bold text-[#306b59] mb-6 flex items-center gap-3">
              <User className="w-6 h-6" />
              Customer Information
            </h2>

            {/* Quick Sign In with Google */}
            {!user && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="font-lato text-blue-800 text-sm mb-3">
                  Already have an account? Sign in quickly with Google to auto-fill your details.
                </p>
                <button
                  onClick={async () => {
                    const { error } = await signInWithGoogle();
                    if (error) {
                      alert('Failed to sign in with Google. Please try again.');
                    }
                  }}
                  className="w-full bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-4 py-3 rounded-lg font-lato font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
              </div>
            )}

            <div className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-lato font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#306b59] focus:border-transparent transition-all duration-300 ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-lato font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#306b59] focus:border-transparent transition-all duration-300 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-lato font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#306b59] focus:border-transparent transition-all duration-300 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <h3 className="text-lg font-playfair font-bold text-[#306b59] mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Shipping Address
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-lato font-semibold text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#306b59] focus:border-transparent transition-all duration-300 ${
                        errors.street ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter street address"
                    />
                    {errors.street && (
                      <p className="text-red-500 text-sm mt-1">{errors.street}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-lato font-semibold text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#306b59] focus:border-transparent transition-all duration-300 ${
                          errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="City"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-lato font-semibold text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#306b59] focus:border-transparent transition-all duration-300 ${
                          errors.state ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="State"
                      />
                      {errors.state && (
                        <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-lato font-semibold text-gray-700 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#306b59] focus:border-transparent transition-all duration-300 ${
                        errors.zip ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="ZIP code"
                    />
                    {errors.zip && (
                      <p className="text-red-500 text-sm mt-1">{errors.zip}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
            <h2 className="text-2xl font-playfair font-bold text-[#306b59] mb-6 flex items-center gap-3">
              <ShoppingBag className="w-6 h-6" />
              Order Summary
            </h2>

            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {cartState.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-lato font-semibold text-[#306b59] text-sm">{item.name}</h3>
                    <p className="font-lato text-xs text-gray-600">{item.count}</p>
                    <p className="font-lato text-xs text-gray-500">
                      Qty: {item.quantity} × ₹{item.price}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-lato font-bold text-[#306b59]">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Total */}
            <div className="border-t border-gray-200 pt-6">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <span className="font-lato text-sm text-gray-600">Subtotal:</span>
                  <span className="font-lato text-sm text-gray-600">₹{cartState.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-lato text-sm text-gray-600">Shipping:</span>
                  <span className="font-lato text-sm text-green-600">FREE</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-lato text-lg font-semibold text-[#306b59]">Total:</span>
                    <span className="font-playfair text-2xl font-bold text-[#306b59]">
                      ₹{cartState.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Error Display */}
              {paymentError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm font-lato">{paymentError}</p>
                </div>
              )}

              {/* Payment Security Info */}
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-lato font-semibold text-green-800 text-sm mb-1">
                      Secure Payment
                    </h4>
                    <p className="text-green-700 text-xs">
                      Your payment is secured with 256-bit SSL encryption and powered by Razorpay.
                    </p>
                  </div>
                </div>
              </div>

              {/* Supported Payment Methods */}
              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => setShowPaymentMethods(!showPaymentMethods)}
                  className="text-xs text-[#306b59] hover:text-[#306b59] font-lato font-medium transition-colors duration-300"
                >
                  {showPaymentMethods ? 'Hide' : 'Show'} supported payment methods
                </button>
                
                {showPaymentMethods && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 font-lato mb-2">
                      We accept:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {paymentService.getSupportedPaymentMethods().map((method) => (
                        <span
                          key={method}
                          className="px-2 py-1 bg-white text-xs text-gray-700 rounded border"
                        >
                          {method.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={isProcessing || paymentService.isPaymentProcessing()}
                className="w-full bg-[#306b59] hover:bg-[#306b59] disabled:bg-gray-400 text-white px-6 py-4 rounded-full font-lato font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:transform-none flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Pay Now - {paymentService.formatAmount(cartState.total)}
                  </>
                )}
              </button>

              {/* Payment Info */}
              <div className="mt-4 text-center">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Shield className="w-3 h-3" />
                  <span>Secure payment powered by Razorpay</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-1">
                  <Clock className="w-3 h-3" />
                  <span>Order will be processed immediately</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
