import React, { useState } from 'react';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Sparkles, Bot, Shield, CheckCircle2, Copy } from 'lucide-react';

const AdminAITools = () => {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('Intermediate');
  const [generatedContent, setGeneratedContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim() || loading) return;
    setLoading(true);

    try {
      const res = await API.post('/ai/admin-generate', { title: topic, level });
      if (res.data.success) {
        setGeneratedContent(res.data.generated);
        addToast('AI Curriculum & Quiz Content Generated!', 'success');
      }
    } catch (err) {
      addToast('AI Generation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="space-y-1">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
          <Shield className="w-3.5 h-3.5" /> AI Authoring Suite
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-white">Administrator Course AI Generator</h1>
        <p className="text-xs text-slate-400">Generate complete course outlines, learning objectives, modules, and quiz questions instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <form onSubmit={handleGenerate} className="lg:col-span-5 glass-panel p-6 rounded-3xl border-amber-500/30 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" /> AI Generator Parameters
          </h3>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Course Subject / Topic</label>
            <input
              type="text"
              required
              placeholder="e.g. Advanced Docker & Kubernetes Microservices"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Target Skill Level</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? 'AI Architecting Curriculum...' : 'Generate Full Course Structure'}
          </button>
        </form>

        <div className="lg:col-span-7">
          {generatedContent ? (
            <div className="glass-panel p-6 rounded-3xl border-indigo-500/30 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-extrabold px-2 py-0.5 rounded uppercase">AI Draft Ready</span>
                <h4 className="text-lg font-bold text-white mt-1">{generatedContent.title}</h4>
                <p className="text-xs text-slate-300">{generatedContent.subtitle}</p>
              </div>

              <div className="space-y-2">
                <h5 className="text-xs font-bold text-indigo-400">Learning Objectives</h5>
                <ul className="space-y-1 text-xs text-slate-300">
                  {generatedContent.learningObjectives?.map((obj, i) => (
                    <li key={i} className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {obj}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <h5 className="text-xs font-bold text-purple-400">Generated Modules Outline</h5>
                <div className="space-y-2">
                  {generatedContent.modules?.map((m, i) => (
                    <div key={i} className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs text-white">
                      <span className="font-bold text-indigo-300 block">{m.title}</span>
                      <span className="text-[11px] text-slate-400">{m.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-3xl text-center text-slate-400 text-xs">
              Enter a subject on the left and click Generate to produce complete AI curriculum drafts.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAITools;
