
import React from 'react';
import { ClassicalPiece, SubscriptionTier } from '../types';
import { Calendar, ChevronRight, Lock, Music } from 'lucide-react';

interface HistoryListProps {
  items: ClassicalPiece[];
  tier: SubscriptionTier;
  onSelect: (piece: ClassicalPiece) => void;
  onUpgrade: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ items, tier, onSelect, onUpgrade }) => {
  const isPremium = tier === SubscriptionTier.PREMIUM;
  const visibleLimit = isPremium ? 100 : 3;

  if (items.length === 0) {
    return (
      <div className="text-center py-32 bg-stone-50 rounded-[3rem] border-2 border-dashed border-stone-100 max-w-4xl mx-auto">
        <Calendar className="w-12 h-12 text-stone-200 mx-auto mb-6" />
        <p className="text-stone-400 font-serif italic text-lg">The archives are currently silent.</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700 max-w-4xl mx-auto">
      <div className="flex justify-between items-end mb-12 border-b border-stone-100 pb-6">
        <h3 className="text-4xl font-serif text-stone-900 font-bold">The Archives</h3>
        {!isPremium && (
          <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Showing 3 of {items.length} items</span>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {items.map((piece, index) => {
          const isLocked = index >= visibleLimit;
          
          return (
            <div 
              key={piece.id}
              onClick={() => isLocked ? onUpgrade() : onSelect(piece)}
              className={`group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl border border-stone-50 transition-all cursor-pointer flex h-36 relative
                ${isLocked ? 'grayscale opacity-60' : ''}`}
            >
              {isLocked && (
                <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-10 flex items-center justify-center">
                  <div className="bg-stone-900 text-[#9A84A1] p-3 rounded-full shadow-xl">
                    <Lock className="w-4 h-4" />
                  </div>
                </div>
              )}
              
              <div className="w-32 flex-shrink-0 bg-stone-900 flex items-center justify-center text-[#9A84A1] overflow-hidden">
                <Music className="w-8 h-8 opacity-20" />
              </div>
              <div className="flex-grow p-8 flex flex-col justify-center min-w-0">
                <span className="text-[9px] text-[#9A84A1] font-black uppercase tracking-[0.2em] mb-2">{piece.date}</span>
                <h4 className="text-xl font-bold text-stone-900 serif truncate mb-1">{piece.title}</h4>
                <p className="text-stone-400 font-black uppercase tracking-widest text-[9px] truncate">{piece.composer}</p>
              </div>
              <div className="pr-6 flex items-center">
                <ChevronRight className="w-5 h-5 text-stone-100 group-hover:text-stone-900 transition" />
              </div>
            </div>
          );
        })}
      </div>

      {!isPremium && items.length > 3 && (
        <div className="mt-20 p-16 bg-stone-900 rounded-[3rem] text-center shadow-2xl">
          <h4 className="text-2xl font-serif text-white mb-4">Historical Full Access</h4>
          <p className="text-stone-400 mb-10 max-w-sm mx-auto text-sm leading-relaxed">아카이브의 모든 기록({items.length}곡)을 프리미엄 구독으로 자유롭게 탐색하세요.</p>
          <button onClick={onUpgrade} className="px-12 py-5 bg-[#9A84A1] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white hover:text-stone-900 shadow-xl transition">Unlock Archive</button>
        </div>
      )}
    </div>
  );
};