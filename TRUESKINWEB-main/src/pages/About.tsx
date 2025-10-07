import React from 'react';
import { Heart, Award, Users, Shield } from 'lucide-react';
import Navigation from '../components/Navigation';

const About = () => {
  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Passion for Beauty",
      description: "We believe everyone deserves to feel confident in their own skin. Our passion drives us to create products that truly make a difference."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Premium Quality",
      description: "Every TrueSkin product is crafted with the finest ingredients and rigorous quality standards to ensure exceptional results."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Customer First",
      description: "Our customers are at the heart of everything we do. We listen, learn, and continuously improve based on your feedback."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Safe & Effective",
      description: "All our products are dermatologically tested and safe for all skin types, ensuring both effectiveness and peace of mind."
    }
  ];

  const team = [
    {
      name: "Dr. Sarah Johnson",
      role: "Chief Dermatologist",
      description: "With over 15 years of experience in cosmetic dermatology, Dr. Johnson leads our research and development team.",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face"
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Navigation */}
      <div className="bg-white shadow-sm">
        <Navigation />
      </div>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-stone-100 to-amber-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center">
            <h1 className="font-playfair text-5xl lg:text-6xl font-bold text-[#803716] mb-6">
              About TrueSkin
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-[#e58f5a] to-[#b66837] rounded-full mx-auto mb-6"></div>
            <p className="font-lato text-xl text-[#874c2b] max-w-3xl mx-auto leading-relaxed">
              We're on a mission to revolutionize skincare with premium collagen face masks that deliver real, lasting results. 
              Born from a passion for beauty and backed by science, TrueSkin is your partner in achieving radiant, healthy skin.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-playfair text-4xl font-bold text-[#803716] mb-6">
                Our Story
              </h2>
              <div className="space-y-6">
                <p className="font-lato text-lg text-gray-700 leading-relaxed">
                Hi everyone,
               I’m Amaama Fatima, the founder of TrueSkin.app, 
               and today I want to tell you how a deeply personal skincare mistake turned into a mission 
               to transform how we care for our skin.

                </p>
                <p className="font-lato text-lg text-gray-700 leading-relaxed">
                It started with something many of us go through trying a product that
                 promised miracles but ended up damaging my skin. Like most teenagers, I didn’t know my
                  skin type, let alone what products were safe. That one experience didn’t just affect my 
                  confidence it lit a fire in me to fix the way skincare works.
                </p>
                <p className="font-lato text-lg text-gray-700 leading-relaxed">
                But let me be honest, I’m not from a tech background. I had no idea how to build an app, run a startup, or use AI. What I did have was a dream to make skincare smarter and a genuine need to prevent others from going through the same trial-and-error pain.
                This dream took its first real step on February 25, 2024, when I joined the pre-incubation program at EdVenture Park.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="/images/fndr.jpg"
                alt="TrueSkin Product"
                className="w-full h-97  object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#e58f5a]/10 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-stone-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-[#803716] mb-6">
              Our Values
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#e58f5a] to-[#b66837] rounded-full mx-auto mb-6"></div>
            <p className="font-lato text-xl text-[#874c2b] max-w-2xl mx-auto">
              The principles that guide everything we do at TrueSkin
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 text-center"
              >
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#e58f5a] to-[#b66837] rounded-full flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-500">
                  {value.icon}
                </div>
                <h3 className="font-playfair text-xl font-bold text-[#803716] mb-4">
                  {value.title}
                </h3>
                <p className="font-lato text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      {/* <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-[#803716] mb-6">
              Meet Our Team
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#e58f5a] to-[#b66837] rounded-full mx-auto mb-6"></div>
            <p className="font-lato text-xl text-[#874c2b] max-w-2xl mx-auto">
              The passionate experts behind TrueSkin's success
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 text-center"
              >
                <div className="relative mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 mx-auto rounded-full object-cover shadow-lg group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-playfair text-xl font-bold text-[#803716] mb-2">
                  {member.name}
                </h3>
                <p className="font-lato text-[#b66837] font-semibold mb-4">
                  {member.role}
                </p>
                <p className="font-lato text-gray-600 leading-relaxed">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Mission Statement */}
      <section className="py-20 bg-gradient-to-br from-[#803716] to-[#b66837] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="font-playfair text-4xl font-bold mb-6">
            Our Mission
          </h2>
          <div className="w-24 h-1 bg-white rounded-full mx-auto mb-8"></div>
          <p className="font-lato text-xl leading-relaxed max-w-4xl mx-auto">
            To empower everyone to achieve their best skin through innovative, effective, and accessible skincare solutions. 
            We believe that beautiful, healthy skin should be within reach for everyone, regardless of their background or budget.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
