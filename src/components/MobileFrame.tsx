/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal, Maximize2, Minimize2, Smartphone } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [time, setTime] = useState('12:45');

  useEffect(() => {
    // Current time formatting
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12; // 12-hour format
      setTime(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (isFullscreen) {
    return (
      <div id="smartkirana-fullscreen-wrap" className="w-full h-screen bg-[#F0F4F8] text-[#1E293B] relative flex flex-col overflow-hidden font-sans">
        {/* Compact Fullscreen Action Ribbons */}
        <div className="absolute top-3 right-3 z-50">
          <button
            onClick={toggleFullscreen}
            title="Switch to Mobile Frame Preview"
            className="flex items-center gap-2 bg-slate-900/80 hover:bg-slate-900 text-white text-xs px-3 py-2 rounded-full cursor-pointer shadow-lg transition-all border border-slate-700 font-medium"
          >
            <Minimize2 size={14} />
            <span>Show Phone Frame</span>
          </button>
        </div>
        {children}
      </div>
    );
  }

  // Framed Smartphone Container Layout
  return (
    <div id="smartkirana-frame-outer" className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#334155] p-3 md:p-8 flex flex-col items-center justify-center font-sans">
      {/* Visual Header Controls */}
      <div className="w-full max-w-[420px] mb-3 flex justify-between items-center px-2 text-slate-400">
        <div className="flex items-center gap-1.5">
          <Smartphone size={16} className="text-blue-400" />
          <span className="text-xs font-semibold tracking-wider text-slate-300">SMARTKIRANA PROTOTYPE</span>
        </div>
        <button
          onClick={toggleFullscreen}
          className="flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-md transition-colors cursor-pointer border border-slate-700/50"
        >
          <Maximize2 size={11} />
          <span>Full Browser View</span>
        </button>
      </div>

      {/* Smartphone Device Frame */}
      <div className="w-full max-w-[412px] h-[840px] bg-[#090D16] rounded-[48px] p-3 shadow-[0_0_80px_rgba(0,0,0,0.85)] border-[4.5px] border-[#334155] relative flex flex-col overflow-hidden select-none">
        
        {/* Sensor Punch-Hole Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full z-50 flex items-center justify-center">
          <div className="w-3 h-3 bg-slate-900 rounded-full border border-slate-800 ml-auto mr-4 flex items-center justify-center">
            <div className="w-1 h-1 bg-blue-900 rounded-full"></div>
          </div>
        </div>

        {/* Dynamic Status Bar */}
        <div className="w-full h-8 bg-white text-slate-700 px-7 flex justify-between items-center text-[11px] font-bold z-40 rounded-t-[36px] border-b border-slate-100 select-none">
          <div>{time}</div>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-semibold text-slate-400 tracking-wider">KiranaNet LTE</span>
            <Signal size={12} className="text-slate-600" />
            <Wifi size={12} className="text-slate-600" />
            <Battery size={14} className="text-emerald-600 fill-emerald-600 rotate-90 scale-90" />
          </div>
        </div>

        {/* Active SmartKirana Application Screen Viewport */}
        <div className="w-full flex-1 bg-white relative flex flex-col overflow-hidden rounded-b-[36px]">
          {children}
        </div>

        {/* Gesture Bar Anchor */}
        <div className="w-full h-4 bg-black flex items-center justify-center rounded-b-[40px] z-50">
          <div className="w-28 h-1 bg-slate-700 rounded-full opacity-60"></div>
        </div>
      </div>

      {/* External Helper Prompt */}
      <div className="mt-4 text-center">
        <p className="text-xs text-slate-400 font-medium max-w-sm">
          Simulating a modern Flutter layout running on Android. Rotate, navigate, or create a mock invoice!
        </p>
      </div>
    </div>
  );
};
