import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, X, Plus, Minus, Trash2, LogIn } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { scrollToTop } from '../utils/scrollToTop';

const CartIndicator = () => {
  const { state, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [animatingItems, setAnimatingItems] = useState<Set<string>>(new Set());
  const [isClosing, setIsClosing] = useState(false);

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    // Add animation class
    setAnimatingItems(prev => new Set(prev).add(productId));
    
    if (newQuantity <= 0) {
      await removeFromCart(productId);
    } else {
      await updateQuantity(productId, newQuantity);
    }
    
    // Remove animation class after a short delay
    setTimeout(() => {
      setAnimatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }, 200);
  };

  const handleRemoveItem = async (productId: string) => {
    setAnimatingItems(prev => new Set(prev).add(productId));
    await removeFromCart(productId);
    
    // Remove animation class after animation completes
    setTimeout(() => {
      setAnimatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }, 300);
  };

  const handleCloseCart = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsCartOpen(false);
      setIsClosing(false);
    }, 300);
  };

  // Close cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isCartOpen && !isClosing) {
        const target = event.target as HTMLElement;
        if (!target.closest('.cart-sidebar') && !target.closest('.cart-button')) {
          handleCloseCart();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCartOpen, isClosing]);

  return (
    <>
      {/* Cart Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="cart-button relative p-2 text-[#803716] hover:text-[#b66837] transition-all duration-300 transform hover:scale-105"
      >
        <ShoppingCart className="w-6 h-6" />
        {state.itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#e58f5a] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold cart-item-bounce">
            {state.itemCount}
          </span>
        )}
      </button>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300" onClick={handleCloseCart}>
          <div 
            className={`cart-sidebar fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl transform transition-transform duration-300 ${
              isClosing ? 'cart-sidebar-exit' : 'cart-sidebar-enter'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cart Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <h2 className="font-playfair text-xl sm:text-2xl font-bold text-[#803716]">
                Shopping Cart
              </h2>
              <button
                onClick={handleCloseCart}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {!user ? (
                <div className="text-center py-12">
                  <LogIn className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="font-lato text-gray-600 mb-2">Please log in to add items to your cart</p>
                  <p className="font-lato text-sm text-gray-500 mb-6">
                    Sign in to save your cart and access it from any device
                  </p>
                  <button
                    onClick={() => {
                      handleCloseCart();
                      // Trigger auth modal by dispatching custom event
                      window.dispatchEvent(new CustomEvent('openAuthModal'));
                    }}
                    className="inline-block bg-[#b66837] hover:bg-[#803716] text-white px-6 py-3 rounded-full font-lato font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    Sign In
                  </button>
                </div>
              ) : state.items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="font-lato text-gray-500">Your cart is empty</p>
                  <Link
                    to="/shop"
                    onClick={() => {
                      handleCloseCart();
                      scrollToTop();
                    }}
                    className="inline-block mt-4 bg-[#b66837] hover:bg-[#803716] text-white px-6 py-3 rounded-full font-lato font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {state.items.map((item) => (
                    <div 
                      key={item.id} 
                      className={`flex items-center gap-4 p-4 bg-gray-50 rounded-xl transition-all duration-300 ${
                        animatingItems.has(item.id) ? 'cart-item-bounce' : 'cart-item-enter'
                      }`}
                    >
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-lato font-semibold text-[#803716] text-sm">{item.name}</h3>
                        <p className="font-lato text-xs text-gray-600">{item.count}</p>
                        <p className="font-lato font-bold text-[#b66837] text-sm">₹{item.price}</p>
                        <p className="font-lato text-xs text-gray-500">
                          Total: ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110"
                          >
                            <Minus className="w-4 h-4 text-gray-600" />
                          </button>
                          <span className={`font-lato font-semibold text-[#803716] min-w-[2rem] text-center ${
                            animatingItems.has(item.id) ? 'quantity-change' : ''
                          }`}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110"
                          >
                            <Plus className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700 transition-all duration-200 transform hover:scale-110"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {state.items.length > 0 && (
              <div className="border-t border-gray-200 p-4 sm:p-6">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="font-lato text-sm text-gray-600">Subtotal:</span>
                    <span className="font-lato text-sm text-gray-600">₹{state.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-lato text-sm text-gray-600">Shipping:</span>
                    <span className="font-lato text-sm text-green-600">FREE</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-lato text-lg font-semibold text-[#803716]">Total:</span>
                      <span className="font-playfair text-2xl font-bold text-[#b66837]">₹{state.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <Link
                  to="/checkout"
                  onClick={() => {
                    handleCloseCart();
                    scrollToTop();
                  }}
                  className="w-full bg-[#b66837] hover:bg-[#803716] text-white px-6 py-4 rounded-full font-lato font-semibold text-lg transition-all duration-300 transform hover:scale-105 text-center block"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CartIndicator;
