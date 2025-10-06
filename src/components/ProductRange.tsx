import { useState, useEffect } from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import ProductModal from './ProductModal';
import { Product } from '../contexts/CartContext';
import { getAllProducts } from '../data/products.ts';

const ProductRange = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load products from local data
  useEffect(() => {
    const loadProducts = async () => {
      try {
        console.log('ProductRange: Loading products from local data...');
        setIsLoading(true);
        
        // Simulate a small delay for smooth loading
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const productsData = getAllProducts();
        console.log('ProductRange: Products loaded:', productsData.length);
        setProducts(productsData);
      } catch (error) {
        console.error('ProductRange: Error loading products:', error);
        setProducts([]);
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

  if (isLoading) {
    return (
      <section className="py-20 lg:py-32 bg-gradient-to-br from-stone-50 to-amber-50" id="shop">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b66837] mx-auto mb-4"></div>
            <p className="font-lato text-lg text-[#874c2b]">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-stone-50 to-amber-50" id="shop">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-[#803716] mb-6">
            Choose Your Glow
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#e58f5a] to-[#b66837] rounded-full mx-auto mb-6"></div>
          <p className="font-lato text-xl text-[#874c2b] max-w-2xl mx-auto">
            Select the perfect pack size for your skincare journey
          </p>
        </div>

        {/* Product Layout: Image Left, Packs Right */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Product Image - Left Side */}
          <div className="max-w-md mx-auto lg:mx-0 flex flex-col justify-center">
            <div className="relative group mb-8">
              <div className="relative z-10 transform hover:scale-105 transition-transform duration-700">
                <img 
                  src="/images/prd.jpg" 
                  alt="TrueSkin Bio Collagen Face Mask" 
                  className="w-full max-w-sm h-auto rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#e58f5a]/10 to-transparent rounded-2xl"></div>
              </div>
              
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#e58f5a]/20 via-transparent to-[#b66837]/20 rounded-2xl blur-3xl scale-110 opacity-60 animate-pulse -z-10"></div>
              
              {/* Product Badge */}
              <div className="absolute -top-4 -right-4 bg-[#e58f5a] text-white px-4 py-2 rounded-full font-lato font-semibold text-sm shadow-lg z-20">
                Premium Quality
              </div>
            </div>
            
            {/* Product Title */}
            <div className="mt-8 text-center lg:text-left">
              <h3 className="font-playfair text-3xl font-bold text-[#803716] mb-4">
                Bio Collagen Face Mask
              </h3>
              <p className="font-lato text-lg text-[#874c2b] leading-relaxed">
                Premium collagen sheet masks designed to hydrate, firm, and rejuvenate your skin overnight for lasting radiance.
              </p>
            </div>
          </div>

          {/* Pack Options - Right Side */}
          <div className="flex-1">
            <div className="grid gap-8">
              {products.map((product, index) => (
                <div 
                  key={index}
                  onClick={() => handleProductClick(product)}
                  className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02] overflow-hidden border-2 cursor-pointer ${
                    product.popular ? 'border-[#e58f5a] ring-2 ring-[#e58f5a] ring-opacity-30' : 'border-gray-100'
                  }`}
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
                      src={product.images[0] || '/images/placeholder.jpg'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholder.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>

                  <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                      {/* Pack Icon */}
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#e58f5a]/20 to-[#b66837]/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 mb-3">
                          <div className="w-16 h-16 bg-[#e58f5a] rounded-full flex items-center justify-center text-white font-playfair font-bold text-lg">
                            {product.count.split(' ')[0]}
                          </div>
                        </div>
                        <h4 className="font-playfair text-xl font-bold text-[#803716] mb-2">
                          {product.name}
                        </h4>
                        <p className="font-lato text-sm text-[#b66837] font-medium">
                          {product.count}
                        </p>
                      </div>

                      {/* Product Details */}
                      <div className="md:col-span-2 text-center md:text-left">
                        <p className="font-lato text-base text-gray-600 mb-3 line-clamp-2">
                          {product.description}
                        </p>
                        
                        {/* Rating */}
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-[#e58f5a] fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                          <span className="font-lato text-sm text-gray-600">
                            {product.rating} ({product.reviews})
                          </span>
                        </div>
                        
                        <p className="font-lato text-sm text-[#b66837] font-medium">
                          ₹{Math.round(product.price / parseInt(product.count))} per mask
                        </p>
                      </div>

                      {/* Pricing & CTA */}
                      <div className="text-center">
                        <div className="mb-4">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="font-playfair text-2xl font-bold text-[#803716]">
                              ₹{product.price}
                            </span>
                            <span className="font-lato text-sm text-gray-500 line-through">
                              ₹{product.originalPrice}
                            </span>
                          </div>
                        </div>

                        {/* CTA Button */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductClick(product);
                          }}
                          className="w-full bg-[#b66837] hover:bg-[#803716] text-white px-6 py-3 rounded-full font-lato font-semibold text-base transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 group"
                        >
                          <ShoppingCart className="w-4 h-4 group-hover:animate-bounce" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
};

export default ProductRange;