import React, { useState } from 'react';
import { 
  Palette, Plus, Edit3, Trash2, Power, Eye, Check, Upload, Type, Square, Layout, Sparkles, ArrowUp, ArrowDown 
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { uploadToCloudinary } from '../../services/cloudinary';
import ThemeSection from '../../components/ThemeSection';

export default function ThemesManager({ adminEmail }) {
  const { themes, saveCmsItem, deleteCmsItem, logActivity, refreshAllData } = useCMS();

  const [editingTheme, setEditingTheme] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('editor'); // 'editor', 'preview'
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleToggleThemeStatus = async (themeObj) => {
    try {
      const updated = { ...themeObj, is_active: !themeObj.is_active };
      await saveCmsItem('themes', updated);
      await logActivity(adminEmail, updated.is_active ? 'ENABLED' : 'DISABLED', 'Themes', themeObj.name);
      refreshAllData();
      showToast(updated.is_active ? 'Theme Enabled' : 'Theme Disabled');
    } catch (err) {
      alert('Error updating theme: ' + err.message);
    }
  };

  const handleDeleteTheme = async (id, name) => {
    if (!window.confirm(`Delete theme "${name}"?`)) return;
    try {
      await deleteCmsItem('themes', id);
      await logActivity(adminEmail, 'DELETED', 'Themes', name);
      refreshAllData();
      showToast('Theme Deleted.');
    } catch (err) {
      alert('Error deleting theme: ' + err.message);
    }
  };

  const openThemeEditor = (themeObj) => {
    setEditingTheme({
      id: themeObj?.id,
      theme_key: themeObj?.theme_key || `theme_${Date.now()}`,
      name: themeObj?.name || 'Theme 01 — New Visual Block',
      description: themeObj?.description || 'Custom Canva-style Theme block',
      layout_data: Array.isArray(themeObj?.layout_data) ? themeObj.layout_data : [
        { id: 'b1', type: 'heading', content: 'Special Announcement Header', fontSize: '22px', fontWeight: 'bold', textColor: '#ffffff', alignment: 'center' },
        { id: 'b2', type: 'paragraph', content: 'Add custom text, buttons, background colors, and borders here.', fontSize: '14px', textColor: '#cbd5e1', alignment: 'center' },
        { id: 'b3', type: 'button', content: 'Explore Now', linkUrl: 'offers', buttonColor: '#e50914', textColor: '#ffffff', border: true, borderRadius: '10px', alignment: 'center' }
      ],
      styles: themeObj?.styles || {
        bgColor: '#0f172a',
        borderColor: '#e50914',
        borderWidth: '2px',
        borderRadius: '16px',
        padding: '24px'
      },
      is_active: themeObj ? themeObj.is_active !== false : true
    });
    setActiveSubTab('editor');
  };

  const handleAddBlock = (blockType) => {
    if (!editingTheme) return;

    let newBlock = { id: `blk_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`, type: blockType, alignment: 'center' };

    if (blockType === 'heading') {
      newBlock = { ...newBlock, content: 'New Heading Text', fontSize: '22px', fontWeight: 'bold', textColor: '#ffffff' };
    } else if (blockType === 'paragraph') {
      newBlock = { ...newBlock, content: 'Write custom description text here.', fontSize: '14px', textColor: '#cbd5e1' };
    } else if (blockType === 'button') {
      newBlock = { ...newBlock, content: 'Click Button', linkUrl: 'offers', buttonColor: '#e50914', textColor: '#ffffff', border: true, borderRadius: '8px' };
    } else if (blockType === 'box') {
      newBlock = { ...newBlock, heading: 'Custom Feature Box', description: 'Box content matter with border controls', bgColor: '#1e293b', borderColor: '#334155', borderWidth: '1px', borderRadius: '12px', padding: '16px', textColor: '#ffffff', buttonText: 'Learn More', linkUrl: 'contact' };
    } else if (blockType === 'image') {
      newBlock = { ...newBlock, content: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&auto=format&fit=crop&q=80', alt: 'Promo Banner', borderRadius: '12px', border: true, borderColor: '#334155' };
    } else if (blockType === 'tags') {
      newBlock = { ...newBlock, tagsList: [{ text: 'MEGA DEAL', bgColor: '#e50914', textColor: '#ffffff' }, { text: 'LIMITED TIME', bgColor: '#f59e0b', textColor: '#000000' }] };
    }

    setEditingTheme({
      ...editingTheme,
      layout_data: [...editingTheme.layout_data, newBlock]
    });
  };

  const handleRemoveBlock = (blockId) => {
    setEditingTheme({
      ...editingTheme,
      layout_data: editingTheme.layout_data.filter(b => b.id !== blockId)
    });
  };

  const handleMoveBlock = (index, direction) => {
    const arr = [...editingTheme.layout_data];
    const targetIdx = direction === 'UP' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= arr.length) return;

    const temp = arr[index];
    arr[index] = arr[targetIdx];
    arr[targetIdx] = temp;

    setEditingTheme({ ...editingTheme, layout_data: arr });
  };

  const handleUpdateBlockField = (blockId, field, val) => {
    setEditingTheme({
      ...editingTheme,
      layout_data: editingTheme.layout_data.map(b => b.id === blockId ? { ...b, [field]: val } : b)
    });
  };

  const handleSaveTheme = async (e) => {
    if (e) e.preventDefault();
    if (!editingTheme) return;
    setSaving(true);

    try {
      const payload = {
        id: editingTheme.id,
        name: editingTheme.name,
        theme_key: editingTheme.theme_key,
        description: editingTheme.description,
        layout_data: editingTheme.layout_data,
        styles: editingTheme.styles,
        is_active: editingTheme.is_active
      };

      await saveCmsItem('themes', payload);
      await logActivity(adminEmail, editingTheme.id ? 'EDITED' : 'ADDED', 'Themes', payload.name);
      await refreshAllData();
      setEditingTheme(null);
      showToast('Theme Saved to Supabase Successfully.');
    } catch (err) {
      alert('Error saving theme: ' + err.message);
    } finally {
      setSaving(false);
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
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Palette className="w-6 h-6 text-pink-500" /> Themes &amp; Visual Page Builder
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create custom visual section themes with Canva-style element controls (Text, Colors, Borders, Buttons, Boxes).
          </p>
        </div>

        <button
          onClick={() => openThemeEditor()}
          className="px-4 py-2.5 rounded-xl bg-[#008744] hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Create New Theme
        </button>
      </div>

      {/* THEMES GRID LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {themes.map((t) => (
          <div key={t.id || t.theme_key} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 font-sans flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-200">
                    {t.theme_key}
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-base mt-1">{t.name}</h3>
                </div>

                <button
                  onClick={() => handleToggleThemeStatus(t)}
                  className={`px-3 py-1 rounded-xl text-xs font-black border transition-all ${
                    t.is_active !== false ? 'bg-emerald-950 border-emerald-800 text-emerald-300' : 'bg-red-950 border-red-800 text-red-300'
                  }`}
                >
                  {t.is_active !== false ? 'ACTIVE' : 'OFF'}
                </button>
              </div>

              <p className="text-xs text-slate-300">{t.description}</p>
              <div className="text-[11px] text-slate-400 font-medium">
                Blocks: <span className="font-bold text-white">{Array.isArray(t.layout_data) ? t.layout_data.length : 0} Elements</span>
              </div>

              {/* Theme Live Mini Renderer */}
              <div className="rounded-xl border border-slate-800 p-2 overflow-hidden bg-slate-950">
                <ThemeSection theme={t} />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => openThemeEditor(t)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Edit3 className="w-4 h-4 text-purple-400" /> Edit Visual Theme
              </button>
              <button
                onClick={() => handleDeleteTheme(t.id, t.name)}
                className="px-3 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 font-bold text-xs"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CANVA-STYLE VISUAL THEME EDITOR MODAL */}
      {editingTheme && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto pt-16 sm:pt-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl space-y-4 font-sans my-2 max-h-[85vh] flex flex-col justify-between overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
              <div>
                <h3 className="font-black text-white text-base sm:text-lg flex items-center gap-2">
                  <Palette className="w-5 h-5 text-pink-500" /> Theme Visual Builder
                </h3>
                <p className="text-xs text-slate-400">Design sections freely with text, color, border, box, and button controls.</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setActiveSubTab('editor')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'editor' ? 'bg-[#008744] text-white' : 'text-slate-400'}`}
                  >
                    Editor
                  </button>
                  <button
                    onClick={() => setActiveSubTab('preview')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'preview' ? 'bg-[#008744] text-white' : 'text-slate-400'}`}
                  >
                    Live Preview
                  </button>
                </div>
                <button onClick={() => setEditingTheme(null)} className="p-2 text-slate-400 hover:text-white font-bold text-base">✕</button>
              </div>
            </div>

            {/* Modal Body Scroll Area */}
            <div className="overflow-y-auto flex-1 pr-1 space-y-6">
              
              {activeSubTab === 'preview' ? (
                <div className="space-y-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <h4 className="text-xs font-black uppercase text-pink-400 tracking-wider">Public Website Render Preview</h4>
                  <ThemeSection theme={editingTheme} />
                </div>
              ) : (
                <div className="space-y-6">
                  
                  {/* Theme Info & Global Container Styles */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Theme Name (e.g. Theme 01)</label>
                      <input
                        type="text"
                        value={editingTheme.name}
                        onChange={(e) => setEditingTheme({ ...editingTheme, name: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Theme ID / Key</label>
                      <input
                        type="text"
                        value={editingTheme.theme_key}
                        onChange={(e) => setEditingTheme({ ...editingTheme, theme_key: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white text-xs font-mono"
                      />
                    </div>

                    {/* Container Style Controls */}
                    <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">Bg Color</label>
                        <input
                          type="color"
                          value={editingTheme.styles?.bgColor || '#0f172a'}
                          onChange={(e) => setEditingTheme({ ...editingTheme, styles: { ...editingTheme.styles, bgColor: e.target.value } })}
                          className="w-full h-8 bg-slate-900 border border-slate-700 rounded-xl cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">Border Color</label>
                        <input
                          type="color"
                          value={editingTheme.styles?.borderColor || '#e50914'}
                          onChange={(e) => setEditingTheme({ ...editingTheme, styles: { ...editingTheme.styles, borderColor: e.target.value } })}
                          className="w-full h-8 bg-slate-900 border border-slate-700 rounded-xl cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">Border Width</label>
                        <input
                          type="text"
                          value={editingTheme.styles?.borderWidth || '2px'}
                          onChange={(e) => setEditingTheme({ ...editingTheme, styles: { ...editingTheme.styles, borderWidth: e.target.value } })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">Corner Radius</label>
                        <input
                          type="text"
                          value={editingTheme.styles?.borderRadius || '16px'}
                          onChange={(e) => setEditingTheme({ ...editingTheme, styles: { ...editingTheme.styles, borderRadius: e.target.value } })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Add Element Blocks Toolbar */}
                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase text-slate-400 tracking-wider">
                      Add Component Blocks
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddBlock('heading')}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                      >
                        <Type className="w-3.5 h-3.5 text-blue-400" /> Heading
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddBlock('paragraph')}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                      >
                        <Type className="w-3.5 h-3.5 text-slate-400" /> Paragraph / Text
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddBlock('button')}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                      >
                        <Square className="w-3.5 h-3.5 text-red-400" /> Button
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddBlock('box')}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                      >
                        <Layout className="w-3.5 h-3.5 text-purple-400" /> Custom Box
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddBlock('image')}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5 text-emerald-400" /> Image
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddBlock('tags')}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Tags / Badges
                      </button>
                    </div>
                  </div>

                  {/* Component Blocks List */}
                  <div className="space-y-4">
                    {editingTheme.layout_data.map((blk, idx) => (
                      <div key={blk.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-800 text-amber-300">
                              #{idx + 1} {blk.type}
                            </span>
                            <span className="text-xs font-bold text-slate-300 truncate max-w-xs">
                              {blk.content || blk.heading || 'Element'}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleMoveBlock(idx, 'UP')}
                              disabled={idx === 0}
                              className="p-1 rounded bg-slate-800 text-slate-300 disabled:opacity-30"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveBlock(idx, 'DOWN')}
                              disabled={idx === editingTheme.layout_data.length - 1}
                              className="p-1 rounded bg-slate-800 text-slate-300 disabled:opacity-30"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveBlock(blk.id)}
                              className="p-1 text-red-400 hover:text-red-300 font-bold text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        </div>

                        {/* Block Element Fine-Grained Controls */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          
                          {/* Content / Text */}
                          <div className="sm:col-span-2">
                            <label className="block text-[10px] font-bold text-slate-400 mb-1">Content Matter / Text</label>
                            <input
                              type="text"
                              value={blk.content || blk.heading || ''}
                              onChange={(e) => handleUpdateBlockField(blk.id, blk.type === 'box' ? 'heading' : 'content', e.target.value)}
                              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white text-xs"
                            />
                          </div>

                          {/* Alignment */}
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 mb-1">Alignment</label>
                            <select
                              value={blk.alignment || 'left'}
                              onChange={(e) => handleUpdateBlockField(blk.id, 'alignment', e.target.value)}
                              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white text-xs font-bold"
                            >
                              <option value="left">Left</option>
                              <option value="center">Center</option>
                              <option value="right">Right</option>
                            </select>
                          </div>

                          {/* Button Link if type === 'button' */}
                          {blk.type === 'button' && (
                            <div className="sm:col-span-2">
                              <label className="block text-[10px] font-bold text-slate-400 mb-1">Button Action Link (URL / Section)</label>
                              <input
                                type="text"
                                value={blk.linkUrl || 'offers'}
                                onChange={(e) => handleUpdateBlockField(blk.id, 'linkUrl', e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white text-xs"
                              />
                            </div>
                          )}

                          {/* Color Controls */}
                          {(blk.type === 'heading' || blk.type === 'paragraph' || blk.type === 'button') && (
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 mb-1">Text Color</label>
                              <input
                                type="color"
                                value={blk.textColor || '#ffffff'}
                                onChange={(e) => handleUpdateBlockField(blk.id, 'textColor', e.target.value)}
                                className="w-full h-8 bg-slate-900 border border-slate-700 rounded-xl cursor-pointer"
                              />
                            </div>
                          )}

                          {blk.type === 'button' && (
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 mb-1">Button Color</label>
                              <input
                                type="color"
                                value={blk.buttonColor || '#e50914'}
                                onChange={(e) => handleUpdateBlockField(blk.id, 'buttonColor', e.target.value)}
                                className="w-full h-8 bg-slate-900 border border-slate-700 rounded-xl cursor-pointer"
                              />
                            </div>
                          )}

                        </div>

                      </div>
                    ))}
                  </div>

                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => setEditingTheme(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveTheme}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-[#008744] hover:bg-emerald-600 text-white text-xs font-bold shadow-lg"
              >
                {saving ? 'Saving Theme...' : 'Save & Publish Visual Theme'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
