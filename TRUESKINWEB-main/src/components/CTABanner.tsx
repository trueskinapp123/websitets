import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { scrollToTop } from '../utils/scrollToTop';

const CTABanner = () => {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-r from-[#b66837] to-[#803716] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 text-center">
        <div className="space-y-8">
          {/* Main Headline */}
          <h2 className="font-playfair text-4xl lg:text-6xl font-bold text-white leading-tight">
            Your Glow Can't Wait
          </h2>
          
          {/* Subheadline */}
          <p className="font-lato text-xl lg:text-2xl text-amber-100 max-w-3xl mx-auto leading-relaxed">
            Shop Now & Feel the TrueSkin Difference
          </p>

          {/* Special Offer */}
          {/* <div className="inline-block bg-white/20 backdrop-blur-sm rounded-2xl px-8 py-4 mb-8">
            <p className="font-lato text-lg text-white">
              <span className="font-bold text-amber-200">Limited Time:</span> Free shipping on all orders above ₹500
            </p>
          </div> */}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              to="/shop" 
              onClick={scrollToTop}
              className="group bg-white text-[#803716] px-10 py-5 rounded-full font-lato font-bold text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center gap-4 min-w-64"
            >
              <ShoppingBag className="w-6 h-6 group-hover:animate-bounce" />
              Shop All Packs
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            
            {/* <button className="group border-2 border-white text-white hover:bg-white hover:text-[#803716] px-10 py-5 rounded-full font-lato font-bold text-xl transition-all duration-300 min-w-64">
              View Ingredients
            </button> */}
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-white/20">
            {[
              { icon: "🚚", text: "Free Shipping" },
              { icon: "💯", text: "100% Natural" },
              { icon: "🔒", text: "Secure Payment" },
              { icon: "⭐", text: "5000+ Reviews" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl mb-3">{item.icon}</div>
                <p className="font-lato text-white font-semibold">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;