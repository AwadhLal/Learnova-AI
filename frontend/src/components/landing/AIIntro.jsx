import React from 'react';
import { Bot, HelpCircle, FileText, Calendar, Sparkles, Zap, Target } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Bot,
    color: 'from-indigo-500 to-purple-500',
    title: 'Contextual 24/7 AI Tutor',
    description: 'Ask questions anytime! The AI Tutor understands your current course, module, and lesson to give step-by-step hints, simplified analogies, or explanations in Hinglish.',
  },
  {
    icon: HelpCircle,
    color: 'from-purple-500 to-pink-500',
    title: 'AI Quiz & Practice Generator',
    description: 'Generate custom quizzes on any topic with variable difficulty. Get immediate score breakdowns, detailed explanations, and weak area identification.',
  },
  {
    icon: Calendar,
    color: 'from-emerald-500 to-teal-500',
    title: 'AI Personalized Study Planner',
    description: 'Input your exam date and daily available study hours. AI automatically builds a daily study schedule with theory, practice exercises, and revision milestones.',
  },
  {
    icon: FileText,
    color: 'from-amber-500 to-orange-500',
    title: 'AI Note Summaries & Flashcards',
    description: 'Generate key point summaries, flashcards, and quick revision notes with a single click so you can revise complex subjects in minutes.',
  },
];

const AIIntro = () => {
  return (
    <section className="py-20 bg-slate-950/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Next-Gen AI Capabilities
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Supercharge Your Learning with <span className="gradient-text">AI Superpowers</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Learnova AI combines advanced Generative AI with proven educational science to adapt to your unique learning speed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel glass-panel-hover rounded-3xl p-6 relative overflow-hidden group space-y-4"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.color} p-0.5 shadow-lg`}>
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIIntro;
