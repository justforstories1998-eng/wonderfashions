import React from 'react';
import { ShoppingCart, DollarSign, Clock, CheckCircle } from 'lucide-react';
import OrderTable from '../../components/admin/OrderTable';
import { useOrders } from '../../context/OrderContext';
import { useSettings } from '../../context/SettingsContext';

const OrdersPage = () => {
  const { getOrderStats } = useOrders();
  const { formatPrice } = useSettings();
  
  // Safely get stats
  const stats = getOrderStats() || { 
    totalOrders: 0, 
    totalRevenue: 0, 
    pendingOrders: 0, 
    deliveredOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    cancelledOrders: 0
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 flex items-center gap-3">
            <ShoppingCart className="text-primary-600" size={28} />
            Orders
          </h1>
          <p className="text-secondary-500 mt-1">
            Manage and track all customer orders ({stats.totalOrders} total orders)
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Orders */}
        <div className="bg-white p-4 rounded-xl border border-secondary-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
            <ShoppingCart size={24} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-secondary-500">Total Orders</p>
            <p className="text-2xl font-bold text-secondary-900">{stats.totalOrders}</p>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-4 rounded-xl border border-secondary-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
            <DollarSign size={24} className="text-green-600" />
          </div>
          <div>
            <p className="text-sm text-secondary-500">Total Revenue</p>
            <p className="text-2xl font-bold text-secondary-900">{formatPrice(stats.totalRevenue)}</p>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-4 rounded-xl border border-secondary-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
            <Clock size={24} className="text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-secondary-500">Pending</p>
            <p className="text-2xl font-bold text-secondary-900">{stats.pendingOrders}</p>
          </div>
        </div>

        {/* Delivered Orders */}
        <div className="bg-white p-4 rounded-xl border border-secondary-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
            <CheckCircle size={24} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-sm text-secondary-500">Delivered</p>
            <p className="text-2xl font-bold text-secondary-900">{stats.deliveredOrders}</p>
          </div>
        </div>
      </div>

      {/* Order Status Summary */}
      <div className="bg-white rounded-xl border border-secondary-100 p-4">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span className="font-medium text-secondary-700">Order Status:</span>
          
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-secondary-600">Pending ({stats.pendingOrders})</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-secondary-600">Processing ({stats.processingOrders})</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
            <span className="text-secondary-600">Shipped ({stats.shippedOrders})</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-secondary-600">Delivered ({stats.deliveredOrders})</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-secondary-600">Cancelled ({stats.cancelledOrders})</span>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <OrderTable />
    </div>
  );
};

export default OrdersPage;