/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Store, Phone, Lock, Eye, EyeOff, AlertCircle, Sparkles } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (ownerName: string, storeName: string, mobileNum: string) => void;
  onNavigateToSignup: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onNavigateToSignup }) => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotMobile, setForgotMobile] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile || !password) {
      setError('Please fill in both mobile number and password.');
      return;
    }
    if (mobile.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setError('');
    // Successful simulation logic, defaults if the user just submits
    const store = "Apna Kirana Store";
    const name = "Suresh Patel";
    onLoginSuccess(name, store, mobile);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotMobile || forgotMobile.length < 10) {
      alert('Please enter a valid 10-digit registered mobile number.');
      return;
    }
    setResetSuccess(true);
    setTimeout(() => {
      setForgotPasswordOpen(false);
      setResetSuccess(false);
    }, 2000);
  };

  return (
    <div className="w-full h-full bg-slate-50 flex flex-col justify-between overflow-y-auto overflow-x-hidden selection:bg-blue-100">
      
      {/* Header Accent */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 px-6 pt-10 pb-12 text-white text-center relative">
        <div className="absolute top-4 right-4 bg-white/15 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold">
          v1.4 MOCK
        </div>
        <div className="mx-auto w-14 h-14 bg-white text-blue-600 rounded-2xl flex items-center justify-center shadow-lg mb-3">
          <Store className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-white select-none">SmartKirana</h2>
        <p className="text-blue-100 text-xs">Manage products, bill faster, analyze revenue</p>
      </div>

      {/* Main Form Fields Container */}
      <div className="px-6 -mt-6 flex-1">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-1">Welcome Shop Owner!</h3>
          <p className="text-xs text-slate-400 mb-5">Login with your registered mobile credentials</p>

          <form onSubmit={handleSubmit} className="space-on-y">
            {error && (
              <div className="flex items-start gap-2 bg-rose-50 text-rose-700 text-xs p-3 rounded-lg border border-rose-100 mb-4 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Mobile Number Entry */}
            <div className="mb-4">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Registered Mobile</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400">
                  <Phone size={16} />
                </span>
                <span className="absolute left-9 top-2.5 text-slate-400 text-sm font-semibold select-none border-r border-slate-200 pr-2">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="9876543210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-sm py-2 px-3 bg-slate-50/70 hover:bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all pl-20 pr-3 font-semibold text-slate-700"
                />
              </div>
            </div>

            {/* Password Entry */}
            <div className="mb-4">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Security Password</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400">
                  <Lock size={16} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-sm py-2 px-3 bg-slate-50/70 hover:bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all pl-10 pr-10 font-semibold text-slate-700"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end mb-6">
              <button
                type="button"
                onClick={() => setForgotPasswordOpen(true)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            {/* Action Trigger */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-800 hover:to-indigo-700 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles size={14} className="text-emerald-300" />
              <span>Login to SmartKirana</span>
            </button>
          </form>
        </div>

        {/* Demo Helper Prompt Box */}
        <div className="mt-4 bg-sky-50 border border-sky-100 rounded-xl p-3 text-[11px] text-sky-800 flex flex-col gap-1">
          <p className="font-bold">✨ Quick Access Tip</p>
          <p>Any 10-digit mobile and password combination works for this interactive mock prototype flow!</p>
        </div>
      </div>

      {/* Footer Registration Hook */}
      <div className="py-6 text-center border-t border-slate-100 bg-white">
        <p className="text-xs text-slate-500">
          New store owner?{' '}
          <button
            onClick={onNavigateToSignup}
            className="font-bold text-emerald-600 hover:text-emerald-700 underline transition-colors cursor-pointer"
          >
            Create New Account
          </button>
        </p>
      </div>

      {/* Mock Forgot Password Popup Dialog */}
      {forgotPasswordOpen && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-5 z-50">
          <div className="bg-white rounded-2xl w-full max-w-[340px] p-5 shadow-2xl animate-fade-in">
            <h4 className="text-md font-bold text-slate-800 mb-1">Reset Password Request</h4>
            <p className="text-xs text-slate-500 mb-4">Enter your registered shop mobile number to receive a temporary recovery PIN via SMS.</p>

            {resetSuccess ? (
              <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-center text-xs font-semibold border border-emerald-100 animate-pulse">
                📨 Reset PIN has been sent successfully via SMS to +91 {forgotMobile}!
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="Enter 10-digit mobile"
                  required
                  value={forgotMobile}
                  onChange={(e) => setForgotMobile(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-bold focus:bg-white outline-none"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setForgotPasswordOpen(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 rounded-xl shadow-md transition-colors cursor-pointer"
                  >
                    Request PIN
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
