import React, { useState, useMemo } from 'react';
import { 
  Image as ImageIcon, Plus, Edit3, Trash2, Power, Upload, Check, Eye, Link, Palette, 
  Sparkles, Layers, ArrowUp, ArrowDown, ExternalLink, HelpCircle, Copy, Info, Sliders, ChevronUp, ChevronDown
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
  const [activeSectionTab, setActiveSectionTab] = useState('All');
  const [bannerMode, setBannerMode] = useState('image'); // 'image' or 'color'

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const getSectionFromKey = (key = '') => {
    const k = key.toLowerCase();
    if (k.includes('home_main')) return 'Home Main';
    if (k.includes('home_small') || k.includes('home_middle') || k.includes('home_bottom')) return 'Small Banners';
    if (k.includes('ott')) return 'OTT Platforms';
    if (k.includes('fiber')) return 'Fiber Internet';
    if (k.includes('mobile')) return 'Mobiles';
    if (k.includes('offer')) return 'Offers';
    return 'Other';
  };

  const sortedBanners = useMemo(() => {
    const list = Array.isArray(banners) ? [...banners] : [];
    list.sort((a, b) => (Number(a.display_order) || 999) - (Number(b.display_order) || 999));
    return list;
  }, [banners]);

  const filteredBanners = useMemo(() => {
    if (activeSectionTab === 'All') return sortedBanners;
    return sortedBanners.filter(b => getSectionFromKey(b.banner_key) === activeSectionTab);
  }, [sortedBanners, activeSectionTab]);

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

  const handleDuplicateBanner = async (banner) => {
    try {
      const newUniqueId = `banner_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const newBannerKey = `${banner.banner_key || 'custom'}_copy_${Date.now().toString().slice(-4)}`;
      const duplicatedBanner = {
        ...banner,
        id: newUniqueId,
        banner_key: newBannerKey,
        title_name: `${banner.title_name || 'Banner'} (Copy)`,
        display_order: sortedBanners.length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await saveCmsItem('banners', duplicatedBanner);
      await logActivity(adminEmail, 'DUPLICATED', 'Banners', duplicatedBanner.title_name);
      await refreshAllData();
      showToast(`Duplicated: "${duplicatedBanner.title_name}"`);
    } catch (err) {
      alert('Error duplicating banner: ' + err.message);
    }
  };

  const handleMoveOrder = async (idx, direction) => {
    const targetIdx = direction === 'UP' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sortedBanners.length) return;

    const currentList = [...sortedBanners];
    const temp = currentList[idx];
    currentList[idx] = currentList[targetIdx];
    currentList[targetIdx] = temp;

    // Update display_order sequentially
    const updatedWithOrder = currentList.map((item, index) => ({
      ...item,
      display_order: index + 1
    }));

    setBanners(updatedWithOrder);
    try {
      await updateDisplayOrder('banners', updatedWithOrder, 'display_order');
      showToast('Banner Order Updated & Synced to Website');
    } catch (err) {
      console.error('Failed to sync order:', err);
      showToast('Order saved locally');
    }
  };

  const handleSaveBanner = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData(e.target);

      const buttonsList = Array.isArray(editingBanner?.buttons) ? editingBanner.buttons : [];
      const subheadingsList = Array.isArray(editingBanner?.subheadings) ? editingBanner.subheadings : [];
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
      const headingSegmentsList = Array.isArray(editingBanner?.heading_segments) ? editingBanner.heading_segments : [];

      const payload = {
        id: editingBanner?.id,
        banner_key: editingBanner?.banner_key || `banner_${Date.now()}`,
        title_name: formData.get('title_name') || editingBanner?.title_name || 'Custom Banner',
        heading: formData.get('heading'),
        heading_segments: headingSegmentsList,
        description: formData.get('description'),
        image_url: bannerMode === 'color' ? '' : (formData.get('image_url') || ''),
        image_fit: formData.get('image_fit') || 'contain',
        image_position: formData.get('image_position') || 'center',
        mobile_image_url: bannerMode === 'color' ? '' : (formData.get('mobile_image_url') || formData.get('image_url') || ''),
        text_color: formData.get('text_color') || '#ffffff',
        button_color: formData.get('button_color') || '#e50914',
        bg_color: formData.get('bg_color') || '#050b1e',
        overlay_color: formData.get('overlay_color') || 'rgba(0,0,0,0.3)',
        is_active: editingBanner ? editingBanner.is_active !== false : true,
        display_order: editingBanner?.display_order !== undefined ? Number(editingBanner.display_order) : sortedBanners.length + 1,
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
        subheading: subheadingsList.length > 0 ? subheadingsList[0].text : (formData.get('subheading') || editingBanner?.subheading || ''),
        button_text: buttonsList.length > 0 ? buttonsList[0].text : (formData.get('button_text') || 'Explore Deals'),
        button_link: buttonsList.length > 0 ? buttonsList[0].link : (formData.get('button_link') || 'offers'),
      };

      await saveCmsItem('banners', payload);
      await logActivity(adminEmail, editingBanner?.id ? 'EDITED' : 'ADDED', 'Banners', payload.title_name);
      await refreshAllData();
      setEditingBanner(null);
      showToast('Banner Saved & Synced Live to Website!');
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
      showToast('Secondary Picture Uploaded!');
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploadingSecondary(false);
    }
  };

  const startEditing = (b) => {
    const safeBanner = { ...b };
    setBannerMode(b.image_url ? 'image' : 'color');

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
        button_color: b.button_color || '#e50914',
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
      } else {
        safeBanner.feature_items = [];
      }
    }

    safeBanner.badge_config = extractedBadgeConfig;
    safeBanner.secondary_image_url = extractedSecondaryImage;
    safeBanner.secondary_image_caption = extractedSecondaryCaption;

    setEditingBanner(safeBanner);
  };

  const sectionTabs = ['All', 'Home Main', 'Small Banners', 'OTT Platforms', 'Fiber Internet', 'Mobiles', 'Offers', 'Other'];

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
            <ImageIcon className="w-6 h-6 text-[#e50914]" /> Master Banners Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Single management source for Home, Small Promo Banners, OTT, Fiber, Mobiles, and Section Banners with live reordering and solid color modes.
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
            button_color: '#e50914',
            bg_color: '#050b1e',
            overlay_color: 'rgba(0,0,0,0.3)'
          })}
          className="px-4 py-2.5 rounded-xl bg-[#008744] hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Banner
        </button>
      </div>

      {/* Recommended Image Sizes Reference Box */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-indigo-900 shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-amber-400" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-amber-300">
            📐 Recommended Image Dimensions &amp; Aspect Ratios (Use for ChatGPT / Canva Generations)
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="bg-white/10 rounded-xl p-3 border border-white/10 space-y-1">
            <span className="font-extrabold text-sky-300 block">🏠 Home Main Banners</span>
            <p className="text-slate-300 text-[11px]"><strong>Desktop:</strong> 1200 × 500 px (12:5)</p>
            <p className="text-slate-300 text-[11px]"><strong>Mobile:</strong> 600 × 400 px (3:2)</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 border border-white/10 space-y-1">
            <span className="font-extrabold text-pink-300 block">🎁 Small Banners (01 / 02 / 03)</span>
            <p className="text-slate-300 text-[11px]"><strong>Desktop:</strong> 600 × 400 px (3:2)</p>
            <p className="text-slate-300 text-[11px]"><strong>Mobile:</strong> 400 × 267 px (3:2)</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 border border-white/10 space-y-1">
            <span className="font-extrabold text-amber-300 block">📦 Middle Big Package Banner</span>
            <p className="text-slate-300 text-[11px]"><strong>Desktop:</strong> 1200 × 400 px (3:1)</p>
            <p className="text-slate-300 text-[11px]"><strong>Mobile:</strong> 600 × 350 px</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 border border-white/10 space-y-1">
            <span className="font-extrabold text-emerald-300 block">⚡ Category Top (OTT/Fiber/Mobiles)</span>
            <p className="text-slate-300 text-[11px]"><strong>Desktop:</strong> 1200 × 350 px (24:7)</p>
            <p className="text-slate-300 text-[11px]"><strong>Mobile:</strong> 600 × 300 px (2:1)</p>
          </div>
        </div>
      </div>

      {/* Section Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200">
        {sectionTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSectionTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeSectionTab === tab
                ? 'bg-[#e50914] text-white shadow-md shadow-red-600/30'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab} {tab === 'All' ? `(${sortedBanners.length})` : `(${sortedBanners.filter(b => getSectionFromKey(b.banner_key) === tab).length})`}
          </button>
        ))}
      </div>

      {/* Banners List */}
      <div className="space-y-4">
        {filteredBanners.map((b, idx) => {
          const globalIdx = sortedBanners.findIndex(item => (item.id && item.id === b.id) || item.banner_key === b.banner_key);
          const sectionName = getSectionFromKey(b.banner_key);
          const isColorMode = !b.image_url;

          return (
            <div key={b.id || b.banner_key} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4 font-sans">
              
              {/* Card Top Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-700 border border-blue-200">
                    {sectionName}
                  </span>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-700 border border-purple-200">
                    Key: {b.banner_key}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    Order: #{b.display_order || idx + 1}
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">{b.title_name}</h3>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {/* Move Up / Move Down Order */}
                  <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 p-0.5">
                    <button
                      onClick={() => handleMoveOrder(globalIdx, 'UP')}
                      disabled={globalIdx === 0}
                      className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded disabled:opacity-30 cursor-pointer"
                      title="Move Banner Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveOrder(globalIdx, 'DOWN')}
                      disabled={globalIdx === sortedBanners.length - 1}
                      className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded disabled:opacity-30 cursor-pointer"
                      title="Move Banner Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleToggleStatus(b)}
                    className={`px-3 py-1 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                      b.is_active !== false ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
                    }`}
                  >
                    {b.is_active !== false ? 'ACTIVE' : 'OFF'}
                  </button>
                </div>
              </div>

              {/* Banner Details & Visual Thumbnail */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                
                {/* Visual Preview */}
                <div className="sm:col-span-4 h-24 rounded-xl overflow-hidden border border-slate-200 relative flex items-center justify-center shadow-inner" style={{ backgroundColor: b.bg_color || '#050b1e' }}>
                  {b.image_url ? (
                    <img src={b.image_url} alt={b.title_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded bg-black/40 text-white border border-white/20">
                        🎨 Solid Color ({b.bg_color || '#050b1e'})
                      </span>
                    </div>
                  )}
                  {b.overlay_color && (
                    <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: b.overlay_color }} />
                  )}
                </div>

                {/* Info Columns */}
                <div className="sm:col-span-8 text-xs text-slate-600 space-y-1.5">
                  <div><strong className="text-slate-900">Heading:</strong> {b.heading || '—'}</div>
                  <div><strong className="text-slate-900">Subheading / Badge:</strong> {b.subheading || '—'}</div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span><strong className="text-slate-900">Button Text:</strong> {b.button_text || 'Explore Deals'}</span>
                    <span><strong className="text-slate-900">Link:</strong> <code className="text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded font-mono">{b.button_link || 'offers'}</code></span>
                    <span><strong className="text-slate-900">Mode:</strong> {isColorMode ? 'Solid Color' : 'Image'}</span>
                  </div>
                </div>

              </div>

              {/* Actions Footer */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  onClick={() => handleDuplicateBanner(b)}
                  className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1.5 transition-colors border border-blue-200 cursor-pointer"
                  title="Duplicate banner with unique ID"
                >
                  <Copy className="w-3.5 h-3.5" /> Duplicate
                </button>
                <button
                  onClick={() => startEditing(b)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors border border-slate-200 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-purple-600" /> Edit Banner
                </button>
                <button
                  onClick={() => handleDeleteBanner(b.id || b.banner_key, b.title_name)}
                  className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          );
        })}
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
                <span className="text-[11px] font-mono text-purple-600">Key: {editingBanner.banner_key} | Section: {getSectionFromKey(editingBanner.banner_key)}</span>
              </div>
              <button onClick={() => setEditingBanner(null)} type="button" className="text-slate-400 hover:text-slate-700 font-bold text-xl px-2 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-6">
              
              {/* 1. BANNER TYPE (IMAGE VS SOLID COLOR) */}
              <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-200 space-y-3">
                <label className="block text-xs font-bold text-indigo-950 uppercase tracking-wider">
                  Banner Mode: Image vs Solid Color
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-xl border border-indigo-200 shadow-sm">
                    <input 
                      type="radio" 
                      name="banner_mode" 
                      value="image" 
                      checked={bannerMode === 'image'} 
                      onChange={() => setBannerMode('image')}
                      className="accent-indigo-600 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-slate-800">🖼️ Image Mode</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-xl border border-indigo-200 shadow-sm">
                    <input 
                      type="radio" 
                      name="banner_mode" 
                      value="color" 
                      checked={bannerMode === 'color'} 
                      onChange={() => setBannerMode('color')}
                      className="accent-indigo-600 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-slate-800">🎨 Solid Color Mode</span>
                  </label>
                </div>
              </div>

              {/* 2. BASIC INFORMATION & TEXT */}
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">Heading / Main Title *</label>
                  <input
                    type="text"
                    name="heading"
                    required
                    defaultValue={editingBanner.heading || ''}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 text-xs shadow-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subheading / Badge Text</label>
                  <input
                    type="text"
                    name="subheading"
                    defaultValue={editingBanner.subheading || ''}
                    placeholder="e.g. MEGA SAVINGS, 75% OFF"
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 text-xs shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Default Button Text &amp; URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="button_text"
                      defaultValue={editingBanner.button_text || 'Explore Deals'}
                      placeholder="Button Text"
                      className="w-1/2 bg-white border border-slate-200 rounded-xl p-2 text-xs font-bold"
                    />
                    <input
                      type="text"
                      name="button_link"
                      defaultValue={editingBanner.button_link || 'offers'}
                      placeholder="Target Link (e.g. /offers, /ott-plans)"
                      className="w-1/2 bg-white border border-slate-200 rounded-xl p-2 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Description / Subtitle</label>
                  <textarea
                    name="description"
                    rows="2"
                    defaultValue={editingBanner.description || ''}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 text-xs shadow-sm"
                  ></textarea>
                </div>
              </div>

              {/* 3. COLOR CONTROLS (HEX + PICKER) */}
              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 space-y-4">
                <h4 className="text-xs font-black uppercase text-amber-950 tracking-wider flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-amber-600" /> Color Controls &amp; Overlays
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Background Color */}
                  <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-1.5">
                    <label className="block text-[11px] font-bold text-slate-700">Background Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={editingBanner.bg_color || '#050b1e'}
                        onChange={(e) => setEditingBanner({ ...editingBanner, bg_color: e.target.value })}
                        className="w-8 h-8 rounded border border-slate-200 cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        name="bg_color"
                        value={editingBanner.bg_color || '#050b1e'}
                        onChange={(e) => setEditingBanner({ ...editingBanner, bg_color: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-mono font-bold"
                      />
                    </div>
                  </div>

                  {/* Text Color */}
                  <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-1.5">
                    <label className="block text-[11px] font-bold text-slate-700">Text Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={editingBanner.text_color || '#ffffff'}
                        onChange={(e) => setEditingBanner({ ...editingBanner, text_color: e.target.value })}
                        className="w-8 h-8 rounded border border-slate-200 cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        name="text_color"
                        value={editingBanner.text_color || '#ffffff'}
                        onChange={(e) => setEditingBanner({ ...editingBanner, text_color: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-mono font-bold"
                      />
                    </div>
                  </div>

                  {/* Button Color */}
                  <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-1.5">
                    <label className="block text-[11px] font-bold text-slate-700">Button Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={editingBanner.button_color || '#e50914'}
                        onChange={(e) => setEditingBanner({ ...editingBanner, button_color: e.target.value })}
                        className="w-8 h-8 rounded border border-slate-200 cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        name="button_color"
                        value={editingBanner.button_color || '#e50914'}
                        onChange={(e) => setEditingBanner({ ...editingBanner, button_color: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-mono font-bold"
                      />
                    </div>
                  </div>

                  {/* Overlay Color */}
                  <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-1.5">
                    <label className="block text-[11px] font-bold text-slate-700">Overlay Color / Opacity</label>
                    <input
                      type="text"
                      name="overlay_color"
                      value={editingBanner.overlay_color || 'rgba(0,0,0,0.3)'}
                      onChange={(e) => setEditingBanner({ ...editingBanner, overlay_color: e.target.value })}
                      placeholder="rgba(0,0,0,0.3)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* 4. IMAGE UPLOAD & SIZING (ONLY IF IMAGE MODE) */}
              {bannerMode === 'image' && (
                <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 space-y-4">
                  <h4 className="text-xs font-black uppercase text-emerald-900 tracking-wider flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-emerald-600" /> Image Upload &amp; Framing
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Primary Image Upload */}
                    <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-3">
                      <label className="block text-xs font-bold text-slate-800">
                        Main Banner Artwork / Photo
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
                            className="absolute top-1.5 right-1.5 bg-red-600 text-white p-1 rounded-full text-[10px] hover:bg-red-700 cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Image Fit & Position */}
                    <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Image Fit</label>
                        <select name="image_fit" defaultValue={editingBanner.image_fit || 'contain'} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold">
                          <option value="contain">Contain (Keep entire image visible)</option>
                          <option value="cover">Cover (Fill entire banner box)</option>
                          <option value="fill">Fill (Stretch to fit box)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Image Alignment</label>
                        <select name="image_position" defaultValue={editingBanner.image_position || 'center'} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold">
                          <option value="center">Center</option>
                          <option value="top">Top</option>
                          <option value="bottom">Bottom</option>
                          <option value="left">Left</option>
                          <option value="right">Right</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. DYNAMIC BUTTONS (MULTIPLE BUTTONS WITH PRESETS) */}
              <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black uppercase text-purple-900 tracking-wider flex items-center gap-1.5">
                      <Link className="w-4 h-4 text-purple-600" /> Dynamic Action Buttons &amp; Direct URLs
                    </h4>
                    <p className="text-[10px] text-purple-700">Add multiple action buttons with custom target links and alignment</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={handleAddButton} 
                    className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Button
                  </button>
                </div>

                <div className="space-y-3">
                  {Array.isArray(editingBanner.buttons) && editingBanner.buttons.map((btn, btnIdx) => (
                    <div key={btn.id || btnIdx} className="bg-white p-3.5 rounded-xl border border-purple-200 shadow-sm space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5">
                        
                        <div className="lg:col-span-3">
                          <label className="text-[10px] font-bold text-slate-600 block mb-1">Button Text *</label>
                          <input 
                            type="text" 
                            placeholder="Button Text" 
                            value={btn.text || ''} 
                            onChange={(e) => updateElementField('buttons', btnIdx, 'text', e.target.value)} 
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-900" 
                          />
                        </div>
                        
                        <div className="lg:col-span-5 space-y-1">
                          <label className="text-[10px] font-bold text-slate-600 block mb-1">Target URL Box *</label>
                          <div className="flex gap-1">
                            <input 
                              type="text" 
                              placeholder="e.g. /offers, /ott-plans, /fiber, /mobiles" 
                              value={btn.link || ''} 
                              onChange={(e) => updateElementField('buttons', btnIdx, 'link', e.target.value)} 
                              className="flex-1 bg-slate-50 border border-purple-300 rounded-lg p-2 text-xs font-mono text-purple-900" 
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
                              <option value="/contact">Contact (/contact)</option>
                              <option value="https://wa.me/916305151531">WhatsApp Chat</option>
                            </select>
                          </div>
                        </div>

                        <div className="lg:col-span-2">
                          <label className="text-[10px] font-bold text-slate-600 block mb-1">Button Color</label>
                          <div className="flex items-center gap-1.5">
                            <input 
                              type="color" 
                              value={btn.button_color || '#e50914'} 
                              onChange={(e) => updateElementField('buttons', btnIdx, 'button_color', e.target.value)}
                              className="w-7 h-7 rounded border cursor-pointer p-0.5"
                            />
                            <span className="text-[10px] font-mono text-slate-500">{btn.button_color || '#e50914'}</span>
                          </div>
                        </div>

                        <div className="lg:col-span-2 flex items-end justify-end">
                          <button 
                            type="button" 
                            onClick={() => removeElement('buttons', btnIdx)} 
                            className="px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setEditingBanner(null)} 
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
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
