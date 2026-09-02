import React from 'react';
import { Search, UserCheck, Bot, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  {
    step: '01',
    title: 'Discover & Enroll',
    description: 'Browse top-rated courses in Full-Stack, AI, Cloud, and Mobile development. Start with a single click.',
    icon: Search,
  },
  {
    step: '02',
    title: 'Learn with AI Tutor',
    description: 'Watch video lessons or read interactive modules. Ask your contextual AI tutor doubts anytime in simple terms or Hinglish.',
    icon: Bot,
  },
  {
    step: '03',
    title: 'Practice & Master',
    description: 'Generate instant AI practice quizzes, test yourself, review weak topics, and track your daily streak.',
    icon: UserCheck,
  },
  {
    step: '04',
    title: 'Earn Verified Certificate',
    description: 'Complete 100% of course curriculum and pass final mock assessments to earn shareable certificates.',
    icon: Award,
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-slate-950/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400">Simple & Effective</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            How <span className="gradient-text">Learnova AI</span> Works
          </h2>
          <p className="text-sm text-slate-400">Transform your learning journey in four seamless steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((s, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="glass-panel rounded-3xl p-6 relative space-y-4 border-slate-800/80"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black text-slate-700">{s.step}</span>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-indigo-400" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white">{s.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
