import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingCart, Plus, Minus, ShieldCheck, Truck, RefreshCw, Ban, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  allProducts = [],
  wishlistIds = [],
  onToggleWishlist
}) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setSelectedImageIndex(0);
    setQuantity(1);
  }, [product]);

  if (!product) return null;

  const isAvailable = product.inStock !== false;

  // Compile image list (1 to 5 images)
  const imageList = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];

  const currentImage = imageList[selectedImageIndex] || product.image;

  // Calculate discount percentage & savings
  const discountText = product.discount || (
    product.originalPrice && product.price && product.originalPrice > product.price
      ? `${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF`
      : null
  );

  const savings = (product.originalPrice && product.price && product.originalPrice > product.price)
    ? (product.originalPrice - product.price)
    : 0;

  // Filter related products
  const relatedProducts = allProducts.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.categoryGroup === product.categoryGroup)
  ).slice(0, 4);

  const handleAddMultipleToCart = () => {
    if (!isAvailable) return;
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-6 relative z-10">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-scaleUp my-auto flex flex-col max-h-[90vh]">
          
          {/* Top Bar */}
          <div className="px-4 py-3 bg-slate-950 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {product.category || 'Product View'}
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
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Image Gallery (1-5 images) */}
              <div className="md:col-span-6 space-y-3">
                {/* Main Active Image Box */}
                <div className="relative w-full h-64 sm:h-80 rounded-2xl bg-[#f8f9fa] border border-slate-200/80 p-4 flex items-center justify-center overflow-hidden group">
                  <img
                    src={currentImage}
                    alt={product.title}
                    className={`max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 ${!isAvailable ? 'opacity-50 grayscale' : ''}`}
                  />
                  {discountText && isAvailable && (
                    <span className="absolute top-3 left-3 bg-[#ff5200] text-white text-xs font-black px-2.5 py-1 rounded-lg shadow">
                      {discountText}
                    </span>
                  )}
                  {!isAvailable && (
                    <span className="absolute top-3 left-3 bg-slate-900 text-red-400 text-xs font-black px-2.5 py-1 rounded-lg shadow flex items-center gap-1">
                      <Ban className="w-3.5 h-3.5" /> Out of Stock
                    </span>
                  )}
                </div>

                {/* Thumbnails Row (if > 1 image) */}
                {imageList.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {imageList.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-50 border-2 p-1 transition-all overflow-hidden shrink-0 flex items-center justify-center ${
                          selectedImageIndex === idx
                            ? 'border-[#e50914] shadow-md scale-95'
                            : 'border-slate-200 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="max-h-full max-w-full object-contain" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Details & Actions */}
              <div className="md:col-span-6 space-y-4">
                
                {/* Title & Badge */}
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[10px] font-black uppercase text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                      {product.category}
                    </span>
                    {product.badge && (
                      <span className="text-[10px] font-black uppercase text-[#e50914] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                    {product.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-normal mt-1">
                    {product.subtitle}
                  </p>
                </div>

                {/* Rating & Stock Status */}
                <div className="flex items-center gap-3 text-xs flex-wrap">
                  <div className="flex items-center gap-1 text-amber-500 font-extrabold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{product.rating || 4.9}</span>
                    <span className="text-slate-400 font-normal">({product.reviewsCount?.toLocaleString() || '1,250'} reviews)</span>
                  </div>

                  {isAvailable ? (
                    <span className="bg-emerald-50 text-[#008744] font-extrabold px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#008744] animate-ping" /> In Stock
                    </span>
                  ) : (
                    <span className="bg-red-50 text-red-600 font-extrabold px-2.5 py-1 rounded-lg border border-red-200">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Price Section */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900">
                      ₹{product.price?.toLocaleString()}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm sm:text-base text-slate-400 line-through font-medium">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                    {discountText && (
                      <span className="text-xs font-black text-white bg-[#e50914] px-2 py-0.5 rounded-md">
                        {discountText}
                      </span>
                    )}
                  </div>
                  {savings > 0 && isAvailable && (
                    <p className="text-xs font-bold text-[#008744]">
                      🎉 You Save ₹{savings.toLocaleString()} on this order!
                    </p>
                  )}
                </div>

                {/* Quantity Selector & Add to Cart */}
                {isAvailable ? (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-700">Quantity:</span>
                      <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden text-sm">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 transition-colors font-bold"
                        >
                          -
                        </button>
                        <span className="px-3 font-extrabold text-slate-900">{quantity}</span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 transition-colors font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleAddMultipleToCart}
                      className="w-full py-3.5 px-6 rounded-2xl bg-[#008744] hover:bg-[#007038] text-white font-black text-sm shadow-lg shadow-emerald-700/20 active:scale-95 transition-all flex items-center justify-center gap-2 group"
                    >
                      <ShoppingCart className="w-5 h-5 stroke-[2.5]" />
                      <span>Add to Cart (₹{(product.price * quantity).toLocaleString()})</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-center text-xs font-bold text-red-600">
                    This item is currently out of stock and cannot be added to cart.
                  </div>
                )}

                {/* Service Guarantees */}
                <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-slate-600 font-medium">
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Official Brand Warranty</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <Truck className="w-4 h-4 text-sky-600 shrink-0" />
                    <span>Fast Doorstep Delivery</span>
                  </div>
                </div>

                {/* Description */}
                <div className="pt-2 border-t border-slate-200">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">Product Description</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {product.description || 'Premium quality smart product delivered with official warranty and instant doorstep setup support.'}
                  </p>
                </div>

              </div>
            </div>

            {/* Related Products Grid */}
            {relatedProducts.length > 0 && (
              <div className="pt-6 border-t border-slate-200">
                <h3 className="text-base font-black text-slate-900 mb-4 flex items-center justify-between">
                  <span>Related Products</span>
                  <span className="text-xs text-slate-500 font-medium">Similar items you may like</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {relatedProducts.map((relProduct) => (
                    <ProductCard
                      key={relProduct.id}
                      product={relProduct}
                      onAddToCart={onAddToCart}
                      onQuickView={() => {
                        setSelectedImageIndex(0);
                        setQuantity(1);
                      }}
                      isWishlisted={wishlistIds.includes(relProduct.id)}
                      onToggleWishlist={onToggleWishlist}
                    />
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
