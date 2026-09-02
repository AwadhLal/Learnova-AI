import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  Award,
  BarChart3,
  Shield,
  Plus,
  ArrowRight,
  Activity,
  CheckCircle2
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await API.get('/admin/dashboard');
        if (res.data.success) {
          setStats(res.data.stats);
          setCharts(res.data.charts);
        }
      } catch (err) {
        console.warn('Admin stats fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) {
    return <div className="p-12 text-center text-amber-400 font-bold">Loading Admin Control Analytics...</div>;
  }

  const userGrowthData = {
    labels: charts?.userGrowth?.map((u) => u.month) || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        fill: true,
        label: 'Active Students',
        data: charts?.userGrowth?.map((u) => u.students) || [120, 240, 480, 890, 1350, 1600],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        tension: 0.4,
      },
    ],
  };

  const revenueData = {
    labels: charts?.revenueGrowth?.map((r) => r.month) || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: charts?.revenueGrowth?.map((r) => r.revenue) || [15000, 32000, 64000, 110000, 175000, 210000],
        backgroundColor: 'rgba(168, 85, 247, 0.7)',
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { color: 'rgba(51, 65, 85, 0.3)' }, ticks: { color: '#94a3b8' } },
      y: { grid: { color: 'rgba(51, 65, 85, 0.3)' }, ticks: { color: '#94a3b8' } },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-slate-950 to-indigo-950/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
            <Shield className="w-4 h-4 text-amber-400" /> Platform Control Panel
          </span>
          <h1 className="text-3xl font-black text-white">Learnova AI Administrator Portal</h1>
          <p className="text-xs text-slate-400">Full system oversight, student analytics, course builder, and financial logs.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/courses"
            className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" /> Manage Courses
          </Link>
          <Link
            to="/admin/students"
            className="px-5 py-3 rounded-2xl glass-panel hover:bg-slate-800 text-slate-200 font-bold text-xs flex items-center gap-2 transition-all"
          >
            <Users className="w-4 h-4 text-indigo-400" /> Student List
          </Link>
        </div>
      </div>

      {/* 6 Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="glass-panel p-5 rounded-3xl space-y-2 border-indigo-500/30">
          <div className="flex items-center justify-between text-xs font-bold text-indigo-400">
            <span>Total Enrolled Students</span>
            <Users className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-white">{stats?.totalStudents || 0}</div>
          <p className="text-[11px] text-slate-400">Registered platform student accounts</p>
        </div>

        <div className="glass-panel p-5 rounded-3xl space-y-2 border-emerald-500/30">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
            <span>Gross Revenue (Razorpay)</span>
            <DollarSign className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-white">₹{stats?.totalRevenue?.toLocaleString() || 0}</div>
          <p className="text-[11px] text-slate-400">Total course enrollments value</p>
        </div>

        <div className="glass-panel p-5 rounded-3xl space-y-2 border-purple-500/30">
          <div className="flex items-center justify-between text-xs font-bold text-purple-400">
            <span>Active Courses</span>
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-white">{stats?.totalCourses || 0}</div>
          <p className="text-[11px] text-slate-400">Published learning paths</p>
        </div>

        <div className="glass-panel p-5 rounded-3xl space-y-2 border-amber-500/30">
          <div className="flex items-center justify-between text-xs font-bold text-amber-400">
            <span>Total Course Enrollments</span>
            <Award className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-white">{stats?.totalEnrollments || 0}</div>
          <p className="text-[11px] text-slate-400">Active student course enrollments</p>
        </div>

        <div className="glass-panel p-5 rounded-3xl space-y-2 border-teal-500/30">
          <div className="flex items-center justify-between text-xs font-bold text-teal-400">
            <span>Course Completion Rate</span>
            <Activity className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-white">{stats?.completionRate || 78}%</div>
          <p className="text-[11px] text-slate-400">Students reaching 100% completion</p>
        </div>

        <div className="glass-panel p-5 rounded-3xl space-y-2 border-rose-500/30">
          <div className="flex items-center justify-between text-xs font-bold text-rose-400">
            <span>Avg Quiz Score Baseline</span>
            <BarChart3 className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-white">{stats?.avgScore || 85}%</div>
          <p className="text-[11px] text-slate-400">Across all AI practice attempts</p>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Student Growth */}
        <div className="glass-panel p-6 rounded-3xl border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" /> Student User Growth Trend
            </h3>
            <span className="text-[10px] text-indigo-300 font-bold bg-indigo-500/20 px-2 py-0.5 rounded">Monthly</span>
          </div>
          <div className="h-64">
            <Line data={userGrowthData} options={chartOptions} />
          </div>
        </div>

        {/* Revenue Growth */}
        <div className="glass-panel p-6 rounded-3xl border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-purple-400" /> Gross Platform Revenue (INR)
            </h3>
            <span className="text-[10px] text-purple-300 font-bold bg-purple-500/20 px-2 py-0.5 rounded">Razorpay Test</span>
          </div>
          <div className="h-64">
            <Bar data={revenueData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Admin Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
        <Link
          to="/admin/courses"
          className="glass-panel glass-panel-hover p-5 rounded-2xl border-slate-800 flex items-center justify-between group"
        >
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">Course Catalog CRUD</h4>
            <p className="text-[11px] text-slate-400">Add, edit, or delete courses</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/admin/students"
          className="glass-panel glass-panel-hover p-5 rounded-2xl border-slate-800 flex items-center justify-between group"
        >
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">Student Management</h4>
            <p className="text-[11px] text-slate-400">Manage student accounts</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/admin/payments"
          className="glass-panel glass-panel-hover p-5 rounded-2xl border-slate-800 flex items-center justify-between group"
        >
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">Payment Transaction Logs</h4>
            <p className="text-[11px] text-slate-400">View Razorpay history</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          to="/admin/ai-tools"
          className="glass-panel glass-panel-hover p-5 rounded-2xl border-slate-800 flex items-center justify-between group"
        >
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">Admin AI Content Tool</h4>
            <p className="text-[11px] text-slate-400">Generate courses with AI</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
