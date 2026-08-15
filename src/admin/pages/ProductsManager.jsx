import React, { useState, useMemo } from 'react';
import { 
  Package, Search, Plus, Edit3, Trash2, Power, Upload, Check, Filter, ArrowUp, ArrowDown, Tag, Layers, ListPlus, ShieldCheck 
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { uploadToCloudinary } from '../../services/cloudinary';

export default function ProductsManager({ adminEmail }) {
  const { 
    products, setProducts, categories, badges, batches,
    saveCmsItem, deleteCmsItem, updateDisplayOrder, logActivity, refreshAllData 
  } = useCMS();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('All');
  const [selectedSectionFilter, setSelectedSectionFilter] = useState('All');
  const [editingProduct, setEditingProduct] = useState(null);
  const [descPoints, setDescPoints] = useState([]);
  const [customInfoPoints, setCustomInfoPoints] = useState([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.category || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCatFilter === 'All' || p.category === selectedCatFilter || p.category_group === selectedCatFilter;
      
      const sectionsArr = Array.isArray(p.sections) ? p.sections : ['Home', 'All OTTs'];
      const matchSection = selectedSectionFilter === 'All' || sectionsArr.includes(selectedSectionFilter);

      return matchSearch && matchCat && matchSection;
    });
  }, [products, searchQuery, selectedCatFilter, selectedSectionFilter]);

  const handleToggleProductStatus = async (prod) => {
    try {
      const updated = { ...prod, is_active: !prod.is_active };
      await saveCmsItem('products', updated);
      await logActivity(adminEmail, updated.is_active ? 'ENABLED' : 'DISABLED', 'Products', prod.title);
      refreshAllData();
      showToast(updated.is_active ? 'Product Enabled' : 'Product Disabled');
    } catch (err) {
      alert('Error toggling product status: ' + err.message);
    }
  };

  const handleToggleStock = async (prod) => {
    try {
      const updated = { ...prod, in_stock: !prod.in_stock };
      await saveCmsItem('products', updated);
      await logActivity(adminEmail, updated.in_stock ? 'IN_STOCK' : 'OUT_OF_STOCK', 'Products', prod.title);
      refreshAllData();
      showToast(updated.in_stock ? 'Marked In Stock' : 'Marked Out of Stock');
    } catch (err) {
      alert('Error updating stock: ' + err.message);
    }
  };

  const handleMoveProductOrder = async (index, direction) => {
    const newProds = [...filteredProducts];
    const targetIdx = direction === 'UP' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newProds.length) return;

    const temp = newProds[index];
    newProds[index] = newProds[targetIdx];
    newProds[targetIdx] = temp;

    await updateDisplayOrder('products', newProds, 'display_order');
    await logActivity(adminEmail, 'REORDERED', 'Products');
    refreshAllData();
    showToast('Product Display Order Updated in Database.');
  };

  const handleDeleteProduct = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await deleteCmsItem('products', id);
      await logActivity(adminEmail, 'DELETED', 'Products', title);
      refreshAllData();
      showToast('Deleted successfully.');
    } catch (err) {
      alert('Error deleting product: ' + err.message);
    }
  };

  const handleAddDescPoint = () => {
    setDescPoints((prev) => [...prev, '']);
  };

  const handleAddCustomPoint = () => {
    setCustomInfoPoints((prev) => [...prev, '']);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setDescPoints(
      Array.isArray(prod?.description_points)
        ? prod.description_points
        : (prod?.description ? prod.description.split('\n').filter(Boolean) : ['Point 1'])
    );
    setCustomInfoPoints(
      Array.isArray(prod?.custom_info) && prod.custom_info.length > 0
        ? prod.custom_info
        : ['Instant Activation', 'WhatsApp Support Available', 'Payment via UPI']
    );
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData(e.target);
      
      const sectionsSelected = [];
      if (formData.get('sec_home') === 'true') sectionsSelected.push('Home');
      if (formData.get('sec_offers') === 'true') sectionsSelected.push('Offers');
      if (formData.get('sec_all_otts') === 'true') sectionsSelected.push('All OTTs');

      const selectedBadgesArr = Array.from(formData.getAll('selected_badges'));
      const selectedBatchesArr = Array.from(formData.getAll('selected_batches'));

      const cleanDescPoints = descPoints.filter((pt) => pt && pt.trim().length > 0);
      const cleanCustomInfo = customInfoPoints.filter((pt) => pt && pt.trim().length > 0);

      const payload = {
        id: editingProduct?.id,
        slug_id: editingProduct?.slug_id || `prod-${Date.now()}`,
        title: formData.get('title'),
        subtitle: formData.get('subtitle'),
        description: cleanDescPoints.join('\n'),
        description_points: cleanDescPoints,
        custom_info: cleanCustomInfo,
        price: parseFloat(formData.get('price')),
        original_price: formData.get('original_price') ? parseFloat(formData.get('original_price')) : parseFloat(formData.get('price')),
        discount: formData.get('discount'),
        image: formData.get('image'),
        images: [formData.get('image')],
        category: formData.get('category'),
        category_group: formData.get('category_group') || formData.get('category'),
        brand: formData.get('brand'),
        sku: formData.get('sku'),
        badge: selectedBadgesArr[0] || formData.get('badge') || '',
        badges: selectedBadgesArr,
        batches: selectedBatchesArr,
        sections: sectionsSelected,
        in_stock: formData.get('in_stock') === 'true',
        is_active: editingProduct ? editingProduct.is_active : true,
        display_order: editingProduct ? editingProduct.display_order : products.length + 1
      };

      await saveCmsItem('products', payload);
      await logActivity(adminEmail, editingProduct?.id ? 'EDITED' : 'ADDED', 'Products', payload.title);
      refreshAllData();
      setEditingProduct(null);
      showToast(editingProduct?.id ? 'Updated successfully.' : 'Product Added Successfully.');
    } catch (err) {
      alert('Error saving product: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUploadInput = async (e, inputId) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadToCloudinary(file, 'products');
      const inputEl = document.getElementById(inputId);
      if (inputEl) inputEl.value = res.url;
      showToast('Product Image Uploaded to Cloudinary!');
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
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

      {/* Header & Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Package className="w-6 h-6 text-[#008744]" /> Mobile-First Product Manager
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Manage product details, vertical description points, section assignments, badges, and display orders.
            </p>
          </div>

          <button
            onClick={() => openEditModal({
              title: '',
              category: categories[0]?.name || 'OTT Platforms',
              price: 299,
              in_stock: true,
              sections: ['Home', 'All OTTs']
            })}
            className="px-4 py-2.5 rounded-xl bg-[#008744] hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Add New Product
          </button>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search products by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 text-white placeholder-slate-500 text-xs rounded-xl py-2.5 pl-9 pr-3 border border-slate-800 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Category Filter */}
            <select
              value={selectedCatFilter}
              onChange={(e) => setSelectedCatFilter(e.target.value)}
              className="bg-slate-950 text-white text-xs font-bold rounded-xl py-2.5 px-3 border border-slate-800"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>

            {/* Section Filter */}
            <select
              value={selectedSectionFilter}
              onChange={(e) => setSelectedSectionFilter(e.target.value)}
              className="bg-slate-950 text-white text-xs font-bold rounded-xl py-2.5 px-3 border border-slate-800"
            >
              <option value="All">All Display Sections</option>
              <option value="Home">Home Only</option>
              <option value="Offers">Offers Only</option>
              <option value="All OTTs">All OTTs Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* MOBILE-FIRST VERTICAL CARDS PRODUCT LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((prod, index) => {
          const sectionsArr = Array.isArray(prod.sections) ? prod.sections : ['Home', 'All OTTs'];
          return (
            <div key={prod.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4 flex flex-col justify-between font-sans">
              
              <div className="space-y-3">
                {/* Image & Badges */}
                <div className="relative h-44 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
                  <img src={prod.image} alt={prod.title} className="w-full h-full object-cover" />
                  
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    {sectionsArr.map((sec) => (
                      <span key={sec} className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                        {sec}
                      </span>
                    ))}
                  </div>

                  <span className={`absolute top-2 right-2 text-[10px] font-black px-2 py-0.5 rounded ${
                    prod.in_stock !== false ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-red-950 text-red-300 border border-red-800'
                  }`}>
                    {prod.in_stock !== false ? 'IN STOCK' : 'OUT OF STOCK'}
                  </span>
                </div>

                {/* Title & Category */}
                <div>
                  <h3 className="font-extrabold text-white text-base leading-snug">{prod.title}</h3>
                  <p className="text-slate-400 text-xs font-semibold mt-0.5">{prod.category}</p>
                </div>

                {/* Vertical Description Points Preview */}
                {Array.isArray(prod.description_points) && prod.description_points.length > 0 && (
                  <ul className="space-y-1 text-xs text-slate-300 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80">
                    {prod.description_points.slice(0, 3).map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span className="line-clamp-1">{pt}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Price Display */}
                <div className="flex items-center gap-3 pt-1">
                  <span className="text-lg font-black text-white">₹{prod.price}</span>
                  {prod.original_price > prod.price && (
                    <span className="text-xs text-slate-500 line-through">₹{prod.original_price}</span>
                  )}
                  {prod.discount && (
                    <span className="text-[10px] font-extrabold bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded">
                      {prod.discount}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons (Mobile First Touch Targets) */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleMoveProductOrder(index, 'UP')}
                    disabled={index === 0}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleMoveProductOrder(index, 'DOWN')}
                    disabled={index === filteredProducts.length - 1}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleToggleProductStatus(prod)}
                    className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                      prod.is_active !== false ? 'bg-emerald-950 border-emerald-800 text-emerald-300' : 'bg-red-950 border-red-800 text-red-300'
                    }`}
                    title="Toggle Active Status"
                  >
                    <Power className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(prod)}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-purple-400" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(prod.id, prod.title)}
                    className="px-2.5 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 text-xs font-bold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* MOBILE-FIRST PRODUCT EDIT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl space-y-4 font-sans my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-black text-white text-base">
                {editingProduct.id ? 'Edit Product Details' : 'Add New Product'}
              </h3>
              <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-white font-bold text-base">✕</button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Product Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={editingProduct.title || ''}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
                  <select
                    name="category"
                    defaultValue={editingProduct.category || categories[0]?.name}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs font-bold"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Stock Status</label>
                  <select
                    name="in_stock"
                    defaultValue={editingProduct.in_stock !== false ? 'true' : 'false'}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs font-bold"
                  >
                    <option value="true">In Stock</option>
                    <option value="false">Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* SECTION ASSIGNMENTS (Part 6) */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <label className="block text-xs font-extrabold text-purple-400 uppercase tracking-wider">
                  Display In Section Assignment (CMS Rule)
                </label>
                <p className="text-[11px] text-slate-400">Select where this product will appear publicly:</p>
                <div className="flex flex-wrap gap-4 pt-1 text-xs font-bold text-white">
                  {['Home', 'Offers', 'All OTTs'].map((secKey) => {
                    const sectionsArr = Array.isArray(editingProduct.sections) ? editingProduct.sections : ['Home', 'All OTTs'];
                    const fieldName = secKey === 'Home' ? 'sec_home' : secKey === 'Offers' ? 'sec_offers' : 'sec_all_otts';
                    return (
                      <label key={secKey} className="flex items-center gap-2 cursor-pointer bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
                        <input
                          type="checkbox"
                          name={fieldName}
                          value="true"
                          defaultChecked={sectionsArr.includes(secKey)}
                          className="w-4 h-4 accent-[#008744]"
                        />
                        <span>{secKey}</span>
                      </label>
                    );
                  })}
                </div>
                            {/* VERTICAL DESCRIPTION POINTS (Part 8) */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
                    Vertical Description Points (Line-by-Line)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddDescPoint}
                    className="px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 text-[11px] font-bold rounded-lg border border-emerald-800 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Point
                  </button>
                </div>

                <div className="space-y-2">
                  {descPoints.map((pt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">{idx + 1}.</span>
                      <input
                        type="text"
                        value={pt}
                        onChange={(e) => {
                          const updated = [...descPoints];
                          updated[idx] = e.target.value;
                          setDescPoints(updated);
                        }}
                        placeholder={`Point ${idx + 1}...`}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setDescPoints(descPoints.filter((_, i) => i !== idx))}
                        className="p-2 text-red-400 hover:text-red-300 font-bold text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* CUSTOM INFO MATTER (Part 11) */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">
                    Custom Product Information Matter
                  </label>
                  <button
                    type="button"
                    onClick={handleAddCustomPoint}
                    className="px-2.5 py-1 bg-amber-950 hover:bg-amber-900 text-amber-300 text-[11px] font-bold rounded-lg border border-amber-800 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Custom Matter
                  </button>
                </div>    </div>

                <div className="space-y-2">
                  {customInfoPoints.map((pt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={pt}
                        onChange={(e) => {
                          const updated = [...customInfoPoints];
                          updated[idx] = e.target.value;
                          setCustomInfoPoints(updated);
                        }}
                        placeholder="e.g. Instant Activation, WhatsApp Support..."
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setCustomInfoPoints(customInfoPoints.filter((_, i) => i !== idx))}
                        className="p-2 text-red-400 hover:text-red-300 font-bold text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* PRICE & DISCOUNT */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Offer Price ₹ *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    required
                    defaultValue={editingProduct.price || ''}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Original Price ₹</label>
                  <input
                    type="number"
                    step="0.01"
                    name="original_price"
                    defaultValue={editingProduct.original_price || ''}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Discount Tag</label>
                  <input
                    type="text"
                    name="discount"
                    defaultValue={editingProduct.discount || ''}
                    placeholder="60% OFF"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs font-bold"
                  />
                </div>
              </div>

              {/* PRODUCT IMAGE */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Product Image URL *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="image"
                    id="prod_img_input"
                    required
                    defaultValue={editingProduct.image || ''}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs font-mono"
                  />
                  <label className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5" /> Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUploadInput(e, 'prod_img_input')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* SAVE / CANCEL */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#008744] hover:bg-emerald-600 text-white text-xs font-bold shadow-lg"
                >
                  Save Product
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
