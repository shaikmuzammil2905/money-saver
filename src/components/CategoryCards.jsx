import React from 'react';
import { Tv, Globe, Smartphone, Headphones, Laptop, Flame, Sparkles, Tag, Zap, Shield } from 'lucide-react';
import { useCMS, DEFAULT_MAIN_CATEGORIES } from '../context/CMSContext';

export default function CategoryCards({ onSelectCategory }) {
  const { mainCategories, categories } = useCMS();

  // Active Main Categories list from CMS
  const activeCategories = (mainCategories && mainCategories.length > 0)
    ? mainCategories.filter(c => c.is_active !== false)
    : (categories && categories.length > 0 ? categories.filter(c => c.is_active !== false) : DEFAULT_MAIN_CATEGORIES);

  if (activeCategories.length === 0) return null;

  const renderCategoryIcon = (cat) => {
    if (cat.image_url) {
      return (
        <img 
          src={cat.image_url} 
          alt={cat.name} 
          className="w-full h-full object-cover rounded-full" 
        />
      );
    }

    const iconName = cat.icon || cat.iconName || 'Sparkles';
    switch (iconName.toLowerCase()) {
      case 'tv':
        return <Tv className="w-5 h-5 sm:w-6 sm:h-6 text-[#e50914]" />;
      case 'globe':
        return <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />;
      case 'smartphone':
        return <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 text-sky-500" />;
      case 'headphones':
        return <Headphones className="w-5 h-5 sm:w-6 sm:h-6 text-slate-800" />;
      case 'laptop':
        return <Laptop className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />;
      case 'flame':
        return <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-[#e50914] fill-red-500/20" />;
      case 'zap':
        return <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />;
      case 'shield':
        return <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />;
      default:
        return <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />;
    }
  };

  return (
    <section className="py-3 sm:py-6 bg-slate-50 border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Responsive Grid for Main Category Cards (Up to 6 columns) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4">
          {activeCategories.map((cat) => {
            const target = cat.link_url || cat.slug || cat.id || cat.name;
            return (
              <button
                key={cat.id || target}
                onClick={() => onSelectCategory(target)}
                className="group bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-4 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-purple-400 transition-all duration-200 cursor-pointer flex flex-col items-center text-center justify-center w-full hover:-translate-y-0.5"
              >
                <div className="w-10 h-10 sm:w-13 sm:h-13 rounded-full bg-slate-50 border border-slate-200/80 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform shadow-inner overflow-hidden">
                  {renderCategoryIcon(cat)}
                </div>

                <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-tight">
                  {cat.name}
                </h3>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}

