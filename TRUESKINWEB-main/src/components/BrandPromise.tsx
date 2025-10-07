import React from 'react';

const BrandPromise = () => {
  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-8">
            <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-[#803716] leading-tight">
              Science Meets
              <span className="block text-[#b66837]">Luxury Skincare</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#e58f5a] to-[#b66837] rounded-full mx-auto"></div>
            <p className="font-lato text-lg lg:text-xl text-[#874c2b] leading-relaxed">
              At TrueSkin, we believe skincare is self-care. Our collagen sheet masks are designed to hydrate, firm, and rejuvenate overnight — for confidence that shines from the inside out.
            </p>
            <p className="font-lato text-lg text-gray-600 leading-relaxed">
              Each mask is crafted with premium ingredients and cutting-edge technology to deliver visible results that last. Experience the luxury of transformative skincare.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandPromise;