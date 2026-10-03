import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export default function PromoSliderBanner({ onViewOffers, onSelectCategory }) {
  const { banners: cmsBanners } = useCMS();
  const [currentIdx, setCurrentIdx] = useState(0);

  // Retrieve active small banners or home banners from CMS
  const rawList = Array.isArray(cmsBanners) ? cmsBanners : [];
  const smallBanners = rawList.filter(b => 
    b.is_active !== false && 
    (b.banner_key?.includes('home_small') || b.display_location === 'home' || b.banner_key?.includes('promo'))
  );

  // Fallback banners only if CMS has no active small banners
  const banners = smallBanners.length > 0 ? smallBanners : [
    {
      id: 'b1',
      badge_text: 'MEGA DISCOUNT CARNIVAL',
      heading: 'OTT & FIBER BROADBAND BUNDLES',
      description: 'Get 12+ Premium OTT Apps & 200 Mbps Unlimited Fiber Internet',
      bg_color: '#dc2626',
      bg_color_2: '#ea580c',
      bg_direction: 'to right',
      image_url: '',
      button_text: 'Explore Fiber Bundles',
      button_link: 'fiber'
    },
    {
      id: 'b2',
      badge_text: 'LIMITED TIME DEAL',
      heading: 'NETFLIX 4K UHD & PRIME VIDEO',
      description: 'Multi-screen Ultra HD Playback with Instant Digital Activation',
      bg_color: '#0f172a',
      bg_color_2: '#450a0a',
      bg_direction: 'to right',
      image_url: '',
      button_text: 'Get OTT Subscriptions',
      button_link: 'ott-plans'
    }
  ];

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % banners.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [banners.length]);

  const activeBanner = banners[currentIdx] || banners[0] || {};

  const handleButtonClick = (link) => {
    if (!link) {
      if (onViewOffers) onViewOffers();
      return;
    }
    if (link.startsWith('http')) {
      window.open(link, '_blank');
      return;
    }
    const clean = link.replace(/^\//, '').toLowerCase();
    if (clean === 'offers' || clean === 'offer') {
      if (onViewOffers) onViewOffers();
    } else if (clean === 'ott' || clean === 'ott-plans' || clean === 'category/ott') {
      if (onSelectCategory) onSelectCategory('ott');
      else window.location.href = '/ott-plans';
    } else if (clean === 'fiber' || clean === 'fiber-internet' || clean === 'category/fiber') {
      if (onSelectCategory) onSelectCategory('fiber');
      else window.location.href = '/fiber-internet';
    } else if (clean === 'mobiles' || clean === 'electronics' || clean === 'category/mobiles') {
      if (onSelectCategory) onSelectCategory('mobiles');
      else window.location.href = '/mobiles';
    } else {
      if (link.startsWith('/')) {
        window.location.href = link;
      } else if (onSelectCategory) {
        onSelectCategory(clean);
      } else if (onViewOffers) {
        onViewOffers();
      }
    }
  };

  const getBackgroundStyle = (c1, c2, dir) => {
    const col1 = c1 || '#dc2626';
    const col2 = c2 || col1;
    if (col1.toLowerCase() === col2.toLowerCase()) {
      return { backgroundColor: col1 };
    }
    return { background: `linear-gradient(${dir || 'to right'}, ${col1}, ${col2})` };
  };

  const isPureImage = activeBanner.mode === 'image' && activeBanner.image_url && !activeBanner.heading;

  return (
    <div className="py-6 bg-slate-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-xl select-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeBanner.id || activeBanner.banner_key || currentIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              style={getBackgroundStyle(activeBanner.bg_color, activeBanner.bg_color_2, activeBanner.bg_direction)}
              className="p-6 sm:p-10 relative overflow-hidden border border-white/10 min-h-[220px] flex flex-col justify-center"
            >
              {/* Responsive Artwork Image */}
              {activeBanner.image_url && (
                <picture className="absolute inset-0 w-full h-full pointer-events-none">
                  {activeBanner.mobile_image_url && (
                    <source media="(max-width: 640px)" srcSet={activeBanner.mobile_image_url} />
                  )}
                  <img 
                    src={activeBanner.image_url} 
                    alt={activeBanner.heading || 'Banner'}
                    className={`w-full h-full ${isPureImage ? 'object-cover' : 'object-cover opacity-35'}`}
                  />
                </picture>
              )}

              {/* Color Overlay if configured */}
              {activeBanner.overlay_color && !isPureImage && (
                <div 
                  style={{ backgroundColor: activeBanner.overlay_color }}
                  className="absolute inset-0 pointer-events-none"
                />
              )}

              {!isPureImage && (
                <div className="relative z-10 max-w-2xl space-y-3 sm:space-y-4">
                  {/* Badge Text (Rendered only if non-empty) */}
                  {(activeBanner.badge_text || activeBanner.subheading) && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-black/40 backdrop-blur-md text-amber-300 border border-amber-300/30 text-[10px] sm:text-xs font-black uppercase px-3 py-1 rounded-full flex items-center gap-1.5 shadow">
                        <Flame className="w-3.5 h-3.5 fill-current animate-bounce" />
                        {activeBanner.badge_text || activeBanner.subheading}
                      </span>
                    </div>
                  )}

                  {activeBanner.heading && (
                    <h2 
                      className="text-2xl sm:text-4xl font-black uppercase tracking-tight leading-tight drop-shadow-sm" 
                      style={{ color: activeBanner.text_color || '#ffffff' }}
                    >
                      {activeBanner.heading}
                    </h2>
                  )}

                  {activeBanner.description && (
                    <p className="text-white/90 text-xs sm:text-base leading-relaxed">
                      {activeBanner.description}
                    </p>
                  )}

                  {/* Buttons List */}
                  <div className="pt-2 flex items-center gap-3 flex-wrap">
                    {Array.isArray(activeBanner.buttons) && activeBanner.buttons.length > 0 ? (
                      activeBanner.buttons.filter(b => b.is_active !== false).map((btn, bIdx) => (
                        <button
                          key={btn.id || bIdx}
                          onClick={() => handleButtonClick(btn.link)}
                          style={{
                            backgroundColor: btn.button_color || '#ffffff',
                            color: btn.text_color || '#0f172a'
                          }}
                          className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl font-extrabold text-xs sm:text-sm shadow-lg active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                        >
                          <span>{btn.text}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      ))
                    ) : (
                      <button
                        onClick={() => handleButtonClick(activeBanner.button_link)}
                        style={{
                          backgroundColor: activeBanner.button_color || '#ffffff',
                          color: activeBanner.button_color && activeBanner.button_color !== '#ffffff' ? '#ffffff' : '#0f172a'
                        }}
                        className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl font-extrabold text-xs sm:text-sm shadow-lg active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <span>{activeBanner.button_text || 'Explore Offers'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Slide Nav Indicators */}
              {banners.length > 1 && (
                <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 flex items-center gap-1.5 z-20">
                  {banners.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIdx(i)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        currentIdx === i ? 'w-6 bg-white shadow-md' : 'w-2 bg-white/40 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
