import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider, useCart } from './contexts/CartContext';
import { useCartPersistence } from './hooks/useCartPersistence';
import { queryClient } from './lib/queryClient';
import Home from './pages/Home';
import Shop from './pages/Shop';
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import CheckoutForm from './components/CheckoutForm';
import OrderSuccess from './pages/OrderSuccess';
import PaymentFailure from './pages/PaymentFailure';
import RazorpayTest from './components/RazorpayTest';
import Footer from './components/Footer';
import Toast from './components/Toast';

// Component to handle toast notifications and cart persistence
const AppContent = () => {
  const { state, dispatch } = useCart();
  
  // Handle cart persistence across login/logout
  useCartPersistence();

  const handleCloseToast = () => {
    dispatch({ type: 'SHOW_ADDED_MESSAGE', payload: false });
  };

  return (
    <>
      <Router>
        <div className="min-h-screen bg-stone-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/checkout" element={<CheckoutForm />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/payment-failure" element={<PaymentFailure />} />
          <Route path="/test-razorpay" element={<RazorpayTest />} />
        </Routes>
          <Footer />
        </div>
      </Router>
      
      {/* Toast Notification */}
      <Toast
        message="Added to cart!"
        isVisible={state.showAddedMessage}
        onClose={handleCloseToast}
      />
    </>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;