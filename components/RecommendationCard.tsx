
import React, { useState } from 'react';
import { ClassicalPiece, SubscriptionTier } from '../types';
import { Share2, Youtube, Quote, Info, Check, Copy, Lock, Sparkles, Crown, User, Heart, Play } from 'lucide-react';

interface RecommendationCardProps {
  piece: ClassicalPiece;
  tier: SubscriptionTier;
  onUpgrade: () => void;
  onSave: (p: ClassicalPiece) => void;
  isSaved: (id: string) => boolean;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ piece, tier, onUpgrade, onSave, isSaved }) => {
  const [copied, setCopied] = useState(false);
  const isPremium = tier === SubscriptionTier.PREMIUM;

  const handleShare = async () => {
    const shareText = `[Kyth Classical] ${piece.composer} - ${piece.title}\nListen: https://www.youtube.com/results?search_query=${encodeURIComponent(piece.youtubeQuery)}`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Kyth Classical', text: shareText, url: window.location.href }); } catch (err) {}
    } else {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-4xl mx-auto">
      <div className={`bg-white rounded-[2rem] overflow-hidden shadow-2xl border ${isPremium ? 'border-[#9A84A1]/30 shadow-[#9A84A1]/5' : 'border-stone-100'}`}>
        
        <div className="relative p-8 md:p-16 bg-stone-900 overflow-hidden min-h-[400px] flex flex-col justify-end">
          <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[120%] border border-[#9A84A1]/20 rounded-full rotate-45" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] border border-[#9A84A1]/10 rounded-full" />
          </div>
          
          <div className="relative z-10 flex justify-between items-end gap-8">
            <div className="flex-grow">
              <div className="flex items-center space-x-3 mb-6">
                <span className="px-3 py-1 bg-[#9A84A1] text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                  {piece.era}
                </span>
                <span className="text-stone-400 text-[10px] font-black uppercase tracking-widest">
                  Est. {piece.year}
                </span>
              </div>
              <h2 className="text-4xl md:text-7xl text-white font-serif font-bold leading-[1.1] mb-4">
                {piece.title}
              </h2>
              <p className="text-2xl md:text-4xl text-[#9A84A1] serif italic">
                {piece.composer}
              </p>
            </div>
            
            <button 
              onClick={() => onSave(piece)}
              className={`p-5 rounded-full shadow-2xl transition-all transform hover:scale-110 active:scale-95 mb-2
                ${isSaved(piece.id) ? 'bg-[#9A84A1] text-white' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`}
            >
              <Heart className={`w-8 h-8 ${isSaved(piece.id) ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        <div className="p-8 md:p-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            
            <section className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-900 shadow-inner">
                <User className="w-6 h-6 text-[#9A84A1]" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-stone-400 tracking-widest mb-1">RECOMMENDED SOLOIST</p>
                <h4 className="text-2xl font-bold text-stone-900">{piece.performer}</h4>
              </div>
            </section>

            <section>
              <div className="flex items-center space-x-3 text-stone-900 mb-8">
                <div className="w-1 h-8 bg-[#9A84A1]" />
                <h3 className="text-xs font-black uppercase tracking-[0.3em]">Program Notes</h3>
              </div>
              <p className="text-xl text-stone-900/80 leading-relaxed font-light first-letter:text-6xl first-letter:font-serif first-letter:text-stone-900 first-letter:mr-3 first-letter:float-left">
                {piece.description}
              </p>
            </section>

            <section className="relative">
              {!isPremium && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-md z-10 flex flex-col items-center justify-center p-8 text-center rounded-3xl border border-stone-100 shadow-sm">
                  <Lock className="w-10 h-10 text-[#9A84A1] mb-4" />
                  <h4 className="text-xl font-bold text-stone-900 uppercase tracking-tight">Full Archive Access</h4>
                  <p className="text-sm text-stone-500 mb-8 max-w-xs">프리미엄 회원은 작품의 시대적 배경과 음악 이론에 대한 심층 해설을 보실 수 있습니다.</p>
                  <button onClick={onUpgrade} className="px-10 py-4 bg-stone-900 text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-black shadow-lg transition">Unlock Premium</button>
                </div>
              )}
              <div className="bg-[#F4F2F5] p-10 rounded-3xl border border-stone-100">
                <div className="flex items-center space-x-3 text-stone-900 mb-6">
                  <Info className="w-5 h-5 text-[#9A84A1]" />
                  <h3 className="text-xs font-black uppercase tracking-widest">Maestro's Insight</h3>
                </div>
                <p className={`text-stone-900/80 italic leading-relaxed text-lg ${!isPremium ? 'blur-md select-none' : ''}`}>
                  {piece.funFact}
                </p>
              </div>
            </section>

            <div className="flex flex-wrap gap-4 pt-4">
              <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(piece.youtubeQuery)}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 px-10 py-5 bg-stone-900 text-white rounded-full transition-all shadow-xl hover:bg-black hover:-translate-y-1">
                <Play className="w-5 h-5 fill-[#9A84A1] text-[#9A84A1]" />
                <span className="font-black uppercase tracking-widest text-sm">Listen Now</span>
              </a>
              <button onClick={handleShare} className="flex items-center space-x-2 px-8 py-5 border border-stone-200 text-stone-900 rounded-full transition font-black uppercase tracking-widest text-xs hover:bg-stone-50">
                {copied ? <Check className="w-5 h-5 text-[#9A84A1]" /> : <Share2 className="w-5 h-5" />}
                <span>{copied ? 'Copied' : 'Share'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-8">
             <div className="bg-stone-50 border border-stone-100 p-8 rounded-[2.5rem]">
                <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-6">Atmosphere</h4>
                <div className="flex flex-wrap gap-2">
                  {piece.mood.split(',').map((m, i) => (
                    <span key={i} className="px-4 py-2 bg-white text-stone-900 text-[10px] rounded-xl border border-stone-100 font-black uppercase tracking-wider">
                      {m.trim()}
                    </span>
                  ))}
                </div>
             </div>

             {!isPremium ? (
               <div className="bg-[#9A84A1] text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                  <Sparkles className="absolute -top-4 -right-4 w-24 h-24 text-white/10 group-hover:rotate-12 transition-transform" />
                  <h4 className="text-[10px] font-black uppercase tracking-widest mb-4">Elite Tier</h4>
                  <h3 className="text-2xl font-serif font-bold mb-4 leading-tight">음악적 경험의 깊이를 더해보세요.</h3>
                  <button onClick={onUpgrade} className="w-full py-4 bg-stone-900 text-white font-black rounded-xl hover:bg-black transition text-xs uppercase tracking-widest shadow-xl">
                    Join Now
                  </button>
               </div>
             ) : (
               <div className="bg-stone-900 text-[#9A84A1] p-10 rounded-[2.5rem] text-center shadow-xl">
                  <Crown className="w-8 h-8 mx-auto mb-4" />
                  <h4 className="font-black uppercase tracking-[0.2em] text-xs">Premium Active</h4>
                  <p className="text-[11px] text-white/50 mt-4 italic font-medium">최상의 감상을 위한 큐레이션이 제공되고 있습니다.</p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};