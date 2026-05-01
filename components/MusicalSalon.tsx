
import React, { useState, useEffect } from 'react';
import { SalonPost, ClassicalPiece } from '../types';
import { generateMaestroResponse } from '../services/geminiService';
import { MessageSquare, Send, Music2, User, Sparkles, Quote, Loader2, Music } from 'lucide-react';

interface MusicalSalonProps {
  todayPiece: ClassicalPiece | null;
}

export const MusicalSalon: React.FC<MusicalSalonProps> = ({ todayPiece }) => {
  const [posts, setPosts] = useState<SalonPost[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('salon_posts');
    if (saved) setPosts(JSON.parse(saved));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    const instrumentList: any[] = ['violin', 'piano', 'cello', 'flute'];
    const randomInstrument = instrumentList[Math.floor(Math.random() * instrumentList.length)];

    const userPost: SalonPost = {
      id: Date.now().toString(),
      author: "음악 애호가",
      content: newComment,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      pieceId: todayPiece?.id,
      instrument: randomInstrument
    };

    try {
      // AI 마에스트로의 화답 생성
      const pieceContext = todayPiece ? `${todayPiece.composer}의 ${todayPiece.title}` : "클래식 음악";
      const aiComment = await generateMaestroResponse(newComment, pieceContext);
      userPost.aiResponse = aiComment;

      const updatedPosts = [userPost, ...posts].slice(0, 50);
      setPosts(updatedPosts);
      localStorage.setItem('salon_posts', JSON.stringify(updatedPosts));
      setNewComment("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-1000">
      {/* 살롱 헤더 */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-serif font-bold text-amber-950">음악 살롱</h2>
        <p className="text-amber-800/60 italic">지적인 감상과 AI 마에스트로의 화답이 머무는 공간</p>
      </div>

      {/* 오늘 선정된 곡 정보 (살롱 상단 고정) */}
      {todayPiece && (
        <div className="bg-amber-950 text-amber-100 p-6 rounded-3xl shadow-xl flex items-center space-x-6">
          {/* Fix: Removed non-existent todayPiece.imageUrl and replaced with a Music icon placeholder */}
          <div className="w-20 h-20 rounded-2xl bg-amber-900 flex items-center justify-center text-amber-400 border border-amber-800 flex-shrink-0">
            <Music className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">Now Reflecting on</span>
            <h4 className="text-xl font-bold serif">{todayPiece.title}</h4>
            <p className="text-sm opacity-60">{todayPiece.composer}</p>
          </div>
        </div>
      )}

      {/* 포스트 작성 영역 */}
      <form onSubmit={handleSubmit} className="relative group">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="오늘의 곡에 대한 감상이나 질문을 남겨보세요..."
          className="w-full h-32 p-6 bg-white border border-amber-100 rounded-3xl text-amber-950 focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all shadow-lg text-lg resize-none"
        />
        <button
          type="submit"
          disabled={isSubmitting || !newComment.trim()}
          className="absolute bottom-4 right-4 bg-amber-950 text-white p-3 rounded-2xl hover:bg-black transition-all disabled:opacity-50 disabled:grayscale"
        >
          {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
        </button>
      </form>

      {/* 게시글 리스트 */}
      <div className="space-y-8 pb-12">
        {posts.length === 0 ? (
          <div className="text-center py-20 bg-amber-50/20 rounded-[2rem] border-2 border-dashed border-amber-100">
            <MessageSquare className="w-12 h-12 text-amber-200 mx-auto mb-4" />
            <p className="text-amber-800/40 serif italic text-lg">살롱의 첫 번째 감상가가 되어보세요.</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
              {/* 사용자 포스트 */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0">
                  <User className="w-6 h-6" />
                </div>
                <div className="bg-white p-6 rounded-3xl rounded-tl-none shadow-md border border-amber-50 flex-grow">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-amber-900">{post.author}</span>
                    <span className="text-[10px] text-amber-400 font-medium">{post.timestamp}</span>
                  </div>
                  <p className="text-amber-950 leading-relaxed">{post.content}</p>
                </div>
              </div>

              {/* AI 마에스트로의 화답 */}
              {post.aiResponse && (
                <div className="flex items-start space-x-4 pl-12">
                  <div className="w-10 h-10 rounded-full bg-amber-950 flex items-center justify-center text-amber-400 flex-shrink-0 shadow-lg ring-4 ring-amber-100">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="bg-amber-50/80 backdrop-blur-sm p-6 rounded-3xl rounded-tl-none border border-amber-100 flex-grow relative overflow-hidden">
                    <div className="absolute top-2 right-4 opacity-5">
                        <Quote className="w-12 h-12 text-amber-950" />
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-800">Maestro's Insight</span>
                    </div>
                    <p className="text-amber-900 serif italic leading-relaxed text-sm">
                        {post.aiResponse}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
