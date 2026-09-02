import React from 'react';
import { BarChart3, PieChart, Activity, Award, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const AnalyticsShowcase = () => {
  return (
    <section className="py-24 relative bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">Deep Insights</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            Comprehensive <span className="gradient-text-emerald">Learning Analytics</span>
          </h2>
          <p className="text-sm text-slate-400">
            Track your weekly study hours, quiz scores, course completion velocity, and skill progress with crystal clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-6 rounded-3xl space-y-4 border-slate-800"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Weekly Study Velocity</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-white">18.5 <span className="text-xs text-slate-400 font-normal">hrs / week</span></div>
            <p className="text-xs text-emerald-400 font-semibold">+24% increase compared to last week</p>
            {/* Visual Bars */}
            <div className="flex items-end gap-2 h-24 pt-4 border-t border-slate-800/80">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                <div key={day} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-gradient-to-t from-emerald-600 to-indigo-500 rounded-t-sm"
                    style={{ height: `${[40, 65, 30, 85, 90, 50, 75][i]}%` }}
                  />
                  <span className="text-[10px] text-slate-500">{day}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 rounded-3xl space-y-4 border-slate-800"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Average Quiz Performance</span>
              <BarChart3 className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-3xl font-black text-white">88% <span className="text-xs text-slate-400 font-normal">avg score</span></div>
            <p className="text-xs text-indigo-400 font-semibold">Passed 14 out of 15 module quizzes</p>
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">MERN Fundamentals</span>
                <span className="text-emerald-400 font-bold">92%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[92%]" />
              </div>
              <div className="flex justify-between text-xs pt-1">
                <span className="text-slate-300">Data Structures & Algo</span>
                <span className="text-indigo-400 font-bold">84%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-[84%]" />
              </div>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 rounded-3xl space-y-4 border-slate-800"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Skill Proficiency Index</span>
              <Award className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-black text-white">Level 4 <span className="text-xs text-purple-300 font-bold bg-purple-500/20 px-2 py-0.5 rounded">Advanced</span></div>
            <p className="text-xs text-purple-400 font-semibold">Top 5% student in Web Engineering</p>
            <div className="pt-4 border-t border-slate-800/80 space-y-2 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span>React 19 & Next.js Architecture</span>
                <span className="text-white font-bold">Expert</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Node.js REST API Security</span>
                <span className="text-white font-bold">Proficient</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Docker & Cloud Deployment</span>
                <span className="text-white font-bold">Intermediate</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsShowcase;
