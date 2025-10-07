import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, CheckCircle } from 'lucide-react';
import ProductModal from '../components/ProductModal';
import Navigation from '../components/Navigation';
import { Product, useCart } from '../contexts/CartContext';
import { productService } from '../services/productService';

const Shop = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart, state } = useCart();

  // Load products from Supabase
  useEffect(() => {
    const loadProducts = async () => {
      try {
        console.log('Shop: Starting to load products...');
        setIsLoading(true);
        const productsData = await productService.getProducts();
        console.log('Shop: Products loaded:', productsData.length);
        setProducts(productsData);
      } catch (error) {
        console.error('Shop: Error loading products:', error);
        // Set fallback products if there's an error
        setProducts([
          {
            id: "heal-pack",
            name: "Heal Pack",
            count: "4 Masks",
            originalPrice: 420,
            price: 304,
            discount: "5% OFF",
            description: "Perfect starter pack for first-time users. Experience the power of premium collagen with our carefully curated 4-mask collection designed to introduce your skin to the TrueSkin difference.",
            rating: 4.8,
            reviews: 124,
            images: [
              "https://i.ibb.co/bMTNmmqR/Whats-App-Image-2025-08-13-at-18-16-29-1832814a.jpg",
              "https://i.ibb.co/bMTNmmqR/Whats-App-Image-2025-08-13-at-18-16-29-1832814a.jpg"
            ]
          },
          {
            id: "fresh-pack",
            name: "Fresh Pack",
            count: "8 Masks",
            originalPrice: 800,
            price: 576,
            discount: "5% OFF",
            description: "Most popular choice for regular users. Transform your skincare routine with our 8-mask collection, perfect for maintaining that radiant glow throughout the month.",
            rating: 4.9,
            reviews: 286,
            popular: true,
            images: [
              "https://i.ibb.co/bMTNmmqR/Whats-App-Image-2025-08-13-at-18-16-29-1832814a.jpg",
              "https://i.ibb.co/bMTNmmqR/Whats-App-Image-2025-08-13-at-18-16-29-1832814a.jpg"
            ]
          },
          {
            id: "glow-pack",
            name: "Glow Pack",
            count: "12 Masks",
            originalPrice: 1158,
            price: 816,
            discount: "5% OFF",
            description: "Best value for skincare enthusiasts. Our premium 12-mask collection offers the ultimate skincare experience with maximum savings and long-lasting results.",
            rating: 4.9,
            reviews: 198,
            images: [
              "https://i.ibb.co/bMTNmmqR/Whats-App-Image-2025-08-13-at-18-16-29-1832814a.jpg",
              "https://i.ibb.co/bMTNmmqR/Whats-App-Image-2025-08-13-at-18-16-29-1832814a.jpg"
            ]
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

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
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b66837] mx-auto mb-4"></div>
              <p className="font-lato text-lg text-[#874c2b]">Loading products...</p>
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
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
