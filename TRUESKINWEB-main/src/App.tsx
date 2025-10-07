import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider, useCart } from './contexts/CartContext';
import { useCartPersistence } from './hooks/useCartPersistence';
import Home from './pages/Home';
import Shop from './pages/Shop';
import About from './pages/About';
import Contact from './pages/Contact';
import CheckoutForm from './components/CheckoutForm';
import OrderSuccess from './pages/OrderSuccess';
import PaymentFailure from './pages/PaymentFailure';
import Footer from './components/Footer';
import Toast from './components/Toast';
import AuthDebug from './components/AuthDebug';
import CartDebug from './components/CartDebug';

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
            <Route path="/checkout" element={<CheckoutForm />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/payment-failure" element={<PaymentFailure />} />
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
      
      {/* Auth Debug (Development Only) */}
      <AuthDebug />
      
      {/* Cart Debug (Development Only) */}
      <CartDebug />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;