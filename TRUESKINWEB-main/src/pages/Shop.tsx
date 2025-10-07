import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, CheckCircle, AlertCircle } from 'lucide-react';
import ProductModal from '../components/ProductModal';
import Navigation from '../components/Navigation';
import ProductSkeletonGrid from '../components/ProductSkeleton';
import OptimizedImage from '../components/OptimizedImage';
import { Product, useCart } from '../contexts/CartContext';
import { useProducts } from '../hooks/useProducts';

const Shop = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart, state } = useCart();

  // Use React Query for optimized product fetching
  const { data: products = [], isLoading, error, refetch } = useProducts();

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleAddToCart = async (product: Product) => {
    const success = await addToCart(product);
    if (success) {
      console.log('Product added to cart successfully');
    } else {
      console.log('Failed to add product to cart');
    }
  };

  const howToUseSteps = [
    {
      step: "1",
      title: "Cleanse Your Face",
      description: "Start with a clean, dry face. Remove all makeup and gently cleanse your skin with your favorite cleanser.",
      icon: "🧼"
    },
    {
      step: "2", 
      title: "Open the Mask",
      description: "Carefully open the TrueSkin mask package. The mask is pre-soaked in premium collagen serum.",
      icon: "📦"
    },
    {
      step: "3",
      title: "Apply the Mask",
      description: "Gently unfold the mask and place it on your face, ensuring it covers your entire face comfortably.",
      icon: "🎭"
    },
    {
      step: "4",
      title: "Relax & Wait",
      description: "Leave the mask on for 15-20 minutes while you relax. Feel the collagen working its magic.",
      icon: "😌"
    },
    {
      step: "5",
      title: "Remove & Massage",
      description: "Gently remove the mask and massage any remaining serum into your skin for maximum absorption.",
      icon: "💆‍♀️"
    },
    {
      step: "6",
      title: "Enjoy Your Glow",
      description: "Wake up to radiant, hydrated skin that glows for up to 7 days. Repeat 2-3 times per week for best results.",
      icon: "✨"
    }
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Navigation */}
      <div className="bg-white shadow-sm">
        <Navigation />
      </div>

      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-stone-100 to-amber-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <h1 className="font-playfair text-5xl lg:text-6xl font-bold text-[#803716] mb-6">
            Shop TrueSkin
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#e58f5a] to-[#b66837] rounded-full mx-auto mb-6"></div>
          <p className="font-lato text-xl text-[#874c2b] max-w-2xl mx-auto">
            Discover our premium collagen face masks and find the perfect pack for your skincare journey
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {isLoading ? (
            <ProductSkeletonGrid count={6} />
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h2 className="font-playfair text-2xl font-bold text-[#803716] mb-4">
                Failed to Load Products
              </h2>
              <p className="font-lato text-gray-600 mb-8">
                We're having trouble loading our products. Please try again.
              </p>
              <button
                onClick={() => refetch()}
                className="bg-[#e58f5a] hover:bg-[#b66837] text-white px-8 py-3 rounded-full font-lato font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Try Again
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="font-playfair text-2xl font-bold text-[#803716] mb-4">
                No Products Available
              </h2>
              <p className="font-lato text-gray-600">
                We're currently updating our product catalog. Please check back soon.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02] overflow-hidden border-2 cursor-pointer"
              >
                {product.popular && (
                  <div className="absolute top-4 left-4 bg-[#e58f5a] text-white px-4 py-2 rounded-full font-lato font-semibold text-sm z-10">
                    Most Popular
                  </div>
                )}
                
                {/* Discount Badge */}
                <div className="absolute top-4 right-4 bg-[#b66837] text-white px-3 py-1 rounded-full font-lato font-semibold text-xs">
                  {product.discount}
                </div>

                {/* Product Image */}
                <div className="relative h-64 overflow-hidden">
                  <OptimizedImage
                    src={product.images[0] || '/images/placeholder.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    fallbackSrc="/images/placeholder.jpg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                <div className="p-6">
                  <h3 className="font-playfair text-2xl font-bold text-[#803716] mb-2">
                    {product.name}
                  </h3>
                  <p className="font-lato text-sm text-[#b66837] font-medium mb-3">
                    {product.count}
                  </p>
                  
                  <p className="font-lato text-gray-600 mb-4 line-clamp-3">
                    {product.description}
                  </p>
                  
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

                  {/* Pricing */}
                  <div className="flex items-center gap-3 mb-6">
                    <span className="font-playfair text-2xl font-bold text-[#803716]">
                      ₹{product.price}
                    </span>
                    <span className="font-lato text-sm text-gray-500 line-through">
                      ₹{product.originalPrice}
                    </span>
                    <span className="font-lato text-xs text-[#b66837] font-medium">
                      ₹{Math.round(product.price / parseInt(product.count))} per mask
                    </span>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleProductClick(product)}
                      className="flex-1 bg-[#e58f5a] hover:bg-[#b66837] text-white px-4 py-3 rounded-full font-lato font-semibold text-sm transition-all duration-300 transform hover:scale-105"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-[#b66837] hover:bg-[#803716] text-white px-4 py-3 rounded-full font-lato font-semibold text-sm transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            </div>
          )}
        </div>
      </section>

      {/* How to Use Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-stone-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-[#803716] mb-6">
              How to Use
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#e58f5a] to-[#b66837] rounded-full mx-auto mb-6"></div>
            <p className="font-lato text-xl text-[#874c2b] max-w-2xl mx-auto">
              Follow these simple steps to get the most out of your TrueSkin experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {howToUseSteps.map((step, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105"
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#e58f5a] to-[#b66837] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <span className="text-2xl">{step.icon}</span>
                  </div>
                  <div className="w-8 h-8 mx-auto bg-[#e58f5a] text-white rounded-full flex items-center justify-center font-playfair font-bold text-sm mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-playfair text-xl font-bold text-[#803716] mb-4">
                    {step.title}
                  </h3>
                  <p className="font-lato text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Tips */}
          <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="font-playfair text-2xl font-bold text-[#803716] mb-6 text-center">
              Pro Tips for Best Results
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-[#e58f5a] mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-lato font-semibold text-[#803716] mb-2">Store in Refrigerator</h4>
                  <p className="font-lato text-gray-600 text-sm">Keep your masks cool for a refreshing experience and better serum absorption.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-[#e58f5a] mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-lato font-semibold text-[#803716] mb-2">Use Before Bed</h4>
                  <p className="font-lato text-gray-600 text-sm">Apply at night for maximum overnight repair and morning radiance.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-[#e58f5a] mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-lato font-semibold text-[#803716] mb-2">Consistent Routine</h4>
                  <p className="font-lato text-gray-600 text-sm">Use 2-3 times per week for optimal results and long-term skin health.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-[#e58f5a] mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-lato font-semibold text-[#803716] mb-2">Gentle Application</h4>
                  <p className="font-lato text-gray-600 text-sm">Be gentle when applying to avoid stretching or damaging the delicate mask.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Shop;
