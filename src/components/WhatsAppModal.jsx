import React, { useState } from 'react';
import { X, MessageCircle, Phone, Send } from 'lucide-react';

export default function WhatsAppModal({ isOpen, onClose }) {
  const [message, setMessage] = useState('Hi OTTMoneySaver team, I would like to inquire about your OTT plans and deals!');

  if (!isOpen) return null;

  const handleSend = (phoneNum) => {
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/91${phoneNum}?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl z-10 space-y-5 border border-slate-100">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-emerald-600">
            <MessageCircle className="w-6 h-6 fill-current" />
            <h3 className="text-lg font-black text-slate-900">Chat on WhatsApp</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Your Inquiry Message:</label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div className="space-y-2.5">
          <span className="text-xs font-bold text-slate-500 block">Select Contact Number:</span>
          
          <button
            onClick={() => handleSend('6305151531')}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-between shadow-md transition-colors"
          >
            <span className="flex items-center gap-2">
              <Phone className="w-4 h-4" /> 6305151531 (Primary Support)
            </span>
            <Send className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleSend('7013931261')}
            className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-between shadow-md transition-colors"
          >
            <span className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400" /> 7013931261 (Secondary Support)
            </span>
            <Send className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[11px] text-slate-400 text-center">
          Available 24/7. Instant responses from our Hyderabad team!
        </p>
      </div>
    </div>
  );
}
