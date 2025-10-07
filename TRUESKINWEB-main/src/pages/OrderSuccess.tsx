import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ShoppingBag, Home, Package, CreditCard, Mail, Phone } from 'lucide-react';
import { paymentService } from '../services/paymentService';

const OrderSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const orderId = location.state?.orderId;
  const paymentId = location.state?.paymentId;
  const totalAmount = location.state?.totalAmount;

  if (!orderId) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-playfair font-bold text-[#306b59] mb-4">Order Not Found</h2>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-[#306b59] hover:bg-[#306b59] text-white px-6 py-3 rounded-full font-lato font-semibold transition-all duration-300"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-playfair font-bold text-[#306b59] mb-2">
              Order Placed Successfully!
            </h1>
            <p className="text-gray-600">
              Thank you for your purchase. Your order has been confirmed and payment received.
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mb-8">
            <h2 className="text-xl font-playfair font-bold text-[#306b59] mb-4 flex items-center justify-center gap-2">
              <Package className="w-5 h-5" />
              Order Details
            </h2>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                <span className="font-lato text-gray-600">Order ID:</span>
                <span className="font-lato font-semibold text-[#306b59] text-sm sm:text-base">#{orderId}</span>
              </div>
              {paymentId && (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <span className="font-lato text-gray-600">Payment ID:</span>
                  <span className="font-lato font-semibold text-[#306b59] text-sm sm:text-base">#{paymentId.slice(0, 12)}...</span>
                </div>
              )}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                <span className="font-lato text-gray-600">Total Amount:</span>
                <span className="font-lato font-bold text-[#306b59] text-lg">{paymentService.formatAmount(totalAmount || 0)}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                <span className="font-lato text-gray-600">Payment Status:</span>
                <span className="font-lato font-semibold text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Paid Successfully
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                <span className="font-lato text-gray-600">Payment Method:</span>
                <span className="font-lato font-semibold text-gray-700 flex items-center gap-1">
                  <CreditCard className="w-4 h-4" />
                  Razorpay
                </span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mb-8">
            <h3 className="text-lg font-playfair font-bold text-[#306b59] mb-4">What's Next?</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#306b59] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  1
                </div>
                <p className="font-lato text-gray-700">
                  You'll receive an order confirmation email shortly with all the details.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#306b59] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  2
                </div>
                <p className="font-lato text-gray-700">
                  Our team will process your order and prepare it for shipping.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#306b59] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  3
                </div>
                <p className="font-lato text-gray-700">
                  You'll receive tracking information once your order ships.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/')}
              className="bg-[#306b59] hover:bg-[#306b59] text-white px-6 py-3 rounded-full font-lato font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Continue Shopping
            </button>
            <button
              onClick={() => navigate('/orders')}
              className="bg-white border-2 border-[#306b59] text-[#306b59] hover:bg-[#306b59] hover:text-white px-6 py-3 rounded-full font-lato font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              View Orders
            </button>
          </div>

          {/* Support Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>Need help? Contact us at</span>
                <a href="mailto:support@trueskin.com" className="text-[#306b59] hover:underline font-medium">
                  support@trueskin.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>or call</span>
                <a href="tel:+919876543210" className="text-[#306b59] hover:underline font-medium">
                  +91 98765 43210
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
