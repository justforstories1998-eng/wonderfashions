import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useSettings } from '../../context/SettingsContext';
import { ConfirmModal } from '../common/Modal';
import { useToast } from '../common/Toast';
import Button, { IconButton } from '../common/Button';

const ProductTable = () => {
  const { products, deleteProduct, loading } = useProducts();
  const { formatPrice } = useSettings();
  const toast = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');

  // Unique categories for filter
  const categories = ['All', ...new Set(products.map(p => p.category))];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || product.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      toast.success('Product deleted successfully');
      setDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  // Render Status Badge
  const renderStatus = (stock) => {
    if (stock === 0) {
      return <span className="badge bg-red-100 text-red-700">Out of Stock</span>;
    } else if (stock < 10) {
      return <span className="badge bg-yellow-100 text-yellow-700">Low Stock</span>;
    }
    return <span className="badge bg-green-100 text-green-700">In Stock</span>;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-secondary-500">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-secondary-200 flex flex-col h-full">
      {/* Table Header / Toolbar */}
      <div className="p-4 border-b border-secondary-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          />
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <div className="relative flex-shrink-0">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="pl-9 pr-8 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm appearance-none bg-white cursor-pointer"
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-500" />
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto flex-grow">
        <table className="table w-full">
          <thead>
            <tr>
              <th className="w-16">Image</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-100">
            {currentItems.length > 0 ? (
              currentItems.map((product) => (
                <tr key={product.id} className="group hover:bg-secondary-50 transition-colors">
                  <td className="py-3 px-6">
                    <div className="w-10 h-10 rounded-lg bg-secondary-100 overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }}
                      />
                    </div>
                  </td>
                  <td className="py-3 px-6">
                    <p className="font-medium text-secondary-900 line-clamp-1">{product.name}</p>
                    <p className="text-xs text-secondary-500">ID: #{product.id}</p>
                  </td>
                  <td className="py-3 px-6 text-secondary-600">{product.category}</td>
                  <td className="py-3 px-6 font-medium text-secondary-900">{formatPrice(product.price)}</td>
                  <td className="py-3 px-6 text-secondary-600">{product.stock}</td>
                  <td className="py-3 px-6">{renderStatus(product.stock)}</td>
                  <td className="py-3 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/product/${product.id}`} target="_blank">
                        <IconButton 
                          icon={Eye} 
                          variant="ghost" 
                          size="sm" 
                          className="text-secondary-400 hover:text-secondary-700"
                        />
                      </Link>
                      <Link to={`/admin/products/edit/${product.id}`}>
                        <IconButton 
                          icon={Edit} 
                          variant="ghost" 
                          size="sm" 
                          className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                        />
                      </Link>
                      <IconButton 
                        icon={Trash2} 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteClick(product)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-12 text-secondary-500">
                  No products found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredProducts.length > itemsPerPage && (
        <div className="p-4 border-t border-secondary-200 flex items-center justify-between">
          <p className="text-sm text-secondary-500">
            Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">{Math.min(indexOfLastItem, filteredProducts.length)}</span> of <span className="font-medium">{filteredProducts.length}</span> results
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

export default ProductTable;