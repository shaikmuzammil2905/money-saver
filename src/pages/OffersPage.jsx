import React from 'react';
import { ALL_PRODUCTS } from '../data/products';
import { Flame, Star, ShoppingCart, Eye, Tag, Zap, Clock } from 'lucide-react';

export default function OffersPage({ onAddToCart, onQuickView }) {
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

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {topDiscountProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between group relative"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {product.category}
                  </span>
                  <span className="text-[10px] font-black text-[#e50914] bg-red-50 border border-red-200 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                    <Flame className="w-3 h-3 fill-current" /> {product.discount}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-slate-900 line-clamp-1 group-hover:text-[#e50914] transition-colors">
                  {product.title}
                </h3>
                <p className="text-xs text-slate-500 font-normal line-clamp-1 mt-0.5">
                  {product.subtitle}
                </p>

                <div className="relative w-full h-44 my-3 rounded-xl bg-slate-50 flex items-center justify-center p-3 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                  />
                  <button
                    onClick={() => onQuickView(product)}
                    className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-bold rounded-xl backdrop-blur-[1px]"
                  >
                    <Eye className="w-4 h-4" /> Quick View
                  </button>
                </div>

                <div className="flex items-center gap-1.5 mb-3 text-xs">
                  <div className="flex items-center gap-1 text-amber-500 font-extrabold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{product.rating}</span>
                  </div>
                  <span className="text-slate-400 font-medium">({product.reviewsCount?.toLocaleString() || '1,256'})</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs text-slate-400 line-through font-medium">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-base sm:text-lg font-black text-slate-900">
                      ₹{product.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onAddToCart(product)}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#008744] hover:bg-[#007038] text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition-colors flex items-center justify-center gap-2 group/btn"
                >
                  <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
                  <span>Add to Cart</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
