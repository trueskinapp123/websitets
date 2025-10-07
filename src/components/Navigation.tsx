import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { User, LogOut, Menu, X } from 'lucide-react';
import { useActiveNav } from '../hooks/useActiveNav';
import { useAuth } from '../contexts/AuthContext';
import CartIndicator from './CartIndicator';
import AuthModal from './AuthModal';

const Navigation = () => {
  const { isActive } = useActiveNav();
  const { user, profile, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Shop' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ];

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      console.log('Starting sign out process...');
      console.log('Current user before sign out:', user?.email);
      
      await signOut();
      
      console.log('Sign out completed');
      setShowUserMenu(false);
      setIsMobileMenuOpen(false);
      
    } catch (error) {
      console.error('Failed to sign out:', error);
      alert('Failed to sign out. Please try again.');
    } finally {
      setIsSigningOut(false);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Listen for custom event to open auth modal from other components
  useEffect(() => {
    const handleOpenAuthModal = () => {
      setShowAuthModal(true);
    };

    window.addEventListener('openAuthModal', handleOpenAuthModal);
    
    return () => {
      window.removeEventListener('openAuthModal', handleOpenAuthModal);
    };
  }, []);

  return (
    <>
      <nav className="relative z-20 flex items-center justify-between p-4 lg:px-12 bg-white shadow-sm">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img 
              src="https://i.ibb.co/3yJc0bgQ/LOGO-TRUSKIN.png" 
              alt="TrueSkin Logo" 
              className="h-10 sm:h-12 lg:h-16 w-auto transition-all duration-300 hover:scale-105 filter drop-shadow-md"
              onError={(e) => {
                // Fallback to text logo if image fails to load
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent && !parent.querySelector('.fallback-logo')) {
                  const fallback = document.createElement('div');
                  fallback.className = 'fallback-logo font-playfair text-2xl font-bold text-[#803716]';
                  fallback.textContent = 'TrueSkin';
                  parent.appendChild(fallback);
                }
              }}
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8 text-[#803716] font-lato font-medium">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={`transition-all duration-300 relative ${
                isActive(item.path)
                  ? 'text-[#b66837] font-bold'
                  : 'hover:text-[#b66837]'
              }`}
            >
              {item.label}
              {isActive(item.path) && (
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#b66837] rounded-full"></div>
              )}
            </Link>
          ))}
          
          {/* Desktop User Menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 text-[#803716] hover:text-[#b66837] transition-colors duration-300"
              >
                <User className="w-5 h-5" />
                <span className="font-lato font-medium">
                  {profile?.full_name || user.email?.split('@')[0] || 'User'}
                </span>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-lato text-sm text-gray-600">{user.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setShowUserMenu(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LogOut className="w-4 h-4" />
                    {isSigningOut ? 'Signing Out...' : 'Sign Out'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="text-[#803716] hover:text-[#b66837] transition-colors duration-300 font-lato font-medium"
            >
              Sign In
            </button>
          )}
          
          <CartIndicator />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          <CartIndicator />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-[#803716] hover:text-[#b66837] transition-colors duration-300 p-2"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg mobile-menu mobile-menu-enter">
          <div className="px-4 py-6 space-y-4">
            {/* Mobile Navigation Links */}
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  closeMobileMenu();
                }}
                className={`block py-3 px-4 rounded-lg transition-all duration-300 font-lato font-medium ${
                  isActive(item.path)
                    ? 'text-[#b66837] bg-[#f3f4f6] font-bold'
                    : 'text-[#803716] hover:text-[#b66837] hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile User Section */}
            <div className="border-t border-gray-200 pt-4">
              {user ? (
                <div className="space-y-3">
                  <div className="px-4 py-2 bg-gray-50 rounded-lg">
                    <p className="font-lato text-sm text-gray-600">{user.email}</p>
                    <p className="font-lato font-medium text-[#803716]">
                      {profile?.full_name || user.email?.split('@')[0] || 'User'}
                    </p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={closeMobileMenu}
                    className="block py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 font-lato"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    onClick={closeMobileMenu}
                    className="block py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 font-lato"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="w-full text-left py-3 px-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 flex items-center gap-2 font-lato disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LogOut className="w-4 h-4" />
                    {isSigningOut ? 'Signing Out...' : 'Sign Out'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setShowAuthModal(true);
                    closeMobileMenu();
                  }}
                  className="w-full text-left py-3 px-4 text-[#803716] hover:text-[#b66837] hover:bg-gray-50 rounded-lg transition-colors duration-300 font-lato font-medium"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default Navigation;
