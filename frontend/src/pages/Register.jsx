import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Sparkles, User, Mail, Lock, ArrowRight } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState('');
  const { register, verifyEmail } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await register(name, email, password);
      if (res.isUnverified) {
        setStep(2);
        addToast('Verification code sent to your email', 'success');
      } else {
        addToast('Account created successfully!', 'success');
        navigate('/dashboard');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyEmail(email, verificationCode);
      addToast('Email verified successfully! Welcome aboard.', 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast(err.response?.data?.message || 'Verification failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const res = await register(name, email, password); // Our backend logic allows calling register again to resend code if user is unverified
      addToast(res.message || 'Verification code resent', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to resend code', 'error');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full glass-panel rounded-3xl p-8 border border-slate-800/90 shadow-2xl space-y-6">
        {step === 1 ? (
          <>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-indigo-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white">Create Student Account</h2>
              <p className="text-xs text-slate-400">Join Learnova AI to unlock personalized tutoring.</p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Johnson"
                    className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Get Started Now'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-400 font-bold hover:underline">Sign In</Link>
            </div>
          </>
        ) : (
          <>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 p-0.5 flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Mail className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white">Verify Your Email</h2>
              <p className="text-xs text-slate-400">We sent a 6-digit code to <span className="text-white font-medium">{email}</span></p>
            </div>

            <form onSubmit={handleVerifySubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Verification Code</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Enter 6-digit code"
                    className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2.5 text-center text-lg tracking-[0.5em] text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || verificationCode.length !== 6}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify Email'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400 flex flex-col gap-2">
              <p>Didn't receive the code?</p>
              <button onClick={handleResend} className="text-emerald-400 font-bold hover:underline">Resend Code</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
