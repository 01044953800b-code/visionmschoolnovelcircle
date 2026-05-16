import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  PenTool, 
  Sparkles, 
  History, 
  User, 
  Eye, 
  Target, 
  ChevronRight, 
  Loader2,
  Heart,
  Quote
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { generateStory, StoryParams } from "./lib/geminiService";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState<string | null>(null);
  const [params, setParams] = useState<StoryParams>({
    event: "",
    conflict: "내적 갈등",
    personality: "",
    viewpoint: "1인칭 주인공 시점",
    theme: "성장",
  });

  const storyContainerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStory(null);
    try {
      const generatedStory = await generateStory(params);
      setStory(generatedStory);
    } catch (error) {
      console.error(error);
      alert("소설을 생성하는 중에 오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStory(null);
    setParams({
      event: "",
      conflict: "내적 갈등",
      personality: "",
      viewpoint: "1인칭 주인공 시점",
      theme: "성장",
    });
  };

  return (
    <div className="h-screen flex flex-col bg-brand-bg text-brand-text font-sans overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-brand-border px-8 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-brand-olive rounded-sm flex items-center justify-center text-white font-serif italic text-xl">A</div>
          <h1 className="text-lg font-semibold tracking-tight uppercase text-brand-olive">
            공감하는 소설가 AI <span className="text-xs font-normal ml-2 opacity-60">| 중등 소설 창작부 전용</span>
          </h1>
        </div>
        <div className="flex items-center space-x-4 text-xs font-medium uppercase tracking-widest">
          <span className="px-3 py-1 bg-[#f0ede8] rounded-full text-brand-olive">문학적 치유 모드</span>
          <button 
            onClick={handleReset}
            className="px-3 py-1 border border-brand-olive text-brand-olive hover:bg-brand-olive hover:text-white transition-colors"
          >
            새 작업 시작
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar: Input Parameters */}
        <aside className="w-80 border-r border-brand-border bg-brand-sidebar p-6 flex flex-col overflow-y-auto space-y-6">
          <form onSubmit={handleSubmit} className="flex flex-col h-full space-y-6">
            <div>
              <h2 className="text-[10px] font-bold text-brand-olive uppercase tracking-widest mb-4">입력 설정 정보</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] text-brand-label uppercase font-bold block mb-1.5">상처되는 사건</label>
                  <textarea
                    required
                    value={params.event}
                    onChange={(e) => setParams({ ...params, event: e.target.value })}
                    className="w-full text-sm leading-relaxed p-3 bg-white border border-brand-border rounded-md focus:outline-none focus:ring-1 focus:ring-brand-olive/30 min-h-[120px] resize-none transition-all"
                    placeholder="당신이 겪었던 사건을 들려주세요..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-brand-label uppercase font-bold block mb-1">갈등</label>
                    <select
                      value={params.conflict}
                      onChange={(e) => setParams({ ...params, conflict: e.target.value })}
                      className="w-full text-xs p-2 bg-white border border-brand-border rounded appearance-none focus:outline-none focus:ring-1 focus:ring-brand-olive/30"
                    >
                      <option>내적 갈등</option>
                      <option>외적 갈등</option>
                      <option>세상과의 갈등</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-brand-label uppercase font-bold block mb-1">성격</label>
                    <input
                      required
                      type="text"
                      value={params.personality}
                      onChange={(e) => setParams({ ...params, personality: e.target.value })}
                      className="w-full text-xs p-2 bg-white border border-brand-border rounded focus:outline-none focus:ring-1 focus:ring-brand-olive/30"
                      placeholder="내유외강"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-brand-label uppercase font-bold block mb-1">서술 시점</label>
                  <select
                    value={params.viewpoint}
                    onChange={(e) => setParams({ ...params, viewpoint: e.target.value })}
                    className="w-full text-xs p-2 bg-white border border-brand-border rounded appearance-none focus:outline-none focus:ring-1 focus:ring-brand-olive/30"
                  >
                    <option>1인칭 주인공 시점</option>
                    <option>3인칭 전지적 시점</option>
                    <option>1인칭 관찰자 시점</option>
                    <option>3인칭 관찰자 시점</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-brand-label uppercase font-bold block mb-1">주제</label>
                  <input
                    required
                    type="text"
                    value={params.theme}
                    onChange={(e) => setParams({ ...params, theme: e.target.value })}
                    className="w-full text-xs p-2 bg-white border border-brand-border rounded focus:outline-none focus:ring-1 focus:ring-brand-olive/30"
                    placeholder="성장과 수용"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-auto px-4 py-3 bg-brand-olive text-white rounded text-center font-bold uppercase tracking-widest text-xs hover:bg-[#484833] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "집필 중..." : "소설 초고 생성"}
            </button>
            
            <div className="p-4 border border-dashed border-brand-olive rounded-lg bg-white opacity-80 shrink-0">
              <p className="text-[11px] italic leading-tight text-brand-olive">
                "상처는 이야기의 시작이 됩니다. 당신의 진심을 문장으로 바꾸고 있습니다."
              </p>
            </div>
          </form>
        </aside>

        {/* Main Content: Novel Area */}
        <section className="flex-1 bg-brand-bg relative flex flex-col overflow-y-auto">
          <div className="max-w-3xl mx-auto w-full py-12 px-8 flex-1 flex flex-col">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center space-y-4"
                >
                  <Loader2 className="animate-spin text-brand-olive opacity-30" size={40} />
                  <p className="text-sm font-serif italic text-brand-label uppercase tracking-widest">원고지 위에 고요한 파동이 일고 있습니다...</p>
                </motion.div>
              ) : story ? (
                <motion.div
                  key="story"
                  ref={storyContainerRef}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-brand-paper shadow-xl rounded-sm p-12 md:p-16 flex-1 border border-brand-border relative overflow-hidden flex flex-col transition-all"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-brand-olive"></div>
                  
                  <div className="markdown-body prose prose-stone max-w-none prose-p:leading-[1.8] prose-p:text-[#3a3a3a] prose-headings:font-serif prose-headings:tracking-tight prose-p:font-serif prose-p:text-[15px]">
                    <ReactMarkdown>{story}</ReactMarkdown>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 0.5 }} 
                  className="flex-1 flex flex-col items-center justify-center text-center space-y-6"
                >
                  <PenTool size={48} strokeWidth={1} className="text-brand-olive opacity-40" />
                  <div className="space-y-2">
                    <p className="font-serif text-xl italic text-brand-olive">"원고지가 비어있습니다."</p>
                    <p className="font-sans text-xs uppercase tracking-widest text-brand-label">왼쪽 설정을 입력하고 당신만의 이야기를 시작하세요.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      {/* Footer: Author's Note */}
      <footer className="h-40 md:h-24 bg-brand-olive text-white p-6 flex items-center shrink-0">
        <div className="w-12 h-12 rounded-full border border-white/30 flex-shrink-0 flex items-center justify-center mr-4 overflow-hidden bg-[#8c857d]/30">
          <Sparkles size={20} className="text-white/70" />
        </div>
        <div className="max-w-4xl">
          <h4 className="text-[11px] font-bold uppercase tracking-widest opacity-80 mb-1">AI 소설가 가이드의 한마디</h4>
          <p className="text-sm font-light leading-relaxed">
            {story 
              ? "소설 속 주인공이 그랬듯, 용기 내어 상처를 마주한 당신은 이미 더 단단한 사람이 될 준비가 되었습니다. 오늘의 아픔을 멋진 문장으로 승화시켜줘서 고마워요."
              : "상처받은 마음은 좋은 소설의 씨앗이 됩니다. 당신이 겪은 아픔을 문학적 치유로 승화시킬 수 있도록 제가 곁에서 돕겠습니다."}
          </p>
        </div>
      </footer>
    </div>
  );
}

