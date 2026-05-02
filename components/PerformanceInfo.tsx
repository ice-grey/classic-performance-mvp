import React, { useState, useEffect } from 'react';
import { Performance } from '../types';
import { getUpcomingPerformances } from '../services/geminiService';
import { Calendar, MapPin, User, ExternalLink, Loader2, Ticket, Search, Heart, Check, Music } from 'lucide-react';

interface PerformanceInfoProps {
  onSave: (p: Performance) => void;
  isSaved: (id: string) => boolean;
}

export const PerformanceInfo: React.FC<PerformanceInfoProps> = ({ onSave, isSaved }) => {
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const fetchPerformances = async (query: string = "") => {
    if (query) setIsSearching(true);
    else setLoading(true);
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const data = await getUpcomingPerformances(today, query);
      setPerformances(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  useEffect(() => {
    fetchPerformances();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPerformances(searchQuery);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-1000">
      <div className="text-center space-y-2">
        {/* 제목 블랙으로 변경 */}
        <h2 className="text-3xl md:text-4xl font-bold text-black uppercase tracking-tight">Upcoming Concerts</h2>
        <p className="text-stone-500 italic text-xs font-bold uppercase tracking-widest">Global Live Schedule</p>
      </div>

      {/* 검색창 큐레이션과 같은 보라색 배경으로 변경 */}
      <div className="bg-[#9A84A1] p-8 rounded-[2.5rem] shadow-2xl border border-white/10">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="도시, 작곡가 또는 아티스트 검색..." 
              className="w-full pl-14 pr-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-1 focus:ring-white text-sm placeholder:text-white/40" 
            />
          </div>
          <button 
            type="submit"
            disabled={isSearching}
            className="px-10 py-4 bg-stone-900 text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-stone-900 transition shadow-lg flex items-center justify-center space-x-3"
          >
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>{isSearching ? "Searching..." : "공연 찾기"}</span>
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-20 space-y-6">
          <Loader2 className="w-8 h-8 text-[#9A84A1] animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {performances.map((p) => (
            <div key={p.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-lg border border-stone-50 flex flex-col md:flex-row group hover:shadow-2xl transition-all duration-500">
              <div className="md:w-44 h-44 md:h-auto bg-stone-900 flex items-center justify-center text-white relative overflow-hidden flex-shrink-0">
                <Music className="w-10 h-10 opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="text-center">
                     <span className="block text-3xl font-bold text-white mb-1">{p.date.split('-')[2] || '??'}</span>
                     <span className="block text-[9px] font-bold uppercase tracking-widest opacity-40">Monthly Event</span>
                   </div>
                </div>
              </div>
              <div className="p-10 flex flex-col justify-between flex-grow">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-stone-900 tracking-tight">{p.title}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-stone-500 uppercase tracking-widest">
                    <span className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-[#9A84A1]" /> {p.venue}</span>
                    <span className="flex items-center"><User className="w-4 h-4 mr-2 text-[#9A84A1]" /> {p.performer}</span>
                  </div>
                </div>
                <div className="mt-8 flex items-center justify-between border-t border-stone-50 pt-8">
                    <button 
                      onClick={() => onSave(p)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition
                        ${isSaved(p.id) ? 'text-stone-900 bg-stone-100' : 'text-stone-400 hover:text-stone-900'}`}
                    >
                      {isSaved(p.id) ? <Check className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
                      <span>{isSaved(p.id) ? '저장됨' : '공연 저장'}</span>
                    </button>
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(`${p.title} ${p.venue} ${p.date}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 px-8 py-3 bg-stone-900 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#9A84A1] transition shadow-md"
                    >
                      <span>검색하기</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
