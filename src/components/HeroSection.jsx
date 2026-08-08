import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Sparkles, Flame, ShieldCheck, ArrowRight } from 'lucide-react';
import { OTT_PROVIDERS } from '../data/products';

export default function HeroSection({ onExploreDeals, onShopNow }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 20; // range -10 to 10
    const y = (clientY / innerHeight - 0.5) * 20;
    setMousePos({ x, y });
  };

  return (
    <section 
      id="home" 
      onMouseMove={handleMouseMove}
      className="relative bg-slate-950 text-white overflow-hidden py-12 md:py-20 border-b border-slate-800"
    >
      {/* Background Ambient Glow & Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(229,9,20,0.15),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(249,115,22,0.1),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e50914_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Hero Text Content */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Tagline Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/80 border border-brand-red/40 text-brand-red text-xs md:text-sm font-semibold tracking-wide"
            >
              <Flame className="w-4 h-4 text-brand-red animate-pulse" />
              <span>Smart E-Commerce & OTT Subscription Hub</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-none uppercase font-sans"
            >
              <span className="text-brand-red block drop-shadow-lg">SAVE MONEY.</span>
              <span className="text-white block mt-1">ENJOY MORE.</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-slate-300 text-base sm:text-lg md:text-xl font-normal leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              OTT subscriptions, high-speed fiber internet, mobiles, gadgets & electronics — <span className="text-amber-400 font-semibold">all at smart prices.</span>
            </motion.p>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <button
                onClick={onExploreDeals}
                className="px-8 py-3.5 rounded-xl bg-brand-red hover:bg-brand-redHover text-white font-extrabold text-base shadow-lg shadow-brand-red/30 hover:shadow-brand-red/50 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 group"
              >
                <span>Explore Deals</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onShopNow}
                className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-extrabold text-base hover:border-slate-500 transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Shop Now
              </button>
            </motion.div>

            {/* Trust highlights */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-green" /> 100% Genuine Products
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" /> Instant Activation
              </span>
            </div>
          </div>

          {/* Right Column: Zero Gravity Anti-Gravity Floating Interactive Canvas */}
          <div className="lg:col-span-6 relative h-[380px] sm:h-[450px] md:h-[480px] w-full flex items-center justify-center">
            
            {/* Magnetic Tilt Parallax Container */}
            <motion.div 
              className="relative w-full h-full max-w-lg mx-auto flex items-center justify-center"
              animate={{
                x: mousePos.x,
                y: mousePos.y
              }}
              transition={{ type: 'spring', stiffness: 75, damping: 15 }}
            >

              {/* Central OTT Grid Screen */}
              <div className="relative z-10 bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-2xl shadow-2xl backdrop-blur-xl w-64 sm:w-80">
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="bg-red-950/80 border border-red-800/60 p-2.5 rounded-xl text-center shadow-md hover:scale-105 transition-transform">
                    <span className="text-red-500 font-black text-xs sm:text-sm tracking-wider">NETFLIX</span>
                  </div>
                  <div className="bg-sky-950/80 border border-sky-800/60 p-2.5 rounded-xl text-center shadow-md hover:scale-105 transition-transform">
                    <span className="text-sky-400 font-bold text-[10px] sm:text-xs">prime video</span>
                  </div>
                  <div className="bg-blue-950/80 border border-blue-800/60 p-2.5 rounded-xl text-center shadow-md hover:scale-105 transition-transform">
                    <span className="text-blue-300 font-extrabold text-[10px] sm:text-xs">Disney+ hotstar</span>
                  </div>
                  <div className="bg-purple-950/80 border border-purple-800/60 p-2.5 rounded-xl text-center shadow-md hover:scale-105 transition-transform">
                    <span className="text-purple-400 font-black text-xs">ZEE5</span>
                  </div>
                  <div className="bg-amber-950/80 border border-amber-800/60 p-2.5 rounded-xl text-center shadow-md hover:scale-105 transition-transform">
                    <span className="text-amber-500 font-bold text-xs">SONY liv</span>
                  </div>
                  <div className="bg-indigo-950/80 border border-indigo-800/60 p-2.5 rounded-xl text-center shadow-md hover:scale-105 transition-transform">
                    <span className="text-indigo-400 font-black text-xs">voot</span>
                  </div>
                </div>
              </div>

              {/* Floating Zero-Gravity Product 1: Router with Wi-Fi Antennas */}
              <div className="absolute -left-2 sm:left-2 bottom-6 z-20 animate-zero-gravity-1">
                <div className="bg-slate-900/90 border border-slate-700/80 p-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3">
                  <img 
                    src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=200&auto=format&fit=crop&q=80" 
                    alt="Fiber Router" 
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <div className="text-[11px] text-amber-400 font-bold">Fiber Broadband</div>
                    <div className="text-xs font-extrabold text-white">100 Mbps Unlimited</div>
                  </div>
                </div>
              </div>

              {/* Floating Zero-Gravity Product 2: Smartphone */}
              <div className="absolute right-0 sm:right-4 top-10 z-20 animate-zero-gravity-2">
                <div className="bg-slate-900/90 border border-slate-700/80 p-2.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-2">
                  <img 
                    src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=200&auto=format&fit=crop&q=80" 
                    alt="Smartphone" 
                    className="w-10 h-14 rounded-lg object-cover"
                  />
                  <div className="pr-2">
                    <div className="text-[10px] text-emerald-400 font-bold">5G Smartphone</div>
                    <div className="text-xs font-bold text-white">Narzo 70 Pro</div>
                  </div>
                </div>
              </div>

              {/* Floating Zero-Gravity Product 3: Smart Watch & Wireless Earbuds */}
              <div className="absolute right-2 sm:right-8 bottom-4 z-20 animate-zero-gravity-3">
                <div className="bg-slate-900/90 border border-slate-700/80 p-2.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-2">
                  <img 
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80" 
                    alt="Smartwatch" 
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&auto=format&fit=crop&q=80" 
                    alt="Earbuds" 
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                </div>
              </div>

              {/* Floating Zero-Gravity Circular Badge: 100+ PRODUCTS SMART DEALS EVERYDAY */}
              <div className="absolute -top-4 sm:top-0 right-2 sm:right-6 z-30 animate-zero-gravity-4">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white text-slate-950 border-4 border-dashed border-red-500 shadow-2xl flex flex-col items-center justify-center text-center p-2 transform rotate-6 hover:rotate-0 transition-transform">
                  <span className="text-xl sm:text-2xl font-black text-brand-red leading-none">100+</span>
                  <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-tight text-slate-900 leading-tight">PRODUCTS SMART DEALS</span>
                  <span className="text-[8px] sm:text-[9px] font-bold text-brand-green">EVERYDAY</span>
                </div>
              </div>

            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
