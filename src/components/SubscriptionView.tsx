/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Check, X, ShieldAlert, Award, CreditCard, Receipt, TrendingUp, History } from 'lucide-react';

interface SubscriptionViewProps {
  onClose: () => void;
}

export const SubscriptionView: React.FC<SubscriptionViewProps> = ({ onClose }) => {
  const proFeatures = [
    "Unlimited GST invoices",
    "Digital Thermal POS printable receipts",
    "50+ product catalog space",
    "Weekly & Monthly graphs analytics",
    "Instant Low Stock Push Warnings",
    "Multiple Payment methods support",
    "Customizable store credentials info",
    "Local offline database backup",
    "Priority WhatsApp Help & support"
  ];

  return (
    <div className="absolute inset-0 bg-white z-[150] flex flex-col overflow-hidden animate-fade-in select-none">
      
      {/* Dynamic colorful Header */}
      <div className="bg-gradient-to-r from-indigo-700 to-blue-600 text-white px-5 py-4 shadow-sm flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <Award size={18} className="text-amber-300 animate-pulse" />
          <div>
            <h2 className="text-base font-extrabold tracking-tight">Active Subscription</h2>
            <p className="text-[9.5px] text-blue-100">SmartPro Tier Membership Services</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 bg-indigo-800 rounded-full text-white cursor-pointer"
        >
          <X size={15} />
        </button>
      </div>

      {/* Main Container body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        
        {/* active plan card */}
        <div className="bg-gradient-to-tr from-[#1E293B] to-[#334155] text-white p-5 rounded-2xl relative overflow-hidden shadow-lg border border-slate-700">
          {/* background highlights shape */}
          <div className="absolute right-0 bottom-0 w-24 h-24 bg-blue-500 rounded-full blur-3xl opacity-20"></div>

          <div className="flex justify-between items-start">
            <div>
              <span className="text-[8px] uppercase tracking-widest font-black bg-amber-400 text-slate-900 border border-amber-300 px-2 rounded">
                Active Store Plan
              </span>
              <h3 className="text-lg font-black tracking-tight mt-1.5 flex items-center gap-1">
                SmartPro Premium <Sparkles size={14} className="text-amber-400" />
              </h3>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-white">₹99</span>
              <span className="text-[10px] text-slate-300 block leading-tight">/ Month</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-300/90 mt-3 leading-snug">
            Your membership is fully active and automatically configured. Renewal processed securely on <span className="font-bold text-white">June 10, 2026</span> via UPI Auto-Pay.
          </p>

          <div className="flex gap-4 border-t border-slate-700/50 pt-3.5 mt-3.5 text-[10px] text-slate-300">
            <div>
              <p className="uppercase text-[8px] text-slate-400">Next Due Date</p>
              <p className="font-bold text-white mt-0.5">June 10, 2026</p>
            </div>
            <div>
              <p className="uppercase text-[8px] text-slate-400">Payment Channel</p>
              <p className="font-bold text-white mt-0.5">BHIM UPI Autopay</p>
            </div>
          </div>
        </div>

        {/* Feature inclusions checklist */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3">Included SmartPro Privileges</h3>
          
          <div className="grid grid-cols-1 gap-2.5">
            {proFeatures.map((f, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs text-slate-600 font-semibold text-[11.5px]">
                <div className="w-4 h-4 bg-emerald-50 rounded-full flex items-center justify-center shrink-0 border border-emerald-200">
                  <Check size={10} className="text-emerald-500 stroke-[3]" />
                </div>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mock Plan details upgrade cards for demo purpose */}
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-start gap-3">
          <CreditCard className="text-blue-600 shrink-0 mt-0.5" size={18} />
          <div>
            <h4 className="text-xs font-black text-blue-800 leading-tight">Manage Billing Channels</h4>
            <p className="text-[10.5px] text-blue-700/90 leading-snug mt-1">
              To cancel automations, modify GST settings, or shift subscription channels, please reach out to your respective district distributor or email payments@smartkirana.co
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
