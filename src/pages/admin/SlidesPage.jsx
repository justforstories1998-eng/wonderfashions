import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  Move, 
  Image as ImageIcon, 
  Layout, 
  Upload 
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useCountry } from '../../context/CountryContext';
import { useToast } from '../../components/common/Toast';
import Button from '../../components/common/Button';
import Modal, { ConfirmModal } from '../../components/common/Modal';
import { defaultHeroSlide, generateId } from '../../data/settings';
import { processImage } from '../../utils/imageUtils';

const SlidesPage = () => {
  const { 
    getHomeDesign, 
    saveSection, 
    loading: settingsLoading, 
    saving 
  } = useSettings();
  const { countryConfig } = useCountry();
  const toast = useToast();

  const [selectedCountry, setSelectedCountry] = useState('uk');
  const [slides, setSlides] = useState([]);
  const [editingSlide, setEditingSlide] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!settingsLoading) {
      const design = getHomeDesign(selectedCountry);
      setSlides(design.heroSlides || []);
    }
  }, [settingsLoading, selectedCountry]);

  const handleSave = async () => {
    const result = await saveSection(`homeDesign.${selectedCountry}.heroSlides`, slides);
    if (result.success) {
      toast.success('Slides saved successfully');
    } else {
      toast.error('Failed to save slides');
    }
  };

  const handleAddSlide = () => {
    const newSlide = {
      ...defaultHeroSlide,
      id: generateId(),
      order: slides.length + 1
    };
    setEditingSlide(newSlide);
    setIsModalOpen(true);
  };

  const handleEdit = (slide) => {
    setEditingSlide(slide);
    setIsModalOpen(true);
  };

  const handleSlideImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const processedImage = await processImage(file);
      setEditingSlide(prev => ({ ...prev, image: processedImage }));
      toast.success("Image processed and ready!");
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Failed to process image");
    } finally {
      setUploading(false);
    }
  };

  const saveModalChanges = () => {
    if (slides.some(s => s.id === editingSlide.id)) {
      setSlides(prev => prev.map(s => s.id === editingSlide.id ? editingSlide : s));
    } else {
      setSlides([...slides, editingSlide]);
    }
    setIsModalOpen(false);
    setEditingSlide(null);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    setSlides(prev => prev.filter(s => s.id !== deleteId));
    setDeleteId(null);
  };

  const moveSlide = (index, direction) => {
    const newSlides = [...slides];
    if (direction === 'up' && index > 0) {
      [newSlides[index], newSlides[index - 1]] = [newSlides[index - 1], newSlides[index]];
    } else if (direction === 'down' && index < newSlides.length - 1) {
      [newSlides[index], newSlides[index + 1]] = [newSlides[index + 1], newSlides[index]];
    }
    newSlides.forEach((s, i) => s.order = i + 1);
    setSlides(newSlides);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Hero Slides</h1>
          <p className="text-secondary-500">Manage homepage hero slider content</p>
        </div>
        
        <div className="flex bg-white rounded-lg border border-secondary-200 p-1">
          {Object.values(countryConfig).map(country => (
            <button
              key={country.code}
              onClick={() => setSelectedCountry(country.code)}
              className={`
                px-4 py-2 rounded-md text-sm font-medium transition-all
                ${selectedCountry === country.code
                  ? 'bg-primary-50 text-primary-700 shadow-sm'
                  : 'text-secondary-600 hover:bg-secondary-50'
                }
              `}
            >
              {country.flag} {country.name}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-secondary-100 overflow-hidden">
        <div className="p-6 border-b border-secondary-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-secondary-900">Slides ({slides.length})</h2>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={handleAddSlide} icon={Plus}>
              Add Slide
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave} loading={saving} icon={Save} disabled={saving}>
              Save Changes
            </Button>
          </div>
        </div>

        <div className="divide-y divide-secondary-100">
          {slides.length === 0 ? (
            <div className="p-12 text-center text-secondary-500">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon size={32} className="text-secondary-400" />
              </div>
              <p className="text-lg font-medium text-secondary-900 mb-2">No slides yet</p>
              <p className="mb-6">Add your first slide to showcase featured content.</p>
              <Button onClick={handleAddSlide} variant="primary" icon={Plus}>
                Add First Slide
              </Button>
            </div>
          ) : (
            slides.map((slide, index) => (
              <div key={slide.id} className="p-6 flex flex-col md:flex-row gap-6 hover:bg-secondary-50 transition-colors group">
                <div className="w-full md:w-64 aspect-video bg-secondary-200 rounded-lg overflow-hidden flex-shrink-0 relative">
                  {slide.image ? (
                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-secondary-400">
                      <ImageIcon size={32} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button onClick={() => handleEdit(slide)} className="p-2 bg-white rounded-full text-secondary-700 hover:text-primary-600">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(slide.id)} className="p-2 bg-white rounded-full text-secondary-700 hover:text-red-600">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-1 block">
                        {slide.subtitle || 'No Subtitle'}
                      </span>
                      <h3 className="text-xl font-bold text-secondary-900 mb-2">
                        {slide.heading || 'No Heading'}
                      </h3>
                      <p className="text-secondary-600 text-sm line-clamp-2 mb-4">
                        {slide.description || 'No description'}
                      </p>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <button onClick={() => moveSlide(index, 'up')} disabled={index === 0} className="p-1 hover:bg-secondary-200 rounded text-secondary-500 disabled:opacity-30">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 15l-6-6-6 6"/></svg>
                      </button>
                      <button onClick={() => moveSlide(index, 'down')} disabled={index === slides.length - 1} className="p-1 hover:bg-secondary-200 rounded text-secondary-500 disabled:opacity-30">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-auto">
                    <span className="text-xs px-2 py-1 bg-secondary-200 rounded text-secondary-700">{slide.align || 'Left'} Align</span>
                    <span className="text-xs px-2 py-1 bg-secondary-200 rounded text-secondary-700">{slide.buttonText} → {slide.buttonLink}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSlide?.id ? 'Edit Slide' : 'Add New Slide'}
        size="xl"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={saveModalChanges} disabled={uploading}>Save Changes</Button>
          </>
        }
      >
        {editingSlide && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="label">Image</label>
                <div className="flex gap-2">
                  <input type="text" value={editingSlide.image || ''} onChange={(e) => setEditingSlide({...editingSlide, image: e.target.value})} className="input flex-1" placeholder="Image URL or Upload" />
                  <label className="cursor-pointer bg-secondary-100 hover:bg-secondary-200 p-3 rounded-lg transition-colors">
                    <Upload size={20} className="text-secondary-600" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleSlideImageUpload} disabled={uploading} />
                  </label>
                </div>
              </div>
              <div>
                <label className="label">Small Title (Subtitle)</label>
                <input type="text" value={editingSlide.subtitle} onChange={(e) => setEditingSlide({...editingSlide, subtitle: e.target.value})} className="input" placeholder="e.g., New Collection" />
              </div>
              <div>
                <label className="label">Main Heading</label>
                <input type="text" value={editingSlide.heading} onChange={(e) => setEditingSlide({...editingSlide, heading: e.target.value})} className="input" placeholder="e.g., Summer Sale 2024" />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea value={editingSlide.description} onChange={(e) => setEditingSlide({...editingSlide, description: e.target.value})} className="input" rows="3" placeholder="Short description..." />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Button Text</label>
                  <input type="text" value={editingSlide.buttonText} onChange={(e) => setEditingSlide({...editingSlide, buttonText: e.target.value})} className="input" />
                </div>
                <div>
                  <label className="label">Button Link</label>
                  <input type="text" value={editingSlide.buttonLink} onChange={(e) => setEditingSlide({...editingSlide, buttonLink: e.target.value})} className="input" />
                </div>
              </div>

              <div>
                <label className="label">Text Alignment</label>
                <div className="flex gap-2">
                  {['left', 'center', 'right'].map(align => (
                    <button key={align} onClick={() => setEditingSlide({...editingSlide, align})} className={`flex-1 py-2 rounded border capitalize ${editingSlide.align === align ? 'bg-primary-50 border-primary-600 text-primary-700' : 'border-secondary-300 text-secondary-600 hover:bg-secondary-50'}`}>
                      {align}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">Preview</label>
                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border border-secondary-200">
                  {editingSlide.image && <img src={editingSlide.image} className="absolute inset-0 w-full h-full object-cover" />}
                  <div className="absolute inset-0 bg-black/40 flex items-center p-4">
                    <div className={`w-full text-${editingSlide.align || 'left'}`}>
                      <p className="text-xs text-primary-300 uppercase">{editingSlide.subtitle}</p>
                      <h3 className="text-white font-bold">{editingSlide.heading}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Slide"
        message="Are you sure you want to delete this slide?"
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

export default SlidesPage;