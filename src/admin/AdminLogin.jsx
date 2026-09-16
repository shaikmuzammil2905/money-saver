import React, { useState, useEffect } from 'react';
import { Lock, Mail, ShieldAlert, ArrowRight, Eye, EyeOff, Sparkles, KeyRound } from 'lucide-react';
import { loginAdmin, resetAdminPassword, updateAdminPassword } from '../services/adminAuth';

export default function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [mode, setMode] = useState('login'); // 'login', 'forgot', 'reset'

  useEffect(() => {
    // Check if we're coming from a password reset email
    const params = new URLSearchParams(window.location.search);
    if (params.get('reset') === 'true' || window.location.hash.includes('type=recovery')) {
      setMode('reset');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const user = await loginAdmin(email, password);
        if (user) {
          onLoginSuccess(user);
        }
      } else if (mode === 'forgot') {
        if (!email) throw new Error('Please enter your email address.');
        await resetAdminPassword(email);
        setSuccessMsg('Password reset link sent to your email.');
        setMode('login');
      } else if (mode === 'reset') {
        if (!password) throw new Error('Please enter a new password.');
        if (password.length < 6) throw new Error('Password must be at least 6 characters long.');
        await updateAdminPassword(password);
        setSuccessMsg('Password successfully updated. You can now login.');
        setMode('login');
        setPassword('');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Operation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Glow decoration */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#e50914]/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#008744]/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#e50914] to-[#008744] text-white shadow-lg mb-4">
            {mode === 'reset' ? <KeyRound className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center justify-center gap-1">
            <span className="text-[#e50914]">OTT</span>
            <span>Money</span>
            <span className="text-[#008744]">Saver</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 font-medium">
            {mode === 'forgot' ? 'Reset Administrator Password' : 
             mode === 'reset' ? 'Set New Administrator Password' : 
             'Administrator Control Center & CMS'}
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs sm:text-sm flex flex-col gap-2">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Error</span>
                <p className="mt-0.5 text-red-300">{errorMsg}</p>
              </div>
            </div>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-200 text-xs sm:text-sm flex flex-col gap-2">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Success</span>
                <p className="mt-0.5 text-emerald-300">{successMsg}</p>
              </div>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {(mode === 'login' || mode === 'forgot') && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ottmoneysaver.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white text-sm focus:outline-none focus:border-[#008744] focus:ring-1 focus:ring-[#008744] transition-colors"
                />
              </div>
            </div>
          )}

          {(mode === 'login' || mode === 'reset') && (
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  {mode === 'reset' ? 'New Password' : 'Password'}
                </label>
                {mode === 'login' && (
                  <button 
                    type="button" 
                    onClick={() => { setMode('forgot'); setErrorMsg(''); setSuccessMsg(''); }}
                    className="text-xs text-[#008744] hover:text-emerald-400 font-semibold"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'reset' ? "Enter new password" : "••••••••••••"}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-11 pr-11 text-white text-sm focus:outline-none focus:border-[#008744] focus:ring-1 focus:ring-[#008744] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#e50914] to-[#008744] hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {mode === 'login' ? 'Sign In to Admin CMS' : 
                 mode === 'forgot' ? 'Send Reset Link' : 
                 'Set New Password'} 
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
          
          {(mode === 'forgot' || mode === 'reset') && (
            <div className="text-center mt-4">
              <button 
                type="button" 
                onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                Back to Login
              </button>
            </div>
          )}
        </form>

      </div>
    </div>
  );
}
