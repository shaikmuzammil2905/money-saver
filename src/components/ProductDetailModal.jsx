import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, ShieldCheck, CheckCircle, Ban } from 'lucide-react';

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart
}) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setSelectedImageIndex(0);
    setQuantity(1);
  }, [product]);

  if (!product) return null;

  const isAvailable = product.inStock !== false;

  const imageList = Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : [product.image];

  const currentImage = imageList[selectedImageIndex] || product.image;

  const discountText = product.discount || (
    product.originalPrice && product.price && product.originalPrice > product.price
      ? `${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF`
      : null
  );

  const descPoints = Array.isArray(product.descriptionPoints) && product.descriptionPoints.length > 0
    ? product.descriptionPoints
    : (product.description ? product.description.split('\n').filter(Boolean) : []);

  const customInfoList = Array.isArray(product.customInfo) && product.customInfo.length > 0
    ? product.customInfo
    : ['Instant Activation', 'WhatsApp Support Available', 'Payment via UPI'];

  const handleAddMultipleToCart = () => {
    if (!isAvailable) return;
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans select-none">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-5 relative z-10">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-auto flex flex-col max-h-[90vh]">
          
          {/* Top Header */}
          <div className="px-5 py-3.5 bg-slate-950 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                {product.category || 'Product Overview'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              
              {/* Left Column: Image Box */}
              <div className="md:col-span-5 space-y-2">
                <div className="relative w-full h-56 sm:h-64 rounded-2xl bg-[#f8f9fa] border border-slate-200 p-3 flex items-center justify-center overflow-hidden">
                  <img
                    src={currentImage}
                    alt={product.title}
                    className={`max-h-full max-w-full object-contain ${!isAvailable ? 'opacity-50 grayscale' : ''}`}
                  />
                  {discountText && isAvailable && (
                    <span className="absolute top-2 left-2 bg-[#e50914] text-white text-[10px] font-black px-2 py-0.5 rounded shadow">
                      {discountText}
                    </span>
                  )}
                  {!isAvailable && (
                    <span className="absolute top-2 left-2 bg-slate-950 text-red-400 text-[10px] font-black px-2 py-0.5 rounded shadow flex items-center gap-1">
                      <Ban className="w-3 h-3" /> Out of Stock
                    </span>
                  )}
                </div>

                {/* Thumbnails */}
                {imageList.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {imageList.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`w-12 h-12 rounded-xl bg-slate-50 border p-1 overflow-hidden shrink-0 ${
                          selectedImageIndex === idx ? 'border-[#e50914] shadow' : 'border-slate-200 opacity-60'
                        }`}
                      >
                        <img src={imgUrl} alt="Thumb" className="w-full h-full object-contain" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Title, Vertical Description Points, Custom Info, Actions */}
              <div className="md:col-span-7 space-y-4">
                
                {/* Title */}
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                    {product.title}
                  </h2>
                  {product.subtitle && (
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">{product.subtitle}</p>
                  )}
                </div>

                {/* Price Section */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl sm:text-2xl font-black text-slate-900">
                      ₹{product.price?.toLocaleString()}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-xs text-slate-400 line-through font-medium">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {isAvailable ? (
                    <span className="bg-emerald-50 text-[#008744] text-[11px] font-extrabold px-2.5 py-1 rounded-lg border border-emerald-200">
                      In Stock
                    </span>
                  ) : (
                    <span className="bg-red-50 text-red-600 text-[11px] font-extrabold px-2.5 py-1 rounded-lg border border-red-200">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* VERTICAL DESCRIPTION POINTS (Part 8) */}
                {descPoints.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Product Features</h4>
                    <ol className="space-y-1.5 text-xs text-slate-700 font-medium">
                      {descPoints.map((pt, idx) => (
                        <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <span className="font-bold text-[#e50914] shrink-0">{idx + 1}.</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* CUSTOM ADMIN MATTER (Part 11) */}
                {customInfoList.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                    {customInfoList.map((info, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 p-2 rounded-xl bg-emerald-50/70 border border-emerald-200/60 text-emerald-900 text-xs font-bold">
                        <CheckCircle className="w-3.5 h-3.5 text-[#008744] shrink-0" />
                        <span>{info}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quantity Selector & Add to Cart (Part 12) */}
                {isAvailable ? (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-700">Quantity:</span>
                      <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden text-xs font-bold">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                          -
                        </button>
                        <span className="px-3 font-extrabold text-slate-900">{quantity}</span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleAddMultipleToCart}
                      className="w-full py-3 px-6 rounded-2xl bg-[#008744] hover:bg-[#007038] text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-700/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
                      <span>Add to Cart (₹{(product.price * quantity).toLocaleString()})</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-center text-xs font-bold text-red-600">
                    This item is currently out of stock.
                  </div>
                )}

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
