import React, { useState, useEffect } from 'react';
import { Save, Smartphone, Monitor, Image as ImageIcon, Palette, Check, X, Edit3, Upload, Plus, Trash2 } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useCountry } from '../../context/CountryContext';
import { useToast } from '../../components/common/Toast';
import Button from '../../components/common/Button';
import { processImage } from '../../utils/imageUtils';
import { defaultHeroSlide, generateId } from '../../data/settings';

const HomeDesignPage = () => {
  const { settings, saveSettingsToServer, saving, getHomeDesign } = useSettings();
  const { countryConfig } = useCountry();
  const toast = useToast();

  const [activeCountry, setActiveCountry] = useState('uk');
  const [viewMode, setViewMode] = useState('desktop');
  const [localDesign, setLocalDesign] = useState({ sections: [], heroSlides: [] });
  const [editTarget, setEditTarget] = useState(null); 

  useEffect(() => {
    if (settings) {
      const design = getHomeDesign(activeCountry);
      setLocalDesign(JSON.parse(JSON.stringify(design)));
    }
  }, [settings, activeCountry]);

  const handleUpdate = (path, value) => {
    const keys = path.split('.');
    const updated = { ...localDesign };
    let current = updated;
    for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    setLocalDesign({ ...updated });
  };

  const handleSave = async () => {
    const updatedSettings = { ...settings };
    if (!updatedSettings.homeDesign) updatedSettings.homeDesign = {};
    updatedSettings.homeDesign[activeCountry] = localDesign;
    const res = await saveSettingsToServer(updatedSettings);
    if (res.success) toast.success("Design Published!");
  };

  const handleFileChange = async (e, path) => {
    const file = e.target.files[0];
    if (file) {
      const b64 = await processImage(file);
      handleUpdate(path, b64);
      setEditTarget(null);
    }
  };

  const Editable = ({ children, path, type = 'text', label }) => (
    <div className="relative group/edit">
      <div className="absolute -inset-1 border-2 border-transparent group-hover/edit:border-yellow-500 transition-all z-40 pointer-events-none"></div>
      <button onClick={() => setEditTarget({ path, type, value: children, label })} className="absolute -top-2 -right-2 bg-yellow-600 text-white p-1 opacity-0 group-hover/edit:opacity-100 z-50 rounded-full shadow-lg">
        <Edit3 size={10} />
      </button>
      {children}
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] font-sans">
      <div className="bg-white p-4 border-b flex justify-between items-center shadow-sm z-30">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold text-primary-900">VISUAL BUILDER</h1>
          <div className="flex bg-secondary-100 p-1 rounded-lg">
            {Object.values(countryConfig).map(c => (
              <button key={c.code} onClick={() => setActiveCountry(c.code)} className={`px-4 py-1 rounded-md text-xs font-bold ${activeCountry === c.code ? 'bg-primary-800 text-white shadow' : ''}`}>
                {c.flag} {c.name}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex bg-secondary-100 p-1 rounded-lg">
                <button onClick={() => setViewMode('desktop')} className={`p-2 ${viewMode === 'desktop' ? 'bg-white shadow' : ''}`}><Monitor size={18}/></button>
                <button onClick={() => setViewMode('mobile')} className={`p-2 ${viewMode === 'mobile' ? 'bg-white shadow' : ''}`}><Smartphone size={18}/></button>
            </div>
            <Button onClick={handleSave} loading={saving} icon={Save}>Publish Site</Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 bg-secondary-200 p-8 overflow-y-auto flex justify-center">
          <div className={`bg-white shadow-2xl transition-all duration-500 overflow-y-auto hide-scrollbar ${viewMode === 'mobile' ? 'w-[375px] rounded-[40px] border-[12px] border-secondary-900' : 'w-full max-w-5xl'}`}>
            
            <div className="p-2 bg-yellow-600 text-white text-[10px] font-bold uppercase flex justify-between">
                <span>Slider & Page Sections</span>
                <button onClick={() => setLocalDesign(prev => ({...prev, heroSlides: [...(prev.heroSlides || []), {...defaultHeroSlide, id: generateId()}]}))} className="hover:underline">+ Add Slide</button>
            </div>

            {(localDesign.heroSlides || []).map((slide, idx) => (
                <div key={slide.id || idx} className="relative h-[400px] bg-primary-950 flex items-center justify-center text-center text-white overflow-hidden border-b-2 border-secondary-500">
                    {slide.image && <img src={slide.image} className="absolute inset-0 w-full h-full object-cover opacity-50" alt="" />}
                    <div className="relative z-10 p-6 space-y-4 w-full">
                        <Editable path={`heroSlides.${idx}.heading`} label="Main Heading"><h2 className="text-4xl font-display font-bold text-secondary-100">{slide.heading}</h2></Editable>
                        <Editable path={`heroSlides.${idx}.description`} label="Description"><p className="text-sm text-secondary-200">{slide.description}</p></Editable>
                        <div className="flex justify-center gap-3">
                            <Editable path={`heroSlides.${idx}.buttonText`} label="Button Text"><button className="bg-secondary-500 text-primary-950 px-6 py-2 text-xs font-bold uppercase">{slide.buttonText}</button></Editable>
                            <button onClick={() => setEditTarget({ path: `heroSlides.${idx}.image`, type: 'image', label: 'Background Image'})} className="bg-white/10 p-2 rounded-full hover:bg-white/20"><ImageIcon size={16}/></button>
                            <button onClick={() => setLocalDesign(p => ({...p, heroSlides: p.heroSlides.filter((_, i) => i !== idx)}))} className="bg-red-500/20 p-2 rounded-full hover:bg-red-500"><Trash2 size={16}/></button>
                        </div>
                    </div>
                </div>
            ))}

            {(localDesign.sections || []).map((section, idx) => (
                <div key={section.id || idx} className="p-10 text-center border-b border-secondary-100 bg-secondary-50">
                    <Editable path={`sections.${idx}.title`} label="Section Title"><h3 className="text-2xl font-display font-bold text-primary-900">{section.title}</h3></Editable>
                    <Editable path={`sections.${idx}.subtitle`} label="Section Subtitle"><p className="text-xs text-secondary-500 italic mt-2">{section.subtitle}</p></Editable>
                </div>
            ))}
          </div>
        </div>

        {editTarget && (
            <div className="w-96 bg-white border-l shadow-2xl p-6 animate-slide-left z-50">
                <div className="flex justify-between items-center mb-8 border-b pb-4">
                    <h2 className="font-bold text-primary-900 uppercase text-xs">Editor: {editTarget.label}</h2>
                    <button onClick={() => setEditTarget(null)}><X size={20}/></button>
                </div>
                <div className="space-y-6">
                    {editTarget.type === 'text' && (
                        <textarea className="input h-40 text-sm" value={typeof editTarget.value === 'string' ? editTarget.value : (editTarget.value?.props?.children || '')} onChange={e => handleUpdate(editTarget.path, e.target.value)} />
                    )}
                    {editTarget.type === 'image' && (
                        <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-secondary-200 rounded-xl cursor-pointer bg-secondary-50 hover:bg-white transition-all">
                            <Upload size={32} className="text-secondary-300 mb-2" />
                            <span className="text-xs font-bold text-secondary-600">Click to Upload</span>
                            <input type="file" className="hidden" onChange={e => handleFileChange(e, editTarget.path)} accept="image/*" />
                        </label>
                    )}
                    <Button fullWidth onClick={() => setEditTarget(null)} icon={Check}>Apply Changes</Button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default HomeDesignPage;