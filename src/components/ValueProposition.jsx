import React from 'react';
import { Award, Percent, Box, ShieldCheck } from 'lucide-react';
import { VALUE_PROPOSITIONS } from '../data/products';

export default function ValueProposition() {
  const iconMap = {
    Award: <Award className="w-7 h-7 text-amber-600" />,
    Percent: <Percent className="w-7 h-7 text-brand-red" />,
    Box: <Box className="w-7 h-7 text-amber-700" />,
    ShieldCheck: <ShieldCheck className="w-7 h-7 text-blue-600" />,
  };

  return (
    <section className="py-12 bg-slate-50 border-t border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans">
            Why Choose <span className="text-brand-red">OTT</span>Money<span className="text-brand-green">Saver</span>?
          </h2>
        </div>

        {/* 4-Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUE_PROPOSITIONS.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex items-start gap-4"
            >
              <div className={`p-3.5 rounded-2xl border flex items-center justify-center shrink-0 ${item.badgeColor}`}>
                {iconMap[item.iconName]}
              </div>

              <div>
                <h3 className="font-extrabold text-base text-slate-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
