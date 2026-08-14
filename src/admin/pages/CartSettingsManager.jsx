import React, { useState } from 'react';
import { 
  ShoppingCart, CreditCard, MessageCircle, Phone, Check, Copy, Sparkles, HelpCircle 
} from 'lucide-react';
import { useCMS } from '../../context/CMSContext';

export default function CartSettingsManager({ adminEmail }) {
  const { 
    cartSettings, setCartSettings, 
    whatsAppTemplate, setWhatsAppTemplate,
    saveCmsItem, logActivity, refreshAllData 
  } = useCMS();

  const [templateText, setTemplateText] = useState(whatsAppTemplate || '');
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const dynamicVariables = [
    '{PRODUCTS}',
    '{CUSTOMER_NAME}',
    '{CUSTOMER_PHONE}',
    '{CUSTOMER_LOCATION}',
    '{CUSTOMER_EMAIL}',
    '{TOTAL}',
    '{ORDER_ID}',
    '{PAYMENT_SCREENSHOT}'
  ];

  const handleInsertVariable = (variableStr) => {
    setTemplateText((prev) => prev + ' ' + variableStr + ' ');
  };

  const handleSavePaymentConfig = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData(e.target);
      const payload = {
        id: cartSettings?.id,
        gpay_link: formData.get('gpay_link'),
        phonepe_link: formData.get('phonepe_link'),
        upi_id: formData.get('upi_id'),
        whatsapp_number: formData.get('whatsapp_number'),
        whatsapp_number_secondary: formData.get('whatsapp_number_secondary'),
        phone_number: formData.get('phone_number'),
        phone_number_secondary: formData.get('phone_number_secondary'),
        business_location: formData.get('business_location')
      };

      await saveCmsItem('cart_settings', payload);
      await logActivity(adminEmail, 'UPDATED', 'Cart Payment Links');
      refreshAllData();
      showToast('Payment Links & Numbers Saved.');
    } catch (err) {
      alert('Error updating payment settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveWhatsAppTemplate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        template_key: 'order_checkout',
        template_text: templateText
      };

      await saveCmsItem('whatsapp_templates', payload);
      await logActivity(adminEmail, 'UPDATED', 'WhatsApp Template');
      refreshAllData();
      showToast('WhatsApp Message Template Saved.');
    } catch (err) {
      alert('Error saving WhatsApp template: ' + err.message);
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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-[#008744]" /> Cart & Payment Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure payment links (GPay, PhonePe, UPI) and edit the dynamic WhatsApp order message template.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* PAYMENT LINKS & CONTACT NUMBERS FORM */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <CreditCard className="w-5 h-5 text-[#e50914]" /> Payment Links & Numbers
          </h2>

          <form onSubmit={handleSavePaymentConfig} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">UPI ID (For copy-paste)</label>
              <input
                type="text"
                name="upi_id"
                required
                defaultValue={cartSettings?.upi_id || '6305151531@ybl'}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Google Pay UPI / Payment Link</label>
              <input
                type="text"
                name="gpay_link"
                required
                defaultValue={cartSettings?.gpay_link || 'upi://pay?pa=6305151531@ybl&pn=OTTMoneySaver&cu=INR'}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">PhonePe UPI / Payment Link</label>
              <input
                type="text"
                name="phonepe_link"
                required
                defaultValue={cartSettings?.phonepe_link || 'upi://pay?pa=6305151531@ybl&pn=OTTMoneySaver&cu=INR'}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Primary WhatsApp Number</label>
                <input
                  type="text"
                  name="whatsapp_number"
                  required
                  defaultValue={cartSettings?.whatsapp_number || '916305151531'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Secondary WhatsApp</label>
                <input
                  type="text"
                  name="whatsapp_number_secondary"
                  defaultValue={cartSettings?.whatsapp_number_secondary || '917013931261'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Phone Number</label>
                <input
                  type="text"
                  name="phone_number"
                  required
                  defaultValue={cartSettings?.phone_number || '6305151531'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Secondary Phone Number</label>
                <input
                  type="text"
                  name="phone_number_secondary"
                  defaultValue={cartSettings?.phone_number_secondary || '7013931261'}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Business Location</label>
              <input
                type="text"
                name="business_location"
                defaultValue={cartSettings?.business_location || 'Hyderabad, Telangana, India'}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 rounded-xl bg-[#008744] hover:bg-emerald-600 text-white font-bold text-xs shadow-lg transition-all"
            >
              {saving ? 'Updating...' : 'Save Payment & Contact Settings'}
            </button>
          </form>
        </div>

        {/* WHATSAPP MESSAGE TEMPLATE EDITOR */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <MessageCircle className="w-5 h-5 text-emerald-400" /> WhatsApp Order Message Template
          </h2>

          <p className="text-xs text-slate-400">
            Customize the message sent to WhatsApp when a customer places an order. Click any dynamic variable below to insert it into the template.
          </p>

          {/* Dynamic Variable Chips */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Available Dynamic Variables:</p>
            <div className="flex flex-wrap gap-1.5">
              {dynamicVariables.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => handleInsertVariable(v)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-700/80 hover:bg-emerald-800 text-emerald-300 font-mono text-[11px] font-bold transition-all shadow-sm"
                >
                  + {v}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSaveWhatsAppTemplate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Message Template</label>
              <textarea
                rows="12"
                required
                value={templateText}
                onChange={(e) => setTemplateText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-emerald-300 font-mono text-xs leading-relaxed focus:outline-none focus:border-emerald-500"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 rounded-xl bg-[#008744] hover:bg-emerald-600 text-white font-bold text-xs shadow-lg transition-all"
            >
              {saving ? 'Saving...' : 'Save WhatsApp Message Template'}
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
