import React from 'react';
import { 
  Phone, MessageCircle, Mail, MessageSquare, Instagram, Send, Globe, MapPin, Sparkles, CheckCircle2 
} from 'lucide-react';
import { useCMS, DEFAULT_SUPPORT_CARDS } from '../context/CMSContext';

export default function NeedHelpSection({ onOpenWhatsApp }) {
  const { supportCards, siteSettings } = useCMS();

  const activeCards = (supportCards && supportCards.length > 0)
    ? supportCards.filter(c => c.is_active !== false)
    : DEFAULT_SUPPORT_CARDS;

  const sectionTitle = siteSettings?.need_help_title || 'Need Help Finding the Best Deal?';
  const sectionSubtitle = siteSettings?.need_help_subtitle || 'Our expert support team is available 24/7 to assist you.';

  const renderIcon = (iconName, color = '#0f172a') => {
    const props = { className: 'w-6 h-6 shrink-0', style: { color } };
    switch ((iconName || '').toLowerCase()) {
      case 'phone': return <Phone {...props} />;
      case 'messagecircle': return <MessageCircle {...props} className="w-6 h-6 fill-current" />;
      case 'messagesquare': return <MessageSquare {...props} className="w-6 h-6 fill-current" />;
      case 'mail': return <Mail {...props} />;
      case 'instagram': return <Instagram {...props} />;
      case 'send':
      case 'telegram': return <Send {...props} />;
      case 'globe': return <Globe {...props} />;
      case 'mappin': return <MapPin {...props} />;
      case 'checkcircle': return <CheckCircle2 {...props} />;
      default: return <Sparkles {...props} />;
    }
  };

  const handleCardClick = (card) => {
    const link = card.link || '';
    if (link) {
      if (link.startsWith('tel:') || link.startsWith('mailto:')) {
        window.location.href = link;
      } else if (link.startsWith('http')) {
        window.open(link, '_blank');
      } else {
        window.open(`https://${link}`, '_blank');
      }
    } else if (typeof onOpenWhatsApp === 'function') {
      onOpenWhatsApp();
    }
  };

  return (
    <section id="contact" className="py-12 bg-slate-50 border-t border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans">
            {sectionTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {sectionSubtitle}
          </p>
        </div>

        {/* Dynamic Support Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          {activeCards.map((card, idx) => (
            <div
              key={card.id || idx}
              onClick={() => handleCardClick(card)}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-all flex items-center gap-4 group cursor-pointer"
            >
              <div 
                style={{ backgroundColor: `${card.color || '#6366f1'}15` }}
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
              >
                {renderIcon(card.icon, card.color || '#4f46e5')}
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-sm font-black text-slate-900 truncate group-hover:text-purple-600 transition-colors">
                  {card.value || card.title}
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                  {card.title}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
