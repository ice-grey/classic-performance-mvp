import React, { useState, useEffect } from 'react';
import { ClassicalPiece } from '../types';
import { getInspirations, CurationInspiration } from '../services/geminiService';
import {
  Check, MessageCircle, Mail, Music,
  PenTool, ArrowUpRight, Asterisk, Loader2
} from 'lucide-react';

interface CuratorWorkplaceProps {
  candidates: ClassicalPiece[];
  onConfirm: (piece: ClassicalPiece) => void;
  onSearch: (composer: string, mood: string, discoveryMode: string, era: string, performer: string, occasion: string, instrumentation: string) => void;
  isSearching: boolean;
}

export const CuratorWorkplace: React.FC<CuratorWorkplaceProps> = ({ candidates, onConfirm, onSearch, isSearching }) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [editedText, setEditedText] = useState("");
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  
  const [searchComposer, setSearchComposer] = useState("");
  const [searchMood, setSearchMood] = useState("");
  const [searchPerformer, setSearchPerformer] = useState("");
  const [searchOccasion, setSearchOccasion] = useState("");
  const [searchInstrumentation, setSearchInstrumentation] = useState("");
  const [discoveryMode, setDiscoveryMode] = useState("balanced");
  const [era, setEra] = useState("");

  const [inspirations, setInspirations] = useState<CurationInspiration[]>([]);
  const [loadingInspirations, setLoadingInspirations] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const cached = localStorage.getItem(`inspirations_${today}`);
    if (cached) {
      try {
        setInspirations(JSON.parse(cached));
        return;
      } catch {}
    }
    loadInspirations();
  }, []);

  const loadInspirations = async () => {
    setLoadingInspirations(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const items = await getInspirations(today);
      setInspirations(items);
      localStorage.setItem(`inspirations_${today}`, JSON.stringify(items));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInspirations(false);
    }
  };

  const handleApplyInspiration = (ins: CurationInspiration) => {
    // 필터 상태 업데이트
    setSearchComposer(ins.filters.composer || "");
    setSearchPerformer(ins.filters.performer || "");
    setSearchMood(ins.filters.mood || "");
    setSearchOccasion(ins.filters.occasion || "");
    setSearchInstrumentation(ins.filters.instrumentation || "");
    setDiscoveryMode(ins.filters.discoveryMode || "balanced");
    setEra(ins.filters.era || "");
    
    // 즉시 검색 실행
    setSelectedIdx(null);
    onSearch(
      ins.filters.composer || "",
      ins.filters.mood || "",
      ins.filters.discoveryMode || "balanced",
      ins.filters.era || "",
      ins.filters.performer || "",
      ins.filters.occasion || "",
      ins.filters.instrumentation || ""
    );
  };

  const handleSelect = (i: number) => {
    setSelectedIdx(i);
    const p = candidates[i];
    // 이모지 제거 및 텍스트 정제
    setEditedText(`[Kyth Classical 오늘의 큐레이션]\n\n마스터피스: ${p.composer} - ${p.title}\n연주: ${p.performer}\n\n[곡의 이야기]\n${p.description}\n\n[마에스트로의 통찰]\n${p.funFact}\n\n감상하기: https://www.youtube.com/results?search_query=${encodeURIComponent(p.youtubeQuery)}`);
    
    // 에디터로 자동 스크롤
    setTimeout(() => {
      const editorSection = document.getElementById('manuscript-editor');
      if (editorSection) editorSection.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedIdx(null);
    onSearch(searchComposer, searchMood, discoveryMode, era, searchPerformer, searchOccasion, searchInstrumentation);
  };

  const showFeedback = (msg: string) => {
    setCopyFeedback(msg);
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  return (
    <div className="space-y-32 animate-in fade-in duration-1000 max-w-6xl mx-auto pb-20">
      
      {/* 1. Studio Header & Perspective Selection */}
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-10">
           <div className="space-y-4 text-left max-w-xl">
              <div className="flex items-center space-x-3">
                <Asterisk className="w-5 h-5 text-[#9A84A1]" />
                <span className="text-xs font-black uppercase tracking-[0.5em] text-stone-500">Kyth's Curation for Today</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-logo font-black text-black leading-tight">
                Classical music <br />
                <span className="serif-italic italic font-normal text-[#9A84A1]">of the Day.</span>
              </h2>
           </div>
           <button onClick={loadInspirations} className="group flex items-center px-8 py-4 bg-[#F8F5FA] border border-stone-100 transition-all hover:bg-stone-900 hover:text-white">
             <span className="text-xs font-bold tracking-tight">{loadingInspirations ? '...' : 'Try Again'}</span>
           </button>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-1">
          {loadingInspirations ? (
            [1, 2, 3].map(i => <div key={i} className="h-64 bg-[#F8F5FA] animate-pulse" />)
          ) : (
            inspirations.map((ins, i) => (
              <div 
                key={i}
                onClick={() => handleApplyInspiration(ins)}
                className="group relative p-12 bg-[#F8F5FA] border border-stone-100 cursor-pointer hover:bg-stone-900 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-5 h-5 text-[#9A84A1]" />
                </div>
                <h4 className="text-xl font-black text-stone-900 mb-4 group-hover:text-white transition-colors uppercase tracking-tight leading-tight">{ins.theme}</h4>
                <p className="text-sm text-stone-700 font-medium leading-relaxed mb-8 group-hover:text-stone-300 transition-colors">{ins.reason}</p>
                <div className="text-xs font-black uppercase tracking-widest text-[#9A84A1] flex items-center">
                   <span>선택</span>
                </div>
              </div>
            ))
          )}
        </section>
      </div>

      {/* 2. Master Curation Engine (Core Control) */}
      <section className="bg-[#F8F5FA] border-y-2 border-stone-900 py-20 relative group">
        <div className="max-w-5xl mx-auto px-6 space-y-16">
          <div className="flex items-center space-x-3">
             <div className="w-1.5 h-1.5 bg-[#9A84A1]"></div>
             <span className="text-xs font-black uppercase tracking-[0.5em] text-stone-500">Kyth Classical Music Curator</span>
          </div>
          
          <form onSubmit={handleFilterSubmit} className="space-y-16 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {[
                { label: '상황 / 장면', value: searchOccasion, setter: setSearchOccasion, placeholder: '예: 비오는 오후' },
                { label: '악기 / 구성', value: searchInstrumentation, setter: setSearchInstrumentation, placeholder: '예: 첼로 솔로' },
                { label: '작곡가', value: searchComposer, setter: setSearchComposer, placeholder: '선택 사항' },
                { label: '연주자', value: searchPerformer, setter: setSearchPerformer, placeholder: '선택 사항' },
              ].map((f, idx) => (
                <div key={idx} className="space-y-4">
                  <label className="text-xs font-black uppercase text-stone-500 tracking-[0.2em]">{f.label}</label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={f.value}
                      onChange={(e) => f.setter(e.target.value)}
                      placeholder={f.placeholder}
                      className="w-full px-0 py-4 bg-transparent border-b border-stone-200 text-stone-900 focus:border-stone-900 transition-all outline-none font-light text-xl placeholder:text-stone-300"
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-stone-900 group-focus-within:w-full transition-all duration-500"></div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              type="submit" 
              disabled={isSearching} 
              className="w-full bg-stone-900 text-white py-8 font-black text-xs hover:bg-[#9A84A1] transition-all transform active:scale-[0.99] shadow-2xl disabled:opacity-50 flex items-center justify-center space-x-6 group"
            >
              {isSearching && <Loader2 className="w-6 h-6 animate-spin" />}
              <span className="tracking-[0.4em]">{isSearching ? "AI가 큐레이션 중..." : "I'M EXCITED"}</span>
            </button>
          </form>
        </div>
      </section>

      {/* 3. Candidates Selection - 엔진 바로 아래에 결과 노출 */}
      <section className="space-y-16">
        <div className="flex items-center space-x-4 border-b border-stone-100 pb-8">
           <Music className="w-7 h-7 text-black" />
           <h2 className="text-3xl md:text-4xl font-logo font-black text-black uppercase tracking-tight">Music for You</h2>
        </div>
        
        {isSearching ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            {[1, 2, 3].map(i => <div key={i} className="bg-[#F8F5FA] h-80 border border-stone-100 animate-pulse" />)}
          </div>
        ) : candidates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            {candidates.map((p, i) => (
              <div 
                key={p.id}
                onClick={() => handleSelect(i)}
                className={`cursor-pointer group relative p-12 border transition-all duration-500
                  ${selectedIdx === i 
                    ? 'bg-[#F8F5FA] border-stone-900 shadow-premium z-10' 
                    : 'bg-white border-stone-100 hover:bg-[#F8F5FA] hover:z-10 hover:shadow-xl hover:border-stone-400'}`}
              >
                <span className="text-xs font-black uppercase tracking-widest text-[#9A84A1] mb-4 block">{p.era}</span>
                <h4 className="text-2xl font-logo font-black text-stone-900 mb-4 leading-tight tracking-tight uppercase">{p.title}</h4>
                <p className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-12">{p.composer}</p>
                <div className={`flex items-center text-xs font-black uppercase tracking-widest transition-colors
                   ${selectedIdx === i ? 'text-stone-900' : 'text-stone-500 group-hover:text-stone-900'}`}>
                   {selectedIdx === i ? <Check className="w-4 h-4 mr-3 text-[#9A84A1]" /> : <PenTool className="w-4 h-4 mr-3" />}
                   <span>{selectedIdx === i ? '편집 준비 완료' : '자세히 보기'}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border-2 border-dashed border-stone-100 bg-[#F8F5FA]">
             <p className="text-stone-500 font-logo italic text-xl">엔진을 가동하여 오늘의 곡 후보를 발견하세요.</p>
          </div>
        )}
      </section>

      {/* 4. Detailing Section - 원고 에디터 */}
      {selectedIdx !== null && (
        <section id="manuscript-editor" className="bg-[#F8F5FA] border border-stone-900 shadow-premium overflow-hidden animate-in slide-in-from-bottom-20 duration-1000">
          <div className="p-12 md:p-24 grid grid-cols-1 lg:grid-cols-2 gap-24">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                 <label className="text-[10px] font-black uppercase tracking-[0.5em] text-[#9A84A1]">에디토리얼 편집기</label>
                 <span className="text-[9px] font-bold text-stone-300 uppercase tracking-widest">실시간 아카이브 동기화</span>
              </div>
              <textarea 
                value={editedText} 
                onChange={(e) => setEditedText(e.target.value)} 
                className="w-full h-[550px] p-12 bg-white border-none text-stone-900 leading-[1.8] focus:outline-none transition-all text-lg font-light shadow-inner-soft resize-none" 
              />
            </div>
            
            <div className="flex flex-col justify-center space-y-16">
              <div className="space-y-8">
                <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#9A84A1]">배포 프로토콜</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <button onClick={() => { navigator.clipboard.writeText(editedText); showFeedback("복사되었습니다."); }} className="flex flex-col items-center justify-center space-y-6 p-12 bg-white hover:bg-stone-900 text-stone-900 hover:text-white border border-stone-100 hover:border-stone-900 transition-all transform hover:-translate-y-1 group">
                    <div className="w-14 h-14 bg-stone-50 flex items-center justify-center group-hover:bg-[#9A84A1] transition-all">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold tracking-widest">채널 브로드캐스트</span>
                  </button>
                  <button onClick={() => { navigator.clipboard.writeText(editedText); showFeedback("복사되었습니다."); }} className="flex flex-col items-center justify-center space-y-6 p-12 bg-white hover:bg-stone-900 text-stone-900 hover:text-white border border-stone-100 hover:border-stone-900 transition-all transform hover:-translate-y-1 group">
                    <div className="w-14 h-14 bg-stone-50 flex items-center justify-center group-hover:bg-[#9A84A1] transition-all">
                      <Mail className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold tracking-widest">저널 뉴스레터</span>
                  </button>
                </div>
              </div>
              
              <div className="space-y-6 pt-10 border-t border-stone-200">
                 <button 
                   onClick={() => onConfirm(candidates[selectedIdx])} 
                   className="w-full py-9 bg-stone-900 text-white font-black text-xs hover:bg-[#9A84A1] transition-all shadow-2xl active:scale-95"
                 >
                   <span className="tracking-[0.4em]">오늘의 명곡으로 확정하기</span>
                 </button>
                 <p className="text-center text-[9px] font-bold text-stone-400 uppercase tracking-widest">발행 시 이 곡은 오늘 하루 전체 서비스의 메인으로 노출됩니다.</p>
              </div>
            </div>
          </div>
          
          {copyFeedback && (
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 glass px-10 py-4 font-bold text-[#9A84A1] shadow-2xl animate-in fade-in slide-in-from-bottom-4 z-50">
              {copyFeedback}
            </div>
          )}
        </section>
      )}
    </div>
  );
};