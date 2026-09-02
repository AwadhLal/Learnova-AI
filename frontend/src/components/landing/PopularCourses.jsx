import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Star, Users, ArrowRight, BookOpen, Clock, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

const PopularCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await API.get('/courses?limit=6&sort=popular');
        if (res.data.success) {
          setCourses(res.data.courses);
        }
      } catch (err) {
        console.warn('Error fetching courses:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleCourseClick = (course) => {
    navigate(`/courses/${course.slug || course._id}`);
  };

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
          <div className="space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400">Curated Curriculum</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Explore Popular <span className="gradient-text">AI & Tech Courses</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Industry-aligned learning paths designed by expert software architects and AI researchers.
            </p>
          </div>
          <Link
            to="/courses"
            className="px-5 py-2.5 rounded-xl glass-panel hover:bg-slate-800 text-xs font-bold text-slate-200 flex items-center gap-2 transition-all shrink-0"
          >
            View All Courses <ArrowRight className="w-4 h-4 text-indigo-400" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-panel rounded-3xl p-4 h-80 animate-pulse bg-slate-900/40" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, idx) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => handleCourseClick(course)}
                className="glass-panel glass-panel-hover rounded-3xl overflow-hidden cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-[10px] font-bold text-indigo-300">
                      {course.level}
                    </span>
                    <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                      {course.rating}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold">
                      <Tag className="w-3.5 h-3.5" />
                      {course.category ? course.category.name : 'Software Engineering'}
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
                      {course.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {course.subtitle || course.description}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 line-through mr-2">₹{course.originalPrice || course.price * 2}</span>
                    <span className="text-lg font-black text-white">₹{course.price}</span>
                  </div>

                  <span className="text-xs font-bold text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Enroll Now <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularCourses;
