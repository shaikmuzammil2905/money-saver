import React, { useState, useMemo } from 'react';
import { 
  Package, Search, Plus, Edit3, Trash2, Power, Upload, Check, Star, Filter, ArrowUp, ArrowDown 
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { uploadToCloudinary } from '../../services/cloudinary';

export default function ProductsManager({ adminEmail }) {
  const { 
    products, setProducts, categories, 
    saveCmsItem, deleteCmsItem, updateDisplayOrder, logActivity, refreshAllData 
  } = useCMS();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('All');
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCatFilter === 'All' || p.category === selectedCatFilter || p.category_group === selectedCatFilter;
      return matchSearch && matchCat;
    });
  }, [products, searchQuery, selectedCatFilter]);

  const handleToggleProductStatus = async (prod) => {
    try {
      const updated = { ...prod, is_active: !prod.is_active };
      await saveCmsItem('products', updated);
      await logActivity(adminEmail, updated.is_active ? 'ENABLED' : 'DISABLED', 'Products', prod.title);
      refreshAllData();
      showToast(updated.is_active ? 'Product Enabled' : 'Product Disabled');
    } catch (err) {
      alert('Error toggling status: ' + err.message);
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

  const handleToggleFeatured = async (prod) => {
    try {
      const updated = { ...prod, is_featured: !prod.is_featured };
      await saveCmsItem('products', updated);
      await logActivity(adminEmail, updated.is_featured ? 'FEATURED' : 'UNFEATURED', 'Products', prod.title);
      refreshAllData();
      showToast(updated.is_featured ? 'Featured on Home' : 'Unfeatured');
    } catch (err) {
      alert('Error updating featured state: ' + err.message);
    }
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

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData(e.target);
      const payload = {
        id: editingProduct?.id,
        slug_id: editingProduct?.slug_id || `prod-${Date.now()}`,
        title: formData.get('title'),
        subtitle: formData.get('subtitle'),
        description: formData.get('description'),
        price: parseFloat(formData.get('price')),
        original_price: formData.get('original_price') ? parseFloat(formData.get('original_price')) : parseFloat(formData.get('price')),
        discount: formData.get('discount'),
        image: formData.get('image'),
        images: [formData.get('image')],
        category: formData.get('category'),
        category_group: formData.get('category_group') || formData.get('category'),
        brand: formData.get('brand'),
        sku: formData.get('sku'),
        badge: formData.get('badge'),
        in_stock: formData.get('in_stock') === 'true',
        is_featured: formData.get('is_featured') === 'true',
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
      showToast('Product Image Uploaded!');
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
              <Package className="w-6 h-6 text-[#008744]" /> Products Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Add, edit, delete, reorder, and manage product inventory across all categories.
            </p>
          </div>
          <button
            onClick={() => setEditingProduct({ in_stock: true, is_featured: false, category: 'OTT Platforms' })}
            className="px-4 py-2.5 rounded-xl bg-[#008744] hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" /> Add New Product
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by title or category..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white"
            />
          </div>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedCatFilter}
              onChange={(e) => setSelectedCatFilter(e.target.value)}
              className="w-full sm:w-auto bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-3 text-xs text-white font-semibold"
            >
              <option value="All">All Categories ({products.length})</option>
              <option value="OTT Platforms">OTT Platforms</option>
              <option value="Fiber Internet">Fiber Internet</option>
              <option value="Mobile / Gadgets">Mobile / Gadgets</option>
              <option value="Other Products">Other Products</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm font-medium">
            No products found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Image</th>
                  <th className="py-3 px-4">Title & Subtitle</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <img src={prod.image} alt={prod.title} className="w-12 h-12 object-cover rounded-lg border border-slate-700 bg-slate-950" />
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-white text-sm">{prod.title}</p>
                      {prod.subtitle && <p className="text-slate-400 text-xs line-clamp-1">{prod.subtitle}</p>}
                      {prod.badge && (
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                          {prod.badge}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-black text-emerald-400 text-sm">₹{prod.price}</span>
                      {prod.original_price && (
                        <span className="text-slate-500 line-through text-[10px] block">₹{prod.original_price}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-300">
                      {prod.category}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStock(prod)}
                        className={`px-2.5 py-0.5 rounded font-bold text-[10px] ${
                          prod.in_stock !== false
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-red-950 text-red-300 border border-red-800'
                        }`}
                      >
                        {prod.in_stock !== false ? 'In Stock' : 'Out of Stock'}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleFeatured(prod)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          prod.is_featured
                            ? 'bg-amber-950 border-amber-600 text-amber-300'
                            : 'bg-slate-950 border-slate-800 text-slate-600 hover:text-amber-300'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${prod.is_featured ? 'fill-current' : ''}`} />
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleProductStatus(prod)}
                        className={`px-3 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 transition-all ${
                          prod.is_active !== false
                            ? 'bg-emerald-950 border border-emerald-700 text-emerald-300'
                            : 'bg-red-950 border border-red-800 text-red-300'
                        }`}
                      >
                        <Power className="w-3 h-3" /> {prod.is_active !== false ? 'ON' : 'OFF'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingProduct(prod)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id, prod.title)}
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

      {/* PRODUCT ADD / EDIT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">
                {editingProduct.id ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Product Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={editingProduct.title || ''}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subtitle / Short Spec</label>
                <input
                  type="text"
                  name="subtitle"
                  defaultValue={editingProduct.subtitle || ''}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    required
                    defaultValue={editingProduct.price || ''}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Original Price (₹)</label>
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
                    placeholder="e.g. 40% OFF"
                    defaultValue={editingProduct.discount || ''}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
                  <select
                    name="category"
                    defaultValue={editingProduct.category || 'OTT Platforms'}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                  >
                    <option value="OTT Platforms">OTT Platforms</option>
                    <option value="Fiber Internet">Fiber Internet</option>
                    <option value="Smartphones">Smartphones</option>
                    <option value="Smart Watches">Smart Watches</option>
                    <option value="Earbuds">Earbuds</option>
                    <option value="Bluetooth Speakers">Bluetooth Speakers</option>
                    <option value="Headphones">Headphones</option>
                    <option value="Power Banks">Power Banks</option>
                    <option value="Chargers">Chargers</option>
                    <option value="Smart TVs">Smart TVs</option>
                    <option value="Laptops">Laptops</option>
                    <option value="Other Products">Other Products</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category Group</label>
                  <select
                    name="category_group"
                    defaultValue={editingProduct.category_group || 'Mobile / Gadgets'}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                  >
                    <option value="OTT Platforms">OTT Platforms</option>
                    <option value="Internet Fiber">Internet Fiber</option>
                    <option value="Mobile / Gadgets">Mobile / Gadgets</option>
                    <option value="Other Products">Other Products</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Image URL *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="image"
                    id="prod_image_input"
                    required
                    defaultValue={editingProduct.image || ''}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                  />
                  <label className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5" /> Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUploadInput(e, 'prod_image_input')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Description</label>
                <textarea
                  name="description"
                  rows="3"
                  defaultValue={editingProduct.description || ''}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    name="badge"
                    placeholder="e.g. Best Seller"
                    defaultValue={editingProduct.badge || ''}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Stock Availability</label>
                  <select
                    name="in_stock"
                    defaultValue={editingProduct.in_stock !== false ? 'true' : 'false'}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                  >
                    <option value="true">In Stock</option>
                    <option value="false">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#008744] text-white text-xs font-bold shadow-lg"
                >
                  {saving ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
