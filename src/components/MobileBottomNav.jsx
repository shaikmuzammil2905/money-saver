import React from 'react';
import { Home, Grid, Tag, ShoppingCart, MessageCircle } from 'lucide-react';

export default function MobileBottomNav({ activeTab, setActiveTab, cartCount, onOpenCart, onOpenWhatsApp }) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-2xl px-2 py-1.5 flex items-center justify-around font-sans">
      {/* Home */}
      <button
        onClick={() => {
          setActiveTab('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-colors ${
          activeTab === 'home' ? 'text-[#e50914] font-bold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px]">Home</span>
      </button>

      {/* Categories */}
      <button
        onClick={() => {
          setActiveTab('mobiles');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-colors ${
          activeTab === 'mobiles' ? 'text-[#e50914] font-bold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Grid className="w-5 h-5" />
        <span className="text-[10px]">Categories</span>
      </button>

      {/* Offers */}
      <button
        onClick={() => {
          setActiveTab('offers');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-colors ${
          activeTab === 'offers' ? 'text-[#e50914] font-bold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Tag className="w-5 h-5" />
        <span className="text-[10px]">Offers</span>
      </button>

      {/* Cart */}
      <button
        onClick={onOpenCart}
        className="relative flex flex-col items-center gap-0.5 py-1 px-3 text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ShoppingCart className="w-5 h-5" />
        <span className="text-[10px]">Cart</span>
        <span className="absolute top-0 right-2 bg-[#e50914] text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-white">
          {cartCount}
        </span>
      </button>

      {/* Contact / WhatsApp */}
      <button
        onClick={() => {
          setActiveTab('contact');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-colors ${
          activeTab === 'contact' ? 'text-[#e50914] font-bold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-[10px]">Contact</span>
      </button>
    </div>
  );
}
