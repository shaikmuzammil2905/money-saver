import React, { useState } from 'react';
import { Search, ShoppingCart, MapPin, Phone, MessageCircle, Menu, X, Flame, ChevronRight } from 'lucide-react';

export default function Header({ 
  cartCount, 
  onOpenCart, 
  onOpenWhatsApp, 
  searchQuery, 
  setSearchQuery, 
  activeTab, 
  setActiveTab,
  user,
  onOpenProfile,
  onOpenAuthModal
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'OTT Plans', id: 'ott-plans' },
    { name: 'Fiber Internet', id: 'fiber' },
    { name: 'Mobiles & Gadgets', id: 'mobiles' },
    { name: 'Electronics', id: 'electronics' },
    { name: 'Offers', id: 'offers' },
    { name: 'Contact', id: 'contact' },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950 text-white shadow-xl font-sans">
      {/* Top Announcement Bar */}
      <div className="bg-[#e50914] text-white py-1.5 px-4 text-xs md:text-sm font-medium flex flex-wrap items-center justify-between gap-2 shadow-inner">
        <div className="flex items-center gap-2 max-w-full overflow-hidden whitespace-nowrap">
          <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-extrabold uppercase tracking-wider flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-300 animate-pulse" /> BIG SAVINGS!
          </span>
          <span className="truncate font-semibold">Save More. Get More. Spend Smart.</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-xs text-slate-100">
          <span className="flex items-center gap-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-amber-300" /> Hyderabad, Telangana, India
          </span>
          <span className="text-slate-400">|</span>
          <a href="tel:6305151531" className="flex items-center gap-1 hover:text-white transition-colors font-bold">
            <Phone className="w-3.5 h-3.5 text-amber-300" /> 6305151531
          </a>
          <span className="text-slate-400">|</span>
          <button onClick={onOpenWhatsApp} className="flex items-center gap-1 text-emerald-300 hover:text-emerald-200 transition-colors font-bold">
            <MessageCircle className="w-3.5 h-3.5 fill-current" /> WhatsApp
          </button>
        </div>
      </div>

      {/* Main Header Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => handleNavClick('home')}>
          <div className="h-9 md:h-11 w-auto flex items-center shrink-0">
            <img 
              src="/image.png" 
              alt="OTTMoneySaver Logo" 
              className="h-full object-contain max-h-11 rounded shadow-sm group-hover:scale-105 transition-transform duration-200" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
          </div>
          <span className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-1 font-sans">
            <span className="text-[#e50914]">OTT</span>
            <span className="text-white">Money</span>
            <span className="text-[#008744]">Saver</span>
          </span>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`transition-colors duration-200 py-1 relative ${
                activeTab === link.id ? 'text-[#008744] font-extrabold' : 'text-slate-200 hover:text-[#e50914]'
              }`}
            >
              {link.name}
              {activeTab === link.id && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#008744] rounded-full"></span>
              )}
            </button>
          ))}
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          {/* Search Bar Input */}
          <div className="relative hidden md:block w-44 lg:w-56">
            <input
              type="text"
              placeholder="Search products, plans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 text-white placeholder-slate-400 text-xs rounded-full py-2 pl-9 pr-4 border border-slate-800 focus:outline-none focus:border-[#e50914] focus:ring-1 focus:ring-[#e50914] transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* User Account / Profile Button */}
          {user ? (
            <button
              onClick={onOpenProfile}
              className="p-1.5 sm:px-3 sm:py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-full sm:rounded-xl text-xs font-extrabold text-white flex items-center gap-1.5 transition-all"
              title="Customer Profile"
            >
              <div className="w-6 h-6 rounded-full bg-[#008744] text-white flex items-center justify-center text-xs font-black shrink-0">
                {user.fullName?.charAt(0)?.toUpperCase() || 'C'}
              </div>
              <span className="hidden sm:inline line-clamp-1 max-w-[80px]">{user.fullName?.split(' ')[0]}</span>
            </button>
          ) : (
            <button
              onClick={() => onOpenAuthModal('login')}
              className="px-3 py-1.5 rounded-full sm:rounded-xl bg-[#e50914] hover:bg-red-700 text-white text-xs font-black transition-all shadow-sm flex items-center gap-1"
            >
              <span>Login</span>
            </button>
          )}

          {/* Cart Icon with Badge */}
          <button
            onClick={onOpenCart}
            className="relative p-2 text-slate-200 hover:text-white hover:bg-slate-900 rounded-full transition-colors flex items-center gap-1 group"
            aria-label="Open Shopping Cart"
          >
            <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 bg-[#e50914] text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-950 animate-bounce">
              {cartCount}
            </span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-200 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-t border-slate-800 px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          {/* Mobile Search */}
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Search products, plans..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 text-white placeholder-slate-400 text-sm rounded-lg py-2.5 pl-9 pr-4 border border-slate-800 focus:outline-none focus:border-[#e50914]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>

          {/* Mobile Nav Links */}
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`flex items-center justify-between text-left py-2.5 px-3 rounded-lg text-sm font-semibold transition-colors ${
                  activeTab === link.id ? 'bg-slate-800 text-[#008744] font-bold' : 'text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>📍 Hyderabad, Telangana</span>
            <a href="tel:6305151531" className="text-amber-400 font-bold">📞 6305151531</a>
          </div>
        </div>
      )}
    </header>
  );
}
