import React, { useState, useEffect } from 'react';
import { PerformanceInfo } from './components/PerformanceInfo';
import { Performance } from './types';
import { Music, Ticket } from 'lucide-react';

const App: React.FC = () => {
  const [savedPerformances, setSavedPerformances] = useState<Performance[]>([]);

  useEffect(() => {
    const spf = localStorage.getItem('saved_performances');
    if (spf) setSavedPerformances(JSON.parse(spf));
  }, []);

  const toggleSavePerformance = (perf: Performance) => {
    let updated;
    if (savedPerformances.some(p => p.id === perf.id)) {
      updated = savedPerformances.filter(p => p.id !== perf.id);
    } else {
      updated = [perf, ...savedPerformances];
    }
    setSavedPerformances(updated);
    localStorage.setItem('saved_performances', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCFD] selection:bg-[#9A84A1]/20">
      {/* Header */}
      <header className="pt-20 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-[1px] bg-stone-300"></div>
            <Music className="w-5 h-5 text-[#9A84A1]" />
            <div className="w-10 h-[1px] bg-stone-300"></div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-stone-900 tracking-tighter">
            Kyth <span className="serif-italic font-normal italic font-logo">Stages</span>
          </h1>
          <p className="text-stone-400 font-bold uppercase tracking-[0.4em] text-[10px]">
            Upcoming Classical Concerts
          </p>
        </div>
      </header>

      <main className="px-6 pb-24 flex-grow">
        <PerformanceInfo 
          onSave={toggleSavePerformance}
          isSaved={(id) => savedPerformances.some(p => p.id === id)}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-100 py-12 px-6 bg-white">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-stone-400">
          <div className="flex items-center space-x-6 text-[10px] font-bold uppercase tracking-widest text-stone-400">
            <span className="flex items-center space-x-2">
              <Ticket className="w-4 h-4" />
              <span>{savedPerformances.length} Saved Events</span>
            </span>
          </div>
          <p className="text-[9px] font-bold uppercase tracking-widest">
            © 2026 Kyth Stages · Powered by Gemini
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
