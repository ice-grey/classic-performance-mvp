
import React, { useState, useEffect } from 'react';
import { BoardPost, UserAccount } from '../types';
import { MessageSquare, Plus, ThumbsUp, User, Lock, Clock, Search, ChevronRight } from 'lucide-react';

interface CommunityBoardProps {
  currentUser: UserAccount | null;
  onLoginRequest: () => void;
}

export const CommunityBoard: React.FC<CommunityBoardProps> = ({ currentUser, onLoginRequest }) => {
  const [posts, setPosts] = useState<BoardPost[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem('board_posts');
    if (saved) {
      setPosts(JSON.parse(saved));
    } else {
      const dummy: BoardPost[] = [
        { id: '1', title: '오늘의 바흐 무곡 정말 좋네요', author: '클래식광팬', content: '아침부터 듣는데 첼로 선율이 예술입니다.', timestamp: '2024-05-10 09:30', likes: 12 },
        { id: '2', title: '조성진 공연 티켓팅 팁 있나요?', author: '쇼팽매니아', content: '매번 광탈해서 이번엔 꼭 가고 싶습니다.', timestamp: '2024-05-09 15:45', likes: 8 },
      ];
      setPosts(dummy);
      localStorage.setItem('board_posts', JSON.stringify(dummy));
    }
  }, []);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onLoginRequest();
      return;
    }
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost: BoardPost = {
      id: Date.now().toString(),
      title: newTitle,
      author: currentUser.username,
      content: newContent,
      timestamp: new Date().toLocaleString(),
      likes: 0
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    localStorage.setItem('board_posts', JSON.stringify(updated));
    setNewTitle("");
    setNewContent("");
    setShowEditor(false);
  };

  const handleLike = (id: string) => {
    const updated = posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p);
    setPosts(updated);
    localStorage.setItem('board_posts', JSON.stringify(updated));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-serif font-bold text-stone-900">Kyth Lounge</h2>
          <p className="text-stone-400 italic mt-1">음악 애호가들의 자유로운 소통 공간</p>
        </div>
        <button 
          onClick={() => currentUser ? setShowEditor(!showEditor) : onLoginRequest()}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-stone-900 text-white rounded-2xl font-bold hover:bg-[#9A84A1] transition shadow-lg"
        >
          {showEditor ? <span>Close</span> : <><Plus className="w-5 h-5" /> <span>Write Post</span></>}
        </button>
      </div>

      {!currentUser && (
        <div className="bg-[#F4F2F5] border border-stone-100 p-6 rounded-3xl flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Lock className="w-6 h-6 text-[#9A84A1]" />
            <p className="text-stone-900 font-medium text-sm">글을 쓰려면 회원 로그인이 필요합니다.</p>
          </div>
          <button onClick={onLoginRequest} className="px-5 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-[#9A84A1] transition">Login</button>
        </div>
      )}

      {showEditor && currentUser && (
        <form onSubmit={handlePostSubmit} className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-xl space-y-4 animate-in slide-in-from-top-4">
          <input 
            type="text" 
            placeholder="제목을 입력하세요"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#9A84A1] font-bold"
          />
          <textarea 
            placeholder="내용을 입력하세요..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="w-full h-40 px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#9A84A1] resize-none"
          />
          <div className="flex justify-end">
            <button type="submit" className="px-10 py-3 bg-stone-900 text-white rounded-xl font-black hover:bg-[#9A84A1] transition">Submit Post</button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-7 rounded-3xl shadow-sm border border-stone-50 hover:border-[#9A84A1]/30 transition group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-stone-900 mb-2 group-hover:text-[#9A84A1] transition-colors">{post.title}</h3>
                <div className="flex items-center space-x-4 text-xs text-stone-400">
                  <span className="flex items-center"><User className="w-3 h-3 mr-1" /> {post.author}</span>
                  <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {post.timestamp}</span>
                </div>
              </div>
              <button 
                onClick={() => handleLike(post.id)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-stone-50 text-stone-600 hover:bg-[#9A84A1] hover:text-white transition"
              >
                <ThumbsUp className="w-3 h-3" />
                <span className="text-xs font-black">{post.likes}</span>
              </button>
            </div>
            <p className="text-stone-500 leading-relaxed text-sm line-clamp-3">{post.content}</p>
            <div className="mt-4 pt-4 border-t border-stone-50 flex justify-end">
                <button className="text-[10px] font-black uppercase text-[#9A84A1] flex items-center hover:text-stone-900 transition">
                  Read Full <ChevronRight className="w-3 h-3 ml-1" />
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};