import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Saniya Mohammed",
      age: 32,
      location: "Mumbai",
      rating: 5,
      text: "I've tried countless skincare products, but TrueSkin's collagen masks are truly magical. My skin feels firmer and more radiant after just one use. The glow really does last for days!",
      //before: "https://images.pexels.com/photos/3762076/pexels-photo-3762076.jpeg?auto=compress&cs=tinysrgb&w=400",
      //  after: "https://images.pexels.com/photos/3762040/pexels-photo-3762040.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      name: "Ayesha Javed",
      age: 28,
      location: "Bangalore",
      rating: 5,
      text: "As someone with sensitive skin, I was hesitant to try new products. But TrueSkin's masks are gentle yet effective. My friends keep asking what I'm using because my skin looks so healthy!",
      //before: "https://images.pexels.com/photos/3762058/pexels-photo-3762058.jpeg?auto=compress&cs=tinysrgb&w=400",
      //after: "https://images.pexels.com/photos/3762042/pexels-photo-3762042.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      name: "Madiha Khan",
      age: 35,
      location: "Hyderabad",
      rating: 5,
      text: "Working long hours in a stressful job was taking a toll on my skin. TrueSkin masks have become my weekly self-care ritual. The overnight transformation is incredible!",
      //before: "https://images.pexels.com/photos/3762051/pexels-photo-3762051.jpeg?auto=compress&cs=tinysrgb&w=400",
      //after: "https://images.pexels.com/photos/3762029/pexels-photo-3762029.jpeg?auto=compress&cs=tinysrgb&w=400"
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentTestimonial];

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-stone-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-[#803716] mb-6">
            Loved By Thousands
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#e58f5a] to-[#b66837] rounded-full mx-auto mb-6"></div>
          <p className="font-lato text-xl text-[#874c2b] max-w-2xl mx-auto">
            Real results from real customers
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 mb-12 relative overflow-hidden">
          {/* Quote Icon */}
          <div className="absolute top-8 right-8 text-[#e58f5a]/20">
            <Quote className="w-16 h-16" />
          </div>

          <div className="grid lg:grid-cols-3 gap-12 items-center">
            {/* Testimonial Content */}
            <div className="space-y-6">
              {/* Rating */}
              <div className="flex items-center gap-2">
                {[...Array(current.rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-[#e58f5a] fill-current" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="font-lato text-lg lg:text-xl text-[#874c2b] leading-relaxed italic">
                "{current.text}"
              </blockquote>

              {/* Author */}
              <div className="border-l-4 border-[#e58f5a] pl-6">
                <h4 className="font-playfair text-xl font-bold text-[#803716]">
                  {current.name}
                </h4>
                <p className="font-lato text-[#b66837]">
                  Age {current.age}, {current.location}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-8">
          <button 
            onClick={prevTestimonial}
            className="w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-[#b66837] hover:bg-[#b66837] hover:text-white transition-all duration-300 hover:scale-105"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Dots */}
          <div className="flex items-center gap-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial 
                    ? 'bg-[#b66837] scale-125' 
                    : 'bg-gray-300 hover:bg-[#e58f5a]'
                }`}
              />
            ))}
          </div>

          <button 
            onClick={nextTestimonial}
            className="w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-[#b66837] hover:bg-[#b66837] hover:text-white transition-all duration-300 hover:scale-105"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          {[
            { number: "5,000+", label: "Happy Customers" },
            { number: "4.9/5", label: "Average Rating" },
            { number: "95%", label: "Would Recommend" },
            { number: "7 Days", label: "Lasting Results" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="font-playfair text-3xl lg:text-4xl font-bold text-[#803716] mb-2">
                {stat.number}
              </div>
              <div className="font-lato text-[#874c2b]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;