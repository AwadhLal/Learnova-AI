import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sparkles, BookOpen, User, LogOut, Sun, Moon, LayoutDashboard, Shield, Menu, X, Bot, Search } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <nav className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1">
              Learnova <span className="gradient-text font-black">AI</span>
            </span>
            <span className="block text-[10px] text-slate-400 font-medium -mt-1 tracking-wider uppercase">EdTech Platform</span>
          </div>
        </Link>

        {/* Global Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md relative mx-4">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search courses, skills, AI tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 focus:border-indigo-500 rounded-full pl-10 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none transition-all"
          />
        </form>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
          <Link to="/courses" className="text-slate-300 hover:text-indigo-400 transition-colors flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            Courses
          </Link>
          <Link to="/ai-tools" className="text-slate-300 hover:text-purple-400 transition-colors flex items-center gap-1.5">
            <Bot className="w-4 h-4 text-purple-400" />
            AI Tutor & Tools
          </Link>
          {user && user.role === 'student' && (
            <Link to="/dashboard" className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-1.5">
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              Student Portal
            </Link>
          )}
          {user && user.role === 'admin' && (
            <Link to="/admin/dashboard" className="text-amber-400 font-semibold hover:text-amber-300 transition-colors flex items-center gap-1.5 bg-amber-950/40 border border-amber-500/30 px-3 py-1 rounded-full text-xs">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              Admin Portal
            </Link>
          )}
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* User Auth Buttons or Dropdown */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-slate-800/80 transition-all border border-slate-800"
              >
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-indigo-500/50" />
                <span className="hidden sm:inline text-xs font-semibold text-slate-200 max-w-[100px] truncate">{user.name}</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 border-b border-slate-800/80">
                    <p className="text-xs font-bold text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Role: {user.role}
                    </span>
                  </div>

                  <div className="py-1">
                    {user.role === 'student' && (
                      <>
                        <Link
                          to="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                          Student Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                        >
                          <User className="w-4 h-4 text-indigo-400" />
                          My Profile
                        </Link>
                      </>
                    )}

                    {user.role === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs text-amber-300 hover:bg-amber-950/40 rounded-xl transition-colors"
                      >
                        <Shield className="w-4 h-4 text-amber-400" />
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/30 rounded-xl transition-colors mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-semibold px-4 py-2 text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-xs font-bold px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 transition-all transform active:scale-95"
              >
                Start Free
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 p-4 space-y-3 animate-in slide-in-from-top">
          <Link
            to="/courses"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 text-sm text-slate-300 hover:bg-slate-900 rounded-lg"
          >
            Browse Courses
          </Link>
          <Link
            to="/ai-tools"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2 text-sm text-purple-300 hover:bg-slate-900 rounded-lg"
          >
            AI Tutor & Tools
          </Link>
          {user && (
            <Link
              to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 text-sm text-emerald-400 hover:bg-slate-900 rounded-lg font-semibold"
            >
              Go to Portal ({user.role})
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
