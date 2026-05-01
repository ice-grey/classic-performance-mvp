import React, { useState } from 'react';
import { ClassicalPiece, SubscriptionTier } from '../types';
import { Share2, Youtube, Quote, Info, Check, Copy, Lock, Sparkles, Crown, User, Heart, Play, Music } from 'lucide-react';

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
    const shareText = `[Kyth Classical] ${piece.composer} - ${piece.title}\n감상: https://www.youtube.com/results?search_query=${encodeURIComponent(piece.youtubeQuery)}`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Kyth Classical', text: shareText, url: window.location.href }); } catch (err) {}
    } else {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-6xl mx-auto px-4 pb-20">
      <div className="bg-[#F8F5FA] shadow-premium overflow-hidden border border-stone-100 flex flex-col lg:flex-row">
        
        {/* Cover Section */}
        <div className="lg:w-2/5 relative bg-[#1A1A1A] p-12 flex flex-col justify-between overflow-hidden min-h-[550px]">
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 border border-white/5" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[1px] bg-white/5 rotate-45" />
          </div>

          <div className="relative z-10 flex justify-between items-start">
             <div className="flex flex-col">
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#9A84A1] mb-2">오늘의 선정</span>
               <div className="h-1 w-12 bg-[#9A84A1]"></div>
             </div>
             <button 
                onClick={() => onSave(piece)}
                className={`p-4 transition-all duration-500 transform hover:scale-110 active:scale-90 shadow-2xl
                  ${isSaved(piece.id) ? 'bg-[#9A84A1] text-white' : 'bg-white/5 text-white/40 hover:text-white border border-white/10 hover:bg-white/10'}`}
              >
                <Heart className={`w-6 h-6 ${isSaved(piece.id) ? 'fill-current' : ''}`} />
              </button>
          </div>

          <div className="relative z-10 space-y-6">
             <h2 className="text-5xl md:text-7xl font-logo font-black text-white leading-[0.85] tracking-tight">
               {piece.title}
             </h2>
             <div className="flex items-center space-x-6">
               <div className="h-px w-10 bg-[#9A84A1]"></div>
               <p className="text-2xl font-logo serif-italic italic text-[#9A84A1] lowercase">
                 composed by {piece.composer}
               </p>
             </div>
          </div>

          <div className="relative z-10 flex justify-between items-end border-t border-white/5 pt-12">
             <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-1">음악 사조</span>
                <span className="text-xs font-bold text-white uppercase tracking-widest">{piece.era}</span>
             </div>
             <div className="flex flex-col text-right">
                <span className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-1">작곡 연도</span>
                <span className="text-xs font-bold text-white uppercase tracking-widest">{piece.year}</span>
             </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="lg:w-3/5 p-12 md:p-20 space-y-20 bg-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 border-b border-stone-50 pb-12">
            <div className="flex items-center space-x-8">
              <div className="w-16 h-16 bg-[#F8F5FA] border border-stone-50 flex items-center justify-center text-[#9A84A1]">
                <User className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black text-stone-300 uppercase tracking-widest">추천 명연주</p>
                <h4 className="text-3xl font-bold text-stone-900 tracking-tight">{piece.performer}</h4>
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <div className="flex items-center space-x-4">
              <span className="text-[10px] font-black text-stone-900 uppercase tracking-[0.5em]">전문 큐레이터의 분석</span>
              <div className="h-px flex-grow bg-stone-100"></div>
            </div>
            <p className="text-lg md:text-2xl text-stone-800 leading-relaxed font-light">
              {piece.description}
            </p>
          </div>

          <div className="relative">
            {!isPremium && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center bg-[#F8F5FA]/80 backdrop-blur-sm z-20">
                <Lock className="w-8 h-8 text-[#9A84A1] mb-6" />
                <h4 className="text-3xl font-logo font-black text-stone-900 mb-3 uppercase">Premium Logic</h4>
                <p className="text-stone-500 text-sm max-w-sm mb-12 font-medium">거장의 비화와 심층 해설은 프리미엄 멤버십에게만 공개됩니다.</p>
                <button onClick={onUpgrade} className="px-14 py-6 bg-stone-900 text-white font-bold text-[11px] hover:bg-[#9A84A1] transition-all shadow-2xl">
                  프리미엄 업그레이드
                </button>
              </div>
            )}
            
            <div className="bg-[#F8F5FA] p-14 border border-stone-50 relative group">
              <div className="flex items-center space-x-3 mb-10 relative z-10">
                <Sparkles className="w-5 h-5 text-[#9A84A1]" />
                <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-widest">마에스트로의 통찰</h3>
              </div>
              <p className={`text-stone-900 leading-relaxed text-xl serif-italic italic relative z-10 ${!isPremium ? 'blur-lg select-none opacity-20' : ''}`}>
                "{piece.funFact}"
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-12 pt-12">
            <div className="flex flex-wrap gap-3">
              {piece.mood.split(',').map((m, i) => (
                <span key={i} className="px-5 py-2 bg-stone-900/5 text-stone-500 text-[10px] font-bold uppercase tracking-wider">
                  {m.trim()}
                </span>
              ))}
            </div>
            
            <div className="flex items-center space-x-6">
              <button onClick={handleShare} className="p-6 border border-stone-100 text-stone-400 hover:text-stone-900 transition-all">
                {copied ? <Check className="w-6 h-6 text-[#9A84A1]" /> : <Share2 className="w-6 h-6" />}
              </button>
              <a 
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(piece.youtubeQuery)}`} 
                target="_blank" rel="noopener noreferrer" 
                className="flex items-center space-x-6 px-14 py-6 bg-stone-900 text-white transition-all shadow-2xl hover:bg-[#9A84A1] hover:-translate-y-1 group"
              >
                <Play className="w-5 h-5 fill-current" />
                <span className="font-bold tracking-[0.2em] text-[11px]">지금 감상하기</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};