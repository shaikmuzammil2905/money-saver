import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, Facebook, Instagram, Youtube, Lock } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export default function Footer({ onNavClick }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { siteSettings, contactDetails, footerLinks } = useCMS();

  const businessName = siteSettings?.business_name || 'OTTMoneySaver';
  const logoUrl = siteSettings?.logo_url || '/image.png';
  const footerTagline = siteSettings?.footer_tagline || 'Save Money Smartly. Enjoy More. OTT subscriptions, high-speed fiber internet, smartphones, gadgets, and electronics at unbeatable prices.';
  const footerQuote = siteSettings?.footer_quote || '"We compromise on Money but not in Service."';
  const showAdminLink = siteSettings?.show_admin_footer_link !== false;
  const address = contactDetails?.address || 'Hyderabad, Telangana, India';
  const phone = contactDetails?.phone || '6305151531';
  const secondaryPhone = contactDetails?.secondary_phone || '7013931261';
  const emailAddr = contactDetails?.email || 'support@ottmoneysaver.com';

  const quickLinks = footerLinks.filter(f => (f.section_name === 'Quick Links' || !f.section_name) && f.is_active !== false);
  const supportLinks = footerLinks.filter(f => f.section_name === 'Customer Support' && f.is_active !== false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 font-sans border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src={logoUrl} 
                alt="OTTMoneySaver Logo" 
                className="h-10 md:h-12 object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
              <span className="text-xl md:text-2xl font-black text-white">
                <span className="text-[#e50914]">OTT</span>Money<span className="text-[#008744]">Saver</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {footerTagline}
            </p>

            <div className="text-xs text-amber-400 font-semibold italic">
              {footerQuote}
            </div>

            {showAdminLink && (
              <div>
                <a
                  href="/admin"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-colors"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" /> Administrator CMS Login
                </a>
              </div>
            )}
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2 text-xs">
              {(quickLinks.length > 0 ? quickLinks : [
                { link_text: 'Home', link_url: 'home' },
                { link_text: 'OTT Plans', link_url: 'ott-plans' },
                { link_text: 'Fiber Internet', link_url: 'fiber' },
                { link_text: 'Mobiles & Gadgets', link_url: 'mobiles' },
                { link_text: 'Electronics', link_url: 'electronics' },
                { link_text: 'Offers', link_url: 'offers' },
                { link_text: 'Contact Us', link_url: 'contact' }
              ]).map((link, idx) => (
                <li key={idx}>
                  <button 
                    onClick={() => onNavClick(link.link_url || 'home')}
                    className="hover:text-[#008744] transition-colors text-left font-medium"
                  >
                    {link.link_text}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Customer Support */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Customer Support</h3>
            <ul className="space-y-2 text-xs">
              {(supportLinks.length > 0 ? supportLinks : [
                { link_text: 'Contact Us', link_url: 'contact' },
                { link_text: 'How to Order', link_url: 'home' }
              ]).map((item, idx) => (
                <li key={idx}>
                  <button 
                    onClick={() => onNavClick(item.link_url || 'home')}
                    className="hover:text-white transition-colors text-left font-medium"
                  >
                    {item.link_text}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact Us & Newsletter */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Contact Us</h3>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#e50914] shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${phone}`} className="hover:text-white">{phone} {secondaryPhone ? `/ ${secondaryPhone}` : ''}</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <a href={`mailto:${emailAddr}`} className="hover:text-white">{emailAddr}</a>
              </div>
            </div>

            {/* Newsletter Form */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-200 mb-2">Newsletter</h4>
              <p className="text-[11px] text-slate-400 mb-2">Subscribe to get latest offers and smart deals.</p>
              
              {subscribed ? (
                <div className="bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs p-2 rounded-lg font-bold">
                  ✓ Thank you for subscribing!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex items-center gap-1.5">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#e50914]"
                  />
                  <button
                    type="submit"
                    className="bg-[#008744] hover:bg-emerald-600 text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors shrink-0"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} {businessName}. All Rights Reserved.</p>
          <p className="text-amber-400 font-medium italic">{footerQuote}</p>
        </div>

      </div>
    </footer>
  );
}
