import React, { useState } from 'react';
import { 
  Globe, Upload, Trash2, Check, Image as ImageIcon, Sparkles, Building, Phone, Mail, Share2 
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { uploadToCloudinary } from '../../services/cloudinary';

export default function WebsiteSettingsManager({ adminEmail }) {
  const { 
    siteSettings, setSiteSettings, 
    saveCmsItem, logActivity, refreshAllData 
  } = useCMS();

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadToCloudinary(file, 'website-branding');
      const logoInput = document.getElementById('logo_url_input');
      if (logoInput) logoInput.value = res.url;
      showToast('Logo Uploaded to Cloudinary!');
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData(e.target);
      const updatedValue = {
        ...(siteSettings || {}),
        business_name: formData.get('business_name'),
        logo_url: formData.get('logo_url'),
        favicon_url: formData.get('favicon_url'),
        phone: formData.get('phone'),
        whatsapp: formData.get('whatsapp'),
        email: formData.get('email'),
        address: formData.get('address'),
        website_title: formData.get('website_title'),
        meta_description: formData.get('meta_description'),
        category_layout_style: siteSettings?.category_layout_style || 'grid',
        social_links: {
          facebook: formData.get('facebook') || '',
          instagram: formData.get('instagram') || '',
          twitter: formData.get('twitter') || '',
          youtube: formData.get('youtube') || ''
        }
      };

      const payload = {
        key: 'global_config',
        value: updatedValue
      };

      await saveCmsItem('site_settings', payload);
      await logActivity(adminEmail, 'UPDATED', 'Global Website Settings');
      refreshAllData();

      // Dynamically update document title
      if (updatedValue.website_title) {
        document.title = updatedValue.website_title;
      }

      showToast('Global Website Settings Updated!');
    } catch (err) {
      alert('Error updating settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-sans max-w-4xl">
      
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#008744] text-white px-5 py-3 rounded-xl shadow-2xl font-bold text-xs flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" /> {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <Globe className="w-6 h-6 text-[#008744]" /> Website Settings & Branding
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage Business Name, Logo, Favicon, Meta description, and Social links across the site.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* BRAND LOGO & FAVICON */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <ImageIcon className="w-5 h-5 text-[#e50914]" /> Brand Logo & Identity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Business Name</label>
              <input
                type="text"
                name="business_name"
                required
                defaultValue={siteSettings?.business_name || 'OTTMoneySaver'}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Favicon URL</label>
              <input
                type="text"
                name="favicon_url"
                defaultValue={siteSettings?.favicon_url || '/favicon.ico'}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Website Logo Image URL *</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="logo_url"
                id="logo_url_input"
                required
                defaultValue={siteSettings?.logo_url || '/image.png'}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs font-mono"
              />
              <label className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0">
                <Upload className="w-4 h-4" /> {uploading ? 'Uploading...' : 'Replace Logo'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
            {siteSettings?.logo_url && (
              <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Logo Preview:</span>
                <img src={siteSettings.logo_url} alt="Current Logo" className="h-10 object-contain max-w-xs" />
              </div>
            )}
          </div>
        </div>

        {/* CONTACT & LOCATION */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <Building className="w-5 h-5 text-emerald-400" /> Contact & Location Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Phone</label>
              <input
                type="text"
                name="phone"
                required
                defaultValue={siteSettings?.phone || '6305151531'}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp Number</label>
              <input
                type="text"
                name="whatsapp"
                required
                defaultValue={siteSettings?.whatsapp || '916305151531'}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Support Email</label>
              <input
                type="email"
                name="email"
                required
                defaultValue={siteSettings?.email || 'support@ottmoneysaver.com'}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Address / Location</label>
              <input
                type="text"
                name="address"
                required
                defaultValue={siteSettings?.address || 'Hyderabad, Telangana, India'}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
              />
            </div>
          </div>
        </div>

        {/* SOCIAL MEDIA LINKS */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <Share2 className="w-5 h-5 text-purple-400" /> Social Media Management
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Instagram URL</label>
              <input
                type="url"
                name="instagram"
                defaultValue={siteSettings?.social_links?.instagram || ''}
                placeholder="https://instagram.com/..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Facebook URL</label>
              <input
                type="url"
                name="facebook"
                defaultValue={siteSettings?.social_links?.facebook || ''}
                placeholder="https://facebook.com/..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Twitter / X URL</label>
              <input
                type="url"
                name="twitter"
                defaultValue={siteSettings?.social_links?.twitter || ''}
                placeholder="https://x.com/..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">YouTube Channel URL</label>
              <input
                type="url"
                name="youtube"
                defaultValue={siteSettings?.social_links?.youtube || ''}
                placeholder="https://youtube.com/..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
              />
            </div>
          </div>
        </div>

        {/* SEO META SETTINGS */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <Globe className="w-5 h-5 text-amber-400" /> SEO & Meta Data
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Browser Title</label>
            <input
              type="text"
              name="website_title"
              defaultValue={siteSettings?.website_title || 'OTTMoneySaver — Save Big on OTT, Fiber & Smart Gadgets'}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Meta Description</label>
            <textarea
              name="meta_description"
              rows="3"
              defaultValue={siteSettings?.meta_description || 'Buy discounted OTT subscriptions, high-speed fiber internet, and smart gadgets.'}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 rounded-xl bg-[#008744] hover:bg-emerald-600 text-white font-bold text-xs shadow-xl transition-all"
        >
          {saving ? 'Updating...' : 'Save All Website Settings'}
        </button>

      </form>
    </div>
  );
}
