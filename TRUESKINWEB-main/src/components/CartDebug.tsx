import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const CartDebug: React.FC = () => {
  const { state: cartState } = useCart();
  const { user } = useAuth();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const handleClearLocalStorage = () => {
    localStorage.removeItem('guestCart');
    console.log('Cleared guest cart from localStorage');
  };

  const handleLogCartState = () => {
    console.log('Current cart state:', {
      userId: cartState.userId,
      items: cartState.items,
      total: cartState.total,
      itemCount: cartState.itemCount,
      user: user?.id,
      localStorage: localStorage.getItem('guestCart')
    });
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-xs z-50">
      <h3 className="font-bold mb-2">Cart Debug</h3>
      <div className="space-y-1">
        <div>User ID: {user?.id || 'Guest'}</div>
        <div>Cart User ID: {cartState.userId || 'None'}</div>
        <div>Items: {cartState.itemCount}</div>
        <div>Total: ₹{cartState.total}</div>
        <div>Loading: {cartState.isLoading ? 'Yes' : 'No'}</div>
        <div>LocalStorage: {localStorage.getItem('guestCart') ? 'Has Data' : 'Empty'}</div>
      </div>
      <div className="mt-2 space-x-2">
        <button
          onClick={handleLogCartState}
          className="bg-blue-600 px-2 py-1 rounded text-xs"
        >
          Log State
        </button>
        <button
          onClick={handleClearLocalStorage}
          className="bg-red-600 px-2 py-1 rounded text-xs"
        >
          Clear Local
        </button>
      </div>
    </div>
  );
};

export default CartDebug;
