import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  ChevronLeft,
  ChevronRight,
  Globe
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useCountry } from '../../context/CountryContext';
import { ConfirmModal } from '../common/Modal';
import { useToast } from '../common/Toast';
import { IconButton } from '../common/Button';

const ProductTable = () => {
  const { products, deleteProduct, loading } = useProducts();
  const { countryConfig } = useCountry();
  const toast = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterCountry, setFilterCountry] = useState('All');

  // Flatten products with country info
  const allProducts = [
    ...(products.uk || []).map(p => ({ ...p, country: 'uk' })),
    ...(products.india || []).map(p => ({ ...p, country: 'india' }))
  ];

  // Unique categories for filter
  const categories = ['All', ...new Set(allProducts.map(p => p.category))];

  // Filter products
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || product.category === filterCategory;
    const matchesCountry = filterCountry === 'All' || product.country === filterCountry;
    
    return matchesSearch && matchesCategory && matchesCountry;
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
      deleteProduct(productToDelete.id, productToDelete.country);
      toast.success('Product deleted successfully');
      setDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  // Render Status Badge
  const renderStatus = (product) => {
    // Check Expiration
    if (product.expiresAt && new Date(product.expiresAt) < new Date()) {
      return <span className="badge bg-gray-200 text-gray-600 font-medium">Expired</span>;
    }

    if (product.enabled === false) {
      return <span className="badge bg-gray-100 text-gray-700">Disabled</span>;
    }
    
    const stockCount = parseInt(product.stock) || 0;
    if (stockCount === 0) {
      return <span className="badge bg-red-100 text-red-700">Out of Stock</span>;
    } else if (stockCount < 10) {
      return <span className="badge bg-yellow-100 text-yellow-700">Low Stock</span>;
    }
    return <span className="badge bg-green-100 text-green-700">In Stock</span>;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-secondary-200">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800 mx-auto"></div>
        <p className="mt-4 text-secondary-600 font-sans">Loading your inventory...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-secondary-200 flex flex-col h-full overflow-hidden">
      {/* Table Header / Toolbar */}
      <div className="p-4 border-b border-secondary-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-secondary-50/50">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-700 text-sm font-sans"
          />
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-shrink-0">
            <select
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              className="pl-9 pr-8 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-700 text-sm appearance-none bg-white cursor-pointer font-sans"
            >
              <option value="All">All Regions</option>
              <option value="uk">UK 🇬🇧</option>
              <option value="india">India 🇮🇳</option>
            </select>
            <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-500" />
          </div>

          <div className="relative flex-shrink-0">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="pl-9 pr-8 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-700 text-sm appearance-none bg-white cursor-pointer font-sans"
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
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-secondary-50 border-b border-secondary-200">
              <th className="px-6 py-4 text-xs font-bold text-secondary-700 uppercase tracking-widest font-sans">Image</th>
              <th className="px-6 py-4 text-xs font-bold text-secondary-700 uppercase tracking-widest font-sans">Product Name</th>
              <th className="px-6 py-4 text-xs font-bold text-secondary-700 uppercase tracking-widest font-sans">Region</th>
              <th className="px-6 py-4 text-xs font-bold text-secondary-700 uppercase tracking-widest font-sans">Price</th>
              <th className="px-6 py-4 text-xs font-bold text-secondary-700 uppercase tracking-widest font-sans">Stock</th>
              <th className="px-6 py-4 text-xs font-bold text-secondary-700 uppercase tracking-widest font-sans">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-secondary-700 uppercase tracking-widest font-sans text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-100">
            {currentItems.length > 0 ? (
              currentItems.map((product) => {
                const currencySymbol = countryConfig[product.country]?.currency?.symbol || '£';
                const flag = countryConfig[product.country]?.flag || '';
                
                return (
                  <tr key={`${product.country}-${product.id}`} className="group hover:bg-secondary-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded bg-secondary-100 overflow-hidden border border-secondary-200 shadow-sm">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=No+Image'; }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-secondary-900 line-clamp-1 font-display">{product.name}</p>
                      <p className="text-[10px] text-secondary-400 font-sans tracking-tight">ID: {product.id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary-700 bg-secondary-100 px-2 py-1 rounded uppercase">
                        {flag} {product.country}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-primary-800 font-sans">
                      {currencySymbol}{parseFloat(product.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-secondary-600 font-sans">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4">
                      {renderStatus(product)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/admin/products/edit/${product.id}?country=${product.country}`}>
                          <IconButton 
                            icon={Edit} 
                            variant="ghost" 
                            className="text-blue-600 hover:bg-blue-50"
                          />
                        </Link>
                        <IconButton 
                          icon={Trash2} 
                          variant="ghost" 
                          onClick={() => handleDeleteClick(product)}
                          className="text-red-600 hover:bg-red-50"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-20 text-secondary-500 font-sans">
                  No products found. Add some products to see them here!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredProducts.length > itemsPerPage && (
        <div className="p-4 border-t border-secondary-200 flex items-center justify-between bg-secondary-50/30">
          <p className="text-xs text-secondary-500 font-sans">
            Showing <span className="font-bold">{indexOfFirstItem + 1}</span> to <span className="font-bold">{Math.min(indexOfLastItem, filteredProducts.length)}</span> of <span className="font-bold">{filteredProducts.length}</span> items
          </p>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded hover:bg-white border border-transparent hover:border-secondary-200 disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            
            <span className="px-4 text-sm font-bold text-secondary-700 font-sans">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded hover:bg-white border border-transparent hover:border-secondary-200 disabled:opacity-30 transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Remove Product"
        message={`This will permanently delete "${productToDelete?.name}" from your store. Continue?`}
        confirmText="Remove"
        variant="danger"
      />
    </div>
  );
};

export default ProductTable;