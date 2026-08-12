import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import CategoryCards from './components/CategoryCards';
import FeaturedDeals from './components/FeaturedDeals';
import ValueProposition from './components/ValueProposition';
import OttInternetBanner from './components/OttInternetBanner';
import CategoryCarousel from './components/CategoryCarousel';
import PromoBanner from './components/PromoBanner';
import PromoSliderBanner from './components/PromoSliderBanner';
import HowToOrderSection from './components/HowToOrderSection';
import NeedHelpSection from './components/NeedHelpSection';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Toast from './components/Toast';
import WhatsAppModal from './components/WhatsAppModal';
import ProductDetailModal from './components/ProductDetailModal';
import AuthModal from './components/AuthModal';
import CustomerProfileModal from './components/CustomerProfileModal';
import MobileBottomNav from './components/MobileBottomNav';
import ViewAllProducts from './components/ViewAllProducts';
import ProductCard from './components/ProductCard';

// Dedicated Page Views
import OttPlansPage from './pages/OttPlansPage';
import FiberInternetPage from './pages/FiberInternetPage';
import MobilesGadgetsPage from './pages/MobilesGadgetsPage';
import ElectronicsPage from './pages/ElectronicsPage';
import OffersPage from './pages/OffersPage';
import ContactPage from './pages/ContactPage';

import { ALL_PRODUCTS } from './data/products';
import { getUserProfile } from './services/orderService';

const CART_STORAGE_KEY = 'ott_cart';

