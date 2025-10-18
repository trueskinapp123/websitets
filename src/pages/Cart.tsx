import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();

  console.log('Cart component rendering');

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <ShoppingCart className="h-8 w-8" />
            Shopping Cart
          </h1>
          <div className="text-center">
            <p className="text-lg text-gray-600 mb-4">Cart page is loading successfully!</p>
            <div className="space-y-4">
              <button 
                onClick={() => alert('Cart test successful!')}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 w-full"
              >
                Test Button
              </button>
              <button 
                onClick={() => navigate('/shop')}
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 w-full"
              >
                Go to Shop
              </button>
              <button 
                onClick={() => navigate('/')}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 w-full"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
