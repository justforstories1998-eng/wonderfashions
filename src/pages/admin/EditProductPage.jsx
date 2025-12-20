import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Package } from 'lucide-react';
import ProductForm from '../../components/admin/ProductForm';
import Button from '../../components/common/Button';
import { useProducts } from '../../context/ProductContext';
import { useToast } from '../../components/common/Toast';

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, loading } = useProducts();
  const toast = useToast();
  
  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);

  // Fetch product on mount
  useEffect(() => {
    const productData = getProductById(id);
    
    if (productData) {
      setProduct(productData);
    } else {
      setNotFound(true);
      toast.error('Product not found');
    }
  }, [id, getProductById]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Not found state
  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="w-20 h-20 rounded-full bg-secondary-100 flex items-center justify-center mb-6">
          <Package size={40} className="text-secondary-400" />
        </div>
        <h2 className="text-2xl font-bold text-secondary-900 mb-2">Product Not Found</h2>
        <p className="text-secondary-500 mb-6 max-w-md">
          The product you're looking for doesn't exist or may have been deleted.
        </p>
        <Link to="/admin/products">
          <Button variant="primary" icon={ArrowLeft}>
            Back to Products
          </Button>
        </Link>
      </div>
    );
  }

  // Waiting for product data
  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

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
            <Edit className="text-primary-600" size={28} />
            Edit Product
          </h1>
          <p className="text-secondary-500 mt-1">
            Update product information for: <span className="font-medium text-secondary-700">{product.name}</span>
          </p>
        </div>
      </div>

      {/* Product Preview Card */}
      <div className="bg-white border border-secondary-100 rounded-xl p-4 flex items-center gap-4">
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary-100 flex-shrink-0">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-secondary-900 truncate">{product.name}</h3>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-sm text-secondary-500">ID: #{product.id}</span>
            <span className="text-sm text-secondary-500">Category: {product.category}</span>
            <span className="text-sm font-medium text-primary-600">${product.price.toFixed(2)}</span>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          {product.featured && (
            <span className="badge badge-primary">Featured</span>
          )}
          {product.trending && (
            <span className="badge badge-success">Trending</span>
          )}
          {product.newArrival && (
            <span className="badge badge-info">New</span>
          )}
        </div>
      </div>

      {/* Product Form */}
      <ProductForm mode="edit" initialData={product} />
    </div>
  );
};

export default EditProductPage;