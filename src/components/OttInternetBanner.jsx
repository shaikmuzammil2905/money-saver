import React from 'react';
import { Tv, Wifi, Layers, ArrowRight } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export default function OttInternetBanner({ onExplorePlans }) {
  const { banners } = useCMS();
  const banner = banners.find(b => b.banner_key === 'home_middle_big') || {
    heading: '12-in-1 Mega Subscription Pack',
    subheading: 'ULTIMATE SAVINGS BUNDLE',
    description: 'Single dashboard access for Netflix, Prime, Hotstar, ZEE5, SonyLIV & 7 more apps.',
    button_text: 'Claim Offer',
    image_url: '/image.png'
  };

  return (
    <section id="ott-plans" className="py-12 bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-3xl bg-slate-950 text-white p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl border border-slate-800">
          
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(229,9,20,0.2),transparent_60%)] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#e50914] mb-2 block">
                  {banner.subheading || 'Entertainment + Connectivity'}
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase leading-tight font-sans">
                  {banner.heading || 'OTT & INTERNET PLANS'}
                </h2>
                <p className="text-slate-300 text-sm sm:text-base font-normal mt-1">
                  {banner.description || 'Entertainment + Connectivity at Best Prices'}
                </p>
              </div>


              {/* 3 Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="flex items-start gap-3 bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800">
                  <Tv className="w-6 h-6 text-brand-red shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-white">OTT Subscriptions</h4>
                    <p className="text-[11px] text-slate-400">Top Premium Platforms</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800">
                  <Wifi className="w-6 h-6 text-sky-400 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Fiber Broadband</h4>
                    <p className="text-[11px] text-slate-400">High-Speed Internet Plans</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800">
                  <Layers className="w-6 h-6 text-amber-400 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Combo Packages</h4>
                    <p className="text-[11px] text-slate-400">Save More with Combo Offers</p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex flex-wrap gap-3">
                {Array.isArray(banner.buttons) && banner.buttons.length > 0 ? (
                  banner.buttons.filter(b => b.is_active !== false).map((btn, idx) => (
                    <button
                      key={btn.id || idx}
                      onClick={() => {
                        if (btn.is_external) {
                          window.open(btn.link, btn.target || '_blank');
                        } else {
                          if (btn.link === 'offers' || btn.link === '/offers') onExplorePlans();
                          else if (btn.link === 'ott-plans' || btn.link === '/ott-plans') onExplorePlans();
                          else if (btn.link) window.open(btn.link, btn.target || '_self');
                        }
                      }}
                      style={{
                        transform: `translate(${btn.position_x || 0}px, ${btn.position_y || 0}px)`
                      }}
                      className="px-7 py-3 rounded-xl font-extrabold text-sm shadow-lg shadow-red-900/30 transition-all flex items-center gap-2 group cursor-pointer relative bg-[#e50914] hover:bg-red-700 text-white"
                    >
                      <span>{btn.text || 'Click Here'}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))
                ) : (
                  <button
                    onClick={onExplorePlans}
                    className="px-7 py-3 rounded-xl bg-[#e50914] hover:bg-red-700 text-white font-extrabold text-sm shadow-lg shadow-red-900/30 transition-all flex items-center gap-2 group cursor-pointer"
                  >
                    <span>{banner.button_text || 'View All Plans'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>

            </div>

            {/* Right Visual: Realistic TV Artwork & Router */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
              <div className="relative w-full max-w-sm bg-slate-900/95 border border-slate-800 p-4 rounded-3xl shadow-2xl backdrop-blur-md space-y-4">
                
                {/* TV Logo Graphic */}
                <div className="bg-slate-950 p-2 rounded-2xl border border-slate-800 overflow-hidden shadow-inner">
                  <img
                    src="/image.png"
                    alt="OTT Platforms TV Logo"
                    className="w-full h-auto object-contain rounded-xl hover:scale-105 transition-transform"
                  />
                </div>

                {/* Router image */}
                <div className="rounded-2xl overflow-hidden h-28 border border-slate-800 relative">
                  <img
                    src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&auto=format&fit=crop&q=80"
                    alt="High Speed Broadband Router"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex items-end p-3">
                    <span className="text-xs font-extrabold text-amber-400">🔥 High-Speed Fiber Internet + OTT Combo</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
