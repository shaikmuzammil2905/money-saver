import React, { useState, useEffect } from 'react';
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
  const { banners, homeSlides } = useCMS();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const banner1 = banners.find(b => b.banner_key === 'home_main_1') || {
    heading: 'SAVE MONEY. ENJOY MORE.',
    subheading: 'BIG SAVINGS!',
    description: 'OTT subscriptions, high-speed fiber internet, mobiles & gadgets — all at smart prices.',
    button_text: 'Explore Deals',
    button_link: 'offers',
    image_url: '/hero-products-showcase.png',
    is_active: true
  };

  const slide2Data = (Array.isArray(homeSlides) && homeSlides.find(s => s.slide_key === 'second_slide')) || {};
  const banner2FromBanners = banners.find(b => b.banner_key === 'home_main_2') || {};
  const banner2 = {
    ...banner2FromBanners,
    heading: slide2Data.heading || banner2FromBanners.heading || 'SAVE MORE. ENJOY MORE.',
    subheading: banner2FromBanners.subheading || 'MEGA DEALS!',
    description: slide2Data.description || banner2FromBanners.description || 'Up to 75% Off Premium Electronics, OTT Subscriptions & High-Speed Fiber Internet.',
    button_text: slide2Data.button_text || banner2FromBanners.button_text || 'Shop Now',
    button_link: slide2Data.button_link || banner2FromBanners.button_link || 'mobiles',
    image_url: slide2Data.image_url || banner2FromBanners.image_url || '/hero-products-showcase.png',
    buttons: banner2FromBanners.buttons || [],
    badges: banner2FromBanners.badges || [],
    is_active: slide2Data.is_active !== undefined ? slide2Data.is_active : (banner2FromBanners.is_active !== false)
  };

  const activeSlides = [banner1];
  if (banner2.is_active !== false) {
    activeSlides.push(banner2);
  }

  const slidesCount = activeSlides.length;

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

  // Shared container styles so Poster 1 & Poster 2 occupy EXACTLY the same space
  const slideContainerClasses = "relative bg-gradient-to-br from-[#050b1e] via-[#090518] to-[#02040c] rounded-2xl sm:rounded-3xl border border-purple-500/30 p-3 sm:p-6 lg:p-7 shadow-[0_8px_32px_rgba(168,85,247,0.25)] transition-all duration-500 max-w-6xl mx-auto overflow-hidden w-full min-h-[460px] sm:min-h-[500px] lg:min-h-[520px] flex flex-col justify-between aspect-[16/10] sm:aspect-[16/8] lg:aspect-[16/7]";

  return (
    <section 
      id="home"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative bg-[#020510] text-white overflow-hidden py-2 sm:py-5 font-sans select-none w-full max-w-full"
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 relative overflow-hidden">
        <AnimatePresence mode="wait">
          
          {/* SLIDE 1: POSTER 1 */}
          {currentSlide === 0 && (
            <motion.div
              key="slide-target-hero"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={slideContainerClasses}
            >
              {/* Background Neon Rays */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.3),transparent_70%)] pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_center,rgba(59,130,246,0.25),transparent_60%)] pointer-events-none" />

              {/* Top Announcement Bar */}
              <div className="relative z-10 bg-gradient-to-r from-[#e50914] via-red-600 to-rose-600 text-white py-1.5 sm:py-2 px-3 sm:px-5 rounded-xl sm:rounded-2xl flex items-center justify-between shadow-md mb-2 sm:mb-4 w-full overflow-hidden shrink-0">
                <div className="flex items-center gap-1.5 sm:gap-2 font-bold text-[11px] sm:text-sm tracking-wide overflow-hidden">
                  <span className="bg-amber-400 text-black px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black flex items-center gap-1 shrink-0">
                    <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" /> BIG SAVINGS!
                  </span>
                  <span className="truncate">Save More. Get More. Spend Smart.</span>
                </div>
                <button 
                  onClick={onExploreDeals}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white text-[#e50914] flex items-center justify-center font-bold hover:scale-110 transition-transform shadow shrink-0"
                >
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-6 items-center relative z-10 w-full overflow-hidden flex-1">
                
                {/* Left Column */}
                <div className="lg:col-span-5 space-y-2 sm:space-y-4 text-center lg:text-left flex flex-col justify-center">
                  {/* Subheading / Badges */}
                  <div className="flex items-center justify-center lg:justify-start gap-2 flex-wrap mb-1">
                    {Array.isArray(banner1.subheadings) && banner1.subheadings.length > 0 ? (
                      banner1.subheadings.filter(s => s.is_active !== false).map((sub, sIdx) => (
                        <span key={sub.id || sIdx} style={{ transform: `translate(${sub.position_x || 0}px, ${sub.position_y || 0}px)` }} className="bg-amber-400 text-black px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wide relative shadow-sm">
                          {sub.text}
                        </span>
                      ))
                    ) : banner1.subheading && (
                      <span className="bg-amber-400 text-black px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wide shadow-sm">
                        {banner1.subheading}
                      </span>
                    )}

                    {Array.isArray(banner1.badges_data) && banner1.badges_data.length > 0 ? (
                      banner1.badges_data.filter(b => b.is_active !== false).map((bdg, bIdx) => (
                        <span key={bdg.id || bIdx} style={{ transform: `translate(${bdg.position_x || 0}px, ${bdg.position_y || 0}px)` }} className="bg-red-600/90 text-white px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border border-red-400/40 relative shadow-sm">
                          {bdg.text}
                        </span>
                      ))
                    ) : Array.isArray(banner1.badges) && banner1.badges.map((bdg, bIdx) => (
                      <span key={bIdx} className="bg-red-600/90 text-white px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border border-red-400/40 shadow-sm">
                        {typeof bdg === 'string' ? bdg : bdg.text}
                      </span>
                    ))}
                  </div>

                  <div>
                    <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl font-black uppercase tracking-tight leading-none font-sans">
                      <span className="text-[#e50914] block drop-shadow-[0_2px_10px_rgba(229,9,20,0.5)]">{banner1.heading || 'SAVE MONEY.'}</span>
                    </h1>
                  </div>

                  <p className="text-slate-300 text-xs sm:text-base font-normal leading-snug sm:leading-relaxed max-w-md mx-auto lg:mx-0">
                    {banner1.description || 'OTT subscriptions, high-speed fiber internet, mobiles & gadgets — all at smart prices.'}
                  </p>

                  {/* Dynamic Independent Position Buttons */}
                  <div className="flex items-center justify-center lg:justify-start gap-2.5 sm:gap-4 pt-1 flex-wrap">
                    {Array.isArray(banner1.buttons) && banner1.buttons.length > 0 ? (
                      banner1.buttons.filter(b => b.is_active !== false).map((btn, btnIdx) => (
                        <button
                          key={btn.id || btnIdx}
                          onClick={() => {
                            if (btn.is_external) {
                              window.open(btn.link, btn.target || '_blank');
                            } else {
                              if (btn.link === 'offers' || btn.link === '/offers') onExploreDeals();
                              else if (btn.link === 'mobiles' || btn.link === '/mobiles') onShopNow();
                              else if (btn.link) window.open(btn.link, btn.target || '_self');
                            }
                          }}
                          style={{
                            transform: `translate(${btn.position_x || 0}px, ${btn.position_y || 0}px)`
                          }}
                          className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl font-extrabold text-xs sm:text-sm md:text-base shadow-lg transition-all hover:scale-105 cursor-pointer relative bg-gradient-to-r from-[#e50914] to-red-600 text-white border border-red-500/50"
                        >
                          {btn.text || 'Click Here'}
                        </button>
                      ))
                    ) : (
                      <>
                        <button
                          onClick={onExploreDeals}
                          className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-gradient-to-r from-[#e50914] to-red-600 hover:from-red-600 hover:to-red-700 text-white font-extrabold text-xs sm:text-sm md:text-base shadow-lg shadow-red-600/40 hover:scale-105 transition-all flex items-center gap-1.5"
                        >
                          <span>{banner1.button_text || 'Explore Deals'}</span>
                        </button>

                        <button
                          onClick={onShopNow}
                          className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-xs sm:text-sm md:text-base shadow-lg hover:scale-105 transition-all"
                        >
                          Shop Now
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-7 flex flex-col items-center justify-center relative w-full overflow-hidden h-48 sm:h-64 lg:h-72">
                  
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

                  {/* Product Showcase */}
                  <div className="relative w-full max-w-xl flex items-center justify-center flex-1 overflow-hidden">
                    <motion.div 
                      className="relative w-full h-full flex items-center justify-center"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <img 
                        src="/hero-products-showcase.png" 
                        alt="Hero Products Showcase Platform"
                        className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(168,85,247,0.5)] max-h-56"
                      />
                    </motion.div>
                  </div>

                </div>

              </div>

              {/* Bottom Feature Badges */}
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

            </motion.div>
          )}

          {/* SLIDE 2: POSTER 2 (EXACT SAME DIMENSIONS AS POSTER 1) */}
          {currentSlide === 1 && (
            <motion.div
              key="slide-neon-cyber"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={slideContainerClasses}
            >
              {/* Background Neon Rays */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(217,70,239,0.25),transparent_70%)] pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(249,115,22,0.2),transparent_60%)] pointer-events-none" />

              {/* Top Announcement Bar */}
              <div className="relative z-10 bg-gradient-to-r from-orange-500 via-rose-500 to-pink-600 text-white py-1.5 sm:py-2 px-3 sm:px-5 rounded-xl sm:rounded-2xl flex items-center justify-between shadow-lg shadow-pink-500/20 mb-2 sm:mb-4 w-full overflow-hidden shrink-0">
                <div className="flex items-center gap-1.5 sm:gap-2 font-bold text-[11px] sm:text-sm tracking-wide overflow-hidden">
                  <span className="bg-white text-pink-600 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black flex items-center gap-1 shrink-0">
                    <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" /> MEGA DEALS!
                  </span>
                  <span className="truncate">Up to 75% Off Premium Electronics &amp; OTT</span>
                </div>
                <button 
                  onClick={onExploreDeals}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white text-pink-600 flex items-center justify-center font-bold hover:scale-110 transition-transform shadow shrink-0"
                >
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-6 items-center relative z-10 w-full overflow-hidden flex-1">
                
                {/* Left Column */}
                <div className="lg:col-span-5 space-y-2 sm:space-y-4 text-center lg:text-left flex flex-col justify-center">
                  {/* Subheading / Badges */}
                  <div className="flex items-center justify-center lg:justify-start gap-2 flex-wrap mb-1">
                    {Array.isArray(banner2.subheadings) && banner2.subheadings.length > 0 ? (
                      banner2.subheadings.filter(s => s.is_active !== false).map((sub, sIdx) => (
                        <span key={sub.id || sIdx} style={{ transform: `translate(${sub.position_x || 0}px, ${sub.position_y || 0}px)` }} className="bg-amber-400 text-black px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wide relative shadow-sm">
                          {sub.text}
                        </span>
                      ))
                    ) : banner2.subheading && (
                      <span className="bg-amber-400 text-black px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wide shadow-sm">
                        {banner2.subheading}
                      </span>
                    )}

                    {Array.isArray(banner2.badges_data) && banner2.badges_data.length > 0 ? (
                      banner2.badges_data.filter(b => b.is_active !== false).map((bdg, bIdx) => (
                        <span key={bdg.id || bIdx} style={{ transform: `translate(${bdg.position_x || 0}px, ${bdg.position_y || 0}px)` }} className="bg-white text-pink-600 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border border-pink-400/40 relative shadow-sm">
                          {bdg.text}
                        </span>
                      ))
                    ) : Array.isArray(banner2.badges) && banner2.badges.map((bdg, bIdx) => (
                      <span key={bIdx} className="bg-white text-pink-600 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border border-pink-400/40 shadow-sm">
                        {typeof bdg === 'string' ? bdg : bdg.text}
                      </span>
                    ))}
                  </div>

                  <div>
                    <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl font-black uppercase tracking-tight leading-none font-sans">
                      <span className="bg-gradient-to-r from-orange-400 via-rose-400 to-pink-500 bg-clip-text text-transparent italic block drop-shadow-[0_0_20px_rgba(244,63,94,0.5)]">
                        {banner2.heading?.split('.')[0] ? banner2.heading.split('.')[0] + '.' : 'SAVE MORE.'}
                      </span>
                      <span className="text-white italic block drop-shadow-[0_0_25px_rgba(255,255,255,0.5)]">
                        {banner2.heading?.split('.')[1] ? banner2.heading.split('.')[1] + '.' : 'ENJOY MORE.'}
                      </span>
                    </h1>
                  </div>

                  <p className="text-slate-300 text-xs sm:text-base font-normal leading-snug sm:leading-relaxed max-w-md mx-auto lg:mx-0">
                    OTT subscriptions, high-speed fiber internet, mobiles &amp; gadgets — <span className="font-semibold text-pink-400">all at smart prices.</span>
                  </p>

                  {/* Dynamic Independent Position Buttons */}
                  <div className="flex items-center justify-center lg:justify-start gap-2.5 sm:gap-4 pt-1 flex-wrap">
                    {Array.isArray(banner2.buttons) && banner2.buttons.length > 0 ? (
                      banner2.buttons.filter(b => b.is_active !== false).map((btn, btnIdx) => (
                        <button
                          key={btn.id || btnIdx}
                          onClick={() => {
                            if (btn.is_external) {
                              window.open(btn.link, btn.target || '_blank');
                            } else {
                              if (btn.link === 'offers' || btn.link === '/offers') onExploreDeals();
                              else if (btn.link === 'mobiles' || btn.link === '/mobiles') onShopNow();
                              else if (btn.link) window.open(btn.link, btn.target || '_self');
                            }
                          }}
                          style={{
                            transform: `translate(${btn.position_x || 0}px, ${btn.position_y || 0}px)`
                          }}
                          className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl font-extrabold text-xs sm:text-sm md:text-base shadow-lg shadow-pink-500/50 transition-all hover:scale-105 cursor-pointer relative bg-gradient-to-r from-orange-500 via-rose-500 to-pink-600 text-white border border-pink-400/50"
                        >
                          {btn.text || 'Click Here'}
                        </button>
                      ))
                    ) : (
                      <>
                        <button
                          onClick={onExploreDeals}
                          className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-gradient-to-r from-orange-500 via-rose-500 to-pink-600 text-white font-extrabold text-xs sm:text-sm md:text-base shadow-lg shadow-pink-500/50 hover:scale-105 transition-all border border-pink-400/50"
                        >
                          {banner2.button_text || 'Explore Deals'}
                        </button>

                        <button
                          onClick={onShopNow}
                          className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-slate-950/90 text-white font-extrabold text-xs sm:text-sm md:text-base border-2 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-105 transition-all"
                        >
                          Shop Now
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-7 flex flex-col items-center justify-center relative w-full overflow-hidden h-48 sm:h-64 lg:h-72">
                  
                  {/* Top OTT Cards (Matching Slide 1 structure for exact equal spacing & alignment) */}
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

                  {/* Product Showcase */}
                  <div className="relative w-full max-w-xl flex items-center justify-center flex-1 overflow-hidden">
                    <motion.div 
                      className="relative w-full h-full flex items-center justify-center"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <img 
                        src="/hero-products-showcase.png" 
                        alt="Cyberpunk Hero Stage"
                        className="w-full h-full object-contain filter drop-shadow-[0_12px_28px_rgba(236,72,153,0.55)] max-h-56"
                      />
                    </motion.div>
                  </div>
                </div>

              </div>

              {/* Bottom Feature Badges */}
              <div className="hidden sm:grid sm:grid-cols-5 gap-2 mt-2 pt-2 border-t border-pink-900/40 text-xs text-slate-300 font-medium shrink-0">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-pink-950/80 border border-pink-500/40 flex items-center justify-center text-pink-400 shrink-0">
                    <Tag className="w-3 h-3" />
                  </div>
                  <span className="truncate">Best Prices Guaranteed</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-pink-950/80 border border-pink-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                    <Gauge className="w-3 h-3" />
                  </div>
                  <span className="truncate">High-Speed Fiber</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-pink-950/80 border border-pink-500/40 flex items-center justify-center text-amber-400 shrink-0">
                    <ShieldCheck className="w-3 h-3" />
                  </div>
                  <span className="truncate">Secure Payments</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-pink-950/80 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
                    <Headphones className="w-3 h-3" />
                  </div>
                  <span className="truncate">24/7 Support</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-pink-950/80 border border-pink-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <Truck className="w-3 h-3" />
                  </div>
                  <span className="truncate">Reliable Delivery</span>
                </div>
              </div>

            </motion.div>
          )}

        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-slate-950/80 hover:bg-slate-900 text-white border border-slate-700 flex items-center justify-center shadow-lg backdrop-blur-sm transition-all hover:scale-110"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-950/80 hover:bg-slate-900 text-white border border-slate-700 flex items-center justify-center shadow-lg backdrop-blur-sm transition-all hover:scale-110"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
        </button>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-2 sm:mt-3">
          <button
            onClick={() => setCurrentSlide(0)}
            className={`transition-all duration-300 rounded-full ${
              currentSlide === 0 
                ? 'w-6 sm:w-8 h-2.5 sm:h-3 bg-[#e50914] shadow-[0_0_10px_rgba(229,9,20,0.8)]' 
                : 'w-2.5 sm:w-3 h-2.5 sm:h-3 bg-slate-600 hover:bg-slate-400'
            }`}
            aria-label="Go to slide 1"
          />
          <button
            onClick={() => setCurrentSlide(1)}
            className={`transition-all duration-300 rounded-full ${
              currentSlide === 1 
                ? 'w-6 sm:w-8 h-2.5 sm:h-3 bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.8)]' 
                : 'w-2.5 sm:w-3 h-2.5 sm:h-3 bg-slate-600 hover:bg-slate-400'
            }`}
            aria-label="Go to slide 2"
          />
        </div>

      </div>
    </section>
  );
}

