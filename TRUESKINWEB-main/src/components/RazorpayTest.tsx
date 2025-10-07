import React, { useState } from 'react';
import { razorpayService } from '../services/razorpayService';
import { CreditCard, CheckCircle, XCircle } from 'lucide-react';

const RazorpayTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const testPayment = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      console.log('Testing Razorpay integration...');

      // Test data
      const testAmount = 100; // ₹1
      const testOrderId = `test_order_${Date.now()}`;
      const testCustomer = {
        name: 'Test User',
        email: 'test@example.com',
        contact: '9999999999'
      };

      // Create test order
      const razorpayOrder = await razorpayService.createOrder(testAmount, testOrderId);
      console.log('Test order created:', razorpayOrder);

      // Initialize payment
      await razorpayService.initializePayment(
        razorpayOrder.id,
        testAmount,
        testCustomer,
        (paymentResponse) => {
          console.log('Test payment successful:', paymentResponse);
          setResult({
            success: true,
            message: `Payment successful! Payment ID: ${paymentResponse.razorpay_payment_id}`
          });
          setIsLoading(false);
        },
        (error) => {
          console.error('Test payment failed:', error);
          setResult({
            success: false,
            message: `Payment failed: ${error.message}`
          });
          setIsLoading(false);
        }
      );

    } catch (error) {
      console.error('Test error:', error);
      setResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-[#803716] mb-4 text-center">
        Razorpay Test
      </h2>
      
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Test the Razorpay payment integration with a ₹1 test payment
          </p>
          
          <button
            onClick={testPayment}
            disabled={isLoading}
            className={`w-full px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#b66837] hover:bg-[#803716] text-white transform hover:scale-105'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Testing...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                Test Payment (₹1)
              </>
            )}
          </button>
        </div>

        {result && (
          <div className={`p-4 rounded-lg ${
            result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <p className={`text-sm font-medium ${
                result.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {result.message}
              </p>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Test Card:</strong> 4111 1111 1111 1111</p>
          <p><strong>Expiry:</strong> Any future date</p>
          <p><strong>CVV:</strong> Any 3 digits</p>
        </div>
      </div>
    </div>
  );
};

export default RazorpayTest;
