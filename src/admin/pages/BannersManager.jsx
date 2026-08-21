import React, { useState } from 'react';
import { 
  Image as ImageIcon, Plus, Edit3, Trash2, Power, Upload, Check, Eye, Link, Palette, Sparkles, Layers, ArrowUp, ArrowDown, ExternalLink, HelpCircle 
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
  const [uploadingPrimary, setUploadingPrimary] = useState(false);
  const [uploadingSecondary, setUploadingSecondary] = useState(false);
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
      const featureItemsList = Array.isArray(editingBanner?.feature_items) ? editingBanner.feature_items : [];

      const badgeConfig = editingBanner?.badge_config || {
        enabled: false,
        text: '',
        position: 'top-left',
        bg_color: '#e50914',
        text_color: '#ffffff'
      };

      const secondaryImageUrl = editingBanner?.secondary_image_url || '';
      const secondaryImageCaption = editingBanner?.secondary_image_caption || '';

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
        is_active: editingBanner ? editingBanner.is_active !== false : true,
        display_order: editingBanner ? editingBanner.display_order : banners.length + 1,
        buttons: buttonsList,
        badges: [
          { id: 'badge_config', type: 'badge_config', ...badgeConfig },
          { id: 'feature_items', type: 'feature_items', items: featureItemsList },
          ...featureItemsList.map(f => ({ ...f, type: 'feature_item' })),
          { id: 'secondary_image', type: 'secondary_image', url: secondaryImageUrl, caption: secondaryImageCaption }
        ],
        badge_config: badgeConfig,
        feature_items: featureItemsList,
        secondary_image_url: secondaryImageUrl,
        secondary_image_caption: secondaryImageCaption,
        subheading: subheadingsList.length > 0 ? subheadingsList[0].text : (formData.get('subheading') || ''),
        button_text: buttonsList.length > 0 ? buttonsList[0].text : 'Explore Deals',
        button_link: buttonsList.length > 0 ? buttonsList[0].link : 'offers',
      };

      await saveCmsItem('banners', payload);
      await logActivity(adminEmail, editingBanner?.id ? 'EDITED' : 'ADDED', 'Banners', payload.title_name);
      await refreshAllData();
      setEditingBanner(null);
      showToast('Banner Saved & Synced Successfully!');
    } catch (err) {
      alert('Error saving banner: ' + err.message);
    } finally {
      setSaving(false);
    }
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

  const reorderElement = (listName, idx, direction) => {
    if (!editingBanner) return;
    const currentList = Array.isArray(editingBanner[listName]) ? [...editingBanner[listName]] : [];
    const targetIdx = direction === 'UP' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= currentList.length) return;

    const temp = currentList[idx];
    currentList[idx] = currentList[targetIdx];
    currentList[targetIdx] = temp;
    setEditingBanner({ ...editingBanner, [listName]: currentList });
  };

  const handleAddButton = () => {
    const current = Array.isArray(editingBanner.buttons) ? [...editingBanner.buttons] : [];
    current.push({
      id: `btn_${Date.now()}`,
      text: 'New Action Button',
      link: '/offers',
      link_type: 'internal',
      position: 'left',
      target: '_self',
      button_color: '#e50914',
      text_color: '#ffffff',
      is_active: true,
      position_x: 0,
      position_y: 0
    });
    setEditingBanner({ ...editingBanner, buttons: current });
  };

  const handleAddFeatureItem = () => {
    const current = Array.isArray(editingBanner.feature_items) ? [...editingBanner.feature_items] : [];
    current.push({
      id: `feat_${Date.now()}`,
      icon: 'Tv',
      title: 'New Package Item',
      subtitle: 'Premium Plan Details',
      color: '#e50914',
      is_active: true
    });
    setEditingBanner({ ...editingBanner, feature_items: current });
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

  const handlePrimaryImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingPrimary(true);
    try {
      const res = await uploadToCloudinary(file, 'banners');
      setEditingBanner(prev => ({ ...prev, image_url: res.url }));
      const inputEl = document.getElementById('banner_img_input');
      if (inputEl) inputEl.value = res.url;
      showToast('Main Banner Image Uploaded!');
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploadingPrimary(false);
    }
  };

  const handleSecondaryImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingSecondary(true);
    try {
      const res = await uploadToCloudinary(file, 'banners_secondary');
      setEditingBanner(prev => ({ ...prev, secondary_image_url: res.url }));
      showToast('Separate Picture Uploaded!');
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploadingSecondary(false);
    }
  };

  // Initialize a safe editable banner state
  const startEditing = (b) => {
    const safeBanner = { ...b };

    // Buttons parsing
    if (Array.isArray(b.buttons) && b.buttons.length > 0) {
      safeBanner.buttons = b.buttons.map((btn, idx) => ({
        id: btn.id || `btn_${idx}`,
        text: btn.text || 'Explore Deals',
        link: btn.link || '/offers',
        link_type: btn.link_type || (btn.link?.startsWith('http') ? 'external' : 'internal'),
        position: btn.position || 'left',
        target: btn.target || (btn.is_external ? '_blank' : '_self'),
        button_color: btn.button_color || '#e50914',
        text_color: btn.text_color || '#ffffff',
        is_active: btn.is_active !== false,
        position_x: btn.position_x || 0,
        position_y: btn.position_y || 0
      }));
    } else if (b.button_text) {
      safeBanner.buttons = [{
        id: 'btn_1',
        text: b.button_text,
        link: b.button_link || '/offers',
        link_type: b.button_link?.startsWith('http') ? 'external' : 'internal',
        position: 'left',
        target: '_self',
        button_color: '#e50914',
        text_color: '#ffffff',
        is_active: true,
        position_x: 0,
        position_y: 0
      }];
    } else {
      safeBanner.buttons = [];
    }

    if (!Array.isArray(safeBanner.subheadings)) {
      safeBanner.subheadings = b.subheading ? [{
        id: 'sub_1', text: b.subheading, is_active: true, position_x: 0, position_y: 0
      }] : [];
    }
    
    // Parse badges and feature_items from JSONB column
    let extractedFeatures = [];
    let extractedBadgeConfig = {
      enabled: false,
      text: '',
      position: 'top-left',
      bg_color: '#e50914',
      text_color: '#ffffff'
    };
    let extractedSecondaryImage = '';
    let extractedSecondaryCaption = '🔥 High-Speed Fiber Internet + OTT Combo';

    if (b.badges && typeof b.badges === 'object') {
      if (Array.isArray(b.badges.feature_items)) extractedFeatures = b.badges.feature_items;
      if (b.badges.badge_config) extractedBadgeConfig = { ...extractedBadgeConfig, ...b.badges.badge_config };
      if (b.badges.secondary_image_url) extractedSecondaryImage = b.badges.secondary_image_url;
      if (b.badges.secondary_image_caption) extractedSecondaryCaption = b.badges.secondary_image_caption;
    }

    if (b.secondary_image_url) extractedSecondaryImage = b.secondary_image_url;
    if (b.secondary_image_caption) extractedSecondaryCaption = b.secondary_image_caption;

    if (!Array.isArray(safeBanner.feature_items)) {
      if (extractedFeatures.length > 0) {
        safeBanner.feature_items = extractedFeatures;
      } else if (b.banner_key === 'home_middle_big') {
        safeBanner.feature_items = [
          { id: 'feat_1', icon: 'Tv', title: 'OTT Subscriptions', subtitle: 'Top Premium Platforms', color: '#e50914', is_active: true },
          { id: 'feat_2', icon: 'Wifi', title: 'Fiber Broadband', subtitle: 'High-Speed Internet Plans', color: '#38bdf8', is_active: true },
          { id: 'feat_3', icon: 'Layers', title: 'Combo Packages', subtitle: 'Save More with Combo Offers', color: '#f59e0b', is_active: true }
        ];
      } else {
        safeBanner.feature_items = [];
      }
    }

    safeBanner.badge_config = extractedBadgeConfig;
    safeBanner.secondary_image_url = extractedSecondaryImage;
    safeBanner.secondary_image_caption = extractedSecondaryCaption;

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
            Dynamic Badges (Top/Bottom Left/Right), Dynamic Buttons with Links &amp; Positions, Middle Package Items, and Separate Image Uploads.
          </p>
        </div>
        <button
          onClick={() => startEditing({
            banner_key: `custom_${Date.now()}`,
            title_name: 'Custom Promotional Banner',
            heading: 'NEW PROMO BANNER',
            buttons: [], subheadings: [], feature_items: [],
            badge_config: { enabled: false, text: '', position: 'top-left', bg_color: '#e50914', text_color: '#ffffff' },
            text_color: '#ffffff',
            bg_color: '#050b1e'
          })}
          className="px-4 py-2.5 rounded-xl bg-[#008744] hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Banner
        </button>
      </div>

      {/* Banners List */}
      <div className="space-y-4">
        {banners.map((b) => (
          <div key={b.id || b.banner_key} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4 font-sans">
            {/* Card Top */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-700 border border-purple-200">
                  {b.banner_key}
                </span>
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">{b.title_name}</h3>
                {b.badges?.badge_config?.enabled && (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-200">
                    🏷️ Badge: {b.badges.badge_config.text} ({b.badges.badge_config.position || 'top-left'})
                  </span>
                )}
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

            <div className="text-xs text-slate-600 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div><strong className="text-slate-900">Heading:</strong> {b.heading || '—'}</div>
              <div><strong className="text-slate-900">Buttons:</strong> {Array.isArray(b.buttons) ? b.buttons.length : (b.button_text ? 1 : 0)} buttons configured</div>
              <div><strong className="text-slate-900">Package Items:</strong> {Array.isArray(b.badges?.feature_items) ? b.badges.feature_items.length : 0} items</div>
            </div>

            {/* Actions Footer */}
            <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
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
          <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl space-y-4 font-sans my-4 max-h-[88vh] overflow-y-auto text-slate-900">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 sticky top-0 bg-white z-10">
              <div>
                <h3 className="font-black text-slate-900 text-lg">
                  Edit {editingBanner.title_name || 'Banner'}
                </h3>
                <span className="text-[11px] font-mono text-purple-600">Key: {editingBanner.banner_key}</span>
              </div>
              <button onClick={() => setEditingBanner(null)} type="button" className="text-slate-400 hover:text-slate-700 font-bold text-xl px-2">✕</button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-6">
              
              {/* 1. BASIC INFORMATION */}
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
              </div>

              {/* 2. OPTIONAL BADGE CUSTOMIZER (SECTION 1 FIX) */}
              <div className="bg-red-50/50 p-4 rounded-xl border border-red-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-red-900 tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-red-600" /> 1. Optional Badge Customizer
                  </h4>
                  <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-red-200 shadow-sm">
                    <input 
                      type="checkbox" 
                      checked={editingBanner.badge_config?.enabled || false}
                      onChange={(e) => {
                        setEditingBanner({
                          ...editingBanner,
                          badge_config: {
                            ...(editingBanner.badge_config || {}),
                            enabled: e.target.checked
                          }
                        });
                      }}
                      className="w-4 h-4 accent-red-600 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-red-950">Enable Badge</span>
                  </label>
                </div>

                {editingBanner.badge_config?.enabled && (
                  <div className="bg-white p-4 rounded-xl border border-red-200 space-y-3 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      
                      {/* Badge Text */}
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Badge Text *</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 50% OFF, LIMITED DEAL, EXCLUSIVE" 
                          value={editingBanner.badge_config?.text || ''}
                          onChange={(e) => {
                            setEditingBanner({
                              ...editingBanner,
                              badge_config: {
                                ...(editingBanner.badge_config || {}),
                                text: e.target.value
                              }
                            });
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-900"
                        />
                      </div>

                      {/* Badge Position */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Position on Banner</label>
                        <select 
                          value={editingBanner.badge_config?.position || 'top-left'}
                          onChange={(e) => {
                            setEditingBanner({
                              ...editingBanner,
                              badge_config: {
                                ...(editingBanner.badge_config || {}),
                                position: e.target.value
                              }
                            });
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-900"
                        >
                          <option value="top-left">Top Left</option>
                          <option value="top-right">Top Right</option>
                          <option value="bottom-left">Bottom Left</option>
                          <option value="bottom-right">Bottom Right</option>
                        </select>
                      </div>

                      {/* Badge Colors */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Colors (BG &amp; Text)</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="color" 
                            value={editingBanner.badge_config?.bg_color || '#e50914'}
                            onChange={(e) => {
                              setEditingBanner({
                                ...editingBanner,
                                badge_config: {
                                  ...(editingBanner.badge_config || {}),
                                  bg_color: e.target.value
                                }
                              });
                            }}
                            className="w-8 h-8 rounded border border-slate-200 cursor-pointer p-0.5"
                            title="Background Color"
                          />
                          <input 
                            type="color" 
                            value={editingBanner.badge_config?.text_color || '#ffffff'}
                            onChange={(e) => {
                              setEditingBanner({
                                ...editingBanner,
                                badge_config: {
                                  ...(editingBanner.badge_config || {}),
                                  text_color: e.target.value
                                }
                              });
                            }}
                            className="w-8 h-8 rounded border border-slate-200 cursor-pointer p-0.5"
                            title="Text Color"
                          />
                          <span className="text-[10px] font-mono text-slate-500">{editingBanner.badge_config?.bg_color || '#e50914'}</span>
                        </div>
                      </div>

                    </div>

                    {/* Preview pill */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-500">Live Preview:</span>
                      <span 
                        style={{ 
                          backgroundColor: editingBanner.badge_config?.bg_color || '#e50914',
                          color: editingBanner.badge_config?.text_color || '#ffffff'
                        }}
                        className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-sm"
                      >
                        {editingBanner.badge_config?.text || 'SAMPLE BADGE'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. DYNAMIC BUTTONS (SECTION 2 FIX) */}
              <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black uppercase text-purple-900 tracking-wider flex items-center gap-1.5">
                      <Link className="w-4 h-4 text-purple-600" /> 2. Dynamic Banner Buttons &amp; Direct Links
                    </h4>
                    <p className="text-[10px] text-purple-700">Add multiple buttons, custom text, link URLs, presets, position alignment, and colors</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={handleAddButton} 
                    className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Button
                  </button>
                </div>

                <div className="space-y-3">
                  {Array.isArray(editingBanner.buttons) && editingBanner.buttons.map((btn, btnIdx) => (
                    <div key={btn.id || btnIdx} className="bg-white p-3.5 rounded-xl border border-purple-200 shadow-sm space-y-3">
                      
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-purple-700">Button #{btnIdx + 1}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-600 border border-purple-200">
                            Align: {btn.position || 'left'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button 
                            type="button" 
                            onClick={() => reorderElement('buttons', btnIdx, 'UP')}
                            disabled={btnIdx === 0}
                            className="p-1 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-30"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            type="button" 
                            onClick={() => reorderElement('buttons', btnIdx, 'DOWN')}
                            disabled={btnIdx === editingBanner.buttons.length - 1}
                            className="p-1 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-30"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            type="button" 
                            onClick={() => removeElement('buttons', btnIdx)} 
                            className="p-1 rounded bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold"
                            title="Delete Button"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5">
                        
                        {/* Button Text */}
                        <div className="lg:col-span-3">
                          <label className="text-[10px] font-bold text-slate-600 block mb-1">Button Name / Text *</label>
                          <input 
                            type="text" 
                            placeholder="Button Text" 
                            value={btn.text || ''} 
                            onChange={(e) => updateElementField('buttons', btnIdx, 'text', e.target.value)} 
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-900" 
                          />
                        </div>
                        
                        {/* Direct Link Box & Presets */}
                        <div className="lg:col-span-5 space-y-1">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold text-slate-600">Target Link URL Box *</label>
                            {btn.link && (
                              <button 
                                type="button" 
                                onClick={() => {
                                  const url = btn.link;
                                  if (url.startsWith('http') || url.startsWith('tel:') || url.startsWith('mailto:')) {
                                    window.open(url, '_blank');
                                  } else {
                                    window.open(`/${url.replace(/^\//, '')}`, '_blank');
                                  }
                                }}
                                className="text-[10px] font-bold text-purple-600 hover:text-purple-800 underline flex items-center gap-0.5"
                              >
                                🔗 Test Link
                              </button>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <input 
                              type="text" 
                              placeholder="e.g. /offers, /ott-plans, https://..." 
                              value={btn.link || ''} 
                              onChange={(e) => updateElementField('buttons', btnIdx, 'link', e.target.value)} 
                              className="flex-1 bg-slate-50 border border-purple-300 focus:border-purple-600 rounded-lg p-2 text-xs font-mono text-purple-900" 
                            />
                            <select 
                              onChange={(e) => {
                                if (e.target.value) updateElementField('buttons', btnIdx, 'link', e.target.value);
                              }} 
                              className="w-28 shrink-0 bg-slate-100 border border-slate-300 rounded-lg p-1.5 text-[11px] font-bold text-slate-700"
                            >
                              <option value="">Presets ▾</option>
                              <option value="/offers">Offers (/offers)</option>
                              <option value="/ott-plans">OTT Plans (/ott-plans)</option>
                              <option value="/fiber-internet">Fiber Internet (/fiber-internet)</option>
                              <option value="/mobiles">Mobiles (/mobiles)</option>
                              <option value="/electronics">Electronics (/electronics)</option>
                              <option value="/contact">Contact (/contact)</option>
                              <option value="/view-all">All Products (/view-all)</option>
                              <option value="https://wa.me/916305151531">WhatsApp Chat</option>
                            </select>
                          </div>
                        </div>

                        {/* Link Type */}
                        <div className="lg:col-span-2">
                          <label className="text-[10px] font-bold text-slate-600 block mb-1">Link Type</label>
                          <select 
                            value={btn.link_type || 'internal'} 
                            onChange={(e) => updateElementField('buttons', btnIdx, 'link_type', e.target.value)} 
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold"
                          >
                            <option value="internal">Internal Page</option>
                            <option value="external">External URL</option>
                          </select>
                        </div>

                        {/* Button Position / Alignment */}
                        <div className="lg:col-span-2">
                          <label className="text-[10px] font-bold text-slate-600 block mb-1">Button Alignment</label>
                          <select 
                            value={btn.position || 'left'} 
                            onChange={(e) => updateElementField('buttons', btnIdx, 'position', e.target.value)} 
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold"
                          >
                            <option value="left">Left</option>
                            <option value="center">Center</option>
                            <option value="right">Right</option>
                          </select>
                        </div>

                      </div>

                      {/* Colors & Visibility */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 items-center">
                        <div className="flex items-center gap-2">
                          <label className="text-[10px] font-bold text-slate-600">Button Color:</label>
                          <input 
                            type="color" 
                            value={btn.button_color || '#e50914'} 
                            onChange={(e) => updateElementField('buttons', btnIdx, 'button_color', e.target.value)}
                            className="w-7 h-7 rounded border cursor-pointer p-0.5"
                          />
                          <label className="text-[10px] font-bold text-slate-600 ml-2">Text:</label>
                          <input 
                            type="color" 
                            value={btn.text_color || '#ffffff'} 
                            onChange={(e) => updateElementField('buttons', btnIdx, 'text_color', e.target.value)}
                            className="w-7 h-7 rounded border cursor-pointer p-0.5"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-600 mr-2">Target:</label>
                          <select 
                            value={btn.target || '_self'} 
                            onChange={(e) => updateElementField('buttons', btnIdx, 'target', e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded p-1 text-xs font-bold"
                          >
                            <option value="_self">Same Tab</option>
                            <option value="_blank">New Tab</option>
                          </select>
                        </div>

                        <div className="flex justify-end">
                          <select 
                            value={btn.is_active !== false ? 'true' : 'false'} 
                            onChange={(e) => updateElementField('buttons', btnIdx, 'is_active', e.target.value === 'true')} 
                            className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-bold"
                          >
                            <option value="true">Active (Show)</option>
                            <option value="false">Hidden (Off)</option>
                          </select>
                        </div>
                      </div>

                    </div>
                  ))}

                  {(!editingBanner.buttons || editingBanner.buttons.length === 0) && (
                    <div className="text-center py-4 bg-white rounded-xl border border-dashed border-purple-200 text-xs text-slate-500">
                      No buttons added yet. Click <strong>+ Add Button</strong> above to add custom action buttons.
                    </div>
                  )}
                </div>
              </div>

              {/* 4. DYNAMIC MIDDLE FEATURE ITEMS (SECTION 3 FIX: OTT / Fiber / Combo Packages) */}
              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black uppercase text-amber-900 tracking-wider flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-amber-600" /> 3. OTT / Fiber / Combo Package Content (Feature Lines)
                    </h4>
                    <p className="text-[10px] text-amber-800">Fully editable package items: Name, description, symbol/icon, icon color, reorder, add and delete</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={handleAddFeatureItem} 
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shadow-sm flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Package Item
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {Array.isArray(editingBanner.feature_items) && editingBanner.feature_items.map((feat, featIdx) => (
                    <div key={feat.id || featIdx} className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-sm space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-800">Package #{featIdx + 1}</span>
                        <div className="flex items-center gap-1">
                          <button 
                            type="button" 
                            onClick={() => reorderElement('feature_items', featIdx, 'UP')}
                            disabled={featIdx === 0}
                            className="p-1 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-30"
                            title="Move Left"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button 
                            type="button" 
                            onClick={() => reorderElement('feature_items', featIdx, 'DOWN')}
                            disabled={featIdx === editingBanner.feature_items.length - 1}
                            className="p-1 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-30"
                            title="Move Right"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                          <button 
                            type="button" 
                            onClick={() => removeElement('feature_items', featIdx)} 
                            className="p-1 text-red-600 hover:text-red-800 font-bold"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 block mb-1">Symbol / Icon</label>
                          <select 
                            value={feat.icon || 'Tv'} 
                            onChange={(e) => updateElementField('feature_items', featIdx, 'icon', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold"
                          >
                            <option value="Tv">Tv (OTT Platforms)</option>
                            <option value="Wifi">Wifi (Fiber Broadband)</option>
                            <option value="Layers">Layers (Combo Packages)</option>
                            <option value="Flame">Flame (Flash Deals)</option>
                            <option value="Zap">Zap (Lightning Fast)</option>
                            <option value="Shield">Shield (100% Secure)</option>
                            <option value="Sparkles">Sparkles (Exclusive)</option>
                            <option value="Smartphone">Smartphone (Mobile)</option>
                            <option value="Headphones">Headphones (Audio)</option>
                            <option value="Laptop">Laptop (Devices)</option>
                            <option value="Gift">Gift (Bonus Rewards)</option>
                            <option value="Star">Star (Top Rated)</option>
                            <option value="Clock">Clock (24/7 Access)</option>
                            <option value="CheckCircle">CheckCircle (Verified)</option>
                            <option value="Globe">Globe (Global Content)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-600 block mb-1">Title / Name *</label>
                          <input 
                            type="text" 
                            placeholder="e.g. OTT Subscriptions" 
                            value={feat.title || ''} 
                            onChange={(e) => updateElementField('feature_items', featIdx, 'title', e.target.value)} 
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-900" 
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-600 block mb-1">Subtitle / Description</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Top Premium Platforms" 
                            value={feat.subtitle || ''} 
                            onChange={(e) => updateElementField('feature_items', featIdx, 'subtitle', e.target.value)} 
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-900" 
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <div>
                            <label className="text-[10px] font-bold text-slate-600 block mb-1">Icon Color</label>
                            <div className="flex items-center gap-1.5">
                              <input 
                                type="color" 
                                value={feat.color && feat.color.startsWith('#') ? feat.color : '#e50914'} 
                                onChange={(e) => updateElementField('feature_items', featIdx, 'color', e.target.value)} 
                                className="w-8 h-8 rounded border border-slate-200 cursor-pointer p-0.5" 
                              />
                              <input 
                                type="text" 
                                value={feat.color || '#e50914'} 
                                onChange={(e) => updateElementField('feature_items', featIdx, 'color', e.target.value)} 
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[11px] font-mono" 
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-600 block mb-1">Visibility</label>
                            <select 
                              value={feat.is_active !== false ? 'true' : 'false'} 
                              onChange={(e) => updateElementField('feature_items', featIdx, 'is_active', e.target.value === 'true')}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold"
                            >
                              <option value="true">Show</option>
                              <option value="false">Hide</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. LOGO + SEPARATE PICTURE UPLOAD (SECTION 4 FIX) */}
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 space-y-4">
                <h4 className="text-xs font-black uppercase text-emerald-900 tracking-wider flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-emerald-600" /> 4. Main Banner Image / Logo + Separate Picture Upload
                </h4>
                <p className="text-[10px] text-emerald-800">
                  Upload the main banner artwork/logo, and upload the separate bottom feature picture independently.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Primary Banner Image / Logo Artwork */}
                  <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-3">
                    <label className="block text-xs font-bold text-slate-800">
                      Primary Banner Image / Logo Artwork
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="image_url"
                        id="banner_img_input"
                        value={editingBanner.image_url || ''}
                        onChange={(e) => setEditingBanner({ ...editingBanner, image_url: e.target.value })}
                        placeholder="https://... or /image.png"
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono shadow-sm"
                      />
                      <label className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0 shadow">
                        <Upload className="w-3.5 h-3.5" /> {uploadingPrimary ? '...' : 'Upload'}
                        <input type="file" accept="image/*" onChange={handlePrimaryImageUpload} className="hidden" />
                      </label>
                    </div>

                    {editingBanner.image_url && (
                      <div className="relative w-full h-28 bg-slate-950 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center p-2">
                        <img src={editingBanner.image_url} alt="Main Banner Preview" className="max-h-full max-w-full object-contain" />
                        <button
                          type="button"
                          onClick={() => setEditingBanner({ ...editingBanner, image_url: '' })}
                          className="absolute top-1.5 right-1.5 bg-red-600 text-white p-1 rounded-full text-[10px] hover:bg-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Separate Secondary Picture Upload (Router/Fiber/Combo Picture) */}
                  <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-3">
                    <label className="block text-xs font-bold text-slate-800">
                      Separate Bottom Feature Picture (e.g. Fiber/Combo Card)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editingBanner.secondary_image_url || ''}
                        onChange={(e) => setEditingBanner({ ...editingBanner, secondary_image_url: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono shadow-sm"
                      />
                      <label className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0 shadow">
                        <Upload className="w-3.5 h-3.5" /> {uploadingSecondary ? '...' : 'Upload'}
                        <input type="file" accept="image/*" onChange={handleSecondaryImageUpload} className="hidden" />
                      </label>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">Caption / Subtitle Text</label>
                      <input
                        type="text"
                        value={editingBanner.secondary_image_caption || ''}
                        onChange={(e) => setEditingBanner({ ...editingBanner, secondary_image_caption: e.target.value })}
                        placeholder="e.g. 🔥 High-Speed Fiber Internet + OTT Combo"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold"
                      />
                    </div>

                    {editingBanner.secondary_image_url && (
                      <div className="relative w-full h-24 bg-slate-900 rounded-xl overflow-hidden border border-slate-200">
                        <img src={editingBanner.secondary_image_url} alt="Secondary Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setEditingBanner({ ...editingBanner, secondary_image_url: '' })}
                          className="absolute top-1.5 right-1.5 bg-red-600 text-white p-1 rounded-full text-[10px] hover:bg-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setEditingBanner(null)} 
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving} 
                  className="px-8 py-2.5 rounded-xl bg-[#008744] hover:bg-emerald-600 text-white text-sm font-black shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 cursor-pointer"
                >
                  {saving ? 'Saving & Syncing...' : 'Save & Publish Banner'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
