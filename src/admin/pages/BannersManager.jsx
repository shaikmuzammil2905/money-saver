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

      const buttonsList = Array.isArray(editingBanner?.buttons) ? editingBanner.buttons : [];
      const subheadingsList = Array.isArray(editingBanner?.subheadings) ? editingBanner.subheadings : [];
      const badgesList = Array.isArray(editingBanner?.badges_data) ? editingBanner.badges_data : [];

      const payload = {
        id: editingBanner?.id,
        banner_key: editingBanner?.banner_key || `banner_${Date.now()}`,
        title_name: formData.get('title_name') || editingBanner?.title_name || 'Custom Banner',
        heading: formData.get('heading'),
        description: formData.get('description'),
        image_url: formData.get('image_url'),
        mobile_image_url: formData.get('mobile_image_url') || formData.get('image_url'),
        text_color: formData.get('text_color') || '#ffffff',
        bg_color: formData.get('bg_color') || '#050b1e',
        overlay_color: formData.get('overlay_color') || 'rgba(0,0,0,0.3)',
        is_active: editingBanner ? editingBanner.is_active : true,
        display_order: editingBanner ? editingBanner.display_order : banners.length + 1,
        buttons: buttonsList,
        subheadings: subheadingsList,
        badges_data: badgesList,
        // Legacy fallbacks to prevent breaking old apps
        subheading: subheadingsList.length > 0 ? subheadingsList[0].text : formData.get('subheading') || '',
        button_text: buttonsList.length > 0 ? buttonsList[0].text : 'Explore Deals',
        button_link: buttonsList.length > 0 ? buttonsList[0].link : 'offers',
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

  // GENERIC POSITION UPDATE HANDLER
  const updateElementPosition = (listName, idx, deltaX, deltaY) => {
    if (!editingBanner) return;
    const currentList = Array.isArray(editingBanner[listName]) ? [...editingBanner[listName]] : [];
    if (!currentList[idx]) return;

    const target = { ...currentList[idx] };
    target.position_x = (target.position_x || 0) + deltaX;
    target.position_y = (target.position_y || 0) + deltaY;
    currentList[idx] = target;

    setEditingBanner({ ...editingBanner, [listName]: currentList });
  };

  const updateElementField = (listName, idx, field, value) => {
    if (!editingBanner) return;
    const currentList = Array.isArray(editingBanner[listName]) ? [...editingBanner[listName]] : [];
    if (!currentList[idx]) return;
    
    currentList[idx] = { ...currentList[idx], [field]: value };
    setEditingBanner({ ...editingBanner, [listName]: currentList });
  };

  const removeElement = (listName, idx) => {
    if (!editingBanner) return;
    const currentList = Array.isArray(editingBanner[listName]) ? [...editingBanner[listName]] : [];
    setEditingBanner({ ...editingBanner, [listName]: currentList.filter((_, i) => i !== idx) });
  };

  const handleAddButton = () => {
    const current = Array.isArray(editingBanner.buttons) ? [...editingBanner.buttons] : [];
    current.push({
      id: `btn_${Date.now()}`,
      text: 'New Action Button',
      link: '/offers',
      is_external: false,
      target: '_self',
      is_active: true,
      position_x: 0,
      position_y: 0
    });
    setEditingBanner({ ...editingBanner, buttons: current });
  };

  const handleAddSubheading = () => {
    const current = Array.isArray(editingBanner.subheadings) ? [...editingBanner.subheadings] : [];
    current.push({
      id: `sub_${Date.now()}`,
      text: 'NEW SUBHEADING',
      is_active: true,
      position_x: 0,
      position_y: 0
    });
    setEditingBanner({ ...editingBanner, subheadings: current });
  };

  const handleAddBadge = () => {
    const current = Array.isArray(editingBanner.badges_data) ? [...editingBanner.badges_data] : [];
    current.push({
      id: `bdg_${Date.now()}`,
      text: 'NEW BADGE',
      is_active: true,
      position_x: 0,
      position_y: 0
    });
    setEditingBanner({ ...editingBanner, badges_data: current });
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

  // Initialize a safe editable banner state
  const startEditing = (b) => {
    const safeBanner = { ...b };
    if (!Array.isArray(safeBanner.buttons)) {
      safeBanner.buttons = b.button_text ? [{
        id: 'btn_1', text: b.button_text, link: b.button_link || '/offers', is_external: false, target: '_self', is_active: true, position_x: 0, position_y: 0
      }] : [];
    }
    if (!Array.isArray(safeBanner.subheadings)) {
      safeBanner.subheadings = b.subheading ? [{
        id: 'sub_1', text: b.subheading, is_active: true, position_x: 0, position_y: 0
      }] : [];
    }
    if (!Array.isArray(safeBanner.badges_data)) {
      safeBanner.badges_data = Array.isArray(b.badges) ? b.badges.map((bdg, i) => ({
        id: `bdg_${i}`, text: typeof bdg === 'string' ? bdg : bdg.text, is_active: true, position_x: 0, position_y: 0
      })) : [];
    }
    setEditingBanner(safeBanner);
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
            Manage all Banners with independent Subheadings, Badges, and Button Position Movement (Left, Right, Up, Down).
          </p>
        </div>
        <button
          onClick={() => startEditing({
            banner_key: `custom_${Date.now()}`,
            title_name: 'Custom Promotional Banner',
            heading: 'NEW PROMO BANNER',
            buttons: [], subheadings: [], badges_data: [],
            text_color: '#ffffff',
            bg_color: '#050b1e'
          })}
          className="px-4 py-2.5 rounded-xl bg-[#008744] hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Banner
        </button>
      </div>

      {/* Mobile-First Banners List */}
      <div className="space-y-4">
        {banners.map((b) => (
          <div key={b.id || b.banner_key} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4 font-sans">
            {/* Card Top */}
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

            {/* Actions Footer */}
            <div className="pt-3 flex items-center justify-end gap-2">
              <button
                onClick={() => startEditing(b)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors border border-slate-200"
              >
                <Edit3 className="w-3.5 h-3.5 text-purple-600" /> Edit Banner &amp; Elements
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
          <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl space-y-4 font-sans my-4 max-h-[85vh] overflow-y-auto text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h3 className="font-black text-slate-900 text-lg">
                Edit {editingBanner.title_name || 'Banner'}
              </h3>
              <button onClick={() => setEditingBanner(null)} type="button" className="text-slate-400 hover:text-slate-700 font-bold text-xl px-2">✕</button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Banner Title Name (Internal)</label>
                  <input
                    type="text"
                    name="title_name"
                    required
                    defaultValue={editingBanner.title_name || ''}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 text-xs font-bold shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Heading *</label>
                  <input
                    type="text"
                    name="heading"
                    required
                    defaultValue={editingBanner.heading || ''}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 text-xs shadow-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    rows="2"
                    defaultValue={editingBanner.description || ''}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 text-xs shadow-sm"
                  ></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Banner Image URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="image_url"
                      id="banner_img_input"
                      defaultValue={editingBanner.image_url || ''}
                      className="flex-1 bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 text-xs font-mono shadow-sm"
                    />
                    <label className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0 shadow-md">
                      <Upload className="w-3.5 h-3.5" /> Upload
                      <input type="file" accept="image/*" onChange={(e) => handleImageUploadInput(e, 'banner_img_input')} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              {/* DYNAMIC SUBHEADINGS */}
              <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-orange-900 tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4" /> Dynamic Subheadings
                  </h4>
                  <button type="button" onClick={handleAddSubheading} className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-[11px] shadow-sm flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add Subheading
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Array.isArray(editingBanner.subheadings) && editingBanner.subheadings.map((sub, idx) => (
                    <div key={sub.id || idx} className="bg-white p-3 rounded-xl border border-orange-200 shadow-sm space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-500">Pos: {sub.position_x || 0}px, {sub.position_y || 0}px</span>
                        <button type="button" onClick={() => removeElement('subheadings', idx)} className="text-[10px] text-red-600 font-bold hover:underline">Remove</button>
                      </div>
                      <div className="flex gap-2">
                        <input type="text" value={sub.text || ''} onChange={(e) => updateElementField('subheadings', idx, 'text', e.target.value)} className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold" placeholder="Subheading Text" />
                        <select value={sub.is_active !== false ? 'true' : 'false'} onChange={(e) => updateElementField('subheadings', idx, 'is_active', e.target.value === 'true')} className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold">
                          <option value="true">Show</option><option value="false">Hide</option>
                        </select>
                      </div>
                      <div className="flex gap-1 justify-center bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                        <button type="button" onClick={() => updateElementPosition('subheadings', idx, -10, 0)} className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold shadow-sm">← L</button>
                        <button type="button" onClick={() => updateElementPosition('subheadings', idx, 10, 0)} className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold shadow-sm">R →</button>
                        <button type="button" onClick={() => updateElementPosition('subheadings', idx, 0, -10)} className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold shadow-sm">↑ U</button>
                        <button type="button" onClick={() => updateElementPosition('subheadings', idx, 0, 10)} className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold shadow-sm">↓ D</button>
                        <button type="button" onClick={() => { updateElementField('subheadings', idx, 'position_x', 0); updateElementField('subheadings', idx, 'position_y', 0); }} className="px-2 py-1 bg-red-50 text-red-600 border border-red-200 rounded text-[10px] font-bold ml-2">Reset</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* DYNAMIC BADGES */}
              <div className="bg-sky-50/50 p-4 rounded-xl border border-sky-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-sky-900 tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Dynamic Badges
                  </h4>
                  <button type="button" onClick={handleAddBadge} className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-[11px] shadow-sm flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add Badge
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Array.isArray(editingBanner.badges_data) && editingBanner.badges_data.map((bdg, idx) => (
                    <div key={bdg.id || idx} className="bg-white p-3 rounded-xl border border-sky-200 shadow-sm space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-500">Pos: {bdg.position_x || 0}px, {bdg.position_y || 0}px</span>
                        <button type="button" onClick={() => removeElement('badges_data', idx)} className="text-[10px] text-red-600 font-bold hover:underline">Remove</button>
                      </div>
                      <div className="flex gap-2">
                        <input type="text" value={bdg.text || ''} onChange={(e) => updateElementField('badges_data', idx, 'text', e.target.value)} className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold" placeholder="Badge Text (e.g. 50% OFF)" />
                        <select value={bdg.is_active !== false ? 'true' : 'false'} onChange={(e) => updateElementField('badges_data', idx, 'is_active', e.target.value === 'true')} className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold">
                          <option value="true">Show</option><option value="false">Hide</option>
                        </select>
                      </div>
                      <div className="flex gap-1 justify-center bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                        <button type="button" onClick={() => updateElementPosition('badges_data', idx, -10, 0)} className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold shadow-sm">← L</button>
                        <button type="button" onClick={() => updateElementPosition('badges_data', idx, 10, 0)} className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold shadow-sm">R →</button>
                        <button type="button" onClick={() => updateElementPosition('badges_data', idx, 0, -10)} className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold shadow-sm">↑ U</button>
                        <button type="button" onClick={() => updateElementPosition('badges_data', idx, 0, 10)} className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold shadow-sm">↓ D</button>
                        <button type="button" onClick={() => { updateElementField('badges_data', idx, 'position_x', 0); updateElementField('badges_data', idx, 'position_y', 0); }} className="px-2 py-1 bg-red-50 text-red-600 border border-red-200 rounded text-[10px] font-bold ml-2">Reset</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* DYNAMIC BUTTONS */}
              <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-purple-900 tracking-wider flex items-center gap-1.5">
                    <Link className="w-4 h-4" /> Dynamic Buttons
                  </h4>
                  <button type="button" onClick={handleAddButton} className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] shadow-sm flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add Button
                  </button>
                </div>

                <div className="space-y-3">
                  {Array.isArray(editingBanner.buttons) && editingBanner.buttons.map((btn, btnIdx) => (
                    <div key={btn.id || btnIdx} className="bg-white p-3 rounded-xl border border-purple-200 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-purple-700">Button #{btnIdx + 1}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-500">Pos: {btn.position_x || 0}px, {btn.position_y || 0}px</span>
                          <button type="button" onClick={() => removeElement('buttons', btnIdx)} className="text-[10px] text-red-600 font-bold hover:underline">Remove</button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                        <input type="text" placeholder="Button Text" value={btn.text || ''} onChange={(e) => updateElementField('buttons', btnIdx, 'text', e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-900" />
                        
                        <div className="flex gap-1 lg:col-span-2">
                           <select value={btn.is_external ? 'external' : 'internal'} onChange={(e) => { updateElementField('buttons', btnIdx, 'is_external', e.target.value === 'external'); updateElementField('buttons', btnIdx, 'link', ''); }} className="w-24 shrink-0 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold">
                             <option value="internal">Internal</option>
                             <option value="external">External</option>
                           </select>
                           
                           {btn.is_external ? (
                             <input type="url" placeholder="https://..." value={btn.link || ''} onChange={(e) => updateElementField('buttons', btnIdx, 'link', e.target.value)} className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold" />
                           ) : (
                             <select value={btn.link || '/offers'} onChange={(e) => updateElementField('buttons', btnIdx, 'link', e.target.value)} className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold">
                               <option value="/offers">Offers Page (/offers)</option>
                               <option value="/ott-plans">OTT Plans Page (/ott-plans)</option>
                               <option value="/fiber-internet">Fiber Broadband Page (/fiber-internet)</option>
                               <option value="/mobiles">Mobiles &amp; Gadgets (/mobiles)</option>
                               <option value="/electronics">Electronics Page (/electronics)</option>
                               <option value="/contact">Contact Support Page (/contact)</option>
                               <option value="/view-all">All Products Explorer (/view-all)</option>
                             </select>
                           )}
                        </div>

                        <div className="flex gap-1">
                          <select value={btn.target || '_self'} onChange={(e) => updateElementField('buttons', btnIdx, 'target', e.target.value)} className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold">
                            <option value="_self">Same Tab</option>
                            <option value="_blank">New Tab</option>
                          </select>
                          <select value={btn.is_active !== false ? 'true' : 'false'} onChange={(e) => updateElementField('buttons', btnIdx, 'is_active', e.target.value === 'true')} className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold">
                            <option value="true">Show</option><option value="false">Hide</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100 flex-wrap gap-2">
                        <span className="text-[10px] font-bold text-slate-700">Movement Controls:</span>
                        <div className="flex gap-1.5">
                          <button type="button" onClick={() => updateElementPosition('buttons', btnIdx, -10, 0)} className="px-2.5 py-1 bg-white border border-slate-200 rounded text-[11px] font-extrabold shadow-sm">← LEFT</button>
                          <button type="button" onClick={() => updateElementPosition('buttons', btnIdx, 10, 0)} className="px-2.5 py-1 bg-white border border-slate-200 rounded text-[11px] font-extrabold shadow-sm">RIGHT →</button>
                          <button type="button" onClick={() => updateElementPosition('buttons', btnIdx, 0, -10)} className="px-2.5 py-1 bg-white border border-slate-200 rounded text-[11px] font-extrabold shadow-sm">↑ UP</button>
                          <button type="button" onClick={() => updateElementPosition('buttons', btnIdx, 0, 10)} className="px-2.5 py-1 bg-white border border-slate-200 rounded text-[11px] font-extrabold shadow-sm">↓ DOWN</button>
                          <button type="button" onClick={() => { updateElementField('buttons', btnIdx, 'position_x', 0); updateElementField('buttons', btnIdx, 'position_y', 0); }} className="px-2 py-1 bg-red-50 text-red-600 border border-red-200 rounded text-[10px] font-bold ml-2">RESET</button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setEditingBanner(null)} className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-8 py-2.5 rounded-xl bg-[#008744] hover:bg-emerald-600 text-white text-sm font-black shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 cursor-pointer">
                  {saving ? 'Saving...' : 'Save Banner Elements & Positions'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
