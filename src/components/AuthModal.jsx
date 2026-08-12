import React, { useState } from 'react';
import { X, Lock, User, Phone, Mail, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { saveUserProfile } from '../services/orderService';

export default function AuthModal({ isOpen, onClose, onSuccess, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [loginMethod, setLoginMethod] = useState('mobile'); // 'mobile' or 'email'
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanMobile = mobileNumber.trim();
    const cleanEmail = email.trim();

    if (mode === 'login') {
      if (loginMethod === 'mobile') {
        if (!cleanMobile || !/^\d{10}$/.test(cleanMobile)) {
          setErrorMsg('Please enter a valid 10-digit mobile number.');
          return;
        }
      } else {
        if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
          setErrorMsg('Please enter a valid email address.');
          return;
        }
      }
    } else {
      // Registration validation
      if (!fullName.trim()) {
        setErrorMsg('Please enter your Full Name.');
        return;
      }
      if (cleanMobile && !/^\d{10}$/.test(cleanMobile)) {
        setErrorMsg('Please enter a valid 10-digit mobile number.');
        return;
      }
      if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        setErrorMsg('Please enter a valid email address.');
        return;
      }
      if (!cleanMobile && !cleanEmail) {
        setErrorMsg('Please enter either a Mobile Number or Email Address.');
        return;
      }
      if (!location.trim()) {
        setErrorMsg('Please enter your Location / Delivery Address.');
        return;
      }
    }

    setLoading(true);

    try {
      const displayName = fullName.trim() || 
        (cleanMobile ? `Customer (${cleanMobile.slice(-4)})` : cleanEmail.split('@')[0]);

      const userPayload = {
        fullName: displayName,
        mobileNumber: cleanMobile || null,
        email: cleanEmail || null,
        loginType: loginMethod,
        location: location.trim() || 'Hyderabad, Telangana'
      };

      await saveUserProfile(userPayload);
      setLoading(false);
      onSuccess(userPayload);
      onClose();
    } catch (err) {
      setLoading(false);
      setErrorMsg('Failed to process authentication. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity animate-fadeIn"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-scaleUp">
          
          {/* Header */}
          <div className="p-6 bg-slate-950 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-8 rounded-xl bg-[#008744] text-white flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Secure Account</span>
            </div>

            <h2 className="text-xl font-black">
              {mode === 'login' ? 'Welcome Back!' : 'Create Customer Account'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Please Login or Register to continue to checkout.
            </p>
          </div>

          {/* Mode Toggle Tabs (Login vs Register) */}
          <div className="flex border-b border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={() => { setMode('login'); setErrorMsg(''); }}
              className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 ${
                mode === 'login'
                  ? 'border-[#e50914] text-[#e50914] bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrorMsg(''); }}
              className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 ${
                mode === 'register'
                  ? 'border-[#e50914] text-[#e50914] bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-bold">
                {errorMsg}
              </div>
            )}

            {/* Login Method Selector (Mobile Number vs Email Address) */}
            {mode === 'login' && (
              <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => { setLoginMethod('mobile'); setErrorMsg(''); }}
                  className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    loginMethod === 'mobile'
                      ? 'bg-white text-slate-900 shadow-sm font-extrabold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Mobile Number</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setLoginMethod('email'); setErrorMsg(''); }}
                  className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    loginMethod === 'email'
                      ? 'bg-white text-slate-900 shadow-sm font-extrabold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Address</span>
                </button>
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 text-xs rounded-xl py-2.5 pl-9 pr-3 border border-slate-200 focus:outline-none focus:border-[#008744]"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>
            )}

            {/* Input: Mobile Number */}
            {(mode === 'register' || loginMethod === 'mobile') && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number {mode === 'login' || !email ? <span className="text-red-500">*</span> : null}
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required={mode === 'login' && loginMethod === 'mobile'}
                    maxLength={10}
                    placeholder="Enter 10-digit mobile number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-slate-50 text-xs rounded-xl py-2.5 pl-9 pr-3 border border-slate-200 focus:outline-none focus:border-[#008744]"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>
            )}

            {/* Input: Email Address */}
            {(mode === 'register' || loginMethod === 'email') && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address {mode === 'login' && loginMethod === 'email' ? <span className="text-red-500">*</span> : null}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required={mode === 'login' && loginMethod === 'email'}
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 text-xs rounded-xl py-2.5 pl-9 pr-3 border border-slate-200 focus:outline-none focus:border-[#008744]"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Location / Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    rows={2}
                    required
                    placeholder="Area, City, State, Pincode"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-50 text-xs rounded-xl py-2 pl-9 pr-3 border border-slate-200 focus:outline-none focus:border-[#008744]"
                  />
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#008744] hover:bg-[#007038] text-white font-black text-xs shadow-lg shadow-emerald-700/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Login & Continue' : 'Register & Continue'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Your contact details are kept 100% private and confidential.
              </span>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}

