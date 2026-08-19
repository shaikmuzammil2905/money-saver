import React from 'react';
import { Flame, Zap, Tag } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import ProductCard from '../components/ProductCard';

export default function OffersPage({ onAddToCart, onQuickView, wishlistIds = [], onToggleWishlist }) {
  const { activePublicProducts, offerSlides, offerItems } = useCMS();

  // Active Offer Slides
  const activeSlides = (offerSlides || []).filter(s => s && s.is_active !== false);
  const topSlide = activeSlides.length > 0 ? activeSlides[0] : null;

  // Active Offer Items mapped to UI product format
  const mappedOfferItems = (offerItems || [])
    .filter(o => o && o.is_active !== false)
    .sort((a, b) => (a.display_order || 999) - (b.display_order || 999))
    .map(o => ({
      id: o.id,
      title: o.name,
      subtitle: o.description,
      price: Number(o.offer_price),
      originalPrice: Number(o.original_price || o.offer_price),
      discount: o.discount || '',
      image: o.image,
      images: [o.image],
      category: o.category || 'Offers',
      categoryGroup: 'Offers',
      badge: o.offer_badge || 'Offer Deal',
      inStock: o.availability !== 'Out of Stock'
    }));

  // Combine offer items and active public products sorted by discount
  const combinedOffers = [...mappedOfferItems, ...activePublicProducts].sort((a, b) => {
    const discA = parseInt(a.discount) || 0;
    const discB = parseInt(b.discount) || 0;
    return discB - discA;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Offers Top Slide Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-orange-500 text-white p-6 sm:p-10 mb-8 shadow-2xl overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 border border-white/30 text-white text-xs font-black uppercase tracking-wider">
              <Flame className="w-4 h-4 fill-amber-300 text-amber-300 animate-bounce" /> Mega Discount Carnival
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight">
              {topSlide?.heading || 'Exclusive Offers & Deals Up To 75% OFF'}
            </h1>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed">
              {topSlide?.description || 'Grab daily flash discounts on OTT subscriptions, high speed fiber internet, mobiles, earbuds, smartwatches & gadgets.'}
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
          <Zap className="w-6 h-6 text-[#e50914] fill-red-500" /> Today's Highest Discount Deals ({combinedOffers.length})
        </h2>

        {/* Product Grid */}
        {combinedOffers.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm font-medium">
            No active offer items currently available.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
            {combinedOffers.map((product) => (
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
    </div>
  );
}
