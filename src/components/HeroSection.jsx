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

export default function HeroSection({ onExploreDeals, onShopNow }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slidesCount = 2;

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesCount);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slidesCount);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slidesCount) % slidesCount);
  };

  return (
    <section 
      id="home"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative bg-[#020510] text-white overflow-hidden py-2 sm:py-5 font-sans select-none"
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 relative">
        <AnimatePresence mode="wait">
          
          {/* SLIDE 1: EXACT TARGET DESIGN MATCHING REFERENCE IMAGE 2 (image copy 14.png) */}
          {currentSlide === 0 && (
            <motion.div
              key="slide-target-hero"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="relative bg-gradient-to-br from-[#050b1e] via-[#090518] to-[#02040c] rounded-2xl sm:rounded-3xl border border-purple-500/30 hover:border-purple-500/60 p-3 sm:p-6 lg:p-7 shadow-[0_8px_32px_rgba(168,85,247,0.25)] transition-all duration-500 max-w-6xl mx-auto overflow-hidden"
            >
              {/* Futuristic Cyberpunk Background Neon Glow Rays */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.3),transparent_70%)] pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_center,rgba(59,130,246,0.25),transparent_60%)] pointer-events-none" />

              {/* Glowing Neon Light Streaks */}
              <div className="absolute -top-24 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

              {/* Compact Top Announcement Bar */}
              <div className="relative z-10 bg-gradient-to-r from-[#e50914] via-red-600 to-rose-600 text-white py-1.5 sm:py-2 px-3 sm:px-5 rounded-xl sm:rounded-2xl flex items-center justify-between shadow-md mb-3 sm:mb-6">
                <div className="flex items-center gap-1.5 sm:gap-2 font-bold text-[11px] sm:text-sm tracking-wide">
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

              {/* Main Grid Layout (Left Text CTA + Right OTT Cards & Products Showcase) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 items-center relative z-10 pb-2">
                
                {/* Left Column: Heading & CTA */}
                <div className="lg:col-span-5 space-y-2.5 sm:space-y-5 text-center lg:text-left">
                  <div className="space-y-0.5">
                    <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-none font-sans">
                      <span className="text-[#e50914] block drop-shadow-[0_2px_10px_rgba(229,9,20,0.5)]">SAVE MONEY.</span>
                      <span className="text-white block drop-shadow-[0_2px_10px_rgba(255,255,255,0.4)]">ENJOY MORE.</span>
                    </h1>
                  </div>

                  <p className="text-slate-300 text-xs sm:text-base font-normal leading-snug sm:leading-relaxed max-w-md mx-auto lg:mx-0">
                    OTT subscriptions, high-speed fiber internet, mobiles, gadgets &amp; electronics — <span className="font-semibold text-white">all at smart prices.</span>
                  </p>

                  <div className="flex items-center justify-center lg:justify-start gap-2.5 sm:gap-4 pt-1">
                    <button
                      onClick={onExploreDeals}
                      className="px-4 sm:px-7 py-2.5 sm:py-3.5 rounded-xl bg-gradient-to-r from-[#e50914] to-red-600 hover:from-red-600 hover:to-red-700 text-white font-extrabold text-xs sm:text-sm md:text-base shadow-lg shadow-red-600/40 hover:scale-105 transition-all flex items-center gap-1.5"
                    >
                      <span>Explore Deals</span>
                    </button>

                    <button
                      onClick={onShopNow}
                      className="px-4 sm:px-7 py-2.5 sm:py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-xs sm:text-sm md:text-base shadow-lg hover:scale-105 transition-all"
                    >
                      Shop Now
                    </button>
                  </div>
                </div>

                {/* Right Column: Top OTT Cards + Centered Products Showcase on Glowing Circular Platform */}
                <div className="lg:col-span-7 flex flex-col items-center justify-center relative pt-1 sm:pt-2 lg:pt-0">
                  
                  {/* Top OTT Cards (ZEE5, Sony LIV, Voot, Netflix, Prime Video, Hotstar) */}
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 sm:gap-2.5 w-full max-w-xl mb-2 sm:mb-4">
                    {/* NETFLIX */}
                    <div className="bg-black/80 border border-red-600/40 rounded-lg sm:rounded-xl p-1.5 sm:p-2.5 flex items-center justify-center h-9 sm:h-12 shadow-md">
                      <span className="text-red-600 font-black text-xs sm:text-sm tracking-wider">NETFLIX</span>
                    </div>
                    {/* prime video */}
                    <div className="bg-[#000511] border border-sky-500/40 rounded-lg sm:rounded-xl p-1.5 sm:p-2.5 flex items-center justify-center h-9 sm:h-12 shadow-md">
                      <span className="text-sky-400 font-bold text-[10px] sm:text-xs">prime video</span>
                    </div>
                    {/* Disney+ hotstar */}
                    <div className="bg-[#05112e] border border-blue-500/40 rounded-lg sm:rounded-xl p-1 sm:p-2 flex items-center justify-center h-9 sm:h-12 text-center shadow-md">
                      <span className="text-white font-black text-[9px] sm:text-xs">Disney+ <span className="text-sky-400 font-normal">hotstar</span></span>
                    </div>
                    {/* ZEE5 */}
                    <div className="bg-black/80 border border-purple-500/40 rounded-lg sm:rounded-xl p-1 sm:p-2 flex items-center justify-center h-9 sm:h-12 shadow-md">
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded-full border-2 border-purple-500 border-t-amber-400 flex items-center justify-center text-[7px] font-black">5</div>
                        <span className="text-white font-bold text-[10px] sm:text-xs">ZEE5</span>
                      </div>
                    </div>
                    {/* SONY liv */}
                    <div className="bg-[#020914] border border-amber-500/40 rounded-lg sm:rounded-xl p-1 sm:p-2 flex flex-col items-center justify-center h-9 sm:h-12 shadow-md">
                      <span className="text-[7px] sm:text-[8px] font-bold text-white tracking-widest">SONY</span>
                      <span className="text-[10px] sm:text-xs font-black text-amber-400 leading-none">liv</span>
                    </div>
                    {/* voot */}
                    <div className="bg-[#3e1388] border border-purple-400/40 rounded-lg sm:rounded-xl p-1 sm:p-2 flex items-center justify-center h-9 sm:h-12 shadow-md">
                      <span className="text-white font-black text-xs sm:text-sm lowercase">voot</span>
                    </div>
                  </div>

                  {/* Primary Target Product Showcase: Router | Controller | Speaker | Phone | Watch | Earbuds standing on Glowing Neon Platform */}
                  <div className="relative w-full max-w-xl rounded-2xl overflow-hidden bg-slate-950/40 border border-purple-500/30 p-1 sm:p-2 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                    
                    {/* Image Render of Reference Design Platform (image copy 14.png) */}
                    <div className="relative w-full h-36 sm:h-56 md:h-64 rounded-xl overflow-hidden flex items-center justify-center">
                      <img 
                        src="/hero-products-showcase.png" 
                        alt="Target Hero Showcase Platform"
                        className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(168,85,247,0.4)]"
                      />
                      
                      {/* Subtle Ambient Neon Purple/Magenta Edge Ring Overlay */}
                      <div className="absolute inset-0 rounded-xl pointer-events-none border border-purple-500/40 shadow-[inset_0_0_20px_rgba(236,72,153,0.3)]" />
                    </div>

                  </div>

                </div>

              </div>

              {/* Bottom Feature Badges (Compact) */}
              <div className="mt-2 sm:mt-4 pt-2 sm:pt-4 border-t border-purple-900/40 grid grid-cols-2 sm:grid-cols-5 gap-2 text-[10px] sm:text-xs text-slate-300 font-medium">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-pink-400 shrink-0">
                    <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                  <span className="truncate">Best Prices Guaranteed</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                    <Gauge className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                  <span className="truncate">High-Speed Fiber</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-amber-400 shrink-0">
                    <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                  <span className="truncate">Secure Payments</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
                    <Headphones className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                  <span className="truncate">24/7 Support</span>
                </div>

                <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                  <span className="truncate">Reliable Delivery</span>
                </div>
              </div>

            </motion.div>
          )}

          {/* SLIDE 2: NEON CYBERPUNK BANNER */}
          {currentSlide === 1 && (
            <motion.div
              key="slide-neon-cyber"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="relative bg-gradient-to-br from-[#0c051a] via-[#120626] to-[#04010d] rounded-2xl sm:rounded-3xl border border-pink-500/40 p-3 sm:p-6 lg:p-7 shadow-[0_8px_32px_rgba(236,72,153,0.3)] transition-all duration-500 max-w-6xl mx-auto overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(217,70,239,0.25),transparent_70%)] pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(249,115,22,0.2),transparent_60%)] pointer-events-none" />

              {/* Announcement Bar */}
              <div className="relative z-10 bg-gradient-to-r from-orange-500 via-rose-500 to-pink-600 text-white py-1.5 sm:py-2 px-3 sm:px-5 rounded-xl sm:rounded-2xl flex items-center justify-between shadow-lg shadow-pink-500/20 mb-3 sm:mb-6">
                <div className="flex items-center gap-1.5 sm:gap-2 font-bold text-[11px] sm:text-sm tracking-wide">
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

              {/* Main Content */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 items-center relative z-10 pb-2">
                <div className="lg:col-span-5 space-y-2.5 sm:space-y-5 text-center lg:text-left">
                  <div className="space-y-0.5">
                    <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-none font-sans">
                      <span className="bg-gradient-to-r from-orange-400 via-rose-400 to-pink-500 bg-clip-text text-transparent italic block drop-shadow-[0_0_20px_rgba(244,63,94,0.5)]">
                        SAVE MORE.
                      </span>
                      <span className="text-white italic block drop-shadow-[0_0_25px_rgba(255,255,255,0.5)]">
                        ENJOY MORE.
                      </span>
                    </h1>
                  </div>

                  <p className="text-slate-300 text-xs sm:text-base font-normal leading-snug sm:leading-relaxed max-w-md mx-auto lg:mx-0">
                    OTT subscriptions, high-speed fiber internet, mobiles, gadgets &amp; electronics — <span className="font-semibold text-pink-400">all at smart prices.</span>
                  </p>

                  <div className="flex items-center justify-center lg:justify-start gap-2.5 sm:gap-4 pt-1">
                    <button
                      onClick={onExploreDeals}
                      className="px-4 sm:px-7 py-2.5 sm:py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-rose-500 to-pink-600 text-white font-extrabold text-xs sm:text-sm md:text-base shadow-lg shadow-pink-500/50 hover:scale-105 transition-all border border-pink-400/50"
                    >
                      Explore Deals
                    </button>

                    <button
                      onClick={onShopNow}
                      className="px-4 sm:px-7 py-2.5 sm:py-3.5 rounded-xl bg-slate-950/90 text-white font-extrabold text-xs sm:text-sm md:text-base border-2 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-105 transition-all"
                    >
                      Shop Now
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-7 flex flex-col items-center justify-center relative pt-1 sm:pt-2 lg:pt-0">
                  <div className="relative w-full max-w-xl rounded-2xl overflow-hidden bg-slate-950/60 border border-pink-500/40 p-1 sm:p-2 shadow-[0_0_35px_rgba(236,72,153,0.35)]">
                    <div className="relative w-full h-36 sm:h-56 md:h-64 rounded-xl overflow-hidden flex items-center justify-center">
                      <img 
                        src="/hero-products-showcase.png" 
                        alt="Cyberpunk Hero Stage"
                        className="w-full h-full object-contain filter drop-shadow-[0_10px_25px_rgba(236,72,153,0.5)]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-2 sm:mt-4 pt-2 sm:pt-4 border-t border-pink-900/40 grid grid-cols-2 sm:grid-cols-5 gap-2 text-[10px] sm:text-xs text-slate-300 font-medium">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-pink-950/80 border border-pink-500/40 flex items-center justify-center text-pink-400 shrink-0">
                    <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                  <span className="truncate">Best Prices Guaranteed</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-pink-950/80 border border-pink-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                    <Gauge className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                  <span className="truncate">High-Speed Fiber</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-pink-950/80 border border-pink-500/40 flex items-center justify-center text-amber-400 shrink-0">
                    <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                  <span className="truncate">Secure Payments</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-pink-950/80 border border-pink-500/40 flex items-center justify-center text-purple-400 shrink-0">
                    <Headphones className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                  <span className="truncate">24/7 Support</span>
                </div>

                <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-pink-950/80 border border-pink-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
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
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-950/80 hover:bg-slate-900 text-white border border-slate-700 flex items-center justify-center shadow-lg backdrop-blur-sm transition-all hover:scale-110"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-950/80 hover:bg-slate-900 text-white border border-slate-700 flex items-center justify-center shadow-lg backdrop-blur-sm transition-all hover:scale-110"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-2 sm:mt-4">
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
