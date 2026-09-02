import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useToast } from '../context/ToastContext';
import { KeyRound, Mail, ArrowRight, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/forgot-password', { email });
      if (res.data.success) {
        addToast('Password reset code sent to your email!', 'success');
        setStep(2);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || '';
      if (errorMsg.includes('wait 60 seconds')) {
        addToast('A code was recently sent. Please check your email.', 'info');
        setStep(2);
      } else {
        addToast(errorMsg || 'Error requesting password reset', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/verify-reset-code', { email, code: resetCode });
      if (res.data.success) {
        addToast('Code verified! Please enter your new password.', 'success');
        setStep(3);
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Invalid or expired code', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await API.post('/auth/reset-password', { email, code: resetCode, password: newPassword });
      if (res.data.success) {
        addToast('Password reset successful! Please log in.', 'success');
        navigate('/login');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Error resetting password', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full glass-panel rounded-3xl p-8 border border-slate-800 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto">
            <KeyRound className="w-6 h-6 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Reset Password</h2>
          <p className="text-xs text-slate-400">Enter your email address to receive a password reset token link.</p>
        </div>

        {step === 1 && (
          <form onSubmit={handleRequestSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Account Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@learnova.ai"
                  className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? 'Sending Request...' : 'Send Reset Code'} <ArrowRight className="w-4 h-4" />
            </button>
            
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs text-indigo-400 font-bold hover:underline"
              >
                I already have a code
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifySubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Account Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@learnova.ai"
                  className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Enter 6-Digit Code</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="------"
                  className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-center tracking-[0.5em] text-lg text-white focus:outline-none"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading || resetCode.length !== 6}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify Code'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">New Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Confirm Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? 'Resetting...' : 'Set New Password'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          Remembered your password?{' '}
          <Link to="/login" className="text-indigo-400 font-bold hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
