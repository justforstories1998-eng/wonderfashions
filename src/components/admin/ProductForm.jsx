import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Plus, Image as ImageIcon } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../common/Toast';
import Button from '../common/Button';

const ProductForm = ({ initialData = null, mode = 'add' }) => {
  const navigate = useNavigate();
  const { addProduct, updateProduct, categories } = useProducts();
  const { settings } = useSettings();
  const toast = useToast();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    stock: '',
    image: '',
    images: [],
    sizes: [],
    colors: [],
    featured: false,
    trending: false,
    newArrival: true
  });

  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState('');
  const [errors, setErrors] = useState({});

  // Get currency symbol
  const currencySymbol = settings?.currency?.symbol || '£';

  // Initialize form with data if in edit mode
  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        ...initialData,
        images: initialData.images || [initialData.image],
        // Ensure arrays exist
        sizes: initialData.sizes || [],
        colors: initialData.colors || []
      });
    }
  }, [initialData, mode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Handle Array Fields (Sizes, Colors)
  const addItem = (field, value, setter) => {
    if (!value.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], value.trim()]
    }));
    setter('');
  };

  const removeItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'Valid stock is required';
    if (!formData.image.trim()) newErrors.image = 'Main image URL is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);

    try {
      // Format numeric values
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        stock: parseInt(formData.stock),
        // Ensure main image is in images array
        images: formData.images.length > 0 ? formData.images : [formData.image]
      };

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (mode === 'add') {
        addProduct(productData);
        toast.success('Product added successfully');
      } else {
        updateProduct(productData);
        toast.success('Product updated successfully');
      }

      navigate('/admin/products');
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4 border-b pb-2">
          Basic Information
        </h3>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-1">
            <label className="label">Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`input ${errors.name ? 'input-error' : ''}`}
              placeholder="e.g. Summer Floral Dress"
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
          </div>

          <div className="space-y-1">
            <label className="label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={`input resize-none ${errors.description ? 'input-error' : ''}`}
              placeholder="Detailed product description..."
            />
            {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
          </div>
        </div>
      </div>

      {/* Pricing & Inventory */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4 border-b pb-2">
          Pricing & Inventory
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="label">Price ({currencySymbol})</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              className={`input ${errors.price ? 'input-error' : ''}`}
              placeholder="0.00"
            />
            {errors.price && <p className="text-red-500 text-xs">{errors.price}</p>}
          </div>

          <div className="space-y-1">
            <label className="label">Original Price ({currencySymbol}) <span className="text-secondary-400 font-normal">(Optional)</span></label>
            <input
              type="number"
              name="originalPrice"
              value={formData.originalPrice}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="input"
              placeholder="0.00"
            />
          </div>

          <div className="space-y-1">
            <label className="label">Stock Quantity</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              className={`input ${errors.stock ? 'input-error' : ''}`}
              placeholder="0"
            />
            {errors.stock && <p className="text-red-500 text-xs">{errors.stock}</p>}
          </div>

          <div className="space-y-1">
            <label className="label">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`input bg-white ${errors.category ? 'input-error' : ''}`}
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-xs">{errors.category}</p>}
          </div>
        </div>
      </div>

      {/* Media */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4 border-b pb-2">
          Product Images
        </h3>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="label">Main Image URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className={`input ${errors.image ? 'input-error' : ''}`}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            {errors.image && <p className="text-red-500 text-xs">{errors.image}</p>}
          </div>

          {/* Image Preview */}
          {formData.image && (
            <div className="mt-4 p-4 border border-dashed border-secondary-300 rounded-lg flex items-center justify-center bg-secondary-50">
              <img 
                src={formData.image} 
                alt="Preview" 
                className="max-h-64 object-contain rounded-lg shadow-sm"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL';
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Variants (Sizes & Colors) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4 border-b pb-2">
          Variants
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sizes */}
          <div>
            <label className="label">Sizes</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                className="input"
                placeholder="Add size (e.g. S, M, L)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('sizes', newSize, setNewSize))}
              />
              <button
                type="button"
                onClick={() => addItem('sizes', newSize, setNewSize)}
                className="bg-secondary-100 text-secondary-600 p-3 rounded-lg hover:bg-secondary-200"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.sizes.map((size, index) => (
                <span key={index} className="badge bg-secondary-100 text-secondary-700 px-3 py-1 text-sm flex items-center gap-2">
                  {size}
                  <button type="button" onClick={() => removeItem('sizes', index)} className="hover:text-red-500">
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className="label">Colours</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="input"
                placeholder="Add colour (e.g. Red, Blue)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('colors', newColor, setNewColor))}
              />
              <button
                type="button"
                onClick={() => addItem('colors', newColor, setNewColor)}
                className="bg-secondary-100 text-secondary-600 p-3 rounded-lg hover:bg-secondary-200"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.colors.map((color, index) => (
                <span key={index} className="badge bg-secondary-100 text-secondary-700 px-3 py-1 text-sm flex items-center gap-2">
                  <span 
                    className="w-3 h-3 rounded-full border border-secondary-300" 
                    style={{ backgroundColor: color.toLowerCase() }}
                  ></span>
                  {color}
                  <button type="button" onClick={() => removeItem('colors', index)} className="hover:text-red-500">
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4 border-b pb-2">
          Display Settings
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <label className="flex items-center gap-3 p-4 border border-secondary-200 rounded-lg cursor-pointer hover:bg-secondary-50 transition-colors">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
            />
            <div>
              <span className="font-medium text-secondary-900 block">Featured</span>
              <span className="text-xs text-secondary-500">Show on home page</span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-4 border border-secondary-200 rounded-lg cursor-pointer hover:bg-secondary-50 transition-colors">
            <input
              type="checkbox"
              name="trending"
              checked={formData.trending}
              onChange={handleChange}
              className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
            />
            <div>
              <span className="font-medium text-secondary-900 block">Trending</span>
              <span className="text-xs text-secondary-500">Mark as trending</span>
            </div>
          </label>

          <label className="flex items-center gap-3 p-4 border border-secondary-200 rounded-lg cursor-pointer hover:bg-secondary-50 transition-colors">
            <input
              type="checkbox"
              name="newArrival"
              checked={formData.newArrival}
              onChange={handleChange}
              className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
            />
            <div>
              <span className="font-medium text-secondary-900 block">New Arrival</span>
              <span className="text-xs text-secondary-500">Mark as new</span>
            </div>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <Button
          variant="outlineSecondary"
          onClick={() => navigate('/admin/products')}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
        >
          {mode === 'add' ? 'Add Product' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;