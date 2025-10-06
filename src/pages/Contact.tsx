import React, { useState } from 'react';
import { Mail, Phone, Send, MessageCircle } from 'lucide-react';
import Navigation from '../components/Navigation';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      details: "support@trueskin.app",
      description: "Send us an email anytime"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      details: "+91-9966443364",
      description: "Mon-Fri 9AM-6PM IST"
    }
  ];

  const faqs = [
    {
      question: "How long does shipping take?",
      answer: "We offer free shipping on all orders within India. Standard delivery takes 3-5 business days, while express delivery takes 1-2 business days."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day money-back guarantee. If you're not satisfied with your purchase, you can return it for a full refund within 30 days of delivery."
    },
    {
      question: "Are your products suitable for sensitive skin?",
      answer: "Yes, all our products are dermatologically tested and suitable for all skin types, including sensitive skin. However, we recommend doing a patch test first."
    },
    {
      question: "How often should I use the face masks?",
      answer: "For best results, use our collagen face masks 2-3 times per week. This frequency allows your skin to absorb the benefits without over-treating."
    }
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
              Contact Us
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-[#e58f5a] to-[#b66837] rounded-full mx-auto mb-6"></div>
            <p className="font-lato text-xl text-[#874c2b] max-w-3xl mx-auto leading-relaxed">
              We'd love to hear from you! Get in touch with our team for any questions, 
              feedback, or support you might need.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 text-center"
              >
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#e58f5a] to-[#b66837] rounded-full flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-500">
                  {info.icon}
                </div>
                <h3 className="font-playfair text-xl font-bold text-[#803716] mb-2">
                  {info.title}
                </h3>
                <p className="font-lato text-lg text-[#b66837] font-semibold mb-2">
                  {info.details}
                </p>
                <p className="font-lato text-gray-600">
                  {info.description}
                </p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="font-playfair text-3xl font-bold text-[#803716] mb-6">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block font-lato font-semibold text-[#803716] mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e58f5a] focus:border-transparent transition-all duration-300"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block font-lato font-semibold text-[#803716] mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e58f5a] focus:border-transparent transition-all duration-300"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block font-lato font-semibold text-[#803716] mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e58f5a] focus:border-transparent transition-all duration-300"
                    placeholder="What's this about?"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block font-lato font-semibold text-[#803716] mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e58f5a] focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#b66837] hover:bg-[#803716] text-white px-6 py-4 rounded-full font-lato font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-3 group"
                >
                  <Send className="w-5 h-5 group-hover:animate-bounce" />
                  Send Message
                </button>
              </form>
            </div>

            {/* FAQ Section */}
            <div>
              <h2 className="font-playfair text-3xl font-bold text-[#803716] mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <h3 className="font-lato font-semibold text-[#803716] mb-3 flex items-center gap-3">
                      <MessageCircle className="w-5 h-5 text-[#e58f5a]" />
                      {faq.question}
                    </h3>
                    <p className="font-lato text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Hours */}
      {/* <section className="py-20 bg-gradient-to-br from-amber-50 to-stone-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#e58f5a] to-[#b66837] rounded-full flex items-center justify-center text-white mb-6">
              <Clock className="w-8 h-8" />
            </div>
            <h2 className="font-playfair text-3xl font-bold text-[#803716] mb-4">
              Business Hours
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div>
                <h3 className="font-lato font-semibold text-[#b66837] mb-2">Customer Support</h3>
                <p className="font-lato text-gray-600">Mon - Fri: 9:00 AM - 6:00 PM IST</p>
                <p className="font-lato text-gray-600">Sat: 10:00 AM - 4:00 PM IST</p>
              </div>
              <div>
                <h3 className="font-lato font-semibold text-[#b66837] mb-2">Live Chat</h3>
                <p className="font-lato text-gray-600">Mon - Fri: 9:00 AM - 8:00 PM IST</p>
                <p className="font-lato text-gray-600">Sat: 10:00 AM - 6:00 PM IST</p>
              </div>
              <div>
                <h3 className="font-lato font-semibold text-[#b66837] mb-2">Email Support</h3>
                <p className="font-lato text-gray-600">24/7 Response</p>
                <p className="font-lato text-gray-600">Within 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default Contact;
