import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Home, Tag, Package, Layers, ShoppingCart, Image as ImageIcon, Globe, Activity, LogOut, Menu, X, Eye, ShieldCheck, ChevronRight, User 
} from 'lucide-react';
import { getCurrentAdmin, logoutAdmin } from '../services/adminAuth';
import AdminLogin from './AdminLogin';
import Dashboard from './pages/Dashboard';
import HomePageManager from './pages/HomePageManager';
import OffersManager from './pages/OffersManager';
import ProductsManager from './pages/ProductsManager';
import CategoriesManager from './pages/CategoriesManager';
import CartSettingsManager from './pages/CartSettingsManager';
import MediaManager from './pages/MediaManager';
import WebsiteSettingsManager from './pages/WebsiteSettingsManager';
import ActivityLogPage from './pages/ActivityLogPage';

import BannersManager from './pages/BannersManager';
import BadgesManager from './pages/BadgesManager';
import MembersManager from './pages/MembersManager';
import AnalyticsManager from './pages/AnalyticsManager';

export default function AdminApp() {
  const [adminUser, setAdminUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function checkSession() {
      try {
        const user = await getCurrentAdmin();
        setAdminUser(user);
      } catch (err) {
        console.error('Session check error:', err);
      } finally {
        setCheckingAuth(false);
      }
    }
    checkSession();
  }, []);

  const handleLogout = async () => {
    await logoutAdmin();
    setAdminUser(null);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white font-sans">
        <div className="w-10 h-10 border-4 border-[#008744]/30 border-t-[#008744] rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-semibold text-slate-400">Verifying Admin Session Security...</p>
      </div>
    );
  }

  if (!adminUser) {
    return <AdminLogin onLoginSuccess={(user) => setAdminUser(user)} />;
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'banners', label: 'Banners Manager', icon: ImageIcon },
    { id: 'home', label: 'Home Page', icon: Home },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'offers', label: 'Offers', icon: Tag },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'badges', label: 'Badges & Batches', icon: Tag },
    { id: 'members', label: 'Members', icon: User },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'cart', label: 'Cart & WhatsApp', icon: ShoppingCart },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
    { id: 'settings', label: 'Website Settings', icon: Globe },
    { id: 'activity', label: 'Activity Logs', icon: Activity }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={(tab) => setActiveTab(tab)} />;
      case 'banners':
        return <BannersManager adminEmail={adminUser.email} />;
      case 'home':
        return <HomePageManager adminEmail={adminUser.email} />;
      case 'products':
        return <ProductsManager adminEmail={adminUser.email} />;
      case 'offers':
        return <OffersManager adminEmail={adminUser.email} />;
      case 'categories':
        return <CategoriesManager adminEmail={adminUser.email} />;
      case 'badges':
        return <BadgesManager adminEmail={adminUser.email} />;
      case 'members':
        return <MembersManager adminEmail={adminUser.email} />;
      case 'analytics':
        return <AnalyticsManager />;
      case 'cart':
        return <CartSettingsManager adminEmail={adminUser.email} />;
      case 'media':
        return <MediaManager adminEmail={adminUser.email} />;
      case 'settings':
        return <WebsiteSettingsManager adminEmail={adminUser.email} />;
      case 'activity':
        return <ActivityLogPage />;
      default:
        return <Dashboard onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row overflow-x-hidden">
      
      {/* MOBILE TOPBAR */}
      <div className="md:hidden sticky top-0 z-40 bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-800 text-slate-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-black text-lg text-white flex items-center gap-1">
            <span className="text-[#e50914]">OTT</span>
            <span>Admin</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <a href="/" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-emerald-950 text-emerald-300 text-xs font-bold flex items-center gap-1 border border-emerald-800">
            <Eye className="w-4 h-4" /> Site
          </a>
        </div>
      </div>

      {/* SIDEBAR NAVIGATION (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed md:sticky top-0 z-50 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-5 space-y-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#e50914] to-[#008744] text-white flex items-center justify-center font-black shadow-md">
                OMS
              </div>
              <div>
                <h2 className="font-black text-white text-base tracking-tight leading-none">Admin CMS</h2>
                <span className="text-[10px] font-bold text-emerald-400">OTTMoneySaver</span>
              </div>
            </div>
            <button className="md:hidden text-slate-400" onClick={() => setMobileMenuOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#e50914]/20 to-[#008744]/20 text-white border border-[#008744]/50 shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp className={`w-4 h-4 ${isActive ? 'text-[#008744]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#008744]" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer & Admin Profile */}
        <div className="p-5 border-t border-slate-800 space-y-3 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 flex items-center justify-center shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{adminUser.email}</p>
              <span className="text-[9px] font-extrabold uppercase text-emerald-400 tracking-wider">Authorized Admin</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-800/60 text-red-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout Session
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 min-h-screen overflow-y-auto max-w-7xl mx-auto w-full">
        {renderTabContent()}
      </main>

    </div>
  );
}
