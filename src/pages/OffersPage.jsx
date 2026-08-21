import React from 'react';
import { Flame, Zap, Tag, ArrowRight } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import ProductCard from '../components/ProductCard';

export default function OffersPage({ onAddToCart, onQuickView, wishlistIds = [], onToggleWishlist, onNavigate }) {
  const { activePublicProducts, banners, offerSlides, offerItems } = useCMS();

  // Active Offers Top Banner from CMS
  const offersBanner = (banners && banners.find(b => b.banner_key === 'offers_top' || b.banner_key === 'offers_main')) || (offerSlides && offerSlides[0]) || {};
  const isBannerVisible = offersBanner.is_active !== false;

  const badgesList = Array.isArray(offersBanner.badges) && offersBanner.badges.length > 0
    ? offersBanner.badges.map(b => typeof b === 'string' ? { text: b } : b)
    : (offersBanner.subheading ? [{ text: offersBanner.subheading }] : [{ text: 'MEGA DISCOUNT CARNIVAL' }]);

  const buttonsList = Array.isArray(offersBanner.buttons) && offersBanner.buttons.length > 0
    ? offersBanner.buttons.filter(b => b.is_active !== false)
    : (offersBanner.button_text ? [{ text: offersBanner.button_text, link: offersBanner.button_link || '#offers' }] : []);

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

  // Filter active public products assigned specifically to Offers section
  const offersPublicProducts = activePublicProducts.filter(p => {
    const sec = Array.isArray(p.sections) ? p.sections : ['Home', 'All OTTs'];
    return sec.includes('Offers');
  });

  // Combine offer items and active public products assigned to Offers
  const combinedOffers = [...mappedOfferItems, ...offersPublicProducts].sort((a, b) => {
    const discA = parseInt(a.discount) || 0;
    const discB = parseInt(b.discount) || 0;
    return discB - discA;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Offers Top Slide Banner */}
        {isBannerVisible && (
          <div 
            style={{
              backgroundColor: offersBanner.bg_color || undefined
            }}
            className={`relative rounded-3xl text-white p-6 sm:p-10 mb-8 shadow-2xl overflow-hidden ${
              !offersBanner.bg_color ? 'bg-gradient-to-r from-[#e50914] via-rose-600 to-orange-500' : ''
            }`}
          >
            {/* Background Image if uploaded */}
            {offersBanner.image_url && (
              <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <img src={offersBanner.image_url} alt="Offer Background" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="relative z-10 max-w-3xl space-y-4">
              {/* Dynamic Badges */}
              <div className="flex flex-wrap items-center gap-2">
                {badgesList.map((bdg, i) => (
                  <span 
                    key={bdg.id || i}
                    style={{
                      transform: (bdg.position_x || bdg.position_y) ? `translate(${bdg.position_x || 0}px, ${bdg.position_y || 0}px)` : undefined,
                      backgroundColor: bdg.bg_color || 'rgba(0,0,0,0.3)',
                      color: bdg.text_color || '#ffffff'
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/30 text-xs font-black uppercase tracking-wider shadow-sm"
                  >
                    <Flame className="w-4 h-4 fill-amber-300 text-amber-300 animate-bounce" />
                    {bdg.text || bdg.name || 'MEGA DISCOUNT CARNIVAL'}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight drop-shadow-md">
                {offersBanner.heading || 'Exclusive Offers & Deals Up To 75% OFF'}
              </h1>
              <p className="text-white/90 text-sm sm:text-base leading-relaxed max-w-2xl">
                {offersBanner.description || 'Grab daily flash discounts on OTT subscriptions, high speed fiber internet, mobiles, earbuds, smartwatches & gadgets.'}
              </p>

              {/* Dynamic Action Buttons */}
              {buttonsList.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-3">
                  {buttonsList.map((btn, i) => (
                    <button
                      key={btn.id || i}
                      onClick={() => {
                        const link = btn.link || '/view-all';
                        if (btn.is_external || link.startsWith('http') || link.startsWith('tel:') || link.startsWith('mailto:')) {
                          window.open(link, btn.target || '_blank');
                        } else if (typeof onNavigate === 'function') {
                          onNavigate(link.replace(/^\//, ''));
                        } else {
                          window.location.href = link;
                        }
                      }}
                      style={{
                        transform: (btn.position_x || btn.position_y) ? `translate(${btn.position_x || 0}px, ${btn.position_y || 0}px)` : undefined,
                        backgroundColor: btn.button_color || '#000000',
                        color: btn.text_color || '#ffffff'
                      }}
                      className="px-6 py-3 rounded-xl font-extrabold text-sm shadow-xl hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>{btn.text || 'Explore Offers'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

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
