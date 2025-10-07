import React from 'react';
import { TrendingUp, Shield, Sparkles, Award } from 'lucide-react';

const ScientificEdge = () => {
  const benefits = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      percentage: "87%",
      title: "Improved Hydration",
      description: "Clinically proven to increase skin moisture levels"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      percentage: "92%",
      title: "Enhanced Firmness",
      description: "Visible improvement in skin elasticity and tone"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      percentage: "95%",
      title: "Radiant Glow",
      description: "Users report significantly brighter, more luminous skin"
    },
    {
      icon: <Award className="w-8 h-8" />,
      percentage: "89%",
      title: "Reduced Fine Lines",
      description: "Noticeable reduction in signs of aging"
    }
  ];

  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-[#803716] mb-6">
            The Power of Collagen
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#e58f5a] to-[#b66837] rounded-full mx-auto mb-6"></div>
          
          {/* Collagen Power Image */}
          <div className="mb-12">
            <img 
              src="https://i.ibb.co/8L737HSy/Untitled-design-23.png" 
              alt="The Power of Collagen" 
              className="max-w-4xl w-full h-auto mx-auto rounded-2xl shadow-lg"
            />
          </div>
          
          <p className="font-lato text-xl text-[#874c2b] max-w-2xl mx-auto">
            Backed by science, proven by results
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-stone-50 to-amber-50 rounded-2xl p-8 text-center group hover:shadow-xl transition-all duration-500 transform hover:scale-105"
            >
              {/* Icon */}
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#e58f5a] to-[#b66837] rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-500">
                {benefit.icon}
              </div>

              {/* Percentage */}
              <div className="font-playfair text-4xl font-bold text-[#803716] mb-3">
                {benefit.percentage}
              </div>

              {/* Title */}
              <h3 className="font-playfair text-xl font-bold text-[#b66837] mb-3">
                {benefit.title}
              </h3>

              {/* Description */}
              <p className="font-lato text-[#874c2b] leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Scientific Claims */}
        <div className="bg-gradient-to-r from-[#e58f5a]/10 to-[#b66837]/10 rounded-3xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-6">
              <h3 className="font-playfair text-3xl lg:text-4xl font-bold text-[#803716]">
                Clinically Tested Formula
              </h3>
              <p className="font-lato text-lg text-[#874c2b] leading-relaxed">
                Our premium collagen sheet masks are formulated with advanced peptides and natural extracts that work synergistically to deliver maximum skin benefits.
              </p>
              <ul className="space-y-4">
                {[
                  "Marine collagen for deep hydration",
                  "Hyaluronic acid for plumping effect",
                  "Vitamin C for brightening",
                  "Peptides for anti-aging benefits"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#e58f5a] rounded-full"></div>
                    <span className="font-lato text-[#874c2b]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Infographic */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h4 className="font-playfair text-xl font-bold text-[#803716] mb-4 text-center">
                  Results Timeline
                </h4>
                <div className="space-y-4">
                  {[
                    { time: "4 Hours", result: "Immediate hydration boost" },
                    { time: "Overnight", result: "Deep skin repair begins" },
                    { time: "Next morning", result: "Visible glow and firmness" },
                    { time: "7 days", result: "Long-lasting radiance" }
                  ].map((step, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-lato font-semibold text-[#b66837]">
                        {step.time}
                      </span>
                      <span className="font-lato text-[#874c2b] text-sm">
                        {step.result}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dermatologist Note */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-[#e58f5a]">
                <p className="font-lato text-sm text-[#874c2b] italic mb-3">
                  "TrueSkin's collagen masks represent the perfect blend of scientific innovation and luxurious skincare. The results speak for themselves."
                </p>
                <p className="font-lato text-xs text-[#b66837] font-semibold">
                  - Dr. Anjali Mehta, Dermatologist
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScientificEdge;