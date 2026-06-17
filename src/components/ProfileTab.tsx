/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Store, 
  User, 
  Phone, 
  Mail, 
  CreditCard, 
  HelpCircle, 
  Bell, 
  ChevronRight, 
  LogOut, 
  Info, 
  CheckCircle,
  X,
  Sparkles,
  Camera,
  MapPin,
  ShieldCheck,
  Edit2,
  Check,
  Target,
  Sun,
  Moon
} from 'lucide-react';

interface ProfileTabProps {
  storeName: string;
  ownerName: string;
  mobile: string;
  dailySalesTarget: number;
  onUpdateDailyTarget: (target: number) => void;
  onLogout: () => void;
  onOpenHelp: () => void;
  onOpenNotifications: () => void;
  onOpenSubscription: () => void;
  onUpdateStoreDetails: (owner: string, shop: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  storeName,
  ownerName,
  mobile,
  dailySalesTarget,
  onUpdateDailyTarget,
  onLogout,
  onOpenHelp,
  onOpenNotifications,
  onOpenSubscription,
  onUpdateStoreDetails,
  theme,
  onToggleTheme
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempOwner, setTempOwner] = useState(ownerName);
  const [tempStore, setTempStore] = useState(storeName);

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempOwner || !tempStore) {
      alert('Please fill out all fields.');
      return;
    }
    onUpdateStoreDetails(tempOwner, tempStore);
    setIsEditing(false);
    alert('SmartKirana store details updated successfully.');
  };

  return (
    <div className="w-full h-full bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 overflow-y-auto pb-24 select-none transition-colors duration-200">
      
      {/* 1. Header Profile Banner Accent */}
      <div className="bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-950 px-5 pt-8 pb-14 text-white text-center relative flex flex-col items-center">
        {/* Animated Background Highlights */}
        <div className="absolute top-0 inset-x-0 bottom-0 bg-radial-gradient from-white/10 to-transparent blur-2xl"></div>

        {/* User initials bubble avatar */}
        <div className="w-20 h-20 bg-white/15 dark:bg-slate-800/40 backdrop-blur-md rounded-full border-[3px] border-white dark:border-slate-750 flex items-center justify-center relative mb-3 shadow-lg group">
          <span className="text-2xl font-black tracking-wider text-white">
            {ownerName.split(' ').map(n => n[0]).join('')}
          </span>
          <div className="absolute bottom-0 right-0 h-6 w-6 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-850 flex items-center justify-center text-white scale-100">
            <Check size={11} className="stroke-[3]" />
          </div>
        </div>

        <h2 className="text-md font-black tracking-tight text-white mb-0.5">{storeName}</h2>
        <p className="text-xs text-blue-100/90 dark:text-slate-300 font-medium">Owner: {ownerName}</p>
        
        {/* Subscription level tag badge */}
        <span 
          onClick={onOpenSubscription}
          className="text-[9px] uppercase tracking-wider font-extrabold bg-amber-400 text-slate-900 border border-amber-300 px-3 py-1 rounded-full mt-3.5 flex items-center gap-1 shadow-sm font-sans animate-pulse hover:bg-amber-300 cursor-pointer"
        >
          <Sparkles size={10} /> Smart-Premium active
        </span>
      </div>

      {/* 2. Settings list options */}
      <div className="px-4 -mt-8 space-y-4 relative z-10">
        
        {/* Profile Card details section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-4 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors duration-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">Store Credentials</h3>
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs text-blue-500 dark:text-blue-400 hover:text-blue-750 dark:hover:text-blue-305 flex items-center gap-0.5 font-bold cursor-pointer"
            >
              <Edit2 size={11} /> Edit Info
            </button>
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-3">
              <span className="text-slate-400 dark:text-slate-500 min-w-[20px]"><Store size={14} /></span>
              <div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase leading-none mb-1">Kirana Store Title</p>
                <p className="text-xs font-bold text-slate-800 dark:text-white">{storeName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-slate-50 dark:border-slate-800/65 pt-2.5">
              <span className="text-slate-400 dark:text-slate-500 min-w-[20px]"><User size={14} /></span>
              <div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase leading-none mb-1">Owner Name</p>
                <p className="text-xs font-bold text-slate-800 dark:text-white">{ownerName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-slate-50 dark:border-slate-800/65 pt-2.5">
              <span className="text-slate-400 dark:text-slate-500 min-w-[20px]"><Phone size={14} /></span>
              <div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase leading-none mb-1">Registered Mobile</p>
                <p className="text-xs font-bold text-slate-800 dark:text-white">+91 {mobile}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-slate-50 dark:border-slate-800/65 pt-2.5">
              <span className="text-slate-400 dark:text-slate-500 min-w-[20px]"><MapPin size={14} /></span>
              <div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase leading-none mb-1">Store Address</p>
                <p className="text-xs font-bold text-slate-800 dark:text-white">Huda Galleria Retail, Sector 15, Gurugram</p>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Sales Target Config Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-4 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors duration-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <span className="text-blue-500 dark:text-blue-400"><Target size={14} /></span>
              <span>Daily Sales Target</span>
            </h3>
            <span className="text-[10px] bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-350 font-extrabold px-1.5 py-0.5 rounded-full">
              ₹{dailySalesTarget} Goal
            </span>
          </div>

          <div className="space-y-3 pt-1">
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-normal leading-relaxed">
              Set or adjust the sales target for Apna Kirana Store. Your daily progress bar on the Home tab will update automatically.
            </p>
            
            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500 font-bold">₹</span>
                <input
                  type="number"
                  min={100}
                  step={100}
                  value={dailySalesTarget || ''}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    onUpdateDailyTarget(isNaN(val) ? 0 : val);
                  }}
                  className="w-full text-xs pl-6 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl outline-none font-bold text-slate-800 dark:text-white focus:bg-white dark:focus:bg-slate-850 focus:border-blue-500"
                  placeholder="Set target (e.g., 2000)"
                />
              </div>

              {/* Instant preset increments */}
              <div className="flex gap-1.5">
                {[1000, 2000, 5005].map((preset) => {
                  const displayLabel = preset === 5005 ? "5000" : preset;
                  const valueToSet = preset === 5005 ? 5000 : preset;
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => onUpdateDailyTarget(valueToSet)}
                      className={`px-2.5 py-2.5 text-[10px] font-black rounded-xl border transition-all cursor-pointer ${
                        dailySalesTarget === valueToSet
                          ? 'bg-blue-600 text-white border-blue-600 dark:bg-blue-700 dark:border-blue-700'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750'
                      }`}
                    >
                      ₹{(valueToSet / 1000).toFixed(0)}k
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Action Click Modules */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden text-xs transition-colors duration-200">
          
          {/* Theme Switcher Toggle Switch */}
          <div className="w-full py-3.5 px-4 flex justify-between items-center border-b border-slate-100 dark:border-slate-800 text-left">
            <span className="flex items-center gap-3 font-bold text-slate-750 dark:text-slate-300">
              <span className="text-blue-500 dark:text-blue-400">
                {theme === 'dark' ? <Moon size={15} /> : <Sun size={15} />}
              </span>
              <span>Theme Appearance</span>
            </span>
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                {theme === 'dark' ? 'Dark theme' : 'Light theme'}
              </span>
              <button
                type="button"
                onClick={onToggleTheme}
                aria-label="Toggle App Appearance Theme"
                className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-300 focus:outline-none flex items-center cursor-pointer ${
                  theme === 'dark' ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                    theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Notifications logs click-tile */}
          <button
            onClick={onOpenNotifications}
            className="w-full py-3.5 px-4 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-850/50 border-b border-slate-100 dark:border-slate-800 text-left cursor-pointer transition-colors"
          >
            <span className="flex items-center gap-3 font-bold text-slate-700 dark:text-slate-300">
              <span className="text-blue-500 dark:text-blue-400"><Bell size={15} /></span>
              <span>Push Notification System</span>
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-350 font-black px-1.5 py-0.5 rounded-full">New Alerts</span>
              <ChevronRight size={14} className="text-slate-400 dark:text-slate-500" />
            </div>
          </button>

          {/* Premium Subscriptions click-tile */}
          <button
            onClick={onOpenSubscription}
            className="w-full py-3.5 px-4 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-850/50 border-b border-slate-100 dark:border-slate-800 text-left cursor-pointer transition-colors"
          >
            <span className="flex items-center gap-3 font-bold text-slate-700 dark:text-slate-300">
              <span className="text-amber-500 dark:text-amber-400"><CreditCard size={15} /></span>
              <span>Smart Subscription Plan</span>
            </span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 font-mono">₹99/M active</span>
              <ChevronRight size={14} className="text-slate-400 dark:text-slate-500" />
            </div>
          </button>

          {/* FAQs and help support click-tile */}
          <button
            onClick={onOpenHelp}
            className="w-full py-3.5 px-4 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-850/50 border-b border-slate-100 dark:border-slate-800 text-left cursor-pointer transition-colors"
          >
            <span className="flex items-center gap-3 font-bold text-slate-700 dark:text-slate-300">
              <span className="text-emerald-500 dark:text-emerald-400"><HelpCircle size={15} /></span>
              <span>Help & Store FAQS</span>
            </span>
            <ChevronRight size={14} className="text-slate-400 dark:text-slate-500" />
          </button>

          {/* Legal security disclaimer */}
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-850/40 border-b border-slate-100 dark:border-slate-800 flex items-start gap-2.5">
            <span className="text-slate-400 dark:text-slate-500 mt-0.5 shrink-0"><ShieldCheck size={14} /></span>
            <p className="text-[10.5px] text-slate-500 dark:text-slate-405 leading-tight">
              Privacy Policy and secure retail logs are encrypted on-device. No data gets shared with third party systems.
            </p>
          </div>

        </div>

        {/* 4. Logout trigger Button */}
        <button
          onClick={onLogout}
          className="w-full bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 font-extrabold text-xs py-3 rounded-2xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-rose-100 dark:border-rose-900/30"
        >
          <LogOut size={13} />
          <span>Logout of SmartKirana</span>
        </button>

      </div>

      {/* Edit Details Popup Dialog Overlay */}
      {isEditing && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-5 z-[200]">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-[340px] p-5 shadow-2xl animate-scale-up border dark:border-slate-800 text-slate-800 dark:text-slate-200">
            <h3 className="text-md font-bold text-slate-800 dark:text-white mb-1">Edit Shop Credentials</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Modify the parameters displayed on receipts</p>

            <form onSubmit={handleSaveDetails} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">Kirana Store Title</label>
                <input
                  type="text"
                  required
                  value={tempStore}
                  onChange={(e) => setTempStore(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-750 rounded-xl focus:bg-white dark:focus:bg-slate-850 outline-none font-bold text-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">Owner Name</label>
                <input
                  type="text"
                  required
                  value={tempOwner}
                  onChange={(e) => setTempOwner(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-750 rounded-xl focus:bg-white dark:focus:bg-slate-850 outline-none font-bold text-slate-700 dark:text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-500 dark:text-slate-400 font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer shadow-md"
                >
                  Save Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
