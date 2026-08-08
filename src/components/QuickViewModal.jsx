import React from 'react';
import { X, Star, ShoppingCart, ShieldCheck, Truck, Check } from 'lucide-react';

export default function QuickViewModal({ product, onClose, onAddToCart }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl z-10 border border-slate-100 overflow-hidden">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Image */}
          <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-center h-64 border border-slate-100 relative">
            <img
              src={product.image}
              alt={product.title}
              className="max-h-full max-w-full object-contain"
            />
            {product.discount && (
              <span className="absolute top-3 left-3 bg-brand-red text-white text-xs font-extrabold px-2.5 py-1 rounded-full shadow">
                {product.discount}
              </span>
            )}
          </div>

          {/* Product details */}
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-extrabold text-brand-red uppercase tracking-wider">
                {product.category || 'Featured Item'}
              </span>
              <h2 className="text-xl font-black text-slate-900 leading-tight mt-0.5">{product.title}</h2>
              <p className="text-xs text-slate-500 font-medium">{product.subtitle}</p>
            </div>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{product.rating}</span>
                </div>
                <span className="text-slate-400">({product.reviewsCount?.toLocaleString()} verified reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-xs text-slate-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
              )}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {product.description || 'Smart value product tested for performance, durability, and customer satisfaction.'}
            </p>

            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-brand-green" /> In Stock & Ready to Dispatch (Hyderabad)
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" /> 100% Original Brand Guarantee
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-brand-green hover:bg-brand-greenHover text-white font-extrabold text-xs shadow-lg shadow-brand-green/20 transition-all flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart — ₹{product.price.toLocaleString()}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
