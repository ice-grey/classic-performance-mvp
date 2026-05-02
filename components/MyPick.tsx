import React from 'react';
import { ClassicalPiece, Performance, SubscriptionTier } from '../types';
import { RecommendationCard } from './RecommendationCard';
import { Heart, Music, Ticket, Trash2, Calendar, MapPin, ChevronRight, Lock } from 'lucide-react';

interface MyPickProps {
  todayPiece: ClassicalPiece | null;
  savedPieces: ClassicalPiece[];
  savedPerformances: Performance[];
  history: ClassicalPiece[];
  tier: SubscriptionTier;
  onUpgrade: () => void;
  onSave: (p: ClassicalPiece) => void;
  isSaved: (id: string) => boolean;
  onRemovePiece: (id: string) => void;
  onRemovePerformance: (id: string) => void;
  onSelectPiece: (p: ClassicalPiece) => void;
}

export const MyPick: React.FC<MyPickProps> = ({
  todayPiece,
  savedPieces,
  savedPerformances,
  history,
  tier,
  onUpgrade,
  onSave,
  isSaved,
  onRemovePiece,
  onRemovePerformance,
  onSelectPiece,
}) => {
  const isPremium = tier === SubscriptionTier.PREMIUM;
  const visibleHistoryLimit = isPremium ? 100 : 3;
  const isAllEmpty =
    !todayPiece && savedPieces.length === 0 && savedPerformances.length === 0 && history.length === 0;

  return (
    <div className="max-w-5xl mx-auto space-y-24 animate-in fade-in duration-700 pb-20">
      <div className="text-center space-y-3">
        <h2 className="text-4xl md:text-5xl font-bold text-black uppercase tracking-tight">My Pick</h2>
        <p className="text-stone-500 italic text-sm font-bold tracking-wide">
          오늘의 픽 · 하트한 곡 · 저장한 공연 · 지난 픽
        </p>
      </div>

      {isAllEmpty && (
        <div className="text-center py-32 bg-[#F8F5FA] border-2 border-dashed border-stone-200">
          <Heart className="w-12 h-12 text-stone-300 mx-auto mb-6" />
          <p className="text-stone-700 text-lg font-medium">아직 픽한 곡이 없어요.</p>
          <p className="text-stone-500 text-sm mt-2">큐레이션 탭에서 오늘의 곡을 골라보세요.</p>
        </div>
      )}

      {todayPiece && (
        <section className="space-y-8">
          <div className="flex items-center space-x-4 border-b border-stone-100 pb-6">
            <div className="w-1.5 h-8 bg-[#9A84A1]" />
            <h3 className="text-2xl font-logo font-black text-black uppercase tracking-tight">오늘의 픽</h3>
          </div>
          <RecommendationCard
            piece={todayPiece}
            tier={tier}
            onUpgrade={onUpgrade}
            onSave={onSave}
            isSaved={isSaved}
          />
        </section>
      )}

      {savedPieces.length > 0 && (
        <section className="space-y-8">
          <div className="flex items-center space-x-4 border-b border-stone-100 pb-6">
            <Heart className="w-6 h-6 text-[#9A84A1] fill-[#9A84A1]" />
            <h3 className="text-2xl font-logo font-black text-black uppercase tracking-tight">하트한 곡</h3>
            <span className="text-xs text-stone-400 font-bold">{savedPieces.length}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedPieces.map((p) => (
              <div
                key={p.id}
                className="group bg-white p-8 rounded-[2rem] border border-stone-100 shadow-md hover:shadow-xl transition-all flex items-center space-x-6"
              >
                <div
                  className="w-16 h-16 rounded-2xl bg-stone-900 flex items-center justify-center text-white flex-shrink-0 cursor-pointer"
                  onClick={() => onSelectPiece(p)}
                >
                  <Music className="w-6 h-6" />
                </div>
                <div className="flex-grow min-w-0 cursor-pointer" onClick={() => onSelectPiece(p)}>
                  <h4 className="font-bold text-stone-900 truncate text-lg mb-1">{p.title}</h4>
                  <p className="text-xs font-bold uppercase tracking-widest text-stone-500">{p.composer}</p>
                </div>
                <button
                  onClick={() => onRemovePiece(p.id)}
                  className="p-3 text-stone-300 hover:text-red-500 transition-colors bg-stone-50 rounded-xl"
                  aria-label="Remove"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {savedPerformances.length > 0 && (
        <section className="space-y-8">
          <div className="flex items-center space-x-4 border-b border-stone-100 pb-6">
            <Ticket className="w-6 h-6 text-[#9A84A1]" />
            <h3 className="text-2xl font-logo font-black text-black uppercase tracking-tight">저장한 공연</h3>
            <span className="text-xs text-stone-400 font-bold">{savedPerformances.length}</span>
          </div>
          <div className="space-y-6">
            {savedPerformances.map((p) => (
              <div
                key={p.id}
                className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-md flex flex-col sm:flex-row items-center gap-8"
              >
                <div className="w-20 h-20 rounded-2xl bg-stone-50 flex items-center justify-center text-stone-900 border border-stone-100">
                  <Calendar className="w-8 h-8 opacity-30" />
                </div>
                <div className="flex-grow text-center sm:text-left">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#9A84A1] mb-2 block">{p.date}</span>
                  <h4 className="text-xl font-bold text-stone-900 mb-3">{p.title}</h4>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-2 text-xs font-bold uppercase tracking-widest text-stone-500">
                    <span className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-[#9A84A1]" /> {p.venue}</span>
                    <span className="flex items-center"><ChevronRight className="w-4 h-4 mr-2 text-[#9A84A1]" /> {p.performer}</span>
                  </div>
                </div>
                <div className="flex sm:flex-col gap-3 w-full sm:w-auto">
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-grow sm:w-40 px-6 py-4 bg-stone-900 text-white rounded-2xl font-bold uppercase tracking-widest text-xs text-center hover:bg-[#9A84A1] transition shadow-md"
                  >
                    Details
                  </a>
                  <button
                    onClick={() => onRemovePerformance(p.id)}
                    className="flex-grow sm:w-40 px-6 py-4 border border-stone-100 text-stone-400 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-red-50 hover:text-red-500 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {history.length > 0 && (
        <section className="space-y-8">
          <div className="flex items-center space-x-4 border-b border-stone-100 pb-6">
            <div className="w-1.5 h-8 bg-stone-300" />
            <h3 className="text-2xl font-logo font-black text-black uppercase tracking-tight">지난 픽들</h3>
            <span className="text-xs text-stone-400 font-bold">{history.length}</span>
            {!isPremium && history.length > visibleHistoryLimit && (
              <span className="ml-auto text-xs font-black text-stone-400 uppercase tracking-widest">
                Showing {visibleHistoryLimit} of {history.length}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {history.map((piece, index) => {
              const isLocked = index >= visibleHistoryLimit;
              return (
                <div
                  key={piece.id}
                  onClick={() => (isLocked ? onUpgrade() : onSelectPiece(piece))}
                  className={`group bg-white rounded-[2rem] overflow-hidden shadow-md hover:shadow-xl border border-stone-100 transition-all cursor-pointer flex h-32 relative
                    ${isLocked ? 'grayscale opacity-60' : ''}`}
                >
                  {isLocked && (
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-10 flex items-center justify-center">
                      <div className="bg-stone-900 text-[#9A84A1] p-3 rounded-full shadow-xl">
                        <Lock className="w-4 h-4" />
                      </div>
                    </div>
                  )}
                  <div className="w-28 flex-shrink-0 bg-stone-900 flex items-center justify-center text-[#9A84A1]">
                    <Music className="w-7 h-7 opacity-30" />
                  </div>
                  <div className="flex-grow p-6 flex flex-col justify-center min-w-0">
                    <span className="text-[10px] text-[#9A84A1] font-black uppercase tracking-[0.2em] mb-2">{piece.date}</span>
                    <h4 className="text-lg font-bold text-stone-900 truncate mb-1">{piece.title}</h4>
                    <p className="text-stone-500 font-black uppercase tracking-widest text-[10px] truncate">{piece.composer}</p>
                  </div>
                  <div className="pr-6 flex items-center">
                    <ChevronRight className="w-5 h-5 text-stone-200 group-hover:text-stone-900 transition" />
                  </div>
                </div>
              );
            })}
          </div>

          {!isPremium && history.length > visibleHistoryLimit && (
            <div className="mt-12 p-12 bg-stone-900 rounded-[2.5rem] text-center shadow-xl">
              <h4 className="text-xl font-serif text-white mb-3">Historical Full Access</h4>
              <p className="text-stone-400 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
                지난 픽 전체({history.length}곡)를 프리미엄 구독으로 자유롭게 탐색하세요.
              </p>
              <button
                onClick={onUpgrade}
                className="px-10 py-4 bg-[#9A84A1] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white hover:text-stone-900 shadow-xl transition"
              >
                Unlock Archive
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
