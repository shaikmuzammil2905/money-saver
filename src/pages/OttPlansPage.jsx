import React, { useState } from 'react';
import { Tv, Flame, CheckCircle, ShieldCheck, Zap, Star, ShoppingCart, Eye, ArrowRight, MessageCircle } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

const OTT_PLANS_LIST = [
  {
    id: 'netflix-4k-1m',
    title: 'Netflix Premium 4K UHD',
    subtitle: '1 Month Premium Subscription (4 Screens)',
    category: 'Netflix',
    price: 199,
    originalPrice: 649,
    discount: '70% OFF',
    rating: 4.9,
    reviewsCount: 3420,
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=600&auto=format&fit=crop&q=80',
    features: [
      'Ultra HD (4K) + HDR video quality',
      'Watch on Mobile, TV, Laptop, Tablet',
      'Download & watch offline',
      '4 Screens simultaneous playback',
      'Instant delivery via WhatsApp/SMS'
    ]
  },
  {
    id: 'netflix-4k-3m',
    title: 'Netflix Premium 4K UHD',
    subtitle: '3 Months Value Pack (4 Screens)',
    category: 'Netflix',
    price: 549,
    originalPrice: 1947,
    discount: '72% OFF',
    rating: 4.9,
    reviewsCount: 1890,
    badge: 'Super Saver',
    image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=600&auto=format&fit=crop&q=80',
    features: [
      '3 Months continuous uninterrupted UHD 4K',
      'Multi-device logins supported',
      'Zero buffering high bandwidth servers',
      'Full catalog access (Movies & Series)'
    ]
  },
  {
    id: 'hotstar-super-1y',
    title: 'Disney+ Hotstar Super Plan',
    subtitle: '1 Year Full Subscription',
    category: 'Disney+ Hotstar',
    price: 499,
    originalPrice: 899,
    discount: '45% OFF',
    rating: 4.8,
    reviewsCount: 2890,
    badge: 'Live Cricket',
    image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=600&auto=format&fit=crop&q=80',
    features: [
      'All Live Sports (Cricket, Football, F1, Tennis)',
      'Hotstar Specials & Marvel Movies',
      'Full HD 1080p stream resolution',
      '2 Devices simultaneous stream'
    ]
  },
  {
    id: 'prime-video-1y',
    title: 'Amazon Prime Video Premium',
    subtitle: '1 Year Membership',
    category: 'Prime Video',
    price: 599,
    originalPrice: 1499,
    discount: '60% OFF',
    rating: 4.9,
    reviewsCount: 4120,
    badge: 'Free Shipping Incl.',
    image: 'https://images.unsplash.com/photo-1586899028174-e7098604235b?w=600&auto=format&fit=crop&q=80',
    features: [
      'Prime Video 4K HDR streaming',
      'Free Amazon Express Delivery',
      'Prime Music unlimited ad-free audio',
      'Watch on 3 devices simultaneously'
    ]
  },
  {
    id: 'zee5-premium-1y',
    title: 'ZEE5 Premium All-Access',
    subtitle: '1 Year Subscription',
    category: 'ZEE5',
    price: 399,
    originalPrice: 999,
    discount: '60% OFF',
    rating: 4.7,
    reviewsCount: 1540,
    badge: 'Regional Specials',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&auto=format&fit=crop&q=80',
    features: [
      '2800+ Blockbuster Movies & 150+ Web Series',
      'Live TV channels in 12 regional languages',
      '4K video support on Smart TVs',
      'Ad-free uninterrupted streaming'
    ]
  },
  {
    id: 'sony-liv-1y',
    title: 'Sony LIV Premium HD',
    subtitle: '1 Year Premium Pass',
    category: 'Sony LIV',
    price: 449,
    originalPrice: 999,
    discount: '55% OFF',
    rating: 4.8,
    reviewsCount: 1980,
    badge: 'Live Sports Pass',
    image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=600&auto=format&fit=crop&q=80',
    features: [
      'UEFA Champions League, WWE & Cricket',
      'Sony Originals & International Series',
      'Full HD streaming with 5.1 surround sound',
      '2 screens simultaneous viewing'
    ]
  },
  {
    id: 'mega-ott-combo-12-apps',
    title: '12-in-1 Mega OTT Combo Pack',
    subtitle: '1 Year All-Inclusive Entertainment Bundle',
    category: 'Combo Packs',
    price: 999,
    originalPrice: 3999,
    discount: '75% OFF',
    rating: 5.0,
    reviewsCount: 5210,
    badge: 'Ultimate Value',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&fit=crop&q=80',
    features: [
      'Includes Netflix, Prime, Hotstar, ZEE5, SonyLIV, Voot, Aha, Lionsgate & more',
      'Single dashboard login for all 12 apps',
      'Save over ₹3,000 per year compared to separate plans',
      '24/7 Priority VIP support & instant activation'
    ]
  }
];

