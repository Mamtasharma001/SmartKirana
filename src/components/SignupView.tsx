/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Store, User, Phone, Mail, Lock, AlertCircle, ShoppingBag } from 'lucide-react';

interface SignupViewProps {
  onSignupSuccess: (ownerName: string, storeName: string, mobileNum: string) => void;
  onNavigateToLogin: () => void;
}

export const SignupView: React.FC<SignupViewProps> = ({ onSignupSuccess, onNavigateToLogin }) => {
  const [storeName, setStoreName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName || !ownerName || !mobile || !email || !password) {
      setError('Please fill in all requested fields.');
      return;
    }
    if (mobile.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setError('');
    // Complete registration
    onSignupSuccess(ownerName, storeName, mobile);
  };

  return (
    <div className="w-full h-full bg-slate-50 flex flex-col justify-between overflow-y-auto overflow-x-hidden select-none selection:bg-emerald-100">
      
      {/* Header Blue Gradient Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-blue-600 px-6 pt-8 pb-10 text-white text-center relative">
        <h2 className="text-xl font-extrabold tracking-tight">Register Store</h2>
        <p className="text-emerald-100 text-xs">Join SmartKirana & streamline your retail business</p>
      </div>

      {/* Main Registration Box */}
      <div className="px-5 -mt-6 flex-1">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-5 border border-slate-100">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="flex items-start gap-2 bg-rose-50 text-rose-700 text-xs p-3 rounded-lg border border-rose-100 mb-4">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Store Name Input */}
            <div className="mb-3.5">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Kirana Store Name</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400">
                  <ShoppingBag size={14} />
                </span>
                <input
                  type="text"
                  placeholder="e.g. Balaji Grocery & Fresh"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full text-xs py-2 px-3 bg-slate-50/70 hover:bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all pl-9 font-semibold text-slate-700"
                />
              </div>
            </div>

            {/* Owner Name Input */}
            <div className="mb-3.5">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Owner / Manager Name</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400">
                  <User size={14} />
                </span>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full text-xs py-2 px-3 bg-slate-50/70 hover:bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all pl-9 font-semibold text-slate-700"
                />
              </div>
            </div>

            {/* Mobile Number Input */}
            <div className="mb-3.5">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">10-Digit Mobile No.</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400">
                  <Phone size={14} />
                </span>
                <span className="absolute left-8 top-2.5 text-slate-400 text-xs font-semibold select-none border-r border-slate-200 pr-1.5">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="9876543210"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-xs py-2 px-3 bg-slate-50/70 hover:bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all pl-17 font-semibold text-slate-700"
                />
              </div>
            </div>

            {/* Email Address Input */}
            <div className="mb-3.5">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Shop Email Address</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400">
                  <Mail size={14} />
                </span>
                <input
                  type="email"
                  placeholder="ramesh@gmail.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs py-2 px-3 bg-slate-50/70 hover:bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all pl-9 font-semibold text-slate-700"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-6">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Define Password</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400">
                  <Lock size={14} />
                </span>
                <input
                  type="password"
                  placeholder="Define secure password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs py-2 px-3 bg-slate-50/70 hover:bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all pl-9 font-semibold text-slate-700"
                />
              </div>
            </div>

            {/* Create Account Action Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Store size={14} className="text-emerald-200" />
              <span>Register & Start Store</span>
            </button>
          </form>
        </div>
      </div>

      {/* Footer Navigate back to Login */}
      <div className="py-5 text-center border-t border-slate-100 bg-white">
        <p className="text-xs text-slate-500">
          Already have an account?{' '}
          <button
            onClick={onNavigateToLogin}
            className="font-bold text-blue-600 hover:text-blue-700 underline transition-colors cursor-pointer"
          >
            Log in here
          </button>
        </p>
      </div>

    </div>
  );
};
