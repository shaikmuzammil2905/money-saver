import React from 'react';
import { ALL_PRODUCTS } from '../data/products';
import { Flame, Zap } from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function OffersPage({ onAddToCart, onQuickView, wishlistIds = [], onToggleWishlist }) {
  // Sort products by highest discount
  const topDiscountProducts = [...ALL_PRODUCTS].sort((a, b) => {
    const discA = parseInt(a.discount) || 0;
    const discB = parseInt(b.discount) || 0;
    return discB - discA;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Offers Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-orange-500 text-white p-6 sm:p-10 mb-8 shadow-2xl overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 border border-white/30 text-white text-xs font-black uppercase tracking-wider">
              <Flame className="w-4 h-4 fill-amber-300 text-amber-300 animate-bounce" /> Mega Discount Carnival
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight">
              Exclusive Offers &amp; <span className="text-amber-300">Deals Up To 70% OFF</span>
            </h1>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed">
              Grab daily flash discounts on OTT subscriptions, high speed fiber internet, mobiles, earbuds, smartwatches &amp; gadgets. Limited stock deals updated hourly!
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
          <Zap className="w-6 h-6 text-[#e50914] fill-red-500" /> Today's Highest Discount Deals
        </h2>

        {/* Product Grid: side-by-side layout */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
          {topDiscountProducts.map((product) => (
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

      </div>
    </div>
  );
}
