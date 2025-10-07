import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { XCircle, RefreshCw, Home, ShoppingBag, AlertTriangle } from 'lucide-react';

const PaymentFailure: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const error = location.state?.error || 'Payment failed. Please try again.';
  const orderId = location.state?.orderId;

  const handleRetryPayment = () => {
    // Navigate back to checkout or cart
    navigate('/checkout');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center">
          {/* Error Icon */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-3xl font-playfair font-bold text-[#803716] mb-2">
              Payment Failed
            </h1>
            <p className="text-gray-600">
              We're sorry, but your payment could not be processed at this time.
            </p>
          </div>

          {/* Error Details */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <h3 className="font-lato font-semibold text-red-800 mb-2">
                  What went wrong?
                </h3>
                <p className="font-lato text-red-700 text-sm mb-3">
                  {error}
                </p>
                {orderId && (
                  <p className="font-lato text-red-600 text-xs">
                    Order ID: #{orderId}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Common Solutions */}
          <div className="mb-8">
            <h3 className="text-lg font-playfair font-bold text-[#803716] mb-4">
              What you can do:
            </h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#b66837] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  1
                </div>
                <p className="font-lato text-gray-700">
                  Check that your payment details are correct and try again.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#b66837] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  2
                </div>
                <p className="font-lato text-gray-700">
                  Ensure you have sufficient funds in your account.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#b66837] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  3
                </div>
                <p className="font-lato text-gray-700">
                  Try using a different payment method or card.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#b66837] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                  4
                </div>
                <p className="font-lato text-gray-700">
                  Contact your bank if the issue persists.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleRetryPayment}
              className="bg-[#b66837] hover:bg-[#803716] text-white px-6 py-3 rounded-full font-lato font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
            <button
              onClick={handleGoHome}
              className="bg-white border-2 border-[#b66837] text-[#b66837] hover:bg-[#b66837] hover:text-white px-6 py-3 rounded-full font-lato font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Go Home
            </button>
          </div>

          {/* Support Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Still having trouble? Our support team is here to help.{' '}
              <a href="mailto:support@trueskin.com" className="text-[#b66837] hover:underline font-medium">
                Contact us
              </a>{' '}
              or call{' '}
              <a href="tel:+919876543210" className="text-[#b66837] hover:underline font-medium">
                +91 98765 43210
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
