import { supabase } from '../lib/supabase';
import { CartItem } from '../contexts/CartContext';

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalAmount: number;
  status: 'pending' | 'paid' | 'failed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  paymentId?: string;
  razorpayOrderId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  createdAt: string;
}

export interface CreateOrderData {
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  cartItems: CartItem[];
  razorpayOrderId?: string;
}

export const orderService = {
  // Create a new order
  async createOrder(orderData: CreateOrderData): Promise<Order | null> {
    try {
      console.log('Creating order with data:', orderData);
      
      // Calculate total amount
      const totalAmount = orderData.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      console.log('Calculated total amount:', totalAmount);

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: orderData.userId,
          customer_name: orderData.customerName,
          customer_email: orderData.customerEmail,
          customer_phone: orderData.customerPhone,
          total_amount: totalAmount,
          status: 'pending',
          shipping_address: orderData.shippingAddress,
          razorpay_order_id: orderData.razorpayOrderId
        })
        .select()
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError);
        console.error('Order data that failed:', {
          user_id: orderData.userId,
          customer_name: orderData.customerName,
          customer_email: orderData.customerEmail,
          customer_phone: orderData.customerPhone,
          total_amount: totalAmount,
          status: 'pending',
          shipping_address: orderData.shippingAddress,
          razorpay_order_id: orderData.razorpayOrderId
        });
        return null;
      }

      console.log('Order created successfully:', order);

      // Create order items
      const orderItems = orderData.cartItems.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      console.log('Creating order items:', orderItems);

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        // Rollback order creation
        await supabase.from('orders').delete().eq('id', order.id);
        return null;
      }

      console.log('Order items created successfully');

      return {
        id: order.id,
        userId: order.user_id,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerPhone: order.customer_phone,
        totalAmount: order.total_amount,
        status: order.status,
        shippingAddress: order.shipping_address,
        paymentId: order.payment_id,
        razorpayOrderId: order.razorpay_order_id,
        createdAt: order.created_at,
        updatedAt: order.updated_at
      };
    } catch (error) {
      console.error('Error in createOrder:', error);
      return null;
    }
  },

  // Get orders for a user
  async getOrders(userId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        return [];
      }

      return data?.map(order => ({
        id: order.id,
        userId: order.user_id,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerPhone: order.customer_phone,
        totalAmount: order.total_amount,
        status: order.status,
        shippingAddress: order.shipping_address,
        paymentId: order.payment_id,
        razorpayOrderId: order.razorpay_order_id,
        createdAt: order.created_at,
        updatedAt: order.updated_at
      })) || [];
    } catch (error) {
      console.error('Error in getOrders:', error);
      return [];
    }
  },

  // Get order by ID
  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) {
        console.error('Error fetching order:', error);
        return null;
      }

      return {
        id: data.id,
        userId: data.user_id,
        customerName: data.customer_name,
        customerEmail: data.customer_email,
        customerPhone: data.customer_phone,
        totalAmount: data.total_amount,
        status: data.status,
        shippingAddress: data.shipping_address,
        paymentId: data.payment_id,
        razorpayOrderId: data.razorpay_order_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('Error in getOrderById:', error);
      return null;
    }
  },

  // Get order items for an order
  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

      if (error) {
        console.error('Error fetching order items:', error);
        return [];
      }

      return data?.map(item => ({
        id: item.id,
        orderId: item.order_id,
        productId: item.product_id,
        quantity: item.quantity,
        price: item.price,
        createdAt: item.created_at
      })) || [];
    } catch (error) {
      console.error('Error in getOrderItems:', error);
      return [];
    }
  },

  // Update order status
  async updateOrderStatus(orderId: string, status: Order['status'], paymentId?: string): Promise<boolean> {
    try {
      const updateData: any = { status };
      if (paymentId) {
        updateData.payment_id = paymentId;
      }

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);

      if (error) {
        console.error('Error updating order status:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateOrderStatus:', error);
      return false;
    }
  },

  // Get order by Razorpay order ID
  async getOrderByRazorpayOrderId(razorpayOrderId: string): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('razorpay_order_id', razorpayOrderId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Order not found
        }
        console.error('Error fetching order by Razorpay order ID:', error);
        return null;
      }

      return {
        id: data.id,
        userId: data.user_id,
        customerName: data.customer_name,
        customerEmail: data.customer_email,
        customerPhone: data.customer_phone,
        totalAmount: data.total_amount,
        status: data.status,
        shippingAddress: data.shipping_address,
        paymentId: data.payment_id,
        razorpayOrderId: data.razorpay_order_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('Error in getOrderByRazorpayOrderId:', error);
      return null;
    }
  },

  // Clear user's cart after successful order
  async clearUserCart(userId: string): Promise<boolean> {
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
      console.error('Error in clearUserCart:', error);
      return false;
    }
  },

  // Send order confirmation email to admin
  async sendOrderConfirmationEmail(order: Order, orderItems: OrderItem[]): Promise<boolean> {
    try {
      const { sendOrderConfirmation } = await import('../lib/email');
      
      const emailData = {
        to: 'amaamafatima67@gmail.com',
        subject: 'New Order Received - TrueSkin',
        order: {
          id: order.id,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          customerPhone: order.customerPhone,
          totalAmount: order.totalAmount,
          shippingAddress: order.shippingAddress,
          items: orderItems,
          createdAt: order.createdAt
        }
      };

      return await sendOrderConfirmation(emailData);
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
      return false;
    }
  },

  // Send order confirmation email to customer
  async sendCustomerOrderConfirmation(order: Order, orderItems: OrderItem[]): Promise<boolean> {
    try {
      const { sendOrderConfirmation } = await import('../lib/email');
      
      const emailData = {
        to: order.customerEmail,
        subject: 'Order Confirmation - TrueSkin',
        order: {
          id: order.id,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          customerPhone: order.customerPhone,
          totalAmount: order.totalAmount,
          shippingAddress: order.shippingAddress,
          items: orderItems,
          createdAt: order.createdAt
        }
      };

      return await sendOrderConfirmation(emailData);
    } catch (error) {
      console.error('Error sending customer order confirmation email:', error);
      return false;
    }
  },

  // Complete order placement with all necessary steps
  async placeOrder(orderData: CreateOrderData): Promise<{ order: Order | null; success: boolean; error?: string }> {
    try {
      // Create the order
      const order = await this.createOrder(orderData);
      if (!order) {
        return { order: null, success: false, error: 'Failed to create order' };
      }

      // Get order items for email notifications
      const orderItems = await this.getOrderItems(order.id);
      
      // Send email notifications (don't fail the order if emails fail)
      try {
        await Promise.all([
          this.sendOrderConfirmationEmail(order, orderItems),
          this.sendCustomerOrderConfirmation(order, orderItems)
        ]);
      } catch (emailError) {
        console.warn('Email notifications failed, but order was created:', emailError);
      }

      // Clear user's cart after successful order
      if (orderData.userId !== 'guest') {
        await this.clearUserCart(orderData.userId);
      }

      return { order, success: true };
    } catch (error) {
      console.error('Error in placeOrder:', error);
      return { order: null, success: false, error: 'Failed to place order' };
    }
  }
};
