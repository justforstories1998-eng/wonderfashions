import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Smartphone, 
  Monitor, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Move
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useCountry } from '../../context/CountryContext';
import { useToast } from '../../components/common/Toast';
import Button from '../../components/common/Button';
import Modal, { ConfirmModal } from '../../components/common/Modal';
import { sectionTypes, defaultSection, generateId } from '../../data/settings';

// Import actual customer components for Live Preview
import Hero from '../../components/customer/Hero';
import { PromoBanner, BestSellers, SpecialOffers } from '../../components/customer/FeaturedProducts';
import FeaturedProducts from '../../components/customer/FeaturedProducts';
import Categories from '../../components/customer/Categories';

const HomeDesignPage = () => {
  const { getHomeDesign, saveSection, loading: settingsLoading, saving } = useSettings();
  const { countryConfig } = useCountry();
  const toast = useToast();

  const [selectedCountry, setSelectedCountry] = useState('uk');
  const [viewMode, setViewMode] = useState('desktop'); // 'desktop' or 'mobile'
  const [sections, setSections] = useState([]);
  const [heroSlides, setHeroSlides] = useState([]);
  
  // Editing state
  const [editingSection, setEditingSection] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Load data
  useEffect(() => {
    if (!settingsLoading) {
      const design = getHomeDesign(selectedCountry);
      setSections(design.sections || []);
      setHeroSlides(design.heroSlides || []);
    }
  }, [settingsLoading, selectedCountry]);

  const handleSave = async () => {
    const result = await saveSection(`homeDesign.${selectedCountry}.sections`, sections);
    if (result.success) {
      toast.success('Design saved! Updates will reflect in 1-2 mins.');
    } else {
      toast.error('Failed to save.');
    }
  };

  const handleAddSection = (type) => {
    const newSection = {
      ...defaultSection,
      id: generateId(),
      type: type,
      order: sections.length + 1
    };
    setSections([...sections, newSection]);
    setEditingSection(newSection);
    setIsModalOpen(true);
  };

  const handleEdit = (section) => {
    setEditingSection(section);
    setIsModalOpen(true);
  };

  const saveModalChanges = () => {
    setSections(prev => prev.map(s => s.id === editingSection.id ? editingSection : s));
    setIsModalOpen(false);
    setEditingSection(null);
  };

  const handleDelete = (id) => setDeleteId(id);
  
  const confirmDelete = () => {
    setSections(prev => prev.filter(s => s.id !== deleteId));
    setDeleteId(null);
  };

  const moveSection = (index, direction) => {
    const newSections = [...sections];
    if (direction === 'up' && index > 0) {
      [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
    } else if (direction === 'down' && index < newSections.length - 1) {
      [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    }
    newSections.forEach((s, i) => s.order = i + 1);
    setSections(newSections);
  };

  // Render Component Wrapper for Visual Editing
  const EditableWrapper = ({ section, children, index }) => (
    <div className={`relative group border-2 border-transparent hover:border-primary-500 transition-all ${!section.enabled ? 'opacity-50 grayscale' : ''}`}>
      {/* Edit Overlay (Visible on Hover) */}
      <div className="absolute top-2 right-2 z-50 opacity-0 group-hover:opacity-100 flex gap-2 bg-white/90 p-2 rounded-lg shadow-lg backdrop-blur-sm transition-opacity">
        <span className="text-xs font-bold text-secondary-500 uppercase self-center mr-2">{section.type}</span>
        <button onClick={() => moveSection(index, 'up')} disabled={index === 0} className="p-1 hover:text-primary-600 disabled:opacity-30"><Move size={16} className="rotate-180" /></button>
        <button onClick={() => moveSection(index, 'down')} disabled={index === sections.length - 1} className="p-1 hover:text-primary-600 disabled:opacity-30"><Move size={16} /></button>
        <div className="w-px h-4 bg-gray-300 mx-1"></div>
        <button onClick={() => setSections(prev => prev.map(s => s.id === section.id ? { ...s, enabled: !s.enabled } : s))} className="p-1 hover:text-primary-600">
          {section.enabled ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
        <button onClick={() => handleEdit(section)} className="p-1 hover:text-blue-600"><Edit size={16} /></button>
        <button onClick={() => handleDelete(section.id)} className="p-1 hover:text-red-600"><Trash2 size={16} /></button>
      </div>
      {children}
    </div>
  );

  // Render actual component based on type
  const renderComponent = (section) => {
    const props = { ...section, previewMode: true };
    switch (section.type) {
      case 'categories': return <Categories {...props} />;
      case 'featuredProducts': return <FeaturedProducts {...props} />;
      case 'trendingProducts': return <BestSellers {...props} />;
      case 'newArrivals': return <SpecialOffers {...props} />;
      case 'promoBanner': return <PromoBanner {...props} />;
      default: return <div className="p-8 text-center bg-gray-100">Unknown Section Type: {section.type}</div>;
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-secondary-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-secondary-900">Visual Editor</h1>
          {/* Country Switcher */}
          <div className="flex bg-secondary-100 rounded-lg p-1">
            {Object.values(countryConfig).map(c => (
              <button key={c.code} onClick={() => setSelectedCountry(c.code)} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${selectedCountry === c.code ? 'bg-white shadow-sm text-primary-700' : 'text-secondary-600 hover:bg-secondary-200'}`}>
                {c.flag} {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode */}
          <div className="flex bg-secondary-100 rounded-lg p-1">
            <button onClick={() => setViewMode('desktop')} className={`p-2 rounded-md ${viewMode === 'desktop' ? 'bg-white shadow-sm text-primary-700' : 'text-secondary-500'}`}><Monitor size={18} /></button>
            <button onClick={() => setViewMode('mobile')} className={`p-2 rounded-md ${viewMode === 'mobile' ? 'bg-white shadow-sm text-primary-700' : 'text-secondary-500'}`}><Smartphone size={18} /></button>
          </div>
          
          <div className="h-6 w-px bg-secondary-300"></div>
          
          <Button variant="outline" size="sm" icon={Plus} onClick={() => setIsModalOpen(true)}>Add Section</Button>
          <Button variant="primary" size="sm" icon={Save} onClick={handleSave} loading={saving}>Save Changes</Button>
        </div>
      </div>

      {/* Visual Canvas */}
      <div className="flex-1 bg-secondary-100 rounded-xl overflow-hidden flex justify-center p-4 md:p-8 relative">
        <div className={`bg-white shadow-2xl transition-all duration-500 overflow-y-auto hide-scrollbar ${viewMode === 'mobile' ? 'w-[375px] rounded-[30px] border-[8px] border-secondary-800' : 'w-full max-w-6xl rounded-lg'}`}>
          {/* Hero Section (Non-editable here, visual only) */}
          <div className="relative group border-b-2 border-dashed border-secondary-200">
            <div className="absolute top-2 left-2 bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded z-50">HERO SLIDES (Edit in Slides Tab)</div>
            <Hero previewData={heroSlides} />
          </div>

          {/* Dynamic Sections */}
          <div className="flex flex-col">
            {sections.length === 0 ? (
              <div className="p-20 text-center">
                <p className="text-secondary-400 mb-4">No sections yet.</p>
                <Button variant="outline" onClick={() => setIsModalOpen(true)}>+ Add Your First Section</Button>
              </div>
            ) : (
              sections.map((section, index) => (
                <EditableWrapper key={section.id} section={section} index={index}>
                  {renderComponent(section)}
                </EditableWrapper>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Edit/Add Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingSection(null); }}
        title={editingSection ? 'Edit Section' : 'Add New Section'}
        size="lg"
      >
        {/* If adding new, show selector */}
        {!editingSection && (
          <div className="grid grid-cols-2 gap-4">
            {sectionTypes.map(t => (
              <button key={t.type} onClick={() => handleAddSection(t.type)} className="p-4 border rounded-lg hover:bg-primary-50 hover:border-primary-500 text-left">
                <span className="block font-bold">{t.name}</span>
                <span className="text-xs text-gray-500">{t.description}</span>
              </button>
            ))}
          </div>
        )}

        {/* If editing, show form */}
        {editingSection && (
          <div className="space-y-4">
            <div>
              <label className="label">Section Title</label>
              <input type="text" value={editingSection.title} onChange={e => setEditingSection({...editingSection, title: e.target.value})} className="input" />
            </div>
            <div>
              <label className="label">Subtitle</label>
              <input type="text" value={editingSection.subtitle} onChange={e => setEditingSection({...editingSection, subtitle: e.target.value})} className="input" />
            </div>
            {editingSection.type === 'promoBanner' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Button Text</label>
                    <input type="text" value={editingSection.buttonText} onChange={e => setEditingSection({...editingSection, buttonText: e.target.value})} className="input" />
                  </div>
                  <div>
                    <label className="label">Button Link</label>
                    <input type="text" value={editingSection.buttonLink} onChange={e => setEditingSection({...editingSection, buttonLink: e.target.value})} className="input" />
                  </div>
                </div>
                <div>
                  <label className="label">Background Color</label>
                  <div className="flex gap-2">
                    <input type="color" value={editingSection.backgroundColor} onChange={e => setEditingSection({...editingSection, backgroundColor: e.target.value})} className="h-10 w-20 p-1 border rounded" />
                    <input type="text" value={editingSection.backgroundColor} onChange={e => setEditingSection({...editingSection, backgroundColor: e.target.value})} className="input flex-1" />
                  </div>
                </div>
              </>
            )}
            <div className="pt-4 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={saveModalChanges}>Apply Changes</Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal 
        isOpen={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={confirmDelete} 
        title="Delete Section" 
        message="Remove this section from the home page?" 
        variant="danger" 
      />
    </div>
  );
};

export default HomeDesignPage;