import React, { useState } from 'react';
import { Lock, Mail, ShieldAlert, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';
import { loginAdmin } from '../services/adminAuth';

export default function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('admin@ottmoneysaver.com');
  const [password, setPassword] = useState('OMS_Admin@2026#ChangeMe');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const user = await loginAdmin(email, password);
      if (user) {
        onLoginSuccess(user);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
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
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center justify-center gap-1">
            <span className="text-[#e50914]">OTT</span>
            <span>Money</span>
            <span className="text-[#008744]">Saver</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 font-medium">
            Administrator Control Center & CMS
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs sm:text-sm flex flex-col gap-2">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Authentication Failed</span>
                <p className="mt-0.5 text-red-300">{errorMsg}</p>
              </div>
            </div>
            
            {errorMsg.toLowerCase().includes('confirm') && (
              <div className="mt-2 pt-2 border-t border-red-800/50 text-[11px] text-slate-300 space-y-1.5">
                <span className="font-bold text-amber-400">💡 How to fix this in 10 seconds:</span>
                <ol className="list-decimal list-inside space-y-1 pl-1">
                  <li>Go to your <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-[#008744] hover:underline font-bold">Supabase Dashboard</a></li>
                  <li>Go to <span className="font-semibold text-white">Authentication</span> → <span className="font-semibold text-white">Providers</span> → <span className="font-semibold text-white">Email</span></li>
                  <li>Turn <span className="text-red-400 font-bold">OFF</span> the toggle for <span className="underline">"Confirm email"</span> and click <span className="font-bold text-white">Save</span></li>
                  <li>Go to <span className="font-semibold text-white">Users</span>, delete <span className="font-mono text-white">admin@ottmoneysaver.com</span>, and sign in again!</li>
                </ol>
              </div>
            )}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#e50914] to-[#008744] hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Authenticating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Sign In to Admin CMS <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </form>

        {/* Testing Info Notice */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/60 border border-slate-700/60 text-slate-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Default Email: admin@ottmoneysaver.com</span>
          </div>
        </div>

      </div>
    </div>
  );
}
