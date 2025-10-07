import React from 'react';
import Hero from '../components/Hero';
import BrandPromise from '../components/BrandPromise';
import ProductRange from '../components/ProductRange';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import ScientificEdge from '../components/ScientificEdge';
import CTABanner from '../components/CTABanner';

const Home = () => {
  return (
    <div className="min-h-screen bg-stone-50">
      <Hero />
      <BrandPromise />
      <ProductRange />
      <HowItWorks />
      <Testimonials />
      <ScientificEdge />
      <CTABanner />
    </div>
  );
};

export default Home;
