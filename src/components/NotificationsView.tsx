/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Bell, X, AlertTriangle, Sparkles, Calendar, BadgeAlert, CheckCircle, Trash2 } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsViewProps {
  notifications: NotificationItem[];
  onClose: () => void;
  onClearAll: () => void;
  onMarkRead: (id: string) => void;
  onNavigateToStock: () => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onClose,
  onClearAll,
  onMarkRead,
  onNavigateToStock
}) => {
  return (
    <div className="absolute inset-0 bg-white z-[150] flex flex-col overflow-hidden animate-fade-in select-none">
      
      {/* Blue Header Section */}
      <div className="bg-blue-600 text-white px-5 py-4 shadow-sm flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-emerald-300 animate-swing" />
          <div>
            <h2 className="text-base font-extrabold tracking-tight">Notification Center</h2>
            <p className="text-[9.5px] text-blue-100">Live operational alerts & milestone logs</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 bg-blue-700 hover:bg-blue-800 rounded-full text-white cursor-pointer"
        >
          <X size={15} />
        </button>
      </div>

      {/* Action panel to Clear notifications */}
      <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-100 flex justify-between items-center text-[10px] uppercase font-black tracking-wider text-slate-500 shrink-0">
        <span>Active Alerts: {notifications.length} logs</span>
        {notifications.length > 0 && (
          <button 
            type="button"
            onClick={onClearAll} 
            className="text-rose-600 hover:underline flex items-center gap-0.5"
          >
            <Trash2 size={11} /> Clear All Logs
          </button>
        )}
      </div>

      {/* Notifications Scroll view */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 px-6">
            <CheckCircle className="w-12 h-12 text-emerald-500 mb-3 animate-pulse" />
            <h3 className="text-sm font-bold text-slate-700">Perfectly Synchronized</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">No pending stock alerts or payment reminders detected. Your Kirana is running perfectly!</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {notifications.map((n) => (
              <div 
                key={n.id}
                onClick={() => onMarkRead(n.id)}
                className={`p-3.5 rounded-2xl border transition-all relative flex gap-3 ${
                  n.read ? 'bg-white border-slate-100 opacity-75' : 'bg-blue-50/40 border-blue-100 shadow-sm'
                }`}
              >
                {/* Visual Type Indicator Dot badge */}
                {!n.read && (
                  <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-blue-600 rounded-full animate-ping"></span>
                )}

                {/* Left logo depending on type */}
                <div className={`p-2.5 h-10 w-10 rounded-xl shrink-0 flex items-center justify-center ${
                  n.type === 'lowStock' ? 'bg-rose-50 text-rose-600' :
                  n.type === 'milestone' ? 'bg-emerald-50 text-emerald-600' :
                  n.type === 'subscription' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {n.type === 'lowStock' ? <AlertTriangle size={16} /> :
                   n.type === 'milestone' ? <Sparkles size={16} /> :
                   n.type === 'subscription' ? <Calendar size={16} /> : <Bell size={16} />}
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="text-xs font-black text-slate-800 leading-snug">{n.title}</h4>
                    <span className="text-[8px] text-slate-400 font-mono tracking-wider shrink-0 mt-0.5">{n.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">{n.description}</p>
                  
                  {/* Category dependent contextual triggers */}
                  {n.type === 'lowStock' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateToStock();
                        onClose();
                      }}
                      className="mt-2 text-[10px] font-black uppercase text-rose-700 bg-rose-50 border border-rose-100 hover:bg-rose-100 px-2.5 py-1 rounded-lg transition-colors inline-block"
                    >
                      Instant Catalog Restock →
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
