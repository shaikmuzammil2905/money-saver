import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, ArrowRight, ChevronLeft, ChevronRight, Zap, Gift } from 'lucide-react';

export default function PromoSliderBanner({ onViewOffers, onSelectCategory }) {
  const [currentIdx, setCurrentIdx] = useState(0);

  const banners = [
    {
      id: 1,
      badge: 'MEGA DISCOUNT CARNIVAL',
      title: 'OTT & FIBER BROADBAND BUNDLES',
      subtitle: 'Get 12+ Premium OTT Apps & 200 Mbps Unlimited Fiber Internet',
      discount: 'UP TO 75% OFF',
      bgGradient: 'from-red-600 via-rose-600 to-orange-500',
      actionText: 'Explore Fiber Bundles',
      targetCategory: 'fiber'
    },
    {
      id: 2,
      badge: 'LIMITED TIME DEAL',
      title: 'NETFLIX 4K UHD & PRIME VIDEO',
      subtitle: 'Multi-screen Ultra HD Playback with Instant Digital Activation',
      discount: '70% OFF REGULAR PRICE',
      bgGradient: 'from-slate-900 via-zinc-900 to-red-950',
      actionText: 'Get OTT Subscriptions',
      targetCategory: 'ott'
    },
    {
      id: 3,
      badge: 'SMART GADGET FEST',
      title: '5G MOBILES & ANC EARBUDS',
      subtitle: 'Shop Sony IMX OIS Camera Phones, Smartwatches & ANC Earbuds',
      discount: 'SAVE UP TO ₹5,000',
      bgGradient: 'from-emerald-700 via-teal-800 to-slate-950',
      actionText: 'Shop Gadgets Deals',
      targetCategory: 'mobiles'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const activeBanner = banners[currentIdx];

  return (
    <div className="py-6 bg-slate-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-xl select-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeBanner.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
              className={`bg-gradient-to-r ${activeBanner.bgGradient} text-white p-6 sm:p-10 relative overflow-hidden border border-white/10`}
            >
              {/* Background ambient lighting */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.15),transparent_50%)] pointer-events-none" />

              <div className="relative z-10 max-w-2xl space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-black/30 backdrop-blur-md text-amber-300 border border-amber-300/30 text-[10px] sm:text-xs font-black uppercase px-3 py-1 rounded-full flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-current animate-bounce" />
                    {activeBanner.badge}
                  </span>
                  <span className="bg-white/20 text-white font-extrabold text-[10px] sm:text-xs px-2.5 py-1 rounded-full">
                    {activeBanner.discount}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight leading-tight">
                  {activeBanner.title}
                </h2>

                <p className="text-white/90 text-xs sm:text-base leading-relaxed">
                  {activeBanner.subtitle}
                </p>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (onSelectCategory) onSelectCategory(activeBanner.targetCategory);
                      else if (onViewOffers) onViewOffers();
                    }}
                    className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-white text-slate-900 font-extrabold text-xs sm:text-sm hover:bg-slate-100 shadow-lg active:scale-95 transition-all flex items-center gap-2 group"
                  >
                    <span>{activeBanner.actionText}</span>
                    <ArrowRight className="w-4 h-4 text-[#e50914] group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Slide Nav Indicators */}
              <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 flex items-center gap-1.5 z-20">
                {banners.map((b, i) => (
                  <button
                    key={b.id}
                    onClick={() => setCurrentIdx(i)}
                    className={`h-2 rounded-full transition-all ${
                      currentIdx === i ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
