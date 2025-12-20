import React, { useState } from 'react';
import { 
  Store, 
  Share2, 
  CreditCard, 
  Truck,
  Save,
  RotateCcw,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Music,
  Image,
  Linkedin
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../components/common/Toast';
import Button from '../../components/common/Button';

const SettingsPage = () => {
  const { 
    settings, 
    socialMediaPlatforms,
    updateStoreInfo, 
    updateSocialMedia, 
    updateShipping,
    loading 
  } = useSettings();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('store');
  const [storeForm, setStoreForm] = useState({
    storeName: settings.storeName,
    storeEmail: settings.storeEmail,
    storePhone: settings.storePhone,
    street: settings.storeAddress.street,
    city: settings.storeAddress.city,
    postcode: settings.storeAddress.postcode,
    country: settings.storeAddress.country
  });

  const [socialForm, setSocialForm] = useState(settings.socialMedia);
  
  const [shippingForm, setShippingForm] = useState(settings.shipping);

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
    setShippingForm(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  const saveStoreSettings = () => {
    updateStoreInfo({
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
    toast.success('Store information updated successfully');
  };

  const saveSocialSettings = () => {
    updateSocialMedia(socialForm);
    toast.success('Social media settings updated successfully');
  };

  const saveShippingSettings = () => {
    updateShipping(shippingForm);
    toast.success('Shipping settings updated successfully');
  };

  // Icon mapping
  const socialIcons = {
    facebook: Facebook,
    twitter: Twitter,
    instagram: Instagram,
    youtube: Youtube,
    tiktok: Music,
    pinterest: Image,
    linkedin: Linkedin
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Settings</h1>
        <p className="text-secondary-500">Manage your store configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="bg-white rounded-xl shadow-sm border border-secondary-100 overflow-hidden">
            <button
              onClick={() => setActiveTab('store')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-l-4 ${
                activeTab === 'store'
                  ? 'bg-primary-50 text-primary-700 border-primary-600 font-medium'
                  : 'text-secondary-600 hover:bg-secondary-50 border-transparent'
              }`}
            >
              <Store size={20} />
              Store Information
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-l-4 ${
                activeTab === 'social'
                  ? 'bg-primary-50 text-primary-700 border-primary-600 font-medium'
                  : 'text-secondary-600 hover:bg-secondary-50 border-transparent'
              }`}
            >
              <Share2 size={20} />
              Social Media
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-l-4 ${
                activeTab === 'shipping'
                  ? 'bg-primary-50 text-primary-700 border-primary-600 font-medium'
                  : 'text-secondary-600 hover:bg-secondary-50 border-transparent'
              }`}
            >
              <Truck size={20} />
              Shipping & Delivery
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {/* Store Information Tab */}
          {activeTab === 'store' && (
            <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6 space-y-6">
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
                  loading={loading}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}

          {/* Social Media Tab */}
          {activeTab === 'social' && (
            <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6 space-y-6">
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
                  loading={loading}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}

          {/* Shipping Tab */}
          {activeTab === 'shipping' && (
            <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6 space-y-6">
              <h2 className="text-lg font-semibold text-secondary-900 mb-4 pb-2 border-b border-secondary-100">
                Shipping Configuration
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="label">Standard Shipping Cost (£)</label>
                  <input
                    type="number"
                    name="standardShippingCost"
                    value={shippingForm.standardShippingCost}
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
                    value={shippingForm.expressShippingCost}
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
                    value={shippingForm.freeShippingThreshold}
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
                  loading={loading}
                >
                  Save Changes
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