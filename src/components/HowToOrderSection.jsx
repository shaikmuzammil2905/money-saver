import React from 'react';
import { ShoppingBag, ArrowRight, CheckCircle2, MessageCircle, CreditCard, ShieldCheck } from 'lucide-react';

export default function HowToOrderSection({ onStartShopping }) {
  const steps = [
    { num: 1, title: 'Select Product', desc: 'Browse Internet Fiber, OTT Plans, Mobiles or Gadgets.' },
    { num: 2, title: 'Add to Cart', desc: 'Click Add to Cart / Quick Add on your chosen item.' },
    { num: 3, title: 'Open Cart', desc: 'Click the shopping cart icon at the top or bottom nav.' },
    { num: 4, title: 'Login or Register', desc: 'Enter your Full Name, Mobile Number & Address.' },
    { num: 5, title: 'Customer Details', desc: 'Verify your delivery location and contact number.' },
    { num: 6, title: 'Order Summary', desc: 'Review your product list, subtotals and smart savings.' },
    { num: 7, title: 'Pay via GPay/PhonePe', desc: 'Click Pay with Google Pay or PhonePe to transfer funds.' },
    { num: 8, title: 'Upload Screenshot', desc: 'Upload your payment receipt image for verification.' },
    { num: 9, title: 'Click "Open WhatsApp"', desc: 'Click the green WhatsApp button at checkout.' },
    { num: 10, title: 'Send Order Message', desc: 'Send the auto-generated order details on WhatsApp!' }
  ];

  return (
    <section className="py-10 bg-slate-900 text-white font-sans border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-400 text-xs font-black uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5" /> Easy 10-Step Guide
          </span>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
            How To Order <span className="text-[#008744]">On OTTMoneySaver</span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Ordering is simple, fast, and 100% secure. Follow these steps to complete your purchase!
          </p>
        </div>

        {/* Step Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all group"
            >
              <div>
                <div className="w-8 h-8 rounded-xl bg-[#008744]/20 border border-[#008744]/40 text-[#008744] font-black text-xs flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  #{step.num}
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white mb-1 line-clamp-1">
                  {step.title}
                </h4>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-8 p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-red-600/20 via-slate-950 to-emerald-600/20 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#008744] text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-700/30">
              <MessageCircle className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white">Need Help Placing Your Order?</h3>
              <p className="text-xs text-slate-400">Our customer support team is available on WhatsApp 24/7.</p>
            </div>
          </div>

          <button
            onClick={onStartShopping}
            className="px-6 py-3 rounded-xl bg-[#008744] hover:bg-[#007038] text-white font-bold text-xs shadow-lg shadow-emerald-700/20 transition-all flex items-center gap-2 shrink-0 active:scale-95"
          >
            <span>Start Shopping Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
