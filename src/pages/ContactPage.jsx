import React, { useState } from 'react';
import { 
  Mail, Phone, MapPin, MessageCircle, Clock, Send, CheckCircle2, HelpCircle, Globe, Instagram, MessageSquare, Sparkles 
} from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export default function ContactPage({ onOpenWhatsApp }) {
  const { contactDetails, contactCards, faqs, siteSettings } = useCMS();
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const phoneDisplay = contactDetails?.phone || siteSettings?.phone || '6305151531';
  const whatsappDisplay = contactDetails?.whatsapp || siteSettings?.whatsapp || '6305151531';
  const emailDisplay = contactDetails?.email || siteSettings?.email || 'support@ottmoneysaver.com';
  const addressDisplay = contactDetails?.address || siteSettings?.address || 'Hyderabad, Telangana, India';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', phone: '', email: '', message: '' });
      setSubmitted(false);
    }, 4000);
  };

  const activeCards = (Array.isArray(contactCards) && contactCards.length > 0)
    ? contactCards
        .filter(c => c.is_active !== false)
        .map(c => {
          let val = c.value;
          let link = c.link;

          const titleUpper = (c.title || '').toUpperCase();
          if (titleUpper.includes('PHONE') || titleUpper.includes('HOTLINE') || titleUpper.includes('CALL')) {
            if (!val || val === '6305151531') {
              val = phoneDisplay;
            }
            if (!link || link === 'tel:6305151531') {
              link = `tel:${val}`;
            }
          } else if (titleUpper.includes('WHATSAPP') || titleUpper.includes('CHAT')) {
            if (!link || link.includes('916305151531')) {
              link = `https://wa.me/91${whatsappDisplay.replace(/\D/g, '')}`;
            }
          } else if (titleUpper.includes('LOCATION') || titleUpper.includes('OFFICE') || titleUpper.includes('ADDRESS')) {
            if (!val || val === 'Hyderabad, Telangana' || val === 'Hyderabad, Telangana, India') {
              val = addressDisplay;
            }
          }
          return {
            ...c,
            value: val,
            link: link
          };
        })
    : [
        { id: 'cpc_1', title: 'PHONE HOTLINE', value: phoneDisplay, subtitle: 'Mon - Sun: 24 Hours Active', link: `tel:${phoneDisplay}`, icon: 'Phone', color: '#e50914' },
        { id: 'cpc_2', title: 'WHATSAPP CHAT', value: 'Instant Chat →', subtitle: 'Average reply in 2 mins', link: `https://wa.me/91${whatsappDisplay.replace(/\D/g, '')}`, icon: 'MessageCircle', color: '#059669' },
        { id: 'cpc_3', title: 'OFFICE LOCATION', value: addressDisplay, subtitle: 'India - 500001', link: '', icon: 'MapPin', color: '#d97706' },
        { id: 'cpc_4', title: 'SUPPORT HOURS', value: '24/7 Everyday', subtitle: 'Including Holidays', link: '', icon: 'Clock', color: '#0284c7' }
      ];

  const activeFaqs = Array.isArray(faqs) && faqs.length > 0 
    ? faqs.filter(f => f.is_active !== false)
    : [
        {
          id: 'faq_1',
          q: 'How fast do I receive my OTT subscription login details?',
          a: 'All OTT subscriptions are activated instantly within 5 to 15 minutes of order placement via WhatsApp and SMS.'
        },
        {
          id: 'faq_2',
          q: 'Are the high-speed fiber internet plans truly unlimited?',
          a: 'Yes, all our high-speed broadband fiber plans offer 100% truly unlimited data downloads and uploads with symmetric gigabit speeds.'
        },
        {
          id: 'faq_3',
          q: 'What is your customer support contact number?',
          a: 'You can reach our dedicated support team 24/7 at +91 6305151531 or chat directly via WhatsApp.'
        },
        {
          id: 'faq_4',
          q: 'Do smartphones & gadgets come with official brand warranty?',
          a: 'Yes, 100% of physical products and mobile devices sold on OTTMoneySaver come with original manufacturer GST invoice and brand warranty.'
        }
      ];

  const renderIcon = (iconName, color = '#e50914') => {
    const props = { className: 'w-6 h-6 shrink-0', style: { color } };
    switch ((iconName || '').toLowerCase()) {
      case 'phone': return <Phone {...props} />;
      case 'messagecircle': return <MessageCircle {...props} className="w-6 h-6 shrink-0 fill-current" />;
      case 'messagesquare': return <MessageSquare {...props} />;
      case 'mappin': return <MapPin {...props} />;
      case 'clock': return <Clock {...props} />;
      case 'mail': return <Mail {...props} />;
      case 'globe': return <Globe {...props} />;
      case 'instagram': return <Instagram {...props} />;
      default: return <Sparkles {...props} />;
    }
  };

  const handleCardClick = (card) => {
    if (!card.link) return;
    if (card.link.startsWith('http') || card.link.startsWith('tel:') || card.link.startsWith('mailto:')) {
      window.open(card.link, '_blank');
    } else {
      window.location.href = card.link;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner */}
        <div className="relative rounded-3xl bg-slate-950 text-white p-6 sm:p-10 mb-10 border border-slate-800 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(229,9,20,0.3),transparent_60%)] pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950 border border-red-600/60 text-[#e50914] text-xs font-black uppercase tracking-wider">
              <Phone className="w-3.5 h-3.5" /> 24/7 Customer Support
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight">
              Get in Touch <span className="text-[#e50914]">With OTTMoneySaver</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Have questions about an OTT subscription, Fiber broadband installation, or physical gadget order? Our support team is here to assist you 24/7.
            </p>
          </div>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {activeCards.map((card, idx) => (
            <div 
              key={card.id || idx} 
              onClick={() => handleCardClick(card)}
              className={`bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4 transition-all ${card.link ? 'cursor-pointer hover:shadow-md hover:border-slate-300 hover:scale-[1.02]' : ''}`}
            >
              <div 
                style={{ backgroundColor: `${card.color || '#e50914'}15`, borderColor: `${card.color || '#e50914'}30` }}
                className="w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0"
              >
                {renderIcon(card.icon, card.color || '#e50914')}
              </div>
              <div className="overflow-hidden">
                <h4 className="text-xs font-extrabold uppercase text-slate-400">{card.title}</h4>
                <div className="text-sm sm:text-base font-black text-slate-900 truncate mt-0.5" style={{ color: card.link ? (card.color || '#0f172a') : undefined }}>
                  {card.value}
                </div>
                {card.subtitle && <p className="text-[11px] text-slate-500 mt-1">{card.subtitle}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form & FAQ Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 mb-2">Send Us a Direct Message</h3>
            <p className="text-xs text-slate-500 mb-6">Fill out the form below and our team will get back to you immediately.</p>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-base">Message Sent Successfully!</h4>
                <p className="text-xs text-emerald-700">Thank you. Our support agent will call or WhatsApp you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#e50914]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone / WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 6305151531"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#e50914]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#e50914]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Message / Order Query</label>
                  <textarea
                    rows={4}
                    placeholder="How can we help you today?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-900 focus:outline-none focus:border-[#e50914]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#e50914] hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-600/30 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </form>
            )}
          </div>

          {/* FAQ Accordion */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#e50914]" /> Frequently Asked Questions
              </h3>

              <div className="space-y-3">
                {activeFaqs.map((faq, index) => (
                  <div key={faq.id || index} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                    <h4 className="text-xs font-bold text-slate-900 mb-1">{faq.q}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
