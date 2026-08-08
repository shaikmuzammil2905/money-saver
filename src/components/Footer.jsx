import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, Facebook, Instagram, Youtube } from 'lucide-react';

export default function Footer({ onNavClick }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

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
                src="/image.png" 
                alt="OTTMoneySaver Logo" 
                className="h-10 md:h-12 object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
              <span className="text-xl md:text-2xl font-black text-white">
                <span className="text-brand-red">OTT</span>Money<span className="text-brand-green">Saver</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Save Money Smartly. Enjoy More. OTT subscriptions, high-speed fiber internet, smartphones, gadgets, and electronics at unbeatable prices.
            </p>

            <div className="text-xs text-amber-400 font-semibold italic">
              "We compromise on Money but not in Service."
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2 text-xs">
              {['Home', 'OTT Plans', 'Fiber Internet', 'Mobiles & Gadgets', 'Electronics', 'Offers', 'Contact Us'].map((link, idx) => (
                <li key={idx}>
                  <button 
                    onClick={() => onNavClick(link.toLowerCase().replace(/\s+/g, '-'))}
                    className="hover:text-brand-green transition-colors text-left"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Customer Support */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Customer Support</h3>
            <ul className="space-y-2 text-xs">
              {['About Us', "FAQ's", 'Shipping & Delivery', 'Returns & Refunds', 'Terms & Conditions', 'Privacy Policy'].map((item, idx) => (
                <li key={idx}>
                  <a href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact Us & Newsletter */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Contact Us</h3>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                <span>Hyderabad, Telangana, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="tel:6305151531" className="hover:text-white">6305151531 / 7013931261</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <a href="mailto:Ottmoneysaver@gmail.com" className="hover:text-white">Ottmoneysaver@gmail.com</a>
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
                    className="w-full bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-brand-red"
                  />
                  <button
                    type="submit"
                    className="bg-brand-green hover:bg-brand-greenHover text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-slate-900 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-900 hover:bg-pink-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-900 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>

          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2025 OTTMoneySaver. All Rights Reserved.</p>
          <p className="text-amber-400 font-medium">"We compromise on Money but not in Service."</p>
        </div>

      </div>
    </footer>
  );
}
