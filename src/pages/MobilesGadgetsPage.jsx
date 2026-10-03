import React, { useState, useMemo } from 'react';
import { Smartphone, Search } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import ProductCard from '../components/ProductCard';

export default function MobilesGadgetsPage({ onAddToCart, onQuickView, wishlistIds = [], onToggleWishlist }) {
  const { activePublicProducts, banners } = useCMS();
  const [selectedSubCat, setSelectedSubCat] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  // Filter products relevant to Mobiles & Gadgets
  const mobileGadgetProducts = useMemo(() => {
    return activePublicProducts.filter((p) => 
      ['Smartphones', 'Headphones', 'Earbuds', 'Smart Watches', 'Bluetooth Speakers', 'Power Banks', 'Chargers'].includes(p.category) ||
      p.categoryGroup === 'Mobile / Gadgets'
    );
  }, [activePublicProducts]);

  const subCategories = ['All', 'Smartphones', 'Headphones', 'Earbuds', 'Smart Watches', 'Bluetooth Speakers', 'Power Banks', 'Chargers'];

  const filtered = useMemo(() => {
    return mobileGadgetProducts.filter((p) => {
      if (!p) return false;
      const matchCat = selectedSubCat === 'All' || p.category === selectedSubCat;
      const matchSearch = 
        (p.title || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
        (p.subtitle || '').toLowerCase().includes((searchTerm || '').toLowerCase());
      return matchCat && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [mobileGadgetProducts, selectedSubCat, searchTerm, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Section */}
        {(() => {
          const mobBanner = (banners && banners.find(b => b.banner_key === 'mobiles_top_banner' || b.display_location === 'mobiles')) || {};
          if (mobBanner.is_active === false) return null;
          const bannerHeading = mobBanner.heading || 'Mobiles & Smart Gadgets Carnival';
          const bannerSubheading = mobBanner.badge_text || mobBanner.subheading || 'Smartphones & Mobile Accessories';
          const bannerDescription = mobBanner.description || 'Explore 5G smartphones, active noise cancelling earbuds, premium bluetooth speakers, smartwatches & ultra-fast chargers with genuine brand warranty & express doorstep delivery.';
          const bannerTextColor = mobBanner.text_color || '#ffffff';
          const bannerOverlayColor = mobBanner.overlay_color || 'rgba(16,185,129,0.25)';
          const bannerImageUrl = mobBanner.image_url || '';
          const bannerMobileImageUrl = mobBanner.mobile_image_url || '';

          const c1 = mobBanner.bg_color || '#022c22';
          const c2 = mobBanner.bg_color_2 || c1;
          const bgStyle = c1.toLowerCase() === c2.toLowerCase()
            ? { backgroundColor: c1 }
            : { background: `linear-gradient(${mobBanner.bg_direction || 'to right'}, ${c1}, ${c2})` };

          return (
            <div 
              style={{ ...bgStyle, color: bannerTextColor }}
              className="relative rounded-3xl p-6 sm:p-10 mb-8 border border-slate-800 shadow-2xl overflow-hidden"
            >
              {bannerImageUrl && (
                <picture className="absolute inset-0 w-full h-full pointer-events-none">
                  {bannerMobileImageUrl && (
                    <source media="(max-width: 640px)" srcSet={bannerMobileImageUrl} />
                  )}
                  <img 
                    src={bannerImageUrl} 
                    alt={bannerHeading}
                    className="w-full h-full object-cover opacity-30"
                  />
                </picture>
              )}
              <div 
                style={{ backgroundColor: bannerOverlayColor }}
                className="absolute inset-0 pointer-events-none" 
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(16,185,129,0.25),transparent_60%)] pointer-events-none" />
              
              <div className="relative z-10 max-w-3xl space-y-4">
                {bannerSubheading && (
                  <span 
                    style={{
                      backgroundColor: mobBanner.badge_bg_color || 'rgba(6,78,59,0.8)',
                      color: mobBanner.badge_color || '#34d399'
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/60 text-xs font-black uppercase tracking-wider"
                  >
                    <Smartphone className="w-3.5 h-3.5" /> {bannerSubheading}
                  </span>
                )}
                <h1 
                  style={{ color: mobBanner.heading_color || bannerTextColor }}
                  className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight"
                >
                  {bannerHeading}
                </h1>
                <p 
                  style={{ color: mobBanner.description_color || mobBanner.subheading_color || '#cbd5e1' }}
                  className="text-sm sm:text-base leading-relaxed"
                >
                  {bannerDescription}
                </p>
                {Array.isArray(mobBanner.buttons) && mobBanner.buttons.length > 0 && (
                  <div className="flex flex-wrap gap-3 pt-2">
                    {mobBanner.buttons.filter(b => b.is_active !== false).map((btn, bIdx) => (
                      <button
                        key={btn.id || bIdx}
                        onClick={() => {
                          const link = btn.link || '/mobiles';
                          if (link.startsWith('http') || link.startsWith('tel:') || link.startsWith('mailto:')) {
                            window.open(link, btn.target || (btn.open_new_tab ? '_blank' : '_self'));
                          } else {
                            window.location.href = link;
                          }
                        }}
                        style={{
                          backgroundColor: btn.button_color || '#008744',
                          color: btn.text_color || '#ffffff',
                          borderColor: btn.border_color || 'transparent'
                        }}
                        className="px-6 py-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer border"
                      >
                        <span>{btn.text || 'Explore Mobiles'}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* Filter Pills & Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          {/* Subcategory Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {subCategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubCat(sub)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedSubCat === sub
                    ? 'bg-[#008744] text-white shadow-md shadow-emerald-700/30'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* Search & Sort */}
          <div className="flex items-center gap-3">
            <div className="relative w-48 sm:w-56">
              <input
                type="text"
                placeholder="Search mobiles, earbuds..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 text-xs rounded-xl py-2 pl-8 pr-3 border border-slate-200 focus:outline-none focus:border-emerald-600"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Product Cards Grid: side-by-side layout */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
