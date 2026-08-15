import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import ProductCard from './ProductCard';

export default function ViewAllProducts({ 
  onBack, 
  onAddToCart, 
  onQuickView, 
  selectedCategory = 'All', 
  wishlistIds = [], 
  onToggleWishlist 
}) {
  const { activePublicProducts, categories: cmsCategories, siteSettings } = useCMS();
  const [activeCategory, setActiveCategory] = useState(selectedCategory || 'All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');

  // Determine category layout style from Supabase Admin setting ('grid' vs 'horizontal')
  const categoryLayoutStyle = siteSettings?.category_layout_style || siteSettings?.all_otts_category_layout || 'grid';

  // Build ONE clean unified list of categories starting with 'All'
  const categoryOptions = useMemo(() => {
    const list = [{ id: 'All', name: 'All' }];
    
    if (cmsCategories && cmsCategories.length > 0) {
      cmsCategories
        .filter(c => c.is_active !== false)
        .sort((a, b) => (a.display_order || 99) - (b.display_order || 99))
        .forEach(c => {
          if (!list.some(item => item.name.toLowerCase() === c.name.toLowerCase())) {
            list.push({ id: c.slug || c.id || c.name, name: c.name });
          }
        });
    }

    // Also include any categories present in products
    activePublicProducts.forEach(p => {
      if (p.category && !list.some(item => item.name.toLowerCase() === p.category.toLowerCase())) {
        list.push({ id: p.category, name: p.category });
      }
    });

    return list;
  }, [cmsCategories, activePublicProducts]);

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    return activePublicProducts.filter((product) => {
      const matchesCat = activeCategory === 'All' || 
        product.category?.toLowerCase() === activeCategory.toLowerCase() ||
        product.categoryGroup?.toLowerCase() === activeCategory.toLowerCase();
      
      const query = searchTerm.toLowerCase();
      const matchesSearch = !query ||
        product.title.toLowerCase().includes(query) ||
        product.subtitle?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query) ||
        product.categoryGroup?.toLowerCase().includes(query);

      return matchesCat && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [activePublicProducts, activeCategory, searchTerm, sortBy]);

  return (
    <section className="min-h-screen bg-slate-50 py-6 sm:py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Header Section with Back Icon & Page Title */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-3 rounded-xl bg-[#e50914] hover:bg-red-700 active:scale-95 text-white transition-all flex items-center justify-center shadow-md shrink-0"
              aria-label="Back to Home"
              title="Back to Home"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                All OTTs
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Explore all OTT platform plans, subscriptions &amp; smart digital products.
              </p>
            </div>
          </div>

          {/* Full-Width Search Input Bar */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search All OTTs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-xs sm:text-sm rounded-xl py-2.5 pl-9 pr-4 border border-slate-200 focus:outline-none focus:border-[#e50914] focus:bg-white transition-colors"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>

        {/* ONE SINGLE CATEGORY SELECTOR (Admin Setting Driven: Grid vs Horizontal) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-wider">
              Filter by Category
            </h2>
            <span className="text-[10px] text-slate-400 font-bold">
              Showing {filteredProducts.length} Items
            </span>
          </div>

          {categoryLayoutStyle === 'horizontal' ? (
            /* Option B: Horizontal Scroll Mode */
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categoryOptions.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeCategory.toLowerCase() === cat.name.toLowerCase()
                      ? 'bg-[#e50914] text-white shadow-md shadow-red-600/30'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          ) : (
            /* Option A: Grid / Stable Mode (Default Wrapped Grid) */
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
              {categoryOptions.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold text-center transition-all truncate ${
                    activeCategory.toLowerCase() === cat.name.toLowerCase()
                      ? 'bg-[#e50914] text-white shadow-md shadow-red-600/30 font-black'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center my-4">
            <Filter className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No products found</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">Try adjusting your category filter or search term.</p>
            <button
              onClick={() => { setActiveCategory('All'); setSearchTerm(''); }}
              className="px-5 py-2.5 bg-[#e50914] text-white rounded-xl text-xs font-bold shadow hover:bg-red-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
            {filteredProducts.map((product) => (
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


