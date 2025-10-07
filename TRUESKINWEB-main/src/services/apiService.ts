// API Service for TrueSkin E-commerce
// Since this is a Vite React app (not Next.js), we'll use direct Supabase calls
// with proper error handling and response formatting

import { supabase } from '../lib/supabase';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export const apiService = {
  // Profile API endpoints
  profile: {
    async get(userId: string): Promise<ApiResponse<any>> {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          return { success: false, error: error.message };
        }

        return { success: true, data };
      } catch (error) {
        return { success: false, error: 'Failed to fetch profile' };
      }
    },

    async update(userId: string, updates: any): Promise<ApiResponse<any>> {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .update(updates)
          .eq('id', userId)
          .select()
          .single();

        if (error) {
          return { success: false, error: error.message };
        }

        return { success: true, data, message: 'Profile updated successfully' };
      } catch (error) {
        return { success: false, error: 'Failed to update profile' };
      }
    }
  },

  // Orders API endpoints
  orders: {
    async get(userId: string): Promise<ApiResponse<any[]>> {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              *,
              products (
                id,
                name,
                images
              )
            )
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) {
          return { success: false, error: error.message };
        }

        return { success: true, data: data || [] };
      } catch (error) {
        return { success: false, error: 'Failed to fetch orders' };
      }
    },

    async create(orderData: any): Promise<ApiResponse<any>> {
      try {
        // Create order
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: orderData.userId,
            customer_name: orderData.customerName,
            customer_email: orderData.customerEmail,
            customer_phone: orderData.customerPhone,
            total_amount: orderData.totalAmount,
            status: 'pending',
            shipping_address: orderData.shippingAddress,
            razorpay_order_id: orderData.razorpayOrderId
          })
          .select()
          .single();

        if (orderError) {
          return { success: false, error: orderError.message };
        }

        // Create order items
        const orderItems = orderData.cartItems.map((item: any) => ({
          order_id: order.id,
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) {
          // Rollback order creation
          await supabase.from('orders').delete().eq('id', order.id);
          return { success: false, error: itemsError.message };
        }

        return { success: true, data: order, message: 'Order created successfully' };
      } catch (error) {
        return { success: false, error: 'Failed to create order' };
      }
    },

    async updateStatus(orderId: string, status: string, paymentId?: string): Promise<ApiResponse<any>> {
      try {
        const updateData: any = { status };
        if (paymentId) {
          updateData.payment_id = paymentId;
        }

        const { data, error } = await supabase
          .from('orders')
          .update(updateData)
          .eq('id', orderId)
          .select()
          .single();

        if (error) {
          return { success: false, error: error.message };
        }

        return { success: true, data, message: 'Order status updated successfully' };
      } catch (error) {
        return { success: false, error: 'Failed to update order status' };
      }
    }
  },

  // Products API endpoints
  products: {
    async getAll(): Promise<ApiResponse<any[]>> {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, count, original_price, price, discount, description, rating, reviews, popular, images, created_at')
          .order('popular', { ascending: false })
          .order('created_at', { ascending: false });

        if (error) {
          return { success: false, error: error.message };
        }

        return { success: true, data: data || [] };
      } catch (error) {
        return { success: false, error: 'Failed to fetch products' };
      }
    },

    async getById(id: string): Promise<ApiResponse<any>> {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          return { success: false, error: error.message };
        }

        return { success: true, data };
      } catch (error) {
        return { success: false, error: 'Failed to fetch product' };
      }
    }
  },

  // Cart API endpoints
  cart: {
    async get(userId: string): Promise<ApiResponse<any[]>> {
      try {
        const { data, error } = await supabase
          .from('cart')
          .select(`
            *,
            products (
              id,
              name,
              price,
              images
            )
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) {
          return { success: false, error: error.message };
        }

        return { success: true, data: data || [] };
      } catch (error) {
        return { success: false, error: 'Failed to fetch cart' };
      }
    },

    async add(userId: string, productId: string, quantity: number = 1): Promise<ApiResponse<any>> {
      try {
        const { data, error } = await supabase
          .from('cart')
          .upsert({
            user_id: userId,
            product_id: productId,
            quantity: quantity
          })
          .select()
          .single();

        if (error) {
          return { success: false, error: error.message };
        }

        return { success: true, data, message: 'Item added to cart' };
      } catch (error) {
        return { success: false, error: 'Failed to add item to cart' };
      }
    },

    async update(userId: string, productId: string, quantity: number): Promise<ApiResponse<any>> {
      try {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or less
          const { error } = await supabase
            .from('cart')
            .delete()
            .eq('user_id', userId)
            .eq('product_id', productId);

          if (error) {
            return { success: false, error: error.message };
          }

          return { success: true, message: 'Item removed from cart' };
        }

        const { data, error } = await supabase
          .from('cart')
          .update({ quantity })
          .eq('user_id', userId)
          .eq('product_id', productId)
          .select()
          .single();

        if (error) {
          return { success: false, error: error.message };
        }

        return { success: true, data, message: 'Cart updated successfully' };
      } catch (error) {
        return { success: false, error: 'Failed to update cart' };
      }
    },

    async clear(userId: string): Promise<ApiResponse<any>> {
      try {
        const { error } = await supabase
          .from('cart')
          .delete()
          .eq('user_id', userId);

        if (error) {
          return { success: false, error: error.message };
        }

        return { success: true, message: 'Cart cleared successfully' };
      } catch (error) {
        return { success: false, error: 'Failed to clear cart' };
      }
    }
  }
};

export default apiService;
