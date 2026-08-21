import React, { useState } from 'react';
import { 
  Layers, Plus, Edit3, Trash2, Power, Upload, Check, ArrowUp, ArrowDown, Grid, Sparkles, Link 
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { uploadToCloudinary } from '../../services/cloudinary';

export default function CategoriesManager({ adminEmail }) {
  const { 
    mainCategories, setMainCategories,
    subCategories, setSubCategories,
    categories, setCategories,
    siteSettings, setSiteSettings,
    saveSiteConfigKey,
    saveCmsItem, deleteCmsItem, updateDisplayOrder, logActivity, refreshAllData 
  } = useCMS();

  const [activeTab, setActiveTab] = useState('main'); // 'main' | 'sub'
  const [editingMainCat, setEditingMainCat] = useState(null);
  const [editingSubCat, setEditingSubCat] = useState(null);
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
      showToast(`Category Display Style saved: ${newStyle.toUpperCase()}`);
    } catch (err) {
      alert('Error updating category layout style: ' + err.message);
    }
  };

  // --- 01: MAIN CATEGORIES (TOP 6 CARDS) HANDLERS ---
  const handleToggleMainStatus = async (item, index) => {
    const updated = [...(mainCategories || [])];
    updated[index] = { ...item, is_active: item.is_active === false ? true : false };
    setMainCategories(updated);
    await saveSiteConfigKey('main_categories', updated);
    await logActivity(adminEmail, updated[index].is_active ? 'ENABLED' : 'DISABLED', 'Main Category', item.name);
    showToast(updated[index].is_active ? 'Main Category Enabled' : 'Main Category Disabled');
  };

  const handleMoveMainCat = async (index, direction) => {
    const list = [...(mainCategories || [])];
    const targetIdx = direction === 'UP' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    setMainCategories(list);
    await saveSiteConfigKey('main_categories', list);
    await logActivity(adminEmail, 'REORDERED', 'Main Categories');
    showToast('Main Category Order Updated.');
  };

  const handleDeleteMainCat = async (index, name) => {
    if (!window.confirm(`Are you sure you want to delete main category card "${name}"?`)) return;
    const list = (mainCategories || []).filter((_, i) => i !== index);
    setMainCategories(list);
    await saveSiteConfigKey('main_categories', list);
    await logActivity(adminEmail, 'DELETED', 'Main Category', name);
    showToast('Main Category Deleted.');
  };

  const handleSaveMainCatForm = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData(e.target);
      const name = formData.get('name');
      const list = [...(mainCategories || [])];

      const itemPayload = {
        id: editingMainCat?.id || `mc_${Date.now()}`,
        name: name,
        icon: formData.get('icon') || 'Sparkles',
        image_url: formData.get('image_url') || '',
        link_url: formData.get('link_url') || 'view-all',
        is_active: editingMainCat ? (editingMainCat.is_active !== false) : true,
        display_order: editingMainCat?.display_order || list.length + 1
      };

      if (editingMainCat?.index !== undefined && editingMainCat.index >= 0) {
        list[editingMainCat.index] = itemPayload;
      } else {
        list.push(itemPayload);
      }

      setMainCategories(list);
      await saveSiteConfigKey('main_categories', list);
      await logActivity(adminEmail, editingMainCat?.id ? 'EDITED' : 'ADDED', 'Main Category', itemPayload.name);
      setEditingMainCat(null);
      showToast('Main Category Saved Successfully.');
    } catch (err) {
      alert('Error saving main category: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // --- 02: SUB-CATEGORIES (SHOP BY CATEGORY) HANDLERS ---
  const handleToggleSubStatus = async (item, index) => {
    const updated = [...(subCategories || [])];
    updated[index] = { ...item, is_active: item.is_active === false ? true : false };
    setSubCategories(updated);
    await saveSiteConfigKey('sub_categories', updated);
    await logActivity(adminEmail, updated[index].is_active ? 'ENABLED' : 'DISABLED', 'Sub-Category', item.name);
    showToast(updated[index].is_active ? 'Sub-Category Enabled' : 'Sub-Category Disabled');
  };

  const handleMoveSubCat = async (index, direction) => {
    const list = [...(subCategories || [])];
    const targetIdx = direction === 'UP' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    setSubCategories(list);
    await saveSiteConfigKey('sub_categories', list);
    await logActivity(adminEmail, 'REORDERED', 'Sub-Categories');
    showToast('Sub-Category Order Updated.');
  };

  const handleDeleteSubCat = async (index, name) => {
    if (!window.confirm(`Are you sure you want to delete sub-category "${name}"?`)) return;
    const list = (subCategories || []).filter((_, i) => i !== index);
    setSubCategories(list);
    await saveSiteConfigKey('sub_categories', list);
    await logActivity(adminEmail, 'DELETED', 'Sub-Category', name);
    showToast('Sub-Category Deleted.');
  };

  const handleSaveSubCatForm = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData(e.target);
      const name = formData.get('name');
      const list = [...(subCategories || [])];

      const itemPayload = {
        id: editingSubCat?.id || `sc_${Date.now()}`,
        name: name,
        icon: formData.get('icon') || 'Smartphone',
        image: formData.get('image') || formData.get('image_url') || '',
        group_name: formData.get('group_name') || 'Mobile / Gadgets',
        is_active: editingSubCat ? (editingSubCat.is_active !== false) : true,
        display_order: editingSubCat?.display_order || list.length + 1
      };

      if (editingSubCat?.index !== undefined && editingSubCat.index >= 0) {
        list[editingSubCat.index] = itemPayload;
      } else {
        list.push(itemPayload);
      }

      setSubCategories(list);
      await saveSiteConfigKey('sub_categories', list);

      // Also sync with Supabase categories table
      await saveCmsItem('categories', {
        name: itemPayload.name,
        slug: itemPayload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        icon: itemPayload.icon,
        image_url: itemPayload.image,
        group_name: itemPayload.group_name,
        is_active: itemPayload.is_active,
        display_order: itemPayload.display_order
      });

      await logActivity(adminEmail, editingSubCat?.id ? 'EDITED' : 'ADDED', 'Sub-Category', itemPayload.name);
      setEditingSubCat(null);
      showToast('Sub-Category Saved Successfully.');
    } catch (err) {
      alert('Error saving sub-category: ' + err.message);
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
      showToast('Category Image Uploaded Successfully!');
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

      {/* Header with 2 Distinct Banner Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-purple-600" /> Categories Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Separated Category Controls: Manage Main Top Cards and Sub-Category Carousels independently.
          </p>
        </div>

        {/* 2 Category Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('main')}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${
              activeTab === 'main'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Grid className="w-4 h-4" /> 01: Main Categories (Top 6)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sub')}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${
              activeTab === 'sub'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" /> 02: Sub-Categories (Shop By)
          </button>
        </div>
      </div>

      {/* TAB 1: 01 - MAIN CATEGORY CARDS (TOP 6 ITEMS) */}
      {activeTab === 'main' && (
        <div className="space-y-4">
          <div className="bg-purple-50/50 border border-purple-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-black text-purple-950 uppercase tracking-wider flex items-center gap-2">
                <span>01 — Main Category Banner (Top 6 Items Grid)</span>
              </h2>
              <p className="text-xs text-purple-800 mt-0.5">
                These are the primary cards displayed below the hero carousel. Switch ON/OFF or customize title, icon, and link.
              </p>
            </div>
            <button
              onClick={() => setEditingMainCat({ icon: 'Sparkles', is_active: true, link_url: 'view-all' })}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm shrink-0"
            >
              <Plus className="w-4 h-4" /> Add Main Card
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(mainCategories || []).map((cat, idx) => (
              <div 
                key={cat.id || idx}
                className={`bg-white rounded-2xl p-4 border transition-all shadow-sm flex flex-col justify-between ${
                  cat.is_active !== false ? 'border-slate-200' : 'border-red-200 opacity-60 bg-red-50/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                    {cat.image_url ? (
                      <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-base font-bold text-purple-600">{cat.icon || '✨'}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                        Card #{idx + 1}
                      </span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        cat.is_active !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {cat.is_active !== false ? 'ACTIVE' : 'HIDDEN'}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-base mt-1 truncate">{cat.name}</h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5 truncate flex items-center gap-1">
                      <Link className="w-3 h-3 text-slate-400" /> {cat.link_url || 'view-all'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMoveMainCat(idx, 'UP')}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700"
                      title="Move Left/Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveMainCat(idx, 'DOWN')}
                      disabled={idx === (mainCategories || []).length - 1}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700"
                      title="Move Right/Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleMainStatus(cat, idx)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold flex items-center gap-1 transition-all ${
                        cat.is_active !== false
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{cat.is_active !== false ? 'ON' : 'OFF'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditingMainCat({ ...cat, index: idx })}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-purple-600" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteMainCat(idx, cat.name)}
                      className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                      title="Delete Card"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: 02 - SUB-CATEGORIES (SHOP BY CATEGORY CAROUSEL) */}
      {activeTab === 'sub' && (
        <div className="space-y-4">
          <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-black text-emerald-950 uppercase tracking-wider flex items-center gap-2">
                <span>02 — Sub-Category Banner (Shop By Category Carousel)</span>
              </h2>
              <p className="text-xs text-emerald-800 mt-0.5">
                These are the horizontal subcategory pill cards (Smartphones, Smartwatches, Earbuds, etc.). Switch ON/OFF or add custom items.
              </p>
            </div>
            <button
              onClick={() => setEditingSubCat({ icon: 'Smartphone', is_active: true, group_name: 'Mobile / Gadgets' })}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm shrink-0"
            >
              <Plus className="w-4 h-4" /> Add Sub-Category
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(subCategories || []).map((cat, idx) => (
              <div 
                key={cat.id || idx}
                className={`bg-white rounded-2xl p-4 border transition-all shadow-sm flex flex-col justify-between ${
                  cat.is_active !== false ? 'border-slate-200' : 'border-red-200 opacity-60 bg-red-50/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden p-1">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-base font-bold text-emerald-600">{cat.icon || '📱'}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        #{idx + 1}
                      </span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        cat.is_active !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {cat.is_active !== false ? 'ACTIVE' : 'HIDDEN'}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-base mt-1 truncate">{cat.name}</h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">{cat.group_name || 'Mobile / Gadgets'}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMoveSubCat(idx, 'UP')}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700"
                      title="Move Left/Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveSubCat(idx, 'DOWN')}
                      disabled={idx === (subCategories || []).length - 1}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700"
                      title="Move Right/Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleSubStatus(cat, idx)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold flex items-center gap-1 transition-all ${
                        cat.is_active !== false
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{cat.is_active !== false ? 'ON' : 'OFF'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditingSubCat({ ...cat, index: idx })}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-emerald-600" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSubCat(idx, cat.name)}
                      className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                      title="Delete Sub-Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EDIT MODAL: MAIN CATEGORY */}
      {editingMainCat && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">
                {editingMainCat.id ? 'Edit Main Category Card' : 'Add Main Category Card'}
              </h3>
              <button onClick={() => setEditingMainCat(null)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveMainCatForm} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Card Title *</label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingMainCat.name || ''}
                  placeholder="e.g. OTT Platforms, All Products"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Link URL Box *</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    name="link_url"
                    required
                    defaultValue={editingMainCat.link_url || 'view-all'}
                    placeholder="e.g. view-all, offers, ott-plans, fiber, mobiles"
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 text-xs font-bold"
                  />
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        const input = e.target.form?.elements['link_url'];
                        if (input) input.value = e.target.value;
                      }
                    }}
                    className="w-28 bg-slate-100 border border-slate-300 rounded-xl p-2 text-xs font-bold text-slate-700"
                  >
                    <option value="">Presets ▾</option>
                    <option value="view-all">All Products</option>
                    <option value="offers">Offers</option>
                    <option value="ott-plans">OTT Plans</option>
                    <option value="fiber">Fiber Internet</option>
                    <option value="mobiles">Mobiles</option>
                    <option value="electronics">Electronics</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Icon Symbol</label>
                <select
                  name="icon"
                  defaultValue={editingMainCat.icon || 'Sparkles'}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 text-xs font-bold"
                >
                  <option value="Sparkles">Sparkles ✨</option>
                  <option value="Tv">TV / OTT 📺</option>
                  <option value="Globe">Globe / Internet 🌐</option>
                  <option value="Smartphone">Smartphone 📱</option>
                  <option value="Laptop">Laptop / Electronics 💻</option>
                  <option value="Headphones">Headphones 🎧</option>
                  <option value="Flame">Flame 🔥</option>
                  <option value="Zap">Zap ⚡</option>
                  <option value="Shield">Shield 🛡️</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Custom Uploaded Image URL (Optional)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="image_url"
                    id="main_cat_image_input"
                    defaultValue={editingMainCat.image_url || ''}
                    placeholder="https://..."
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 text-xs"
                  />
                  <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5" /> Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUploadInput(e, 'main_cat_image_input')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingMainCat(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black shadow-md"
                >
                  {saving ? 'Saving...' : 'Save Main Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL: SUB-CATEGORY */}
      {editingSubCat && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">
                {editingSubCat.id ? 'Edit Sub-Category' : 'Add Sub-Category'}
              </h3>
              <button onClick={() => setEditingSubCat(null)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveSubCatForm} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sub-Category Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingSubCat.name || ''}
                  placeholder="e.g. Smartphones, Smartwatches"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category Group</label>
                <input
                  type="text"
                  name="group_name"
                  defaultValue={editingSubCat.group_name || 'Mobile / Gadgets'}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Icon Symbol</label>
                <select
                  name="icon"
                  defaultValue={editingSubCat.icon || 'Smartphone'}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 text-xs font-bold"
                >
                  <option value="Smartphone">Smartphone 📱</option>
                  <option value="Watch">Watch ⌚</option>
                  <option value="Radio">Radio / Audio 📻</option>
                  <option value="Speaker">Speaker 🔊</option>
                  <option value="Headphones">Headphones 🎧</option>
                  <option value="BatteryCharging">Power Bank 🔋</option>
                  <option value="Zap">Charger ⚡</option>
                  <option value="Tv">Smart TV 📺</option>
                  <option value="Laptop">Laptop 💻</option>
                  <option value="Sparkles">Sparkles ✨</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="image"
                    id="sub_cat_image_input"
                    defaultValue={editingSubCat.image || ''}
                    placeholder="https://..."
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 text-xs"
                  />
                  <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5" /> Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUploadInput(e, 'sub_cat_image_input')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingSubCat(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md"
                >
                  {saving ? 'Saving...' : 'Save Sub-Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
