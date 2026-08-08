import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Sparkles, Flame, ShieldCheck, ArrowRight } from 'lucide-react';

export default function HeroSection({ onExploreDeals, onShopNow }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 20;
    const y = (clientY / innerHeight - 0.5) * 20;
    setMousePos({ x, y });
  };

  return (
    <section 
      id="home" 
      onMouseMove={handleMouseMove}
      className="relative bg-slate-950 text-white overflow-hidden py-12 md:py-24 border-b border-slate-800 font-sans"
    >
      {/* Grand Atmospheric Glow Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(229,9,20,0.25),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(249,115,22,0.18),transparent_55%)] pointer-events-none" />
      
      {/* Background Watermark Glow of image-hero.png for Atmosphere */}
      <div className="absolute top-1/2 right-4 -translate-y-1/2 w-[550px] h-[450px] opacity-15 pointer-events-none blur-xl">
        <img src="/image-hero.png" alt="Atmospheric Background" className="w-full h-full object-contain" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Hero Text Content */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Tagline Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-950/90 border border-brand-red/60 text-brand-red text-xs md:text-sm font-bold tracking-wide shadow-lg"
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
              <span className="text-brand-red block drop-shadow-xl">SAVE MONEY.</span>
              <span className="text-white block mt-1 drop-shadow-lg">ENJOY MORE.</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-slate-300 text-base sm:text-lg md:text-xl font-normal leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              OTT subscriptions, high-speed fiber internet, mobiles, gadgets & electronics — <span className="text-amber-400 font-extrabold">all at smart prices.</span>
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
                className="px-8 py-4 rounded-xl bg-brand-red hover:bg-brand-redHover text-white font-extrabold text-base shadow-xl shadow-brand-red/40 hover:shadow-brand-red/60 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2.5 group"
              >
                <span>Explore Deals</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onShopNow}
                className="px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-extrabold text-base hover:border-slate-500 transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Shop Now
              </button>
            </motion.div>

            {/* Trust highlights */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 font-semibold">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-green" /> 100% Genuine Products
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" /> Instant Activation
              </span>
            </div>
          </div>

          {/* Right Column: Zero Gravity Floating Showcase with image copy 3.png */}
          <div className="lg:col-span-6 relative h-[420px] sm:h-[480px] md:h-[520px] w-full flex items-center justify-center pt-6 lg:pt-0">
            
            {/* Magnetic Parallax Container */}
            <motion.div 
              className="relative w-full h-full max-w-lg mx-auto flex items-center justify-center"
              animate={{
                x: mousePos.x,
                y: mousePos.y
              }}
              transition={{ type: 'spring', stiffness: 50, damping: 15 }}
            >

              {/* Central Hero Centerpiece Card (image copy 3.png) */}
              <div className="relative z-10 w-80 sm:w-96 md:w-[420px] p-2.5 sm:p-3 rounded-3xl bg-slate-900/90 border border-slate-700/90 shadow-[0_0_60px_rgba(229,9,20,0.3)] backdrop-blur-xl animate-zero-gravity-1 hover:scale-105 transition-transform duration-300">
                <img 
                  src="/image-hero.png" 
                  alt="OTTMoneySaver Platform Subscriptions & Gadgets" 
                  className="w-full h-auto object-contain rounded-2xl drop-shadow-2xl"
                />
              </div>

              {/* Floating Zero-Gravity Gadget 1: High Speed Router */}
              <div className="absolute -left-4 sm:-left-6 -bottom-6 sm:-bottom-8 z-30 animate-zero-gravity-2">
                <div className="bg-slate-900/95 border border-slate-700/90 p-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3">
                  <img 
                    src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=200&auto=format&fit=crop&q=80" 
                    alt="Fiber Broadband Router" 
                    className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                  />
                  <div>
                    <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Fiber Broadband</div>
                    <div className="text-xs font-extrabold text-white">100 Mbps Unlimited</div>
                  </div>
                </div>
              </div>

              {/* Floating Zero-Gravity Gadget 2: Smartphone */}
              <div className="absolute -left-4 sm:-left-6 -top-6 sm:-top-8 z-30 animate-zero-gravity-3">
                <div className="bg-slate-900/95 border border-slate-700/90 p-2.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-2.5">
                  <img 
                    src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=200&auto=format&fit=crop&q=80" 
                    alt="5G Smartphone" 
                    className="w-10 h-14 rounded-lg object-cover border border-slate-700"
                  />
                  <div className="pr-2">
                    <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">5G Phone</div>
                    <div className="text-xs font-extrabold text-white">Realme Narzo 70 Pro</div>
                  </div>
                </div>
              </div>

              {/* Floating Zero-Gravity Circular Badge: 100+ PRODUCTS */}
              <div className="absolute -right-6 sm:-right-8 -top-8 sm:-top-10 z-30 animate-zero-gravity-2">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white text-slate-950 border-4 border-dashed border-brand-red shadow-2xl flex flex-col items-center justify-center text-center p-2 transform rotate-6 hover:rotate-0 transition-transform">
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
