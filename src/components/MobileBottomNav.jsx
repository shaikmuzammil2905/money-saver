import React from 'react';
import { Home, Tag, Compass } from 'lucide-react';

export default function MobileBottomNav({ 
  activeTab, 
  setActiveTab
}) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'offers', label: 'Offers', icon: Tag },
    { id: 'view-all', label: 'All OTTs', icon: Compass },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 py-2 flex items-center justify-around font-sans">
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`relative flex flex-col items-center gap-1 py-1 px-5 rounded-2xl transition-all duration-200 ${
              isActive 
                ? 'text-[#e50914] font-extrabold scale-105' 
                : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <div className={`p-1 rounded-xl transition-colors ${isActive ? 'bg-red-50 text-[#e50914]' : ''}`}>
              <IconComponent className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[11px] tracking-tight">{tab.label}</span>
            {isActive && (
              <span className="absolute -bottom-1 w-5 h-1 bg-[#e50914] rounded-full" />
            )}
          </button>
        );
      })}
    </nav>
  );
}

