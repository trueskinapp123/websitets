import { supabase } from '../lib/supabase';
import { CartItem } from '../contexts/CartContext';

export const cartService = {
  // Get cart items for an authenticated user from Supabase cart table
  // Returns empty array if user is not authenticated or on error
  async getCartItems(userId: string): Promise<CartItem[]> {
    if (!userId) {
      console.warn('getCartItems called without userId');
      return [];
    }
    try {
      const { data, error } = await supabase
        .from('cart')
        .select(`
          *,
          products (
            id,
            name,
            count,
            original_price,
            price,
            discount,
            description,
            rating,
            reviews,
            popular,
            images
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching cart items:', error);
        return [];
      }

      return data?.map(item => ({
        id: item.products.id,
        name: item.products.name,
        count: item.products.count,
        originalPrice: item.products.original_price,
        price: item.products.price,
        discount: item.products.discount,
        description: item.products.description,
        rating: item.products.rating,
        reviews: item.products.reviews,
        popular: item.products.popular || false,
        images: item.products.images || [],
        quantity: item.quantity
      })) || [];
    } catch (error) {
      console.error('Error in getCartItems:', error);
      return [];
    }
  },

  // Add item to cart for authenticated users only
  // Returns false if user is not authenticated or on error
  async addToCart(userId: string, productId: string, quantity: number = 1): Promise<boolean> {
    if (!userId) {
      console.warn('addToCart called without userId');
      return false;
    }
    try {
      // Check if item already exists in cart
      const { data: existingItem } = await supabase
        .from('cart')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .single();

      if (existingItem) {
        // Update quantity
        const { error } = await supabase
          .from('cart')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id);

        if (error) {
          console.error('Error updating cart item:', error);
          return false;
        }
      } else {
        // Insert new item
        const { error } = await supabase
          .from('cart')
          .insert({
            user_id: userId,
            product_id: productId,
            quantity
          });

        if (error) {
          console.error('Error adding to cart:', error);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error in addToCart:', error);
      return false;
    }
  },

  // Update cart item quantity for authenticated users only
  // Returns false if user is not authenticated or on error
  async updateCartItemQuantity(userId: string, productId: string, quantity: number): Promise<boolean> {
    if (!userId) {
      console.warn('updateCartItemQuantity called without userId');
      return false;
    }
    try {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        return await this.removeFromCart(userId, productId);
      }

      // Check if item exists in cart
      const { data: existingItem } = await supabase
        .from('cart')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .single();

      if (existingItem) {
        // Update existing item
        const { error } = await supabase
          .from('cart')
          .update({ quantity })
          .eq('user_id', userId)
          .eq('product_id', productId);

        if (error) {
          console.error('Error updating cart item quantity:', error);
          return false;
        }
      } else {
        // Insert new item if it doesn't exist
        const { error } = await supabase
          .from('cart')
          .insert({
            user_id: userId,
            product_id: productId,
            quantity
          });

        if (error) {
          console.error('Error inserting cart item:', error);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error in updateCartItemQuantity:', error);
      return false;
    }
  },

  // Remove item from cart for authenticated users only
  // Returns false if user is not authenticated or on error
  async removeFromCart(userId: string, productId: string): Promise<boolean> {
    if (!userId) {
      console.warn('removeFromCart called without userId');
      return false;
    }
    try {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);

      if (error) {
        console.error('Error removing from cart:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in removeFromCart:', error);
      return false;
    }
  },

  // Clear entire cart for authenticated users only
  // Returns false if user is not authenticated or on error
  async clearCart(userId: string): Promise<boolean> {
    if (!userId) {
      console.warn('clearCart called without userId');
      return false;
    }
    try {
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', userId);

      if (error) {
        console.error('Error clearing cart:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in clearCart:', error);
      return false;
    }
  }
};
