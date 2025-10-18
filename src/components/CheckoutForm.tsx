import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, ShoppingBag, User, CreditCard, MapPin, Mail, Phone, CheckCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import RazorpayPayment from './RazorpayPayment';

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
  const navigate = useNavigate();
  const { state: cartState } = useCart();
  const { user, profile } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isValid, setIsValid] = useState(false);

  // Pre-fill form if user is logged in
  useEffect(() => {
    if (user || profile) {
      setFormData(prev => ({
        ...prev,
        fullName: profile?.full_name || user?.user_metadata?.name || '',
        email: profile?.email || user?.email || '',
        phone: profile?.phone || '',
        street: profile?.address_line1 || '',
        city: profile?.city || '',
        state: profile?.state || '',
        zip: profile?.postal_code || '',
      }));
    }
  }, [user, profile]);

  // Validate form fields
  useEffect(() => {
    const valid = 
      formData.fullName.trim() !== '' &&
      /\S+@\S+\.\S+/.test(formData.email) &&
      /^[0-9]{10}$/.test(formData.phone) &&
      formData.street.trim() !== '' &&
      formData.city.trim() !== '' &&
      formData.state.trim() !== '' &&
      /^[0-9]{5,6}$/.test(formData.zip);
    setIsValid(valid);
  }, [formData]);

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
  };


  console.log('CheckoutForm component rendering');
  console.log('Cart state:', cartState);
  console.log('Auth state:', { user: user?.email, profile: profile?.full_name, isAuthenticated: !!user });

  // Check if cart is empty
  if (cartState.items.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to your cart before checkout</p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-[#306b59] text-white px-6 py-3 rounded-full hover:bg-[#306b59] transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#306b59] hover:text-[#306b59] mb-4 font-lato"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </button>
          <h1 className="text-3xl font-bold text-gray-800 font-lato flex items-center gap-3">
            <ShoppingCart className="h-8 w-8" />
            Checkout
          </h1>
          <p className="text-gray-600 mt-2">Complete your order securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Details Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <User className="h-6 w-6" />
              Customer Details
            </h2>

            <form className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#306b59] focus:border-transparent ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#306b59] focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#306b59] focus:border-transparent ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your 10-digit phone number"
                  maxLength={10}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  This number will be automatically used by Razorpay for payment verification
                </p>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Street Address *
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#306b59] focus:border-transparent ${
                    errors.street ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your street address"
                />
                {errors.street && (
                  <p className="mt-1 text-sm text-red-600">{errors.street}</p>
                )}
              </div>

              {/* City, State, ZIP */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#306b59] focus:border-transparent ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="City"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#306b59] focus:border-transparent ${
                      errors.state ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="State"
                  />
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#306b59] focus:border-transparent ${
                      errors.zip ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="ZIP"
                    maxLength={6}
                  />
                  {errors.zip && (
                    <p className="mt-1 text-sm text-red-600">{errors.zip}</p>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary & Payment */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <ShoppingCart className="h-6 w-6" />
                Order Summary
              </h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartState.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={item.images?.[0] || '/images/placeholder.jpg'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{item.name}</h4>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium text-[#306b59]">₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-semibold text-gray-800">
                  <span>Total:</span>
                  <span className="text-[#306b59]">₹{cartState.total}</span>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <CreditCard className="h-6 w-6" />
                Payment
              </h2>
              
              {!user ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-yellow-800 text-sm">
                    Please sign in to complete your purchase securely.
                  </p>
                  <button
                    onClick={() => navigate('/')}
                    className="mt-2 bg-[#306b59] text-white px-4 py-2 rounded-lg hover:bg-[#306b59] transition-colors text-sm"
                  >
                    Sign In
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-600 mb-4">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">
                      {isValid ? 'All details are valid' : 'Please fill all required details'}
                    </span>
                  </div>
                  
                  <RazorpayPayment
                    amount={cartState.total}
                    orderId={`ORDER_${Date.now()}`}
                    customerEmail={formData.email}
                    customerPhone={formData.phone}
                    customerName={formData.fullName}
                    shippingAddress={{
                      street: formData.street,
                      city: formData.city,
                      state: formData.state,
                      zip: formData.zip
                    }}
                    items={cartState.items.map(item => ({
                      productId: item.id,
                      quantity: item.quantity,
                      price: item.price
                    }))}
                    onSuccess={() => {
                      navigate('/');
                    }}
                    onError={() => {
                      // Error handling is done in RazorpayPayment component
                    }}
                    disabled={!isValid}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;