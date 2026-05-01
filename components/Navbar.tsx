import React from 'react';
import { ViewState, SubscriptionTier } from '../types';
import { Music, Calendar, PenTool, CheckSquare, Heart, Ticket, Users, Asterisk } from 'lucide-react';

interface NavbarProps {
  activeView: ViewState;
  setView: (view: ViewState) => void;
  tier: SubscriptionTier;
}

export const Navbar: React.FC<NavbarProps> = ({ activeView, setView, tier }) => {
  const links = [
    { id: ViewState.CURATE, label: "스튜디오", icon: PenTool },
    { id: ViewState.HOME, label: '오늘의 곡', icon: CheckSquare },
    { id: ViewState.PERFORMANCES, label: '공연 정보', icon: Ticket },
    { id: ViewState.MY_COLLECTION, label: '보관함', icon: Heart },
    { id: ViewState.COMMUNITY, label: '라운지', icon: Users },
    { id: ViewState.HISTORY, label: '아카이브', icon: Calendar },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-4">
      <div className="max-w-6xl mx-auto glass px-8 py-3 border border-stone-200 shadow-premium flex justify-between items-center">
        <div 
          className="flex items-center space-x-4 cursor-pointer group" 
          onClick={() => setView(ViewState.CURATE)}
        >
          <div className="w-9 h-9 bg-stone-900 flex items-center justify-center text-white transition-all duration-700 group-hover:bg-[#9A84A1]">
            <Asterisk className="w-5 h-5" />
          </div>
          <span className="text-xl font-logo font-black text-black tracking-tight hidden sm:block">Kyth</span>
        </div>

        <div className="flex items-center space-x-1">
          {links.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={`flex items-center space-x-3 px-5 py-2 transition-all duration-300 text-[11px] font-bold tracking-tight
                ${activeView === id 
                  ? 'bg-stone-900 text-white shadow-xl' 
                  : 'text-stone-400 hover:text-stone-900 hover:bg-stone-50'}`}
            >
              <Icon className={`w-4 h-4 ${id === ViewState.MY_COLLECTION && activeView === id ? 'fill-white' : ''}`} />
              <span className="hidden lg:inline">{label}</span>
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center space-x-3 text-[9px] font-black text-stone-300 uppercase tracking-widest border-l border-stone-100 pl-6">
           <span className="text-[#9A84A1]">실시간</span>
           <span>2025 에디션</span>
        </div>
      </div>
    </nav>
  );
};