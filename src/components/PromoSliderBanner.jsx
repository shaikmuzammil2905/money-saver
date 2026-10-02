import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, ArrowRight, ChevronLeft, ChevronRight, Zap, Gift } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export default function PromoSliderBanner({ onViewOffers, onSelectCategory }) {
  const { banners: cmsBanners } = useCMS();
  const [currentIdx, setCurrentIdx] = useState(0);

  const b1 = cmsBanners.find(b => b.banner_key === 'home_small_1') || {};
  const b2 = cmsBanners.find(b => b.banner_key === 'home_small_2') || {};
  const b3 = cmsBanners.find(b => b.banner_key === 'home_small_3') || {};

  const banners = [
    {
      id: b1.id || 'b1',
      badge: b1.subheading || 'MEGA DISCOUNT CARNIVAL',
      title: b1.heading || 'OTT & FIBER BROADBAND BUNDLES',
      subtitle: b1.description || 'Get 12+ Premium OTT Apps & 200 Mbps Unlimited Fiber Internet',
      discount: b1.discount || 'UP TO 75% OFF',
      bgColor: b1.bg_color || '#dc2626',
      bgGradient: 'from-red-600 via-rose-600 to-orange-500',
      imageUrl: b1.image_url || '',
      overlayColor: b1.overlay_color || 'rgba(0,0,0,0.25)',
      textColor: b1.text_color || '#ffffff',
      buttonColor: b1.button_color || '#ffffff',
      actionText: b1.button_text || 'Explore Fiber Bundles',
      buttonLink: b1.button_link || 'fiber',
      targetCategory: b1.button_link || 'fiber'
    },
    {
      id: b2.id || 'b2',
      badge: b2.subheading || 'LIMITED TIME DEAL',
      title: b2.heading || 'NETFLIX 4K UHD & PRIME VIDEO',
      subtitle: b2.description || 'Multi-screen Ultra HD Playback with Instant Digital Activation',
      discount: b2.discount || '70% OFF REGULAR PRICE',
      bgColor: b2.bg_color || '#0f172a',
      bgGradient: 'from-slate-900 via-zinc-900 to-red-950',
      imageUrl: b2.image_url || '',
      overlayColor: b2.overlay_color || 'rgba(0,0,0,0.3)',
      textColor: b2.text_color || '#ffffff',
      buttonColor: b2.button_color || '#e50914',
      actionText: b2.button_text || 'Get OTT Subscriptions',
      buttonLink: b2.button_link || 'ott-plans',
      targetCategory: b2.button_link || 'ott'
    },
    {
      id: b3.id || 'b3',
      badge: b3.subheading || 'SMART GADGET FEST',
      title: b3.heading || '5G MOBILES & ANC EARBUDS',
      subtitle: b3.description || 'Shop Sony IMX OIS Camera Phones, Smartwatches & ANC Earbuds',
      discount: b3.discount || 'SAVE UP TO ₹5,000',
      bgColor: b3.bg_color || '#064e3b',
      bgGradient: 'from-emerald-700 via-teal-800 to-slate-950',
      imageUrl: b3.image_url || '',
      overlayColor: b3.overlay_color || 'rgba(0,0,0,0.25)',
      textColor: b3.text_color || '#ffffff',
      buttonColor: b3.button_color || '#10b981',
      actionText: b3.button_text || 'Shop Gadgets Deals',
      buttonLink: b3.button_link || 'mobiles',
      targetCategory: b3.button_link || 'mobiles'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const activeBanner = banners[currentIdx];

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
              style={{
                backgroundColor: activeBanner.bgColor,
                color: activeBanner.textColor
              }}
              className={`p-6 sm:p-10 relative overflow-hidden border border-white/10 ${
                !activeBanner.imageUrl ? `bg-gradient-to-r ${activeBanner.bgGradient}` : ''
              }`}
            >
              {/* Optional Background Image */}
              {activeBanner.imageUrl && (
                <img 
                  src={activeBanner.imageUrl} 
                  alt={activeBanner.title}
                  className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
                />
              )}

              {/* Color Overlay */}
              <div 
                style={{ backgroundColor: activeBanner.overlayColor }}
                className="absolute inset-0 pointer-events-none"
              />

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

                <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight leading-tight" style={{ color: activeBanner.textColor }}>
                  {activeBanner.title}
                </h2>

                <p className="text-white/90 text-xs sm:text-base leading-relaxed">
                  {activeBanner.subtitle}
                </p>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => handleButtonClick(activeBanner.buttonLink)}
                    style={{
                      backgroundColor: activeBanner.buttonColor && activeBanner.buttonColor !== '#ffffff' ? activeBanner.buttonColor : '#ffffff',
                      color: activeBanner.buttonColor && activeBanner.buttonColor !== '#ffffff' ? '#ffffff' : '#0f172a'
                    }}
                    className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl font-extrabold text-xs sm:text-sm shadow-lg active:scale-95 transition-all flex items-center gap-2 group cursor-pointer"
                  >
                    <span>{activeBanner.actionText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
