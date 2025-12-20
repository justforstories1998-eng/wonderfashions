import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Package } from 'lucide-react';
import ProductTable from '../../components/admin/ProductTable';
import Button from '../../components/common/Button';
import { useProducts } from '../../context/ProductContext';

const ProductsPage = () => {
  const { products } = useProducts();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 flex items-center gap-3">
            <Package className="text-primary-600" size={28} />
            Products
          </h1>
          <p className="text-secondary-500 mt-1">
            Manage your product inventory ({products.length} total products)
          </p>
        </div>
        
        <Link to="/admin/products/add">
          <Button variant="primary" icon={Plus}>
            Add New Product
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-secondary-100">
          <p className="text-sm text-secondary-500">Total Products</p>
          <p className="text-2xl font-bold text-secondary-900">{products.length}</p>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-secondary-100">
          <p className="text-sm text-secondary-500">In Stock</p>
          <p className="text-2xl font-bold text-green-600">
            {products.filter(p => p.stock > 10).length}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-secondary-100">
          <p className="text-sm text-secondary-500">Low Stock</p>
          <p className="text-2xl font-bold text-yellow-600">
            {products.filter(p => p.stock > 0 && p.stock <= 10).length}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-secondary-100">
          <p className="text-sm text-secondary-500">Out of Stock</p>
          <p className="text-2xl font-bold text-red-600">
            {products.filter(p => p.stock === 0).length}
          </p>
        </div>
      </div>

      {/* Products Table */}
      <ProductTable />
    </div>
  );
};

export default ProductsPage;