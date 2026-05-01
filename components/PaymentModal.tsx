
import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, CheckCircle2, Loader2, Crown } from 'lucide-react';

interface PaymentModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState<'info' | 'processing' | 'success'>('info');

  const handlePayment = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 z-20">
          <X className="w-6 h-6" />
        </button>

        {step === 'info' && (
          <div className="flex flex-col">
            <div className="bg-stone-900 p-10 text-center">
              <Crown className="w-12 h-12 text-[#9A84A1] mx-auto mb-4" />
              <h3 className="text-2xl font-serif font-bold text-white">Kyth Premium</h3>
              <p className="text-stone-400 text-sm mt-2">월 $4.99 • 언제든 취소 가능</p>
            </div>
            
            <div className="p-10 space-y-8">
              <div className="space-y-4">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest">결제 카드 정보</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <input 
                    type="text" placeholder="1234 - 5678 - 1234 - 5678" 
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#9A84A1] font-medium"
                    readOnly value="4111 2222 3333 4444"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="MM/YY" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-medium" readOnly value="12/28" />
                  <input type="text" placeholder="CVC" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-medium" readOnly value="***" />
                </div>
              </div>

              <div className="bg-[#F4F2F5] p-6 rounded-2xl border border-stone-100 flex items-start space-x-4">
                <ShieldCheck className="w-6 h-6 text-[#9A84A1] flex-shrink-0" />
                <p className="text-xs text-stone-500 leading-relaxed">
                  결제 정보는 보안 프로토콜을 통해 안전하게 처리됩니다. 결제 완료 즉시 프리미엄 혜택이 활성화됩니다.
                </p>
              </div>

              <button 
                onClick={handlePayment}
                className="w-full py-5 bg-stone-900 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-black transition-all active:scale-[0.98]"
              >
                지금 결제하기
              </button>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="p-20 text-center space-y-6">
            <Loader2 className="w-16 h-16 text-[#9A84A1] animate-spin mx-auto" />
            <h3 className="text-2xl font-serif font-bold text-stone-900">보안 결제 진행 중</h3>
            <p className="text-stone-400 italic leading-relaxed">카드사 인증을 기다리고 있습니다.<br />잠시만 기다려주세요.</p>
          </div>
        )}

        {step === 'success' && (
          <div className="p-20 text-center space-y-6 animate-in zoom-in">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-3xl font-serif font-bold text-stone-900">결제 완료</h3>
            <p className="text-stone-500 leading-relaxed">
              프리미엄 회원이 되신 것을 축하드립니다!<br />이제 Kyth Classical의 모든 기능을 자유롭게 누리세요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};