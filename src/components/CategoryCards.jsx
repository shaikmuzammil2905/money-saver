import React from 'react';
import { Tv, Wifi, Smartphone, Headphones, Laptop, Flame, ArrowRight } from 'lucide-react';
import { QUICK_CATEGORIES } from '../data/products';

export default function CategoryCards({ onSelectCategory }) {
  const iconMap = {
    Tv: <Tv className="w-8 h-8 text-brand-red" />,
    Wifi: <Wifi className="w-8 h-8 text-blue-600" />,
    Smartphone: <Smartphone className="w-8 h-8 text-emerald-600" />,
    Headphones: <Headphones className="w-8 h-8 text-purple-600" />,
    Laptop: <Laptop className="w-8 h-8 text-amber-600" />,
    Flame: <Flame className="w-8 h-8 text-rose-600" />,
  };

  return (
    <section className="py-8 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {QUICK_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col items-center text-center justify-between"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-inner">
                {iconMap[cat.iconName]}
              </div>

              <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 mb-1 group-hover:text-brand-red transition-colors">
                {cat.name}
              </h3>

              <span className="text-[11px] font-semibold text-brand-red flex items-center gap-1 group-hover:gap-1.5 transition-all">
                {cat.actionText}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
