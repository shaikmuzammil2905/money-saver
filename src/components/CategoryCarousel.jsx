import React from 'react';
import { Smartphone, Watch, Radio, Speaker, Headphones, BatteryCharging, Zap, Tv, Laptop, Tag, ChevronRight } from 'lucide-react';
import { SHOP_BY_CATEGORIES } from '../data/products';

export default function CategoryCarousel({ onSelectCategory }) {
  const iconMap = {
    Smartphone: <Smartphone className="w-6 h-6 text-emerald-600" />,
    Watch: <Watch className="w-6 h-6 text-amber-600" />,
    Radio: <Radio className="w-6 h-6 text-purple-600" />,
    Speaker: <Speaker className="w-6 h-6 text-blue-600" />,
    Headphones: <Headphones className="w-6 h-6 text-rose-600" />,
    BatteryCharging: <BatteryCharging className="w-6 h-6 text-indigo-600" />,
    Zap: <Zap className="w-6 h-6 text-yellow-600" />,
    Tv: <Tv className="w-6 h-6 text-red-600" />,
    Laptop: <Laptop className="w-6 h-6 text-cyan-600" />,
    Tag: <Tag className="w-6 h-6 text-slate-600" />,
  };

  return (
    <section id="mobiles" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            Shop By Category
          </h2>
          <span className="text-xs font-semibold text-slate-500">Explore 10+ Categories</span>
        </div>

        {/* Horizontal Category Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-3">
          {SHOP_BY_CATEGORIES.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => onSelectCategory(cat.name)}
              className="group bg-slate-50 hover:bg-white rounded-2xl p-3 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col items-center text-center justify-between"
            >
              <div className="w-16 h-16 rounded-xl bg-white p-1 mb-2 overflow-hidden flex items-center justify-center border border-slate-100 group-hover:scale-105 transition-transform shadow-inner">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>

              <span className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-brand-red transition-colors">
                {cat.name}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
