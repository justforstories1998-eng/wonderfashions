import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { Upload, X, Plus, Image as ImageIcon, Globe } from 'lucide-react';
=======
import { Upload, X, Plus, Image as ImageIcon, Globe, Clock } from 'lucide-react';
>>>>>>> temp-fix
import { useProducts } from '../../context/ProductContext';
import { useCountry } from '../../context/CountryContext';
import { useToast } from '../common/Toast';
import Button from '../common/Button';
import { processImage } from '../../utils/imageUtils';

const ProductForm = ({ initialData = null, initialCountry = 'uk', mode = 'add' }) => {
  const navigate = useNavigate();
  const { addProduct, updateProduct, categories } = useProducts();
  const { countryConfig } = useCountry();
  const toast = useToast();
  
  const [loading, setLoading] = useState(false);
  const [targetCountry, setTargetCountry] = useState(initialCountry);
  
<<<<<<< HEAD
=======
  // Expiration State
  const [hasExpiration, setHasExpiration] = useState(false);
  const [durationDays, setDurationDays] = useState(14); // Default 2 weeks
  const [durationHours, setDurationHours] = useState(0);
  
>>>>>>> temp-fix
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
<<<<<<< HEAD
    subcategory: '', // Added subcategory
=======
    subcategory: '',
>>>>>>> temp-fix
    stock: '',
    image: '',
    images: [],
    sizes: [],
    colors: [],
    featured: false,
    trending: false,
    newArrival: true,
<<<<<<< HEAD
    enabled: true
=======
    enabled: true,
    expiresAt: null // New Field
>>>>>>> temp-fix
  });

  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState('');
  const [errors, setErrors] = useState({});

  const currencySymbol = countryConfig[targetCountry]?.currency?.symbol || '£';

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        ...initialData,
        images: initialData.images || [initialData.image],
        sizes: initialData.sizes || [],
        colors: initialData.colors || [],
<<<<<<< HEAD
        subcategory: initialData.subcategory || ''
      });
      setTargetCountry(initialCountry);
=======
        subcategory: initialData.subcategory || '',
        expiresAt: initialData.expiresAt || null
      });
      setTargetCountry(initialCountry);
      
      // Set expiration UI if exists
      if (initialData.expiresAt) {
        setHasExpiration(true);
        // We don't reverse calculate days/hours because it's a fixed date now, 
        // but we show the current expiry date below
      }
