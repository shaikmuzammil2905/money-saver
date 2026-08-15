import React, { useState } from 'react';
import { 
  Tag, Plus, Edit3, Trash2, Power, Check, Sparkles, Layers, Palette 
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';

export default function BadgesManager({ adminEmail }) {
  const { 
    badges, setBadges, 
    batches, setBatches,
    saveCmsItem, deleteCmsItem, logActivity, refreshAllData 
  } = useCMS();

  const [editingBadge, setEditingBadge] = useState(null);
  const [editingBatch, setEditingBatch] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleToggleBadgeStatus = async (badge) => {
    try {
      const updated = { ...badge, is_active: !badge.is_active };
      await saveCmsItem('badges', updated);
      await logActivity(adminEmail, updated.is_active ? 'ENABLED' : 'DISABLED', 'Badges', badge.name);
      refreshAllData();
      showToast(updated.is_active ? 'Badge Enabled' : 'Badge Disabled');
    } catch (err) {
      alert('Error toggling badge status: ' + err.message);
    }
  };

  const handleDeleteBadge = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete badge "${name}"?`)) return;
    try {
      await deleteCmsItem('badges', id);
      await logActivity(adminEmail, 'DELETED', 'Badges', name);
      refreshAllData();
      showToast('Badge Deleted.');
    } catch (err) {
      alert('Error deleting badge: ' + err.message);
    }
  };

  const handleSaveBadge = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData(e.target);
      const name = formData.get('name');
      const payload = {
        id: editingBadge?.id,
        name: name,
        text: formData.get('text') || name,
        bg_color: formData.get('bg_color') || '#e50914',
        text_color: formData.get('text_color') || '#ffffff',
        position: formData.get('position') || 'top-right',
        is_active: editingBadge ? editingBadge.is_active : true
      };

      await saveCmsItem('badges', payload);
      await logActivity(adminEmail, editingBadge?.id ? 'EDITED' : 'ADDED', 'Badges', payload.name);
      refreshAllData();
      setEditingBadge(null);
      showToast('Badge Saved Successfully.');
    } catch (err) {
      alert('Error saving badge: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBatch = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData(e.target);
      const name = formData.get('name');
      const payload = {
        id: editingBatch?.id,
        name: name,
        slug: editingBatch?.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        is_active: editingBatch ? editingBatch.is_active : true,
        display_order: editingBatch ? editingBatch.display_order : batches.length + 1
      };

      await saveCmsItem('product_batches', payload);
      await logActivity(adminEmail, editingBatch?.id ? 'EDITED' : 'ADDED', 'Batches', payload.name);
      refreshAllData();
      setEditingBatch(null);
      showToast('Batch Saved Successfully.');
    } catch (err) {
      alert('Error saving batch: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBatch = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete batch "${name}"?`)) return;
    try {
      await deleteCmsItem('product_batches', id);
      await logActivity(adminEmail, 'DELETED', 'Batches', name);
      refreshAllData();
      showToast('Batch Deleted.');
    } catch (err) {
      alert('Error deleting batch: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#008744] text-white px-5 py-3 rounded-xl shadow-2xl font-bold text-xs flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" /> {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Tag className="w-6 h-6 text-amber-500" /> Badges &amp; Batches Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Create custom badges (Best Seller, Hot Deal, Offer, New) and product groups/batches.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setEditingBadge({ name: '', text: '', bg_color: '#e50914', text_color: '#ffffff' })}
            className="px-4 py-2 rounded-xl bg-[#008744] hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg"
          >
            <Plus className="w-4 h-4" /> Add Badge
          </button>
          <button
            onClick={() => setEditingBatch({ name: '' })}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg"
          >
            <Plus className="w-4 h-4" /> Add Batch
          </button>
        </div>
      </div>

      {/* Section 1: Custom Badges Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h2 className="text-base font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Sparkles className="w-5 h-5 text-amber-400" /> Product Overlay Badges
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {badges.map((b) => (
            <div key={b.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span
                  style={{ backgroundColor: b.bg_color || '#e50914', color: b.text_color || '#ffffff' }}
                  className="px-2.5 py-1 rounded-md text-xs font-black shadow"
                >
                  {b.text || b.name}
                </span>
                <div>
                  <h4 className="text-white font-bold text-xs">{b.name}</h4>
                  <span className="text-[10px] text-slate-500 uppercase">{b.position || 'top-right'}</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleToggleBadgeStatus(b)}
                  className={`p-1 rounded-lg text-[10px] font-black border ${
                    b.is_active !== false ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-red-950 text-red-300 border-red-800'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setEditingBadge(b)}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteBadge(b.id, b.name)}
                  className="p-1 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Product Batches / Groups */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h2 className="text-base font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Layers className="w-5 h-5 text-purple-400" /> Product Batches &amp; Special Groups
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {batches.map((bt) => (
            <div key={bt.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <h4 className="text-white font-black text-sm">{bt.name}</h4>
                <span className="text-[10px] text-slate-500 font-mono">slug: {bt.slug}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditingBatch(bt)}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteBatch(bt.id, bt.name)}
                  className="p-1 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EDIT BADGE MODAL */}
      {editingBadge && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">{editingBadge.id ? 'Edit Badge' : 'Add Custom Badge'}</h3>
              <button onClick={() => setEditingBadge(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveBadge} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Badge Name (Internal) *</label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingBadge.name || ''}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Display Text on Product Image *</label>
                <input
                  type="text"
                  name="text"
                  required
                  defaultValue={editingBadge.text || ''}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Background Color</label>
                  <input
                    type="color"
                    name="bg_color"
                    defaultValue={editingBadge.bg_color || '#e50914'}
                    className="w-full h-10 bg-slate-950 border border-slate-700 rounded-xl p-1 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Text Color</label>
                  <input
                    type="color"
                    name="text_color"
                    defaultValue={editingBadge.text_color || '#ffffff'}
                    className="w-full h-10 bg-slate-950 border border-slate-700 rounded-xl p-1 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Badge Position</label>
                <select
                  name="position"
                  defaultValue={editingBadge.position || 'top-right'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                >
                  <option value="top-right">Top Right</option>
                  <option value="top-left">Top Left</option>
                  <option value="bottom-right">Bottom Right</option>
                  <option value="bottom-left">Bottom Left</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingBadge(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#008744] text-white text-xs font-bold"
                >
                  Save Badge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT BATCH MODAL */}
      {editingBatch && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">{editingBatch.id ? 'Edit Batch' : 'Add Batch'}</h3>
              <button onClick={() => setEditingBatch(null)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveBatch} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Batch / Group Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingBatch.name || ''}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingBatch(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold"
                >
                  Save Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
