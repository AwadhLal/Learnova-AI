import React from 'react';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const reviews = [
  {
    name: 'Rohan Sharma',
    role: 'Full-Stack Developer @ TechCorp',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    comment: 'The AI Tutor is mind-blowing! Whenever I was stuck on recursion call stacks, asking it to explain in Hinglish saved me hours of frustration.',
    rating: 5,
  },
  {
    name: 'Priya Mehta',
    role: 'AI Researcher & Data Analyst',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    comment: 'Generating instant quizzes for LLM architectures helped me prepare for my technical interviews with total confidence.',
    rating: 5,
  },
  {
    name: 'Vikram Patel',
    role: 'Computer Science Student',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    comment: 'Learnova AI built a 7-day study plan right before my midterms. I scored an A+ for the first time in algorithms!',
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-slate-950/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-extrabold uppercase tracking-wider text-pink-400">Loved by Learners</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            What Our <span className="gradient-text">Students Say</span>
          </h2>
          <p className="text-sm text-slate-400">Join thousands of students accelerating their careers with AI.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel p-6 rounded-3xl space-y-4 relative flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed">"{r.comment}"</p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-800/80">
                <img src={r.avatar} alt={r.name} className="w-10 h-10 rounded-full object-cover border border-indigo-500/40" />
                <div>
                  <h4 className="text-sm font-bold text-white">{r.name}</h4>
                  <p className="text-[11px] text-slate-400">{r.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
