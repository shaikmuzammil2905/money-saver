import React, { useState } from 'react';
import { 
  Home, Image as ImageIcon, ArrowUp, ArrowDown, Power, Edit3, Trash2, Plus, Upload, Check, AlertCircle, Phone, FileText, Layers, ListOrdered, ChevronRight 
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { uploadToCloudinary } from '../../services/cloudinary';
import { DEFAULT_HOME_SECTIONS } from '../../services/cmsService';

// Error Boundary wrapper to prevent Home Page Builder from showing a blank screen if any runtime error occurs
class HomePageErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("HomePageManager Error Boundary Caught Exception:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4 my-6 font-sans">
          <div className="w-12 h-12 rounded-full bg-red-950/80 border border-red-800 text-red-400 flex items-center justify-center mx-auto shadow-lg">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">Home Page Builder Loaded with Recovery Mode</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {this.state.error?.message || "An issue occurred while parsing section configuration."}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
            >
              Reset View
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xl bg-[#008744] hover:bg-emerald-600 text-white font-bold text-xs shadow-md"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function HomePageManagerContent({ adminEmail }) {
  const cmsContext = useCMS() || {};
  
  // Safe Array Extractors
  const homeItems = Array.isArray(cmsContext.homeItems) ? cmsContext.homeItems : [];
  const setHomeItems = cmsContext.setHomeItems || (() => {});
  const homeSections = Array.isArray(cmsContext.homeSections) ? cmsContext.homeSections : [];
  const setHomeSections = cmsContext.setHomeSections || (() => {});
  const themes = Array.isArray(cmsContext.themes) ? cmsContext.themes : [];
  const banners = Array.isArray(cmsContext.banners) ? cmsContext.banners : [];
  const homeSlides = Array.isArray(cmsContext.homeSlides) ? cmsContext.homeSlides : [];
  const setHomeSlides = cmsContext.setHomeSlides || (() => {});
  const homeSteps = Array.isArray(cmsContext.homeSteps) ? cmsContext.homeSteps : [];
  const setHomeSteps = cmsContext.setHomeSteps || (() => {});
  const contactDetails = cmsContext.contactDetails || {};
  const setContactDetails = cmsContext.setContactDetails || (() => {});
  const footerLinks = Array.isArray(cmsContext.footerLinks) ? cmsContext.footerLinks : [];
  const setFooterLinks = cmsContext.setFooterLinks || (() => {});

  const saveCmsItem = cmsContext.saveCmsItem || (async () => {});
  const deleteCmsItem = cmsContext.deleteCmsItem || (async () => {});
  const updateDisplayOrder = cmsContext.updateDisplayOrder || (async () => {});
  const logActivity = cmsContext.logActivity || (async () => {});
  const refreshAllData = cmsContext.refreshAllData || (() => {});

  const [activeSubTab, setActiveSubTab] = useState('builder'); // 'builder', 'items', '2nd-slide', 'steps', 'contact', 'footer'
  const [editingBox, setEditingBox] = useState(null);

  // Modals & Form states
  const [editingItem, setEditingItem] = useState(null);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [editingStep, setEditingStep] = useState(null);
  const [editingFooterLink, setEditingFooterLink] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // --- HOME ITEMS HANDLERS ---
  const handleToggleItemStatus = async (item) => {
    try {
      const updated = { ...item, is_active: !item.is_active };
      await saveCmsItem('homepage_items', updated);
      await logActivity(adminEmail, updated.is_active ? 'ENABLED' : 'DISABLED', 'Home Items', item.title);
      refreshAllData();
      showToast(updated.is_active ? 'Item Enabled' : 'Item Disabled');
    } catch (err) {
      alert('Error toggling status: ' + err.message);
    }
  };

  const handleDeleteItem = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await deleteCmsItem('homepage_items', id);
      await logActivity(adminEmail, 'DELETED', 'Home Items', title);
      refreshAllData();
      showToast('Deleted successfully.');
    } catch (err) {
      alert('Error deleting item: ' + err.message);
    }
  };

  const handleMoveItem = async (index, direction) => {
    const newItems = [...homeItems];
    const targetIdx = direction === 'UP' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;

    setHomeItems(newItems);
    await updateDisplayOrder('homepage_items', newItems);
    await logActivity(adminEmail, 'REORDERED', 'Home Items');
    showToast('Reordered successfully.');
  };

  const handleSaveHomeItemForm = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData(e.target);
      const payload = {
        id: editingItem?.id,
        title: formData.get('title'),
        short_description: formData.get('short_description'),
        image_url: formData.get('image_url'),
        price: formData.get('price') ? parseFloat(formData.get('price')) : null,
        original_price: formData.get('original_price') ? parseFloat(formData.get('original_price')) : null,
        discount: formData.get('discount'),
        link_url: formData.get('link_url'),
        badge: formData.get('badge'),
        category: formData.get('category'),
        is_active: editingItem ? editingItem.is_active : true,
        display_order: editingItem ? editingItem.display_order : homeItems.length + 1
      };

      await saveCmsItem('homepage_items', payload);
      await logActivity(adminEmail, editingItem ? 'EDITED' : 'ADDED', 'Home Items', payload.title);
      refreshAllData();
      setEditingItem(null);
      setIsQuickAddOpen(false);
      showToast(editingItem ? 'Updated successfully.' : 'Item Added Successfully');
    } catch (err) {
      alert('Error saving home item: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // --- 2ND SLIDE HANDLERS ---
  const secondSlide = homeSlides.find(s => s.slide_key === 'second_slide') || {
    slide_key: 'second_slide',
    heading: 'Special OTT Combo Bundles',
    description: 'Save up to 75% on OTT subscriptions!',
    button_text: 'Explore Offers',
    button_link: 'offers',
    image_url: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=1200&auto=format&fit=crop&q=80',
    is_active: true
  };

  const handleSaveSecondSlide = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData(e.target);
      const payload = {
        id: secondSlide.id,
        slide_key: 'second_slide',
        heading: formData.get('heading'),
        description: formData.get('description'),
        button_text: formData.get('button_text'),
        button_link: formData.get('button_link'),
        image_url: formData.get('image_url'),
        is_active: formData.get('is_active') === 'true'
      };

      await saveCmsItem('homepage_slides', payload);
      await logActivity(adminEmail, 'UPDATED', 'Home 2nd Slide', payload.heading);
      refreshAllData();
      showToast('2nd Slide Updated Successfully.');
    } catch (err) {
      alert('Error saving slide: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // --- EASY STEP GUIDE HANDLERS ---
  const handleSaveStep = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData(e.target);
      const payload = {
        id: editingStep?.id,
        step_number: parseInt(formData.get('step_number') || 1),
        title: formData.get('title'),
        description: formData.get('description'),
        icon_name: formData.get('icon_name') || 'HelpCircle',
        image_url: formData.get('image_url'),
        is_active: editingStep ? editingStep.is_active : true,
        display_order: editingStep ? editingStep.display_order : homeSteps.length + 1
      };

      await saveCmsItem('homepage_steps', payload);
      await logActivity(adminEmail, editingStep ? 'EDITED' : 'ADDED', 'Easy Step Guide', payload.title);
      refreshAllData();
      setEditingStep(null);
      showToast('Step Saved Successfully.');
    } catch (err) {
      alert('Error saving step: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStep = async (id, title) => {
    if (!window.confirm(`Delete step "${title}"?`)) return;
    try {
      await deleteCmsItem('homepage_steps', id);
      await logActivity(adminEmail, 'DELETED', 'Easy Step Guide', title);
      refreshAllData();
      showToast('Deleted successfully.');
    } catch (err) {
      alert('Error deleting step: ' + err.message);
    }
  };

  // --- CONTACT DETAILS HANDLERS ---
  const handleSaveContactDetails = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData(e.target);
      const payload = {
        id: contactDetails?.id,
        business_name: formData.get('business_name'),
        phone: formData.get('phone'),
        secondary_phone: formData.get('secondary_phone'),
        whatsapp: formData.get('whatsapp'),
        secondary_whatsapp: formData.get('secondary_whatsapp'),
        email: formData.get('email'),
        address: formData.get('address'),
        city: formData.get('city'),
        state: formData.get('state')
      };

      await saveCmsItem('contact_details', payload);
      await logActivity(adminEmail, 'UPDATED', 'Contact Details');
      refreshAllData();
      showToast('Contact Details Updated Successfully.');
    } catch (err) {
      alert('Error updating contact details: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // --- FOOTER LINKS HANDLERS ---
  const handleSaveFooterLink = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData(e.target);
      const payload = {
        id: editingFooterLink?.id,
        section_name: formData.get('section_name'),
        heading: formData.get('section_name'),
        link_text: formData.get('link_text'),
        link_url: formData.get('link_url'),
        is_active: editingFooterLink ? editingFooterLink.is_active : true,
        display_order: editingFooterLink ? editingFooterLink.display_order : footerLinks.length + 1
      };

      await saveCmsItem('footer_links', payload);
      await logActivity(adminEmail, editingFooterLink ? 'EDITED' : 'ADDED', 'Footer Links', payload.link_text);
      refreshAllData();
      setEditingFooterLink(null);
      showToast('Footer Link Saved.');
    } catch (err) {
      alert('Error saving footer link: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Image Upload Handler helper for Forms
  const handleImageUploadInput = async (e, inputId) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const result = await uploadToCloudinary(file, 'homepage_assets');
      const input = document.getElementById(inputId);
      if (input) {
        input.value = result.url;
      }
      showToast('Image uploaded to Cloudinary.');
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  // --- HOME PAGE BUILDER (BOX SYSTEM) HANDLERS ---
  const handleMoveSection = async (index, direction) => {
    const newSections = [...homeSections];
    const targetIdx = direction === 'UP' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newSections.length) return;

    const temp = newSections[index];
    newSections[index] = newSections[targetIdx];
    newSections[targetIdx] = temp;

    setHomeSections(newSections);
    await updateDisplayOrder('home_sections', newSections, 'position');
    await logActivity(adminEmail, 'REORDERED', 'Home Page Builder');
    showToast('Home Page Section Order Saved to Supabase.');
  };

  const handleToggleSectionStatus = async (sec) => {
    try {
      const updated = { ...sec, is_active: !sec.is_active };
      await saveCmsItem('home_sections', updated);
      await logActivity(adminEmail, updated.is_active ? 'ENABLED' : 'DISABLED', 'Home Page Builder', sec.title_label || sec.box_key);
      refreshAllData();
      showToast(updated.is_active ? 'Section Enabled' : 'Section Hidden');
    } catch (err) {
      alert('Error updating section: ' + err.message);
    }
  };

  const handleDeleteSection = async (id, label) => {
    if (!window.confirm(`Delete Home Page section "${label}"?`)) return;
    try {
      await deleteCmsItem('home_sections', id);
      await logActivity(adminEmail, 'DELETED', 'Home Page Builder', label);
      refreshAllData();
      showToast('Section Removed from Home Page.');
    } catch (err) {
      alert('Error deleting section: ' + err.message);
    }
  };

  const handleSaveSectionForm = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData(e.target);
      const payload = {
        id: editingBox?.id,
        box_key: editingBox?.box_key || `box_${Date.now()}`,
        title_label: formData.get('title_label') || 'Home Page Section',
        section_type: formData.get('section_type'),
        content_id: formData.get('content_id') || '',
        position: editingBox?.position || homeSections.length + 1,
        is_active: editingBox ? editingBox.is_active !== false : true
      };

      await saveCmsItem('home_sections', payload);
      await logActivity(adminEmail, editingBox?.id ? 'EDITED' : 'ADDED', 'Home Page Builder', payload.title_label);
      refreshAllData();
      setEditingBox(null);
      showToast('Section Configuration Saved to Supabase.');
    } catch (err) {
      alert('Error saving section box: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleInitDefaultHomeSections = async () => {
    setSaving(true);
    try {
      for (const sec of DEFAULT_HOME_SECTIONS) {
        await saveCmsItem('home_sections', sec);
      }
      await logActivity(adminEmail, 'INITIALIZED', 'Home Page Builder', 'Default 8 Home Sections');
      refreshAllData();
      showToast('Initialized All 8 Default Home Sections in Supabase!');
    } catch (err) {
      alert('Error initializing home sections: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#008744] text-white px-5 py-3 rounded-xl shadow-2xl font-bold text-xs flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" /> {toastMsg}
        </div>
      )}

      {/* Top Header & Sub Navigation Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Home className="w-6 h-6 text-[#e50914]" /> Home Page Builder &amp; CMS
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Control the structure, section ordering, themes, banners, and home items dynamically on Supabase.
            </p>
          </div>
        </div>

        {/* Sub Tab Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 no-scrollbar">
          {[
            { id: 'builder', label: 'Home Page Builder (Box Order)', icon: Home },
            { id: 'items', label: 'Home Items', icon: Layers },
            { id: '2nd-slide', label: '2nd Slide Banner', icon: ImageIcon },
            { id: 'steps', label: 'Easy Step Guide', icon: ListOrdered },
            { id: 'contact', label: 'Contact Details', icon: Phone },
            { id: 'footer', label: 'Footer Links', icon: FileText }
          ].map(tab => {
            const IconComp = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`px-4 py-2 rounded-xl font-bold text-xs shrink-0 flex items-center gap-2 transition-all ${
                  activeSubTab === tab.id
                    ? 'bg-[#008744] text-white shadow-lg'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <IconComp className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================================================== */}
      {/* SUB TAB 0: HOME PAGE BUILDER (BOX SYSTEM) */}
      {/* ================================================== */}
      {activeSubTab === 'builder' && (
        <div className="space-y-6 font-sans">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-white">Home Page Section Boxes ({homeSections.length} Boxes)</h2>
              <p className="text-xs text-slate-400 mt-0.5">Move sections Up/Down to change Public Website Home Page layout order.</p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={handleInitDefaultHomeSections}
                disabled={saving}
                className="px-3.5 py-2.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-800 font-bold text-xs flex items-center gap-1.5 shadow-md"
                title="Initialize default 8 section boxes into database"
              >
                <Layers className="w-4 h-4 text-purple-400" /> Init Default 8 Boxes
              </button>
              <button
                onClick={() => setEditingBox({
                  box_key: `box_${homeSections.length + 1}`,
                  title_label: `Home Section Box ${homeSections.length + 1}`,
                  section_type: 'banner',
                  content_id: 'home_main_1',
                  position: homeSections.length + 1,
                  is_active: true
                })}
                className="px-4 py-2.5 rounded-xl bg-[#008744] hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" /> Add Section Box
              </button>
            </div>
          </div>

          {homeSections.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 sm:p-12 text-center space-y-5 shadow-xl">
              <Home className="w-14 h-14 text-slate-600 mx-auto" />
              <div>
                <h3 className="font-extrabold text-white text-base sm:text-lg">No Home Page Section Boxes Found</h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mt-1">
                  Create section boxes or initialize default section boxes to structure your Home Page layout.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleInitDefaultHomeSections}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg"
                >
                  <Layers className="w-4 h-4" /> Initialize All 8 Default Boxes
                </button>
                <button
                  onClick={() => setEditingBox({
                    box_key: `box_1`,
                    title_label: `Home Section Box 1`,
                    section_type: 'banner',
                    content_id: 'home_main_1',
                    position: 1,
                    is_active: true
                  })}
                  className="px-5 py-2.5 rounded-xl bg-[#008744] hover:bg-emerald-600 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg"
                >
                  <Plus className="w-4 h-4" /> Add Custom Box
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {homeSections.map((sec, idx) => (
                <div key={sec.id || sec.box_key || idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
                  
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black flex items-center justify-center text-sm shadow-md shrink-0">
                      Box {idx + 1}
                    </div>

                    <div>
                      <h3 className="font-extrabold text-white text-base">{sec.title_label || sec.box_key}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                        <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-bold border border-purple-800 uppercase text-[10px]">
                          Type: {sec.section_type}
                        </span>
                        {sec.content_id && (
                          <span className="px-2 py-0.5 rounded bg-slate-950 text-amber-300 font-mono text-[10px] border border-slate-800">
                            Content ID: {sec.content_id}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-2 pt-3 sm:pt-0 border-t sm:border-0 border-slate-800">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveSection(idx, 'UP')}
                        disabled={idx === 0}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white"
                        title="Move Up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMoveSection(idx, 'DOWN')}
                        disabled={idx === homeSections.length - 1}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white"
                        title="Move Down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleSectionStatus(sec)}
                        className={`px-3 py-2 rounded-xl text-xs font-black border transition-all ${
                          sec.is_active !== false ? 'bg-emerald-950 border-emerald-800 text-emerald-300' : 'bg-red-950 border-red-800 text-red-300'
                        }`}
                      >
                        {sec.is_active !== false ? 'VISIBLE' : 'HIDDEN'}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingBox(sec)}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-purple-400" /> Edit Box
                      </button>
                      <button
                        onClick={() => handleDeleteSection(sec.id, sec.title_label || sec.box_key)}
                        className="p-2 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

          {/* EDIT BOX MODAL */}
          {editingBox && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto pt-16 sm:pt-4 font-sans">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-4 sm:p-6 shadow-2xl space-y-4 my-2 max-h-[85vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="font-black text-white text-base">
                    Edit {editingBox.title_label || 'Section Box'}
                  </h3>
                  <button onClick={() => setEditingBox(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
                </div>

                <form onSubmit={handleSaveSectionForm} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Section Box Title / Label *</label>
                    <input
                      type="text"
                      name="title_label"
                      required
                      defaultValue={editingBox.title_label || ''}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Select Section Type *</label>
                    <select
                      name="section_type"
                      defaultValue={editingBox.section_type || 'banner'}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs font-bold"
                    >
                      <option value="banner">Banner</option>
                      <option value="categories">Categories Cards</option>
                      <option value="theme">Selectable Theme (Visual Builder)</option>
                      <option value="featured_deals">Featured Deals / Products</option>
                      <option value="steps">How To Order Guide</option>
                      <option value="why_choose_us">Why Choose Us</option>
                      <option value="guidance">Need Help / Guidance Support</option>
                      <option value="notices">Notice Alert Banner</option>
                      <option value="custom">Custom Section</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Select Content (Banner or Theme)</label>
                    <input
                      type="text"
                      name="content_id"
                      defaultValue={editingBox.content_id || ''}
                      placeholder="e.g. home_main_1, home_small_1, theme_1..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs font-mono"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Available Banners: <code className="text-amber-300">home_main_1, home_small_1, home_middle_big, offers_top</code>
                      <br />
                      Available Themes: <code className="text-pink-300">theme_1, theme_2</code> (or any created theme key)
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setEditingBox(null)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2 rounded-xl bg-[#008744] hover:bg-emerald-600 text-white text-xs font-bold shadow-lg"
                    >
                      Save Section Box
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================================================== */}
      {/* SUB TAB 1: HOME ITEMS */}
      {/* ================================================== */}
      {activeSubTab === 'items' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Homepage Items ({homeItems.length})</h2>
            <button
              onClick={() => setEditingItem({})}
              className="px-4 py-2 rounded-xl bg-[#008744] hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" /> Add Home Item
            </button>
          </div>

          {homeItems.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-sm">
              No home items found. Click "Add Home Item" to create one.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {homeItems.map((item, idx) => (
                <div key={item.id || idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl font-sans">
                  <div className="flex items-start gap-3">
                    <img src={item.image_url} alt={item.title} className="w-16 h-16 rounded-xl object-cover border border-slate-800 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-extrabold text-white text-sm truncate">{item.title}</h3>
                      <p className="text-xs text-slate-400 truncate">{item.short_description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-extrabold text-[#008744]">₹{item.price}</span>
                        {item.original_price && <span className="text-[10px] text-slate-500 line-through">₹{item.original_price}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveItem(idx, 'UP')}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg bg-slate-800 text-white disabled:opacity-30"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveItem(idx, 'DOWN')}
                        disabled={idx === homeItems.length - 1}
                        className="p-1.5 rounded-lg bg-slate-800 text-white disabled:opacity-30"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleToggleItemStatus(item)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          item.is_active ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-red-950 text-red-300 border border-red-800'
                        }`}
                      >
                        {item.is_active ? 'Active' : 'Disabled'}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditingItem(item)} className="p-1.5 rounded-lg bg-slate-800 text-white hover:bg-slate-700">
                        <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                      </button>
                      <button onClick={() => handleDeleteItem(item.id, item.title)} className="p-1.5 rounded-lg bg-red-950 text-red-300 hover:bg-red-900 border border-red-800">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================================================== */}
      {/* SUB TAB 2: 2ND SLIDE BANNER */}
      {/* ================================================== */}
      {activeSubTab === '2nd-slide' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl max-w-2xl font-sans">
          <h2 className="text-lg font-bold text-white mb-4">Edit 2nd Slide Banner Configuration</h2>
          <form onSubmit={handleSaveSecondSlide} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Banner Heading</label>
              <input type="text" name="heading" defaultValue={secondSlide.heading} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
              <input type="text" name="description" defaultValue={secondSlide.description} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Button Text</label>
                <input type="text" name="button_text" defaultValue={secondSlide.button_text} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Button Link</label>
                <input type="text" name="button_link" defaultValue={secondSlide.button_link} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Image URL</label>
              <div className="flex gap-2">
                <input type="text" name="image_url" id="slide_image_url" defaultValue={secondSlide.image_url} className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs" />
                <label className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1">
                  <Upload className="w-4 h-4" /> Upload
                  <input type="file" accept="image/*" onChange={(e) => handleImageUploadInput(e, 'slide_image_url')} className="hidden" />
                </label>
              </div>
            </div>
            <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl bg-[#008744] hover:bg-emerald-600 text-white font-bold text-xs shadow-md">
              Save Slide Settings
            </button>
          </form>
        </div>
      )}

      {/* ================================================== */}
      {/* SUB TAB 3: EASY STEP GUIDE */}
      {/* ================================================== */}
      {activeSubTab === 'steps' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Easy Step Guide ({homeSteps.length} Steps)</h2>
            <button
              onClick={() => setEditingStep({ step_number: homeSteps.length + 1 })}
              className="px-4 py-2 rounded-xl bg-[#008744] hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" /> Add Step
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {homeSteps.map((step) => (
              <div key={step.id || step.step_number} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl font-sans">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-[#e50914] text-white font-black flex items-center justify-center text-xs">
                    {step.step_number}
                  </span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditingStep(step)} className="p-1.5 rounded-lg bg-slate-800 text-white">
                      <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                    </button>
                    <button onClick={() => handleDeleteStep(step.id, step.title)} className="p-1.5 rounded-lg bg-red-950 text-red-300 border border-red-800">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <h3 className="font-extrabold text-white text-base">{step.title}</h3>
                <p className="text-xs text-slate-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* SUB TAB 4: CONTACT DETAILS */}
      {/* ================================================== */}
      {activeSubTab === 'contact' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl max-w-2xl font-sans">
          <h2 className="text-lg font-bold text-white mb-4">Edit Business Contact Information</h2>
          <form onSubmit={handleSaveContactDetails} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Business Name</label>
              <input type="text" name="business_name" defaultValue={contactDetails.business_name} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Phone</label>
                <input type="text" name="phone" defaultValue={contactDetails.phone} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp Number</label>
                <input type="text" name="whatsapp" defaultValue={contactDetails.whatsapp} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Support Email</label>
              <input type="email" name="email" defaultValue={contactDetails.email} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Address</label>
              <textarea name="address" rows="2" defaultValue={contactDetails.address} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"></textarea>
            </div>
            <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl bg-[#008744] hover:bg-emerald-600 text-white font-bold text-xs shadow-md">
              Save Contact Details
            </button>
          </form>
        </div>
      )}

      {/* ================================================== */}
      {/* SUB TAB 5: FOOTER LINKS */}
      {/* ================================================== */}
      {activeSubTab === 'footer' && (
        <div className="space-y-6 font-sans">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Footer Links ({footerLinks.length})</h2>
            <button
              onClick={() => setEditingFooterLink({})}
              className="px-4 py-2 rounded-xl bg-[#008744] hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" /> Add Footer Link
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Section Name</th>
                  <th className="py-3.5 px-4">Link Text</th>
                  <th className="py-3.5 px-4">URL</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {footerLinks.map((link) => (
                  <tr key={link.id}>
                    <td className="py-3 px-4 font-bold text-white">{link.section_name || link.heading}</td>
                    <td className="py-3 px-4 text-slate-200">{link.link_text}</td>
                    <td className="py-3 px-4 text-slate-400 font-mono">{link.link_url}</td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => setEditingFooterLink(link)} className="p-1.5 rounded-lg bg-slate-800 text-white">
                        <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EDIT HOME ITEM MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto pt-16 sm:pt-4 font-sans">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">{editingItem.id ? 'Edit Home Item' : 'Add Home Item'}</h3>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>
            <form onSubmit={handleSaveHomeItemForm} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Title *</label>
                <input type="text" name="title" required defaultValue={editingItem.title || ''} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea name="short_description" rows="2" defaultValue={editingItem.short_description || ''} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Price (₹) *</label>
                  <input type="number" step="0.01" name="price" required defaultValue={editingItem.price || ''} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Original Price (₹)</label>
                  <input type="number" step="0.01" name="original_price" defaultValue={editingItem.original_price || ''} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Image URL *</label>
                <div className="flex gap-2">
                  <input type="text" name="image_url" id="item_image_url" required defaultValue={editingItem.image_url || ''} className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs" />
                  <label className="px-4 py-3 bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1">
                    <Upload className="w-4 h-4" /> Upload
                    <input type="file" accept="image/*" onChange={(e) => handleImageUploadInput(e, 'item_image_url')} className="hidden" />
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setEditingItem(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold">Cancel</button>
                <button type="submit" disabled={saving} className="px-6 py-2 rounded-xl bg-[#008744] text-white text-xs font-bold shadow-lg">Save Home Item</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STEP MODAL */}
      {editingStep && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto pt-16 sm:pt-4 font-sans">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">{editingStep.id ? 'Edit Guide Step' : 'Add Guide Step'}</h3>
              <button onClick={() => setEditingStep(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>
            <form onSubmit={handleSaveStep} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Step Number *</label>
                <input type="number" name="step_number" required defaultValue={editingStep.step_number || 1} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Title *</label>
                <input type="text" name="title" required defaultValue={editingStep.title || ''} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea name="description" rows="3" defaultValue={editingStep.description || ''} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setEditingStep(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold">Cancel</button>
                <button type="submit" disabled={saving} className="px-6 py-2 rounded-xl bg-[#008744] text-white text-xs font-bold shadow-lg">Save Step</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT FOOTER LINK MODAL */}
      {editingFooterLink && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto pt-16 sm:pt-4 font-sans">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">{editingFooterLink.id ? 'Edit Footer Link' : 'Add Footer Link'}</h3>
              <button onClick={() => setEditingFooterLink(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>
            <form onSubmit={handleSaveFooterLink} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Section Name / Heading *</label>
                <input type="text" name="section_name" required defaultValue={editingFooterLink.section_name || editingFooterLink.heading || 'Quick Links'} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Link Display Text *</label>
                <input type="text" name="link_text" required defaultValue={editingFooterLink.link_text || ''} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Link URL *</label>
                <input type="text" name="link_url" required defaultValue={editingFooterLink.link_url || '#'} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs" />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setEditingFooterLink(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold">Cancel</button>
                <button type="submit" disabled={saving} className="px-6 py-2 rounded-xl bg-[#008744] text-white text-xs font-bold shadow-lg">Save Link</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default function HomePageManager(props) {
  return (
    <HomePageErrorBoundary>
      <HomePageManagerContent {...props} />
    </HomePageErrorBoundary>
  );
}
