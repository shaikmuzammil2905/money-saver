import React, { useState, useMemo } from 'react';
import { ALL_PRODUCTS } from '../data/products';
import { Laptop, Tv, Star, ShoppingCart, Eye, Search } from 'lucide-react';

const ELECTRONICS_EXTRA_PRODUCTS = [
  {
    id: 'smart-tv-55-4k',
    title: 'Xiaomi 55" 4K Ultra HD Smart TV',
    subtitle: 'Dolby Vision & Atmos | Android TV 11',
    price: 32999,
    originalPrice: 49999,
    discount: '34% OFF',
    rating: 4.8,
    reviewsCount: 1450,
    category: 'Smart TVs',
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&auto=format&fit=crop&q=80',
    description: '4K HDR10+ Display, 30W Speakers with Dolby Audio, PatchWall 4 with IMDb integration.'
  },
  {
    id: 'macbook-air-m2',
    title: 'Apple MacBook Air M2',
    subtitle: '8GB RAM | 256GB SSD (Starlight)',
    price: 89900,
    originalPrice: 99900,
    discount: '10% OFF',
    rating: 4.9,
    reviewsCount: 3120,
    category: 'Laptops',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    description: 'Supercharged by M2 chip. 13.6-inch Liquid Retina display, 18-hour battery life.'
  },
  {
    id: 'asus-vivobook-15',
    title: 'ASUS Vivobook 15 Intel i5',
    subtitle: '16GB RAM | 512GB SSD',
    price: 44990,
    originalPrice: 62990,
    discount: '28% OFF',
    rating: 4.6,
    reviewsCount: 940,
    category: 'Laptops',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80',
    description: '15.6" FHD display, 12th Gen Intel Core i5 processor, fingerprint scanner.'
  }
];

export default function ElectronicsPage({ onAddToCart, onQuickView }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const electronicsList = useMemo(() => {
    const existing = ALL_PRODUCTS.filter(p => ['Smart TVs', 'Laptops', 'Chargers', 'Power Banks'].includes(p.category));
    return [...existing, ...ELECTRONICS_EXTRA_PRODUCTS];
  }, []);

  const categories = ['All', 'Smart TVs', 'Laptops', 'Chargers', 'Power Banks'];

  const filtered = useMemo(() => {
    return electronicsList.filter(p => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [electronicsList, selectedCategory, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50 py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Section */}
        <div className="relative rounded-3xl bg-slate-950 text-white p-6 sm:p-10 mb-8 border border-slate-800 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(245,158,11,0.25),transparent_60%)] pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950 border border-amber-500/60 text-amber-400 text-xs font-black uppercase tracking-wider">
              <Laptop className="w-3.5 h-3.5" /> High Performance Electronics
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight">
              Electronics <span className="text-amber-400">&amp; Smart Devices</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Shop 4K Smart TVs, high performance laptops, fast chargers &amp; essential tech devices backed by official manufacturer warranties &amp; instant doorstep setup.
            </p>
          </div>
        </div>

        {/* Filter Pills & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-60">
            <input
              type="text"
              placeholder="Search electronics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 text-xs rounded-xl py-2 pl-8 pr-3 border border-slate-200 focus:outline-none focus:border-amber-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Electronics Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filtered.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between group relative"
            >
              <div>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full inline-block mb-1">
                  {product.category}
                </span>

                <h3 className="font-extrabold text-sm text-slate-900 line-clamp-1 group-hover:text-amber-600 transition-colors">
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
                  <span className="text-slate-400 font-medium">({product.reviewsCount?.toLocaleString() || '512'})</span>
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
                  <span className="text-[10px] font-extrabold text-white bg-[#e50914] px-2 py-0.5 rounded-md">
                    {product.discount}
                  </span>
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
