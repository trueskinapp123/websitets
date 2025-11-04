import React from 'react';
import { Mail, Phone, MessageCircle } from 'lucide-react';

const Contact = () => {
  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      details: "amaamafatima67@gmail.com",
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
      {/* <div className="bg-white shadow-sm">
        <Navigation />
      </div> */}

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

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto">
            <h2 className="font-playfair text-3xl font-bold text-[#803716] mb-6 text-center">
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
