import React, { useState } from 'react';
import { Search, ShoppingCart, MapPin, Phone, MessageCircle, Menu, X, Flame, ChevronRight, Lock } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

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
  const { siteSettings, contactDetails } = useCMS();

  const phoneDisplay = contactDetails?.phone || '6305151531';
  const locationDisplay = contactDetails?.address || 'Hyderabad, Telangana, India';
  const logoUrl = siteSettings?.logo_url || '/image.png';

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
    <header className="sticky top-0 z-40 w-full bg-slate-950 text-white shadow-xl font-sans overflow-x-hidden">
      {/* Top Announcement Bar */}
      <div className="bg-[#e50914] text-white py-1 px-2.5 sm:px-4 text-xs md:text-sm font-medium flex items-center justify-between gap-2 shadow-inner overflow-hidden w-full">
        <div className="flex items-center gap-1.5 max-w-full overflow-hidden whitespace-nowrap">
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] md:text-xs font-extrabold uppercase tracking-wider flex items-center gap-1 shrink-0">
            <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300 animate-pulse" /> BIG SAVINGS!
          </span>
          <span className="truncate font-semibold text-[11px] sm:text-xs md:text-sm">Save More. Get More. Spend Smart.</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-xs text-slate-100 shrink-0">
          <span className="flex items-center gap-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-amber-300" /> {locationDisplay}
          </span>
          <span className="text-slate-400">|</span>
          <a href={`tel:${phoneDisplay}`} className="flex items-center gap-1 hover:text-white transition-colors font-bold">
            <Phone className="w-3.5 h-3.5 text-amber-300" /> {phoneDisplay}
          </a>
          <span className="text-slate-400">|</span>
          <button onClick={onOpenWhatsApp} className="flex items-center gap-1 text-emerald-300 hover:text-emerald-200 transition-colors font-bold">
            <MessageCircle className="w-3.5 h-3.5 fill-current" /> WhatsApp
          </button>
          <span className="text-slate-400">|</span>
          <a
            href="/admin"
            className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white font-bold px-2 py-0.5 rounded text-[11px] transition-colors"
          >
            <Lock className="w-3 h-3" /> Admin CMS
          </a>
        </div>
      </div>

      {/* Main Header Navbar */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-6 overflow-hidden">
        
        {/* Brand Logo & Nav Links Container */}
        <div className="flex items-center gap-4 lg:gap-12 shrink-0">
          {/* Brand Logo */}
          <div className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group shrink-0" onClick={() => handleNavClick('home')}>
            <div className="h-7 sm:h-9 md:h-11 w-auto flex items-center shrink-0">
              <img 
                src={logoUrl} 
                alt="OTTMoneySaver Logo" 
                className="h-full object-contain max-h-11 rounded shadow-sm group-hover:scale-105 transition-transform duration-200" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <span className="text-base sm:text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-0.5 sm:gap-1 font-sans">
              <span className="text-[#e50914]">OTT</span>
              <span className="text-white">Money</span>
              <span className="text-[#008744]">Saver</span>
            </span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-sm font-semibold">
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
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Search Bar */}
          <div className="relative hidden md:block w-48 lg:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search OTT, Fiber, Gadgets..."
              className="w-full bg-slate-900 border border-slate-700 rounded-full py-1.5 pl-9 pr-4 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#008744] focus:ring-1 focus:ring-[#008744] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Cart Icon */}
          <button
            onClick={onOpenCart}
            className="relative p-2 text-slate-200 hover:text-white hover:bg-slate-900 rounded-xl transition-colors shrink-0"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#e50914] text-white text-[10px] sm:text-xs font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border-2 border-slate-950 animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* Admin Login Link Mobile */}
          <a
            href="/admin"
            className="sm:hidden p-2 text-slate-200 hover:text-white hover:bg-slate-900 rounded-xl transition-colors shrink-0"
            title="Admin CMS"
          >
            <Lock className="w-5 h-5 text-amber-400" />
          </a>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-200 hover:text-white hover:bg-slate-900 rounded-xl transition-colors shrink-0"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-t border-slate-800 px-4 pt-3 pb-6 space-y-3 font-sans shadow-2xl">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search OTT plans, gadgets..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 pl-9 pr-4 text-xs text-white"
            />
          </div>

          <div className="space-y-1 pt-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-left py-2.5 px-3 rounded-lg text-sm font-bold flex items-center justify-between transition-colors ${
                  activeTab === link.id ? 'bg-[#008744] text-white' : 'text-slate-200 hover:bg-slate-800'
                }`}
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>
            ))}
            
            <a
              href="/admin"
              className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-bold flex items-center justify-between text-amber-300 hover:bg-slate-800 border border-amber-500/30 bg-amber-950/40 mt-2"
            >
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4" /> Admin Panel CMS
              </span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}

    </header>
  );
}
