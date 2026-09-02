import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import API from '../services/api';
import { Bot, Sparkles, HelpCircle, Calendar, FileText, Send, CheckCircle2 } from 'lucide-react';

const AITutorPage = () => {
  const [activeTab, setActiveTab] = useState('tutor'); // 'tutor' | 'quiz' | 'study-plan' | 'summarizer'
  const { addToast } = useToast();

  // AI Tutor state
  const [tutorMessage, setTutorMessage] = useState('');
  const [tutorMode, setTutorMode] = useState('direct');
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', content: "Hello! 👋 I am your dedicated Learnova AI Tutor. Ask me any concept, debug error, or problem-solving prompt!" }
  ]);
  const [tutorLoading, setTutorLoading] = useState(false);

  // Quiz state
  const [quizTopic, setQuizTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [quizDifficulty, setQuizDifficulty] = useState('Medium');
  const [generatedQuiz, setGeneratedQuiz] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);

  // Study plan state
  const [planGoal, setPlanGoal] = useState('');
  const [planHours, setPlanHours] = useState(2);
  const [planLevel, setPlanLevel] = useState('Beginner');
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);

  // Summarizer state
  const [summaryText, setSummaryText] = useState('');
  const [summaryResult, setSummaryResult] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  // Handlers
  const handleTutorSubmit = async (e) => {
    e.preventDefault();
    if (!tutorMessage.trim() || tutorLoading) return;
    const newMsgs = [...chatHistory, { role: 'user', content: tutorMessage }];
    setChatHistory(newMsgs);
    setTutorMessage('');
    setTutorLoading(true);

    try {
      const res = await API.post('/ai/tutor', { message: tutorMessage, mode: tutorMode });
      if (res.data.success) {
        setChatHistory([...newMsgs, { role: 'assistant', content: res.data.reply }]);
      }
    } catch (err) {
      addToast('AI Tutor error', 'error');
    } finally {
      setTutorLoading(false);
    }
  };

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    if (!quizTopic.trim() || quizLoading) return;
    setQuizLoading(true);
    try {
      const res = await API.post('/ai/generate-quiz', {
        topic: quizTopic,
        numQuestions: Number(numQuestions),
        difficulty: quizDifficulty
      });
      if (res.data.success) {
        setGeneratedQuiz(res.data.quiz);
        addToast('AI Quiz Generated!', 'success');
      }
    } catch (err) {
      addToast('Quiz generation error', 'error');
    } finally {
      setQuizLoading(false);
    }
  };

  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    if (!planGoal.trim() || planLoading) return;
    setPlanLoading(true);
    try {
      const res = await API.post('/ai/study-plan', {
        goal: planGoal,
        availableHoursPerDay: planHours,
        skillLevel: planLevel
      });
      if (res.data.success) {
        setGeneratedPlan(res.data.studyPlan);
        addToast('AI Study Plan Created!', 'success');
      }
    } catch (err) {
      addToast('Study plan error', 'error');
    } finally {
      setPlanLoading(false);
    }
  };

  const handleSummarize = async (e) => {
    e.preventDefault();
    if (!summaryText.trim() || summaryLoading) return;
    setSummaryLoading(true);
    try {
      const res = await API.post('/ai/summarize', { title: 'User Input', content: summaryText });
      if (res.data.success) {
        setSummaryResult(res.data);
        addToast('Summary & Flashcards ready!', 'success');
      }
    } catch (err) {
      addToast('Summarize error', 'error');
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400">Next-Gen Tools</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          Learnova <span className="gradient-text">AI Super-Hub</span>
        </h1>
        <p className="text-sm text-slate-400 max-w-xl">
          Access 24/7 AI tutoring, instant practice quiz generators, customized study roadmaps, and lesson summarizers.
        </p>
      </div>

      {/* Tabs bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'tutor', label: '24/7 AI Tutor', icon: Bot },
          { id: 'quiz', label: 'AI Quiz Generator', icon: HelpCircle },
          { id: 'study-plan', label: 'AI Study Planner', icon: Calendar },
          { id: 'summarizer', label: 'Note Summarizer', icon: FileText }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
                : 'glass-panel text-slate-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: AI TUTOR */}
      {activeTab === 'tutor' && (
        <div className="glass-panel rounded-3xl p-6 border-indigo-500/30 space-y-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Contextual AI Tutor Chat</h3>
            </div>
            <div className="flex items-center gap-2">
              {['direct', 'hint', 'hinglish', 'summary'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setTutorMode(mode)}
                  className={`px-3 py-1 rounded-xl text-[10px] font-bold uppercase transition-all ${
                    tutorMode === mode ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="h-96 overflow-y-auto space-y-3 pr-2">
            {chatHistory.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                    m.role === 'user'
                      ? 'bg-indigo-600 text-white font-medium rounded-tr-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {tutorLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs text-indigo-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin" /> AI Tutor thinking...
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleTutorSubmit} className="flex items-center gap-2 pt-2 border-t border-slate-800">
            <input
              type="text"
              placeholder="Ask AI Tutor anything..."
              value={tutorMessage}
              onChange={(e) => setTutorMessage(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={tutorLoading}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: QUIZ GENERATOR */}
      {activeTab === 'quiz' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <form onSubmit={handleGenerateQuiz} className="lg:col-span-5 glass-panel p-6 rounded-3xl border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Generate Custom Practice Quiz</h3>
            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-semibold">Topic / Skill</label>
              <input
                type="text"
                required
                placeholder="e.g. MERN Middleware, Binary Trees, Docker"
                value={quizTopic}
                onChange={(e) => setQuizTopic(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-semibold">Num Questions</label>
                <select
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none"
                >
                  <option value={3}>3 Questions</option>
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-semibold">Difficulty</label>
                <select
                  value={quizDifficulty}
                  onChange={(e) => setQuizDifficulty(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={quizLoading}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {quizLoading ? 'Generating AI Questions...' : 'Generate Practice Quiz'}
            </button>
          </form>

          <div className="lg:col-span-7 space-y-4">
            {generatedQuiz ? (
              <div className="glass-panel p-6 rounded-3xl border-purple-500/30 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="text-sm font-bold text-white">{generatedQuiz.title}</h4>
                  <span className="text-xs text-purple-300 font-bold bg-purple-500/20 px-3 py-1 rounded-full">
                    {generatedQuiz.questions?.length} Questions
                  </span>
                </div>
                <div className="space-y-4">
                  {generatedQuiz.questions?.map((q, qIdx) => (
                    <div key={q._id || qIdx} className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-3">
                      <p className="text-xs font-bold text-white">Q{qIdx + 1}: {q.questionText}</p>
                      <div className="space-y-1.5">
                        {q.options?.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className={`p-2 rounded-xl text-xs border ${
                              oIdx === q.correctAnswerIndex
                                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200 font-bold'
                                : 'bg-slate-950 border-slate-800 text-slate-300'
                            }`}
                          >
                            {opt}
                          </div>
                        ))}
                      </div>
                      <p className="text-[11px] text-indigo-300 italic pt-1">💡 Explanation: {q.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="glass-panel p-12 rounded-3xl text-center text-slate-400 text-xs">
                Fill in the topic form on the left to generate an AI quiz.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: STUDY PLANNER */}
      {activeTab === 'study-plan' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <form onSubmit={handleGeneratePlan} className="lg:col-span-5 glass-panel p-6 rounded-3xl border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Create AI Study Roadmap</h3>
            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-semibold">Goal / Target Skill</label>
              <input
                type="text"
                required
                placeholder="e.g. Master Full-Stack Web Dev in 4 Weeks"
                value={planGoal}
                onChange={(e) => setPlanGoal(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-semibold">Daily Study Hours</label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={planHours}
                  onChange={(e) => setPlanHours(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-semibold">Skill Level</label>
                <select
                  value={planLevel}
                  onChange={(e) => setPlanLevel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={planLoading}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {planLoading ? 'Orchestrating Plan...' : 'Generate Roadmap'}
            </button>
          </form>

          <div className="lg:col-span-7">
            {generatedPlan ? (
              <div className="glass-panel p-6 rounded-3xl border-emerald-500/30 space-y-4">
                <h4 className="text-sm font-bold text-white">{generatedPlan.goal}</h4>
                <div className="space-y-3">
                  {generatedPlan.schedule?.map((item, idx) => (
                    <div key={idx} className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                      <h5 className="text-xs font-bold text-emerald-400">{item.title}</h5>
                      <div className="space-y-1">
                        {item.tasks?.map((t, tIdx) => (
                          <div key={tIdx} className="flex items-center justify-between text-xs text-slate-300">
                            <span>• {t.task}</span>
                            <span className="text-[10px] text-slate-500">{t.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="glass-panel p-12 rounded-3xl text-center text-slate-400 text-xs">
                Fill in your target goal on the left to view your AI study schedule.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: SUMMARIZER */}
      {activeTab === 'summarizer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <form onSubmit={handleSummarize} className="lg:col-span-5 glass-panel p-6 rounded-3xl border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white">Summarize Lesson Notes</h3>
            <textarea
              rows={8}
              required
              placeholder="Paste raw lecture transcript, notes, or article content here..."
              value={summaryText}
              onChange={(e) => setSummaryText(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={summaryLoading}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {summaryLoading ? 'Summarizing...' : 'Generate Key Points & Flashcards'}
            </button>
          </form>

          <div className="lg:col-span-7">
            {summaryResult ? (
              <div className="glass-panel p-6 rounded-3xl border-amber-500/30 space-y-4">
                <h4 className="text-sm font-bold text-amber-400">Summary</h4>
                <p className="text-xs text-slate-200 leading-relaxed">{summaryResult.summary}</p>

                <h4 className="text-sm font-bold text-indigo-400 pt-2">Key Takeaways</h4>
                <ul className="space-y-1 text-xs text-slate-300">
                  {summaryResult.keyPoints?.map((kp, i) => (
                    <li key={i} className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {kp}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="glass-panel p-12 rounded-3xl text-center text-slate-400 text-xs">
                Paste content on the left to extract key bullet points and revision flashcards.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AITutorPage;
