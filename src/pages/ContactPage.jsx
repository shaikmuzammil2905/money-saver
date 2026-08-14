import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Clock, Send, CheckCircle2, HelpCircle } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export default function ContactPage({ onOpenWhatsApp }) {
  const { contactDetails } = useCMS();
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const phoneDisplay = contactDetails?.phone || '6305151531';
  const emailDisplay = contactDetails?.email || 'support@ottmoneysaver.com';
  const addressDisplay = contactDetails?.address || 'Hyderabad, Telangana, India';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', phone: '', email: '', message: '' });
      setSubmitted(false);
    }, 4000);
  };

  const faqs = [
    {
      q: 'How fast do I receive my OTT subscription login details?',
      a: 'All OTT subscriptions are activated instantly within 5 to 15 minutes of order placement via WhatsApp and SMS.'
    },
    {
      q: 'Are the high-speed fiber internet plans truly unlimited?',
      a: 'Yes, all our high-speed broadband fiber plans offer 100% truly unlimited data downloads and uploads with symmetric gigabit speeds.'
    },
    {
      q: 'What is your customer support contact number?',
      a: 'You can reach our dedicated support team 24/7 at +91 6305151531 or chat directly via WhatsApp.'
    },
    {
      q: 'Do smartphones & gadgets come with official brand warranty?',
      a: 'Yes, 100% of physical products and mobile devices sold on OTTMoneySaver come with original manufacturer GST invoice and brand warranty.'
    }
  ];

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
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-[#e50914] shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold uppercase text-slate-400">Phone Hotline</h4>
              <a href="tel:6305151531" className="text-base font-black text-slate-900 hover:text-[#e50914] block mt-0.5">
                6305151531
              </a>
              <p className="text-[11px] text-slate-500 mt-1">Mon - Sun: 24 Hours Active</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
              <MessageCircle className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold uppercase text-slate-400">WhatsApp Chat</h4>
              <button onClick={onOpenWhatsApp} className="text-base font-black text-emerald-600 hover:underline block mt-0.5">
                Instant Chat →
              </button>
              <p className="text-[11px] text-slate-500 mt-1">Average reply in 2 mins</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold uppercase text-slate-400">Office Location</h4>
              <span className="text-sm font-black text-slate-900 block mt-0.5">
                Hyderabad, Telangana
              </span>
              <p className="text-[11px] text-slate-500 mt-1">India - 500001</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold uppercase text-slate-400">Support Hours</h4>
              <span className="text-sm font-black text-slate-900 block mt-0.5">
                24/7 Everyday
              </span>
              <p className="text-[11px] text-slate-500 mt-1">Including Holidays</p>
            </div>
          </div>
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
                  className="w-full py-3 bg-[#e50914] hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-600/30 transition-colors flex items-center justify-center gap-2"
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
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
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
