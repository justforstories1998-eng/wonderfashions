import React, { useState, useEffect } from 'react';
import { 
  Store, 
  Share2, // Explicitly added the missing icon here
  Truck, 
  Save, 
  Layout, 
  Palette, 
  Type, 
  Upload, 
  X, 
  Globe, 
  ShieldCheck, 
  Trash2, 
  Plus, 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Link as LinkIcon, 
  AlertCircle,
  Edit
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../components/common/Toast';
import Button from '../../components/common/Button';
import { processImage } from '../../utils/imageUtils';

const SettingsPage = () => {
  const { settings, saveSettingsToServer, saving } = useSettings();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('branding');
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (settings) {
        const data = JSON.parse(JSON.stringify(settings));
        if (!data.socialMediaList) data.socialMediaList = [];
        if (!data.header) data.header = { announcement: '', showAnnouncement: true, sticky: true };
        setFormData(data);
    }
  }, [settings]);

  const handleSave = async () => {
    const res = await saveSettingsToServer(formData);
    if (res.success) toast.success("Royal settings published successfully!");
    else toast.error("Error: " + res.message);
  };

  const updateField = (path, value) => {
    const keys = path.split('.');
    const newData = { ...formData };
    let current = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setFormData(newData);
  };

  const addSocial = () => {
    const newList = [...(formData.socialMediaList || [])];
    newList.push({ id: Date.now().toString(), platform: 'instagram', url: '', enabled: true });
    updateField('socialMediaList', newList);
  };

  const removeSocial = (id) => {
    const newList = formData.socialMediaList.filter(s => s.id !== id);
    updateField('socialMediaList', newList);
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const b64 = await processImage(file);
        updateField('branding.logo', b64);
        toast.success("Logo uploaded!");
      } catch (err) {
        toast.error("Upload failed");
      }
    }
  };

  if (!formData) return <div className="p-10 text-center font-display text-primary-900">Accessing Royal Archives...</div>;

  return (
    <div className="space-y-6 pb-20 font-sans min-h-screen">
      {/* Header Bar */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-secondary-200">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary-900 uppercase tracking-widest">Store Configuration</h1>
          <p className="text-xs text-secondary-500 italic">Manage your brand's digital identity</p>
        </div>
        <Button onClick={handleSave} loading={saving} icon={Save} className="bg-primary-800 hover:bg-primary-900">Publish to Live Site</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="space-y-2">
          {[
            { id: 'branding', label: 'Identity', icon: Palette },
            { id: 'header', label: 'Header', icon: Layout },
            { id: 'footer', label: 'Footer', icon: Type },
            { id: 'social', label: 'Social Links', icon: Share2 },
            { id: 'policies', label: 'Policies', icon: ShieldCheck },
            { id: 'shipping', label: 'Logistics', icon: Globe }
          ].map(tab => (
            <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)} 
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl text-left transition-all ${activeTab === tab.id ? 'bg-primary-800 text-white shadow-lg' : 'bg-white text-secondary-600 hover:bg-secondary-50 border border-secondary-100'}`}
            >
              <tab.icon size={18} /> 
              <span className="text-xs font-bold uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3">
          
          {/* Identity Tab */}
          {activeTab === 'branding' && (
            <div className="bg-white rounded-2xl shadow-sm border border-secondary-200 p-8 space-y-8 animate-fade-in">
                <h2 className="text-xl font-display font-bold text-primary-900 border-b pb-4 uppercase tracking-widest">Brand Identity</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <label className="text-xs font-bold uppercase text-secondary-500">Logo Design</label>
                        <div className="h-48 w-48 border-4 border-dashed border-secondary-100 rounded-2xl flex items-center justify-center relative overflow-hidden bg-secondary-50 group">
                            {formData.branding?.logo ? (
                                <>
                                    <img src={formData.branding.logo} className="h-full w-full object-contain p-4" alt="Store Logo" />
                                    <button onClick={() => updateField('branding.logo', null)} className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><X size={14}/></button>
                                </>
                            ) : (
                                <div className="text-center"><Upload className="mx-auto text-secondary-300 mb-2" size={32} /><span className="text-[10px] font-bold text-secondary-400 uppercase">Click to Upload</span></div>
                            )}
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleLogoUpload} accept="image/*" />
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div><label className="label">Primary Store Name</label><input className="input" value={formData.branding?.fallbackText || ''} onChange={e => updateField('branding.fallbackText', e.target.value)} /></div>
                        <div><label className="label">Tagline / Sub-text</label><input className="input" value={formData.branding?.subText || ''} onChange={e => updateField('branding.subText', e.target.value)} /></div>
                    </div>
                </div>
            </div>
          )}

          {/* Header Tab */}
          {activeTab === 'header' && (
            <div className="bg-white rounded-2xl shadow-sm border border-secondary-200 p-8 space-y-8 animate-fade-in">
              <h2 className="text-xl font-display font-bold text-primary-900 border-b pb-4 uppercase tracking-widest">Header Bar</h2>
              <div className="p-4 bg-secondary-50 rounded-xl border border-secondary-200 flex items-center justify-between">
                <div><p className="font-bold text-primary-900 text-sm">Announcement Bar</p></div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={formData.header?.showAnnouncement} onChange={e => updateField('header.showAnnouncement', e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary-800 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
              <div>
                <label className="label">Message Text</label>
                <input className="input" value={formData.header?.announcement || ''} onChange={e => updateField('header.announcement', e.target.value)} placeholder="Enter offer text..." />
              </div>
            </div>
          )}

          {/* Social Media Tab */}
          {activeTab === 'social' && (
            <div className="bg-white rounded-2xl shadow-sm border border-secondary-200 p-8 space-y-6 animate-fade-in">
              <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-xl font-display font-bold text-primary-900 uppercase tracking-widest">Social Media</h2>
                <Button size="sm" variant="outline" onClick={addSocial} icon={Plus}>Add Platform</Button>
              </div>
              <div className="space-y-4">
                {formData.socialMediaList?.map((social, idx) => (
                  <div key={social.id} className="p-4 border rounded-xl bg-secondary-50/50 flex items-center gap-4 relative group">
                    <div className="flex-1">
                      <select className="input py-1.5 text-sm bg-white" value={social.platform} onChange={e => {
                        const newList = [...formData.socialMediaList];
                        newList[idx].platform = e.target.value;
                        updateField('socialMediaList', newList);
                      }}>
                        <option value="facebook">Facebook</option>
                        <option value="instagram">Instagram</option>
                        <option value="twitter">Twitter / X</option>
                        <option value="youtube">Youtube</option>
                        <option value="whatsapp">WhatsApp</option>
                      </select>
                    </div>
                    <div className="flex-[2]">
                      <input className="input py-1.5 text-sm" value={social.url} onChange={e => {
                        const newList = [...formData.socialMediaList];
                        newList[idx].url = e.target.value;
                        updateField('socialMediaList', newList);
                      }} placeholder="Link URL" />
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={social.enabled} onChange={e => {
                            const newList = [...formData.socialMediaList];
                            newList[idx].enabled = e.target.checked;
                            updateField('socialMediaList', newList);
                          }} className="sr-only peer" />
                          <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                        </label>
                        <button onClick={() => removeSocial(social.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full"><Trash2 size={18}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Tab */}
          {activeTab === 'footer' && (
            <div className="bg-white rounded-2xl shadow-sm border border-secondary-200 p-8 space-y-8 animate-fade-in">
              <h2 className="text-xl font-display font-bold text-primary-900 border-b pb-4 uppercase tracking-widest">Footer Content</h2>
              <div>
                <label className="label">About Us (Short)</label>
                <textarea className="input h-24 italic" value={formData.footer?.aboutText} onChange={e => updateField('footer.aboutText', e.target.value)} />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center"><label className="label">Menu Columns</label><Button size="sm" variant="outline" onClick={() => updateField('footer.columns', [...(formData.footer.columns || []), { title: 'New Column', links: [] }])}><Plus size={14}/> Add Column</Button></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.footer?.columns?.map((col, cIdx) => (
                        <div key={cIdx} className="p-4 border rounded-xl bg-secondary-50 relative">
                            <button onClick={() => updateField('footer.columns', formData.footer.columns.filter((_, i) => i !== cIdx))} className="absolute top-2 right-2 text-red-500"><X size={14}/></button>
                            <input className="font-bold text-sm bg-transparent border-b mb-4 outline-none w-full" value={col.title} onChange={e => {
                                const newCols = [...formData.footer.columns];
                                newCols[cIdx].title = e.target.value;
                                updateField('footer.columns', newCols);
                            }} />
                            <div className="space-y-2">
                                {col.links?.map((link, lIdx) => (
                                    <div key={lIdx} className="flex gap-2">
                                        <input className="input py-1 px-2 text-[10px] flex-1" value={link.label} onChange={e => {
                                            const newCols = [...formData.footer.columns];
                                            newCols[cIdx].links[lIdx].label = e.target.value;
                                            updateField('footer.columns', newCols);
                                        }} />
                                        <input className="input py-1 px-2 text-[10px] flex-1" value={link.url} onChange={e => {
                                            const newCols = [...formData.footer.columns];
                                            newCols[cIdx].links[lIdx].url = e.target.value;
                                            updateField('footer.columns', newCols);
                                        }} />
                                        <button onClick={() => {
                                            const newCols = [...formData.footer.columns];
                                            newCols[cIdx].links = newCols[cIdx].links.filter((_, i) => i !== lIdx);
                                            updateField('footer.columns', newCols);
                                        }} className="text-secondary-400"><X size={12}/></button>
                                    </div>
                                ))}
                                <button onClick={() => {
                                    const newCols = [...formData.footer.columns];
                                    newCols[cIdx].links.push({ label: 'New Link', url: '/shop' });
                                    updateField('footer.columns', newCols);
                                }} className="text-[10px] font-bold text-primary-700 uppercase">+ Add Link</button>
                            </div>
                        </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Policies Tab */}
          {activeTab === 'policies' && (
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-8 space-y-6 animate-fade-in">
              <h2 className="text-xl font-display font-bold text-primary-900 border-b pb-4 uppercase tracking-widest">Store Policies</h2>
              <div><label className="label">Privacy Policy</label><textarea className="input h-64 font-sans text-sm" value={formData.policies?.privacy} onChange={e => updateField('policies.privacy', e.target.value)} /></div>
              <div><label className="label">Terms & Conditions</label><textarea className="input h-64 font-sans text-sm" value={formData.policies?.terms} onChange={e => updateField('policies.terms', e.target.value)} /></div>
            </div>
          )}

          {/* Shipping Tab */}
          {activeTab === 'shipping' && (
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-8 space-y-8 animate-fade-in">
              <h2 className="text-xl font-display font-bold text-primary-900 border-b pb-4 uppercase tracking-widest">Global Logistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 border rounded-2xl bg-secondary-50/50">
                    <h3 className="font-bold mb-4 flex items-center gap-2">🇮🇳 India (₹)</h3>
                    <div className="space-y-4">
                        <div><label className="text-[10px] font-bold uppercase text-secondary-500">Free Delivery Min</label><input type="number" className="input" value={formData.countries?.india?.shipping?.freeShippingThreshold} onChange={e => updateField('countries.india.shipping.freeShippingThreshold', parseFloat(e.target.value))} /></div>
                        <div><label className="text-[10px] font-bold uppercase text-secondary-500">Standard Cost</label><input type="number" className="input" value={formData.countries?.india?.shipping?.standardShippingCost} onChange={e => updateField('countries.india.shipping.standardShippingCost', parseFloat(e.target.value))} /></div>
                    </div>
                </div>
                <div className="p-6 border rounded-2xl bg-secondary-50/50">
                    <h3 className="font-bold mb-4 flex items-center gap-2">🇬🇧 UK (£)</h3>
                    <div className="space-y-4">
                        <div><label className="text-[10px] font-bold uppercase text-secondary-500">Free Delivery Min</label><input type="number" className="input" value={formData.countries?.uk?.shipping?.freeShippingThreshold} onChange={e => updateField('countries.uk.shipping.freeShippingThreshold', parseFloat(e.target.value))} /></div>
                        <div><label className="text-[10px] font-bold uppercase text-secondary-500">Standard Cost</label><input type="number" className="input" value={formData.countries?.uk?.shipping?.standardShippingCost} onChange={e => updateField('countries.uk.shipping.standardShippingCost', parseFloat(e.target.value))} /></div>
                    </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;