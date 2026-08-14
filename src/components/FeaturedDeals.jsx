import React from 'react';
import { Flame, ChevronRight } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import ProductCard from './ProductCard';

export default function FeaturedDeals({ onAddToCart, onQuickView, onViewAll, wishlistIds = [], onToggleWishlist }) {
  const { activePublicProducts, homeItems } = useCMS();

  const dealsToRender = activePublicProducts.filter(p => p.isFeatured || p.badge).length > 0
    ? activePublicProducts.filter(p => p.isFeatured || p.badge)
    : activePublicProducts.slice(0, 5);

  return (
    <section id="offers" className="py-8 sm:py-12 bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-[#e50914] fill-red-500" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans">
              🔥 Trending Collections
            </h2>
          </div>

          <button 
            onClick={onViewAll}
            className="text-xs sm:text-sm font-bold text-[#e50914] hover:text-red-700 transition-colors flex items-center gap-0.5 group"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform stroke-[2.5]" />
          </button>
        </div>

        {/* Product Cards Grid */}
        {dealsToRender.length === 0 ? (
          <div className="text-center py-8 text-slate-500 font-medium text-xs">
            No featured deals currently available.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4 lg:gap-5">
            {dealsToRender.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
                isWishlisted={wishlistIds.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
