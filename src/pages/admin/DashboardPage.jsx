import React from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users,
  TrendingUp,
  ArrowRight,
  Eye,
  PoundSterling
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useOrders } from '../../context/OrderContext';
import { useSettings } from '../../context/SettingsContext';
import StatsCard from '../../components/admin/StatsCard';
import Button from '../../components/common/Button';

const DashboardPage = () => {
  const { getProductStats, loading: productsLoading } = useProducts();
  const { getOrderStats, getRecentOrders, loading: ordersLoading } = useOrders();
  const { formatPrice } = useSettings();

  const productStats = getProductStats();
  const orderStats = getOrderStats();
  const recentOrders = getRecentOrders(5);

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Processing': return 'bg-blue-100 text-blue-700';
      case 'Shipped': return 'bg-indigo-100 text-indigo-700';
      case 'Delivered': return 'bg-green-100 text-green-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-secondary-100 text-secondary-700';
    }
  };

  const loading = productsLoading || ordersLoading;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Dashboard</h1>
          <p className="text-secondary-500">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/admin/products/add">
            <Button variant="primary" size="sm" icon={Package}>
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={formatPrice(orderStats.totalRevenue)}
          icon={PoundSterling}
          color="green"
          trend="up"
          trendValue="12.5%"
          loading={loading}
        />
        <StatsCard
          title="Total Orders"
          value={orderStats.totalOrders}
          icon={ShoppingCart}
          color="blue"
          trend="up"
          trendValue="8.2%"
          loading={loading}
        />
        <StatsCard
          title="Total Products"
          value={productStats.totalProducts}
          icon={Package}
          color="primary"
          loading={loading}
        />
        <StatsCard
          title="Avg. Order Value"
          value={formatPrice(orderStats.averageOrderValue || 0)}
          icon={TrendingUp}
          color="orange"
          trend="up"
          trendValue="3.1%"
          loading={loading}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-secondary-100 overflow-hidden">
          <div className="p-6 border-b border-secondary-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-secondary-900">Recent Orders</h2>
            <Link to="/admin/orders">
              <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
                View All
              </Button>
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-secondary-50">
                  <th className="text-left py-3 px-6 text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="text-left py-3 px-6 text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right py-3 px-6 text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-secondary-50 transition-colors">
                      <td className="py-4 px-6 font-medium text-primary-600">
                        #{order.id}
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-medium text-secondary-900">{order.customerName}</p>
                        <p className="text-sm text-secondary-500">{order.customerEmail}</p>
                      </td>
                      <td className="py-4 px-6 font-medium text-secondary-900">
                        {formatPrice(order.total)}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`badge ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link to="/admin/orders">
                          <button className="text-secondary-400 hover:text-primary-600 transition-colors">
                            <Eye size={18} />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-secondary-500">
                      No orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Stats / Quick Stats */}
        <div className="space-y-6">
          {/* Order Status Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">Order Status</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-secondary-600">Pending</span>
                </div>
                <span className="font-semibold text-secondary-900">{orderStats.pendingOrders}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-secondary-600">Processing</span>
                </div>
                <span className="font-semibold text-secondary-900">{orderStats.processingOrders}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                  <span className="text-secondary-600">Shipped</span>
                </div>
                <span className="font-semibold text-secondary-900">{orderStats.shippedOrders}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-secondary-600">Delivered</span>
                </div>
                <span className="font-semibold text-secondary-900">{orderStats.deliveredOrders}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-secondary-600">Cancelled</span>
                </div>
                <span className="font-semibold text-secondary-900">{orderStats.cancelledOrders}</span>
              </div>
            </div>
          </div>

          {/* Product Stock Alert */}
          <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">Inventory Alert</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-red-700">Out of Stock</p>
                  <p className="text-sm text-red-600">Products need restocking</p>
                </div>
                <span className="text-2xl font-bold text-red-700">{productStats.outOfStockProducts}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium text-yellow-700">Low Stock</p>
                  <p className="text-sm text-yellow-600">Less than 10 items</p>
                </div>
                <span className="text-2xl font-bold text-yellow-700">{productStats.lowStockProducts}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-green-700">Total Stock</p>
                  <p className="text-sm text-green-600">All products</p>
                </div>
                <span className="text-2xl font-bold text-green-700">{productStats.totalStock}</span>
              </div>
            </div>

            <Link to="/admin/products">
              <Button variant="outline" fullWidth className="mt-4" size="sm">
                Manage Inventory
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6">
        <h2 className="text-lg font-semibold text-secondary-900 mb-6">Products by Category</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {productStats.categoryCounts?.map((category, index) => (
            <div 
              key={index}
              className="bg-secondary-50 rounded-lg p-4 text-center hover:bg-secondary-100 transition-colors"
            >
              <p className="text-2xl font-bold text-primary-600 mb-1">{category.count}</p>
              <p className="text-sm text-secondary-600">{category.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;