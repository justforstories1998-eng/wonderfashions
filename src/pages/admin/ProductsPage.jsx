import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Package, ShoppingBag, AlertCircle, CheckCircle } from 'lucide-react';
import ProductTable from '../../components/admin/ProductTable';
import Button from '../../components/common/Button';
import { useProducts } from '../../context/ProductContext';

const ProductsPage = () => {
  const { products } = useProducts();
  
  const allProds = [...(products.uk || []), ...(products.india || [])];

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-[#C5A059]/20 pb-8">
        <div>
          <h1 className="text-4xl font-display font-bold text-[#4A0404]">Inventory</h1>
          <p className="text-secondary-600 italic mt-1 font-sans">Managing {allProds.length} royal pieces across all regions.</p>
        </div>
        <Link to="/admin/products/add">
          <Button variant="primary" icon={Plus} className="btn-royal px-10">Add New Arrival</Button>
        </Link>
      </div>

      {/* Stats Summary Area */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
            { label: 'Total Items', value: allProds.length, icon: Package, color: 'text-blue-600' },
            { label: 'Active in Store', value: allProds.filter(p => p.enabled).length, icon: CheckCircle, color: 'text-green-600' },
            { label: 'Low Stock', value: allProds.filter(p => p.stock < 5 && p.stock > 0).length, icon: AlertCircle, color: 'text-orange-600' },
            { label: 'Out of Stock', value: allProds.filter(p => p.stock === 0).length, icon: ShoppingBag, color: 'text-red-600' },
        ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-all hover:scale-[1.02]">
                <div className={`p-3 rounded-xl bg-gray-50 ${stat.color}`}><stat.icon size={20}/></div>
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                    <p className="text-2xl font-display font-bold text-gray-900">{stat.value}</p>
                </div>
            </div>
        ))}
      </div>

      {/* Main Table Area */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-6 bg-secondary-50/30 border-b border-gray-100">
            <h3 className="font-display font-bold text-lg text-[#4A0404] uppercase tracking-wider">Product Master List</h3>
        </div>
        <ProductTable />
      </div>
    </div>
  );
};

export default ProductsPage;