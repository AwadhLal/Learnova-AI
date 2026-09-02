import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Sparkles, Mail, Lock, ArrowRight, Shield } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  
  const handleResendVerification = async () => {
    try {
      // Just import API here or use fetch directly
      const { default: API } = await import('../services/api');
      await API.post('/auth/resend-verification', { email: unverifiedEmail });
      addToast('Verification code resent successfully.', 'success');
      // Redirect to register page to verify? Or just tell them to use the code.
      navigate('/register');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to resend code', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(email, password);
      addToast('Welcome back to Learnova AI!', 'success');
      if (res.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.response?.data?.isUnverified) {
        setUnverifiedEmail(email);
        addToast('Please verify your email before logging in.', 'error');
      } else {
        addToast(err.response?.data?.message || 'Login failed', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full glass-panel rounded-3xl p-8 border border-slate-800/90 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Student Sign In</h2>
          <p className="text-xs text-slate-400">Enter your email and password to access your portal.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <Link to="/forgot-password" className="text-[11px] text-indigo-400 hover:underline">Forgot password?</Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {unverifiedEmail && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center space-y-2">
            <p className="text-xs text-rose-400">Your email is not verified.</p>
            <button onClick={handleResendVerification} className="text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 px-4 py-2 rounded-lg transition-colors">
              Resend Verification Code
            </button>
          </div>
        )}

        <div className="pt-4 border-t border-slate-800 text-center space-y-2 text-xs text-slate-400">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 font-bold hover:underline">Register Free</Link>
          </p>
          <p>
            Are you an administrator?{' '}
            <Link to="/admin/login" className="text-amber-400 font-bold hover:underline inline-flex items-center gap-1">
              <Shield className="w-3 h-3 text-amber-400" /> Admin Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
