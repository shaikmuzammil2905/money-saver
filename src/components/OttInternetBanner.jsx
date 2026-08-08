import React from 'react';
import { Tv, Wifi, Layers, ArrowRight } from 'lucide-react';

export default function OttInternetBanner({ onExplorePlans }) {
  return (
    <section id="ott-plans" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-3xl bg-slate-950 text-white p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl border border-slate-800">
          
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(229,9,20,0.2),transparent_60%)] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-brand-red mb-2 block">
                  Entertainment + Connectivity
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase leading-tight font-sans">
                  OTT & INTERNET PLANS
                </h2>
                <p className="text-slate-300 text-sm sm:text-base font-normal mt-1">
                  Entertainment + Connectivity at Best Prices
                </p>
              </div>

              {/* 3 Bullet Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="flex items-start gap-3 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                  <Tv className="w-6 h-6 text-brand-red shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-white">OTT Subscriptions</h4>
                    <p className="text-[11px] text-slate-400">Top Premium Platforms</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                  <Wifi className="w-6 h-6 text-sky-400 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Fiber Broadband</h4>
                    <p className="text-[11px] text-slate-400">High-Speed Internet Plans</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800">
                  <Layers className="w-6 h-6 text-amber-400 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Combo Packages</h4>
                    <p className="text-[11px] text-slate-400">Save More with Combo Offers</p>
                  </div>
                </div>
              </div>

              {/* View All Plans CTA Button */}
              <div className="pt-2">
                <button
                  onClick={onExplorePlans}
                  className="px-7 py-3 rounded-xl bg-brand-red hover:bg-brand-redHover text-white font-extrabold text-sm shadow-lg shadow-brand-red/30 transition-all flex items-center gap-2 group"
                >
                  <span>View All Plans</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>

            {/* Right Visual Container */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
              <div className="relative w-full max-w-sm bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-2xl backdrop-blur-md">
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-red-950/90 border border-red-800 p-2.5 rounded-xl text-center">
                    <span className="text-red-500 font-black text-xs">NETFLIX</span>
                  </div>
                  <div className="bg-sky-950/90 border border-sky-800 p-2.5 rounded-xl text-center">
                    <span className="text-sky-400 font-bold text-[10px]">prime video</span>
                  </div>
                  <div className="bg-blue-950/90 border border-blue-800 p-2.5 rounded-xl text-center">
                    <span className="text-blue-300 font-bold text-[10px]">Disney+ hotstar</span>
                  </div>
                  <div className="bg-purple-950/90 border border-purple-800 p-2.5 rounded-xl text-center">
                    <span className="text-purple-400 font-black text-xs">ZEE5</span>
                  </div>
                  <div className="bg-amber-950/90 border border-amber-800 p-2.5 rounded-xl text-center">
                    <span className="text-amber-500 font-bold text-xs">SONY liv</span>
                  </div>
                  <div className="bg-indigo-950/90 border border-indigo-800 p-2.5 rounded-xl text-center">
                    <span className="text-indigo-400 font-black text-xs">voot</span>
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden h-32 border border-slate-800">
                  <img
                    src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&auto=format&fit=crop&q=80"
                    alt="High Speed Broadband Router"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