>>>>>>> temp-fix
    }
  }, [initialData, mode, initialCountry]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const processedImage = await processImage(file);
      setFormData(prev => ({ ...prev, image: processedImage }));
      toast.success("Image processed and uploaded!");
    } catch (error) {
      console.error("Image upload failed", error);
      toast.error("Failed to process image. Try a different file.");
    } finally {
      setLoading(false);
    }
  };

  const addItem = (field, value, setter) => {
    if (!value.trim()) return;
    setFormData(prev => ({ ...prev, [field]: [...prev[field], value.trim()] }));
    setter('');
  };

  const removeItem = (field, index) => {
    setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'Valid stock is required';
    if (!formData.image.trim()) newErrors.image = 'Main image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateExpirationDate = () => {
    if (!hasExpiration) return null;
    
    // If editing and didn't change duration, keep existing unless explicitly updated
    // But for simplicity, we calculate fresh from "now" if they touched the controls
    const now = new Date();
    const expiry = new Date(now.getTime() + (durationDays * 24 * 60 * 60 * 1000) + (durationHours * 60 * 60 * 1000));
    return expiry.toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
<<<<<<< HEAD
=======
      // Calculate Expiry
      let finalExpiry = formData.expiresAt;
      
      // If user enabled expiration and we are in add mode OR they changed the toggle/values
      if (hasExpiration && (mode === 'add' || !formData.expiresAt)) {
         finalExpiry = calculateExpirationDate();
      } else if (!hasExpiration) {
         finalExpiry = null;
      }

>>>>>>> temp-fix
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        stock: parseInt(formData.stock),
<<<<<<< HEAD
        images: formData.images.length > 0 ? formData.images : [formData.image]
=======
        images: formData.images.length > 0 ? formData.images : [formData.image],
        expiresAt: finalExpiry
>>>>>>> temp-fix
      };

      if (mode === 'add') {
        addProduct(productData, targetCountry);
        toast.success(`Product added to ${countryConfig[targetCountry].name}`);
      } else {
        updateProduct(productData, targetCountry);
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
      {mode === 'add' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4 border-b pb-2 flex items-center gap-2">
            <Globe size={20} className="text-primary-600" /> Target Country
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.values(countryConfig).map((country) => (
              <label key={country.code} className={`relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${targetCountry === country.code ? 'border-primary-600 bg-primary-50' : 'border-secondary-200 hover:border-secondary-300'}`}>
                <input type="radio" name="country" value={country.code} checked={targetCountry === country.code} onChange={(e) => setTargetCountry(e.target.value)} className="sr-only" />
                <div className="text-3xl">{country.flag}</div>
                <div><span className="block font-semibold">{country.name}</span><span className="text-xs text-secondary-500">Currency: {country.currency.code} ({country.currency.symbol})</span></div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4 border-b pb-2">Basic Information</h3>
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-1">
            <label className="label">Product Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className={`input ${errors.name ? 'input-error' : ''}`} placeholder="e.g. Summer Floral Dress" />
            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
          </div>
          <div className="space-y-1">
            <label className="label">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className={`input resize-none ${errors.description ? 'input-error' : ''}`} placeholder="Detailed product description..." />
            {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
          </div>
        </div>
      </div>

      {/* Expiration Settings (NEW) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4 border-b pb-2 flex items-center gap-2">
          <Clock size={20} className="text-primary-600" /> Auto-Delete / Expiration
        </h3>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={hasExpiration} 
              onChange={(e) => setHasExpiration(e.target.checked)} 
              className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
            />
            <span className="font-medium text-secondary-900">Set Expiration Time</span>
          </label>

          {hasExpiration && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-secondary-50 rounded-lg animate-fade-in border border-secondary-200">
              <div>
                <label className="text-sm font-medium text-secondary-600 mb-1 block">Days</label>
                <input 
                  type="number" 
                  min="0" 
                  value={durationDays} 
                  onChange={(e) => setDurationDays(parseInt(e.target.value) || 0)} 
                  className="input" 
                />
              </div>
              <div>
                <label className="text-sm font-medium text-secondary-600 mb-1 block">Hours</label>
                <input 
                  type="number" 
                  min="0" 
                  max="23" 
                  value={durationHours} 
                  onChange={(e) => setDurationHours(parseInt(e.target.value) || 0)} 
                  className="input" 
                />
              </div>
              <div className="col-span-2 text-xs text-secondary-500">
                Product will automatically be removed from the store after this duration.
                {formData.expiresAt && <div className="mt-1 font-medium text-primary-700">Currently expires at: {new Date(formData.expiresAt).toLocaleString()}</div>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pricing & Inventory */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4 border-b pb-2">Pricing & Inventory</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="label">Price ({currencySymbol})</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} step="0.01" min="0" className={`input ${errors.price ? 'input-error' : ''}`} placeholder="0.00" />
            {errors.price && <p className="text-red-500 text-xs">{errors.price}</p>}
          </div>
          <div className="space-y-1">
            <label className="label">Original Price ({currencySymbol}) <span className="text-secondary-400 font-normal">(Optional)</span></label>
            <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} step="0.01" min="0" className="input" placeholder="0.00" />
          </div>
          <div className="space-y-1">
            <label className="label">Stock Quantity</label>
            <input type="number" name="stock" value={formData.stock} onChange={handleChange} min="0" className={`input ${errors.stock ? 'input-error' : ''}`} placeholder="0" />
            {errors.stock && <p className="text-red-500 text-xs">{errors.stock}</p>}
          </div>
          
<<<<<<< HEAD
          {/* CATEGORIES & SUBCATEGORIES */}
=======
>>>>>>> temp-fix
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="label">Category</label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={(e) => {
                  handleChange(e);
                  setFormData(prev => ({ ...prev, subcategory: '' }));
                }} 
                className={`input bg-white ${errors.category ? 'input-error' : ''}`}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-xs">{errors.category}</p>}
            </div>

            {formData.category && (
              <div className="space-y-1 animate-fade-in">
                <label className="label">Subcategory</label>
                <select 
                  name="subcategory" 
                  value={formData.subcategory} 
                  onChange={handleChange} 
                  className="input bg-white"
                >
                  <option value="">Select Subcategory (Optional)</option>
                  {categories.find(c => c.slug === formData.category)?.subcategories?.map(sub => (
                    <option key={sub.id} value={sub.slug}>{sub.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Media */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4 border-b pb-2">Product Images</h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="label">Main Image</label>
            <div className="flex gap-2 items-center">
              <input type="text" name="image" value={formData.image} onChange={handleChange} className={`input flex-1 ${errors.image ? 'input-error' : ''}`} placeholder="Image URL or Upload" />
              <label className="cursor-pointer bg-secondary-100 hover:bg-secondary-200 p-3 rounded-lg transition-colors">
                <Upload size={20} className="text-secondary-600" />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={loading} />
              </label>
            </div>
            {errors.image && <p className="text-red-500 text-xs">{errors.image}</p>}
          </div>
          {formData.image && (
            <div className="mt-4 p-4 border border-dashed border-secondary-300 rounded-lg flex items-center justify-center bg-secondary-50">
              <img src={formData.image} alt="Preview" className="max-h-64 object-contain rounded-lg shadow-sm" />
            </div>
          )}
        </div>
      </div>

      {/* Variants (Sizes & Colors) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4 border-b pb-2">Variants</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="label">Sizes</label>
            <div className="flex gap-2 mb-3">
              <input type="text" value={newSize} onChange={(e) => setNewSize(e.target.value)} className="input" placeholder="Add size (e.g. S, M, L)" onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('sizes', newSize, setNewSize))} />
              <button type="button" onClick={() => addItem('sizes', newSize, setNewSize)} className="bg-secondary-100 text-secondary-600 p-3 rounded-lg hover:bg-secondary-200"><Plus size={20} /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.sizes.map((size, index) => (
                <span key={index} className="badge bg-secondary-100 text-secondary-700 px-3 py-1 text-sm flex items-center gap-2">{size}<button type="button" onClick={() => removeItem('sizes', index)} className="hover:text-red-500"><X size={14} /></button></span>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Colors</label>
            <div className="flex gap-2 mb-3">
              <input type="text" value={newColor} onChange={(e) => setNewColor(e.target.value)} className="input" placeholder="Add color (e.g. Red, Blue)" onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('colors', newColor, setNewColor))} />
              <button type="button" onClick={() => addItem('colors', newColor, setNewColor)} className="bg-secondary-100 text-secondary-600 p-3 rounded-lg hover:bg-secondary-200"><Plus size={20} /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.colors.map((color, index) => (
                <span key={index} className="badge bg-secondary-100 text-secondary-700 px-3 py-1 text-sm flex items-center gap-2"><span className="w-3 h-3 rounded-full border border-secondary-300" style={{ backgroundColor: color.toLowerCase() }}></span>{color}<button type="button" onClick={() => removeItem('colors', index)} className="hover:text-red-500"><X size={14} /></button></span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4 border-b pb-2">Display Settings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <label className="flex items-center gap-3 p-4 border border-secondary-200 rounded-lg cursor-pointer hover:bg-secondary-50 transition-colors">
            <input type="checkbox" name="enabled" checked={formData.enabled} onChange={handleChange} className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 border-gray-300" />
            <div><span className="font-medium text-secondary-900 block">Enabled</span><span className="text-xs text-secondary-500">Visible in store</span></div>
          </label>
          <label className="flex items-center gap-3 p-4 border border-secondary-200 rounded-lg cursor-pointer hover:bg-secondary-50 transition-colors">
            <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 border-gray-300" />
            <div><span className="font-medium text-secondary-900 block">Featured</span><span className="text-xs text-secondary-500">Show on home page</span></div>
          </label>
          <label className="flex items-center gap-3 p-4 border border-secondary-200 rounded-lg cursor-pointer hover:bg-secondary-50 transition-colors">
            <input type="checkbox" name="trending" checked={formData.trending} onChange={handleChange} className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 border-gray-300" />
            <div><span className="font-medium text-secondary-900 block">Trending</span><span className="text-xs text-secondary-500">Mark as trending</span></div>
          </label>
          <label className="flex items-center gap-3 p-4 border border-secondary-200 rounded-lg cursor-pointer hover:bg-secondary-50 transition-colors">
            <input type="checkbox" name="newArrival" checked={formData.newArrival} onChange={handleChange} className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 border-gray-300" />
            <div><span className="font-medium text-secondary-900 block">New Arrival</span><span className="text-xs text-secondary-500">Mark as new</span></div>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 pt-4">
        <Button variant="outlineSecondary" onClick={() => navigate('/admin/products')} disabled={loading}>Cancel</Button>
        <Button type="submit" variant="primary" loading={loading}>{mode === 'add' ? 'Add Product' : 'Save Changes'}</Button>
      </div>
    </form>
  );
};

export default ProductForm;