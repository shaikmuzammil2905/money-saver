import React from 'react';
import { Flame, ChevronRight } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import ProductCard from './ProductCard';

export default function FeaturedDeals({ onAddToCart, onQuickView, onViewAll, wishlistIds = [], onToggleWishlist }) {
  const { activePublicProducts, homeItems, siteSettings } = useCMS();

  const displayLimit = siteSettings?.home_display_settings?.display_count;

  // Transform active homeItems from Admin Home Page Builder into Product structure
  const mappedHomeItems = Array.isArray(homeItems)
    ? homeItems
        .filter((item) => item.is_active !== false)
        .sort((a, b) => (a.display_order || 999) - (b.display_order || 999))
        .map((item) => ({
          id: item.id || `home-item-${item.display_order}`,
          slug_id: item.id || `home-item-${item.display_order}`,
          db_id: item.id,
          title: item.title,
          subtitle: item.short_description || item.subtitle || '',
          description: item.short_description || item.title,
          descriptionPoints: [
            'High quality playback support',
            'Instant digital activation via WhatsApp',
            '24/7 dedicated customer support'
          ],
          customInfo: ['Instant Activation', 'WhatsApp Support Available', 'Payment via UPI'],
          price: Number(item.price || 0),
          originalPrice: Number(item.original_price || item.price || 0),
          discount: item.discount || (item.original_price && item.price && Number(item.original_price) > Number(item.price) ? `${Math.round(((Number(item.original_price) - Number(item.price)) / Number(item.original_price)) * 100)}% OFF` : ''),
          image: item.image_url || item.image || 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&auto=format&fit=crop&q=80',
          images: [item.image_url || item.image || 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&auto=format&fit=crop&q=80'],
          category: item.category || 'Featured',
          badge: item.badge || '',
          badges: item.badge ? [{ name: item.badge, text: item.badge, bg_color: '#e50914' }] : [],
          inStock: true,
          isFeatured: true,
          displayOrder: item.display_order || 1,
          homeOrder: item.display_order || 1,
          rating: 4.8,
          reviewsCount: 120
        }))
    : [];

  // Filter active catalog products assigned to Home section
  let homeProductsFromCatalog = activePublicProducts
    .filter((p) => Array.isArray(p.sections) ? p.sections.includes('Home') : p.isFeatured || p.show_on_home !== false)
    .sort((a, b) => (a.homeOrder || a.displayOrder || 999) - (b.homeOrder || b.displayOrder || 999));

  // If homeItems is configured in CMS Home Page Builder, prioritize homeItems & merge non-duplicate catalog products
  let homeProducts = [];
  if (mappedHomeItems.length > 0) {
    const existingTitles = new Set(mappedHomeItems.map(i => (i.title || '').toLowerCase()));
    const existingIds = new Set(mappedHomeItems.map(i => i.id));

    const extraCatalogProds = homeProductsFromCatalog.filter(
      p => !existingIds.has(p.id) && !existingTitles.has((p.title || '').toLowerCase())
    );

    homeProducts = [...mappedHomeItems, ...extraCatalogProds];
  } else {
    homeProducts = homeProductsFromCatalog;
  }

  if (displayLimit && displayLimit !== 'All' && typeof displayLimit === 'number') {
    homeProducts = homeProducts.slice(0, displayLimit);
  }

  const dealsToRender = homeProducts;

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

