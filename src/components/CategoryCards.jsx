import React from 'react';
import { Tv, Globe, Smartphone, Headphones, Laptop, Flame } from 'lucide-react';

export default function CategoryCards({ onSelectCategory }) {
  const categories = [
    { id: 'ott', name: 'OTT Platforms', icon: <Tv className="w-6 h-6 text-[#e50914]" /> },
    { id: 'fiber', name: 'Fiber Internet', icon: <Globe className="w-6 h-6 text-blue-600" /> },
    { id: 'mobiles', name: 'Mobiles Smartphones', icon: <Smartphone className="w-6 h-6 text-sky-500" /> },
    { id: 'gadgets', name: 'Mobile Gadgets', icon: <Headphones className="w-6 h-6 text-slate-800" /> },
    { id: 'electronics', name: 'Electronics Devices', icon: <Laptop className="w-6 h-6 text-blue-600" /> },
    { id: 'offers', name: 'Today\'s Offers', icon: <Flame className="w-6 h-6 text-[#e50914] fill-red-500/20" /> },
  ];

  return (
    <section className="py-1.5 sm:py-4 bg-slate-50 border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        {/* Single-line horizontal scroll container for mobile & grid for desktop */}
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto scrollbar-none py-0.5 sm:grid sm:grid-cols-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group bg-white rounded-xl sm:rounded-2xl p-1.5 sm:p-3.5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col items-center text-center justify-center shrink-0 w-[94px] sm:w-auto hover:-translate-y-0.5"
            >
              <div className="w-9 h-9 sm:w-13 sm:h-13 rounded-full bg-slate-50 border border-slate-200/80 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform shadow-inner">
                {cat.icon}
              </div>

              <h3 className="text-[10px] sm:text-xs font-bold text-slate-900 line-clamp-2 leading-tight">
                {cat.name}
              </h3>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
