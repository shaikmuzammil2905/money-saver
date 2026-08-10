import React from 'react';
import { Wifi, Zap, ShieldCheck, CheckCircle2, ShoppingCart, MessageCircle, ArrowRight, Gauge, Cpu, Phone } from 'lucide-react';

const FIBER_PLANS = [
  {
    id: 'fiber-100mbps-starter',
    title: '100 Mbps Unlimited Fiber',
    subtitle: 'High-Speed Broadband + Free Dual-Band Wi-Fi Router',
    speed: '100 Mbps',
    price: 499,
    originalPrice: 799,
    discount: '38% OFF',
    validity: 'Monthly',
    rating: 4.7,
    reviewsCount: 1840,
    features: [
      '100 Mbps Symmetric Upload & Download',
      'Truly Unlimited Data (No FUP Limit)',
      'Free Dual-Band Gigabit Wi-Fi Router',
      'Free Installation & Setup Service',
      'Free Landline Unlimited Calling'
    ],
    ottIncluded: ['Disney+ Hotstar', 'ZEE5', 'SonyLIV']
  },
  {
    id: 'fiber-200mbps-entertainment',
    title: '200 Mbps Fiber + 12 OTT Combo',
    subtitle: 'All-in-One Home Entertainment Pack',
    speed: '200 Mbps',
    price: 899,
    originalPrice: 1499,
    discount: '40% OFF',
    validity: 'Monthly',
    rating: 4.9,
    reviewsCount: 4120,
    badge: 'Most Popular',
    features: [
      '200 Mbps Speed for 4K Streaming & Gaming',
      'Includes 12 Premium OTT Apps (Netflix, Prime, Hotstar)',
      'Free Wi-Fi 6 Mesh Ready Gigabit Router',
      'Zero Lag Online Multiplayer Gaming',
      'Priority 24/7 VIP Customer Support'
    ],
    ottIncluded: ['Netflix', 'Prime Video', 'Hotstar', 'ZEE5', 'SonyLIV', 'Voot', 'Aha', 'Hoichoi']
  },
  {
    id: 'fiber-300mbps-ultra',
    title: '300 Mbps Ultra Fiber Pack',
    subtitle: 'Pro Heavy Usage & 4K Family Streaming',
    speed: '300 Mbps',
    price: 1199,
    originalPrice: 1999,
    discount: '40% OFF',
    validity: 'Monthly',
    rating: 4.9,
    reviewsCount: 2150,
    features: [
      '300 Mbps Lightning Fast Speed',
      'Includes 16 Premium OTT Apps including Netflix 4K',
      'Free Dual-Band Wi-Fi 6 Router',
      'Connect up to 20+ Smart Devices simultaneously',
      'Symmetric 300 Mbps Upload Speed'
    ],
    ottIncluded: ['Netflix 4K', 'Amazon Prime', 'Disney+ Hotstar', 'ZEE5', 'SonyLIV', 'Apple TV+']
  },
  {
    id: 'fiber-1gbps-gigabit',
    title: '1 Gbps Ultra Gigabit Fiber',
    subtitle: 'Ultimate Speed for Smart Homes & Creator Studios',
    speed: '1 Gbps (1000 Mbps)',
    price: 2499,
    originalPrice: 3999,
    discount: '38% OFF',
    validity: 'Monthly',
    rating: 5.0,
    reviewsCount: 890,
    badge: 'Ultimate Gigabit',
    features: [
      '1000 Mbps Ultra High Speed Fiber Connection',
      'Complete OTT Master Pack (All 20+ Apps included)',
      'Free Dual Mesh Router System included',
      'Dedicated Static IP Address on Request',
      '99.99% Uptime Guarantee with SLA'
    ],
    ottIncluded: ['All 20+ OTT Subscription Apps Included']
  }
];

export default function FiberInternetPage({ onAddToCart, onOpenWhatsApp }) {
  return (
    <div className="min-h-screen bg-slate-50 py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Header */}
        <div className="relative rounded-3xl bg-slate-950 text-white p-6 sm:p-10 mb-10 border border-slate-800 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(14,165,233,0.3),transparent_60%)] pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-950 border border-sky-500/60 text-sky-400 text-xs font-black uppercase tracking-wider">
              <Wifi className="w-3.5 h-3.5" /> High-Speed Fiber Broadband
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight">
              Ultra Fast Fiber Broadband <span className="text-sky-400">&amp; OTT Bundles</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Experience seamless 4K streaming, zero-ping online gaming, and lightning fast downloads. All plans include free dual-band Wi-Fi router, zero installation charges, and bundled OTT platforms!
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOpenWhatsApp}
                className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-sky-500/30 transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Check Fiber Availability in Your Area</span>
              </button>
              <a
                href="tel:6305151531"
                className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 hover:border-slate-500 transition-all"
              >
                <Phone className="w-4 h-4 text-sky-400" />
                <span>Call Hotline: 6305151531</span>
              </a>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shrink-0">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Symmetric Speeds</h4>
              <p className="text-xs text-slate-500 mt-0.5">Equal 100% upload and download speeds guaranteed.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Free Gigabit Router</h4>
              <p className="text-xs text-slate-500 mt-0.5">Includes free high power dual-band Wi-Fi router.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Zero Installation Fee</h4>
              <p className="text-xs text-slate-500 mt-0.5">No setup fees on 3, 6, or 12 month subscriptions.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">99.9% Uptime SLA</h4>
              <p className="text-xs text-slate-500 mt-0.5">Reliable optic fiber network infrastructure.</p>
            </div>
          </div>
        </div>

        {/* Fiber Plans Cards Grid */}
        <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
          <Wifi className="w-6 h-6 text-sky-500" /> Choose Your Fiber Internet Plan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FIBER_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-3xl border ${plan.badge ? 'border-sky-500 shadow-lg shadow-sky-500/10' : 'border-slate-200/90 shadow-sm'} p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden`}
            >
              {plan.badge && (
                <div className="absolute top-0 right-0 bg-sky-500 text-white text-[10px] font-black uppercase px-4 py-1 rounded-bl-xl shadow">
                  {plan.badge}
                </div>
              )}

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-extrabold text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                    ⚡ {plan.speed}
                  </span>
                  <span className="text-xs font-bold text-slate-400">Unlimited Data</span>
                </div>

                <h3 className="text-xl font-black text-slate-900 leading-snug mb-1">
                  {plan.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium mb-4">{plan.subtitle}</p>

                {/* Pricing Box */}
                <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-200/80 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-slate-400 line-through mr-2 font-medium">
                      ₹{plan.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-3xl font-black text-slate-900">
                      ₹{plan.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500 font-bold ml-1">/ month</span>
                  </div>
                  <span className="text-xs font-extrabold text-white bg-[#e50914] px-2.5 py-1 rounded-md">
                    {plan.discount}
                  </span>
                </div>

                {/* Features List */}
                <div className="space-y-2.5 mb-6">
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* OTT Apps Badges */}
                <div className="pt-2 mb-6">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">
                    Included OTT Subscriptions:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {plan.ottIncluded.map((ott, i) => (
                      <span key={i} className="text-[10px] font-extrabold text-slate-800 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                        {ott}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={onOpenWhatsApp}
                  className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" /> Book Installation
                </button>
                <button
                  onClick={() => onAddToCart(plan)}
                  className="py-3 px-4 rounded-xl bg-[#008744] hover:bg-[#007038] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/20 transition-colors"
                >
                  <ShoppingCart className="w-4 h-4 stroke-[2.5]" /> Subscribe Plan
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
