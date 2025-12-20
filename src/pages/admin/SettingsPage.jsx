import React, { useState, useEffect } from 'react';
import { 
  Store, 
  Share2, 
  Truck,
  Save,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Music,
  Image as ImageIcon,
  Linkedin,
  Palette,
  Upload,
  X,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../components/common/Toast';
import Button from '../../components/common/Button';

const SettingsPage = () => {
  const { 
    settings, 
    socialMediaPlatforms,
    saving,
    lastSaved,
    saveBrandingToServer,
    saveStoreInfoToServer,
    saveSocialMediaToServer,
    saveShippingToServer
  } = useSettings();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('branding');
  const [saveMessage, setSaveMessage] = useState(null);
  
  // Forms state
  const [storeForm, setStoreForm] = useState({
    storeName: '',
    storeEmail: '',
    storePhone: '',
    street: '',
    city: '',
    postcode: '',
    country: ''
  });

  const [socialForm, setSocialForm] = useState({});
  const [shippingForm, setShippingForm] = useState({});
  const [brandingForm, setBrandingForm] = useState({
    logo: null,
    fallbackText: '',
    subText: ''
  });

  // Initialize forms when settings load
  useEffect(() => {
    if (settings) {
      setStoreForm({
        storeName: settings.storeName || '',
        storeEmail: settings.storeEmail || '',
        storePhone: settings.storePhone || '',
        street: settings.storeAddress?.street || '',
        city: settings.storeAddress?.city || '',
        postcode: settings.storeAddress?.postcode || '',
        country: settings.storeAddress?.country || ''
      });
      setSocialForm(settings.socialMedia || {});
      setShippingForm(settings.shipping || {});
      setBrandingForm(settings.branding || {
        logo: null,
        fallbackText: 'Wonder',
        subText: 'Fashions'
      });
    }
  }, [settings]);

  // Clear save message after 10 seconds
  useEffect(() => {
    if (saveMessage) {
      const timer = setTimeout(() => {
        setSaveMessage(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [saveMessage]);

  // Handlers
  const handleStoreChange = (e) => {
    const { name, value } = e.target;
    setStoreForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (platform, field, value) => {
    setSocialForm(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [field]: value
      }
    }));
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingForm(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleBrandingChange = (e) => {
    const { name, value } = e.target;
    setBrandingForm(prev => ({ ...prev, [name]: value }));
  };

  // Image Upload Handler
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check size (limit to 500KB for Base64 storage)
    if (file.size > 500 * 1024) {
      toast.error('Image is too large. Please upload an image smaller than 500KB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setBrandingForm(prev => ({ ...prev, logo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setBrandingForm(prev => ({ ...prev, logo: null }));
  };

  // Save Functions
  const saveStoreSettings = async () => {
    const result = await saveStoreInfoToServer({
      storeName: storeForm.storeName,
      storeEmail: storeForm.storeEmail,
      storePhone: storeForm.storePhone,
      storeAddress: {
        street: storeForm.street,
        city: storeForm.city,
        postcode: storeForm.postcode,
        country: storeForm.country
      }
    });

    if (result.success) {
      toast.success('Store information saved!');
      setSaveMessage({ type: 'success', text: result.message });
    } else {
      toast.error(result.message);
      setSaveMessage({ type: 'error', text: result.message });
    }
  };

  const saveSocialSettings = async () => {
    const result = await saveSocialMediaToServer(socialForm);

    if (result.success) {
      toast.success('Social media settings saved!');
      setSaveMessage({ type: 'success', text: result.message });
    } else {
      toast.error(result.message);
      setSaveMessage({ type: 'error', text: result.message });
    }
  };

  const saveShippingSettings = async () => {
    const result = await saveShippingToServer(shippingForm);

    if (result.success) {
      toast.success('Shipping settings saved!');
      setSaveMessage({ type: 'success', text: result.message });
    } else {
      toast.error(result.message);
      setSaveMessage({ type: 'error', text: result.message });
    }
  };

  const saveBrandingSettings = async () => {
    const result = await saveBrandingToServer(brandingForm);

    if (result.success) {
      toast.success('Branding settings saved!');
      setSaveMessage({ type: 'success', text: result.message });
    } else {
      toast.error(result.message);
      setSaveMessage({ type: 'error', text: result.message });
    }
  };

  // Icon mapping
  const socialIcons = {
    facebook: Facebook,
    twitter: Twitter,
    instagram: Instagram,
    youtube: Youtube,
    tiktok: Music,
    pinterest: ImageIcon,
    linkedin: Linkedin
  };

  // Tab Button Component
  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-l-4 ${
        activeTab === id
          ? 'bg-primary-50 text-primary-700 border-primary-600 font-medium'
          : 'text-secondary-600 hover:bg-secondary-50 border-transparent'
      }`}
    >
      <Icon size={20} />
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Settings</h1>
        <p className="text-secondary-500">Manage your store configuration</p>
      </div>

      {/* Save Message Banner */}
      {saveMessage && (
        <div 
          className={`p-4 rounded-lg flex items-start gap-3 animate-fade-in ${
            saveMessage.type === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}
        >
          {saveMessage.type === 'success' ? (
            <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
          ) : (
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
          )}
          <div className="flex-1">
            <p className={`font-medium ${saveMessage.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
              {saveMessage.type === 'success' ? 'Settings Saved!' : 'Error Saving Settings'}
            </p>
            <p className={`text-sm ${saveMessage.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
              {saveMessage.text}
            </p>
            {saveMessage.type === 'success' && (
              <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
                <Clock size={14} />
                <span>Site will auto-rebuild. Changes visible in 1-2 minutes.</span>
              </div>
            )}
          </div>
          <button 
            onClick={() => setSaveMessage(null)}
            className="text-secondary-400 hover:text-secondary-600"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="bg-white rounded-xl shadow-sm border border-secondary-100 overflow-hidden">
            <TabButton id="branding" label="Branding & Logo" icon={Palette} />
            <TabButton id="store" label="Store Information" icon={Store} />
            <TabButton id="social" label="Social Media" icon={Share2} />
            <TabButton id="shipping" label="Shipping & Delivery" icon={Truck} />
          </nav>

          {/* Last Saved Info */}
          {lastSaved && (
            <div className="mt-4 p-3 bg-secondary-50 rounded-lg text-xs text-secondary-500">
              <p>Last saved:</p>
              <p className="font-medium text-secondary-700">
                {new Date(lastSaved).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          
          {/* Branding Tab */}
          {activeTab === 'branding' && (
            <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6 space-y-6 animate-fade-in">
              <div>
                <h2 className="text-lg font-semibold text-secondary-900 mb-4 pb-2 border-b border-secondary-100">
                  Store Branding
                </h2>
                
                {/* Logo Upload */}
                <div className="mb-8">
                  <label className="label">Store Logo</label>
                  <p className="text-xs text-secondary-500 mb-3">
                    Upload your store logo. Recommended size: 200x200px. Max size: 500KB.
                  </p>
                  
                  <div className="flex items-start gap-6">
                    {/* Preview */}
                    <div className="relative w-32 h-32 bg-secondary-50 border-2 border-dashed border-secondary-300 rounded-xl flex items-center justify-center overflow-hidden">
                      {brandingForm.logo ? (
                        <>
                          <img 
                            src={brandingForm.logo} 
                            alt="Store Logo" 
                            className="w-full h-full object-contain p-2" 
                          />
                          <button
                            onClick={removeLogo}
                            className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-sm hover:bg-red-50 text-secondary-500 hover:text-red-500 transition-colors"
                            type="button"
                          >
                            <X size={14} />
                          </button>
                        </>
                      ) : (
                        <ImageIcon className="text-secondary-300" size={32} />
                      )}
                    </div>

                    {/* Upload Button */}
                    <div className="flex-1">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-secondary-300 border-dashed rounded-xl cursor-pointer bg-secondary-50 hover:bg-secondary-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-3 text-secondary-400" />
                          <p className="mb-2 text-sm text-secondary-500"><span className="font-semibold">Click to upload</span></p>
                          <p className="text-xs text-secondary-500">PNG, JPG or GIF (max 500KB)</p>
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleLogoUpload}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Text Fallback */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="label">Brand Name (Main)</label>
                    <input
                      type="text"
                      name="fallbackText"
                      value={brandingForm.fallbackText}
                      onChange={handleBrandingChange}
                      className="input"
                      placeholder="Wonder"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="label">Brand Subtext (Optional)</label>
                    <input
                      type="text"
                      name="subText"
                      value={brandingForm.subText}
                      onChange={handleBrandingChange}
                      className="input"
                      placeholder="Fashions"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  variant="primary" 
                  onClick={saveBrandingSettings}
                  icon={Save}
                  loading={saving}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Branding'}
                </Button>
              </div>
            </div>
          )}

          {/* Store Information Tab */}
          {activeTab === 'store' && (
            <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6 space-y-6 animate-fade-in">
              <div>
                <h2 className="text-lg font-semibold text-secondary-900 mb-4 pb-2 border-b border-secondary-100">
                  General Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="label">Store Name</label>
                    <input
                      type="text"
                      name="storeName"
                      value={storeForm.storeName}
                      onChange={handleStoreChange}
                      className="input"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="label">Support Email</label>
                    <input
                      type="email"
                      name="storeEmail"
                      value={storeForm.storeEmail}
                      onChange={handleStoreChange}
                      className="input"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="label">Phone Number</label>
                    <input
                      type="text"
                      name="storePhone"
                      value={storeForm.storePhone}
                      onChange={handleStoreChange}
                      className="input"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-secondary-900 mb-4 pb-2 border-b border-secondary-100">
                  Store Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 space-y-1">
                    <label className="label">Street Address</label>
                    <input
                      type="text"
                      name="street"
                      value={storeForm.street}
                      onChange={handleStoreChange}
                      className="input"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="label">City</label>
                    <input
                      type="text"
                      name="city"
                      value={storeForm.city}
                      onChange={handleStoreChange}
                      className="input"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="label">Postcode</label>
                    <input
                      type="text"
                      name="postcode"
                      value={storeForm.postcode}
                      onChange={handleStoreChange}
                      className="input"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="label">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={storeForm.country}
                      onChange={handleStoreChange}
                      className="input"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  variant="primary" 
                  onClick={saveStoreSettings}
                  icon={Save}
                  loading={saving}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )}

          {/* Social Media Tab */}
          {activeTab === 'social' && (
            <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6 space-y-6 animate-fade-in">
              <h2 className="text-lg font-semibold text-secondary-900 mb-4 pb-2 border-b border-secondary-100">
                Social Media Links
              </h2>
              <p className="text-sm text-secondary-500 mb-6">
                Configure your social media links. These will be displayed in the footer of your store.
              </p>

              <div className="space-y-6">
                {socialMediaPlatforms.map((platform) => {
                  const Icon = socialIcons[platform.id] || Share2;
                  const isEnabled = socialForm[platform.id]?.enabled || false;

                  return (
                    <div key={platform.id} className="p-4 border border-secondary-200 rounded-lg bg-secondary-50/50">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${isEnabled ? 'bg-primary-100 text-primary-600' : 'bg-secondary-200 text-secondary-500'}`}>
                            <Icon size={20} />
                          </div>
                          <span className="font-medium text-secondary-900">{platform.name}</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={isEnabled}
                            onChange={(e) => handleSocialChange(platform.id, 'enabled', e.target.checked)}
                          />
                          <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>

                      {isEnabled && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-secondary-500">Profile URL</label>
                            <input
                              type="text"
                              value={socialForm[platform.id]?.url || ''}
                              onChange={(e) => handleSocialChange(platform.id, 'url', e.target.value)}
                              placeholder={platform.placeholder}
                              className="input text-sm py-2"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-secondary-500">Username / Handle (Optional)</label>
                            <input
                              type="text"
                              value={socialForm[platform.id]?.username || ''}
                              onChange={(e) => handleSocialChange(platform.id, 'username', e.target.value)}
                              placeholder="@username"
                              className="input text-sm py-2"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  variant="primary" 
                  onClick={saveSocialSettings}
                  icon={Save}
                  loading={saving}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )}

          {/* Shipping Tab */}
          {activeTab === 'shipping' && (
            <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6 space-y-6 animate-fade-in">
              <h2 className="text-lg font-semibold text-secondary-900 mb-4 pb-2 border-b border-secondary-100">
                Shipping Configuration
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="label">Standard Shipping Cost (£)</label>
                  <input
                    type="number"
                    name="standardShippingCost"
                    value={shippingForm.standardShippingCost || 0}
                    onChange={handleShippingChange}
                    step="0.01"
                    min="0"
                    className="input"
                  />
                  <p className="text-xs text-secondary-500">Default shipping cost for orders</p>
                </div>

                <div className="space-y-1">
                  <label className="label">Express Shipping Cost (£)</label>
                  <input
                    type="number"
                    name="expressShippingCost"
                    value={shippingForm.expressShippingCost || 0}
                    onChange={handleShippingChange}
                    step="0.01"
                    min="0"
                    className="input"
                  />
                  <p className="text-xs text-secondary-500">Cost for expedited delivery</p>
                </div>

                <div className="space-y-1">
                  <label className="label">Free Shipping Threshold (£)</label>
                  <input
                    type="number"
                    name="freeShippingThreshold"
                    value={shippingForm.freeShippingThreshold || 0}
                    onChange={handleShippingChange}
                    step="1"
                    min="0"
                    className="input"
                  />
                  <p className="text-xs text-secondary-500">Order value to qualify for free shipping</p>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  variant="primary" 
                  onClick={saveShippingSettings}
                  icon={Save}
                  loading={saving}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;