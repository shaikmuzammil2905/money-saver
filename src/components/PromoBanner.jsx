import React from 'react';
import { ArrowRight, Flame } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export default function PromoBanner({ onViewOffers }) {
  const { banners } = useCMS();
  const banner = banners.find(b => b.banner_key === 'offers_top' || b.banner_key === 'home_bottom_small') || {
    heading: 'WHY PAY MORE?',
    description: 'Discover smart deals on entertainment, internet, gadgets and electronics.',
    button_text: 'View All Offers'
  };

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-3xl bg-gradient-to-r from-[#e50914] via-red-600 to-orange-500 text-white p-6 sm:p-10 overflow-hidden shadow-xl">
          
          {/* Decorative Pattern Background */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
            
            {/* Left Column Text & Button */}
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white uppercase font-sans drop-shadow-md">
                {banner.heading || 'WHY PAY MORE?'}
              </h2>
              
              <p className="text-white/95 text-base sm:text-lg font-medium max-w-xl mx-auto lg:mx-0">
                {banner.description || 'Discover smart deals on entertainment, internet, gadgets and electronics.'}
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                {Array.isArray(banner.buttons) && banner.buttons.length > 0 ? (
                  banner.buttons.filter(b => b.is_active !== false).map((btn, idx) => (
                    <button
                      key={btn.id || idx}
                      onClick={() => {
                        const link = btn.link || 'offers';
                        if (btn.is_external || link.startsWith('http') || link.startsWith('tel:') || link.startsWith('mailto:')) {
                          window.open(link, btn.target || '_blank');
                        } else if (link === 'offers' || link === '/offers') {
                          if (typeof onViewOffers === 'function') onViewOffers();
                        } else {
                          if (typeof onViewOffers === 'function') onViewOffers(link.replace(/^\//, ''));
                          else window.location.href = link;
                        }
                      }}
                      style={{
                        transform: (btn.position_x || btn.position_y) ? `translate(${btn.position_x || 0}px, ${btn.position_y || 0}px)` : undefined,
                        backgroundColor: btn.button_color || '#020617',
                        color: btn.text_color || '#ffffff'
                      }}
                      className="px-8 py-3.5 rounded-xl font-extrabold text-sm sm:text-base shadow-2xl transition-all hover:scale-105 inline-flex items-center gap-2 group cursor-pointer relative"
                    >
                      <span>{btn.text || 'Click Here'}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))
                ) : (
                  <button
                    onClick={onViewOffers}
                    className="px-8 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-sm sm:text-base shadow-2xl transition-all hover:scale-105 inline-flex items-center gap-2 group cursor-pointer"
                  >
                    <span>{banner.button_text || 'View All Offers'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
            </div>

            {/* Right Column Product Images & 70% OFF Circular Badge */}
            <div className="lg:col-span-5 flex items-center justify-center gap-3 relative pt-4 lg:pt-0">
              
              {/* Product Cluster */}
              <div className="flex items-center gap-2">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80"
                  alt="Headphones"
                  className="w-20 h-24 sm:w-24 sm:h-28 object-contain drop-shadow-2xl hover:scale-110 transition-transform"
                />
                <img
                  src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&auto=format&fit=crop&q=80"
                  alt="Smartphone"
                  className="w-20 h-28 sm:w-24 sm:h-32 object-contain drop-shadow-2xl hover:scale-110 transition-transform"
                />
                <img
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80"
                  alt="Smartwatch"
                  className="w-16 h-20 sm:w-20 sm:h-24 object-contain drop-shadow-2xl hover:scale-110 transition-transform"
                />
              </div>

              {/* UP TO 70% OFF Circular Badge */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-purple-900 text-white border-4 border-yellow-400 shadow-2xl flex flex-col items-center justify-center text-center p-2 transform rotate-12 hover:rotate-0 transition-transform shrink-0">
                <span className="text-[10px] font-extrabold uppercase text-amber-300">UP TO</span>
                <span className="text-xl sm:text-2xl font-black text-yellow-300 leading-none">70%</span>
                <span className="text-[9px] font-black uppercase tracking-wider text-white">OFF</span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
