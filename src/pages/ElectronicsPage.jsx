import React, { useState, useMemo } from 'react';
import { Laptop, Search } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import ProductCard from '../components/ProductCard';

export default function ElectronicsPage({ onAddToCart, onQuickView, wishlistIds = [], onToggleWishlist }) {
  const { activePublicProducts } = useCMS();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const electronicsList = useMemo(() => {
    return activePublicProducts.filter(p => 
      ['Smart TVs', 'Laptops', 'Chargers', 'Power Banks', 'Electronics'].includes(p.category) ||
      p.categoryGroup === 'Other Products'
    );
  }, [activePublicProducts]);

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

        {/* Electronics Product Cards Grid: side-by-side layout */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
          {filtered.map(product => (
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

      </div>
    </div>
  );
}
