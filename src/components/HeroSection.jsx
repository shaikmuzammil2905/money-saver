import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Flame, 
  ShieldCheck, 
  Zap, 
  Headphones, 
  Truck, 
  Tag, 
  Gauge, 
  Clock, 
  Tv, 
  Wifi, 
  Smartphone, 
  Gamepad2, 
  Speaker
} from 'lucide-react';

export default function HeroSection({ onExploreDeals, onShopNow }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slidesCount = 2;

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesCount);
    }, 5500);
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
      className="relative bg-slate-950 text-white overflow-hidden py-4 sm:py-6 font-sans select-none"
    >
      {/* Slider Carousel Container */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 relative">
        <AnimatePresence mode="wait">
          
          {/* SLIDE 1: RED CLASSIC BANNER (ChatGPT Image Aug 8, 2026 at 08_23_45 PM.png) */}
          {currentSlide === 0 && (
            <motion.div
              key="slide-red"
              initial={{ opacity: 0, scale: 0.98, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.98, x: -20 }}
              transition={{ duration: 0.75, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative bg-slate-950 rounded-3xl overflow-hidden border-2 border-[#e50914]/40 hover:border-[#e50914]/70 p-4 sm:p-6 lg:p-7 shadow-[0_12px_40px_rgba(229,9,20,0.25)] transition-all duration-500 max-w-6xl mx-auto"
            >
              {/* Background ambient red glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,rgba(229,9,20,0.25),transparent_60%)] pointer-events-none" />
              
              {/* Top Announcement Bar */}
              <div className="bg-[#e50914] text-white py-2.5 px-4 sm:px-6 rounded-2xl flex items-center justify-between shadow-md mb-6 sm:mb-8">
                <div className="flex items-center gap-2 font-bold text-xs sm:text-sm md:text-base tracking-wide">
                  <span className="bg-amber-400 text-black px-2 py-0.5 rounded-full text-xs font-black flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-current" /> BIG SAVINGS!
                  </span>
                  <span>Save More. Get More. Spend Smart.</span>
                </div>
                <button 
                  onClick={onExploreDeals}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-[#e50914] flex items-center justify-center font-bold hover:scale-110 transition-transform shadow"
                >
                  <ChevronRight className="w-5 h-5 stroke-[3]" />
                </button>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 pb-4">
                
                {/* Left Column: Heading & CTA */}
                <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-center lg:text-left">
                  <div className="space-y-1">
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-tight">
                      <span className="text-[#e50914] block drop-shadow-md">SAVE MONEY.</span>
                      <span className="text-white block drop-shadow-md">ENJOY MORE.</span>
                    </h1>
                  </div>

                  <p className="text-slate-200 text-sm sm:text-base md:text-lg font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
                    OTT subscriptions, high-speed fiber internet, mobiles, gadgets &amp; electronics — <span className="font-semibold text-white">all at smart prices.</span>
                  </p>

                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                    <button
                      onClick={onExploreDeals}
                      className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-[#e50914] to-red-600 hover:from-red-600 hover:to-red-700 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-red-600/40 hover:scale-105 transition-all flex items-center gap-2"
                    >
                      <span>Explore Deals</span>
                    </button>

                    <button
                      onClick={onShopNow}
                      className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-sm sm:text-base shadow-xl hover:scale-105 transition-all"
                    >
                      Shop Now
                    </button>
                  </div>
                </div>

                {/* Right Column: OTT Cards Grid & Device Showcase */}
                <div className="lg:col-span-6 flex flex-col items-center justify-center relative pt-4 lg:pt-0">
                  
                  {/* OTT Apps Grid (6 Cards) */}
                  <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 w-full max-w-md mb-6">
                    {/* Netflix */}
                    <div className="bg-black/90 border border-slate-800 rounded-xl p-3 sm:p-4 flex items-center justify-center h-14 sm:h-16 shadow-lg hover:border-red-600/60 transition-colors">
                      <span className="text-red-600 font-black text-sm sm:text-base tracking-wider uppercase">NETFLIX</span>
                    </div>
                    {/* Prime Video */}
                    <div className="bg-[#000511] border border-slate-800 rounded-xl p-3 sm:p-4 flex items-center justify-center h-14 sm:h-16 shadow-lg hover:border-sky-500/60 transition-colors">
                      <span className="text-sky-400 font-bold text-xs sm:text-sm tracking-tight">prime video</span>
                    </div>
                    {/* Disney+ Hotstar */}
                    <div className="bg-[#05112e] border border-slate-800 rounded-xl p-2 sm:p-3 flex items-center justify-center h-14 sm:h-16 shadow-lg hover:border-blue-500/60 transition-colors text-center">
                      <span className="text-white font-black text-xs sm:text-sm">Disney+ <span className="text-sky-400 font-normal">hotstar</span></span>
                    </div>
                    {/* ZEE5 */}
                    <div className="bg-black/90 border border-slate-800 rounded-xl p-2 sm:p-3 flex items-center justify-center h-14 sm:h-16 shadow-lg hover:border-purple-500/60 transition-colors">
                      <div className="flex items-center gap-1">
                        <div className="w-5 h-5 rounded-full border-2 border-purple-500 border-t-amber-400 border-r-cyan-400 flex items-center justify-center text-[8px] font-black">5</div>
                        <span className="text-white font-bold text-xs sm:text-sm">ZEE5</span>
                      </div>
                    </div>
                    {/* Sony LIV */}
                    <div className="bg-[#020914] border border-slate-800 rounded-xl p-2 sm:p-3 flex flex-col items-center justify-center h-14 sm:h-16 shadow-lg hover:border-amber-500/60 transition-colors">
                      <span className="text-[9px] font-bold text-white tracking-widest uppercase">SONY</span>
                      <span className="text-xs sm:text-sm font-black bg-gradient-to-r from-amber-400 via-rose-500 to-sky-400 bg-clip-text text-transparent">liv</span>
                    </div>
                    {/* Voot */}
                    <div className="bg-[#3e1388] border border-slate-800 rounded-xl p-2 sm:p-3 flex items-center justify-center h-14 sm:h-16 shadow-lg hover:border-purple-400 transition-colors">
                      <span className="text-white font-black text-sm sm:text-base tracking-tight lowercase">voot</span>
                    </div>
                  </div>

                  {/* Hardware Devices Display Row */}
                  <div className="relative w-full max-w-lg flex items-end justify-center gap-2 sm:gap-4 pt-2">
                    {/* Fiber Router */}
                    <div className="flex flex-col items-center transform hover:scale-105 transition-transform">
                      <div className="relative bg-slate-900 border border-slate-700 rounded-xl p-2 shadow-xl w-24 sm:w-32 flex flex-col items-center">
                        <div className="flex gap-1.5 mb-1 text-slate-400">
                          <span className="w-0.5 h-6 bg-slate-500 rounded"></span>
                          <span className="w-0.5 h-7 bg-slate-400 rounded"></span>
                          <span className="w-0.5 h-6 bg-slate-500 rounded"></span>
                        </div>
                        <div className="w-full bg-slate-950 h-6 rounded flex items-center justify-between px-2">
                          <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                          </div>
                          <span className="text-[7px] text-slate-500 font-mono">FIBER</span>
                        </div>
                      </div>
                    </div>

                    {/* Gamepad Controller */}
                    <div className="bg-slate-900 border border-slate-700 p-2 rounded-2xl shadow-xl flex items-center gap-1.5 transform hover:scale-105 transition-transform">
                      <Gamepad2 className="w-8 h-8 sm:w-10 sm:h-10 text-slate-300" />
                    </div>

                    {/* Speaker */}
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-2.5 shadow-xl flex flex-col items-center justify-center w-12 h-16 sm:w-14 sm:h-20 transform hover:scale-105 transition-transform">
                      <Speaker className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
                      <span className="text-[8px] text-slate-400 mt-1 font-bold">JBL</span>
                    </div>

                    {/* iPhone */}
                    <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl p-1.5 shadow-2xl w-14 sm:w-16 h-24 sm:h-28 flex flex-col justify-between transform hover:scale-105 transition-transform">
                      <div className="w-4 h-1 bg-slate-700 rounded-full mx-auto"></div>
                      <div className="text-[9px] text-center font-bold text-slate-300">5G Phone</div>
                      <div className="w-3 h-3 rounded-full border border-slate-600 mx-auto"></div>
                    </div>

                    {/* Smartwatch & AirPods */}
                    <div className="flex flex-col gap-2">
                      <div className="bg-slate-900 border border-slate-700 rounded-xl p-1.5 shadow-lg flex items-center gap-1">
                        <div className="w-6 h-6 rounded bg-slate-950 border border-amber-400/50 flex items-center justify-center text-[8px] font-mono text-amber-400 font-bold">
                          10:09
                        </div>
                      </div>
                      <div className="bg-slate-100 rounded-xl p-1 shadow-md w-8 h-6 flex items-center justify-center">
                        <div className="w-5 h-4 bg-white border border-slate-300 rounded-md"></div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* Bottom Feature Badges Bar */}
              <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs text-slate-300 font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-950/80 border border-red-600/50 flex items-center justify-center text-red-500 shrink-0">
                    <Tag className="w-4 h-4" />
                  </div>
                  <span>Best Prices Guaranteed</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-950/80 border border-red-600/50 flex items-center justify-center text-red-500 shrink-0">
                    <Gauge className="w-4 h-4" />
                  </div>
                  <span>High-Speed Internet</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-950/80 border border-red-600/50 flex items-center justify-center text-red-500 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span>100% Secure Payments</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-950/80 border border-red-600/50 flex items-center justify-center text-red-500 shrink-0">
                    <Headphones className="w-4 h-4" />
                  </div>
                  <span>24/7 Customer Support</span>
                </div>

                <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                  <div className="w-8 h-8 rounded-full bg-red-950/80 border border-red-600/50 flex items-center justify-center text-red-500 shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <span>Fast &amp; Reliable Delivery</span>
                </div>
              </div>

            </motion.div>
          )}

          {/* SLIDE 2: NEON CYBERPUNK BANNER (ChatGPT Image Aug 8, 2026 at 08_25_37 PM 2.png) */}
          {currentSlide === 1 && (
            <motion.div
              key="slide-neon"
              initial={{ opacity: 0, scale: 0.98, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.98, x: -20 }}
              transition={{ duration: 0.75, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative bg-slate-950 rounded-3xl overflow-hidden border-2 border-orange-500/40 hover:border-pink-500/70 p-4 sm:p-6 lg:p-7 shadow-[0_12px_40px_rgba(249,115,22,0.25)] transition-all duration-500 max-w-6xl mx-auto"
            >
              {/* Laser beam particle background */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(217,70,239,0.2),transparent_70%)] pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(249,115,22,0.18),transparent_60%)] pointer-events-none" />
              
              {/* Top Announcement Bar - Neon Gradient */}
              <div className="bg-gradient-to-r from-orange-500 via-rose-500 to-pink-600 text-white py-2.5 px-4 sm:px-6 rounded-2xl flex items-center justify-between shadow-lg shadow-pink-500/20 mb-6 sm:mb-8">
                <div className="flex items-center gap-2 font-bold text-xs sm:text-sm md:text-base tracking-wide">
                  <span className="bg-white text-pink-600 px-2 py-0.5 rounded-full text-xs font-black flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-current" /> BIG SAVINGS!
                  </span>
                  <span>Save More. Get More. Spend Smart.</span>
                </div>
                <button 
                  onClick={onExploreDeals}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-pink-600 flex items-center justify-center font-bold hover:scale-110 transition-transform shadow"
                >
                  <ChevronRight className="w-5 h-5 stroke-[3]" />
                </button>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 pb-4">
                
                {/* Left Column */}
                <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-center lg:text-left">
                  <div className="space-y-1">
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-tight font-sans">
                      <span className="bg-gradient-to-r from-orange-400 via-rose-400 to-pink-500 bg-clip-text text-transparent italic block drop-shadow-[0_0_20px_rgba(244,63,94,0.5)]">
                        SAVE MORE.
                      </span>
                      <span className="text-white italic block drop-shadow-[0_0_25px_rgba(255,255,255,0.6)]">
                        ENJOY MORE.
                      </span>
                    </h1>
                  </div>

                  <p className="text-slate-200 text-sm sm:text-base md:text-lg font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
                    OTT subscriptions, high-speed fiber internet, mobiles, gadgets &amp; electronics — <span className="font-semibold text-pink-400">all at smart prices.</span>
                  </p>

                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                    <button
                      onClick={onExploreDeals}
                      className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-rose-500 to-pink-600 hover:from-orange-400 hover:to-pink-500 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-pink-500/50 hover:scale-105 transition-all border border-pink-400/50"
                    >
                      Explore Deals
                    </button>

                    <button
                      onClick={onShopNow}
                      className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-white font-extrabold text-sm sm:text-base border-2 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:scale-105 transition-all"
                    >
                      Shop Now
                    </button>
                  </div>
                </div>

                {/* Right Column: Glowing Neon Showcase Frame */}
                <div className="lg:col-span-6 flex flex-col items-center justify-center relative pt-4 lg:pt-0">
                  
                  {/* Neon Glowing Frame Enclosure */}
                  <div className="relative p-4 sm:p-6 rounded-3xl border-2 border-cyan-400/80 shadow-[0_0_35px_rgba(6,182,212,0.4)] bg-slate-950/80 backdrop-blur-md w-full max-w-md">
                    
                    {/* OTT Apps Grid */}
                    <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 w-full mb-6">
                      <div className="bg-black/90 border border-pink-500/40 rounded-xl p-3 sm:p-4 flex items-center justify-center h-14 sm:h-16 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                        <span className="text-red-500 font-black text-sm sm:text-base tracking-wider uppercase">NETFLIX</span>
                      </div>
                      <div className="bg-[#000511] border border-sky-500/40 rounded-xl p-3 sm:p-4 flex items-center justify-center h-14 sm:h-16 shadow-[0_0_15px_rgba(14,165,233,0.3)]">
                        <span className="text-sky-400 font-bold text-xs sm:text-sm">prime video</span>
                      </div>
                      <div className="bg-[#05112e] border border-blue-500/40 rounded-xl p-2 sm:p-3 flex items-center justify-center h-14 sm:h-16 text-center shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                        <span className="text-white font-black text-xs sm:text-sm">Disney+ <span className="text-sky-400 font-normal">hotstar</span></span>
                      </div>
                      <div className="bg-black/90 border border-purple-500/40 rounded-xl p-2 sm:p-3 flex items-center justify-center h-14 sm:h-16 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                        <div className="flex items-center gap-1">
                          <div className="w-5 h-5 rounded-full border-2 border-purple-500 border-t-amber-400 flex items-center justify-center text-[8px] font-black">5</div>
                          <span className="text-white font-bold text-xs sm:text-sm">ZEE5</span>
                        </div>
                      </div>
                      <div className="bg-[#020914] border border-amber-500/40 rounded-xl p-2 sm:p-3 flex flex-col items-center justify-center h-14 sm:h-16 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                        <span className="text-[9px] font-bold text-white tracking-widest uppercase">SONY</span>
                        <span className="text-xs sm:text-sm font-black text-amber-400">liv</span>
                      </div>
                      <div className="bg-[#3e1388] border border-pink-400/40 rounded-xl p-2 sm:p-3 flex items-center justify-center h-14 sm:h-16 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                        <span className="text-white font-black text-sm sm:text-base lowercase">voot</span>
                      </div>
                    </div>

                    {/* Circular Glowing Stage Base Platform */}
                    <div className="relative w-full rounded-2xl bg-gradient-to-b from-purple-900/60 to-slate-950 p-3 border-t border-purple-500/60 shadow-[0_0_30px_rgba(168,85,247,0.5)] flex items-end justify-center gap-3">
                      
                      {/* Router */}
                      <div className="flex flex-col items-center">
                        <div className="bg-slate-900 border border-cyan-400/60 rounded-xl p-2 shadow-[0_0_15px_rgba(6,182,212,0.4)] w-20 sm:w-24 flex flex-col items-center">
                          <div className="flex gap-1 mb-1">
                            <span className="w-0.5 h-5 bg-cyan-400 rounded animate-pulse"></span>
                            <span className="w-0.5 h-6 bg-purple-400 rounded"></span>
                            <span className="w-0.5 h-5 bg-cyan-400 rounded animate-pulse"></span>
                          </div>
                          <div className="w-full bg-slate-950 h-5 rounded flex items-center justify-center">
                            <span className="text-[7px] text-cyan-400 font-mono">100 Mbps</span>
                          </div>
                        </div>
                      </div>

                      {/* Gamepad */}
                      <div className="bg-slate-900 border border-purple-400/60 p-2 rounded-2xl shadow-[0_0_15px_rgba(168,85,247,0.4)] flex items-center gap-1">
                        <Gamepad2 className="w-7 h-7 text-purple-300" />
                      </div>

                      {/* Speaker */}
                      <div className="bg-slate-900 border border-pink-400/60 rounded-2xl p-2 shadow-[0_0_15px_rgba(244,63,94,0.4)] flex flex-col items-center justify-center w-10 h-14">
                        <Speaker className="w-5 h-5 text-pink-400" />
                      </div>

                      {/* Smartphone */}
                      <div className="bg-slate-900 border-2 border-pink-500/80 rounded-2xl p-1 shadow-[0_0_20px_rgba(236,72,153,0.5)] w-12 sm:w-14 h-20 sm:h-22 flex flex-col justify-between">
                        <div className="w-3 h-1 bg-pink-400 rounded-full mx-auto"></div>
                        <div className="text-[8px] text-center font-bold text-pink-300">5G Phone</div>
                        <div className="w-2 h-2 rounded-full border border-pink-400 mx-auto"></div>
                      </div>

                    </div>

                  </div>

                </div>

              </div>

              {/* Bottom Feature Badges Bar - Neon Divider Lines */}
              <div className="mt-4 pt-4 border-t border-purple-900/60 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs text-slate-200 font-medium">
                <div className="flex items-center gap-2 border-r border-purple-900/40 pr-2">
                  <div className="w-8 h-8 rounded-full bg-purple-950 border border-purple-500/60 flex items-center justify-center text-pink-400 shrink-0 shadow-[0_0_10px_rgba(236,72,153,0.4)]">
                    <Tag className="w-4 h-4" />
                  </div>
                  <span>Best Prices Guaranteed</span>
                </div>

                <div className="flex items-center gap-2 border-r border-purple-900/40 pr-2">
                  <div className="w-8 h-8 rounded-full bg-purple-950 border border-purple-500/60 flex items-center justify-center text-cyan-400 shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                    <Gauge className="w-4 h-4" />
                  </div>
                  <span>High-Speed Internet</span>
                </div>

                <div className="flex items-center gap-2 border-r border-purple-900/40 pr-2">
                  <div className="w-8 h-8 rounded-full bg-purple-950 border border-purple-500/60 flex items-center justify-center text-amber-400 shrink-0 shadow-[0_0_10px_rgba(245,158,11,0.4)]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span>100% Secure Payments</span>
                </div>

                <div className="flex items-center gap-2 border-r border-purple-900/40 pr-2">
                  <div className="w-8 h-8 rounded-full bg-purple-950 border border-purple-500/60 flex items-center justify-center text-purple-400 shrink-0 shadow-[0_0_10px_rgba(168,85,247,0.4)]">
                    <Headphones className="w-4 h-4" />
                  </div>
                  <span>24/7 Customer Support</span>
                </div>

                <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                  <div className="w-8 h-8 rounded-full bg-purple-950 border border-purple-500/60 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                    <Truck className="w-4 h-4" />
                  </div>
                  <span>Fast &amp; Reliable Delivery</span>
                </div>
              </div>

            </motion.div>
          )}

        </AnimatePresence>

        {/* Carousel Navigation Arrow Controls */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-950/80 hover:bg-slate-900 text-white border border-slate-700 flex items-center justify-center shadow-lg backdrop-blur-sm transition-all hover:scale-110"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-950/80 hover:bg-slate-900 text-white border border-slate-700 flex items-center justify-center shadow-lg backdrop-blur-sm transition-all hover:scale-110"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Carousel Pagination Indicator Dots */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setCurrentSlide(0)}
            className={`transition-all duration-300 rounded-full ${
              currentSlide === 0 
                ? 'w-8 h-3 bg-[#e50914] shadow-[0_0_10px_rgba(229,9,20,0.8)]' 
                : 'w-3 h-3 bg-slate-600 hover:bg-slate-400'
            }`}
            aria-label="Go to slide 1"
          />
          <button
            onClick={() => setCurrentSlide(1)}
            className={`transition-all duration-300 rounded-full ${
              currentSlide === 1 
                ? 'w-8 h-3 bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.8)]' 
                : 'w-3 h-3 bg-slate-600 hover:bg-slate-400'
            }`}
            aria-label="Go to slide 2"
          />
        </div>

      </div>
    </section>
  );
}
