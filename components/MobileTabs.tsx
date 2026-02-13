
import React from 'react';
import { Home, Search, LayoutGrid, User, ScanSearch } from 'lucide-react';
import { cn } from '../lib/utils';

interface MobileTabsProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const MobileTabs: React.FC<MobileTabsProps> = ({ currentPage, onNavigate }) => {
  const tabs = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'search', label: 'Busca', icon: Search },
    { id: 'ia', label: 'Pinout', icon: ScanSearch },
    { id: 'categories', label: 'Setores', icon: LayoutGrid },
    { id: 'dashboard', label: 'Perfil', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2 pointer-events-none">
      <div className="max-w-md mx-auto bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-2xl flex items-center justify-around p-2 pointer-events-auto">
        {tabs.map((tab) => {
          const isActive = currentPage === tab.id;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center flex-1 py-2 rounded-2xl transition-all duration-300 relative overflow-hidden",
                isActive ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-xl transition-all duration-300",
                isActive ? "bg-blue-50 scale-110" : ""
              )}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-tighter mt-1 transition-all",
                isActive ? "opacity-100 transform translate-y-0" : "opacity-70"
              )}>
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileTabs;
