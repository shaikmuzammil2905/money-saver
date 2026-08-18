import React from 'react';
import { Gift, Sparkles, ShieldCheck, Rocket } from 'lucide-react';

export default function ReferEarnManager() {
  return (
    <div className="space-y-6 font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Gift className="w-6 h-6 text-amber-400" /> Refer &amp; Earn Program
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Customer Referral &amp; Reward System.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-12 text-center max-w-2xl mx-auto shadow-2xl space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-950/80 border border-amber-800/80 text-amber-400 flex items-center justify-center mx-auto shadow-xl">
          <Rocket className="w-8 h-8 animate-pulse" />
        </div>

        <h2 className="text-2xl font-black text-white tracking-tight">Refer &amp; Earn Module — Coming Soon</h2>
        
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
          The automated customer referral codes, commission tracking, and cashback reward system module is scheduled for future release.
        </p>

        <div className="pt-2">
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-950/60 border border-amber-800/60 text-amber-300 font-extrabold text-xs">
            <Sparkles className="w-4 h-4 text-amber-400" /> System Placeholder Active
          </span>
        </div>
      </div>
    </div>
  );
}