export default function OttPlansPage({ onAddToCart, onQuickView, onOpenWhatsApp }) {
  const [selectedCat, setSelectedCat] = useState('All');

  const filterCategories = ['All', 'Netflix', 'Prime Video', 'Disney+ Hotstar', 'ZEE5', 'Sony LIV', 'Combo Packs'];

  const filteredPlans = selectedCat === 'All' 
    ? OTT_PLANS_LIST 
    : OTT_PLANS_LIST.filter(plan => plan.category === selectedCat);

  return (
    <div className="min-h-screen bg-slate-50 py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Section */}
        <div className="relative rounded-3xl bg-slate-950 text-white p-6 sm:p-10 mb-8 border border-slate-800 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(229,9,20,0.3),transparent_60%)] pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950 border border-red-600/60 text-[#e50914] text-xs font-black uppercase tracking-wider">
              <Tv className="w-3.5 h-3.5" /> Premium Digital Subscriptions
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight">
              All OTT Platform Subscriptions <span className="text-[#e50914]">&amp; Combo Packs</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Get genuine premium memberships for Netflix, Prime Video, Disney+ Hotstar, ZEE5, Sony LIV and 12-in-1 combo bundles at up to <span className="text-amber-400 font-bold">75% OFF regular prices!</span> Instant digital delivery guaranteed.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={onOpenWhatsApp}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-700/30 transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Instant Activation via WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {filterCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCat === cat
                  ? 'bg-[#e50914] text-white shadow-md shadow-red-600/30'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* OTT Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Header Image & Badge */}
                <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-4 bg-slate-900">
                  <img
                    src={plan.image}
                    alt={plan.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex items-end p-4">
                    <div>
                      <span className="text-[10px] font-extrabold text-amber-400 bg-amber-950/80 border border-amber-500/50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {plan.badge}
                      </span>
                      <h3 className="text-lg font-black text-white leading-snug mt-1">
                        {plan.title}
                      </h3>
                    </div>
                  </div>
                  <span className="absolute top-3 right-3 bg-[#e50914] text-white text-xs font-black px-2.5 py-1 rounded-full shadow">
                    {plan.discount}
                  </span>
                </div>

                <p className="text-xs text-slate-500 font-medium mb-3">{plan.subtitle}</p>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-4 text-xs">
                  <div className="flex items-center gap-1 text-amber-500 font-extrabold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{plan.rating}</span>
                  </div>
                  <span className="text-slate-400">({plan.reviewsCount.toLocaleString()} reviews)</span>
                </div>

                {/* Key Features List */}
                <div className="space-y-2 mb-6 border-t border-b border-slate-100 py-3">
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing & Add to Cart */}
              <div>
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <span className="text-xs text-slate-400 line-through font-medium mr-2">
                      ₹{plan.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-2xl font-black text-slate-900">
                      ₹{plan.price.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                    Instant Activation
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onQuickView(plan)}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                  >
                    <Eye className="w-4 h-4" /> Details
                  </button>
                  <button
                    onClick={() => onAddToCart(plan)}
                    className="py-2.5 px-3 rounded-xl bg-[#008744] hover:bg-[#007038] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/20 transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4 stroke-[2.5]" /> Add to Cart
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
