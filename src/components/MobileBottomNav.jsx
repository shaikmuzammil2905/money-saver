import React from 'react';
import { Home, Grid, Tag, ShoppingCart, User, MessageCircle } from 'lucide-react';

export default function MobileBottomNav({ 
  activeTab, 
  setActiveTab, 
  cartCount, 
  onOpenCart, 
  onOpenWhatsApp,
  user,
  onOpenProfile,
  onOpenAuthModal
}) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-2xl px-2 py-1.5 flex items-center justify-around font-sans">
      {/* Home */}
      <button
        onClick={() => {
          setActiveTab('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-colors ${
          activeTab === 'home' ? 'text-[#e50914] font-bold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px]">Home</span>
      </button>

      {/* Categories */}
      <button
        onClick={() => {
          setActiveTab('view-all');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-colors ${
          activeTab === 'view-all' ? 'text-[#e50914] font-bold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Grid className="w-5 h-5" />
        <span className="text-[10px]">Explore</span>
      </button>

      {/* Offers */}
      <button
        onClick={() => {
          setActiveTab('offers');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-colors ${
          activeTab === 'offers' ? 'text-[#e50914] font-bold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Tag className="w-5 h-5" />
        <span className="text-[10px]">Offers</span>
      </button>

      {/* Cart */}
      <button
        onClick={onOpenCart}
        className="relative flex flex-col items-center gap-0.5 py-1 px-2.5 text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ShoppingCart className="w-5 h-5" />
        <span className="text-[10px]">Cart</span>
        <span className="absolute top-0 right-1.5 bg-[#e50914] text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-white">
          {cartCount}
        </span>
      </button>

      {/* Account / User */}
      <button
        onClick={() => {
          if (user) onOpenProfile();
          else onOpenAuthModal('login');
        }}
        className="flex flex-col items-center gap-0.5 py-1 px-2.5 text-slate-500 hover:text-slate-900 transition-colors"
      >
        <User className="w-5 h-5 text-emerald-600" />
        <span className="text-[10px]">{user ? 'Account' : 'Login'}</span>
      </button>
    </div>
  );
}
