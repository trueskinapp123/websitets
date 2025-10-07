import React, { createContext, useContext, useReducer, ReactNode, useEffect, useCallback } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

export interface Product {
  id: string;
  name: string;
  count: string;
  originalPrice: number;
  price: number;
  discount: string;
  description: string;
  rating: number;
  reviews: number;
  popular?: boolean;
  images: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isLoading: boolean;
  isAuthenticated: boolean;
  showAddedMessage: boolean;
}

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'LOAD_CART_ITEMS'; payload: CartItem[] }
  | { type: 'SHOW_ADDED_MESSAGE'; payload: boolean }
  | { type: 'CLEAR_CART' };

interface CartContextType {
  state: CartState;
  addToCart: (product: Product) => Promise<boolean>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };

    case 'SET_AUTHENTICATED':
      return {
        ...state,
        isAuthenticated: action.payload
      };

    case 'LOAD_CART_ITEMS':
      return {
        ...state,
        items: action.payload,
        total: action.payload.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        itemCount: action.payload.reduce((sum, item) => sum + item.quantity, 0),
        isLoading: false
      };

    case 'SHOW_ADDED_MESSAGE':
      return {
        ...state,
        showAddedMessage: action.payload
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0,
        itemCount: 0,
        isLoading: false
      };
    
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
    isLoading: false,
    isAuthenticated: false,
    showAddedMessage: false
  });

  // Load user's cart from Supabase
  const loadUserCart = useCallback(async () => {
    if (!user?.id) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const cartItems = await cartService.getCartItems(user.id);
      dispatch({ type: 'LOAD_CART_ITEMS', payload: cartItems });
      console.log('Loaded user cart from Supabase:', cartItems);
    } catch (error) {
      console.error('Error loading cart items:', error);
      dispatch({ type: 'LOAD_CART_ITEMS', payload: [] });
    }
  }, [user?.id]);

  // Update authentication status when user changes
  useEffect(() => {
    const isAuthenticated = !!user;
    dispatch({ type: 'SET_AUTHENTICATED', payload: isAuthenticated });
    
    if (!isAuthenticated) {
      // User logged out - clear cart immediately
      dispatch({ type: 'CLEAR_CART' });
    } else {
      // User logged in - load cart from Supabase
      loadUserCart();
    }
  }, [user, loadUserCart]);

  // Add product to cart (only for authenticated users)
  const addToCart = async (product: Product): Promise<boolean> => {
    if (!state.isAuthenticated || !user?.id) {
      // Show message that user needs to log in
      return false;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Add to Supabase
      await cartService.addToCart(user.id, product.id, 1);
      
      // Reload cart from Supabase to get updated state
      await loadUserCart();
      
      // Show success message
      dispatch({ type: 'SHOW_ADDED_MESSAGE', payload: true });
      setTimeout(() => {
        dispatch({ type: 'SHOW_ADDED_MESSAGE', payload: false });
      }, 2000);
      
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
      return false;
    }
  };

  // Remove product from cart (only for authenticated users)
  const removeFromCart = async (productId: string): Promise<void> => {
    if (!state.isAuthenticated || !user?.id) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Remove from Supabase
      await cartService.removeFromCart(user.id, productId);
      
      // Reload cart from Supabase to get updated state
      await loadUserCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Update product quantity (only for authenticated users)
  const updateQuantity = async (productId: string, quantity: number): Promise<void> => {
    if (!state.isAuthenticated || !user?.id) return;

    if (quantity <= 0) {
      // If quantity is 0 or less, remove the item
      await removeFromCart(productId);
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Update in Supabase
      await cartService.updateCartItemQuantity(user.id, productId, quantity);
      
      // Reload cart from Supabase to get updated state
      await loadUserCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Clear entire cart (only for authenticated users)
  const clearCart = async (): Promise<void> => {
    if (!state.isAuthenticated || !user?.id) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Clear from Supabase
      await cartService.clearCart(user.id);
      
      // Reload cart from Supabase to get updated state
      await loadUserCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <CartContext.Provider value={{ 
      state,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};