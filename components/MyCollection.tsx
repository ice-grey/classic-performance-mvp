import React, { useState } from 'react';
import { ClassicalPiece, Performance } from '../types';
import { Heart, Music, Ticket, Trash2, Calendar, MapPin, ChevronRight } from 'lucide-react';

interface MyCollectionProps {
  savedPieces: ClassicalPiece[];
  savedPerformances: Performance[];
  onRemovePiece: (id: string) => void;
  onRemovePerformance: (id: string) => void;
  onSelectPiece: (p: ClassicalPiece) => void;
}

export const MyCollection: React.FC<MyCollectionProps> = ({ 
  savedPieces, 
  savedPerformances, 
  onRemovePiece, 
  onRemovePerformance,
  onSelectPiece
}) => {
  const [activeTab, setActiveTab] = useState<'music' | 'performances'>('music');

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="text-center space-y-2">
        {/* 제목 블랙으로 변경 */}
        <h2 className="text-3xl md:text-4xl font-bold text-black uppercase tracking-tight">Your Liked Collection</h2>
        <p className="text-stone-500 italic text-[11px] font-bold uppercase tracking-[0.3em]">Your Curated History of Melodies</p>
      </div>

      <div className="flex justify-center">
        <div className="inline-flex p-1.5 bg-stone-900/10 backdrop-blur-md rounded-2xl border border-stone-900/5">
          <button 
            onClick={() => setActiveTab('music')}
            className={`flex items-center space-x-3 px-8 py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all
              ${activeTab === 'music' ? 'bg-stone-900 text-white shadow-xl' : 'text-stone-500 hover:text-stone-900'}`}
          >
            <Music className="w-4 h-4" />
            <span>Masterpieces</span>
          </button>
          <button 
            onClick={() => setActiveTab('performances')}
            className={`flex items-center space-x-3 px-8 py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all
              ${activeTab === 'performances' ? 'bg-stone-900 text-white shadow-xl' : 'text-stone-500 hover:text-stone-900'}`}
          >
            <Ticket className="w-4 h-4" />
            <span>Concerts</span>
          </button>
        </div>
      </div>

      {activeTab === 'music' ? (
        <div className="space-y-6">
          {savedPieces.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-stone-100">
               <Music className="w-12 h-12 text-stone-200 mx-auto mb-4" />
               <p className="text-stone-400 font-medium text-base italic">보관함이 비어있습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedPieces.map((p) => (
                <div key={p.id} className="group bg-white p-8 rounded-[2.5rem] border border-stone-50 shadow-lg hover:shadow-2xl transition-all flex items-center space-x-6">
                  <div className="w-16 h-16 rounded-2xl bg-stone-900 flex items-center justify-center text-white flex-shrink-0 cursor-pointer" onClick={() => onSelectPiece(p)}>
                    <Music className="w-6 h-6" />
                  </div>
                  <div className="flex-grow min-w-0 cursor-pointer" onClick={() => onSelectPiece(p)}>
                    <h4 className="font-bold text-stone-900 truncate text-lg mb-1">{p.title}</h4>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-stone-400">{p.composer}</p>
                  </div>
                  <button 
                    onClick={() => onRemovePiece(p.id)}
                    className="p-3 text-stone-200 hover:text-red-500 transition-colors bg-stone-50 rounded-xl"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {savedPerformances.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-stone-100">
               <Ticket className="w-12 h-12 text-stone-200 mx-auto mb-4" />
               <p className="text-stone-400 font-medium text-base italic">저장된 공연이 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {savedPerformances.map((p) => (
                <div key={p.id} className="bg-white p-10 rounded-[3rem] border border-stone-50 shadow-lg flex flex-col sm:flex-row items-center gap-10">
                   <div className="w-20 h-20 rounded-2xl bg-stone-50 flex items-center justify-center text-stone-900 border border-stone-100">
                      <Calendar className="w-8 h-8 opacity-20" />
                   </div>
                   <div className="flex-grow text-center sm:text-left">
                     <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9A84A1] mb-2 block">{p.date}</span>
                     <h4 className="text-2xl font-bold text-stone-900 mb-3">{p.title}</h4>
                     <div className="flex items-center justify-center sm:justify-start space-x-6 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                        <span className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-[#9A84A1]" /> {p.venue}</span>
                        <span className="flex items-center"><ChevronRight className="w-4 h-4 mr-2 text-[#9A84A1]" /> {p.performer}</span>
                     </div>
                   </div>
                   <div className="flex sm:flex-col gap-3 w-full sm:w-auto">
                     <a href={p.link} target="_blank" className="flex-grow sm:w-40 px-6 py-4 bg-stone-900 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] text-center hover:bg-[#9A84A1] transition shadow-md">Details</a>
                     <button 
                      onClick={() => onRemovePerformance(p.id)}
                      className="flex-grow sm:w-40 px-6 py-4 border border-stone-100 text-stone-400 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-red-50 hover:text-red-500 transition"
                     >
                       Remove
                     </button>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
