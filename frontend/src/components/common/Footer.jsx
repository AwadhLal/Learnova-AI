import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Github, Twitter, Linkedin, Mail, Shield } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-900">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 p-0.5 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-xl text-white">Learnova <span className="gradient-text">AI</span></span>
            </Link>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Learnova AI creates personalized, adaptive learning experiences powered by artificial intelligence. Master in-demand skills 3x faster with instant AI tutoring, dynamic quizzes, and automated study roadmaps.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500 transition-all">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500 transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links 1 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/courses" className="hover:text-indigo-400 transition-colors">Course Catalog</Link></li>
              <li><Link to="/ai-tools" className="hover:text-indigo-400 transition-colors">AI Tutor</Link></li>
              <li><Link to="/ai-tools" className="hover:text-indigo-400 transition-colors">AI Quiz Generator</Link></li>
              <li><Link to="/ai-tools" className="hover:text-indigo-400 transition-colors">AI Study Planner</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Portals</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/dashboard" className="hover:text-indigo-400 transition-colors">Student Portal</Link></li>
              <li><Link to="/admin/login" className="text-amber-400/90 hover:text-amber-300 font-medium flex items-center gap-1">
                <Shield className="w-3 h-3 text-amber-400" />
                Admin Panel Login
              </Link></li>
              <li><Link to="/register" className="hover:text-indigo-400 transition-colors">Student Sign Up</Link></li>
              <li><Link to="/login" className="hover:text-indigo-400 transition-colors">Student Login</Link></li>
            </ul>
          </div>

          {/* Links 3 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Company & Security</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Razorpay Test Mode Notice</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Learnova AI Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for modern AI EdTech SaaS.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
