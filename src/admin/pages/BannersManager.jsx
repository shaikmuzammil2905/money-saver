import React, { useState, useMemo } from 'react';
import { 
  Image as ImageIcon, Plus, Edit3, Trash2, Power, Upload, Check, Eye, Link, Palette, 
  Sparkles, Layers, ArrowUp, ArrowDown, ExternalLink, HelpCircle, Copy, Info, Sliders, ChevronUp, ChevronDown,
  Monitor, Smartphone, Crop, Tag
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { uploadToCloudinary } from '../../services/cloudinary';
import ImageCropModal from '../../components/ImageCropModal';

const DISPLAY_LOCATIONS = [
  { value: 'home', label: 'Home Page' },
  { value: 'ott-plans', label: 'OTT Plans' },
  { value: 'fiber', label: 'Fiber Internet' },
  { value: 'mobiles', label: 'Mobiles & Gadgets' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'offers', label: 'Offers' },
  { value: 'category', label: 'Specific Category' },
  { value: 'all', label: 'All Pages' }
];

const GRADIENT_DIRECTIONS = [
  { value: 'to right', label: 'Left → Right' },
  { value: 'to bottom', label: 'Top → Bottom' },
  { value: 'to bottom right', label: 'Diagonal ↘' },
  { value: 'to bottom left', label: 'Diagonal ↙' }
];

function ColorPickerField({ label, value, onChange, defaultValue = '#ffffff' }) {
  const safeVal = value || defaultValue;
  const isHex = /^#([0-9A-Fa-f]{3}){1,2}$/i.test(safeVal);

  return (
    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5 shadow-sm">
      <label className="block text-[11px] font-bold text-slate-700">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={isHex ? safeVal : defaultValue}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0.5 shrink-0"
        />
        <input
          type="text"
          value={safeVal}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#FFFFFF"
          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-mono font-bold text-slate-800 uppercase focus:outline-none focus:border-[#008744]"
        />
      </div>
    </div>
  );
}

export default function BannersManager({ adminEmail }) {
  const { 
    banners, setBanners, 
    categories, loading,
    saveCmsItem, deleteCmsItem, updateDisplayOrder, logActivity, refreshAllData 
  } = useCMS();

  const [editingBanner, setEditingBanner] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingPrimary, setUploadingPrimary] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [activeSectionTab, setActiveSectionTab] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'hidden'
  const [bannerMode, setBannerMode] = useState('image-blur'); // 'solid' | 'image-blur' | 'image-only'
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop' or 'mobile'

  // Image Cropper Modal State
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropTargetDevice, setCropTargetDevice] = useState('pc');
  const [cropImageSrc, setCropImageSrc] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const getSectionFromKey = (key = '', location = '') => {
    const k = (key || '').toLowerCase();
    const loc = (location || '').toLowerCase();
    if (k.includes('home_main') || (loc === 'home' && !k.includes('small') && !k.includes('middle') && !k.includes('bottom'))) return 'Home Main';
    if (k.includes('home_small') || k.includes('home_middle') || k.includes('home_bottom') || loc === 'home_small') return 'Small Banners';
    if (k.includes('ott') || loc === 'ott' || loc === 'ott-plans') return 'OTT Plans';
    if (k.includes('fiber') || loc === 'fiber' || loc === 'broadband') return 'Fiber Internet';
    if (k.includes('mobile') || loc === 'mobiles' || loc === 'mobiles-gadgets') return 'Mobiles';
    if (k.includes('electronic') || loc === 'electronics') return 'Electronics';
    if (k.includes('offer') || loc === 'offers') return 'Offers';
    return 'Other';
  };

  const sortedBanners = useMemo(() => {
    const list = Array.isArray(banners) ? [...banners] : [];
    list.sort((a, b) => (Number(a.display_order) || 999) - (Number(b.display_order) || 999));
    return list;
  }, [banners]);

  const filteredBanners = useMemo(() => {
    let list = sortedBanners;
    if (activeSectionTab !== 'All') {
      list = list.filter(b => getSectionFromKey(b.banner_key, b.display_location) === activeSectionTab);
    }
    if (statusFilter === 'active') {
      list = list.filter(b => b.is_active !== false);
    } else if (statusFilter === 'hidden') {
      list = list.filter(b => b.is_active === false);
    }
    return list;
  }, [sortedBanners, activeSectionTab, statusFilter]);

  const handleToggleStatus = async (banner) => {
    try {
      const updated = { ...banner, is_active: !banner.is_active };
      await saveCmsItem('banners', updated);
      await logActivity(adminEmail, updated.is_active ? 'ENABLED' : 'DISABLED', 'Banners', banner.title_name);
      await refreshAllData();
      showToast(updated.is_active ? 'Banner Activated' : 'Banner Deactivated');
    } catch (err) {
      alert('Error toggling banner status: ' + err.message);
    }
  };

  const handleDeleteBanner = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete banner "${name}"?`)) return;
    try {
      await deleteCmsItem('banners', id);
      await logActivity(adminEmail, 'DELETED', 'Banners', name);
      await refreshAllData();
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
      await refreshAllData();
      showToast('Banner Order Updated & Synced to Website');
    } catch (err) {
      console.error('Failed to sync order:', err);
      showToast('Order saved');
    }
  };

  const handleSaveBanner = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData(e.target);

      const buttonsList = Array.isArray(editingBanner?.buttons) ? editingBanner.buttons : [];
      const targetCategories = Array.isArray(editingBanner?.target_categories) ? editingBanner.target_categories : [];

      const bgColor1 = editingBanner.bg_color || '#050b1e';
      const bgColor2 = editingBanner.bg_color_2 || bgColor1;
      const bgDirection = editingBanner.bg_direction || 'to right';

      const cleanBadge = (formData.get('badge_text') ?? editingBanner.badge_text ?? editingBanner.subheading ?? '').trim();
      const headingAlignment = editingBanner.heading_alignment || 'left';
      const cleanMode = bannerMode; // 'solid' | 'image-blur' | 'image-only'

      const payload = {
        id: editingBanner?.id,
        banner_key: editingBanner?.banner_key || `banner_${Date.now()}`,
        title_name: formData.get('title_name') || editingBanner?.title_name || 'Custom Banner',
        heading: formData.get('heading') || editingBanner?.heading || '',
        heading_color: editingBanner.heading_color || '#ffffff',
        heading_alignment: headingAlignment,
        subheading: cleanBadge,
        subheading_color: editingBanner.subheading_color || '#cbd5e1',
        badge_text: cleanBadge,
        badge_color: editingBanner.badge_color || '#ffffff',
        badge_bg_color: editingBanner.badge_bg_color || '#e50914',
        badges: cleanBadge ? [{ text: cleanBadge }] : [],
        description: formData.get('description') || editingBanner?.description || '',
        description_color: editingBanner.description_color || '#cbd5e1',
        mode: cleanMode,
        background_mode: cleanMode,
        image_url: cleanMode === 'solid' ? '' : (editingBanner.image_url || ''),
        mobile_image_url: cleanMode === 'solid' ? '' : (editingBanner.mobile_image_url || editingBanner.image_url || ''),
        image_fit: formData.get('image_fit') || 'cover',
        image_position: formData.get('image_position') || 'center',
        text_color: editingBanner.heading_color || editingBanner.text_color || '#ffffff',
        button_color: editingBanner.button_color || (buttonsList[0]?.button_color) || '#e50914',
        button_text_color: editingBanner.button_text_color || (buttonsList[0]?.text_color) || '#ffffff',
        button_border_color: editingBanner.button_border_color || (buttonsList[0]?.border_color) || 'transparent',
        bg_color: bgColor1,
        bg_color_2: bgColor2,
        bg_direction: bgDirection,
        overlay_color: editingBanner.overlay_color || 'rgba(0,0,0,0.3)',
        display_location: formData.get('display_location') || editingBanner.display_location || 'home',
        target_categories: targetCategories,
        is_active: editingBanner ? editingBanner.is_active !== false : true,
        display_order: editingBanner?.display_order !== undefined ? Number(editingBanner.display_order) : sortedBanners.length + 1,
        buttons: buttonsList,
        button_text: buttonsList.length > 0 ? buttonsList[0].text : (formData.get('button_text') || 'Explore Deals'),
        button_link: buttonsList.length > 0 ? buttonsList[0].link : (formData.get('button_link') || 'offers'),
        updated_at: new Date().toISOString()
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

  const updateButtonField = (idx, field, value) => {
    if (!editingBanner) return;
    const currentList = Array.isArray(editingBanner.buttons) ? [...editingBanner.buttons] : [];
    if (!currentList[idx]) return;
    currentList[idx] = { ...currentList[idx], [field]: value };
    setEditingBanner({ ...editingBanner, buttons: currentList });
  };

  const removeButton = (idx) => {
    if (!editingBanner) return;
    const currentList = Array.isArray(editingBanner.buttons) ? [...editingBanner.buttons] : [];
    setEditingBanner({ ...editingBanner, buttons: currentList.filter((_, i) => i !== idx) });
  };

  const handleAddButton = () => {
    const current = Array.isArray(editingBanner.buttons) ? [...editingBanner.buttons] : [];
    current.push({
      id: `btn_${Date.now()}`,
      text: 'Action Button',
      link: '/offers',
      button_color: '#e50914',
      text_color: '#ffffff',
      border_color: 'transparent',
      open_new_tab: false,
      is_active: true
    });
    setEditingBanner({ ...editingBanner, buttons: current });
  };

  const handleCategoryToggle = (catId) => {
    const current = editingBanner.target_categories || [];
    const updated = current.includes(catId)
      ? current.filter(id => id !== catId)
      : [...current, catId];
    setEditingBanner({ ...editingBanner, target_categories: updated });
  };

  const handlePrimaryImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingPrimary(true);
    try {
      const res = await uploadToCloudinary(file, 'banners');
      setEditingBanner(prev => ({ 
        ...prev, 
        image_url: res.url,
        mobile_image_url: prev.mobile_image_url || res.url 
      }));
      showToast('Banner Image Uploaded! You can now crop for PC and Mobile.');
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploadingPrimary(false);
    }
  };

  const handleOpenCrop = (targetDevice) => {
    const img = targetDevice === 'mobile' 
      ? (editingBanner.mobile_image_url || editingBanner.image_url)
      : editingBanner.image_url;
    if (!img) {
      alert('Please upload or enter an image URL first before cropping.');
      return;
    }
    setCropImageSrc(img);
    setCropTargetDevice(targetDevice);
    setCropModalOpen(true);
  };

  const handleSaveCrop = (croppedDataUrl, targetDevice) => {
    if (targetDevice === 'pc') {
      setEditingBanner(prev => ({ ...prev, image_url: croppedDataUrl }));
      showToast('PC Image Crop Saved!');
    } else {
      setEditingBanner(prev => ({ ...prev, mobile_image_url: croppedDataUrl }));
      showToast('Mobile Image Crop Saved!');
    }
  };

  const startEditing = (b) => {
    const safeBanner = { ...b };
    let initialMode = b.background_mode || b.mode;
    if (!initialMode) {
      initialMode = b.image_url ? 'image-blur' : 'solid';
    } else if (initialMode === 'color') {
      initialMode = 'solid';
    } else if (initialMode === 'image') {
      initialMode = 'image-blur';
    }
    setBannerMode(initialMode);
    safeBanner.background_mode = initialMode;
    safeBanner.mode = initialMode;
    safeBanner.heading_alignment = b.heading_alignment || 'left';

    // Individual colors fallback
    safeBanner.heading_color = b.heading_color || b.text_color || '#ffffff';
    safeBanner.subheading_color = b.subheading_color || '#cbd5e1';
    safeBanner.badge_color = b.badge_color || '#ffffff';
    safeBanner.badge_bg_color = b.badge_bg_color || '#e50914';
    safeBanner.description_color = b.description_color || b.text_color || '#cbd5e1';
    safeBanner.button_color = b.button_color || '#e50914';
    safeBanner.button_text_color = b.button_text_color || '#ffffff';
    safeBanner.button_border_color = b.button_border_color || 'transparent';

    // Buttons parsing
    if (Array.isArray(b.buttons) && b.buttons.length > 0) {
      safeBanner.buttons = b.buttons.map((btn, idx) => ({
        id: btn.id || `btn_${idx}`,
        text: btn.text || 'Explore Deals',
        link: btn.link || '/offers',
        button_color: btn.button_color || b.button_color || '#e50914',
        text_color: btn.text_color || '#ffffff',
        border_color: btn.border_color || 'transparent',
        open_new_tab: btn.open_new_tab || btn.target === '_blank',
        is_active: btn.is_active !== false
      }));
    } else if (b.button_text) {
      safeBanner.buttons = [{
        id: 'btn_1',
        text: b.button_text,
        link: b.button_link || '/offers',
        button_color: b.button_color || '#e50914',
        text_color: b.button_text_color || '#ffffff',
        border_color: b.button_border_color || 'transparent',
        open_new_tab: false,
        is_active: true
      }];
    } else {
      safeBanner.buttons = [];
    }

    safeBanner.bg_color = b.bg_color || '#050b1e';
    safeBanner.bg_color_2 = b.bg_color_2 || safeBanner.bg_color;
    safeBanner.bg_direction = b.bg_direction || 'to right';
    safeBanner.badge_text = b.badge_text || b.subheading || (Array.isArray(b.badges) && (b.badges[0]?.text || b.badges[0])) || '';
    safeBanner.subheading = safeBanner.badge_text;
    safeBanner.display_location = b.display_location || 'home';
    safeBanner.target_categories = Array.isArray(b.target_categories) ? b.target_categories : [];

    setEditingBanner(safeBanner);
  };

  const sectionTabs = ['All', 'Home Main', 'Small Banners', 'OTT Plans', 'Fiber Internet', 'Mobiles', 'Electronics', 'Offers', 'Other'];

  // Helper for Dual Color Gradient vs Solid style
  const getBannerBackgroundStyle = (color1, color2, direction) => {
    const c1 = color1 || '#050b1e';
    const c2 = color2 || c1;
    if (c1.toLowerCase() === c2.toLowerCase()) {
      return { backgroundColor: c1 };
    }
    return { background: `linear-gradient(${direction || 'to right'}, ${c1}, ${c2})` };
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
            <ImageIcon className="w-6 h-6 text-[#e50914]" /> Master Banners Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage all Banners, Small Banners, and Category Banners with dual gradient colors, PC/Mobile image cropping, and page targeting.
          </p>
        </div>
        <button
          onClick={() => startEditing({
            banner_key: `custom_${Date.now()}`,
            title_name: 'New Custom Banner',
            heading: 'SPECIAL PROMO BANNER',
            badge_text: 'LIMITED TIME DEAL',
            buttons: [{ id: 'btn_1', text: 'Shop Now', link: '/offers', button_color: '#e50914', text_color: '#ffffff', is_active: true }],
            text_color: '#ffffff',
            button_color: '#e50914',
            bg_color: '#050b1e',
            bg_color_2: '#050b1e',
            bg_direction: 'to right',
            display_location: 'home',
            overlay_color: 'rgba(0,0,0,0.3)',
            is_active: true
          })}
          className="px-4 py-2.5 rounded-xl bg-[#008744] hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Banner
        </button>
      </div>

      {/* Filter Tabs & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Section Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {sectionTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveSectionTab(tab)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeSectionTab === tab
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Status Filters: All / Active / Hidden */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl shrink-0 text-xs">
          {[
            { key: 'all', label: 'All', count: sortedBanners.length },
            { key: 'active', label: 'Active', count: sortedBanners.filter(b => b.is_active !== false).length },
            { key: 'hidden', label: 'Hidden', count: sortedBanners.filter(b => b.is_active === false).length }
          ].map(sf => (
            <button
              key={sf.key}
              onClick={() => setStatusFilter(sf.key)}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                statusFilter === sf.key
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>{sf.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                statusFilter === sf.key ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {sf.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && sortedBanners.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="font-bold text-slate-700 text-sm">Loading banners from database...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredBanners.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm space-y-3">
          <ImageIcon className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="font-black text-slate-700 text-base">No Banners Found</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No banners match the selected filter ({activeSectionTab} / {statusFilter}).
          </p>
          <button
            onClick={() => { setActiveSectionTab('All'); setStatusFilter('all'); }}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer hover:bg-slate-800 transition-colors"
          >
            Show All Banners ({sortedBanners.length})
          </button>
        </div>
      )}

      {/* Banner Cards List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredBanners.map((b, idx) => {
          const isColorMode = b.mode === 'color' || (!b.image_url && b.bg_color);
          const bgStyle = getBannerBackgroundStyle(b.bg_color, b.bg_color_2, b.bg_direction);

          return (
            <div key={b.id || b.banner_key || idx} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
              
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-white text-xs font-black flex items-center justify-center">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      {b.title_name || 'Banner'}
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                        {b.banner_key}
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Display On: <strong className="text-slate-700 capitalize">{b.display_location || 'Home'}</strong>
                    </p>
                  </div>
                </div>

                {/* Status Toggle & Order */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleMoveOrder(idx, 'UP')}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMoveOrder(idx, 'DOWN')}
                    disabled={idx === filteredBanners.length - 1}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleToggleStatus(b)}
                    className={`px-3 py-1 rounded-xl text-xs font-black border transition-all ${
                      b.is_active !== false
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-red-50 border-red-300 text-red-800'
                    }`}
                  >
                    {b.is_active !== false ? 'ACTIVE' : 'INACTIVE'}
                  </button>
                </div>
              </div>

              {/* Preview Thumbnail */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div 
                  style={bgStyle}
                  className="sm:col-span-4 h-28 rounded-xl relative overflow-hidden flex items-center justify-center p-3 border border-slate-200"
                >
                  {b.image_url ? (
                    <img src={b.image_url} alt="Banner" className="max-h-full max-w-full object-contain z-10" />
                  ) : (
                    <span className="text-xs font-bold text-white z-10 bg-black/40 px-2 py-1 rounded">
                      {b.bg_color === b.bg_color_2 ? 'Solid Color' : 'Gradient'}
                    </span>
                  )}
                  {b.overlay_color && <div className="absolute inset-0" style={{ backgroundColor: b.overlay_color }} />}
                </div>

                <div className="sm:col-span-8 text-xs text-slate-600 space-y-1.5">
                  <div><strong className="text-slate-900">Heading:</strong> {b.heading || '—'}</div>
                  <div><strong className="text-slate-900">Badge / Tag:</strong> {b.badge_text || b.subheading || '—'}</div>
                  <div>
                    <strong className="text-slate-900">Buttons:</strong> {
                      Array.isArray(b.buttons) && b.buttons.length > 0 
                        ? b.buttons.map(btn => btn.text).join(', ') 
                        : (b.button_text || 'None')
                    }
                  </div>
                  <div>
                    <strong className="text-slate-900">Background:</strong> {
                      b.bg_color === b.bg_color_2 
                        ? `Solid ${b.bg_color}` 
                        : `Gradient (${b.bg_color} → ${b.bg_color_2})`
                    }
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  onClick={() => handleDuplicateBanner(b)}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1.5 transition-colors border border-blue-200 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" /> Duplicate
                </button>
                <button
                  onClick={() => startEditing(b)}
                  className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors border border-slate-200 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-purple-600" /> Edit Banner
                </button>
                <button
                  onClick={() => handleDeleteBanner(b.id || b.banner_key, b.title_name)}
                  className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* BANNER EDIT / CREATE MODAL */}
      {editingBanner && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto pt-16 sm:pt-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl space-y-5 font-sans my-4 max-h-[90vh] overflow-y-auto text-slate-900">

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 sticky top-0 bg-white z-20">
              <div>
                <h3 className="font-black text-slate-900 text-lg">
                  Edit Banner: {editingBanner.title_name || 'Banner'}
                </h3>
                <span className="text-[11px] font-mono text-purple-600">Key: {editingBanner.banner_key}</span>
              </div>
              <button 
                onClick={() => setEditingBanner(null)} 
                type="button" 
                className="text-slate-400 hover:text-slate-700 font-bold text-xl px-2 cursor-pointer"
              >✕</button>
            </div>

            {/* Live Preview Box (Desktop & Mobile Tabs) */}
            <div className="bg-slate-950 p-4 rounded-2xl space-y-3 text-white">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-amber-400 tracking-wider">
                  Live Banner Preview
                </span>
                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
                      previewDevice === 'desktop' ? 'bg-[#008744] text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" /> Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
                      previewDevice === 'mobile' ? 'bg-[#008744] text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" /> Mobile
                  </button>
                </div>
              </div>

              {/* Preview Rendering Container */}
              <div className={`mx-auto transition-all ${previewDevice === 'mobile' ? 'max-w-xs' : 'w-full'}`}>
                {(() => {
                  const isImageOnly = bannerMode === 'image-only';
                  const isSolid = bannerMode === 'solid';
                  const currentImg = previewDevice === 'mobile' ? (editingBanner.mobile_image_url || editingBanner.image_url) : editingBanner.image_url;
                  const align = editingBanner.heading_alignment || 'left';
                  const alignClasses = align === 'center'
                    ? 'text-center items-center mx-auto'
                    : align === 'right'
                      ? 'text-right items-end ml-auto'
                      : 'text-left items-start mr-auto';
                  const btnJustify = align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start';

                  const previewStyle = isImageOnly && currentImg
                    ? {
                        backgroundImage: `url(${currentImg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: '#0f172a'
                      }
                    : getBannerBackgroundStyle(editingBanner.bg_color, editingBanner.bg_color_2, editingBanner.bg_direction);

                  return (
                    <div
                      style={previewStyle}
                      className="rounded-2xl p-5 relative overflow-hidden border border-white/10 shadow-lg min-h-[150px] flex flex-col justify-between"
                    >
                      {/* In Image+Color/Blur mode, render backdrop image with subtle blur/tint */}
                      {!isImageOnly && !isSolid && currentImg && (
                        <picture className="absolute inset-0 w-full h-full pointer-events-none">
                          {editingBanner.mobile_image_url && previewDevice === 'mobile' && (
                            <source srcSet={editingBanner.mobile_image_url} />
                          )}
                          <img 
                            src={currentImg} 
                            alt="Preview" 
                            className="w-full h-full object-cover opacity-50 filter blur-[0.5px]"
                          />
                        </picture>
                      )}

                      {!isImageOnly && editingBanner.overlay_color && (
                        <div 
                          style={{ backgroundColor: editingBanner.overlay_color }}
                          className="absolute inset-0 pointer-events-none" 
                        />
                      )}

                      {/* Text Overlay */}
                      <div className={`relative z-10 space-y-2 flex flex-col ${alignClasses}`}>
                        {editingBanner.badge_text && (
                          <span 
                            style={{
                              backgroundColor: editingBanner.badge_bg_color || '#e50914',
                              color: editingBanner.badge_color || '#ffffff'
                            }}
                            className="inline-block text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow shrink-0"
                          >
                            {editingBanner.badge_text}
                          </span>
                        )}
                        <h4 
                          style={{ color: editingBanner.heading_color || '#ffffff' }}
                          className="text-base sm:text-xl font-black leading-tight drop-shadow"
                        >
                          {editingBanner.heading || 'Banner Heading'}
                        </h4>
                        {editingBanner.description && (
                          <p 
                            style={{ color: editingBanner.description_color || editingBanner.subheading_color || 'rgba(255,255,255,0.8)' }}
                            className="text-[11px] leading-relaxed max-w-md line-clamp-2"
                          >
                            {editingBanner.description}
                          </p>
                        )}
                      </div>

                      {/* Buttons Preview */}
                      <div className={`relative z-10 pt-3 flex flex-wrap gap-2 ${btnJustify}`}>
                        {Array.isArray(editingBanner.buttons) && editingBanner.buttons.map((btn, i) => (
                          <span
                            key={i}
                            style={{ 
                              backgroundColor: btn.button_color || '#e50914', 
                              color: btn.text_color || '#ffffff',
                              border: btn.border_color ? `1px solid ${btn.border_color}` : 'none'
                            }}
                            className="px-3 py-1 rounded-lg text-xs font-black shadow-sm"
                          >
                            {btn.text || 'Action'}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-6">

              {/* 1. Placement & Targeting */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider">
                  📍 Display Location &amp; Targeting
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Display On (Page)</label>
                    <select
                      name="display_location"
                      value={editingBanner.display_location || 'home'}
                      onChange={(e) => setEditingBanner({ ...editingBanner, display_location: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold"
                    >
                      {DISPLAY_LOCATIONS.map(loc => (
                        <option key={loc.value} value={loc.value}>{loc.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Banner Title Name (Admin Internal)</label>
                    <input
                      type="text"
                      name="title_name"
                      required
                      value={editingBanner.title_name || ''}
                      onChange={(e) => setEditingBanner({ ...editingBanner, title_name: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold"
                    />
                  </div>
                </div>

                {/* Category Targeting Checkboxes */}
                {editingBanner.display_location === 'category' && (
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <label className="block text-xs font-bold text-slate-700">Select Target Categories:</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto">
                      {(categories || []).filter(c => c.is_active !== false).map(cat => {
                        const catId = String(cat.id || cat.slug || cat.name);
                        const isChecked = (editingBanner.target_categories || []).includes(catId);
                        return (
                          <label key={catId} className="flex items-center gap-2 bg-white border border-slate-200 p-2 rounded-lg cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleCategoryToggle(catId)}
                              className="accent-[#008744]"
                            />
                            <span className="text-xs font-medium text-slate-700 truncate">{cat.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Banner Background Mode (3 Clear Modes) */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" /> Banner Background Mode
                  </h4>
                  <span className="text-[11px] font-bold text-slate-500">
                    {bannerMode === 'solid' ? 'Mode: Solid Color' : bannerMode === 'image-only' ? 'Mode: Image Only' : 'Mode: Image + Color/Blur'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setBannerMode('solid');
                      setEditingBanner({ ...editingBanner, background_mode: 'solid', mode: 'solid' });
                    }}
                    className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      bannerMode === 'solid'
                        ? 'border-[#008744] bg-emerald-50 text-emerald-950 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <input type="radio" name="bg_mode_radio" checked={bannerMode === 'solid'} onChange={() => {}} className="accent-[#008744]" />
                      <span className="text-xs font-black">Solid Color</span>
                    </div>
                    <p className="text-[10px] text-slate-500">Clean solid or gradient backdrop without artwork image</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setBannerMode('image-blur');
                      setEditingBanner({ ...editingBanner, background_mode: 'image-blur', mode: 'image-blur' });
                    }}
                    className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      bannerMode === 'image-blur'
                        ? 'border-[#008744] bg-emerald-50 text-emerald-950 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <input type="radio" name="bg_mode_radio" checked={bannerMode === 'image-blur'} onChange={() => {}} className="accent-[#008744]" />
                      <span className="text-xs font-black">Image + Color/Blur</span>
                    </div>
                    <p className="text-[10px] text-slate-500">Uploaded artwork layered with tinted color backdrop</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setBannerMode('image-only');
                      setEditingBanner({ ...editingBanner, background_mode: 'image-only', mode: 'image-only' });
                    }}
                    className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      bannerMode === 'image-only'
                        ? 'border-[#008744] bg-emerald-50 text-emerald-950 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <input type="radio" name="bg_mode_radio" checked={bannerMode === 'image-only'} onChange={() => {}} className="accent-[#008744]" />
                      <span className="text-xs font-black">Image Only</span>
                    </div>
                    <p className="text-[10px] text-slate-500">Direct uploaded image banner, no blur behind, no extra tint</p>
                  </button>
                </div>
              </div>

              {/* 3. Heading & Content Alignment */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider">
                    📐 Heading &amp; Content Alignment
                  </h4>
                  <span className="text-[11px] font-bold text-slate-500 capitalize">
                    {editingBanner.heading_alignment || 'left'} Aligned
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'left', label: 'Left' },
                    { value: 'center', label: 'Center' },
                    { value: 'right', label: 'Right' }
                  ].map(al => (
                    <button
                      key={al.value}
                      type="button"
                      onClick={() => setEditingBanner({ ...editingBanner, heading_alignment: al.value })}
                      className={`py-2 px-3 rounded-xl font-black text-xs transition-all border cursor-pointer ${
                        (editingBanner.heading_alignment || 'left') === al.value
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {al.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Text Content & Single Configurable Subheading / Badge */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider">
                  📝 Content &amp; Individual Text Colors
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Subheading / Badge Text (Leave blank to hide badge)
                    </label>
                    <input
                      type="text"
                      name="badge_text"
                      value={editingBanner.badge_text || ''}
                      onChange={(e) => setEditingBanner({ ...editingBanner, badge_text: e.target.value, subheading: e.target.value })}
                      placeholder="e.g. EXCLUSIVE DEALS or BIG SAVINGS!"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Heading / Main Title *</label>
                    <input
                      type="text"
                      name="heading"
                      required
                      value={editingBanner.heading || ''}
                      onChange={(e) => setEditingBanner({ ...editingBanner, heading: e.target.value })}
                      placeholder="e.g. PREMIUM DIGITAL SUBSCRIPTIONS"
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Description / Subtitle</label>
                    <textarea
                      name="description"
                      rows="2"
                      value={editingBanner.description || ''}
                      onChange={(e) => setEditingBanner({ ...editingBanner, description: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs"
                    />
                  </div>
                </div>

                {/* Individual Text Color Selectors */}
                <div className="pt-3 border-t border-slate-200 space-y-2">
                  <h5 className="text-[11px] font-black uppercase text-slate-600 tracking-wider">
                    🎨 Individual Text Element Colors
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <ColorPickerField
                      label="Heading Text Color"
                      value={editingBanner.heading_color || '#ffffff'}
                      onChange={(val) => setEditingBanner({ ...editingBanner, heading_color: val })}
                      defaultValue="#ffffff"
                    />
                    <ColorPickerField
                      label="Subheading / Desc Color"
                      value={editingBanner.description_color || editingBanner.subheading_color || '#cbd5e1'}
                      onChange={(val) => setEditingBanner({ ...editingBanner, description_color: val, subheading_color: val })}
                      defaultValue="#cbd5e1"
                    />
                    <ColorPickerField
                      label="Badge Text Color"
                      value={editingBanner.badge_color || '#ffffff'}
                      onChange={(val) => setEditingBanner({ ...editingBanner, badge_color: val })}
                      defaultValue="#ffffff"
                    />
                    <ColorPickerField
                      label="Badge Background Color"
                      value={editingBanner.badge_bg_color || '#e50914'}
                      onChange={(val) => setEditingBanner({ ...editingBanner, badge_bg_color: val })}
                      defaultValue="#e50914"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Dual Background Colors (Solid vs Gradient) */}
              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-4">
                <h4 className="text-xs font-black uppercase text-amber-950 tracking-wider flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-amber-600" /> Dual Background Colors (Solid if same, Gradient if different)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <ColorPickerField
                    label="Background Color 1"
                    value={editingBanner.bg_color || '#050b1e'}
                    onChange={(val) => setEditingBanner({ ...editingBanner, bg_color: val })}
                    defaultValue="#050b1e"
                  />
                  <ColorPickerField
                    label="Background Color 2"
                    value={editingBanner.bg_color_2 || editingBanner.bg_color || '#050b1e'}
                    onChange={(val) => setEditingBanner({ ...editingBanner, bg_color_2: val })}
                    defaultValue="#050b1e"
                  />
                  <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-1.5">
                    <label className="block text-[11px] font-bold text-slate-700">Gradient Direction</label>
                    <select
                      value={editingBanner.bg_direction || 'to right'}
                      onChange={(e) => setEditingBanner({ ...editingBanner, bg_direction: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold"
                    >
                      {GRADIENT_DIRECTIONS.map(dir => (
                        <option key={dir.value} value={dir.value}>{dir.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="text-[11px] text-amber-900 font-semibold bg-amber-100/70 p-2 rounded-xl">
                  {editingBanner.bg_color === editingBanner.bg_color_2
                    ? '✨ Both colors match — rendering as a SINGLE SOLID COLOR.'
                    : `✨ Rendering as a smooth linear-gradient (${editingBanner.bg_color} to ${editingBanner.bg_color_2}).`}
                </div>
              </div>

              {/* 4. Image Upload & PC/Mobile Cropping */}
              <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-emerald-950 tracking-wider flex items-center gap-1.5">
                    <Crop className="w-4 h-4 text-emerald-600" /> Banner Image &amp; Artwork Upload
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenCrop('pc')}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-slate-800 transition-all cursor-pointer"
                    >
                      <Monitor className="w-3.5 h-3.5 text-sky-400" /> Crop for PC
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenCrop('mobile')}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-slate-800 transition-all cursor-pointer"
                    >
                      <Smartphone className="w-3.5 h-3.5 text-emerald-400" /> Crop for Mobile
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* PC / Desktop Image */}
                  <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                        <Monitor className="w-3.5 h-3.5 text-slate-500" /> Upload Banner Image (PC)
                      </label>
                      <label className="px-2.5 py-1 bg-[#008744] hover:bg-emerald-600 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer">
                        <Upload className="w-3 h-3" /> {uploadingPrimary ? 'Uploading...' : 'Upload Image'}
                        <input type="file" accept="image/*" onChange={handlePrimaryImageUpload} className="hidden" />
                      </label>
                    </div>

                    <input
                      type="text"
                      value={editingBanner.image_url || ''}
                      onChange={(e) => setEditingBanner({ ...editingBanner, image_url: e.target.value })}
                      placeholder="PC Image URL"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono"
                    />

                    {editingBanner.image_url && (
                      <div className="relative h-24 bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center p-1 border">
                        <img src={editingBanner.image_url} alt="PC Banner" className="max-h-full max-w-full object-contain" />
                        <button
                          type="button"
                          onClick={() => handleOpenCrop('pc')}
                          className="absolute bottom-1.5 right-1.5 bg-black/70 hover:bg-black text-white px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Crop className="w-3 h-3" /> Adjust PC Crop
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Mobile Image */}
                  <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                        <Smartphone className="w-3.5 h-3.5 text-slate-500" /> Mobile Banner Image
                      </label>
                      <button
                        type="button"
                        onClick={() => handleOpenCrop('mobile')}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                      >
                        <Crop className="w-3 h-3" /> Crop from PC Image
                      </button>
                    </div>

                    <input
                      type="text"
                      value={editingBanner.mobile_image_url || ''}
                      onChange={(e) => setEditingBanner({ ...editingBanner, mobile_image_url: e.target.value })}
                      placeholder="Mobile Image URL (Fallback uses PC)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono"
                    />

                    {editingBanner.mobile_image_url && (
                      <div className="relative h-24 bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center p-1 border">
                        <img src={editingBanner.mobile_image_url} alt="Mobile Banner" className="max-h-full max-w-full object-contain" />
                        <button
                          type="button"
                          onClick={() => handleOpenCrop('mobile')}
                          className="absolute bottom-1.5 right-1.5 bg-black/70 hover:bg-black text-white px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Crop className="w-3 h-3" /> Adjust Mobile Crop
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 5. Independent Buttons Configuration */}
              <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black uppercase text-purple-950 tracking-wider flex items-center gap-1.5">
                      <Link className="w-4 h-4 text-purple-600" /> Action Buttons (Individual Colors, Links &amp; Borders)
                    </h4>
                    <p className="text-[11px] text-purple-800">
                      Each button has independent text, URL, background color, text color, and border color.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddButton}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add New Button
                  </button>
                </div>

                <div className="space-y-4">
                  {Array.isArray(editingBanner.buttons) && editingBanner.buttons.map((btn, btnIdx) => (
                    <div key={btn.id || btnIdx} className="bg-white p-4 rounded-2xl border border-purple-200 shadow-sm space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                        <div className="sm:col-span-4">
                          <label className="text-[10px] font-bold text-slate-600 block mb-1">Button {btnIdx + 1} Label *</label>
                          <input
                            type="text"
                            value={btn.text || ''}
                            onChange={(e) => updateButtonField(btnIdx, 'text', e.target.value)}
                            placeholder="e.g. Explore Deals"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-bold"
                          />
                        </div>

                        <div className="sm:col-span-6">
                          <label className="text-[10px] font-bold text-slate-600 block mb-1">Target URL / Route / WhatsApp Link *</label>
                          <input
                            type="text"
                            value={btn.link || ''}
                            onChange={(e) => updateButtonField(btnIdx, 'link', e.target.value)}
                            placeholder="e.g. /offers, /ott-plans, https://wa.me/916305151531"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-mono"
                          />
                        </div>

                        <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-2">
                          <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={btn.open_new_tab || btn.target === '_blank'}
                              onChange={(e) => updateButtonField(btnIdx, 'open_new_tab', e.target.checked)}
                              className="accent-purple-600"
                            />
                            <span>New Tab</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => removeButton(btnIdx)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Remove button"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Button Colors: Bg, Text, Border */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
                        <ColorPickerField
                          label="Button Background Color"
                          value={btn.button_color || '#e50914'}
                          onChange={(val) => updateButtonField(btnIdx, 'button_color', val)}
                          defaultValue="#e50914"
                        />
                        <ColorPickerField
                          label="Button Text Color"
                          value={btn.text_color || '#ffffff'}
                          onChange={(val) => updateButtonField(btnIdx, 'text_color', val)}
                          defaultValue="#ffffff"
                        />
                        <ColorPickerField
                          label="Button Border Color"
                          value={btn.border_color || 'transparent'}
                          onChange={(val) => updateButtonField(btnIdx, 'border_color', val)}
                          defaultValue="transparent"
                        />
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

      {/* Image Crop Modal */}
      <ImageCropModal
        isOpen={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
        imageUrl={cropImageSrc}
        initialTarget={cropTargetDevice}
        onSaveCrop={handleSaveCrop}
      />

    </div>
  );
}
