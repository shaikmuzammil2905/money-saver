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

      const buttonsList = Array.isArray(editingBanner?.buttons) && editingBanner.buttons.length > 0
        ? editingBanner.buttons
        : [
            {
              id: 'btn_1',
              text: formData.get('button_text') || 'Explore Deals',
              link: formData.get('button_link') || 'offers',
              is_active: true,
              bg_color: formData.get('button_color') || '#e50914',
              text_color: '#ffffff',
              position_x: 0,
              position_y: 0
            }
          ];

      const payload = {
        id: editingBanner?.id,
        banner_key: editingBanner?.banner_key || `banner_${Date.now()}`,
        title_name: formData.get('title_name') || editingBanner?.title_name || 'Custom Banner',
        heading: formData.get('heading'),
        subheading: formData.get('subheading'),
        description: formData.get('description'),
        button_text: formData.get('button_text'),
        button_link: formData.get('button_link'),
        buttons: buttonsList,
        badges: editingBanner?.badges || (formData.get('subheading') ? [formData.get('subheading')] : []),
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
      await refreshAllData();
      setEditingBanner(null);
      showToast('Banner Saved Successfully to Supabase.');
    } catch (err) {
      alert('Error saving banner: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateButtonPosition = (btnIdx, deltaX, deltaY) => {
    if (!editingBanner) return;
    const currentButtons = Array.isArray(editingBanner.buttons) && editingBanner.buttons.length > 0
      ? [...editingBanner.buttons]
      : [
          {
            id: 'btn_1',
            text: editingBanner.button_text || 'Explore Deals',
            link: editingBanner.button_link || 'offers',
            is_active: true,
            bg_color: editingBanner.button_color || '#e50914',
            text_color: '#ffffff',
            position_x: 0,
            position_y: 0
          }
        ];

    const targetBtn = { ...currentButtons[btnIdx] };
    targetBtn.position_x = (targetBtn.position_x || 0) + deltaX;
    targetBtn.position_y = (targetBtn.position_y || 0) + deltaY;
    currentButtons[btnIdx] = targetBtn;

    setEditingBanner({
      ...editingBanner,
      buttons: currentButtons
    });
  };

  const handleToggleBadge = (badgeText) => {
    if (!editingBanner) return;
    const currentBadges = Array.isArray(editingBanner.badges) ? [...editingBanner.badges] : [];
    const exists = currentBadges.some(b => (typeof b === 'string' ? b : b.text) === badgeText);
    
    let updated;
    if (exists) {
      updated = currentBadges.filter(b => (typeof b === 'string' ? b : b.text) !== badgeText);
    } else {
      updated = [...currentBadges, badgeText];
    }
    setEditingBanner({ ...editingBanner, badges: updated });
  };

  const handleAddButton = () => {
    if (!editingBanner) return;
    const currentButtons = Array.isArray(editingBanner.buttons) ? [...editingBanner.buttons] : [];
    currentButtons.push({
      id: `btn_${Date.now()}`,
      text: 'New Action Button',
      link: '/offers',
      is_active: true,
      bg_color: '#008744',
      text_color: '#ffffff',
      position_x: 0,
      position_y: 0
    });
    setEditingBanner({ ...editingBanner, buttons: currentButtons });
  };

  const handleRemoveButton = (btnIdx) => {
    if (!editingBanner || !editingBanner.buttons) return;
    const updated = editingBanner.buttons.filter((_, idx) => idx !== btnIdx);
    setEditingBanner({ ...editingBanner, buttons: updated });
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
            Manage all 7 Home Banners with independent Subheadings, Badges, and Button Position Movement (Left, Right, Up, Down).
          </p>
        </div>
        <button
          onClick={() => setEditingBanner({
            banner_key: `custom_${Date.now()}`,
            title_name: 'Custom Promotional Banner',
            heading: 'NEW PROMO BANNER',
            subheading: 'LIMITED OFFER',
            badges: ['NEW', 'LIMITED OFFER'],
            buttons: [
              { id: 'btn_1', text: 'Shop Now', link: '/all-otts', is_active: true, position_x: 0, position_y: 0 }
            ],
            button_text: 'Shop Now',
            button_link: '/all-otts',
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
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-700 border border-purple-200">
                  {b.banner_key}
                </span>
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">{b.title_name}</h3>
              </div>
              <button
                onClick={() => handleToggleStatus(b)}
                className={`px-3 py-1 rounded-xl text-xs font-black border transition-all ${
                  b.is_active !== false ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
                }`}
              >
                {b.is_active !== false ? 'ACTIVE' : 'OFF'}
              </button>
            </div>

            {/* Card Body: Image Preview & Text Info */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-4 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 h-28 relative flex items-center justify-center">
                {b.image_url ? (
                  <img src={b.image_url} alt={b.title_name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-slate-500 text-xs font-bold">No Image Configured</span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2">
                  <span className="text-[10px] font-black text-amber-300">{b.subheading || 'Standard Banner'}</span>
                </div>
              </div>

              {/* Text Matter */}
              <div className="md:col-span-8 space-y-2 text-xs">
                <h4 className="font-black text-slate-900 text-sm sm:text-base leading-tight">{b.heading}</h4>
                <p className="text-slate-600 line-clamp-2 leading-relaxed">{b.description}</p>
                <div className="flex items-center gap-4 text-[11px] pt-1 flex-wrap">
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <Link className="w-3 h-3" /> Link: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">{b.button_link || 'N/A'}</code>
                  </span>
                  <span className="text-amber-700 font-bold">
                    Btn: {b.button_text || 'Shop Now'}
                  </span>
                  {Array.isArray(b.buttons) && (
                    <span className="text-purple-700 font-bold">
                      {b.buttons.length} Custom Position Buttons
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setEditingBanner(b)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors border border-slate-200"
              >
                <Edit3 className="w-3.5 h-3.5 text-purple-600" /> Edit Banner &amp; Buttons
              </button>
              <button
                onClick={() => handleDeleteBanner(b.id, b.title_name)}
                className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* BANNER EDIT / ADD MODAL */}
      {editingBanner && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto pt-16 sm:pt-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl space-y-4 font-sans my-4 max-h-[85vh] overflow-y-auto text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base">
                Edit {editingBanner.title_name || 'Banner'}
              </h3>
              <button onClick={() => setEditingBanner(null)} className="text-slate-400 hover:text-slate-700 font-bold text-lg">✕</button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Banner Title Name (Internal)</label>
                <input
                  type="text"
                  name="title_name"
                  required
                  defaultValue={editingBanner.title_name || ''}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Heading *</label>
                  <input
                    type="text"
                    name="heading"
                    required
                    defaultValue={editingBanner.heading || ''}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 text-xs"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">Subheading</label>
                    <button
                      type="button"
                      onClick={() => setEditingBanner({ ...editingBanner, subheading: '' })}
                      className="text-[10px] text-red-600 hover:underline font-bold"
                    >
                      Clear Subheading
                    </button>
                  </div>
                  <input
                    type="text"
                    name="subheading"
                    value={editingBanner.subheading || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, subheading: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 text-xs"
                    placeholder="Enter subheading..."
                  />
                </div>
              </div>

              {/* BADGES PICKER */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-800">Banner Optional Badges</label>
                <div className="flex flex-wrap items-center gap-2">
                  {['NEW', 'BEST SELLER', '50% OFF', 'LIMITED OFFER', 'TRENDING'].map(bdg => {
                    const isSelected = Array.isArray(editingBanner.badges) && editingBanner.badges.some(b => (typeof b === 'string' ? b : b.text) === bdg);
                    return (
                      <button
                        type="button"
                        key={bdg}
                        onClick={() => handleToggleBadge(bdg)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          isSelected 
                            ? 'bg-[#e50914] text-white shadow-sm' 
                            : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}{bdg}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  name="description"
                  rows="2"
                  defaultValue={editingBanner.description || ''}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 text-xs"
                ></textarea>
              </div>

              {/* DYNAMIC INDIVIDUAL BUTTON CONTROLS WITH INDEPENDENT X/Y MOVEMENT */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-600" /> Dynamic Buttons &amp; Independent X/Y Movement Controls
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddButton}
                    className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Button
                  </button>
                </div>

                {Array.isArray(editingBanner.buttons) && editingBanner.buttons.map((btn, btnIdx) => (
                  <div key={btn.id || btnIdx} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-purple-700">Button #{btnIdx + 1}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-500">
                          Pos X: <code className="text-purple-700">{btn.position_x || 0}px</code> | Pos Y: <code className="text-purple-700">{btn.position_y || 0}px</code>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveButton(btnIdx)}
                          className="text-xs text-red-600 hover:underline font-bold"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Button Text"
                        value={btn.text || ''}
                        onChange={(e) => {
                          const updated = [...editingBanner.buttons];
                          updated[btnIdx] = { ...updated[btnIdx], text: e.target.value };
                          setEditingBanner({ ...editingBanner, buttons: updated });
                        }}
                        className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-900"
                      />

                      <select
                        value={btn.link || '/offers'}
                        onChange={(e) => {
                          const updated = [...editingBanner.buttons];
                          updated[btnIdx] = { ...updated[btnIdx], link: e.target.value };
                          setEditingBanner({ ...editingBanner, buttons: updated });
                        }}
                        className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-900"
                      >
                        <option value="/offers">Offers Page (/offers)</option>
                        <option value="/ott-plans">OTT Plans Page (/ott-plans)</option>
                        <option value="/fiber-internet">Fiber Broadband Page (/fiber-internet)</option>
                        <option value="/mobiles">Mobiles &amp; Gadgets (/mobiles)</option>
                        <option value="/electronics">Electronics Page (/electronics)</option>
                        <option value="/contact">Contact Support Page (/contact)</option>
                        <option value="/view-all">All Products Explorer (/view-all)</option>
                      </select>
                    </div>

                    {/* INDEPENDENT MOVEMENT CONTROLS: LEFT, RIGHT, UP, DOWN */}
                    <div className="flex items-center justify-between bg-slate-100 p-2 rounded-lg flex-wrap gap-2">
                      <span className="text-[11px] font-bold text-slate-700">Independent Movement:</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleUpdateButtonPosition(btnIdx, -10, 0)}
                          className="px-2.5 py-1 rounded bg-white hover:bg-slate-200 text-slate-800 font-extrabold text-[11px] border border-slate-300 shadow-sm"
                        >
                          ← LEFT
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateButtonPosition(btnIdx, 10, 0)}
                          className="px-2.5 py-1 rounded bg-white hover:bg-slate-200 text-slate-800 font-extrabold text-[11px] border border-slate-300 shadow-sm"
                        >
                          RIGHT →
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateButtonPosition(btnIdx, 0, -10)}
                          className="px-2.5 py-1 rounded bg-white hover:bg-slate-200 text-slate-800 font-extrabold text-[11px] border border-slate-300 shadow-sm"
                        >
                          ↑ UP
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateButtonPosition(btnIdx, 0, 10)}
                          className="px-2.5 py-1 rounded bg-white hover:bg-slate-200 text-slate-800 font-extrabold text-[11px] border border-slate-300 shadow-sm"
                        >
                          ↓ DOWN
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateButtonPosition(btnIdx, -(btn.position_x || 0), -(btn.position_y || 0))}
                          className="px-2 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700 font-bold text-[10px] border border-red-300 ml-1"
                        >
                          RESET
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Banner Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="image_url"
                    id="banner_img_input"
                    defaultValue={editingBanner.image_url || ''}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 text-xs font-mono"
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

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingBanner(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#008744] hover:bg-emerald-600 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Save Banner &amp; Positions
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
