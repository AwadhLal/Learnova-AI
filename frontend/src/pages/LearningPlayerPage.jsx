import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Play,
  CheckCircle2,
  ChevronRight,
  Bot,
  Send,
  Sparkles,
  BookOpen,
  FileText,
  HelpCircle,
  Award,
  ArrowLeft,
  ArrowRight,
  Save,
  Clock,
  Menu,
  X,
  Star
} from 'lucide-react';

const LearningPlayerPage = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);

  // Mobile View Tab State: 'curriculum' | 'content' | 'ai-tutor'
  const [mobileTab, setMobileTab] = useState('content');

  // AI Tutor State
  const [aiInput, setAiInput] = useState('');
  const [aiMode, setAiMode] = useState('direct');
  const [aiMessages, setAiMessages] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);

  // Center Tab State: 'lesson' | 'notes'
  const [centerTab, setCenterTab] = useState('lesson');

  // Quiz Modal State
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [quizSubmitting, setQuizSubmitting] = useState(false);

  useEffect(() => {
    const fetchLearningData = async () => {
      try {
        const [courseRes, progRes] = await Promise.all([
          API.get(`/courses/${courseId}`),
          API.get(`/learning/progress/${courseId}`)
        ]);

        if (courseRes.data.success) {
          setCourse(courseRes.data.course);
          const mods = courseRes.data.course.modules || [];
          setModules(mods);

          if (mods.length > 0 && mods[0].lessons && mods[0].lessons.length > 0) {
            setActiveLesson(mods[0].lessons[0]);
          }
        }

        if (progRes.data.success) {
          setCompletedLessons(progRes.data.progress?.completedLessons || []);
          setProgressPercentage(progRes.data.progress?.percentage || 0);
        }
      } catch (err) {
        console.warn('Learning player fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLearningData();
  }, [courseId]);

  useEffect(() => {
    if (activeLesson && course) {
      setAiMessages([
        {
          role: 'assistant',
          content: `Hi ${user?.name || 'Student'}! 👋 I am tuned into **${course.title}** -> **${activeLesson.title}**. Ask me any doubt or select a mode below!`
        }
      ]);
    }
  }, [activeLesson, course]);

  const handleMarkComplete = async () => {
    if (!activeLesson) return;
    try {
      const res = await API.post('/learning/complete-lesson', {
        courseId,
        lessonId: activeLesson._id
      });
      if (res.data.success) {
        addToast('Lesson marked as complete! 🎉', 'success');
        setCompletedLessons(res.data.completedLessons || []);
        setProgressPercentage(res.data.progress?.percentage || res.data.percentage || 0);
      }
    } catch (err) {
      addToast('Failed to update progress', 'error');
    }
  };

  const handleSaveNotes = async () => {
    if (!activeLesson) return;
    try {
      const res = await API.post('/learning/notes', {
        courseId,
        lessonId: activeLesson._id,
        content: notes
      });
      if (res.data.success) {
        addToast('Notes saved successfully!', 'success');
      }
    } catch (err) {
      addToast('Failed to save notes', 'error');
    }
  };

  const handleSendAITutor = async () => {
    if (!aiInput.trim() || aiLoading || !activeLesson) return;

    const text = aiInput;
    const newMsgs = [...aiMessages, { role: 'user', content: text }];
    setAiMessages(newMsgs);
    setAiInput('');
    setAiLoading(true);

    try {
      const res = await API.post('/ai/tutor', {
        message: text,
        courseId: course._id,
        lessonId: activeLesson._id,
        courseTitle: course.title,
        lessonTitle: activeLesson.title,
        mode: aiMode
      });

      if (res.data.success) {
        setAiMessages([...newMsgs, { role: 'assistant', content: res.data.reply }]);
      }
    } catch (err) {
      setAiMessages([
        ...newMsgs,
        {
          role: 'assistant',
          content: "⚠️ Unable to contact AI Tutor service. Please ensure your backend is connected."
        }
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleOpenQuiz = async (quizId) => {
    try {
      const res = await API.get(`/quizzes/${quizId}`);
      if (res.data.success) {
        setActiveQuiz(res.data.quiz);
        setQuizAnswers({});
        setQuizResult(null);
      }
    } catch (err) {
      addToast('Failed to load quiz data', 'error');
    }
  };

  const handleOptionSelect = (questionId, optionIndex) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz) return;
    setQuizSubmitting(true);

    try {
      const formattedAnswers = Object.entries(quizAnswers).map(([qId, optIdx]) => ({
        questionId: qId,
        selectedOption: optIdx
      }));

      const res = await API.post(`/quizzes/${activeQuiz._id}/submit`, {
        userAnswers: formattedAnswers
      });

      if (res.data.success) {
        setQuizResult(res.data);
        addToast(`Quiz Completed! Score: ${res.data.score}%`, 'success');
      }
    } catch (err) {
      addToast('Error submitting quiz attempt', 'error');
    } finally {
      setQuizSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-400">Loading course environment...</div>;
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-slate-950 overflow-hidden">
      {/* Top Header Bar */}
      <div className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xs sm:text-sm font-bold text-white truncate max-w-[150px] sm:max-w-md">{course?.title}</h1>
            <span className="text-[10px] text-slate-400">Active Lesson: {activeLesson?.title || 'Overview'}</span>
          </div>
        </div>

        {/* Desktop Progress Bar & Mark Complete */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">{progressPercentage}% Complete</span>
            <div className="w-28 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all" style={{ width: `${progressPercentage}%` }} />
            </div>
          </div>

          <button
            onClick={handleMarkComplete}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              completedLessons.includes(activeLesson?._id)
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {completedLessons.includes(activeLesson?._id) ? 'Completed' : 'Mark Complete'}
          </button>
        </div>
      </div>

      {/* Mobile Tab Controls (< 768px) */}
      <div className="md:hidden flex border-b border-slate-800 bg-slate-900/90 text-xs font-bold text-slate-400">
        <button
          onClick={() => setMobileTab('curriculum')}
          className={`flex-1 py-2.5 text-center flex items-center justify-center gap-1.5 ${mobileTab === 'curriculum' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-950' : ''}`}
        >
          <BookOpen className="w-3.5 h-3.5" /> Modules
        </button>
        <button
          onClick={() => setMobileTab('content')}
          className={`flex-1 py-2.5 text-center flex items-center justify-center gap-1.5 ${mobileTab === 'content' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-950' : ''}`}
        >
          <Play className="w-3.5 h-3.5" /> Content
        </button>
        <button
          onClick={() => setMobileTab('ai-tutor')}
          className={`flex-1 py-2.5 text-center flex items-center justify-center gap-1.5 ${mobileTab === 'ai-tutor' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-950' : ''}`}
        >
          <Bot className="w-3.5 h-3.5" /> AI Tutor
        </button>
      </div>

      {/* 3-Pane Body (Responsive Container) */}
      <div className="flex-1 flex overflow-hidden">
        {/* PANE 1: LEFT SIDEBAR (Curriculum Tree) */}
        <div className={`${mobileTab === 'curriculum' ? 'flex w-full' : 'hidden'} md:flex md:w-80 bg-slate-900/90 border-r border-slate-800 flex-col overflow-hidden shrink-0`}>
          <div className="p-3 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-400" /> Curriculum Tree
            </span>
            <span className="text-[10px] text-slate-400">{modules.length} Modules</span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-3">
            {modules.map((mod) => (
              <div key={mod._id} className="space-y-1">
                <div className="p-2 text-xs font-bold text-slate-300 bg-slate-800/40 rounded-lg flex items-center justify-between">
                  <span className="truncate">{mod.title}</span>
                  {mod.quiz && (
                    <button
                      onClick={() => handleOpenQuiz(mod.quiz._id || mod.quiz)}
                      className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30 flex items-center gap-1"
                    >
                      <HelpCircle className="w-3 h-3" /> Quiz
                    </button>
                  )}
                </div>

                <div className="space-y-1 pl-2">
                  {(mod.lessons || []).map((les) => {
                    const isDone = completedLessons.includes(les._id);
                    const isActive = activeLesson?._id === les._id;

                    return (
                      <button
                        key={les._id}
                        onClick={() => {
                          setActiveLesson(les);
                          setMobileTab('content');
                        }}
                        className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between gap-2 transition-all ${
                          isActive
                            ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 font-bold'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                        }`}
                      >
                        <span className="flex items-center gap-2 truncate">
                          {isDone ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <Play className="w-3 h-3 text-slate-500 shrink-0" />
                          )}
                          <span className="truncate">{les.title}</span>
                        </span>
                        <span className="text-[10px] text-slate-500">{les.durationMinutes || 15}m</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PANE 2: CENTER CONTENT READER / VIDEO PLAYER */}
        <div className={`${mobileTab === 'content' ? 'flex' : 'hidden'} md:flex flex-1 flex-col bg-slate-950 overflow-y-auto p-4 sm:p-6 space-y-4`}>
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <button
              onClick={() => setCenterTab('lesson')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                centerTab === 'lesson' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Lesson Content
            </button>
            <button
              onClick={() => setCenterTab('notes')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                centerTab === 'notes' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> My Notes
            </button>
          </div>

          {centerTab === 'lesson' ? (
            <div className="space-y-6">
              {activeLesson?.type === 'video' ? (
                <div className="w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
                  <iframe
                    src={activeLesson.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
                    title={activeLesson.title}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                  <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-2">{activeLesson?.title}</h2>
                  <div>{activeLesson?.content || 'No text content available for this lesson.'}</div>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-panel p-6 rounded-2xl space-y-4 border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" /> Personal Notes: {activeLesson?.title}
                </h3>
                <button
                  onClick={handleSaveNotes}
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" /> Save Notes
                </button>
              </div>
              <textarea
                rows={10}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Type your notes or revision points here..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* PANE 3: RIGHT SIDEBAR (Contextual AI Tutor) */}
        <div className={`${mobileTab === 'ai-tutor' ? 'flex w-full' : 'hidden'} md:flex md:w-96 bg-slate-900/95 border-l border-slate-800 flex-col overflow-hidden shrink-0`}>
          <div className="p-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-indigo-400" />
              <span className="text-xs font-bold text-white">Learnova AI Tutor</span>
            </div>
            <span className="text-[10px] bg-purple-500/20 text-purple-300 font-extrabold px-2 py-0.5 rounded uppercase">
              {aiMode}
            </span>
          </div>

          <div className="p-2 border-b border-slate-800/80 flex flex-wrap gap-1 bg-slate-950/40">
            {[
              { id: 'direct', label: 'Direct' },
              { id: 'hint', label: 'Hints' },
              { id: 'hinglish', label: 'Hinglish 🇮🇳' },
              { id: 'summary', label: 'Summary' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setAiMode(m.id)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  aiMode === m.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {aiMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[90%] p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white font-medium rounded-tr-none'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {aiLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-indigo-400 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" /> Thinking...
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendAITutor();
            }}
            className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask doubt about this lesson..."
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={aiLoading}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* MODULE QUIZ MODAL */}
      {activeQuiz && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 border-purple-500/40 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">{activeQuiz.title}</h3>
                <p className="text-xs text-slate-400">{activeQuiz.topic} • Passing Score: {activeQuiz.passingScore || 70}%</p>
              </div>
              <button onClick={() => setActiveQuiz(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {quizResult ? (
              /* Quiz Score Result View */
              <div className="space-y-6 text-center">
                <div className="inline-flex flex-col items-center justify-center w-28 h-28 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 p-1 mx-auto">
                  <div className="w-full h-full bg-slate-950 rounded-full flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-white">{quizResult.score}%</span>
                    <span className="text-[10px] text-slate-400 font-bold">{quizResult.passed ? 'PASSED 🎉' : 'RETRY 🎯'}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300">
                  You answered <strong className="text-white">{quizResult.correctAnswersCount}</strong> out of <strong className="text-white">{quizResult.totalQuestions}</strong> questions correctly.
                </p>

                {quizResult.weakTopics && quizResult.weakTopics.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-xs text-indigo-300 space-y-1 text-left">
                    <p className="font-bold">✨ Weak Topics Identified for Practice:</p>
                    <ul className="list-disc list-inside text-slate-300">
                      {quizResult.weakTopics.map((wt, idx) => <li key={idx}>{wt}</li>)}
                    </ul>
                  </div>
                )}

                <button
                  onClick={() => setActiveQuiz(null)}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                >
                  Return to Lesson
                </button>
              </div>
            ) : (
              /* Quiz Questions Form */
              <div className="space-y-6">
                {(activeQuiz.questions || []).map((q, idx) => (
                  <div key={q._id || idx} className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <p className="text-xs font-bold text-white">Q{idx + 1}: {q.questionText}</p>
                    <div className="space-y-2">
                      {(q.options || []).map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => handleOptionSelect(q._id, oIdx)}
                          className={`w-full text-left p-3 rounded-xl text-xs border transition-all ${
                            quizAnswers[q._id] === oIdx
                              ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200 font-bold'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleSubmitQuiz}
                  disabled={quizSubmitting}
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
                >
                  {quizSubmitting ? 'Evaluating Score...' : 'Submit Quiz Attempt'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningPlayerPage;
