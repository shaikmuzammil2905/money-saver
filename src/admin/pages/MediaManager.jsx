import React, { useState } from 'react';
import { 
  Image as ImageIcon, Upload, Search, Copy, Check, Eye, Trash2, Filter 
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { uploadToCloudinary } from '../../services/cloudinary';

export default function MediaManager({ adminEmail }) {
  const { 
    mediaList, setMediaList, 
    saveCmsItem, deleteCmsItem, logActivity, refreshAllData 
  } = useCMS();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [uploading, setUploading] = useState(false);
  const [previewMedia, setPreviewMedia] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleCopyUrl = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast('Copied URL to Clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of files) {
        const result = await uploadToCloudinary(file, 'media-library');
        const mediaRecord = {
          file_name: file.name,
          file_url: result.url,
          public_id: result.public_id,
          file_size: result.bytes,
          file_type: result.format,
          category: selectedCategory === 'All' ? 'general' : selectedCategory
        };

        await saveCmsItem('media', mediaRecord);
        await logActivity(adminEmail, 'UPLOADED_MEDIA', 'Media Library', file.name);
      }
      refreshAllData();
      showToast(`${files.length} Image(s) Uploaded Successfully!`);
    } catch (err) {
      alert('Error uploading media: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMedia = async (mediaItem) => {
    if (!window.confirm(`Delete image "${mediaItem.file_name}"?`)) return;
    try {
      await deleteCmsItem('media', mediaItem.id);
      await logActivity(adminEmail, 'DELETED_MEDIA', 'Media Library', mediaItem.file_name);
      refreshAllData();
      showToast('Media deleted.');
    } catch (err) {
      alert('Error deleting media: ' + err.message);
    }
  };

  const filteredMedia = mediaList.filter((m) => {
    const matchSearch = (m.file_name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === 'All' || m.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#008744] text-white px-5 py-3 rounded-xl shadow-2xl font-bold text-xs flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" /> {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-amber-400" /> Media Library
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Upload, preview, manage, and copy CDN image URLs.
            </p>
          </div>
          <label className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#e50914] to-[#008744] hover:opacity-95 text-white font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer transition-all">
            <Upload className="w-4 h-4" /> {uploading ? 'Uploading...' : 'Upload Image'}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search images by filename..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white"
            />
          </div>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-3 text-xs text-white font-semibold"
            >
              <option value="All">All Media ({mediaList.length})</option>
              <option value="products">Products</option>
              <option value="offers">Offers</option>
              <option value="homepage">Homepage</option>
              <option value="general">General</option>
            </select>
          </div>
        </div>
      </div>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-sm">
          No media files uploaded yet. Click "Upload Image" to add files.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredMedia.map((m) => (
            <div key={m.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-lg group hover:border-slate-700 transition-all flex flex-col justify-between">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-950 border border-slate-800 mb-2">
                <img src={m.file_url} alt={m.file_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPreviewMedia(m)}
                    className="p-2 rounded-xl bg-slate-800 text-white hover:bg-slate-700"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleCopyUrl(m.file_url, m.id)}
                    className="p-2 rounded-xl bg-slate-800 text-white hover:bg-slate-700"
                  >
                    {copiedId === m.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDeleteMedia(m)}
                    className="p-2 rounded-xl bg-red-950 text-red-400 hover:bg-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-white text-xs font-semibold truncate" title={m.file_name}>{m.file_name}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="uppercase">{m.category || 'general'}</span>
                  <button
                    onClick={() => handleCopyUrl(m.file_url, m.id)}
                    className="text-[#008744] hover:underline font-bold"
                  >
                    {copiedId === m.id ? 'Copied!' : 'Copy URL'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Media Detail Modal */}
      {previewMedia && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold text-sm truncate">{previewMedia.file_name}</h3>
              <button onClick={() => setPreviewMedia(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="flex items-center justify-center bg-slate-950 p-2 rounded-xl border border-slate-800 max-h-96 overflow-hidden">
              <img src={previewMedia.file_url} alt={previewMedia.file_name} className="max-h-96 object-contain rounded-lg" />
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-slate-400">Media URL:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={previewMedia.file_url}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-3 text-emerald-300 font-mono text-xs"
                />
                <button
                  onClick={() => handleCopyUrl(previewMedia.file_url, previewMedia.id)}
                  className="px-4 py-2 bg-[#008744] hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shrink-0"
                >
                  <Copy className="w-4 h-4" /> Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
