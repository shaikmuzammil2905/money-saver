import React, { useState, useMemo } from 'react';
import {
  Tag, Plus, Edit3, Trash2, Check, X, RefreshCw, Copy, Sparkles,
  Calendar, Clock, Percent, DollarSign, Package, Layers, AlertCircle,
  ToggleLeft, ToggleRight, ChevronDown, ChevronUp, Search, Phone
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';

// IST offset in milliseconds (UTC+5:30)
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

function toISTDatetimeLocal(isoString) {
  if (!isoString) return '';
  try {
    const utcMs = new Date(isoString).getTime();
    const istMs = utcMs + IST_OFFSET_MS;
    const d = new Date(istMs);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
  } catch { return ''; }
}

function fromISTDatetimeLocalToISO(datetimeLocal) {
  if (!datetimeLocal) return null;
  try {
    const [datePart, timePart] = datetimeLocal.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hour, minute] = timePart.split(':').map(Number);
    const istMs = Date.UTC(year, month - 1, day, hour, minute, 0, 0) - IST_OFFSET_MS;
    return new Date(istMs).toISOString();
  } catch { return null; }
}

function generateCouponCode() {
  const prefixes = ['SAVE', 'OTT', 'OFF', 'DEAL', 'GET', 'WIN', 'BIG'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const num = Math.floor(10 + Math.random() * 90);
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const suffix = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${prefix}${num}${suffix}`;
}

function getCouponStatus(coupon) {
  const now = new Date();
  const istNow = new Date(now.getTime() + IST_OFFSET_MS);

  if (!coupon.is_active) return { label: 'Inactive', color: 'slate' };

  if (coupon.starts_at) {
    const start = new Date(coupon.starts_at);
    if (istNow < start) return { label: 'Scheduled', color: 'blue' };
  }

  if (coupon.expires_at) {
    const exp = new Date(coupon.expires_at);
    if (istNow > exp) return { label: 'Expired', color: 'red' };
  }

  return { label: 'Active', color: 'emerald' };
}

const STATUS_COLORS = {
  emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  red: 'bg-red-100 text-red-800 border-red-200',
  blue: 'bg-blue-100 text-blue-800 border-blue-200',
  slate: 'bg-slate-100 text-slate-700 border-slate-200'
};

const EMPTY_FORM = {
  code: '',
  discount_type: 'percentage',
  discount_value: '',
  min_order_amount: '',
  max_discount: '',
  usage_limit: '',
  starts_at: '',
  expires_at: '',
  is_active: true,
  apply_to: 'all',
  allowed_categories: [],
  allowed_product_ids: [],
  description: ''
};

export default function CouponsManager({ adminEmail }) {
  const { coupons, setCoupons, saveCmsItem, deleteCmsItem, logActivity, refreshAllData, categories, products } = useCMS();

  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const openCreate = () => {
    setEditingCoupon('new');
    setFormData({ ...EMPTY_FORM });
  };

  const openEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code || '',
      discount_type: coupon.discount_type || 'percentage',
      discount_value: coupon.discount_value != null ? String(coupon.discount_value) : '',
      min_order_amount: coupon.min_order_amount != null ? String(coupon.min_order_amount) : '',
      max_discount: coupon.max_discount != null ? String(coupon.max_discount) : '',
      usage_limit: coupon.usage_limit != null ? String(coupon.usage_limit) : '',
      starts_at: coupon.starts_at ? toISTDatetimeLocal(coupon.starts_at) : '',
      expires_at: coupon.expires_at ? toISTDatetimeLocal(coupon.expires_at) : '',
      is_active: coupon.is_active !== false,
      apply_to: coupon.apply_to || 'all',
      allowed_categories: Array.isArray(coupon.allowed_categories) ? coupon.allowed_categories : [],
      allowed_product_ids: Array.isArray(coupon.allowed_product_ids) ? coupon.allowed_product_ids : [],
      description: coupon.description || ''
    });
  };

  const handleGenerateCode = () => {
    let code = generateCouponCode();
    // Ensure uniqueness
    const existingCodes = new Set((coupons || []).map(c => c.code?.toUpperCase()));
    let attempts = 0;
    while (existingCodes.has(code) && attempts < 20) {
      code = generateCouponCode();
      attempts++;
    }
    setFormData(prev => ({ ...prev, code }));
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCategoryToggle = (catName) => {
    const current = formData.allowed_categories || [];
    const updated = current.includes(catName)
      ? current.filter(c => c !== catName)
      : [...current, catName];
    setFormData(prev => ({ ...prev, allowed_categories: updated }));
  };

  const handleProductToggle = (productId) => {
    const current = formData.allowed_product_ids || [];
    const updated = current.includes(productId)
      ? current.filter(p => p !== productId)
      : [...current, productId];
    setFormData(prev => ({ ...prev, allowed_product_ids: updated }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (!formData.code?.trim()) throw new Error('Coupon code is required.');
      const cleanCode = formData.code.trim().toUpperCase();

      // Validate uniqueness on create
      if (editingCoupon === 'new') {
        const existingCodes = (coupons || []).map(c => (c.code || '').toUpperCase());
        if (existingCodes.includes(cleanCode)) {
          throw new Error(`Coupon code "${cleanCode}" already exists. Please use a different code.`);
        }
      }

      if (!formData.discount_value || Number(formData.discount_value) <= 0) {
        throw new Error('Discount value must be greater than 0.');
      }

      if (formData.discount_type === 'percentage' && Number(formData.discount_value) > 100) {
        throw new Error('Percentage discount cannot exceed 100%.');
      }

      const startsAt = formData.starts_at ? fromISTDatetimeLocalToISO(formData.starts_at) : null;
      const expiresAt = formData.expires_at ? fromISTDatetimeLocalToISO(formData.expires_at) : null;

      if (startsAt && expiresAt && new Date(startsAt) >= new Date(expiresAt)) {
        throw new Error('Expiry date/time must be after the start date/time.');
      }

      const payload = {
        id: editingCoupon !== 'new' ? editingCoupon.id : undefined,
        code: cleanCode,
        discount_type: formData.discount_type,
        discount_value: Number(formData.discount_value),
        min_order_amount: formData.min_order_amount ? Number(formData.min_order_amount) : null,
        max_discount: formData.max_discount ? Number(formData.max_discount) : null,
        usage_limit: formData.usage_limit ? Number(formData.usage_limit) : null,
        usage_count: editingCoupon !== 'new' ? (editingCoupon.usage_count || 0) : 0,
        starts_at: startsAt,
        expires_at: expiresAt,
        is_active: formData.is_active,
        apply_to: formData.apply_to || 'all',
        allowed_categories: formData.apply_to === 'categories' ? formData.allowed_categories : [],
        allowed_product_ids: formData.apply_to === 'products' ? formData.allowed_product_ids : [],
        description: formData.description || '',
        created_at: editingCoupon !== 'new' ? editingCoupon.created_at : new Date().toISOString()
      };

      const saved = await saveCmsItem('coupons', payload);
      await logActivity(adminEmail, editingCoupon === 'new' ? 'CREATED' : 'UPDATED', 'Coupons', cleanCode);

      // Update local state optimistically
      setCoupons(prev => {
        const filtered = (prev || []).filter(c => c.id !== saved.id && c.code !== cleanCode);
        return [saved, ...filtered].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      });

      setEditingCoupon(null);
      showToast(`Coupon "${cleanCode}" ${editingCoupon === 'new' ? 'Created' : 'Updated'} Successfully!`);
      await refreshAllData();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (coupon) => {
    if (!window.confirm(`Delete coupon "${coupon.code}"? This cannot be undone.`)) return;
    try {
      await deleteCmsItem('coupons', coupon.id);
      await logActivity(adminEmail, 'DELETED', 'Coupons', coupon.code);
      setCoupons(prev => (prev || []).filter(c => c.id !== coupon.id));
      showToast(`Coupon "${coupon.code}" Deleted.`);
    } catch (err) {
      alert('Error deleting coupon: ' + err.message);
    }
  };

  const handleToggle = async (coupon) => {
    try {
      const updated = { ...coupon, is_active: !coupon.is_active };
      await saveCmsItem('coupons', updated);
      setCoupons(prev => (prev || []).map(c => c.id === coupon.id ? updated : c));
      showToast(updated.is_active ? `"${coupon.code}" Activated` : `"${coupon.code}" Deactivated`);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const filteredCoupons = useMemo(() => {
    const list = Array.isArray(coupons) ? [...coupons] : [];
    if (!searchQuery.trim()) return list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    const q = searchQuery.toLowerCase();
    return list.filter(c => (c.code || '').toLowerCase().includes(q) || (c.description || '').toLowerCase().includes(q));
  }, [coupons, searchQuery]);

  // Unique category names from categories table
  const categoryNames = useMemo(() => {
    const cats = Array.isArray(categories) ? categories : [];
    return [...new Set(cats.filter(c => c.is_active !== false).map(c => c.name))].sort();
  }, [categories]);

  // Active products
  const activeProducts = useMemo(() => {
    return (Array.isArray(products) ? products : []).filter(p => p.is_active !== false);
  }, [products]);

  const formatIST = (isoString) => {
    if (!isoString) return '—';
    try {
      const utcMs = new Date(isoString).getTime();
      const istMs = utcMs + IST_OFFSET_MS;
      const d = new Date(istMs);
      const pad = (n) => String(n).padStart(2, '0');
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const h = d.getUTCHours();
      const ampm = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 || 12;
      return `${pad(d.getUTCDate())} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()} ${pad(h12)}:${pad(d.getUTCMinutes())} ${ampm} IST`;
    } catch { return isoString; }
  };

  // Contact number for "Contact Now" CTA
  const contactWhatsApp = 'https://wa.me/916305151531';

  return (
    <div className="space-y-6 font-sans">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#008744] text-white px-5 py-3 rounded-xl shadow-2xl font-bold text-xs flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" /> {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Tag className="w-6 h-6 text-[#e50914]" /> Coupon Code Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create, manage and target discount coupons with date/time controls (Asia/Kolkata timezone).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search coupons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#008744] w-44"
            />
          </div>
          <button
            onClick={openCreate}
            className="px-4 py-2.5 rounded-xl bg-[#e50914] hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all shrink-0"
          >
            <Plus className="w-4 h-4" /> Create Coupon
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: (coupons || []).length, color: 'text-slate-900' },
          { label: 'Active', value: (coupons || []).filter(c => getCouponStatus(c).label === 'Active').length, color: 'text-emerald-700' },
          { label: 'Expired', value: (coupons || []).filter(c => getCouponStatus(c).label === 'Expired').length, color: 'text-red-700' },
          { label: 'Scheduled', value: (coupons || []).filter(c => getCouponStatus(c).label === 'Scheduled').length, color: 'text-blue-700' }
        ].map(stat => (
          <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-3 text-center shadow-sm">
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Coupon List */}
      {filteredCoupons.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
          <Tag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="font-bold text-slate-600">No coupons found.</p>
          <p className="text-xs text-slate-400 mt-1">Click "Create Coupon" to add your first discount code.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCoupons.map((coupon) => {
            const status = getCouponStatus(coupon);
            const isCopied = copiedCode === coupon.code;
            return (
              <div key={coupon.id || coupon.code} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left: Code + Info */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="bg-slate-900 text-white font-mono font-black text-sm px-3 py-1.5 rounded-xl tracking-wider flex items-center gap-2">
                      {coupon.code}
                      <button
                        onClick={() => handleCopy(coupon.code)}
                        className="ml-1 text-slate-400 hover:text-white transition-colors"
                        title="Copy code"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${STATUS_COLORS[status.color]}`}>
                      {status.label}
                    </span>
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {coupon.discount_type === 'percentage'
                        ? `${coupon.discount_value}% OFF`
                        : `₹${coupon.discount_value} OFF`}
                    </span>
                    {coupon.apply_to && coupon.apply_to !== 'all' && (
                      <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        {coupon.apply_to === 'categories' ? `${(coupon.allowed_categories || []).length} Categories` : `${(coupon.allowed_product_ids || []).length} Products`}
                      </span>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggle(coupon)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all ${
                        coupon.is_active ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-100 border-slate-200 text-slate-600'
                      }`}
                    >
                      {coupon.is_active ? 'ON' : 'OFF'}
                    </button>
                    <button
                      onClick={() => openEdit(coupon)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 border border-slate-200 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(coupon)}
                      className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center gap-1 border border-red-200 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>

                {/* Meta Info Row */}
                <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-500">
                  <div><span className="font-bold text-slate-700">Min Order:</span> {coupon.min_order_amount ? `₹${coupon.min_order_amount}` : 'None'}</div>
                  <div><span className="font-bold text-slate-700">Max Discount:</span> {coupon.max_discount ? `₹${coupon.max_discount}` : 'Unlimited'}</div>
                  <div><span className="font-bold text-slate-700">Usage:</span> {coupon.usage_count || 0}/{coupon.usage_limit || '∞'}</div>
                  <div><span className="font-bold text-slate-700">Applies To:</span> {coupon.apply_to === 'all' ? 'Entire Store' : coupon.apply_to === 'categories' ? 'Categories' : 'Products'}</div>
                  <div className="col-span-2"><span className="font-bold text-slate-700">Starts:</span> {formatIST(coupon.starts_at)}</div>
                  <div className="col-span-2"><span className="font-bold text-slate-700">Expires:</span> {formatIST(coupon.expires_at)}</div>
                </div>

                {/* Expired Contact Now */}
                {status.label === 'Expired' && (
                  <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
                    <p className="text-xs font-bold text-amber-800">This coupon has expired.</p>
                    <a
                      href={contactWhatsApp}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-black text-white bg-[#25d366] hover:bg-green-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3 h-3" /> Contact Now
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {editingCoupon !== null && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start sm:items-center justify-center p-3 overflow-y-auto pt-16 sm:pt-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-5 shadow-2xl space-y-5 my-4 max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#e50914]" />
                {editingCoupon === 'new' ? 'Create New Coupon' : `Edit: ${editingCoupon.code}`}
              </h3>
              <button
                onClick={() => setEditingCoupon(null)}
                type="button"
                className="text-slate-400 hover:text-slate-700 font-bold text-xl px-2"
              >✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">

              {/* Coupon Code */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">Coupon Code *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => handleFieldChange('code', e.target.value.toUpperCase().replace(/\s/g, ''))}
                    placeholder="E.g. OTT50X9"
                    required
                    maxLength={20}
                    className="flex-1 bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 font-mono font-bold text-sm uppercase focus:outline-none focus:border-[#008744]"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateCode}
                    className="px-3 py-2 rounded-xl bg-[#008744] hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all shrink-0"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Generate
                  </button>
                </div>
                <p className="text-[10px] text-slate-500">Use uppercase letters and numbers only. Code must be unique.</p>
              </div>

              {/* Discount Type & Value */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Discount Type *</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleFieldChange('discount_type', 'percentage')}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                        formData.discount_type === 'percentage'
                          ? 'bg-[#008744] text-white border-[#008744]'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Percent className="w-3.5 h-3.5" /> Percentage
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFieldChange('discount_type', 'fixed')}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                        formData.discount_type === 'fixed'
                          ? 'bg-[#e50914] text-white border-[#e50914]'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <DollarSign className="w-3.5 h-3.5" /> Fixed ₹
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Discount Value * {formData.discount_type === 'percentage' ? '(%)' : '(₹)'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={formData.discount_type === 'percentage' ? 100 : undefined}
                    step="any"
                    value={formData.discount_value}
                    onChange={(e) => handleFieldChange('discount_value', e.target.value)}
                    placeholder={formData.discount_type === 'percentage' ? '10' : '100'}
                    required
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 text-sm font-bold focus:outline-none focus:border-[#008744]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Minimum Order Amount (₹)</label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={formData.min_order_amount}
                    onChange={(e) => handleFieldChange('min_order_amount', e.target.value)}
                    placeholder="0 = No minimum"
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 text-sm focus:outline-none focus:border-[#008744]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Maximum Discount (₹) — for % coupons</label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={formData.max_discount}
                    onChange={(e) => handleFieldChange('max_discount', e.target.value)}
                    placeholder="Leave blank = unlimited"
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 text-sm focus:outline-none focus:border-[#008744]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Usage Limit (total uses)</label>
                  <input
                    type="number"
                    min={1}
                    step={1}
                    value={formData.usage_limit}
                    onChange={(e) => handleFieldChange('usage_limit', e.target.value)}
                    placeholder="Leave blank = unlimited"
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 text-sm focus:outline-none focus:border-[#008744]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Description (internal note)</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                    placeholder="E.g. Diwali promo 2026"
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 text-sm focus:outline-none focus:border-[#008744]"
                  />
                </div>
              </div>

              {/* Date & Time (IST) */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 space-y-3">
                <h4 className="text-xs font-black text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Start & Expiry Date/Time — All times in IST (Asia/Kolkata)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-blue-600" /> Start Date & Time (IST)
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.starts_at}
                      onChange={(e) => handleFieldChange('starts_at', e.target.value)}
                      className="w-full bg-white border border-blue-200 rounded-xl p-2.5 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">Leave blank = active immediately</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-red-600" /> Expiry Date & Time (IST)
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.expires_at}
                      onChange={(e) => handleFieldChange('expires_at', e.target.value)}
                      className="w-full bg-white border border-blue-200 rounded-xl p-2.5 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">Leave blank = no expiry</p>
                  </div>
                </div>
              </div>

              {/* Apply To */}
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-200 space-y-3">
                <h4 className="text-xs font-black text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" /> Coupon Applies To
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'all', label: 'Entire Store', icon: '🏪' },
                    { value: 'categories', label: 'Specific Categories', icon: '📂' },
                    { value: 'products', label: 'Specific Products', icon: '📦' }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleFieldChange('apply_to', opt.value)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
                        formData.apply_to === opt.value
                          ? 'bg-purple-700 text-white border-purple-700'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-purple-100'
                      }`}
                    >
                      {opt.icon} {opt.label}
                    </button>
                  ))}
                </div>

                {/* Category Selector */}
                {formData.apply_to === 'categories' && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-bold text-slate-700">Select Categories (coupon applies only to these):</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                      {categoryNames.map(catName => (
                        <label key={catName} className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-2 cursor-pointer hover:border-purple-300">
                          <input
                            type="checkbox"
                            checked={(formData.allowed_categories || []).includes(catName)}
                            onChange={() => handleCategoryToggle(catName)}
                            className="accent-purple-600"
                          />
                          <span className="text-xs font-semibold text-slate-700 truncate">{catName}</span>
                        </label>
                      ))}
                    </div>
                    {(formData.allowed_categories || []).length === 0 && (
                      <p className="text-[11px] text-red-600 font-bold">Please select at least one category.</p>
                    )}
                  </div>
                )}

                {/* Product Selector */}
                {formData.apply_to === 'products' && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-bold text-slate-700">Select Products (coupon applies only to these):</p>
                    <div className="space-y-1 max-h-56 overflow-y-auto">
                      {activeProducts.map(prod => {
                        const pid = prod.id || prod.slug_id;
                        return (
                          <label key={pid} className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-2 cursor-pointer hover:border-purple-300">
                            <input
                              type="checkbox"
                              checked={(formData.allowed_product_ids || []).includes(pid)}
                              onChange={() => handleProductToggle(pid)}
                              className="accent-purple-600"
                            />
                            <span className="text-xs font-semibold text-slate-700">{prod.title}</span>
                            <span className="ml-auto text-[10px] text-slate-400 shrink-0">₹{prod.price}</span>
                          </label>
                        );
                      })}
                    </div>
                    {(formData.allowed_product_ids || []).length === 0 && (
                      <p className="text-[11px] text-red-600 font-bold">Please select at least one product.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <p className="text-xs font-black text-slate-900 uppercase tracking-wider">Coupon Status</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Toggle to enable or disable this coupon immediately.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleFieldChange('is_active', !formData.is_active)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs border transition-all ${
                    formData.is_active
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-red-50 border-red-300 text-red-800'
                  }`}
                >
                  {formData.is_active
                    ? <><ToggleRight className="w-4 h-4 text-emerald-600" /> Active</>
                    : <><ToggleLeft className="w-4 h-4 text-red-600" /> Inactive</>
                  }
                </button>
              </div>

              {/* Submit */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingCoupon(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm border border-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#e50914] to-[#008744] hover:opacity-95 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                  ) : (
                    <><Check className="w-4 h-4" /> {editingCoupon === 'new' ? 'Create Coupon' : 'Save Changes'}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
