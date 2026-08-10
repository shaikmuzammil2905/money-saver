import React from 'react';
import { Tv, Globe, Smartphone, Headphones, Laptop, Flame } from 'lucide-react';
import { QUICK_CATEGORIES } from '../data/products';

export default function CategoryCards({ onSelectCategory }) {
  const iconMap = {
    Tv: <Tv className="w-7 h-7 text-[#e50914]" />,
    Wifi: <Globe className="w-7 h-7 text-blue-600" />,
    Smartphone: <Smartphone className="w-7 h-7 text-sky-500" />,
    Headphones: <Headphones className="w-7 h-7 text-slate-800" />,
    Laptop: <Laptop className="w-7 h-7 text-blue-600" />,
    Flame: <Flame className="w-7 h-7 text-[#e50914] fill-red-500/20" />,
  };

  return (
    <section className="py-6 bg-slate-50 border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
          {QUICK_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col items-center text-center justify-between hover:-translate-y-0.5"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-50 border border-slate-200/80 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shadow-inner">
                {iconMap[cat.iconName] || <Flame className="w-7 h-7 text-brand-red" />}
              </div>

              <h3 className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight">
                {cat.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
