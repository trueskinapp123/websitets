import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ChevronDown } from 'lucide-react';
import TypewriterEffect from './TypewriterEffect';
import Navigation from './Navigation';
import { scrollToTop } from '../utils/scrollToTop';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col bg-gradient-to-br from-stone-100 to-amber-50 overflow-hidden">
      {/* Navigation */}
      <Navigation />

      {/* Hero Content */}
      <div className="flex-1 flex items-center justify-center px-6 lg:px-12 py-20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="space-y-10">
            <div className="font-playfair text-5xl lg:text-7xl font-bold leading-tight">
              <TypewriterEffect 
                texts={[
                  "Your Skin's Overnight Miracle",
                  "Glow That Lasts 7 Days",
                  "Premium Collagen Masks"
                ]}
                speed={50}
                deleteSpeed={25}
                delayBetweenTexts={1000}
              />
            </div>
            <p className="font-lato text-2xl lg:text-3xl text-[#874c2b] leading-relaxed max-w-4xl mx-auto">
              TrueSkin Collagen Sheet Mask — Glow that lasts for 7 days in just one night.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Link 
                to="/shop" 
                onClick={scrollToTop}
                className="group bg-[#b66837] hover:bg-[#803716] text-white px-8 py-4 rounded-full font-lato font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center gap-3"
              >
                <ShoppingBag className="w-5 h-5" />
                Shop Now
              </Link>
              <Link 
                to="/about" 
                onClick={scrollToTop}
                className="border-2 border-[#e58f5a] text-[#e58f5a] hover:bg-[#e58f5a] hover:text-white px-8 py-4 rounded-full font-lato font-semibold text-lg transition-all duration-300"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-[#803716] animate-bounce">
        <ChevronDown className="w-8 h-8" />
      </div>
    </section>
  );
};

export default Hero;