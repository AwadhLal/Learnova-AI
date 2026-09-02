import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import {
  Flame,
  Award,
  Clock,
  BarChart3,
  Sparkles,
  Play,
  ArrowRight,
  BookOpen,
  Calendar,
  AlertCircle,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [aiInsight, setAiInsight] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [studyPlan, setStudyPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [enRes, recRes, planRes] = await Promise.all([
          API.get('/enrollments/my'),
          API.get('/ai/recommendations'),
          API.get('/ai/study-plan/my')
        ]);

        if (enRes.data.success) setEnrollments(enRes.data.enrollments);
        if (recRes.data.success) {
          setAiInsight(recRes.data.insightMessage);
          setRecommendations(recRes.data.recommendations || []);
        }
        if (planRes.data.success) setStudyPlan(planRes.data.studyPlan);
      } catch (err) {
        console.warn('Dashboard fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return 'Good morning';
    if (hrs < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const completedCount = enrollments.filter(e => e.progressPercentage === 100).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Greeting Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 blur-3xl rounded-full pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/50 shadow-xl"
          />
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {getGreeting()} 👋, <span className="gradient-text">{user?.name}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">Here is your personalized learning overview.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10 w-full md:w-auto">
          <Link
            to="/ai-tools"
            className="flex-1 md:flex-none px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4" /> AI Tutor & Tools
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-panel p-5 rounded-3xl space-y-2 border-amber-500/30">
          <div className="flex items-center justify-between text-xs text-amber-400 font-bold">
            <span>Learning Streak</span>
            <Flame className="w-5 h-5 fill-amber-500 text-amber-500 animate-bounce" />
          </div>
          <div className="text-3xl font-black text-white">{user?.streak || 7} Days 🔥</div>
          <p className="text-[11px] text-slate-400">Keep logging in daily to maintain streak</p>
        </div>

        <div className="glass-panel p-5 rounded-3xl space-y-2 border-emerald-500/30">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
            <span>Courses Completed</span>
            <Award className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">{completedCount} / {enrollments.length}</div>
          <p className="text-[11px] text-slate-400">Verified certificates earned</p>
        </div>

        <div className="glass-panel p-5 rounded-3xl space-y-2 border-indigo-500/30">
          <div className="flex items-center justify-between text-xs text-indigo-400 font-bold">
            <span>Hours Learned</span>
            <Clock className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-white">24.5 hrs</div>
          <p className="text-[11px] text-slate-400">This month active video & text learning</p>
        </div>

        <div className="glass-panel p-5 rounded-3xl space-y-2 border-purple-500/30">
          <div className="flex items-center justify-between text-xs text-purple-400 font-bold">
            <span>Average Quiz Score</span>
            <BarChart3 className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-white">86%</div>
          <p className="text-[11px] text-slate-400">Across 12 module quiz attempts</p>
        </div>
      </div>

      {/* AI Insight Card */}
      <div className="glass-panel p-6 rounded-3xl border-2 border-indigo-500/40 bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-extrabold border border-indigo-500/30">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" /> ✨ AI Learning Insight
          </div>
          <p className="text-sm font-semibold text-white leading-relaxed">
            {aiInsight || "You are performing strongly in Java fundamentals, but your recursion performance is below your average."}
          </p>
        </div>

        <Link
          to="/ai-tools"
          className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 shrink-0 transition-all"
        >
          Practice Weak Topics
        </Link>
      </div>

      {/* Continue Learning Banner */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" /> Continue Learning
          </h2>
          <Link to="/my-courses" className="text-xs text-indigo-400 font-semibold hover:underline">View All My Courses</Link>
        </div>

        {enrollments.length === 0 ? (
          <div className="glass-panel rounded-3xl p-8 text-center space-y-4">
            <p className="text-xs text-slate-400">You haven't enrolled in any courses yet.</p>
            <Link to="/courses" className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold">
              Browse Course Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrollments.slice(0, 2).map((en) => (
              <div key={en._id} className="glass-panel p-5 rounded-3xl space-y-4 border-slate-800 flex flex-col justify-between">
                <div className="flex items-center gap-4">
                  <img src={en.course?.thumbnail} alt={en.course?.title} className="w-20 h-20 rounded-2xl object-cover shrink-0" />
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{en.course?.level || 'Intermediate'}</span>
                    <h3 className="text-sm font-bold text-white line-clamp-1">{en.course?.title}</h3>
                    <p className="text-[11px] text-slate-400">{en.completedLessonsCount || 0} lessons completed</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">Course Progress</span>
                    <span className="text-indigo-400">{en.progressPercentage || 0}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full" style={{ width: `${en.progressPercentage || 0}%` }} />
                  </div>
                </div>

                <Link
                  to={`/course/${en.course?._id}/learn`}
                  className="w-full py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white font-bold text-xs border border-indigo-500/30 text-center transition-all flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Resume Lesson
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Courses & Study Plan split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recommended for you */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" /> Recommended For You
          </h2>
          <div className="space-y-3">
            {recommendations.map((rec) => (
              <div
                key={rec._id}
                onClick={() => navigate(`/courses/${rec.slug || rec._id}`)}
                className="glass-panel glass-panel-hover p-4 rounded-2xl border-slate-800/80 flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <img src={rec.thumbnail} alt={rec.title} className="w-14 h-14 rounded-xl object-cover" />
                  <div>
                    <h4 className="text-xs font-bold text-white hover:text-indigo-300 transition-colors line-clamp-1">{rec.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{rec.subtitle || rec.description}</p>
                    <span className="text-[10px] text-emerald-400 font-semibold">₹{rec.price} • {rec.level}</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* AI Study Plan Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" /> AI Study Roadmap
            </h2>
            <Link to="/ai-tools" className="text-xs text-purple-400 font-semibold hover:underline">Update Goal</Link>
          </div>

          <div className="glass-panel p-5 rounded-3xl space-y-4 border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-xs font-bold text-white">{studyPlan?.goal || 'Full-Stack MERN & AI Mastery'}</h4>
                <p className="text-[10px] text-slate-400">{studyPlan?.availableHoursPerDay || 2} hrs/day • {studyPlan?.skillLevel || 'Beginner'}</p>
              </div>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 font-bold px-2 py-0.5 rounded">Active Plan</span>
            </div>

            <div className="space-y-3">
              {(studyPlan?.schedule || [
                { day: 1, title: 'Day 1: Express API & JWT Setup', tasks: [{ time: '30m', task: 'Review Authentication Logic', completed: true }] },
                { day: 2, title: 'Day 2: MongoDB Aggregation & AI Tutor', tasks: [{ time: '45m', task: 'Solve 2 Practice Quizzes', completed: false }] }
              ]).map((s, idx) => (
                <div key={idx} className="bg-slate-900/60 p-3 rounded-2xl space-y-2 border border-slate-800">
                  <div className="flex items-center justify-between text-xs font-bold text-indigo-300">
                    <span>{s.title}</span>
                  </div>
                  <div className="space-y-1">
                    {s.tasks.map((t, tIdx) => (
                      <div key={tIdx} className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className={`w-3.5 h-3.5 ${t.completed ? 'text-emerald-400' : 'text-slate-600'}`} />
                          {t.task}
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold">{t.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
