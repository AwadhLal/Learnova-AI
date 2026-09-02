import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 border border-indigo-500/40 shadow-2xl text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6 text-indigo-300 animate-spin" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-2xl mx-auto">
            Ready to Experience the <span className="gradient-text">Future of Education?</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Start learning today with personalized AI tutoring, real-world project modules, and instant practice feedback.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 rounded-2xl bg-white text-slate-950 font-extrabold text-sm hover:bg-slate-100 shadow-xl shadow-white/10 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/admin/login"
              className="px-6 py-4 rounded-2xl glass-panel hover:bg-slate-900 text-slate-200 font-semibold text-xs transition-all"
            >
              Admin Portal Access
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
