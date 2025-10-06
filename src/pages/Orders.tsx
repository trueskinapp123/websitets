import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import Navigation from '../components/Navigation';
import { Package, Clock, CheckCircle, XCircle, Truck, MapPin, Calendar, ChevronDown, ChevronUp, Loader } from 'lucide-react';

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
  products: {
    id: string;
    name: string;
    images: string[];
  };
}

interface Order {
  id: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_amount: number;
  status: string;
  shipping_address: any;
  payment_id?: string;
  razorpay_order_id?: string;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const ordersData = await userService.getUserOrders(user.id);
      console.log('Orders loaded:', ordersData);
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'paid':
      case 'processing':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-stone-50">
        <div className="bg-white shadow-sm">
          <Navigation />
        </div>
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h1 className="font-playfair text-3xl font-bold text-[#803716] mb-4">
              Please Sign In
            </h1>
            <p className="font-lato text-gray-600 mb-8">
              You need to be signed in to view your orders.
            </p>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('openAuthModal'))}
              className="bg-[#e58f5a] hover:bg-[#b66837] text-white px-8 py-3 rounded-full font-lato font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Navigation */}
      <div className="bg-white shadow-sm">
        <Navigation />
      </div>

      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-stone-100 to-amber-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="font-playfair text-5xl lg:text-6xl font-bold text-[#803716] mb-6">
            My Orders
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#e58f5a] to-[#b66837] rounded-full mx-auto mb-6"></div>
          <p className="font-lato text-xl text-[#874c2b] max-w-2xl mx-auto">
            Track your orders and view order history
          </p>
        </div>
      </section>

      {/* Orders Content */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          {isLoading ? (
            <div className="text-center py-12">
              <Loader className="w-12 h-12 text-[#b66837] mx-auto mb-4 animate-spin" />
              <p className="font-lato text-lg text-[#874c2b]">Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h2 className="font-playfair text-2xl font-bold text-[#803716] mb-4">
                No Orders Yet
              </h2>
              <p className="font-lato text-gray-600 mb-8">
                You haven't placed any orders yet. Start shopping to see your orders here.
              </p>
              <a
                href="/shop"
                className="bg-[#e58f5a] hover:bg-[#b66837] text-white px-8 py-3 rounded-full font-lato font-semibold transition-all duration-300 transform hover:scale-105 inline-block"
              >
                Start Shopping
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <span className={`px-3 py-1 rounded-full text-sm font-lato font-medium ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-playfair text-lg font-bold text-[#803716]">
                            Order #{order.id.slice(-8).toUpperCase()}
                          </h3>
                          <p className="font-lato text-sm text-gray-600 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {formatDate(order.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-playfair text-xl font-bold text-[#803716]">
                          ₹{order.total_amount.toFixed(2)}
                        </p>
                        <button
                          onClick={() => toggleOrderExpansion(order.id)}
                          className="font-lato text-sm text-[#b66837] hover:text-[#803716] transition-colors duration-300 flex items-center gap-1"
                        >
                          {expandedOrders.has(order.id) ? 'Hide Details' : 'View Details'}
                          {expandedOrders.has(order.id) ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Order Details (Expandable) */}
                  {expandedOrders.has(order.id) && (
                    <div className="p-6 bg-gray-50">
                      <div className="grid lg:grid-cols-2 gap-8">
                        {/* Order Items */}
                        <div>
                          <h4 className="font-playfair text-lg font-bold text-[#803716] mb-4">
                            Order Items
                          </h4>
                          <div className="space-y-4">
                            {order.order_items?.map((item) => (
                              <div key={item.id} className="flex items-center gap-4 p-4 bg-white rounded-lg">
                                <img
                                  src={item.products?.images?.[0] || '/images/p4.png'}
                                  alt={item.products?.name}
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                  <h5 className="font-lato font-semibold text-[#803716]">
                                    {item.products?.name || 'Product'}
                                  </h5>
                                  <p className="font-lato text-sm text-gray-600">
                                    Quantity: {item.quantity}
                                  </p>
                                  <p className="font-lato text-sm text-[#b66837] font-semibold">
                                    ₹{item.price.toFixed(2)} each
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-playfair text-lg font-bold text-[#803716]">
                                    ₹{(item.price * item.quantity).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Shipping Information */}
                        <div>
                          <h4 className="font-playfair text-lg font-bold text-[#803716] mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            Shipping Information
                          </h4>
                          <div className="bg-white p-4 rounded-lg">
                            <p className="font-lato font-semibold text-[#803716]">
                              {order.customer_name}
                            </p>
                            <p className="font-lato text-gray-600">
                              {order.customer_email}
                            </p>
                            <p className="font-lato text-gray-600">
                              {order.customer_phone}
                            </p>
                            {order.shipping_address && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <p className="font-lato text-gray-900">
                                  {order.shipping_address.street}
                                </p>
                                <p className="font-lato text-gray-900">
                                  {order.shipping_address.city}, {order.shipping_address.state}
                                </p>
                                <p className="font-lato text-gray-900">
                                  {order.shipping_address.zip}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Payment Information */}
                          {order.payment_id && (
                            <div className="mt-6">
                              <h5 className="font-playfair text-md font-bold text-[#803716] mb-2">
                                Payment Information
                              </h5>
                              <div className="bg-white p-4 rounded-lg">
                                <p className="font-lato text-sm text-gray-600">
                                  Payment ID: {order.payment_id}
                                </p>
                                {order.razorpay_order_id && (
                                  <p className="font-lato text-sm text-gray-600">
                                    Razorpay Order ID: {order.razorpay_order_id}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Orders;
