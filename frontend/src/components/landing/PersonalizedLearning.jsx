import React from 'react';
import { Target, Flame, TrendingUp, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const PersonalizedLearning = () => {
  return (
    <section className="py-24 bg-slate-950/90 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Cards Showcase */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Weak Topic Identification */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="glass-panel p-5 rounded-3xl space-y-3 border-rose-500/30"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Weak Topic Identified
                  </span>
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 font-extrabold px-2 py-0.5 rounded">Action Needed</span>
                </div>
                <h4 className="text-sm font-bold text-white">Recursion & Call Stack Overhead</h4>
                <p className="text-xs text-slate-400">Your average quiz score on Recursion is 58% (below your 84% baseline).</p>
                <div className="pt-2">
                  <button className="w-full py-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold hover:bg-rose-500/30 transition-colors">
                    Practice Weak Topic Now
                  </button>
                </div>
              </motion.div>

              {/* Card 2: Learning Streak */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="glass-panel p-5 rounded-3xl space-y-3 border-amber-500/30"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-500 fill-amber-500" /> Learning Streak
                  </span>
                  <span className="text-sm font-black text-amber-400">7 Days 🔥</span>
                </div>
                <h4 className="text-sm font-bold text-white">Consistency Bonus Unlocked!</h4>
                <p className="text-xs text-slate-400">Log in tomorrow to keep your 7-day streak active and earn the Streak Master badge.</p>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-full w-[70%]" />
                </div>
              </motion.div>
            </div>

            {/* Card 3: AI Recommendation Pill */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-panel p-5 rounded-3xl border-indigo-500/30 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" /> AI Adaptive Recommendation
                </span>
                <span className="text-xs text-emerald-400 font-semibold">98% Match</span>
              </div>
              <h4 className="text-base font-bold text-white">Recommended Course: Generative AI Architecture</h4>
              <p className="text-xs text-slate-300">
                Because you mastered Python & MERN APIs, our engine recommends taking LLM Orchestration next.
              </p>
            </motion.div>
          </div>

          {/* Right Text */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-extrabold uppercase tracking-wider text-purple-400">Personalized Learning</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
              Learning That Adapts to <span className="gradient-text">Your Brain</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              No two students learn the exact same way. Learnova AI continuously tracks quiz performance, wrong answers, and time spent on lessons to dynamically build practice sessions tailored specifically to eliminate your weak points.
            </p>
            <ul className="space-y-3 text-xs text-slate-300 font-medium">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Automatic weak-area identification & targeted drills
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" /> Streak tracking & gamified achievement rewards
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" /> Custom AI-generated study schedule synced to your exam target
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonalizedLearning;
