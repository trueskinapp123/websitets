import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  Package, 
  Users, 
  DollarSign, 
  Search, 
  ChevronDown, 
  ChevronUp,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  RefreshCw,
  AlertCircle,
  UserCircle
} from 'lucide-react';
import { Order, OrderItem } from '../services/orderService';

interface OrderWithItems extends Order {
  items: OrderItem[];
}

interface User {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  orderCount: number;
}

// Use relative URL for Vercel deployment, fallback to env var or localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? '' : 'http://localhost:3001');

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderWithItems[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'users'>('orders');
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    paidOrders: 0,
    totalUsers: 0
  });

  // Check authentication on mount
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('admin_authenticated');
    const adminEmail = localStorage.getItem('admin_email');
    if (!isAuthenticated || isAuthenticated !== 'true' || adminEmail !== 'ceo@trueskin.app') {
      navigate('/admin/login');
    }
  }, [navigate]);

  // Fetch all orders from backend API
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const adminEmail = localStorage.getItem('admin_email');
      const response = await fetch(`${API_BASE_URL}/api/admin/orders`, {
        headers: {
          'x-admin-email': adminEmail || 'ceo@trueskin.app',
          'x-admin-token': 'admin_authenticated',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch orders');
      }

      const ordersData = result.data || [];
      
      // Ensure shippingAddress is properly parsed
      const ordersWithItems: OrderWithItems[] = ordersData.map((order: any) => {
        let shippingAddress = order.shippingAddress;
        if (typeof shippingAddress === 'string') {
          try {
            shippingAddress = JSON.parse(shippingAddress);
          } catch (e) {
            shippingAddress = { street: '', city: '', state: '', zip: '' };
          }
        }
        
        return {
          ...order,
          shippingAddress: shippingAddress || { street: '', city: '', state: '', zip: '' },
          totalAmount: typeof order.totalAmount === 'string' ? parseFloat(order.totalAmount) : order.totalAmount,
          items: (order.items || []).map((item: any) => ({
            ...item,
            price: typeof item.price === 'string' ? parseFloat(item.price) : item.price
          }))
        };
      });

      setOrders(ordersWithItems);
      setFilteredOrders(ordersWithItems);

      // Calculate stats
      const totalRevenue = ordersWithItems
        .filter(o => o.status === 'paid')
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      
      const pendingOrders = ordersWithItems.filter(o => o.status === 'pending').length;
      const paidOrders = ordersWithItems.filter(o => o.status === 'paid').length;

      setStats(prev => ({
        ...prev,
        totalOrders: ordersWithItems.length,
        totalRevenue,
        pendingOrders,
        paidOrders
      }));
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      setError(error.message || 'Failed to load orders. Please check your backend connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all users from backend API
  const fetchUsers = async () => {
    try {
      setError(null);
      
      const adminEmail = localStorage.getItem('admin_email');
      const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
        headers: {
          'x-admin-email': adminEmail || 'ceo@trueskin.app',
          'x-admin-token': 'admin_authenticated',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch users');
      }

      const usersData = result.data || [];
      setUsers(usersData);
      
      setStats(prev => ({
        ...prev,
        totalUsers: usersData.length
      }));
    } catch (error: any) {
      console.error('Error fetching users:', error);
      setError(error.message || 'Failed to load users. Please check your backend connection.');
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchUsers();
  }, []);

  // Filter orders
  useEffect(() => {
    let filtered = orders;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerPhone?.includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_email');
    navigate('/admin/login');
  };

  const handleRefresh = () => {
    if (activeTab === 'orders') {
      fetchOrders();
    } else {
      fetchUsers();
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="h-4 w-4" />, label: 'Pending' },
      paid: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-4 w-4" />, label: 'Paid' },
      processing: { color: 'bg-blue-100 text-blue-800', icon: <RefreshCw className="h-4 w-4" />, label: 'Processing' },
      shipped: { color: 'bg-purple-100 text-purple-800', icon: <Truck className="h-4 w-4" />, label: 'Shipped' },
      delivered: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-4 w-4" />, label: 'Delivered' },
      failed: { color: 'bg-red-100 text-red-800', icon: <XCircle className="h-4 w-4" />, label: 'Failed' },
      cancelled: { color: 'bg-gray-100 text-gray-800', icon: <XCircle className="h-4 w-4" />, label: 'Cancelled' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#b66837] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-playfair">Admin Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Manage orders and customers</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh data"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Error loading data</p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
              <p className="text-xs text-red-500 mt-2">
                Make sure your backend server is running at {API_BASE_URL} and has the Supabase service role key configured.
              </p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Orders</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Revenue</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-2 truncate">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Paid Orders</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">{stats.paidOrders}</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Pending Orders</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">{stats.pendingOrders}</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Users</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6 border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'orders'
                    ? 'border-[#b66837] text-[#b66837]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Package className="h-4 w-4" />
                  <span>Orders ({orders.length})</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'users'
                    ? 'border-[#b66837] text-[#b66837]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Users ({users.length})</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="p-4 sm:p-6">
              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email, phone, or order ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b66837] focus:border-transparent text-sm"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b66837] focus:border-transparent text-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="failed">Failed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Orders List */}
              {filteredOrders.length === 0 ? (
                <div className="p-12 text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No orders found</p>
                  {searchTerm || statusFilter !== 'all' ? (
                    <p className="text-sm text-gray-500 mt-2">Try adjusting your filters</p>
                  ) : null}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-3">
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-gray-600">Order ID</p>
                              <p className="text-base sm:text-lg font-semibold text-gray-900 truncate">{order.id.slice(0, 8).toUpperCase()}</p>
                            </div>
                            {getStatusBadge(order.status)}
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-gray-600">Amount</p>
                              <p className="text-base sm:text-lg font-bold text-[#b66837]">{formatCurrency(order.totalAmount)}</p>
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-gray-600">Date</p>
                              <p className="text-xs sm:text-sm text-gray-900">{formatDate(order.createdAt)}</p>
                            </div>
                          </div>

                          {/* Customer Info */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-3">
                            <div className="flex items-center gap-2 text-sm min-w-0">
                              <Users className="h-4 w-4 text-gray-400 flex-shrink-0" />
                              <span className="font-medium text-gray-900 truncate">{order.customerName || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm min-w-0">
                              <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                              <a href={`mailto:${order.customerEmail}`} className="text-[#b66837] hover:underline truncate">
                                {order.customerEmail || 'N/A'}
                              </a>
                            </div>
                            <div className="flex items-center gap-2 text-sm min-w-0">
                              <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                              <a href={`tel:${order.customerPhone}`} className="text-gray-900 truncate">
                                {order.customerPhone || 'N/A'}
                              </a>
                            </div>
                          </div>

                          {/* Shipping Address & Order Items */}
                          {expandedOrder === order.id && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                              {/* Shipping Address */}
                              {order.shippingAddress && (
                                <div className="flex items-start gap-2 mb-4">
                                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-700 mb-1">Shipping Address</p>
                                    <p className="text-sm text-gray-600 break-words">
                                      {order.shippingAddress.street || 'N/A'}<br />
                                      {order.shippingAddress.city || ''}, {order.shippingAddress.state || ''} {order.shippingAddress.zip || ''}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* Order Items */}
                              {order.items && order.items.length > 0 && (
                                <div className="mt-4">
                                  <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <ShoppingBag className="h-4 w-4" />
                                    Order Items ({order.items.length})
                                  </p>
                                  <div className="space-y-2">
                                    {order.items.map((item) => (
                                      <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded text-sm">
                                        <div className="min-w-0 flex-1">
                                          <p className="font-medium text-gray-900 truncate">Product ID: {item.productId}</p>
                                          <p className="text-xs text-gray-600">Quantity: {item.quantity}</p>
                                        </div>
                                        <p className="font-semibold text-gray-900 ml-4 flex-shrink-0">
                                          {formatCurrency((item.price || 0) * (item.quantity || 0))}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Payment Info */}
                              {(order.paymentId || order.razorpayOrderId) && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                  {order.paymentId && (
                                    <p className="text-xs text-gray-600 break-words">
                                      <span className="font-medium">Payment ID:</span> {order.paymentId}
                                    </p>
                                  )}
                                  {order.razorpayOrderId && (
                                    <p className="text-xs text-gray-600 mt-1 break-words">
                                      <span className="font-medium">Razorpay Order ID:</span> {order.razorpayOrderId}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Expand/Collapse Button */}
                        <button
                          onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                          className="self-start sm:self-center p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                          aria-label={expandedOrder === order.id ? 'Collapse' : 'Expand'}
                        >
                          {expandedOrder === order.id ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="p-4 sm:p-6">
              {users.length === 0 ? (
                <div className="p-12 text-center">
                  <UserCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No users found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <UserCircle className="h-8 w-8 text-gray-400 mr-3" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{user.fullName || 'N/A'}</div>
                                <div className="text-xs text-gray-500 truncate max-w-[150px]">{user.id.slice(0, 8)}...</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <a href={`mailto:${user.email}`} className="text-sm text-[#b66837] hover:underline">
                              {user.email}
                            </a>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.phone || 'N/A'}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {user.orderCount}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(user.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
