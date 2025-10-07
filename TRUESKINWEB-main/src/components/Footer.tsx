import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { scrollToTop } from '../utils/scrollToTop';

const Footer = () => {
  return (
    <footer className="bg-[#803716] text-white">
      {/* Main Footer */}
      <div className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center mb-6">
                <img 
                  src="https://i.ibb.co/3yJc0bgQ/LOGO-TRUSKIN.png" 
                  alt="TrueSkin Logo" 
                  className="h-12 w-auto filter brightness-0 invert"
                />
              </div>
              <p className="font-lato text-lg text-amber-100 leading-relaxed max-w-md">
                Premium collagen sheet masks for radiant, youthful skin. Experience the luxury of transformative skincare with results that last.
              </p>
              
              {/* Social Links */}
              <div className="flex items-center gap-4">
                <a 
                  href="#" 
                  className="w-12 h-12 bg-[#b66837] rounded-full flex items-center justify-center hover:bg-[#e58f5a] transition-all duration-300 transform hover:scale-110"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 bg-[#b66837] rounded-full flex items-center justify-center hover:bg-[#e58f5a] transition-all duration-300 transform hover:scale-110"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 bg-[#b66837] rounded-full flex items-center justify-center hover:bg-[#e58f5a] transition-all duration-300 transform hover:scale-110"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="font-playfair text-2xl font-bold text-[#e58f5a]">
                Quick Links
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link 
                    to="/" 
                    onClick={scrollToTop}
                    className="font-lato text-amber-100 hover:text-[#e58f5a] transition-colors duration-300"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/shop" 
                    onClick={scrollToTop}
                    className="font-lato text-amber-100 hover:text-[#e58f5a] transition-colors duration-300"
                  >
                    Shop
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/about" 
                    onClick={scrollToTop}
                    className="font-lato text-amber-100 hover:text-[#e58f5a] transition-colors duration-300"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <a 
                    href="#howitworks"
                    className="font-lato text-amber-100 hover:text-[#e58f5a] transition-colors duration-300"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a 
                    href="#testimonials"
                    className="font-lato text-amber-100 hover:text-[#e58f5a] transition-colors duration-300"
                  >
                    Reviews
                  </a>
                </li>
                <li>
                  <Link 
                    to="/contact" 
                    onClick={scrollToTop}
                    className="font-lato text-amber-100 hover:text-[#e58f5a] transition-colors duration-300"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h3 className="font-playfair text-2xl font-bold text-[#e58f5a]">
                Contact Us
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#e58f5a]" />
                  <a 
                    href="mailto:support@trueskin.app"
                    className="font-lato text-amber-100 hover:text-[#e58f5a] transition-colors duration-300"
                  >
                    support@trueskin.app
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#e58f5a]" />
                  <a 
                    href="tel:+91-9966443364"
                    className="font-lato text-amber-100 hover:text-[#e58f5a] transition-colors duration-300"
                  >
                    +91-9966443364
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#e58f5a]" />
                  <span className="font-lato text-amber-100">
                    Hyderabad, India
                  </span>
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="bg-[#b66837]/20 rounded-2xl p-6">
                <h4 className="font-playfair text-lg font-bold text-[#e58f5a] mb-3">
                  Beauty Tips & Offers
                </h4>
                <p className="font-lato text-sm text-amber-100 mb-4">
                  Subscribe for exclusive skincare tips and special offers
                </p>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="Your email"
                    className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-amber-200 focus:outline-none focus:border-[#e58f5a]"
                  />
                  <button className="bg-[#e58f5a] hover:bg-[#b66837] px-4 py-2 rounded-lg transition-colors duration-300">
                    ✓
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-[#b66837]/30 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-lato text-amber-100 text-center md:text-left">
              © 2025 TrueSkin. All rights reserved. Made with 💖 for beautiful skin.
            </p>
            <div className="flex items-center gap-8">
              <a 
                href="#" 
                className="font-lato text-amber-100 hover:text-[#e58f5a] transition-colors duration-300 text-sm"
              >
                Privacy Policy
              </a>
              <a 
                href="#" 
                className="font-lato text-amber-100 hover:text-[#e58f5a] transition-colors duration-300 text-sm"
              >
                Terms of Service
              </a>
              <a 
                href="#" 
                className="font-lato text-amber-100 hover:text-[#e58f5a] transition-colors duration-300 text-sm"
              >
                Shipping Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;