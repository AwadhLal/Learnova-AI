import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Play, Bot, Zap, Shield, Award, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative pt-12 pb-24 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Top Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
            <span>Learnova AI is Live • Personalized AI Tutoring Platform</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]"
          >
            Learn Smarter. <br />
            <span className="gradient-text">Grow Faster with AI.</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            Learnova AI creates personalized learning experiences powered by artificial intelligence. Master complex skills with 24/7 AI tutoring, adaptive quizzes, and automated study roadmaps.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <Link
              to="/register"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 group transition-all transform hover:-translate-y-0.5"
            >
              Start Learning Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/courses"
              className="px-8 py-4 rounded-2xl glass-panel hover:bg-slate-800/80 text-slate-200 font-semibold text-sm flex items-center gap-2 transition-all"
            >
              <Play className="w-4 h-4 text-indigo-400 fill-indigo-400" />
              Explore Courses
            </Link>
          </motion.div>

          {/* Highlights Checklist */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs text-slate-400 font-medium"
          >
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-400" /> Free Demo Account</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-indigo-400" /> 24/7 Contextual AI Tutor</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-purple-400" /> Verified Certificates</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-amber-400" /> Razorpay Test Payments</span>
          </motion.div>
        </div>

        {/* Hero Visual Card / Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-14 max-w-5xl mx-auto glass-panel rounded-3xl p-3 sm:p-5 border border-indigo-500/30 shadow-2xl relative"
        >
          <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800/80 p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Box: Active Lesson */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Live Learning Session</span>
                </div>
                <span className="text-xs text-indigo-400 font-semibold bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                  Full-Stack MERN
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">1.2 Building Scalable REST APIs with Express & JWT</h3>
              <div className="w-full h-44 bg-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center border border-slate-800">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/40 via-purple-900/20 to-transparent" />
                <div className="text-center space-y-2 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-indigo-600/90 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/50">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                  <p className="text-xs text-slate-400">Click to preview interactive video lesson</p>
                </div>
              </div>
            </div>

            {/* Right Box: AI Tutor Side Panel */}
            <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-3 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-indigo-400" />
                  <span className="text-xs font-bold text-white">Learnova AI Tutor</span>
                </div>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 font-extrabold px-2 py-0.5 rounded uppercase">Active</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="bg-slate-800/80 p-2.5 rounded-xl text-slate-300">
                  <span className="font-semibold text-indigo-300 block mb-0.5">Student Question:</span>
                  "Can you explain Express middleware in simple Hinglish with an example?"
                </div>
                <div className="bg-indigo-950/60 border border-indigo-500/30 p-2.5 rounded-xl text-slate-200">
                  <span className="font-bold text-indigo-400 flex items-center gap-1 mb-1">
                    <Sparkles className="w-3 h-3 text-indigo-400" /> AI Tutor:
                  </span>
                  "Haan bilkul! Think of middleware as a security guard at a hotel entrance. Pehle woh check karta hai ki aapke paas valid key card (JWT Token) hai ya nahi, fir aapko room mein jaane deta hai! 🏨 key handler execution sequence..."
                </div>
              </div>

              <div className="pt-2">
                <Link to="/ai-tools" className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors">
                  Try AI Tutor Live <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
