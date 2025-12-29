import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Save, 
  ChevronRight, 
  ChevronDown,
  Folder,
  FolderPlus,
  Edit, // Added Edit icon
  FolderOpen
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../components/common/Toast';
import Button from '../../components/common/Button';
import Modal, { ConfirmModal } from '../../components/common/Modal';
import { generateId } from '../../data/settings';

const CategoryManagerPage = () => {
  const { settings, saveSettingsToServer, saving } = useSettings();
  const toast = useToast();

  const [categories, setCategories] = useState(settings.categories || []);
  const [expandedCategories, setExpandedCategories] = useState({});
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const [currentParentId, setCurrentParentId] = useState(null); 
  const [currentCategoryId, setCurrentCategoryId] = useState(null); // ID of cat being edited
  const [categoryName, setCategoryName] = useState('');
  
  // Delete States
  const [deleteData, setDeleteData] = useState(null); // { id, parentId }

  // Toggle expand/collapse
  const toggleExpand = (id) => {
    setExpandedCategories(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Open Modal for Adding
  const openAddModal = (parentId = null) => {
    setIsEditMode(false);
    setCurrentParentId(parentId);
    setCurrentCategoryId(null);
    setCategoryName('');
    setIsModalOpen(true);
  };

  // Open Modal for Editing
  const openEditModal = (category, parentId = null) => {
    setIsEditMode(true);
    setCurrentParentId(parentId);
    setCurrentCategoryId(category.id);
    setCategoryName(category.name);
    setIsModalOpen(true);
  };

  // Handle Save (Add or Edit)
  const handleSaveCategory = () => {
    if (!categoryName.trim()) {
      toast.error("Category name required");
      return;
    }

    const slug = categoryName.toLowerCase().replace(/\s+/g, '-');

    if (isEditMode) {
      // --- EDIT MODE ---
      if (currentParentId) {
        // Edit Subcategory
        setCategories(prev => prev.map(cat => {
          if (cat.id === currentParentId) {
            return {
              ...cat,
              subcategories: cat.subcategories.map(sub => 
                sub.id === currentCategoryId ? { ...sub, name: categoryName, slug: slug } : sub
              )
            };
          }
          return cat;
        }));
      } else {
        // Edit Root Category
        setCategories(prev => prev.map(cat => 
          cat.id === currentCategoryId ? { ...cat, name: categoryName, slug: slug } : cat
        ));
      }
      toast.success("Category renamed!");
    } else {
      // --- ADD MODE ---
      const newCat = {
        id: generateId(),
        name: categoryName,
        slug: slug,
        enabled: true,
        subcategories: []
      };

      if (currentParentId) {
        // Add Subcategory
        setCategories(prev => prev.map(cat => {
          if (cat.id === currentParentId) {
            return {
              ...cat,
              subcategories: [...(cat.subcategories || []), newCat]
            };
          }
          return cat;
        }));
        setExpandedCategories(prev => ({ ...prev, [currentParentId]: true })); // Auto expand
      } else {
        // Add Root Category
        setCategories(prev => [...prev, newCat]);
      }
      toast.success("Category added!");
    }

    setIsModalOpen(false);
  };

  // Handle Delete
  const handleDelete = (id, parentId = null) => {
    setDeleteData({ id, parentId });
  };

  const confirmDelete = () => {
    const { id, parentId } = deleteData;

    if (parentId) {
      // Delete subcategory
      setCategories(prev => prev.map(cat => {
        if (cat.id === parentId) {
          return {
            ...cat,
            subcategories: cat.subcategories.filter(sub => sub.id !== id)
          };
        }
        return cat;
      }));
    } else {
      // Delete root category
      setCategories(prev => prev.filter(cat => cat.id !== id));
    }

    setDeleteData(null);
    toast.success("Category removed.");
  };

  // Save changes to Server/Local
  const handleSaveChanges = async () => {
    try {
      const updatedSettings = {
        ...settings,
        categories: categories
      };
      const result = await saveSettingsToServer(updatedSettings);
      
      if (result.success) {
        toast.success("Category structure saved!");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Save failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Manage Categories</h1>
          <p className="text-secondary-500">Create, rename, or organize shop categories.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => openAddModal(null)} icon={Plus}>Add Category</Button>
          <Button variant="primary" onClick={handleSaveChanges} loading={saving} icon={Save}>Save Changes</Button>
        </div>
      </div>

      {/* Category Tree */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-100 overflow-hidden">
        <div className="p-4 bg-secondary-50 border-b border-secondary-100 font-semibold text-secondary-700 flex justify-between">
          <span>Category Structure</span>
          <span className="text-xs font-normal text-secondary-500">Drag & Drop not supported yet</span>
        </div>
        
        <div className="p-6">
          {categories.length === 0 ? (
            <div className="text-center py-10 text-secondary-400">
              <FolderOpen size={48} className="mx-auto mb-2 text-secondary-300" />
              <p>No categories defined.</p>
              <button onClick={() => openAddModal(null)} className="text-primary-600 hover:underline mt-2 font-medium">Add your first category</button>
            </div>
          ) : (
            <ul className="space-y-3">
              {categories.map(category => (
                <li key={category.id} className="border border-secondary-200 rounded-lg bg-white overflow-hidden transition-all hover:border-secondary-300">
                  {/* Root Category Row */}
                  <div className="flex items-center justify-between p-3 bg-secondary-50/30">
                    <div className="flex items-center gap-3 flex-1">
                      <button 
                        onClick={() => toggleExpand(category.id)}
                        className="p-1 hover:bg-secondary-100 rounded text-secondary-500 transition-colors"
                      >
                        {expandedCategories[category.id] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      </button>
                      <Folder className="text-primary-700 fill-primary-50" size={20} />
                      
                      <div className="flex flex-col">
                        <span className="font-semibold text-secondary-900">{category.name}</span>
                        <span className="text-[10px] text-secondary-400 uppercase tracking-wider">/ {category.slug}</span>
                      </div>
                      
                      {category.subcategories?.length > 0 && (
                        <span className="text-xs text-secondary-500 bg-white border border-secondary-200 px-2 py-0.5 rounded-full ml-2">
                          {category.subcategories.length}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => openEditModal(category, null)}
                        className="p-2 text-secondary-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Rename"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => openAddModal(category.id)}
                        className="p-2 text-secondary-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Add Subcategory"
                      >
                        <FolderPlus size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(category.id)}
                        className="p-2 text-secondary-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Subcategories List */}
                  {expandedCategories[category.id] && (
                    <div className="bg-white border-t border-secondary-100">
                      {category.subcategories && category.subcategories.length > 0 ? (
                        <ul className="divide-y divide-secondary-50">
                          {category.subcategories.map(sub => (
                            <li key={sub.id} className="flex items-center justify-between py-2 px-4 pl-12 hover:bg-secondary-50 transition-colors group">
                              <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-secondary-300 group-hover:bg-primary-400 transition-colors"></div>
                                <span className="text-sm font-medium text-secondary-700">{sub.name}</span>
                              </div>
                              
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => openEditModal(sub, category.id)}
                                  className="p-1.5 text-secondary-400 hover:text-blue-600 rounded transition-colors"
                                >
                                  <Edit size={14} />
                                </button>
                                <button 
                                  onClick={() => handleDelete(sub.id, category.id)}
                                  className="p-1.5 text-secondary-400 hover:text-red-600 rounded transition-colors"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="py-3 pl-12 text-sm text-secondary-400 italic flex items-center gap-2">
                          <Plus size={14} /> No subcategories. Add one using the + button.
                        </div>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditMode ? "Rename Category" : (currentParentId ? "Add Subcategory" : "Add Root Category")}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveCategory}>{isEditMode ? "Save" : "Add"}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label">Category Name</label>
            <input 
              type="text" 
              className="input" 
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g. Sarees"
              autoFocus
              onKeyPress={(e) => e.key === 'Enter' && handleSaveCategory()}
            />
            {isEditMode && (
              <p className="text-xs text-secondary-400 mt-2">
                Note: Renaming will automatically update the URL slug.
              </p>
            )}
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteData}
        onClose={() => setDeleteData(null)}
        onConfirm={confirmDelete}
        title="Delete Category"
        message="Are you sure? This will remove the category from the menu. Existing products will retain their category text but won't be filterable via menu."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

export default CategoryManagerPage;