import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  Tag, 
  Gauge, 
  ShieldCheck, 
  Headphones, 
  Truck 
} from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export default function HeroSection({ onExploreDeals, onShopNow }) {
  const { banners } = useCMS();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const banner1 = banners.find(b => b.banner_key === 'home_main_1') || {
    banner_key: 'home_main_1',
    heading: 'SAVE MONEY. ENJOY MORE.',
    subheading: 'BIG SAVINGS!',
    description: 'OTT subscriptions, high-speed fiber internet, mobiles & gadgets — all at smart prices.',
    button_text: 'Explore Deals',
    button_link: 'offers',
    image_url: '/hero-products-showcase.png',
    heading_alignment: 'left',
    background_mode: 'solid',
    is_active: true
  };

  const banner2FromBanners = banners.find(b => b.banner_key === 'home_main_2') || {};
  const banner2 = {
    ...banner2FromBanners,
    banner_key: 'home_main_2',
    heading: banner2FromBanners.heading || 'SAVE MORE. ENJOY MORE.',
    subheading: banner2FromBanners.subheading || 'MEGA DEALS!',
    description: banner2FromBanners.description || 'Up to 75% Off Premium Electronics, OTT Subscriptions & High-Speed Fiber Internet.',
    button_text: banner2FromBanners.button_text || 'Shop Now',
    button_link: banner2FromBanners.button_link || 'mobiles',
    image_url: banner2FromBanners.image_url !== undefined ? banner2FromBanners.image_url : '/hero-products-showcase.png',
    buttons: banner2FromBanners.buttons || [],
    badges: banner2FromBanners.badges || [],
    heading_alignment: banner2FromBanners.heading_alignment || 'left',
    background_mode: banner2FromBanners.background_mode || 'image-blur',
    is_active: banner2FromBanners.is_active !== false
  };

  const activeSlides = useMemo(() => {
    // 1. Gather all main home banners (not small or sub-banners)
    const homeBanners = (banners || []).filter(b => {
      if (b.is_active === false) return false;
      const loc = (b.display_location || '').toLowerCase();
      const k = (b.banner_key || '').toLowerCase();
      if (loc === 'home' || loc === 'all' || k.startsWith('home_main')) {
        return !k.includes('small') && !k.includes('middle') && !k.includes('bottom') && loc !== 'home_small';
      }
      return false;
    });

    if (homeBanners.length > 0) return homeBanners;

    const fallback = [banner1];
    if (banner2.is_active !== false) fallback.push(banner2);
    return fallback;
  }, [banners, banner1, banner2]);

  const slidesCount = activeSlides.length;
  const safeCurrentSlide = currentSlide >= slidesCount ? 0 : currentSlide;

  useEffect(() => {
    if (isPaused || slidesCount <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesCount);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, slidesCount]);

  const handleNext = () => {
    if (slidesCount <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % slidesCount);
  };

  const handlePrev = () => {
    if (slidesCount <= 1) return;
    setCurrentSlide((prev) => (prev - 1 + slidesCount) % slidesCount);
  };

  const activeSlideData = activeSlides[safeCurrentSlide] || activeSlides[0] || banner1;

  // Background styling calculation
  const bgMode = activeSlideData.background_mode || activeSlideData.mode || (activeSlideData.image_url ? 'image-blur' : 'solid');
  const isImageOnly = bgMode === 'image-only' && Boolean(activeSlideData.image_url || activeSlideData.mobile_image_url);
  const isSolid = bgMode === 'solid' || !activeSlideData.image_url;
  const currentBannerImg = activeSlideData.image_url || activeSlideData.mobile_image_url || '';

  const align = activeSlideData.heading_alignment || 'left';
  const isCenter = align === 'center';
  const isRight = align === 'right';

  // Responsive alignment classes
  const textContainerClasses = isCenter
    ? 'col-span-12 text-center items-center justify-center mx-auto flex flex-col'
    : isRight
      ? 'lg:col-span-6 text-right items-end justify-center ml-auto flex flex-col'
      : 'lg:col-span-6 text-left items-start justify-center mr-auto flex flex-col';

  const badgeWrapperClasses = isCenter 
    ? 'flex items-center justify-center gap-2 flex-wrap mb-1 mx-auto'
    : isRight
      ? 'flex items-center justify-end gap-2 flex-wrap mb-1 ml-auto'
      : 'flex items-center justify-start gap-2 flex-wrap mb-1 mr-auto';

  const buttonWrapperClasses = isCenter
    ? 'flex items-center justify-center gap-2.5 sm:gap-4 pt-1 flex-wrap mx-auto w-full'
    : isRight
      ? 'flex items-center justify-end gap-2.5 sm:gap-4 pt-1 flex-wrap ml-auto'
      : 'flex items-center justify-start gap-2.5 sm:gap-4 pt-1 flex-wrap';

  // Background styles
  const slideContainerStyle = (() => {
    if (isImageOnly && currentBannerImg) {
      return {
        backgroundImage: `url(${currentBannerImg})`,
        backgroundSize: 'cover',
        backgroundPosition: activeSlideData.image_position || 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#050b1e'
      };
    }
    const c1 = activeSlideData.bg_color || '#050b1e';
    const c2 = activeSlideData.bg_color_2 || (safeCurrentSlide === 1 ? '#0c051a' : c1);
    if (c1.toLowerCase() === c2.toLowerCase()) {
      return { backgroundColor: c1 };
    }
    return { background: `linear-gradient(${activeSlideData.bg_direction || 'to right'}, ${c1}, ${c2})` };
  })();

  const singleBadge = activeSlideData.badge_text || activeSlideData.subheading || (Array.isArray(activeSlideData.badges) && (activeSlideData.badges[0]?.text || activeSlideData.badges[0])) || '';

  const buttonsList = Array.isArray(activeSlideData.buttons) && activeSlideData.buttons.length > 0
    ? activeSlideData.buttons.filter(b => b.is_active !== false)
    : (activeSlideData.button_text ? [{
        id: 'btn_default',
        text: activeSlideData.button_text,
        link: activeSlideData.button_link || 'offers',
        button_color: activeSlideData.button_color || '#e50914',
        text_color: activeSlideData.button_text_color || '#ffffff',
        border_color: activeSlideData.button_border_color || 'transparent'
      }] : []);

  return (
    <section 
      id="home"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative bg-[#020510] text-white overflow-hidden py-2 sm:py-5 font-sans select-none w-full max-w-full"
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 relative overflow-hidden">
        <AnimatePresence mode="wait">
          
          <motion.div
            key={`hero-slide-${activeSlideData.id || activeSlideData.banner_key || safeCurrentSlide}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            style={slideContainerStyle}
            className="relative rounded-2xl sm:rounded-3xl border border-purple-500/30 p-3 sm:p-6 lg:p-7 shadow-[0_8px_32px_rgba(168,85,247,0.25)] transition-all duration-500 max-w-6xl mx-auto overflow-hidden w-full min-h-[460px] sm:min-h-[500px] lg:min-h-[520px] flex flex-col justify-between"
          >
            {/* Background Neon Rays: ONLY for Non-Image-Only Modes */}
            {!isImageOnly && (
              <>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.3),transparent_70%)] pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_center,rgba(59,130,246,0.25),transparent_60%)] pointer-events-none" />
              </>
            )}

            {/* Optional Overlay if explicitly specified and not image-only */}
            {!isImageOnly && activeSlideData.overlay_color && (
              <div 
                style={{ backgroundColor: activeSlideData.overlay_color }}
                className="absolute inset-0 pointer-events-none" 
              />
            )}

            {/* Top Announcement Bar */}
            <div className="relative z-10 bg-gradient-to-r from-[#e50914] via-red-600 to-rose-600 text-white py-1.5 sm:py-2 px-3 sm:px-5 rounded-xl sm:rounded-2xl flex items-center justify-between shadow-md mb-2 sm:mb-4 w-full overflow-hidden shrink-0">
              <div className="flex items-center gap-1.5 sm:gap-2 font-bold text-[11px] sm:text-sm tracking-wide overflow-hidden">
                <span className="bg-amber-400 text-black px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black flex items-center gap-1 shrink-0">
                  <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" /> {singleBadge || 'BIG SAVINGS!'}
                </span>
                <span className="truncate">Save More. Get More. Spend Smart.</span>
              </div>
              <button 
                onClick={onExploreDeals}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white text-[#e50914] flex items-center justify-center font-bold hover:scale-110 transition-transform shadow shrink-0 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>

            {/* Main Content Grid */}
            <div className={`grid grid-cols-1 ${isImageOnly ? 'grid-cols-1' : 'lg:grid-cols-12'} gap-3 sm:gap-6 items-center relative z-10 w-full overflow-hidden flex-1 my-auto`}>
              
              {/* Content Column (Responsive Alignment) */}
              <div className={`${isImageOnly ? 'w-full max-w-3xl mx-auto py-4' : 'lg:col-span-6'} space-y-2.5 sm:space-y-4 ${textContainerClasses}`}>
                
                {/* 1. Editable Badge */}
                {activeSlideData.show_badge !== false && singleBadge && (
                  <div className={badgeWrapperClasses}>
                    <span 
                      style={{ 
                        backgroundColor: activeSlideData.badge_bg_color || '#f59e0b', 
                        color: activeSlideData.badge_color || '#000000' 
                      }}
                      className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wide shadow-md border border-white/20 inline-block"
                    >
                      {singleBadge}
                    </span>
                  </div>
                )}

                {/* 2. Editable Heading */}
                {activeSlideData.show_heading !== false && (
                  <div className={`w-full ${isCenter ? 'text-center' : isRight ? 'text-right' : 'text-left'}`}>
                    <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl font-black uppercase tracking-tight leading-tight font-sans drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] whitespace-pre-wrap break-words">
                      {Array.isArray(activeSlideData.heading_segments) && activeSlideData.heading_segments.length > 0 ? (
                        activeSlideData.heading_segments.map((seg, idx) => (
                          <span key={idx} style={{ color: seg.color || activeSlideData.heading_color || '#ffffff', display: seg.display || 'inline' }}>
                            {seg.text}{' '}
                          </span>
                        ))
                      ) : (
                        <span style={{ color: activeSlideData.heading_color || '#ffffff' }}>
                          {activeSlideData.heading || 'SAVE MONEY. ENJOY MORE.'}
                        </span>
                      )}
                    </h1>
                  </div>
                )}

                {/* 3. Editable Subheading / Description */}
                {activeSlideData.show_subheading !== false && (activeSlideData.description || activeSlideData.subheading) && (
                  <p 
                    style={{ color: activeSlideData.description_color || activeSlideData.subheading_color || '#cbd5e1' }}
                    className={`text-xs sm:text-base font-normal leading-snug sm:leading-relaxed max-w-xl drop-shadow-sm ${
                      isCenter ? 'mx-auto text-center' : isRight ? 'ml-auto text-right' : 'mr-auto text-left'
                    }`}
                  >
                    {activeSlideData.description || activeSlideData.subheading}
                  </p>
                )}

                {/* 4. Editable CTA Buttons */}
                {activeSlideData.show_cta !== false && buttonsList.length > 0 && (
                  <div className={buttonWrapperClasses}>
                    {buttonsList.map((btn, btnIdx) => (
                      <button
                        key={btn.id || btnIdx}
                        onClick={() => {
                          const link = btn.link || 'offers';
                          if (btn.is_external || link.startsWith('http') || link.startsWith('tel:') || link.startsWith('mailto:')) {
                            window.open(link, btn.target || (btn.open_new_tab ? '_blank' : '_self'));
                          } else {
                            if (link === 'offers' || link === '/offers') onExploreDeals();
                            else if (link === 'mobiles' || link === '/mobiles') onShopNow();
                            else if (link) window.open(link, btn.target || '_self');
                          }
                        }}
                        style={{
                          backgroundColor: btn.button_color || '#e50914',
                          color: btn.text_color || '#ffffff',
                          borderColor: btn.border_color || 'transparent'
                        }}
                        className="px-6 py-2.5 sm:px-7 sm:py-3 rounded-xl font-extrabold text-xs sm:text-sm md:text-base shadow-lg transition-all hover:scale-105 cursor-pointer relative border"
                      >
                        {btn.text || 'Explore Deals'}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Showcase Column: ONLY for Non-Image-Only Modes */}
              {!isImageOnly && (
                <div className="lg:col-span-6 flex flex-col items-center justify-center relative w-full overflow-hidden h-48 sm:h-64 lg:h-72">
                  
                  {/* Top OTT Cards */}
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 sm:gap-2 w-full max-w-xl mb-2 shrink-0">
                    <div className="bg-black/80 border border-red-600/40 rounded-lg sm:rounded-xl p-1 flex items-center justify-center h-8 sm:h-10 shadow-sm">
                      <span className="text-red-600 font-black text-xs tracking-wider">NETFLIX</span>
                    </div>
                    <div className="bg-[#000511] border border-sky-500/40 rounded-lg sm:rounded-xl p-1 flex items-center justify-center h-8 sm:h-10 shadow-sm">
                      <span className="text-sky-400 font-bold text-[10px] sm:text-xs">prime video</span>
                    </div>
                    <div className="bg-[#05112e] border border-blue-500/40 rounded-lg sm:rounded-xl p-1 flex items-center justify-center h-8 sm:h-10 text-center shadow-sm">
                      <span className="text-white font-black text-[9px] sm:text-xs">Disney+ <span className="text-sky-400 font-normal">hotstar</span></span>
                    </div>
                    <div className="bg-black/80 border border-purple-500/40 rounded-lg sm:rounded-xl p-1 flex items-center justify-center h-8 sm:h-10 shadow-sm">
                      <div className="flex items-center gap-1">
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-purple-500 border-t-amber-400 flex items-center justify-center text-[7px] font-black">5</div>
                        <span className="text-white font-bold text-[10px] sm:text-xs">ZEE5</span>
                      </div>
                    </div>
                    <div className="bg-[#020914] border border-amber-500/40 rounded-lg sm:rounded-xl p-1 flex flex-col items-center justify-center h-8 sm:h-10 shadow-sm">
                      <span className="text-[7px] font-bold text-white tracking-widest leading-none">SONY</span>
                      <span className="text-[10px] font-black text-amber-400 leading-none">liv</span>
                    </div>
                    <div className="bg-[#3e1388] border border-purple-400/40 rounded-lg sm:rounded-xl p-1 flex items-center justify-center h-8 sm:h-10 shadow-sm">
                      <span className="text-white font-black text-xs lowercase">voot</span>
                    </div>
                  </div>

                  {/* Product Showcase Visual */}
                  {(activeSlideData.image_url !== '' && activeSlideData.image_url !== null) && (
                    <div className="relative w-full max-w-xl flex items-center justify-center flex-1 overflow-hidden">
                      <motion.div 
                        className="relative w-full h-full flex items-center justify-center"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <img 
                          src={activeSlideData.image_url || '/hero-products-showcase.png'} 
                          alt="Hero Products Showcase Platform"
                          style={{ objectFit: activeSlideData.image_fit || 'contain', objectPosition: activeSlideData.image_position || 'center' }}
                          className="w-full h-full filter drop-shadow-[0_12px_24px_rgba(168,85,247,0.5)] max-h-56"
                        />
                      </motion.div>
                    </div>
                  )}

                </div>
              )}

            </div>

            {/* Bottom Feature Badges: Hide in image-only if desired, or keep as subtle footer */}
            {!isImageOnly && (
              <div className="hidden sm:grid sm:grid-cols-5 gap-2 mt-2 pt-2 border-t border-purple-900/40 text-xs text-slate-300 font-medium shrink-0">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-pink-400 shrink-0">
                    <Tag className="w-3 h-3" />
                  </div>
                  <span className="truncate">Best Prices Guaranteed</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                    <Gauge className="w-3 h-3" />
                  </div>
                  <span className="truncate">High-Speed Fiber</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-amber-400 shrink-0">
                    <ShieldCheck className="w-3 h-3" />
                  </div>
                  <span className="truncate">Secure Payments</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
                    <Headphones className="w-3 h-3" />
                  </div>
                  <span className="truncate">24/7 Support</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <Truck className="w-3 h-3" />
                  </div>
                  <span className="truncate">Reliable Delivery</span>
                </div>
              </div>
            )}

          </motion.div>

        </AnimatePresence>

        {/* Carousel Navigation Arrows */}
        {slidesCount > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-950/80 hover:bg-slate-900 text-white border border-slate-700 flex items-center justify-center shadow-lg backdrop-blur-sm transition-all hover:scale-110 cursor-pointer"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-950/80 hover:bg-slate-900 text-white border border-slate-700 flex items-center justify-center shadow-lg backdrop-blur-sm transition-all hover:scale-110 cursor-pointer"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* Carousel Pagination Dots */}
        {slidesCount > 1 && (
          <div className="flex items-center justify-center gap-2 mt-2 sm:mt-3">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  safeCurrentSlide === idx 
                    ? 'w-6 sm:w-8 h-2.5 sm:h-3 bg-[#e50914] shadow-[0_0_10px_rgba(229,9,20,0.8)]' 
                    : 'w-2.5 sm:w-3 h-2.5 sm:h-3 bg-slate-600 hover:bg-slate-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
