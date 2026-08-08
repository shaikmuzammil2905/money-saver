import React, { useEffect } from 'react';
import { CheckCircle2, ShoppingBag, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 z-50 max-w-sm bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-slate-800 animate-slideUp font-sans overflow-hidden">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-brand-green/20 text-brand-green shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="flex-1 pr-2">
          <h4 className="text-xs font-extrabold text-white">Added to Cart!</h4>
          <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">{toast.title}</p>
          <span className="text-[10px] font-bold text-brand-green">₹{toast.price?.toLocaleString()}</span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar Timer */}
      <div className="absolute bottom-0 left-0 h-1 bg-brand-green animate-shrinkWidth w-full" />
    </div>
  );
}