export default function App() {
  // Load Cart from LocalStorage or default items
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading initial cart:', e);
    }
    return [
      {
        id: 'boat-550',
        title: 'boAt Rockerz 550 Bluetooth Headphones',
        subtitle: 'Over-Ear Wireless Headphone',
        price: 1499,
        originalPrice: 2999,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
        quantity: 1,
        inStock: true
      }
    ];
  });

  // User Auth Profile State
  const [user, setUser] = useState(() => getUserProfile());

  // Wishlist state
  const [wishlistIds, setWishlistIds] = useState(['boat-550']);

  // Modals & Drawers States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [productDetailModal, setProductDetailModal] = useState(null);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Search & Navigation
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'ott-plans', 'fiber', 'mobiles', 'electronics', 'offers', 'contact', 'view-all'
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  // Persist Cart
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }, [cartItems]);

  const cartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const handleToggleWishlist = (product) => {
    setWishlistIds((prev) => {
      if (prev.includes(product.id)) {
        return prev.filter((id) => id !== product.id);
      }
      return [...prev, product.id];
    });
  };

  const handleAddToCart = (product) => {
    if (product.inStock === false) {
      alert('Sorry, this product is currently out of stock!');
      return;
    }

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

  const handleOpenAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('ott_user');
    setUser(null);
    setIsProfileModalOpen(false);
  };

  const handleSelectCategory = (catIdOrName) => {
    if (catIdOrName === 'ott') setActiveTab('ott-plans');
    else if (catIdOrName === 'fiber') setActiveTab('fiber');
    else if (catIdOrName === 'mobiles' || catIdOrName === 'gadgets') setActiveTab('mobiles');
    else if (catIdOrName === 'electronics') setActiveTab('electronics');
    else if (catIdOrName === 'offers') setActiveTab('offers');
    else {
      setSelectedCategoryFilter(catIdOrName);
      setActiveTab('view-all');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Search Results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase();
    return ALL_PRODUCTS.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.subtitle?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query) ||
        p.categoryGroup?.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Page Component Switcher
  const renderActivePage = () => {
    if (searchResults !== null) {
      return (
        <section className="py-12 bg-slate-50 min-h-[60vh]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Search Results for "{searchQuery}" ({searchResults.length})
              </h2>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-bold text-[#e50914] hover:underline"
              >
                Clear Search
              </button>
            </div>

            {searchResults.length === 0 ? (
              <div className="text-center py-12 text-slate-500 font-medium">
                No products or plans found matching "{searchQuery}".
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
                {searchResults.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onQuickView={(prod) => setProductDetailModal(prod)}
                    isWishlisted={wishlistIds.includes(product.id)}
                    onToggleWishlist={handleToggleWishlist}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      );
    }

    switch (activeTab) {
      case 'ott-plans':
        return (
          <OttPlansPage
            onAddToCart={handleAddToCart}
            onQuickView={(prod) => setProductDetailModal(prod)}
            onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
          />
        );
      case 'fiber':
        return (
          <FiberInternetPage
            onAddToCart={handleAddToCart}
            onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
          />
        );
      case 'mobiles':
        return (
          <MobilesGadgetsPage
            onAddToCart={handleAddToCart}
            onQuickView={(prod) => setProductDetailModal(prod)}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
          />
        );
      case 'electronics':
        return (
          <ElectronicsPage
            onAddToCart={handleAddToCart}
            onQuickView={(prod) => setProductDetailModal(prod)}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
          />
        );
      case 'offers':
        return (
          <OffersPage
            onAddToCart={handleAddToCart}
            onQuickView={(prod) => setProductDetailModal(prod)}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
          />
        );
      case 'contact':
        return (
          <ContactPage
            onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
          />
        );
      case 'view-all':
        return (
          <ViewAllProducts
            onBack={() => setActiveTab('home')}
            onAddToCart={handleAddToCart}
            onQuickView={(prod) => setProductDetailModal(prod)}
            selectedCategory={selectedCategoryFilter}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
          />
        );
      case 'home':
      default:
        return (
          <>
            {/* Dual Animated Hero Carousel */}
            <HeroSection
              onExploreDeals={() => setActiveTab('offers')}
              onShopNow={() => setActiveTab('mobiles')}
            />

            {/* Quick Category Cards */}
            <CategoryCards onSelectCategory={handleSelectCategory} />

            {/* Promo Slider Banner */}
            <PromoSliderBanner
              onViewOffers={() => setActiveTab('offers')}
              onSelectCategory={handleSelectCategory}
            />

            {/* Featured Deals Section */}
            <FeaturedDeals
              onAddToCart={handleAddToCart}
              onQuickView={(prod) => setProductDetailModal(prod)}
              onViewAll={() => setActiveTab('offers')}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
            />

            {/* How To Order Instructions Section */}
            <HowToOrderSection
              onStartShopping={() => {
                setActiveTab('view-all');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Value Proposition */}
            <ValueProposition />

            {/* OTT & Internet Plans Banner */}
            <OttInternetBanner
              onExplorePlans={() => setActiveTab('ott-plans')}
            />

            {/* Shop By Category Carousel */}
            <CategoryCarousel onSelectCategory={handleSelectCategory} />

            {/* Promo Discount Banner */}
            <PromoBanner
              onViewOffers={() => setActiveTab('offers')}
            />

            {/* Need Help Section */}
            <NeedHelpSection onOpenWhatsApp={() => setIsWhatsAppOpen(true)} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-20 md:pb-0 overflow-x-hidden w-full max-w-full">
      
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
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        user={user}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenAuthModal={handleOpenAuthModal}
      />

      {/* Main Content Body */}
      <main className="overflow-x-hidden w-full max-w-full">
        {renderActivePage()}
      </main>

      {/* Footer */}
      <Footer
        onNavClick={(id) => {
          setActiveTab(id);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Shopping Cart & Checkout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        user={user}
        onOpenAuthModal={handleOpenAuthModal}
      />

      {/* Customer Login / Registration Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(loggedUser) => setUser(loggedUser)}
      />

      {/* Customer Profile & Order History Modal */}
      <CustomerProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        onLogout={handleLogout}
        onUpdateUser={(updated) => setUser(updated)}
      />

      {/* Floating Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Direct WhatsApp Action Modal */}
      <WhatsAppModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
      />

      {/* Product Detail Modal (1-5 Image Gallery + Specs) */}
      <ProductDetailModal
        product={productDetailModal}
        onClose={() => setProductDetailModal(null)}
        onAddToCart={handleAddToCart}
        allProducts={ALL_PRODUCTS}
        wishlistIds={wishlistIds}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* Mobile Sticky Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

    </div>
  );
}
