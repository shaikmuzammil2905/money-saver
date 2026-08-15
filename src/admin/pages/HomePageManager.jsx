import React, { useState } from 'react';
import { 
  Home, Image as ImageIcon, ArrowUp, ArrowDown, Power, Edit3, Trash2, Plus, Upload, Check, AlertCircle, Phone, FileText, Layers, ListOrdered, ChevronRight 
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { uploadToCloudinary } from '../../services/cloudinary';

export default function HomePageManager({ adminEmail }) {
  const { 
    homeItems, setHomeItems, 
    homeSlides, setHomeSlides,
    homeSteps, setHomeSteps,
    contactDetails, setContactDetails,
    footerLinks, setFooterLinks,
    saveCmsItem, deleteCmsItem, updateDisplayOrder, logActivity, refreshAllData 
  } = useCMS();

  const [activeSubTab, setActiveSubTab] = useState('items'); // 'items', '2nd-slide', 'steps', 'contact', 'footer', 'layout'

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
      const result = await uploadToCloudinary(file, 'homepage');
      const inputEl = document.getElementById(inputId);
      if (inputEl) inputEl.value = result.url;
      showToast('Image uploaded to Cloudinary!');
    } catch (err) {
      alert('Image upload failed: ' + err.message);
    } finally {
      setUploadingImage(false);
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
              <Home className="w-6 h-6 text-[#e50914]" /> Home Page Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Control Home Items, 2nd Slide, Category Layout, Easy 10 Step Guide, Contact Info, and Footer.
            </p>
          </div>
        </div>

        {/* Sub Tab Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 no-scrollbar">
          {[
            { id: 'items', label: 'Home Items', icon: Layers },
            { id: '2nd-slide', label: '2nd Slide Banner', icon: ImageIcon },
            { id: 'steps', label: 'Easy Step Guide', icon: ListOrdered },
            { id: 'contact', label: 'Contact Details', icon: Phone },
            { id: 'footer', label: 'Footer Links', icon: FileText }
          ].map((tab) => {
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
      {/* SUB TAB 1: HOME ITEMS */}
      {/* ================================================== */}
      {activeSubTab === 'items' && (
        <div className="space-y-6">
          
          {/* ITEM DISPLAY SETTINGS (Part 5) */}
          <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-5 shadow-xl space-y-4">
            <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
              <Layers className="w-5 h-5 text-purple-400" /> Home Item Display Settings (Count &amp; Manual Selection)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  How many items should be displayed on Home?
                </label>
                <select
                  value={siteSettings?.home_display_settings?.display_count || 8}
                  onChange={async (e) => {
                    const newCount = e.target.value === 'All' ? 'All' : parseInt(e.target.value);
                    const updatedValue = {
                      ...(siteSettings || {}),
                      home_display_settings: {
                        ...(siteSettings?.home_display_settings || {}),
                        display_count: newCount
                      }
                    };
                    await saveCmsItem('site_settings', { key: 'global_config', value: updatedValue });
                    refreshAllData();
                    showToast(`Home Display Count set to: ${newCount}`);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs font-black"
                >
                  <option value={4}>4 Items</option>
                  <option value={6}>6 Items</option>
                  <option value={8}>8 Items (Default)</option>
                  <option value={10}>10 Items</option>
                  <option value={12}>12 Items</option>
                  <option value={20}>20 Items</option>
                  <option value="All">All Active Selected Items</option>
                </select>
              </div>

              <div className="text-xs text-slate-400">
                <span className="font-bold text-white block mb-1">Display Rule:</span>
                Items are rendered on the public Homepage strictly based on your selected count limit and active section assignment (`Home`). Disabled items are never counted or displayed.
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Homepage Items ({homeItems.length})</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setEditingItem({}); setIsQuickAddOpen(true); }}
                className="px-4 py-2 rounded-xl bg-[#e50914] hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
              >
                <Plus className="w-4 h-4" /> Quick Add Item
              </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            {homeItems.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm font-medium">
                No items on home page yet. Click "Quick Add Item" to create one.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Order</th>
                      <th className="py-3 px-4">Image</th>
                      <th className="py-3 px-4">Title & Desc</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {homeItems.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-400">
                          <div className="flex items-center gap-1">
                            <span>#{idx + 1}</span>
                            <div className="flex flex-col">
                              <button
                                disabled={idx === 0}
                                onClick={() => handleMoveItem(idx, 'UP')}
                                className="text-slate-400 hover:text-emerald-400 disabled:opacity-20"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                disabled={idx === homeItems.length - 1}
                                onClick={() => handleMoveItem(idx, 'DOWN')}
                                className="text-slate-400 hover:text-emerald-400 disabled:opacity-20"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-12 h-12 object-cover rounded-lg border border-slate-700 bg-slate-950"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-white text-sm">{item.title}</p>
                          {item.short_description && (
                            <p className="text-slate-400 text-xs line-clamp-1">{item.short_description}</p>
                          )}
                          {item.badge && (
                            <span className="inline-block mt-1 px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold">
                              {item.badge}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {item.price ? (
                            <div>
                              <span className="font-bold text-emerald-400">₹{item.price}</span>
                              {item.original_price && (
                                <span className="text-slate-500 line-through text-[10px] ml-1">₹{item.original_price}</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-300">
                          {item.category || 'General'}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleToggleItemStatus(item)}
                            className={`px-3 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 transition-all ${
                              item.is_active
                                ? 'bg-emerald-950 border border-emerald-700 text-emerald-300'
                                : 'bg-red-950 border border-red-800 text-red-300'
                            }`}
                          >
                            <Power className="w-3 h-3" /> {item.is_active ? 'ON' : 'OFF'}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => { setEditingItem(item); setIsQuickAddOpen(true); }}
                              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id, item.title)}
                              className="p-2 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800/80"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* SUB TAB 2: 2ND SLIDE */}
      {/* ================================================== */}
      {activeSubTab === '2nd-slide' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl max-w-3xl">
          <h2 className="text-lg font-bold text-white mb-4 pb-3 border-b border-slate-800 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#e50914]" /> Manage Second Banner Slide
          </h2>

          <form onSubmit={handleSaveSecondSlide} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Slide Status</label>
              <select
                name="is_active"
                defaultValue={secondSlide.is_active ? 'true' : 'false'}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs font-semibold"
              >
                <option value="true">Enabled (Visible on Public Homepage)</option>
                <option value="false">Disabled (Hidden)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Slide Heading</label>
              <input
                type="text"
                name="heading"
                required
                defaultValue={secondSlide.heading}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
              <textarea
                name="description"
                rows="3"
                defaultValue={secondSlide.description}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Button Text</label>
                <input
                  type="text"
                  name="button_text"
                  defaultValue={secondSlide.button_text || 'Explore Offers'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Button Action / Tab Link</label>
                <input
                  type="text"
                  name="button_link"
                  defaultValue={secondSlide.button_link || 'offers'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Banner Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="image_url"
                  id="slide_image_url"
                  required
                  defaultValue={secondSlide.image_url}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                />
                <label className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0">
                  <Upload className="w-4 h-4" /> {uploadingImage ? 'Uploading...' : 'Upload Image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUploadInput(e, 'slide_image_url')}
                    className="hidden"
                  />
                </label>
              </div>
              {secondSlide.image_url && (
                <div className="mt-3">
                  <p className="text-[10px] text-slate-400 mb-1 font-bold">Image Preview:</p>
                  <img src={secondSlide.image_url} alt="Slide Preview" className="h-32 w-auto object-cover rounded-xl border border-slate-700" />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 rounded-xl bg-[#008744] hover:bg-emerald-600 text-white font-bold text-xs shadow-lg transition-all"
            >
              {saving ? 'Saving Changes...' : 'Update 2nd Slide Banner'}
            </button>
          </form>
        </div>
      )}

      {/* ================================================== */}
      {/* SUB TAB 3: EASY STEP GUIDE */}
      {/* ================================================== */}
      {activeSubTab === 'steps' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Easy Step Guide ({homeSteps.length} Steps)</h2>
            <button
              onClick={() => setEditingStep({ step_number: homeSteps.length + 1 })}
              className="px-4 py-2 rounded-xl bg-[#008744] hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" /> Add New Step
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {homeSteps.map((step) => (
              <div key={step.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#e50914] text-white font-black flex items-center justify-center text-sm shrink-0">
                    {step.step_number}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{step.title}</h3>
                    <p className="text-slate-400 text-xs mt-1">{step.description}</p>
                    <span className="inline-block mt-2 text-[10px] font-bold text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      Icon: {step.icon_name || 'HelpCircle'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setEditingStep(step)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteStep(step.id, step.title)}
                    className="p-2 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* SUB TAB 4: CONTACT DETAILS */}
      {/* ================================================== */}
      {activeSubTab === 'contact' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl max-w-3xl">
          <h2 className="text-lg font-bold text-white mb-4 pb-3 border-b border-slate-800 flex items-center gap-2">
            <Phone className="w-5 h-5 text-[#008744]" /> Edit Business Contact Details
          </h2>

          <form onSubmit={handleSaveContactDetails} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Business Name</label>
                <input
                  type="text"
                  name="business_name"
                  required
                  defaultValue={contactDetails?.business_name || 'OTTMoneySaver'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Support Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  defaultValue={contactDetails?.email || 'support@ottmoneysaver.com'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  required
                  defaultValue={contactDetails?.phone || '6305151531'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Secondary Phone Number</label>
                <input
                  type="text"
                  name="secondary_phone"
                  defaultValue={contactDetails?.secondary_phone || '7013931261'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Primary WhatsApp (With Country Code)</label>
                <input
                  type="text"
                  name="whatsapp"
                  required
                  defaultValue={contactDetails?.whatsapp || '916305151531'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Secondary WhatsApp (With Country Code)</label>
                <input
                  type="text"
                  name="secondary_whatsapp"
                  defaultValue={contactDetails?.secondary_whatsapp || '917013931261'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Address Location</label>
              <input
                type="text"
                name="address"
                required
                defaultValue={contactDetails?.address || 'Hyderabad, Telangana, India'}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  defaultValue={contactDetails?.city || 'Hyderabad'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  defaultValue={contactDetails?.state || 'Telangana'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 rounded-xl bg-[#008744] hover:bg-emerald-600 text-white font-bold text-xs shadow-lg transition-all"
            >
              {saving ? 'Updating...' : 'Save & Update Contact Details'}
            </button>
          </form>
        </div>
      )}

      {/* ================================================== */}
      {/* SUB TAB 5: FOOTER LINKS */}
      {/* ================================================== */}
      {activeSubTab === 'footer' && (
        <div className="space-y-4">
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
                  <th className="py-3 px-4">Section</th>
                  <th className="py-3 px-4">Link Label</th>
                  <th className="py-3 px-4">Action / URL</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {footerLinks.map((link) => (
                  <tr key={link.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-emerald-400">{link.section_name}</td>
                    <td className="py-3 px-4 font-bold text-white">{link.link_text}</td>
                    <td className="py-3 px-4 text-slate-400">{link.link_url}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingFooterLink(link)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={async () => {
                            if (window.confirm('Delete link?')) {
                              await deleteCmsItem('footer_links', link.id);
                              refreshAllData();
                              showToast('Deleted.');
                            }
                          }}
                          className="p-2 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* QUICK ADD / EDIT HOME ITEM MODAL */}
      {isQuickAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">
                {editingItem?.id ? 'Edit Home Item' : 'Quick Add Home Item'}
              </h3>
              <button
                onClick={() => setIsQuickAddOpen(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveHomeItemForm} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Item Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={editingItem?.title || ''}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Short Description</label>
                <input
                  type="text"
                  name="short_description"
                  defaultValue={editingItem?.short_description || ''}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    defaultValue={editingItem?.price || ''}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="original_price"
                    defaultValue={editingItem?.original_price || ''}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <input
                    type="text"
                    name="category"
                    defaultValue={editingItem?.category || 'OTT Platforms'}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Badge (e.g. Hot Deal)</label>
                  <input
                    type="text"
                    name="badge"
                    defaultValue={editingItem?.badge || ''}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Image URL *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="image_url"
                    id="quick_home_image"
                    required
                    defaultValue={editingItem?.image_url || ''}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                  />
                  <label className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5" /> Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUploadInput(e, 'quick_home_image')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Link Action</label>
                <input
                  type="text"
                  name="link_url"
                  defaultValue={editingItem?.link_url || 'offers'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsQuickAddOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#008744] text-white text-xs font-bold shadow-lg"
                >
                  {saving ? 'Saving...' : 'Save Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STEP EDIT MODAL */}
      {editingStep && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-base border-b border-slate-800 pb-2">
              {editingStep.id ? 'Edit Step' : 'Add New Step'}
            </h3>

            <form onSubmit={handleSaveStep} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Step Number</label>
                  <input
                    type="number"
                    name="step_number"
                    required
                    defaultValue={editingStep.step_number || 1}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Icon Name</label>
                  <input
                    type="text"
                    name="icon_name"
                    defaultValue={editingStep.icon_name || 'HelpCircle'}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Step Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={editingStep.title || ''}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Step Description</label>
                <textarea
                  name="description"
                  required
                  rows="3"
                  defaultValue={editingStep.description || ''}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingStep(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#008744] text-white text-xs font-bold"
                >
                  {saving ? 'Saving...' : 'Save Step'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER LINK EDIT MODAL */}
      {editingFooterLink && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-base border-b border-slate-800 pb-2">
              {editingFooterLink.id ? 'Edit Footer Link' : 'Add Footer Link'}
            </h3>

            <form onSubmit={handleSaveFooterLink} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Footer Section</label>
                <select
                  name="section_name"
                  defaultValue={editingFooterLink.section_name || 'Quick Links'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                >
                  <option value="Quick Links">Quick Links</option>
                  <option value="Customer Support">Customer Support</option>
                  <option value="Contact Us">Contact Us</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Link Display Text</label>
                <input
                  type="text"
                  name="link_text"
                  required
                  defaultValue={editingFooterLink.link_text || ''}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Link Target / Tab / URL</label>
                <input
                  type="text"
                  name="link_url"
                  required
                  defaultValue={editingFooterLink.link_url || 'home'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingFooterLink(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#008744] text-white text-xs font-bold"
                >
                  Save Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
