import React from 'react';
import { Star, Heart, Plus, Eye, Ban } from 'lucide-react';

export default function ProductCard({
  product,
  onAddToCart,
  onQuickView,
  isWishlisted = false,
  onToggleWishlist
}) {
  if (!product) return null;

  const isAvailable = product.inStock !== false;

  // Calculate discount percentage if not explicitly specified
  const calculatedDiscount = product.discount || (
    product.originalPrice && product.price && product.originalPrice > product.price
      ? `${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF`
      : null
  );

  // Calculate savings amount
  const savings = (product.originalPrice && product.price && product.originalPrice > product.price)
    ? (product.originalPrice - product.price)
    : 0;

  return (
    <div 
      className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-2.5 sm:p-3.5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden h-full"
    >
      <div>
        {/* Top Image Container with Badge, Wishlist & Rating */}
        <div 
          onClick={() => onQuickView && onQuickView(product)}
          className="relative w-full h-36 sm:h-44 rounded-xl sm:rounded-2xl bg-[#f8f9fa] group-hover:bg-[#f1f3f7] transition-colors flex items-center justify-center p-2.5 sm:p-3 overflow-hidden cursor-pointer"
        >
          {/* Top Left Badges */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
            {!isAvailable ? (
              <span className="bg-slate-900 text-slate-200 text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded-md sm:rounded-lg shadow-sm tracking-wider flex items-center gap-1">
                <Ban className="w-3 h-3 text-red-400" /> Out of Stock
              </span>
            ) : (
              <>
                {Array.isArray(product.badges) && product.badges.length > 0 ? (
                  product.badges.map((bdg, idx) => (
                    <span
                      key={idx}
                      style={{ backgroundColor: bdg.bg_color || '#e50914', color: bdg.text_color || '#ffffff' }}
                      className="text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded-md sm:rounded-lg shadow-sm tracking-wider"
                    >
                      {bdg.text || bdg.name}
                    </span>
                  ))
                ) : (
                  calculatedDiscount && (
                    <span className="bg-[#e50914] text-white text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded-md sm:rounded-lg shadow-sm tracking-wider">
                      {calculatedDiscount}
                    </span>
                  )
                )}
              </>
            )}
          </div>

          {/* Top Right Wishlist Heart Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleWishlist) onToggleWishlist(product);
            }}
            className="absolute top-2 right-2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-slate-100 flex items-center justify-center text-slate-700 hover:text-red-500 hover:bg-white transition-all active:scale-90"
            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-slate-600'}`} />
          </button>

          {/* Product Image */}
          <img
            src={product.image || (product.images && product.images[0])}
            alt={product.title}
            className={`max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 pointer-events-none ${!isAvailable ? 'opacity-50 grayscale' : ''}`}
            loading="lazy"
          />

          {/* Quick View Button on Hover (Desktop) */}
          {onQuickView && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-bold rounded-xl backdrop-blur-[1px] z-20"
            >
              <Eye className="w-4 h-4" /> Quick View
            </button>
          )}
        </div>

        {/* Category Label */}
        <div className="mt-2 mb-0.5">
          <span className="text-[10px] sm:text-xs font-extrabold text-slate-400 uppercase tracking-wider line-clamp-1">
            {product.category || 'PRODUCT'}
          </span>
        </div>

        {/* Title */}
        <h3 
          onClick={() => onQuickView && onQuickView(product)}
          className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 leading-snug group-hover:text-[#e50914] transition-colors min-h-[2rem] sm:min-h-[2.5rem] cursor-pointer"
        >
          {product.title}
        </h3>

        {/* Price Row */}
        <div className="flex items-baseline gap-1.5 mt-1.5 flex-wrap">
          <span className="text-sm sm:text-lg font-black text-slate-900">
            ₹{product.price?.toLocaleString()}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-slate-400 line-through font-medium">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* You Save text */}
        {savings > 0 && isAvailable && (
          <p className="text-[10px] sm:text-xs font-bold text-[#008744] mt-0.5">
            You Save ₹{savings.toLocaleString()}
          </p>
        )}
      </div>

      {/* Quick Add Button / Out of Stock Button */}
      {isAvailable ? (
        <button
          type="button"
          onClick={() => onAddToCart && onAddToCart(product)}
          className="w-full mt-2.5 py-2 sm:py-2.5 px-3 rounded-full sm:rounded-xl bg-[#0d1424] hover:bg-slate-800 active:bg-slate-900 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95 group/btn"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
          <span>Quick Add</span>
        </button>
      ) : (
        <button
          type="button"
          disabled
          className="w-full mt-2.5 py-2 sm:py-2.5 px-3 rounded-full sm:rounded-xl bg-slate-200 text-slate-500 font-bold text-xs cursor-not-allowed flex items-center justify-center gap-1.5"
        >
          <Ban className="w-3.5 h-3.5 text-slate-400" />
          <span>Out of Stock</span>
        </button>
      )}
    </div>
  );
}
