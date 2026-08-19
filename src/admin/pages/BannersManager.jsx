import React, { useState } from 'react';
import { 
  Image as ImageIcon, Plus, Edit3, Trash2, Power, Upload, Check, Eye, Link, Palette, Sparkles, Layers, ArrowUp, ArrowDown 
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { uploadToCloudinary } from '../../services/cloudinary';

export default function BannersManager({ adminEmail }) {
  const { 
    banners, setBanners, 
    saveCmsItem, deleteCmsItem, updateDisplayOrder, logActivity, refreshAllData 
  } = useCMS();

  const [editingBanner, setEditingBanner] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleToggleStatus = async (banner) => {
    try {
      const updated = { ...banner, is_active: !banner.is_active };
      await saveCmsItem('banners', updated);
      await logActivity(adminEmail, updated.is_active ? 'ENABLED' : 'DISABLED', 'Banners', banner.title_name);
      refreshAllData();
      showToast(updated.is_active ? 'Banner Enabled' : 'Banner Disabled');
    } catch (err) {
      alert('Error toggling banner status: ' + err.message);
    }
  };

  const handleDeleteBanner = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete banner "${name}"?`)) return;
    try {
      await deleteCmsItem('banners', id);
      await logActivity(adminEmail, 'DELETED', 'Banners', name);
      refreshAllData();
      showToast('Banner Deleted Successfully.');
    } catch (err) {
      alert('Error deleting banner: ' + err.message);
    }
  };

  const handleSaveBanner = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData(e.target);
      const payload = {
        id: editingBanner?.id,
        banner_key: editingBanner?.banner_key || `banner_${Date.now()}`,
        title_name: formData.get('title_name') || editingBanner?.title_name || 'Custom Banner',
        heading: formData.get('heading'),
        subheading: formData.get('subheading'),
        description: formData.get('description'),
        button_text: formData.get('button_text'),
        button_link: formData.get('button_link'),
        image_url: formData.get('image_url'),
        mobile_image_url: formData.get('mobile_image_url') || formData.get('image_url'),
        text_color: formData.get('text_color') || '#ffffff',
        button_color: formData.get('button_color') || '#e50914',
        bg_color: formData.get('bg_color') || '#050b1e',
        overlay_color: formData.get('overlay_color') || 'rgba(0,0,0,0.3)',
        is_active: editingBanner ? editingBanner.is_active : true,
        display_order: editingBanner ? editingBanner.display_order : banners.length + 1
      };

      await saveCmsItem('banners', payload);
      await logActivity(adminEmail, editingBanner?.id ? 'EDITED' : 'ADDED', 'Banners', payload.title_name);
      refreshAllData();
      setEditingBanner(null);
      showToast('Banner Saved Successfully.');
    } catch (err) {
      alert('Error saving banner: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUploadInput = async (e, inputId) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadToCloudinary(file, 'banners');
      const inputEl = document.getElementById(inputId);
      if (inputEl) inputEl.value = res.url;
      showToast('Banner Image Uploaded to Cloudinary!');
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
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-[#e50914]" /> Banner Manager (Home &amp; Offers)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage all 7 Home Banners (including Home Main Banner 02 / 2nd Slide) and Offers Top Banner.
          </p>
        </div>
        <button
          onClick={() => setEditingBanner({
            banner_key: `custom_${Date.now()}`,
            title_name: 'Custom Promotional Banner',
            heading: 'NEW PROMO BANNER',
            button_text: 'Shop Now',
            button_link: 'all-otts',
            text_color: '#ffffff',
            button_color: '#e50914',
            bg_color: '#050b1e'
          })}
          className="px-4 py-2.5 rounded-xl bg-[#008744] hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Banner
        </button>
      </div>

      {/* Mobile-First Banners List (Vertical Cards) */}
      <div className="space-y-4">
        {banners.map((b) => (
          <div key={b.id || b.banner_key} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4 font-sans">

            
            {/* Card Top: Banner Identity & Active Switch */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-md bg-purple-950 border border-purple-800 text-purple-300">
                  {b.banner_key}
                </span>
                <h3 className="font-extrabold text-white text-sm sm:text-base">{b.title_name}</h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleStatus(b)}
                  className={`px-3 py-1 rounded-xl text-xs font-black border transition-all flex items-center gap-1 ${
                    b.is_active !== false
                      ? 'bg-emerald-950 border-emerald-700 text-emerald-300'
                      : 'bg-red-950 border-red-800 text-red-300'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{b.is_active !== false ? 'ACTIVE' : 'OFF'}</span>
                </button>
              </div>
            </div>

            {/* Banner Preview & Content Details */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Image Preview */}
              <div className="md:col-span-4 h-32 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden relative flex items-center justify-center">
                {b.image_url ? (
                  <img src={b.image_url} alt={b.heading} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-slate-500 font-bold">No Image Uploaded</span>
                )}
                <span className="absolute bottom-2 left-2 text-[9px] font-black bg-black/80 text-amber-300 px-2 py-0.5 rounded">
                  {b.subheading || 'BANNER'}
                </span>
              </div>

              {/* Text Matter */}
              <div className="md:col-span-8 space-y-2 text-xs">
                <h4 className="font-black text-white text-sm sm:text-base leading-tight">{b.heading}</h4>
                <p className="text-slate-300 line-clamp-2 leading-relaxed">{b.description}</p>
                <div className="flex items-center gap-4 text-[11px] pt-1">
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Link className="w-3 h-3" /> Link: <code className="bg-slate-950 px-1.5 py-0.5 rounded text-white">{b.button_link || 'N/A'}</code>
                  </span>
                  <span className="text-amber-400 font-bold">
                    Btn: {b.button_text || 'Shop Now'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setEditingBanner(b)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-purple-400" /> Edit Banner
              </button>
              <button
                onClick={() => handleDeleteBanner(b.id, b.title_name)}
                className="px-3 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 font-bold text-xs flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* BANNER EDIT / ADD MODAL */}
      {editingBanner && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto pt-16 sm:pt-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl space-y-4 font-sans my-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-black text-white text-base">
                Edit {editingBanner.title_name || 'Banner'}
              </h3>
              <button onClick={() => setEditingBanner(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Banner Title Name (Internal)</label>
                <input
                  type="text"
                  name="title_name"
                  required
                  defaultValue={editingBanner.title_name || ''}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Heading *</label>
                  <input
                    type="text"
                    name="heading"
                    required
                    defaultValue={editingBanner.heading || ''}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Subheading / Badge</label>
                  <input
                    type="text"
                    name="subheading"
                    defaultValue={editingBanner.subheading || ''}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  name="description"
                  rows="2"
                  defaultValue={editingBanner.description || ''}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Button Text</label>
                  <input
                    type="text"
                    name="button_text"
                    defaultValue={editingBanner.button_text || 'Shop Now'}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Button Link (URL / Section)</label>
                  <input
                    type="text"
                    name="button_link"
                    defaultValue={editingBanner.button_link || 'offers'}
                    placeholder="offers, ott-plans, fiber..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Banner Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="image_url"
                    id="banner_img_input"
                    defaultValue={editingBanner.image_url || ''}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs font-mono"
                  />
                  <label className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5" /> Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUploadInput(e, 'banner_img_input')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-300 mb-1">Text Color</label>
                  <input
                    type="color"
                    name="text_color"
                    defaultValue={editingBanner.text_color || '#ffffff'}
                    className="w-full h-9 bg-slate-950 border border-slate-700 rounded-xl p-1 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-300 mb-1">Button Color</label>
                  <input
                    type="color"
                    name="button_color"
                    defaultValue={editingBanner.button_color || '#e50914'}
                    className="w-full h-9 bg-slate-950 border border-slate-700 rounded-xl p-1 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-300 mb-1">Bg Color</label>
                  <input
                    type="color"
                    name="bg_color"
                    defaultValue={editingBanner.bg_color || '#050b1e'}
                    className="w-full h-9 bg-slate-950 border border-slate-700 rounded-xl p-1 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-300 mb-1">Overlay</label>
                  <input
                    type="text"
                    name="overlay_color"
                    defaultValue={editingBanner.overlay_color || 'rgba(0,0,0,0.3)'}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-[11px]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingBanner(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#008744] hover:bg-emerald-600 text-white text-xs font-bold shadow-lg"
                >
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
