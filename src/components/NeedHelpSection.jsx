import React from 'react';
import { Phone, MessageCircle, Mail, MessageSquare } from 'lucide-react';

export default function NeedHelpSection({ onOpenWhatsApp }) {
  return (
    <section id="contact" className="py-12 bg-slate-50 border-t border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans">
            Need Help Finding the Best Deal?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Our expert support team is available 24/7 to assist you.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          
          {/* Card 1: Call */}
          <a
            href="tel:6305151531"
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 group-hover:bg-brand-red group-hover:text-white transition-colors">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base font-extrabold text-slate-900 group-hover:text-brand-red transition-colors">
                6305151531
              </div>
              <div className="text-xs text-slate-500 font-medium">Call Us</div>
            </div>
          </a>

          {/* Card 2: WhatsApp */}
          <button
            onClick={onOpenWhatsApp}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <MessageCircle className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
                6305151531
              </div>
              <div className="text-xs font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
                7013931261
              </div>
              <div className="text-[11px] text-slate-500 font-medium">WhatsApp Us</div>
            </div>
          </button>

          {/* Card 3: Email */}
          <a
            href="mailto:Ottmoneysaver@gmail.com"
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group"
          >
            <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors">
              <Mail className="w-6 h-6" />
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-extrabold text-slate-900 truncate group-hover:text-sky-600 transition-colors">
                Ottmoneysaver@gmail.com
              </div>
              <div className="text-[11px] text-slate-500 font-medium">Email Us</div>
            </div>
          </a>

          {/* Card 4: Chat on WhatsApp CTA */}
          <button
            onClick={onOpenWhatsApp}
            className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-emerald-50 border-2 border-emerald-600 text-emerald-600 hover:text-emerald-700 font-extrabold text-sm shadow-sm transition-all flex items-center justify-center gap-2 group"
          >
            <MessageSquare className="w-5 h-5 fill-current" />
            <span>Chat on WhatsApp</span>
          </button>

        </div>

      </div>
    </section>
  );
}
