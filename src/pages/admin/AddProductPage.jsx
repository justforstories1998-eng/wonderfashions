import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import ProductForm from '../../components/admin/ProductForm';
import Button from '../../components/common/Button';

const AddProductPage = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link to="/admin/products">
            <Button variant="ghost" size="sm" icon={ArrowLeft} className="mb-2">
              Back to Products
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-secondary-900 flex items-center gap-3">
            <PlusCircle className="text-primary-600" size={28} />
            Add New Product
          </h1>
          <p className="text-secondary-500 mt-1">
            Create a new product to add to your store inventory
          </p>
        </div>
      </div>

      {/* Tips Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="font-semibold text-blue-800 mb-2">Tips for adding products:</h3>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>Select the correct country (India or UK) for pricing and currency</li>
          <li>Use high-quality images for better customer experience</li>
          <li>Write detailed descriptions including material, care instructions, and fit</li>
          <li>Set competitive prices by researching similar products</li>
          <li>Add multiple sizes and colors to maximize sales potential</li>
        </ul>
      </div>

      {/* Product Form */}
      <ProductForm mode="add" />
    </div>
  );
};

export default AddProductPage;