import React, { useState } from 'react';
import { 
  Eye, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Package,
  Calendar,
  CreditCard,
  User,
  MapPin,
  X,
  Globe
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../common/Toast';
import Button, { IconButton } from '../common/Button';
import Modal from '../common/Modal';

const OrderTable = () => {
  const { 
    orders, 
    updateOrderStatus, 
    orderStatuses, 
    loading 
  } = useOrders();
  const { formatPrice, getTaxName } = useSettings();
  const toast = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [countryFilter, setCountryFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const taxName = getTaxName() || 'VAT';

  // FIX: Flatten orders from both countries into one array
  const allOrders = [
    ...(orders.uk || []).map(o => ({ ...o, country: 'uk' })),
    ...(orders.india || []).map(o => ({ ...o, country: 'india' }))
  ];

  // Filter orders
  const filteredOrders = allOrders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    const matchesCountry = countryFilter === 'All' || order.country === countryFilter;
    
    return matchesSearch && matchesStatus && matchesCountry;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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

  const handleStatusChange = (orderId, newStatus) => {
    // Pass the country explicitly if we know it, otherwise context handles search
    updateOrderStatus(orderId, newStatus, null, selectedOrder?.country);
    toast.success(`Order status updated to ${newStatus}`);
    
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => ({ ...prev, status: newStatus }));
    }
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-secondary-500">Loading orders...</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-secondary-200 flex flex-col h-full">
        {/* Toolbar */}
        <div className="p-4 border-b border-secondary-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search ID, name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Country Filter */}
            <div className="relative">
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="pl-9 pr-8 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm appearance-none bg-white cursor-pointer"
              >
                <option value="All">All Countries</option>
                <option value="uk">United Kingdom</option>
                <option value="india">India</option>
              </select>
              <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-500" />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-9 pr-8 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm appearance-none bg-white cursor-pointer"
              >
                <option value="All">All Statuses</option>
                {orderStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-500" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-grow">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Country</th>
                <th>Date</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              {currentItems.length > 0 ? (
                currentItems.map((order) => (
                  <tr key={order.id} className="group hover:bg-secondary-50 transition-colors">
                    <td className="py-3 px-6 font-medium text-primary-600">
                      #{order.id}
                    </td>
                    <td className="py-3 px-6">
                      <p className="font-medium text-secondary-900">{order.customerName}</p>
                      <p className="text-xs text-secondary-500">{order.customerEmail}</p>
                    </td>
                    <td className="py-3 px-6">
                      <span className="inline-flex items-center px-2 py-1 bg-secondary-100 text-xs font-medium rounded text-secondary-700 uppercase">
                        {order.country === 'india' ? '🇮🇳 IN' : '🇬🇧 UK'}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-secondary-600 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-6 font-medium text-secondary-900">
                      {order.country === 'india' ? '₹' : '£'}{order.total.toFixed(2)}
                    </td>
                    <td className="py-3 px-6">
                      <span className={`badge ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-6">
                      <span className={`badge ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-right">
                      <IconButton 
                        icon={Eye} 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openOrderDetails(order)}
                        className="text-secondary-400 hover:text-primary-600"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-secondary-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredOrders.length > itemsPerPage && (
          <div className="p-4 border-t border-secondary-200 flex items-center justify-between">
            <p className="text-sm text-secondary-500">
              Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">{Math.min(indexOfLastItem, filteredOrders.length)}</span> of <span className="font-medium">{filteredOrders.length}</span> results
            </p>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-secondary-300 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                <button
                  key={number}
                  onClick={() => handlePageChange(number)}
                  className={`
                    w-8 h-8 rounded-lg text-sm font-medium transition-colors
                    ${currentPage === number 
                      ? 'bg-primary-600 text-white' 
                      : 'text-secondary-600 hover:bg-secondary-50 border border-secondary-200'}
                  `}
                >
                  {number}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-secondary-300 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Order Details - #${selectedOrder?.id}`}
        size="3xl"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-secondary-50 rounded-lg">
              <div className="flex items-start gap-3">
                <Calendar className="text-secondary-400 mt-1" size={20} />
                <div>
                  <p className="text-xs text-secondary-500 uppercase font-semibold">Order Date</p>
                  <p className="text-secondary-900">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard className="text-secondary-400 mt-1" size={20} />
                <div>
                  <p className="text-xs text-secondary-500 uppercase font-semibold">Payment Method</p>
                  <p className="text-secondary-900">{selectedOrder.paymentMethod}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${selectedOrder.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {selectedOrder.paymentStatus}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package className="text-secondary-400 mt-1" size={20} />
                <div className="w-full">
                  <p className="text-xs text-secondary-500 uppercase font-semibold mb-1">Status</p>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-secondary-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white"
                  >
                    {orderStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Addresses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="flex items-center gap-2 font-semibold text-secondary-900 mb-3 border-b pb-2">
                  <User size={18} className="text-secondary-500" />
                  Customer Information
                </h4>
                <div className="text-sm text-secondary-700 space-y-1">
                  <p className="font-medium">{selectedOrder.customerName}</p>
                  <p>{selectedOrder.customerEmail}</p>
                  <p>{selectedOrder.customerPhone}</p>
                </div>
              </div>
              <div>
                <h4 className="flex items-center gap-2 font-semibold text-secondary-900 mb-3 border-b pb-2">
                  <MapPin size={18} className="text-secondary-500" />
                  Shipping Address
                </h4>
                <div className="text-sm text-secondary-700 space-y-1">
                  <p>{selectedOrder.shippingAddress.street}</p>
                  <p>
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode || selectedOrder.shippingAddress.postcode}
                  </p>
                  <p>{selectedOrder.shippingAddress.country}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h4 className="font-semibold text-secondary-900 mb-3 border-b pb-2">Order Items</h4>
              <div className="space-y-3">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 py-2">
                    <div className="w-16 h-16 rounded-md bg-secondary-100 overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-secondary-900">{item.name}</p>
                      <p className="text-sm text-secondary-500">Size: {item.size} | Color: {item.color}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-secondary-500">{item.quantity} x {selectedOrder.country === 'india' ? '₹' : '£'}{item.price.toFixed(2)}</p>
                      <p className="font-medium text-secondary-900">{selectedOrder.country === 'india' ? '₹' : '£'}{(item.quantity * item.price).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="border-t border-secondary-200 pt-4 flex justify-end">
              <div className="w-full md:w-1/3 space-y-2">
                <div className="flex justify-between text-secondary-600">
                  <span>Subtotal</span>
                  <span>{selectedOrder.country === 'india' ? '₹' : '£'}{selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-secondary-600">
                  <span>Delivery</span>
                  <span>{selectedOrder.shipping === 0 ? 'Free' : `${selectedOrder.country === 'india' ? '₹' : '£'}${selectedOrder.shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-secondary-600">
                  <span>{taxName}</span>
                  <span>{selectedOrder.country === 'india' ? '₹' : '£'}{selectedOrder.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-secondary-900 border-t border-secondary-200 pt-2">
                  <span>Total</span>
                  <span className="text-primary-600">{selectedOrder.country === 'india' ? '₹' : '£'}{selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default OrderTable;