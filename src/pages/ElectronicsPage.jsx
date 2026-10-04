import React, { useState, useMemo } from 'react';
import { Laptop, Search } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import ProductCard from '../components/ProductCard';

export default function ElectronicsPage({ onAddToCart, onQuickView, wishlistIds = [], onToggleWishlist }) {
  const { activePublicProducts, banners } = useCMS();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const eleBanner = (banners && banners.find(b => b.banner_key === 'electronics_top_banner' || b.display_location === 'electronics')) || {};
  const isBannerActive = eleBanner.is_active !== false;

  const bgMode = eleBanner.background_mode || eleBanner.mode || (eleBanner.image_url ? 'image-blur' : 'solid');
  const isImageOnly = bgMode === 'image-only' && Boolean(eleBanner.image_url || eleBanner.mobile_image_url);
  const isSolid = bgMode === 'solid' || !eleBanner.image_url;
  const currentImg = eleBanner.image_url || eleBanner.mobile_image_url;

  const bannerBgStyle = (() => {
    if (isImageOnly && currentImg) {
      return {
        backgroundImage: `url(${currentImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#0a0f1d'
      };
    }
    const c1 = eleBanner.bg_color || '#0a0f1d';
    const c2 = eleBanner.bg_color_2 || c1;
    if (c1.toLowerCase() === c2.toLowerCase()) return { backgroundColor: c1 };
    return { background: `linear-gradient(${eleBanner.bg_direction || 'to right'}, ${c1}, ${c2})` };
  })();

  const align = eleBanner.heading_alignment || 'left';
  const alignContainerClasses = align === 'center'
    ? 'max-w-3xl mx-auto text-center items-center flex flex-col'
    : align === 'right'
      ? 'max-w-3xl ml-auto text-right items-end flex flex-col'
      : 'max-w-3xl mr-auto text-left items-start flex flex-col';
  const btnJustify = align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start';

  const electronicsList = useMemo(() => {
    return activePublicProducts.filter(p => 
      ['Smart TVs', 'Laptops', 'Chargers', 'Power Banks', 'Electronics'].includes(p.category) ||
      p.categoryGroup === 'Other Products'
    );
  }, [activePublicProducts]);

  const categories = ['All', 'Smart TVs', 'Laptops', 'Chargers', 'Power Banks'];

  const filtered = useMemo(() => {
    return electronicsList.filter(p => {
      if (!p) return false;
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchSearch = (p.title || '').toLowerCase().includes((searchTerm || '').toLowerCase());
      return matchCat && matchSearch;
    });
  }, [electronicsList, selectedCategory, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50 py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Section */}
        {isBannerActive && (
          <div 
            style={bannerBgStyle}
            className="relative rounded-3xl text-white p-6 sm:p-10 mb-8 border border-slate-800 shadow-2xl overflow-hidden"
          >
            {!isImageOnly && !isSolid && eleBanner.image_url && (
              <picture className="absolute inset-0 w-full h-full pointer-events-none">
                {eleBanner.mobile_image_url && (
                  <source media="(max-width: 640px)" srcSet={eleBanner.mobile_image_url} />
                )}
                <img 
                  src={eleBanner.image_url} 
                  alt={eleBanner.heading || 'Electronics'} 
                  className="w-full h-full object-cover opacity-30" 
                />
              </picture>
            )}
            {!isImageOnly && (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(245,158,11,0.25),transparent_60%)] pointer-events-none" />
            )}
            <div className={`relative z-10 ${alignContainerClasses} space-y-4`}>
              {(eleBanner.badge_text || eleBanner.subheading) && (
                <span 
                  style={{
                    backgroundColor: eleBanner.badge_bg_color || '#78350f',
                    color: eleBanner.badge_color || '#fbbf24'
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/60 text-xs font-black uppercase tracking-wider shadow-sm"
                >
                  <Laptop className="w-3.5 h-3.5" /> {eleBanner.badge_text || eleBanner.subheading}
                </span>
              )}
              <h1 
                style={{ color: eleBanner.heading_color || '#ffffff' }}
                className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight"
              >
                {eleBanner.heading || <>Electronics <span className="text-amber-400">&amp; Smart Devices</span></>}
              </h1>
              <p 
                style={{ color: eleBanner.description_color || eleBanner.subheading_color || '#cbd5e1' }}
                className="text-sm sm:text-base leading-relaxed max-w-2xl"
              >
                {eleBanner.description || 'Shop 4K Smart TVs, high performance laptops, fast chargers & essential tech devices backed by official manufacturer warranties & instant doorstep setup.'}
              </p>
              {Array.isArray(eleBanner.buttons) && eleBanner.buttons.length > 0 && (
                <div className={`flex flex-wrap gap-3 pt-2 ${btnJustify}`}>
                  {eleBanner.buttons.filter(b => b.is_active !== false).map((btn, bIdx) => (
                    <button
                      key={btn.id || bIdx}
                      onClick={() => {
                        const link = btn.link || '/electronics';
                        if (link.startsWith('http') || link.startsWith('tel:') || link.startsWith('mailto:')) {
                          window.open(link, btn.target || (btn.open_new_tab ? '_blank' : '_self'));
                        } else {
                          window.location.href = link;
                        }
                      }}
                      style={{
                        backgroundColor: btn.button_color || '#f59e0b',
                        color: btn.text_color || '#000000',
                        borderColor: btn.border_color || 'transparent'
                      }}
                      className="px-6 py-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer border"
                    >
                      <span>{btn.text || 'Explore Electronics'}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Filter Pills & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-60">
            <input
              type="text"
              placeholder="Search electronics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 text-xs rounded-xl py-2 pl-8 pr-3 border border-slate-200 focus:outline-none focus:border-amber-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Electronics Product Cards Grid: side-by-side layout */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
          {filtered.map(product => (
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
