import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ShoppingCart, Star, LogIn, Check } from 'lucide-react';
import { Product, useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart, state } = useCart();
  const { user } = useAuth();
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen || !product) return null;

  const handleAddToCart = async () => {
    if (!user) {
      setShowLoginMessage(true);
      setTimeout(() => setShowLoginMessage(false), 3000);
      return;
    }

    setIsAdding(true);
    try {
      const success = await addToCart(product);
      if (success) {
        // Brief visual feedback
        setTimeout(() => setIsAdding(false), 300);
      } else {
        setIsAdding(false);
        console.error('Failed to add product to cart');
      }
    } catch (error) {
      setIsAdding(false);
      console.error('Error adding to cart:', error);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="font-playfair text-2xl font-bold text-[#803716]">
            {product.name}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row">
          {/* Image Section */}
          <div className="lg:w-1/2 p-6">
            <div className="relative">
              <img
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="w-full h-80 object-cover rounded-xl"
              />
              
              {/* Image Navigation */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200"
                  >
                    <ChevronLeft className="w-5 h-5 text-[#803716]" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200"
                  >
                    <ChevronRight className="w-5 h-5 text-[#803716]" />
                  </button>
                </>
              )}

              {/* Image Indicators */}
              {product.images.length > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        index === currentImageIndex
                          ? 'bg-[#e58f5a]'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:w-1/2 p-6 flex flex-col justify-between">
            <div>
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'text-[#e58f5a] fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-lato text-sm text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Description */}
              <p className="font-lato text-gray-700 mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Pack Details */}
              <div className="bg-gradient-to-br from-[#e58f5a]/10 to-[#b66837]/10 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-playfair text-lg font-bold text-[#803716]">
                      {product.count}
                    </h4>
                    <p className="font-lato text-sm text-[#b66837]">
                      ₹{Math.round(product.price / parseInt(product.count))} per mask
                    </p>
                  </div>
                  {product.popular && (
                    <span className="bg-[#e58f5a] text-white px-3 py-1 rounded-full font-lato font-semibold text-xs">
                      Most Popular
                    </span>
                  )}
                </div>
              </div>

              {/* Pricing */}
              <div className="flex items-center gap-4 mb-6">
                <span className="font-playfair text-3xl font-bold text-[#803716]">
                  ₹{product.price}
                </span>
                <span className="font-lato text-lg text-gray-500 line-through">
                  ₹{product.originalPrice}
                </span>
                <span className="bg-[#b66837] text-white px-3 py-1 rounded-full font-lato font-semibold text-sm">
                  {product.discount}
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="space-y-3">
              {showLoginMessage && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                  <LogIn className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                  <p className="font-lato text-amber-800 text-sm mb-2">
                    Please log in to add items to your cart
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      // Trigger auth modal by dispatching custom event
                      window.dispatchEvent(new CustomEvent('openAuthModal'));
                    }}
                    className="bg-[#b66837] hover:bg-[#803716] text-white px-4 py-2 rounded-full font-lato font-semibold text-sm transition-all duration-300"
                  >
                    Sign In Now
                  </button>
                </div>
              )}
              
              {state.showAddedMessage && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center animate-pulse">
                  <div className="flex items-center justify-center gap-2">
                    <Check className="w-5 h-5 text-green-600 animate-bounce" />
                    <p className="font-lato text-green-800 text-sm">
                      Added to cart successfully!
                    </p>
                  </div>
                </div>
              )}
              
              <button
                onClick={handleAddToCart}
                disabled={isAdding || !user}
                className={`w-full ${
                  user && !isAdding
                    ? 'bg-[#b66837] hover:bg-[#803716] transform hover:scale-105 hover:shadow-lg' 
                    : isAdding
                    ? 'bg-[#e58f5a]'
                    : 'bg-gray-400 cursor-not-allowed'
                } text-white px-6 py-4 rounded-full font-lato font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 group`}
              >
                {isAdding ? (
                  <>
                    <LoadingSpinner size="sm" color="#ffffff" />
                    Adding...
                  </>
                ) : state.showAddedMessage ? (
                  <>
                    <Check className="w-5 h-5 animate-bounce" />
                    Added!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 group-hover:animate-bounce" />
                    {user ? 'Add to Cart' : 'Sign In Required'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
