import React from 'react';
import { Moon, Sparkles, Sun } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Moon className="w-12 h-12" />,
      title: "Apply Before Bed",
      description: "Cleanse your face, apply the collagen mask, and relax as the magic begins."
    },
    {
      icon: <Sparkles className="w-12 h-12" />,
      title: "Let the Magic Work",
      description: "Premium collagen penetrates deep into your skin, repairing and rejuvenating overnight."
    },
    {
      icon: <Sun className="w-12 h-12" />,
      title: "Wake Up Glowing",
      description: "Experience radiant, firm skin with results that last up to 7 days."
    }
  ];

  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-[#803716] mb-6">
            Overnight Transformation
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#e58f5a] to-[#b66837] rounded-full mx-auto mb-6"></div>
          <p className="font-lato text-xl text-[#874c2b] max-w-2xl mx-auto">
            Three simple steps to radiant, youthful skin
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-12 relative">
          {steps.map((step, index) => (
            <div key={index} className="text-center group relative">
              {/* Step Number & Icon */}
              <div className="relative mb-8">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#e58f5a] to-[#b66837] rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-500 shadow-xl">
                  {step.icon}
                </div>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-white border-4 border-[#e58f5a] rounded-full flex items-center justify-center font-playfair font-bold text-xl text-[#803716] shadow-lg">
                  {index + 1}
                </div>
              </div>

              {/* Step Content */}
              <h3 className="font-playfair text-2xl font-bold text-[#803716] mb-4">
                {step.title}
              </h3>
              <p className="font-lato text-lg text-[#874c2b] leading-relaxed">
                {step.description}
              </p>

              {/* Connecting Line (except for last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-[#e58f5a] to-transparent transform translate-x-8 -translate-y-1/2 z-0"></div>
              )}
            </div>
          ))}
        </div>

        {/* Results Banner */}
        <div className="mt-16 bg-gradient-to-r from-[#e58f5a]/10 to-[#b66837]/10 rounded-3xl p-8 text-center">
          <h3 className="font-playfair text-3xl font-bold text-[#803716] mb-4">
            Visible Results in Just One Night
          </h3>
          <p className="font-lato text-lg text-[#874c2b]">
            Join thousands of satisfied customers who wake up to radiant, youthful skin
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;