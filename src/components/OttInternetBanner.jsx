import React from 'react';
import { 
  Tv, Wifi, Layers, Flame, Zap, Shield, Sparkles, Smartphone, Headphones, Laptop, Gift, Star, Clock, CheckCircle, Globe, Tag, ArrowRight 
} from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export default function OttInternetBanner({ onExplorePlans }) {
  const { banners } = useCMS();
  const banner = banners.find(b => b.banner_key === 'home_middle_big') || {
    heading: '12-in-1 Mega Subscription Pack',
    subheading: 'ULTIMATE SAVINGS BUNDLE',
    description: 'Single dashboard access for Netflix, Prime, Hotstar, ZEE5, SonyLIV & 7 more apps.',
    button_text: 'Claim Offer',
    image_url: '/image.png'
  };

  // Parse dynamic feature items from CMS (supporting object, array, and direct properties)
  let featureItems = [];
  if (banner.badges && typeof banner.badges === 'object' && !Array.isArray(banner.badges) && Array.isArray(banner.badges.feature_items)) {
    featureItems = banner.badges.feature_items;
  } else if (Array.isArray(banner.badges)) {
    const featEntry = banner.badges.find(item => item.id === 'feature_items' || item.type === 'feature_item');
    if (featEntry && Array.isArray(featEntry.items)) {
      featureItems = featEntry.items;
    } else {
      const individualFeats = banner.badges.filter(item => item.type === 'feature_item');
      if (individualFeats.length > 0) featureItems = individualFeats;
    }
  } else if (Array.isArray(banner.feature_items)) {
    featureItems = banner.feature_items;
  }

  if (!featureItems || featureItems.length === 0) {
    featureItems = [
      { id: 'feat_1', icon: 'Tv', title: 'OTT Subscriptions', subtitle: 'Top Premium Platforms', color: '#e50914', is_active: true },
      { id: 'feat_2', icon: 'Wifi', title: 'Fiber Broadband', subtitle: 'High-Speed Internet Plans', color: '#38bdf8', is_active: true },
      { id: 'feat_3', icon: 'Layers', title: 'Combo Packages', subtitle: 'Save More with Combo Offers', color: '#f59e0b', is_active: true }
    ];
  }

  const activeFeatures = featureItems.filter(f => f.is_active !== false);

  // Badge config
  let badgeConfig = { enabled: false, text: '', position: 'top-left', bg_color: '#e50914', text_color: '#ffffff' };
  if (banner.badges && typeof banner.badges === 'object' && !Array.isArray(banner.badges) && banner.badges.badge_config) {
    badgeConfig = { ...badgeConfig, ...banner.badges.badge_config };
  } else if (Array.isArray(banner.badges)) {
    const badgeEntry = banner.badges.find(item => item.id === 'badge_config' || item.type === 'badge_config' || item.text);
    if (badgeEntry) {
      badgeConfig = { ...badgeConfig, ...badgeEntry, enabled: badgeEntry.enabled !== false && Boolean(badgeEntry.text) };
    }
  }
  if (banner.badge_config) {
    badgeConfig = { ...badgeConfig, ...banner.badge_config };
  }

  const isBadgeEnabled = badgeConfig.enabled && Boolean(badgeConfig.text);
  const badgePos = badgeConfig.position || 'top-left';

  const getBadgePositionClasses = (pos) => {
    switch (pos) {
      case 'top-right': return 'top-4 right-4 sm:top-6 sm:right-6';
      case 'bottom-left': return 'bottom-4 left-4 sm:bottom-6 sm:left-6';
      case 'bottom-right': return 'bottom-4 right-4 sm:bottom-6 sm:right-6';
      case 'top-left':
      default:
        return 'top-4 left-4 sm:top-6 sm:left-6';
    }
  };

  // Secondary Image and Caption
  let secondaryImgUrl = 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&auto=format&fit=crop&q=80';
  let secondaryCaption = '🔥 High-Speed Fiber Internet + OTT Combo';

  if (banner.badges && typeof banner.badges === 'object' && !Array.isArray(banner.badges)) {
    if (banner.badges.secondary_image_url) secondaryImgUrl = banner.badges.secondary_image_url;
    if (banner.badges.secondary_image_caption) secondaryCaption = banner.badges.secondary_image_caption;
  } else if (Array.isArray(banner.badges)) {
    const imgEntry = banner.badges.find(item => item.id === 'secondary_image' || item.type === 'secondary_image' || item.url);
    if (imgEntry) {
      if (imgEntry.url) secondaryImgUrl = imgEntry.url;
      if (imgEntry.caption) secondaryCaption = imgEntry.caption;
    }
  }
  if (banner.secondary_image_url) secondaryImgUrl = banner.secondary_image_url;
  if (banner.secondary_image_caption) secondaryCaption = banner.secondary_image_caption;

  const renderIcon = (iconName, color = '#e50914') => {
    const props = { className: 'w-6 h-6 shrink-0', style: { color } };
    switch ((iconName || '').toLowerCase()) {
      case 'tv': return <Tv {...props} />;
      case 'wifi': return <Wifi {...props} />;
      case 'layers': return <Layers {...props} />;
      case 'flame': return <Flame {...props} />;
      case 'zap': return <Zap {...props} />;
      case 'shield': return <Shield {...props} />;
      case 'sparkles': return <Sparkles {...props} />;
      case 'smartphone': return <Smartphone {...props} />;
      case 'headphones': return <Headphones {...props} />;
      case 'laptop': return <Laptop {...props} />;
      case 'gift': return <Gift {...props} />;
      case 'star': return <Star {...props} />;
      case 'clock': return <Clock {...props} />;
      case 'checkcircle': return <CheckCircle {...props} />;
      case 'globe': return <Globe {...props} />;
      case 'tag': return <Tag {...props} />;
      default: return <Sparkles {...props} />;
    }
  };

  const handleButtonClick = (btn) => {
    const link = btn.link || 'offers';
    if (btn.link_type === 'external' || btn.is_external || link.startsWith('http') || link.startsWith('tel:') || link.startsWith('mailto:')) {
      window.open(link, btn.target || '_blank');
    } else {
      if (link === 'offers' || link === '/offers') {
        if (typeof onExplorePlans === 'function') onExplorePlans('offers');
      } else if (link === 'ott-plans' || link === '/ott-plans') {
        if (typeof onExplorePlans === 'function') onExplorePlans('ott-plans');
      } else {
        if (typeof onExplorePlans === 'function') onExplorePlans(link.replace(/^\//, ''));
        else window.location.href = link;
      }
    }
  };

  return (
    <section id="ott-plans" className="py-12 bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-3xl bg-slate-950 text-white p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl border border-slate-800">
          
          {/* Optional Badge Display */}
          {isBadgeEnabled && (
            <div className={`absolute z-20 ${getBadgePositionClasses(badgePos)}`}>
              <span 
                style={{
                  backgroundColor: badgeConfig.bg_color || '#e50914',
                  color: badgeConfig.text_color || '#ffffff'
                }}
                className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-xl border border-white/20 inline-flex items-center gap-1 animate-pulse"
              >
                <Sparkles className="w-3.5 h-3.5" /> {badgeConfig.text}
              </span>
            </div>
          )}

          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(229,9,20,0.2),transparent_60%)] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#e50914] mb-2 block">
                  {banner.subheading || 'Entertainment + Connectivity'}
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase leading-tight font-sans">
                  {banner.heading || 'OTT & INTERNET PLANS'}
                </h2>
                <p className="text-slate-300 text-sm sm:text-base font-normal mt-1">
                  {banner.description || 'Entertainment + Connectivity at Best Prices'}
                </p>
              </div>

              {/* Dynamic Feature Lines / Cards (OTT / Fiber / Combo Packages) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
                {activeFeatures.map((feat, idx) => (
                  <div key={feat.id || idx} className="flex items-start gap-3 bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 shadow-md hover:border-slate-700 transition-colors">
                    {renderIcon(feat.icon, feat.color || '#e50914')}
                    <div>
                      <h4 className="text-xs font-bold text-white leading-snug">{feat.title}</h4>
                      <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{feat.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex flex-wrap gap-3">
                {Array.isArray(banner.buttons) && banner.buttons.length > 0 ? (
                  banner.buttons.filter(b => b.is_active !== false).map((btn, idx) => (
                    <button
                      key={btn.id || idx}
                      onClick={() => handleButtonClick(btn)}
                      style={{
                        transform: (btn.position_x || btn.position_y) ? `translate(${btn.position_x || 0}px, ${btn.position_y || 0}px)` : undefined,
                        backgroundColor: btn.button_color || '#e50914',
                        color: btn.text_color || '#ffffff'
                      }}
                      className="px-7 py-3 rounded-xl font-extrabold text-sm shadow-lg shadow-red-900/30 transition-all flex items-center gap-2 group cursor-pointer relative hover:scale-105"
                    >
                      <span>{btn.text || 'Click Here'}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))
                ) : (
                  <button
                    onClick={() => onExplorePlans && onExplorePlans('ott-plans')}
                    className="px-7 py-3 rounded-xl bg-[#e50914] hover:bg-red-700 text-white font-extrabold text-sm shadow-lg shadow-red-900/30 transition-all flex items-center gap-2 group cursor-pointer"
                  >
                    <span>{banner.button_text || 'View All Plans'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>

            </div>

            {/* Right Visual: Realistic TV Artwork & Separate Secondary Picture */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
              <div className="relative w-full max-w-sm bg-slate-900/95 border border-slate-800 p-4 rounded-3xl shadow-2xl backdrop-blur-md space-y-4">
                
                {/* 1. Primary Banner Artwork / TV Logo Graphic */}
                <div className="bg-slate-950 p-2 rounded-2xl border border-slate-800 overflow-hidden shadow-inner">
                  <img
                    src={banner.image_url || '/image.png'}
                    alt="OTT Platforms Artwork"
                    className="w-full h-auto object-contain rounded-xl hover:scale-105 transition-transform"
                  />
                </div>

                {/* 2. Separate Secondary Picture (Fiber Router / Combo Graphic) */}
                <div className="rounded-2xl overflow-hidden h-28 border border-slate-800 relative bg-slate-950">
                  <img
                    src={secondaryImgUrl}
                    alt="High Speed Broadband Fiber / Combo"
                    className="w-full h-full object-cover"
                  />
                  {secondaryCaption && (
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent flex items-end p-3">
                      <span className="text-xs font-extrabold text-amber-400 leading-tight drop-shadow-md">
                        {secondaryCaption}
                      </span>
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
