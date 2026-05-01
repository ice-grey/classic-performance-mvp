
import React, { useState, useEffect } from 'react';
// Corrected import to include SubscriptionTier and resolve the Subscriber interface error
import { Subscriber, ClassicalPiece, SubscriptionTier } from '../types';
import { Users, Send, MessageSquare, Mail, Info, CheckCircle, ExternalLink } from 'lucide-react';

interface AdminPanelProps {
  todayPiece: ClassicalPiece | null;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ todayPiece }) => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [sending, setSending] = useState(false);
  const [sentCount, setSentCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('subscribers');
    if (saved) setSubscribers(JSON.parse(saved));
  }, []);

  const simulateSend = () => {
    if (!todayPiece) return;
    setSending(true);
    // 실제 환경에서는 여기서 Backend API (SendGrid, Solapi 등)를 호출합니다.
    setTimeout(() => {
      setSending(false);
      setSentCount(subscribers.length);
      alert(`${subscribers.length}명의 고객에게 메시지 발송이 완료되었습니다!`);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm">
          <div className="flex items-center text-amber-600 mb-2">
            <Users className="w-5 h-5 mr-2" />
            <span className="text-sm font-bold uppercase tracking-widest">총 구독자</span>
          </div>
          <p className="text-4xl font-black text-amber-950">{subscribers.length} <span className="text-lg font-normal opacity-50">명</span></p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm">
          <div className="flex items-center text-green-600 mb-2">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span className="text-sm font-bold uppercase tracking-widest">발송 성공(오늘)</span>
          </div>
          <p className="text-4xl font-black text-amber-950">{sentCount} <span className="text-lg font-normal opacity-50">건</span></p>
        </div>

        <div className="bg-amber-900 p-6 rounded-2xl shadow-xl flex items-center justify-center">
          <button 
            onClick={simulateSend}
            disabled={sending || subscribers.length === 0}
            className="flex items-center space-x-2 bg-amber-400 hover:bg-amber-300 text-amber-950 px-6 py-3 rounded-xl font-bold transition disabled:opacity-50"
          >
            <Send className={`w-5 h-5 ${sending ? 'animate-bounce' : ''}`} />
            <span>{sending ? '발송 중...' : '오늘의 곡 전체 발송'}</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-amber-100 shadow-sm">
        <h3 className="text-2xl font-serif font-bold text-amber-950 mb-6 flex items-center">
          <Info className="w-6 h-6 mr-2 text-amber-600" />
          비즈니스 배포 가이드
        </h3>
        
        <div className="space-y-6">
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
            <h4 className="font-bold text-amber-900 flex items-center mb-2">
              <MessageSquare className="w-4 h-4 mr-2" /> 카카오 알림톡으로 보내려면?
            </h4>
            <p className="text-sm text-amber-800 leading-relaxed mb-3">
              1. <strong>카카오톡 채널</strong>을 개설하고 비즈니스 인증을 받으세요.<br />
              2. <strong>솔라피(Solapi)</strong>나 <strong>비즈뿌리오</strong> 같은 API 서비스를 가입하세요.<br />
              3. '알림톡 템플릿'을 등록한 뒤, 앱의 백엔드에서 매일 아침 해당 API를 호출하면 자동으로 고객 폰으로 전송됩니다.
            </p>
            <a href="https://solapi.com" target="_blank" className="text-xs font-bold text-amber-600 flex items-center hover:underline">
              솔라피 바로가기 <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
            <h4 className="font-bold text-amber-900 flex items-center mb-2">
              <Mail className="w-4 h-4 mr-2" /> 뉴스레터(이메일)로 보내려면?
            </h4>
            <p className="text-sm text-amber-800 leading-relaxed mb-3">
              1. <strong>스티비(Stibee)</strong> 가입 후 주소록을 생성하세요.<br />
              2. 스티비 API를 연동하면 Gemini가 생성한 텍스트를 이메일 본문으로 자동 변환하여 예약 발송할 수 있습니다.<br />
              3. 가장 비용이 저렴하고 고객 도달률이 높은 방법입니다.
            </p>
            <a href="https://stibee.com" target="_blank" className="text-xs font-bold text-amber-600 flex items-center hover:underline">
              스티비 바로가기 <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-amber-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-amber-50 text-amber-900 uppercase text-xs font-black tracking-widest">
            <tr>
              <th className="px-6 py-4">구독자 이메일</th>
              <th className="px-6 py-4">가입일</th>
              <th className="px-6 py-4">등급</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-50">
            {subscribers.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-10 text-center text-amber-400 italic">아직 구독자가 없습니다.</td></tr>
            ) : (
              subscribers.map((s, i) => (
                <tr key={i} className="hover:bg-amber-50/50 transition">
                  <td className="px-6 py-4 font-medium text-amber-950">{s.email}</td>
                  <td className="px-6 py-4 text-sm text-amber-600">{s.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black ${s.tier === SubscriptionTier.PREMIUM ? 'bg-amber-200 text-amber-900' : 'bg-slate-100 text-slate-500'}`}>
                      {s.tier}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
