import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider, useCart } from './contexts/CartContext';
import { queryClient } from './lib/queryClient';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Shop from './pages/Shop';
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Cart from './pages/Cart';
import Footer from './components/Footer';
import Toast from './components/Toast';
import LoadingSpinner from './components/LoadingSpinner';

const CheckoutForm = lazy(() => import('./components/CheckoutForm'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const PaymentFailure = lazy(() => import('./pages/PaymentFailure'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Component to handle toast notifications
const AppContent = () => {
  const { state, dispatch } = useCart();

  const handleCloseToast = () => {
    dispatch({ type: 'SHOW_ADDED_MESSAGE', payload: false });
  };

  return (
    <>
      <Router>
        <div className="min-h-screen bg-stone-50">
          <Navigation />
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<CheckoutForm />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/payment-failure" element={<PaymentFailure />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
          </Suspense>
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