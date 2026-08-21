import React from 'react';
import { Smartphone, Watch, Radio, Speaker, Headphones, BatteryCharging, Zap, Tv, Laptop, Tag, Sparkles } from 'lucide-react';
import { useCMS, DEFAULT_SUB_CATEGORIES } from '../context/CMSContext';

export default function CategoryCarousel({ onSelectCategory }) {
  const { subCategories } = useCMS();

  const activeSubCategories = (subCategories && subCategories.length > 0)
    ? subCategories.filter(c => c.is_active !== false)
    : DEFAULT_SUB_CATEGORIES;

  if (activeSubCategories.length === 0) return null;

  const renderIconFallback = (iconName) => {
    switch ((iconName || '').toLowerCase()) {
      case 'smartphone': return <Smartphone className="w-6 h-6 text-emerald-600" />;
      case 'watch': return <Watch className="w-6 h-6 text-amber-600" />;
      case 'radio': return <Radio className="w-6 h-6 text-purple-600" />;
      case 'speaker': return <Speaker className="w-6 h-6 text-blue-600" />;
      case 'headphones': return <Headphones className="w-6 h-6 text-rose-600" />;
      case 'batterycharging': return <BatteryCharging className="w-6 h-6 text-indigo-600" />;
      case 'zap': return <Zap className="w-6 h-6 text-yellow-600" />;
      case 'tv': return <Tv className="w-6 h-6 text-red-600" />;
      case 'laptop': return <Laptop className="w-6 h-6 text-cyan-600" />;
      default: return <Sparkles className="w-6 h-6 text-purple-600" />;
    }
  };

  return (
    <section id="mobiles" className="py-12 bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            Shop By Category
          </h2>
          <span className="text-xs font-semibold text-slate-500">Explore {activeSubCategories.length}+ Categories</span>
        </div>

        {/* Horizontal Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-3">
          {activeSubCategories.map((cat, idx) => (
            <div
              key={cat.id || idx}
              onClick={() => onSelectCategory(cat.name)}
              className="group bg-slate-50 hover:bg-white rounded-2xl p-3 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col items-center text-center justify-between"
            >
              <div className="w-16 h-16 rounded-xl bg-white p-1 mb-2 overflow-hidden flex items-center justify-center border border-slate-100 group-hover:scale-105 transition-transform shadow-inner">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                ) : (
                  renderIconFallback(cat.icon)
                )}
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
