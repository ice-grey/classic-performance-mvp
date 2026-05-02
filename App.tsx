import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { PricingSection } from './components/PricingSection';
import { AdminPanel } from './components/AdminPanel';
import { CuratorWorkplace } from './components/CuratorWorkplace';
import { CommunityBoard } from './components/CommunityBoard';
import { PerformanceInfo } from './components/PerformanceInfo';
import { MyPick } from './components/MyPick';
import { AuthModal } from './components/AuthModal';
import { PaymentModal } from './components/PaymentModal';
import { generateCandidates } from './services/geminiService';
import { ClassicalPiece, ViewState, SubscriptionTier, UserAccount, Performance } from './types';
import { Loader2, User, Crown } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.CURATE);
  const [tier, setTier] = useState<SubscriptionTier>(SubscriptionTier.FREE);
  const [todayPiece, setTodayPiece] = useState<ClassicalPiece | null>(null);
  const [candidates, setCandidates] = useState<ClassicalPiece[]>([]);
  const [history, setHistory] = useState<ClassicalPiece[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [savedPieces, setSavedPieces] = useState<ClassicalPiece[]>([]);
  const [savedPerformances, setSavedPerformances] = useState<Performance[]>([]);

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const fetchCurationData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const today = new Date().toISOString().split('T')[0];
      const savedPiece = localStorage.getItem(`classic_daily_${today}`);

      if (savedPiece) {
        setTodayPiece(JSON.parse(savedPiece));
      } else {
        const results = await generateCandidates(today);
        setCandidates(results);
      }
    } catch (err) {
      console.error(err);
      setError("데이터를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurationData();
    const savedHistory = localStorage.getItem('classic_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    const savedUser = localStorage.getItem('classic_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      const savedTier = localStorage.getItem(`tier_${user.email}`);
      if (savedTier) setTier(savedTier as SubscriptionTier);
    }

    const sp = localStorage.getItem('saved_pieces');
    if (sp) setSavedPieces(JSON.parse(sp));
    const spf = localStorage.getItem('saved_performances');
    if (spf) setSavedPerformances(JSON.parse(spf));
  }, [fetchCurationData]);

  const handleSetView = (view: ViewState) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSavePiece = (piece: ClassicalPiece) => {
    let updated;
    if (savedPieces.some(p => p.id === piece.id)) {
      updated = savedPieces.filter(p => p.id !== piece.id);
    } else {
      updated = [piece, ...savedPieces];
    }
    setSavedPieces(updated);
    localStorage.setItem('saved_pieces', JSON.stringify(updated));
  };

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

  const handleCustomSearch = async (composer: string, mood: string, discoveryMode: any, era: string, performer: string, occasion: string, instrumentation: string) => {
    setIsSearching(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const results = await generateCandidates(today, { composer, mood, discoveryMode, era, performer, occasion, instrumentation });
      setCandidates(results);
    } catch (err) {
      console.error(err);
      alert("오류가 발생했습니다.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleConfirmPiece = (piece: ClassicalPiece) => {
    const today = new Date().toISOString().split('T')[0];
    setTodayPiece(piece);
    localStorage.setItem(`classic_daily_${today}`, JSON.stringify(piece));

    const existingHistoryRaw = localStorage.getItem('classic_history');
    const existingHistory = existingHistoryRaw ? JSON.parse(existingHistoryRaw) : [];
    const updatedHistory = [piece, ...existingHistory.filter((p: any) => p.id !== piece.id)].slice(0, 100);
    localStorage.setItem('classic_history', JSON.stringify(updatedHistory));
    setHistory(updatedHistory);

    handleSetView(ViewState.MY_PICK);
  };

  const handleLogin = (user: UserAccount) => {
    setCurrentUser(user);
    localStorage.setItem('classic_user', JSON.stringify(user));
    const savedTier = localStorage.getItem(`tier_${user.email}`);
    if (savedTier) setTier(savedTier as SubscriptionTier);
    else setTier(SubscriptionTier.FREE);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setTier(SubscriptionTier.FREE);
    localStorage.removeItem('classic_user');
  };

  const handleUpgradeSuccess = () => {
    if (!currentUser) return;
    setTier(SubscriptionTier.PREMIUM);
    localStorage.setItem(`tier_${currentUser.email}`, SubscriptionTier.PREMIUM);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#9A84A1]" />
          <p className="text-xs font-bold uppercase tracking-[0.5em] text-stone-500">AI가 오늘의 명곡을 큐레이션 중입니다</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6 space-y-8">
          <p className="text-stone-400 font-medium text-lg italic serif">데이터를 불러오지 못했습니다.</p>
          <button onClick={fetchCurationData} className="px-12 py-4 bg-stone-900 text-white font-bold text-xs hover:bg-[#9A84A1] transition-all">다시 시도</button>
        </div>
      );
    }

    switch (currentView) {
      case ViewState.CURATE:
        return (
          <CuratorWorkplace
            candidates={candidates}
            onConfirm={handleConfirmPiece}
            onSearch={handleCustomSearch}
            isSearching={isSearching}
          />
        );
      case ViewState.PERFORMANCES:
        return (
          <PerformanceInfo
            onSave={toggleSavePerformance}
            isSaved={(id) => savedPerformances.some(p => p.id === id)}
          />
        );
      case ViewState.MY_PICK:
        return (
          <MyPick
            todayPiece={todayPiece}
            savedPieces={savedPieces}
            savedPerformances={savedPerformances}
            history={history}
            tier={tier}
            onUpgrade={() => handleSetView(ViewState.PRICING)}
            onSave={toggleSavePiece}
            isSaved={(id) => savedPieces.some(p => p.id === id)}
            onRemovePiece={(id) => {
              const updated = savedPieces.filter(p => p.id !== id);
              setSavedPieces(updated);
              localStorage.setItem('saved_pieces', JSON.stringify(updated));
            }}
            onRemovePerformance={(id) => {
              const updated = savedPerformances.filter(p => p.id !== id);
              setSavedPerformances(updated);
              localStorage.setItem('saved_performances', JSON.stringify(updated));
            }}
            onSelectPiece={(p) => setTodayPiece(p)}
          />
        );
      case ViewState.COMMUNITY:
        return <CommunityBoard currentUser={currentUser} onLoginRequest={() => setShowAuthModal(true)} />;
      case ViewState.PRICING:
        return <PricingSection currentTier={tier} onSelectPlan={() => currentUser ? setShowPaymentModal(true) : setShowAuthModal(true)} />;
      case ViewState.ADMIN:
        return <AdminPanel todayPiece={todayPiece} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1A1A1A]">
      <Navbar activeView={currentView} setView={handleSetView} tier={tier} />

      <main className="flex-grow container mx-auto px-6 py-24 max-w-6xl">
        {/* Editorial Header Section */}
        <div className="mb-24 flex flex-col items-center text-center">
          {currentUser && (
            <div className="mb-8 flex items-center space-x-4 bg-[#F8F5FA] px-5 py-2 border border-stone-200 transition-all hover:shadow-md">
              <div className="w-6 h-6 bg-stone-900 flex items-center justify-center text-[10px] text-white">
                {tier === SubscriptionTier.PREMIUM ? <Crown className="w-3 h-3 text-[#9A84A1]" /> : <User className="w-3.5 h-3.5" />}
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-stone-600">{currentUser.username}</span>
              <div className="w-px h-3 bg-stone-200"></div>
              <button onClick={handleLogout} className="text-[11px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 transition">로그아웃</button>
            </div>
          )}

          <div className="flex items-center space-x-4 mb-6">
            <div className="h-px w-8 bg-stone-200"></div>
            <div className="text-xs font-bold uppercase tracking-[0.5em] text-stone-500">My Personal Classical Music Curator</div>
            <div className="h-px w-8 bg-stone-200"></div>
          </div>

          <h1 className="text-7xl md:text-9xl font-logo font-black text-black mb-6 tracking-[-0.02em] leading-tight">
            Kyth <span className="serif-italic font-normal italic text-[#9A84A1] block md:inline md:ml-4">Classical</span>
          </h1>

          <p className="text-stone-600 text-base md:text-lg font-medium tracking-wide leading-relaxed max-w-2xl">
            나도 몰랐던, 내가 듣고 싶은 클래식 음악
          </p>
        </div>

        {renderContent()}
      </main>

      <footer className="bg-[#F8F5FA] border-t border-stone-100 py-24 px-6 text-center">
        <div className="max-w-xs mx-auto mb-10">
          <div className="text-2xl font-logo font-bold mb-2">Kyth</div>
          <p className="text-xs text-stone-400 leading-relaxed uppercase tracking-widest">A legacy of sound and emotion curated for the modern connoisseur.</p>
        </div>
        <p className="text-xs italic mb-6 text-stone-400 serif-italic">"음악은 말로 표현할 수 없는 것을 표현한다." — Victor Hugo</p>
        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-stone-300 mt-12">© 2025 KYTH CLASSICAL ARCHIVE</p>
      </footer>

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
        />
      )}

      {showPaymentModal && (
        <PaymentModal
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handleUpgradeSuccess}
        />
      )}
    </div>
  );
};

export default App;
