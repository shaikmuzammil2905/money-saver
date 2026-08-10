import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import CategoryCards from './components/CategoryCards';
import FeaturedDeals from './components/FeaturedDeals';
import ValueProposition from './components/ValueProposition';
import OttInternetBanner from './components/OttInternetBanner';
import CategoryCarousel from './components/CategoryCarousel';
import PromoBanner from './components/PromoBanner';
import NeedHelpSection from './components/NeedHelpSection';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Toast from './components/Toast';
import WhatsAppModal from './components/WhatsAppModal';
import QuickViewModal from './components/QuickViewModal';
import MobileBottomNav from './components/MobileBottomNav';
import ViewAllProducts from './components/ViewAllProducts';
import { ALL_PRODUCTS } from './data/products';

export default function App() {
  // Initial cart with items
  const [cartItems, setCartItems] = useState([
    {
      id: 'boat-550',
      title: 'boAt Rockerz 550',
      subtitle: 'Bluetooth Headphone',
      price: 1499,
      originalPrice: 2999,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      quantity: 1
    },
    {
      id: 'realme-narzo-70',
      title: 'Realme Narzo 70 Pro 5G',
      subtitle: '(8GB | 128GB)',
      price: 16999,
      originalPrice: 21999,
      image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
      quantity: 1
    }
  ]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  // Calculate total badge count
  const cartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  // Cart actions
  const handleAddToCart = (product) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);
      if (existing) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });

    setToast(product);
  };

  const handleUpdateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleSelectCategory = (catIdOrName) => {
    let catName = 'All';
    if (catIdOrName === 'ott') catName = 'OTT Platforms';
    else if (catIdOrName === 'fiber') catName = 'Fiber Internet';
    else if (catIdOrName === 'mobiles') catName = 'Smartphones';
    else if (catIdOrName === 'gadgets') catName = 'Headphones';
    else if (catIdOrName === 'electronics') catName = 'Laptops';
    else if (typeof catIdOrName === 'string') catName = catIdOrName;

    setSelectedCategoryFilter(catName);
    setIsViewAllOpen(true);
  };

  // Filtered search products if user types in search bar
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase();
    return ALL_PRODUCTS.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.subtitle?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-16 md:pb-0">
      
      {/* Header Navigation */}
      <Header
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        setActiveTab={(tabId) => {
          setActiveTab(tabId);
          if (tabId === 'offers' || tabId === 'mobiles' || tabId === 'electronics') {
            setIsViewAllOpen(true);
          } else {
            setIsViewAllOpen(false);
          }
        }}
      />

      {/* Main Content Body */}
      <main>
        {/* Search Results Overlay */}
        {searchResults !== null ? (
          <section className="py-12 bg-slate-50 min-h-[60vh]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">
                  Search Results for "{searchQuery}" ({searchResults.length})
                </h2>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs font-bold text-brand-red hover:underline"
                >
                  Clear Search
                </button>
              </div>

              {searchResults.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  No products or plans found matching "{searchQuery}".
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
                    >
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-40 object-contain mb-3"
                      />
                      <div>
                        <h3 className="font-bold text-sm text-slate-900">{product.title}</h3>
                        <p className="text-xs text-slate-500">{product.subtitle}</p>
                        <div className="text-base font-black text-slate-900 mt-2">
                          ₹{product.price.toLocaleString()}
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full mt-3 py-2.5 bg-[#008744] hover:bg-[#007038] text-white font-bold text-xs rounded-xl transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        ) : isViewAllOpen ? (
          /* View All Products Page / Catalog View */
          <ViewAllProducts
            onBack={() => setIsViewAllOpen(false)}
            onAddToCart={handleAddToCart}
            onQuickView={(prod) => setQuickViewProduct(prod)}
            selectedCategory={selectedCategoryFilter}
          />
        ) : (
          /* Standard Home View */
          <>
            {/* Dual Animated Banner Carousel (Slide 1 Red & Slide 2 Cyberpunk Neon) */}
            <HeroSection
              onExploreDeals={() => {
                setIsViewAllOpen(true);
              }}
              onShopNow={() => {
                setIsViewAllOpen(true);
              }}
            />

            {/* Quick Category Cards matching reference design */}
            <CategoryCards onSelectCategory={handleSelectCategory} />

            {/* Featured Deals Section matching image copy 5.png */}
            <FeaturedDeals
              onAddToCart={handleAddToCart}
              onQuickView={(prod) => setQuickViewProduct(prod)}
              onViewAll={() => setIsViewAllOpen(true)}
            />

            {/* Value Proposition Section */}
            <ValueProposition />

            {/* OTT & Internet Plans Banner */}
            <OttInternetBanner
              onExplorePlans={() => {
                setIsWhatsAppOpen(true);
              }}
            />

            {/* Shop By Category Carousel */}
            <CategoryCarousel onSelectCategory={handleSelectCategory} />

            {/* Red/Orange Promotional Discount Banner */}
            <PromoBanner
              onViewOffers={() => {
                setIsViewAllOpen(true);
              }}
            />

            {/* Need Help Section */}
            <NeedHelpSection onOpenWhatsApp={() => setIsWhatsAppOpen(true)} />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavClick={(id) => {
          if (id === 'offers' || id === 'mobiles' || id === 'electronics') {
            setIsViewAllOpen(true);
          } else {
            setIsViewAllOpen(false);
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Floating Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Direct WhatsApp Action Modal */}
      <WhatsAppModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
      />

      {/* Product Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Mobile Sticky Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'offers' || tab === 'categories') {
            setIsViewAllOpen(true);
          } else {
            setIsViewAllOpen(false);
          }
        }}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
      />

    </div>
  );
}
