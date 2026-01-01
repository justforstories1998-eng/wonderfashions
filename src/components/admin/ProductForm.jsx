import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  X, 
  Plus, 
  Image as ImageIcon, 
  Globe, 
  Clock, 
  Save // Added the missing Save icon here
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useCountry } from '../../context/CountryContext';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../common/Toast';
import Button from '../common/Button';
import { processImage } from '../../utils/imageUtils';

const ProductForm = ({ initialData = null, initialCountry = 'uk', mode = 'add' }) => {
  const navigate = useNavigate();
  const { addProduct, updateProduct } = useProducts();
  const { countryConfig } = useCountry();
  const { settings } = useSettings();
  const toast = useToast();
  
  const [loading, setLoading] = useState(false);
  const [targetCountry, setTargetCountry] = useState(initialCountry);
  
  // Expiration State
  const [hasExpiration, setHasExpiration] = useState(false);
  const [durationDays, setDurationDays] = useState(14); 
  const [durationHours, setDurationHours] = useState(0);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    subcategory: '',
    stock: '',
    image: '',
    images: [],
    sizes: [],
    colors: [],
    featured: false,
    trending: false,
    newArrival: true,
    enabled: true,
    expiresAt: null
  });

  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState('');
  const [errors, setErrors] = useState({});

  const currencySymbol = countryConfig[targetCountry]?.currency?.symbol || '£';
  const categories = settings?.categories || [];

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        ...initialData,
        images: initialData.images || [initialData.image],
        sizes: initialData.sizes || [],
        colors: initialData.colors || [],
        subcategory: initialData.subcategory || '',
        expiresAt: initialData.expiresAt || null
      });
      setTargetCountry(initialCountry);
      if (initialData.expiresAt) setHasExpiration(true);
    }
  }, [initialData, mode, initialCountry]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setLoading(true);
      const processedImage = await processImage(file);
      setFormData(prev => ({ ...prev, image: processedImage }));
      toast.success("Image uploaded and compressed!");
    } catch (error) {
      toast.error("Failed to process image.");
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

  const calculateExpirationDate = () => {
    if (!hasExpiration) return null;
    const now = new Date();
    const expiry = new Date(now.getTime() + (durationDays * 24 * 60 * 60 * 1000) + (durationHours * 60 * 60 * 1000));
    return expiry.toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error("Name is required");
    if (!formData.category) return toast.error("Category is required");

    setLoading(true);
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        stock: parseInt(formData.stock) || 0,
        expiresAt: hasExpiration ? calculateExpirationDate() : null
      };

      if (mode === 'add') {
        addProduct(productData, targetCountry);
      } else {
        updateProduct(productData, targetCountry);
      }
      toast.success("Product saved!");
      navigate('/admin/products');
    } catch (error) {
      toast.error("Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-20 font-sans">
      {/* Region Selection */}
      {mode === 'add' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-200">
          <h3 className="text-lg font-bold text-primary-900 mb-4 flex items-center gap-2 font-display uppercase tracking-wider">
            <Globe size={20} className="text-primary-800" /> Target Region
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.values(countryConfig).map((country) => (
              <label key={country.code} className={`relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${targetCountry === country.code ? 'border-primary-800 bg-primary-50' : 'border-secondary-100 hover:bg-secondary-50'}`}>
                <input type="radio" name="country" value={country.code} checked={targetCountry === country.code} onChange={(e) => setTargetCountry(e.target.value)} className="sr-only" />
                <div className="text-3xl">{country.flag}</div>
                <div>
                    <span className="block font-bold text-secondary-900">{country.name}</span>
                    <span className="text-xs text-secondary-500 uppercase">{country.currency.code} ({country.currency.symbol})</span>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Main Details */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-200 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-primary-900 border-b pb-2 uppercase font-display tracking-wider">Basic Details</h3>
          <div><label className="label">Product Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="input" placeholder="Enter name" /></div>
          <div><label className="label">Description</label><textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="input resize-none" placeholder="Enter description" /></div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-primary-900 border-b pb-2 uppercase font-display tracking-wider">Time Limit</h3>
          <label className="flex items-center gap-3 cursor-pointer p-2 bg-secondary-50 rounded border border-secondary-100">
            <input type="checkbox" checked={hasExpiration} onChange={(e) => setHasExpiration(e.target.checked)} className="w-5 h-5 text-primary-800 rounded" />
            <span className="font-medium text-secondary-900">Enable Auto-Delete</span>
          </label>
          {hasExpiration && (
            <div className="grid grid-cols-2 gap-4 animate-fade-in">
              <div><label className="text-xs font-bold uppercase text-secondary-500">Days</label><input type="number" value={durationDays} onChange={e => setDurationDays(e.target.value)} className="input" /></div>
              <div><label className="text-xs font-bold uppercase text-secondary-500">Hours</label><input type="number" value={durationHours} onChange={e => setDurationHours(e.target.value)} className="input" /></div>
            </div>
          )}
        </div>
      </div>

      {/* Category & Pricing */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-200 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-primary-900 border-b pb-2 uppercase font-display tracking-wider">Categorization</h3>
          <div>
            <label className="label">Main Category</label>
            <select name="category" value={formData.category} onChange={e => { handleChange(e); setFormData(p => ({...p, subcategory: ''})); }} className="input bg-white">
              <option value="">Select Category</option>
              {categories.map(cat => <option key={cat.id} value={cat.slug}>{cat.name}</option>)}
            </select>
          </div>
          {formData.category && (
            <div className="animate-fade-in">
              <label className="label">Sub-category</label>
              <select name="subcategory" value={formData.subcategory} onChange={handleChange} className="input bg-white">
                <option value="">Select Sub-category</option>
                {categories.find(c => c.slug === formData.category)?.subcategories?.map(sub => <option key={sub.id} value={sub.slug}>{sub.name}</option>)}
              </select>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-primary-900 border-b pb-2 uppercase font-display tracking-wider">Pricing ({currencySymbol})</h3>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Sale Price</label><input type="number" name="price" value={formData.price} onChange={handleChange} className="input" /></div>
            <div><label className="label">MRP (Original)</label><input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} className="input" /></div>
          </div>
          <div><label className="label">Current Stock</label><input type="number" name="stock" value={formData.stock} onChange={handleChange} className="input" /></div>
        </div>
      </div>

      {/* Media */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-200">
        <h3 className="text-lg font-bold text-primary-900 border-b pb-2 uppercase font-display tracking-wider mb-4">Media</h3>
        <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 aspect-square bg-secondary-50 border-2 border-dashed rounded-xl flex items-center justify-center relative overflow-hidden">
                {formData.image ? (
                    <img src={formData.image} className="w-full h-full object-contain" alt="Preview" />
                ) : <ImageIcon className="text-secondary-200" size={48} />}
                <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
            </div>
            <div className="flex-1 space-y-2">
                <p className="text-sm font-bold text-secondary-700">Image Upload (Max 100MB)</p>
                <p className="text-xs text-secondary-500">Any format accepted. Images are automatically optimized for fast loading.</p>
                <div className="mt-4"><label className="label">Or use Image URL</label><input type="text" name="image" value={formData.image} onChange={handleChange} className="input" /></div>
            </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-secondary-200">
        <h3 className="text-lg font-bold text-primary-900 border-b pb-2 uppercase font-display tracking-wider mb-4">Display Options</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['enabled', 'featured', 'trending', 'newArrival'].map(opt => (
                <label key={opt} className="flex items-center gap-3 p-3 bg-secondary-50 border rounded-lg cursor-pointer hover:bg-white transition-colors">
                    <input type="checkbox" name={opt} checked={formData[opt]} onChange={handleChange} className="w-5 h-5 text-primary-800 rounded" />
                    <span className="text-xs font-bold uppercase text-secondary-700">{opt.replace(/([A-Z])/g, ' $1')}</span>
                </label>
            ))}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="ghost" onClick={() => navigate('/admin/products')}>Cancel</Button>
        <Button type="submit" variant="primary" loading={loading} icon={Save}>Save Product</Button>
      </div>
    </form>
  );
};

export default ProductForm;