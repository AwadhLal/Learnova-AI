import React, { useState } from 'react';
import { Bot, Send, Sparkles, HelpCircle, Code, MessageSquare } from 'lucide-react';
import API from '../../services/api';

const samplePrompts = [
  "Explain MongoDB Indexing in simple Hinglish",
  "Give me 2 hints to solve Recursion Tree problems",
  "Summarize JWT authentication flow in 3 bullet points"
];

const AITutorShowcase = () => {
  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! 👋 I'm your Learnova AI Tutor. Ask me any question, doubt, or problem-solving prompt from your course modules!"
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState('direct');

  const handleSend = async (textToSend) => {
    const msg = textToSend || inputMsg;
    if (!msg.trim() || loading) return;

    const newMsgs = [...messages, { role: 'user', content: msg }];
    setMessages(newMsgs);
    setInputMsg('');
    setLoading(true);

    try {
      const res = await API.post('/ai/tutor', {
        message: msg,
        topic: 'Full-Stack Architecture & AI',
        mode: activeMode
      });
      if (res.data.success) {
        setMessages([...newMsgs, { role: 'assistant', content: res.data.reply }]);
      }
    } catch (err) {
      setMessages([...newMsgs, {
        role: 'assistant',
        content: "💡 **Hint**: When building REST APIs, always validate incoming req.body before processing. Think of middleware as step 1!"
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Content */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Interactive Demo
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
              An AI Tutor That Doesn't Just <span className="gradient-text">Give Answers</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Unlike generic chatbots, Learnova AI is engineered as a true pedagogical tutor. For problem solving, it guides you with step-by-step hints before giving full answers.
            </p>

            {/* Mode Selectors */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Select Tutoring Mode:</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'direct', label: 'Direct Explanation' },
                  { id: 'hint', label: 'Hints First (Socratic)' },
                  { id: 'hinglish', label: 'Hinglish Mode 🇮🇳' },
                  { id: 'summary', label: 'Ultra-Concise' }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setActiveMode(mode.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                      activeMode === mode.id
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                        : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Buttons */}
            <div className="space-y-2 pt-2">
              <span className="text-xs text-slate-400 font-semibold block">Try sample questions:</span>
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p)}
                  className="block w-full text-left p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-indigo-500/50 transition-all"
                >
                  ✨ "{p}"
                </button>
              ))}
            </div>
          </div>

          {/* Right Live Chat Box */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-4 sm:p-6 border-indigo-500/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Learnova AI Tutor</h4>
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Online • Ready to help
                  </span>
                </div>
              </div>
              <span className="text-xs bg-indigo-500/10 text-indigo-300 font-bold px-3 py-1 rounded-full border border-indigo-500/20">
                Mode: {activeMode.toUpperCase()}
              </span>
            </div>

            {/* Chat Body */}
            <div className="h-80 overflow-y-auto space-y-3 pr-2">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
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
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-xs text-indigo-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin" /> AI Tutor is thinking...
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2 pt-2 border-t border-slate-800"
            >
              <input
                type="text"
                placeholder="Ask AI Tutor anything..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AITutorShowcase;
