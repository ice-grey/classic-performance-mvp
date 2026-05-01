
import React, { useState } from 'react';
import { Mail, CheckCircle2, Sparkles, Send } from 'lucide-react';
import { SubscriptionTier } from '../types';

export const SubscriptionForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // 시뮬레이션: 구독자 정보를 로컬 스토리지에 저장 (나중에 관리자 탭에서 확인 가능)
    const saved = localStorage.getItem('subscribers');
    const subscribers = saved ? JSON.parse(saved) : [];
    const newSubscriber = {
      email,
      date: new Date().toLocaleDateString(),
      tier: SubscriptionTier.FREE
    };
    
    localStorage.setItem('subscribers', JSON.stringify([...subscribers, newSubscriber]));

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-3xl font-serif text-amber-950 mb-4">환영합니다!</h3>
        <p className="text-amber-800 leading-relaxed mb-8">
          구독 확인 메일이 <strong>{email}</strong>(으)로 발송되었습니다.<br />
          매일 아침 찾아올 클래식의 세계를 기대해주세요.
        </p>
        <button 
          onClick={() => setSubmitted(false)}
          className="text-amber-700 underline font-medium hover:text-amber-900"
        >
          다른 이메일로 구독하기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-amber-950 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center text-amber-100 space-y-6">
        <div className="w-12 h-12 bg-amber-800/50 rounded-xl flex items-center justify-center mb-2">
          <Sparkles className="w-6 h-6 text-amber-400" />
        </div>
        <h2 className="text-4xl font-serif leading-tight">아침의<br />교향곡</h2>
        <p className="text-amber-100/70 text-lg leading-relaxed">
          엄선된 클래식 명곡과 전문가의 해설을 매일 아침 무료 뉴스레터로 받아보세요. 
        </p>
        <ul className="space-y-3 text-sm text-amber-100/60">
          <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-amber-400" /> 광고 없는 순수한 예술</li>
          <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-amber-400" /> 작곡가 비하인드 스토리</li>
          <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-amber-400" /> 고음질 감상 링크 포함</li>
        </ul>
      </div>

      <div className="md:w-1/2 bg-amber-900/40 p-10 md:p-16 flex flex-col justify-center">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-amber-200 text-sm font-semibold uppercase tracking-widest">이메일 주소</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vivaldi@classic.com"
                className="w-full pl-12 pr-4 py-4 bg-amber-950/50 border border-amber-800 rounded-xl text-amber-100 placeholder:text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-amber-400 hover:bg-amber-300 disabled:bg-amber-800 disabled:cursor-not-allowed text-amber-950 font-bold rounded-xl transition shadow-lg flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span className="animate-pulse">악기 조율 중...</span>
            ) : (
              <>
                <span>뉴스레터 구독하기</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
          
          <p className="text-xs text-amber-100/40 text-center">
            언제든 구독을 취소할 수 있습니다. 
          </p>
        </form>
      </div>
    </div>
  );
};
