import React, { useState } from 'react';
import { 
  Tag, Image as ImageIcon, Plus, Edit3, Trash2, Power, ArrowUp, ArrowDown, Upload, Check, LayoutGrid, Eye 
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { uploadToCloudinary } from '../../services/cloudinary';

export default function OffersManager({ adminEmail }) {
  const { 
    offerSlides, setOfferSlides, 
    offerCategories, setOfferCategories, 
    offerItems, setOfferItems,
    coupons = [], setCoupons,
    saveCmsItem, deleteCmsItem, updateDisplayOrder, logActivity, refreshAllData 
  } = useCMS();

  const [activeTab, setActiveTab] = useState('items'); // 'slides', 'categories', 'items', 'coupons'
  const [editingSlide, setEditingSlide] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingOfferItem, setEditingOfferItem] = useState(null);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleImageUploadInput = async (e, inputId) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadToCloudinary(file, 'offers');
      const inputEl = document.getElementById(inputId);
      if (inputEl) inputEl.value = res.url;
      showToast('Image Uploaded Successfully!');
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  // --- OFFER ITEM CRUD HANDLERS ---
  const handleSaveOfferItem = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData(e.target);
      const payload = {
        id: editingOfferItem?.id,
        name: formData.get('name'),
        description: formData.get('description'),
        original_price: formData.get('original_price') ? parseFloat(formData.get('original_price')) : null,
        offer_price: parseFloat(formData.get('offer_price')),
        discount: formData.get('discount'),
        image: formData.get('image'),
        category: formData.get('category'),
        offer_badge: formData.get('offer_badge'),
        availability: formData.get('availability') || 'In Stock',
        is_active: editingOfferItem ? editingOfferItem.is_active : true,
        show_on_home: formData.get('show_on_home') === 'true',
        show_on_explorer: formData.get('show_on_explorer') === 'true',
        display_order: editingOfferItem ? editingOfferItem.display_order : offerItems.length + 1
      };

      await saveCmsItem('offer_items', payload);
      await logActivity(adminEmail, editingOfferItem ? 'EDITED' : 'ADDED', 'Offer Items', payload.name);
      await refreshAllData();
      setEditingOfferItem(null);
      showToast(editingOfferItem ? 'Offer Item Updated.' : 'Offer Item Added.');
    } catch (err) {
      alert('Error saving offer item: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleOfferItemStatus = async (item) => {
    try {
      const updated = { ...item, is_active: !item.is_active };
      await saveCmsItem('offer_items', updated);
      await logActivity(adminEmail, updated.is_active ? 'ENABLED' : 'DISABLED', 'Offer Items', item.name);
      await refreshAllData();
      showToast(updated.is_active ? 'Enabled' : 'Disabled');
    } catch (err) {
      alert('Error toggling status: ' + err.message);
    }
  };

  const handleDeleteOfferItem = async (id, name) => {
    if (!window.confirm(`Delete offer "${name}"?`)) return;
    try {
      await deleteCmsItem('offer_items', id);
      await logActivity(adminEmail, 'DELETED', 'Offer Items', name);
      await refreshAllData();
      showToast('Deleted successfully.');
    } catch (err) {
      alert('Error deleting offer: ' + err.message);
    }
  };

  // --- OFFER SLIDES HANDLERS ---
  const handleSaveOfferSlide = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData(e.target);
      const payload = {
        id: editingSlide?.id,
        heading: formData.get('heading'),
        description: formData.get('description'),
        button_text: formData.get('button_text'),
        button_link: formData.get('button_link'),
        image_url: formData.get('image_url'),
        is_active: editingSlide ? editingSlide.is_active : true,
        display_order: editingSlide ? editingSlide.display_order : offerSlides.length + 1
      };

      await saveCmsItem('offer_slides', payload);
      await logActivity(adminEmail, editingSlide ? 'EDITED' : 'ADDED', 'Offer Top Slides', payload.heading);
      refreshAllData();
      setEditingSlide(null);
    } catch (err) {
      alert('Error saving slide: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // --- COUPON CRUD HANDLERS ---
  const handleSaveCoupon = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData(e.target);
      const durationValue = parseInt(formData.get('duration_value')) || 1;
      const durationUnit = formData.get('duration_unit') || 'Days'; // 'Minutes', 'Hours', 'Days'
      
      let durationMs = durationValue * 24 * 60 * 60 * 1000;
      if (durationUnit === 'Minutes') durationMs = durationValue * 60 * 1000;
      if (durationUnit === 'Hours') durationMs = durationValue * 60 * 60 * 1000;

      const expiresAt = new Date(Date.now() + durationMs).toISOString();

      const payload = {
        id: editingCoupon?.id,
        code: formData.get('code').toUpperCase().trim(),
        discount_type: formData.get('discount_type'), // 'fixed' or 'percentage'
        discount_value: parseFloat(formData.get('discount_value')),
        min_order_amount: formData.get('min_order_amount') ? parseFloat(formData.get('min_order_amount')) : null,
        duration_value: durationValue,
        duration_unit: durationUnit,
        expires_at: expiresAt,
        is_active: editingCoupon ? editingCoupon.is_active : true,
        created_at: editingCoupon?.created_at || new Date().toISOString()
      };

      await saveCmsItem('coupons', payload);
      await logActivity(adminEmail, editingCoupon?.id ? 'EDITED' : 'ADDED', 'Coupons', payload.code);
      await refreshAllData();
      setEditingCoupon(null);
      showToast(editingCoupon?.id ? 'Coupon Updated.' : 'Coupon Created.');
    } catch (err) {
      alert('Error saving coupon: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleCouponStatus = async (coupon) => {
    try {
      const updated = { ...coupon, is_active: !coupon.is_active };
      await saveCmsItem('coupons', updated);
      await logActivity(adminEmail, updated.is_active ? 'ENABLED' : 'DISABLED', 'Coupons', coupon.code);
      await refreshAllData();
      showToast(updated.is_active ? 'Coupon Enabled' : 'Coupon Disabled');
    } catch (err) {
      alert('Error toggling status: ' + err.message);
    }
  };

  const handleDeleteCoupon = async (id, code) => {
    if (!window.confirm(`Delete coupon "${code}"?`)) return;
    try {
      await deleteCmsItem('coupons', id);
      await logActivity(adminEmail, 'DELETED', 'Coupons', code);
      await refreshAllData();
      showToast('Coupon deleted.');
    } catch (err) {
      alert('Error deleting coupon: ' + err.message);
    }
  };

  const getCouponExpiryInfo = (coupon) => {
    if (!coupon.expires_at) return { status: 'No Expiry', isExpired: false };
    const exp = new Date(coupon.expires_at).getTime();
    const now = Date.now();
    const diffMs = exp - now;

    if (diffMs <= 0) {
      return { status: 'Expired', isExpired: true };
    }

    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 60) {
      return { status: `${diffMins} mins left`, isExpired: false };
    }
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) {
      return { status: `${diffHours} hours left`, isExpired: false };
    }
    const diffDays = Math.floor(diffHours / 24);
    return { status: `${diffDays} days left`, isExpired: false };
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#008744] text-white px-5 py-3 rounded-xl shadow-2xl font-bold text-xs flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" /> {toastMsg}
        </div>
      )}

      {/* Header & Sub Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Tag className="w-6 h-6 text-[#e50914]" /> Offers Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Offers are stored separately from standard products and can be dynamically featured across the site.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pt-4">
          <button
            onClick={() => setActiveTab('items')}
            className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'items'
                ? 'bg-[#008744] text-white shadow-lg'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Tag className="w-4 h-4" /> Offer Items ({offerItems.length})
          </button>
          <button
            onClick={() => setActiveTab('slides')}
            className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'slides'
                ? 'bg-[#008744] text-white shadow-lg'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <ImageIcon className="w-4 h-4" /> Top Slides ({offerSlides.length})
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === 'coupons'
                ? 'bg-[#008744] text-white shadow-lg'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Tag className="w-4 h-4 text-amber-400" /> Coupons &amp; Timers ({coupons.length})
          </button>
        </div>
      </div>

      {/* ================================================== */}
      {/* TAB 1: OFFER ITEMS */}
      {/* ================================================== */}
      {activeTab === 'items' && (
        <div className="space-y-4">
          
          {/* OFFERS ITEM COUNT SUMMARY (Part 9) */}
          <div className="grid grid-cols-3 gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Offer Items</span>
              <div className="text-xl font-black text-white mt-0.5">{offerItems.length}</div>
            </div>
            <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-800/60 text-center">
              <span className="text-[10px] font-bold text-emerald-400 uppercase">Active (Publicly Visible)</span>
              <div className="text-xl font-black text-emerald-300 mt-0.5">{offerItems.filter(i => i.is_active !== false).length}</div>
            </div>
            <div className="bg-red-950/40 p-3 rounded-xl border border-red-800/60 text-center">
              <span className="text-[10px] font-bold text-red-400 uppercase">Inactive (Hidden)</span>
              <div className="text-xl font-black text-red-300 mt-0.5">{offerItems.filter(i => i.is_active === false).length}</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Offer Items List</h2>
            <button
              onClick={() => setEditingOfferItem({ availability: 'In Stock', show_on_home: false, show_on_explorer: false })}
              className="px-4 py-2 rounded-xl bg-[#e50914] hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" /> Add Offered Item
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            {offerItems.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm font-medium">
                No offer items added. Click "Add Offered Item" to create one.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Image</th>
                      <th className="py-3 px-4">Offer Name & Desc</th>
                      <th className="py-3 px-4">Offer Price</th>
                      <th className="py-3 px-4">Badge & Category</th>
                      <th className="py-3 px-4">Home / Explorer</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {offerItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/40">
                        <td className="py-3 px-4">
                          <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg border border-slate-700 bg-slate-950" />
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-white text-sm">{item.name}</p>
                          {item.description && <p className="text-slate-400 text-xs line-clamp-1">{item.description}</p>}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-black text-emerald-400 text-sm">₹{item.offer_price}</span>
                          {item.original_price && (
                            <span className="text-slate-500 line-through text-[10px] block">₹{item.original_price}</span>
                          )}
                          {item.discount && (
                            <span className="text-red-400 text-[10px] font-bold">{item.discount}</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-200 block">{item.category || 'General'}</span>
                          {item.offer_badge && (
                            <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                              {item.offer_badge}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1 text-[10px]">
                            <span className={`px-2 py-0.5 rounded font-bold ${item.show_on_home ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-950 text-slate-500'}`}>
                              Home: {item.show_on_home ? 'YES' : 'NO'}
                            </span>
                            <span className={`px-2 py-0.5 rounded font-bold block ${item.show_on_explorer ? 'bg-blue-950 text-blue-300 border border-blue-800' : 'bg-slate-950 text-slate-500'}`}>
                              Explorer: {item.show_on_explorer ? 'YES' : 'NO'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleToggleOfferItemStatus(item)}
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
                              onClick={() => setEditingOfferItem(item)}
                              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteOfferItem(item.id, item.name)}
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
            )}
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* TAB 2: TOP SLIDES */}
      {/* ================================================== */}
      {activeTab === 'slides' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Offer Top Banner Slides</h2>
            <button
              onClick={() => setEditingSlide({})}
              className="px-4 py-2 rounded-xl bg-[#008744] hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" /> Add Top Slide
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {offerSlides.map((slide) => (
              <div key={slide.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-white text-sm">{slide.heading}</h3>
                    <p className="text-slate-400 text-xs mt-1">{slide.description}</p>
                  </div>
                  <button
                    onClick={async () => {
                      if (window.confirm('Delete slide?')) {
                        await deleteCmsItem('offer_slides', slide.id);
                        refreshAllData();
                        showToast('Slide deleted.');
                      }
                    }}
                    className="p-1.5 rounded-lg bg-red-950/80 text-red-300 border border-red-800"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {slide.image_url && (
                  <img src={slide.image_url} alt={slide.heading} className="h-28 w-full object-cover rounded-xl border border-slate-700" />
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <span className="font-bold text-emerald-400">Button: {slide.button_text || 'Shop Now'}</span>
                  <button
                    onClick={() => setEditingSlide(slide)}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-bold text-[11px]"
                  >
                    Edit Slide
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* TAB 3: COUPONS & TIMERS */}
      {/* ================================================== */}
      {activeTab === 'coupons' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Coupons &amp; Expiry Timers</h2>
              <p className="text-xs text-slate-400">Configure promotional discount codes with duration support in Minutes, Hours, or Days.</p>
            </div>
            <button
              onClick={() => setEditingCoupon({ discount_type: 'fixed', duration_unit: 'Days', duration_value: 30 })}
              className="px-4 py-2 rounded-xl bg-[#008744] hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" /> Add Coupon Code
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            {coupons.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm font-medium">
                No coupons created yet. Click "Add Coupon Code" to create one.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Coupon Code</th>
                      <th className="py-3 px-4">Discount</th>
                      <th className="py-3 px-4">Min Order</th>
                      <th className="py-3 px-4">Duration Config</th>
                      <th className="py-3 px-4">Expiry Timer Status</th>
                      <th className="py-3 px-4">Active</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {coupons.map((coupon) => {
                      const expiry = getCouponExpiryInfo(coupon);
                      return (
                        <tr key={coupon.id} className="hover:bg-slate-800/40">
                          <td className="py-3 px-4">
                            <span className="font-mono font-black text-amber-400 text-sm px-2.5 py-1 rounded bg-amber-950/60 border border-amber-800/60 inline-block">
                              {coupon.code}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-emerald-400">
                              {coupon.discount_type === 'percentage' ? `${coupon.discount_value}% OFF` : `₹${coupon.discount_value} FLAT`}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-300 font-medium">
                            {coupon.min_order_amount ? `₹${coupon.min_order_amount}` : 'No Min Limit'}
                          </td>
                          <td className="py-3 px-4 text-slate-400">
                            {coupon.duration_value} {coupon.duration_unit || 'Days'}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              expiry.isExpired 
                                ? 'bg-red-950 text-red-400 border border-red-800' 
                                : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            }`}>
                              ⏱️ {expiry.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleToggleCouponStatus(coupon)}
                              className={`px-3 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 transition-all ${
                                coupon.is_active && !expiry.isExpired
                                  ? 'bg-emerald-950 border border-emerald-700 text-emerald-300'
                                  : 'bg-red-950 border border-red-800 text-red-300'
                              }`}
                            >
                              <Power className="w-3 h-3" /> {coupon.is_active && !expiry.isExpired ? 'ACTIVE' : 'EXPIRED / OFF'}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setEditingCoupon(coupon)}
                                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCoupon(coupon.id, coupon.code)}
                                className="p-2 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* OFFER ITEM EDIT MODAL */}
      {editingOfferItem && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto pt-16 sm:pt-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto font-sans my-2">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">
                {editingOfferItem.id ? 'Edit Offer Item' : 'Add Offered Item'}
              </h3>
              <button onClick={() => setEditingOfferItem(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveOfferItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Offer / Product Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingOfferItem.name || ''}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  name="description"
                  rows="2"
                  defaultValue={editingOfferItem.description || ''}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                ></textarea>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Offer Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="offer_price"
                    required
                    defaultValue={editingOfferItem.offer_price || ''}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="original_price"
                    defaultValue={editingOfferItem.original_price || ''}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Discount Tag</label>
                  <input
                    type="text"
                    name="discount"
                    placeholder="e.g. 50% OFF"
                    defaultValue={editingOfferItem.discount || ''}
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
                    defaultValue={editingOfferItem.category || 'OTT Platforms'}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Offer Badge</label>
                  <input
                    type="text"
                    name="offer_badge"
                    placeholder="e.g. Mega Deal"
                    defaultValue={editingOfferItem.offer_badge || ''}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Image URL *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="image"
                    id="offer_item_image"
                    required
                    defaultValue={editingOfferItem.image || ''}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                  />
                  <label className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5" /> Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUploadInput(e, 'offer_item_image')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Display Visibility Checkboxes */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Placement Control</p>
                <label className="flex items-center gap-2 text-xs text-slate-200 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    name="show_on_home"
                    value="true"
                    defaultChecked={editingOfferItem.show_on_home}
                    className="rounded text-[#008744] focus:ring-[#008744]"
                  />
                  Show this Offer Item on Homepage Featured Deals
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-200 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    name="show_on_explorer"
                    value="true"
                    defaultChecked={editingOfferItem.show_on_explorer}
                    className="rounded text-[#008744] focus:ring-[#008744]"
                  />
                  Show this Offer Item on Product Explorer / All Products
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingOfferItem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#008744] text-white text-xs font-bold shadow-lg"
                >
                  {saving ? 'Saving...' : 'Save Offer Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SLIDE EDIT MODAL */}
      {editingSlide && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-white text-base border-b border-slate-800 pb-2">
              {editingSlide.id ? 'Edit Offer Top Slide' : 'Add Offer Top Slide'}
            </h3>

            <form onSubmit={handleSaveOfferSlide} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Slide Heading *</label>
                <input
                  type="text"
                  name="heading"
                  required
                  defaultValue={editingSlide.heading || ''}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  name="description"
                  rows="2"
                  defaultValue={editingSlide.description || ''}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Image URL *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="image_url"
                    id="slide_top_image"
                    required
                    defaultValue={editingSlide.image_url || ''}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                  />
                  <label className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5" /> Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUploadInput(e, 'slide_top_image')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Button Text</label>
                  <input
                    type="text"
                    name="button_text"
                    defaultValue={editingSlide.button_text || 'Shop Offers'}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Button Action / Link</label>
                  <input
                    type="text"
                    name="button_link"
                    defaultValue={editingSlide.button_link || 'offers'}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSlide(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#008744] text-white text-xs font-bold"
                >
                  Save Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COUPON EDIT MODAL */}
      {editingCoupon && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">
                {editingCoupon.id ? 'Edit Coupon Code' : 'Add New Coupon Code'}
              </h3>
              <button onClick={() => setEditingCoupon(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  name="code"
                  required
                  placeholder="e.g. WELCOME50"
                  defaultValue={editingCoupon.code || ''}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-amber-400 font-mono text-sm font-bold uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Discount Type *</label>
                  <select
                    name="discount_type"
                    defaultValue={editingCoupon.discount_type || 'fixed'}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs font-semibold"
                  >
                    <option value="fixed">Fixed Amount (₹)</option>
                    <option value="percentage">Percentage (%)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Discount Value *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="discount_value"
                    required
                    placeholder="e.g. 50"
                    defaultValue={editingCoupon.discount_value || ''}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Minimum Order Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  name="min_order_amount"
                  placeholder="e.g. 199 (Leave blank for no minimum)"
                  defaultValue={editingCoupon.min_order_amount || ''}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                />
              </div>

              {/* DURATION SUPPORT: Minutes, Hours, Days */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <label className="block text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  Duration &amp; Expiry Timer
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-1">Duration Value</label>
                    <input
                      type="number"
                      min="1"
                      name="duration_value"
                      required
                      defaultValue={editingCoupon.duration_value || 30}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 mb-1">Duration Unit</label>
                    <select
                      name="duration_unit"
                      defaultValue={editingCoupon.duration_unit || 'Days'}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-xs font-semibold"
                    >
                      <option value="Minutes">Minutes</option>
                      <option value="Hours">Hours</option>
                      <option value="Days">Days</option>
                    </select>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 italic">
                  Expiry timestamp will be calculated based on server time from save time.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCoupon(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#008744] text-white text-xs font-bold shadow-lg"
                >
                  {saving ? 'Saving...' : 'Save Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
