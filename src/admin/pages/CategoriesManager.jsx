import React, { useState } from 'react';
import { 
  Layers, Plus, Edit3, Trash2, Power, Upload, Check, ArrowUp, ArrowDown 
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { uploadToCloudinary } from '../../services/cloudinary';

export default function CategoriesManager({ adminEmail }) {
  const { 
    categories, setCategories, 
    siteSettings, setSiteSettings,
    saveCmsItem, deleteCmsItem, updateDisplayOrder, logActivity, refreshAllData 
  } = useCMS();

  const [editingCategory, setEditingCategory] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const currentLayoutStyle = siteSettings?.category_layout_style || 'grid';

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleUpdateLayoutStyle = async (newStyle) => {
    try {
      const updatedValue = {
        ...(siteSettings || {}),
        category_layout_style: newStyle
      };
      
      const payload = {
        id: siteSettings?.id,
        key: 'global_config',
        value: updatedValue
      };

      await saveCmsItem('site_settings', payload);
      setSiteSettings(updatedValue);
      await logActivity(adminEmail, 'UPDATED', 'Categories Layout', `Category Display Style: ${newStyle.toUpperCase()}`);
      refreshAllData();
      showToast(`Category Display Style saved to Supabase: ${newStyle.toUpperCase()}`);
    } catch (err) {
      alert('Error updating category layout style: ' + err.message);
    }
  };

  const handleMoveCategory = async (index, direction) => {
    const newCats = [...categories];
    const targetIdx = direction === 'UP' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newCats.length) return;

    const temp = newCats[index];
    newCats[index] = newCats[targetIdx];
    newCats[targetIdx] = temp;

    setCategories(newCats);
    await updateDisplayOrder('categories', newCats);
    await logActivity(adminEmail, 'REORDERED', 'Categories');
    showToast('Category Order Updated in Supabase.');
  };

  const handleToggleStatus = async (cat) => {
    try {
      const updated = { ...cat, is_active: !cat.is_active };
      await saveCmsItem('categories', updated);
      await logActivity(adminEmail, updated.is_active ? 'ENABLED' : 'DISABLED', 'Categories', cat.name);
      refreshAllData();
      showToast(updated.is_active ? 'Category Enabled' : 'Category Disabled');
    } catch (err) {
      alert('Error toggling category: ' + err.message);
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      await deleteCmsItem('categories', id);
      await logActivity(adminEmail, 'DELETED', 'Categories', name);
      refreshAllData();
      showToast('Category Deleted.');
    } catch (err) {
      alert('Error deleting category: ' + err.message);
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData(e.target);
      const name = formData.get('name');
      const payload = {
        id: editingCategory?.id,
        name: name,
        slug: editingCategory?.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        icon: formData.get('icon') || 'Sparkles',
        image_url: formData.get('image_url'),
        group_name: formData.get('group_name') || 'Mobile / Gadgets',
        is_active: editingCategory ? editingCategory.is_active : true,
        display_order: editingCategory ? editingCategory.display_order : categories.length + 1
      };

      await saveCmsItem('categories', payload);
      await logActivity(adminEmail, editingCategory?.id ? 'EDITED' : 'ADDED', 'Categories', payload.name);
      refreshAllData();
      setEditingCategory(null);
      showToast('Category Saved Successfully.');
    } catch (err) {
      alert('Error saving category: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUploadInput = async (e, inputId) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadToCloudinary(file, 'categories');
      const inputEl = document.getElementById(inputId);
      if (inputEl) inputEl.value = res.url;
      showToast('Category Image Uploaded!');
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#008744] text-white px-5 py-3 rounded-xl shadow-2xl font-bold text-xs flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" /> {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-purple-500" /> Categories Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Add, edit, reorder, and enable/disable website product categories.
          </p>
        </div>
        <button
          onClick={() => setEditingCategory({ icon: 'Sparkles', group_name: 'Mobile / Gadgets' })}
          className="px-4 py-2.5 rounded-xl bg-[#008744] hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* ADMIN CONTROL: All OTTs Category Display Style Setting */}
      <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
        <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
          <span>All OTTs → Category Display Style (Supabase Controlled)</span>
        </h2>
        <p className="text-xs text-slate-400">
          Choose how categories appear on the public "All OTTs" page. Stored directly in Supabase.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* OPTION A: GRID / STABLE */}
          <button
            type="button"
            onClick={() => handleUpdateLayoutStyle('grid')}
            className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
              currentLayoutStyle === 'grid'
                ? 'bg-purple-950/60 border-purple-500 text-white shadow-lg shadow-purple-900/40 ring-2 ring-purple-500'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between font-extrabold text-sm mb-1">
                <span>OPTION A — Grid / Stable</span>
                {currentLayoutStyle === 'grid' && <span className="bg-purple-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black">ACTIVE</span>}
              </div>
              <p className="text-xs text-slate-400">
                Categories wrap naturally side-by-side according to screen width. No horizontal scrolling. (Recommended)
              </p>
            </div>
          </button>

          {/* OPTION B: HORIZONTAL */}
          <button
            type="button"
            onClick={() => handleUpdateLayoutStyle('horizontal')}
            className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
              currentLayoutStyle === 'horizontal'
                ? 'bg-purple-950/60 border-purple-500 text-white shadow-lg shadow-purple-900/40 ring-2 ring-purple-500'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between font-extrabold text-sm mb-1">
                <span>OPTION B — Horizontal</span>
                {currentLayoutStyle === 'horizontal' && <span className="bg-purple-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black">ACTIVE</span>}
              </div>
              <p className="text-xs text-slate-400">
                Categories appear in a horizontal scrollable row with swipe/scroll support.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Categories Grid (Left Picture - Right Details & Controls Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat, index) => (
          <div key={cat.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center sm:items-stretch gap-4 font-sans">
            
            {/* Left: Large Category Picture */}
            <div className="w-full sm:w-32 h-28 sm:h-auto rounded-xl bg-slate-950 border border-slate-800 overflow-hidden relative shrink-0 flex items-center justify-center">
              {cat.image_url ? (
                <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-slate-400 font-bold text-xs flex flex-col items-center gap-1">
                  <span className="text-base">{cat.icon || '✨'}</span>
                  <span>No Picture</span>
                </div>
              )}
              <span className="absolute top-2 left-2 text-[9px] font-black uppercase px-2 py-0.5 bg-black/80 text-purple-300 rounded">
                #{index + 1}
              </span>
            </div>

            {/* Right: Heading, Sub-heading, Show/Hide, Edit, Delete */}
            <div className="flex-1 flex flex-col justify-between space-y-3 w-full">
              <div>
                <h3 className="font-extrabold text-white text-base sm:text-lg">{cat.name}</h3>
                <p className="text-slate-400 text-xs mt-0.5 font-medium">{cat.group_name || 'Mobile / Gadgets'}</p>
              </div>

              {/* Controls Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleMoveCategory(index, 'UP')}
                    disabled={index === 0}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMoveCategory(index, 'DOWN')}
                    disabled={index === categories.length - 1}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleToggleStatus(cat)}
                    className={`px-3 py-1.5 rounded-lg border text-[11px] font-extrabold flex items-center gap-1 transition-all ${
                      cat.is_active !== false
                        ? 'bg-emerald-950 border-emerald-700 text-emerald-300'
                        : 'bg-red-950 border-red-800 text-red-300'
                    }`}
                    title="Toggle Show/Hide"
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{cat.is_active !== false ? 'SHOW' : 'HIDE'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingCategory(cat)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-purple-400" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                    className="px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 font-bold text-xs flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>

            </div>

          </div>
        ))}
      </div>

      {/* CATEGORY EDIT MODAL */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">
                {editingCategory.id ? 'Edit Category' : 'Add Category'}
              </h3>
              <button onClick={() => setEditingCategory(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingCategory.name || ''}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category Group</label>
                <input
                  type="text"
                  name="group_name"
                  defaultValue={editingCategory.group_name || 'Mobile / Gadgets'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Icon Name (Lucide Icon)</label>
                <input
                  type="text"
                  name="icon"
                  defaultValue={editingCategory.icon || 'Sparkles'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="image_url"
                    id="cat_image_input"
                    defaultValue={editingCategory.image_url || ''}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                  />
                  <label className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5" /> Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUploadInput(e, 'cat_image_input')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#008744] text-white text-xs font-bold"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
