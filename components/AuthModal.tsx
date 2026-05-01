import React, { useState } from 'react';
import { UserAccount } from '../types';
import { X, Mail, Lock, User, Music, Sparkles } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (user: UserAccount) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user: UserAccount = {
      username: username || (email.split('@')[0]),
      email: email,
      joinedDate: new Date().toLocaleDateString()
    };
    onLogin(user);
    onClose();
  };

  const handleSocialLogin = (provider: string) => {
    const user: UserAccount = {
      username: `${provider} 유저`,
      email: `${provider.toLowerCase()}@example.com`,
      joinedDate: new Date().toLocaleDateString()
    };
    onLogin(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-in zoom-in duration-300">
        <div className="bg-stone-900 p-8 text-center relative">
          <button onClick={onClose} className="absolute top-6 right-6 text-stone-500 hover:text-white transition">
            <X className="w-6 h-6" />
          </button>
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Music className="w-8 h-8 text-[#9A84A1]" />
          </div>
          <h3 className="text-xl font-bold text-white uppercase tracking-tight">Kyth Salon</h3>
          <p className="text-stone-500 text-[9px] uppercase tracking-[0.2em] mt-2">Elite Membership Service</p>
        </div>

        <div className="p-10 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => handleSocialLogin('Kakao')}
              className="flex items-center justify-center space-x-2 py-3 bg-stone-100 text-stone-600 rounded-xl font-bold text-xs hover:bg-stone-200 transition"
            >
              <span>카카오 로그인</span>
            </button>
            <button 
              onClick={() => handleSocialLogin('Google')}
              className="flex items-center justify-center space-x-2 py-3 bg-stone-100 text-stone-600 rounded-xl font-bold text-xs hover:bg-stone-200 transition"
            >
              <span>구글 로그인</span>
            </button>
          </div>

          <div className="relative flex items-center">
            <div className="flex-grow border-t border-stone-100"></div>
            <span className="flex-shrink mx-4 text-[10px] text-stone-300 font-bold uppercase tracking-widest">또는 이메일</span>
            <div className="flex-grow border-t border-stone-100"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                <input 
                  type="text" required placeholder="사용자 이름" 
                  value={username} onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#9A84A1] text-sm"
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
              <input 
                type="email" required placeholder="이메일 주소" 
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#9A84A1] text-sm"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
              <input 
                type="password" required placeholder="비밀번호" 
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-stone-50 border border-stone-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#9A84A1] text-sm"
              />
            </div>

            <button type="submit" className="w-full py-4 bg-stone-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-xl flex items-center justify-center space-x-2 text-sm uppercase tracking-widest">
              <span>{isRegister ? "가입하기" : "로그인"}</span>
              <Sparkles className="w-4 h-4 text-[#9A84A1]" />
            </button>
          </form>

          <div className="text-center">
            <button 
              type="button" 
              onClick={() => setIsRegister(!isRegister)}
              className="text-[11px] font-bold text-stone-400 hover:text-stone-900 underline"
            >
              {isRegister ? "이미 계정이 있으신가요?" : "회원이 아니신가요? 가입하기"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};