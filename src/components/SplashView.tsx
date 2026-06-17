/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Store, Loader2 } from 'lucide-react';

interface SplashViewProps {
  onComplete: () => void;
}

export const SplashView: React.FC<SplashViewProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          // Wait 300ms before triggering page view
          setTimeout(onComplete, 300);
          return 100;
        }
        // Random incremental jump
        return prev + Math.floor(Math.random() * 15) + 8;
      });
    }, 150);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div 
      id="smartkirana-splash" 
      className="w-full h-full bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#1D4ED8] flex flex-col justify-between items-center p-8 text-white relative select-none"
    >
      {/* Visual Accent Blurs */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-sky-400 rounded-full blur-3xl opacity-25"></div>
      <div className="absolute bottom-16 right-10 w-36 h-36 bg-emerald-400 rounded-full blur-3xl opacity-20"></div>

      {/* Decorative Spacer */}
      <div></div>

      {/* Logo & Identity App Brand */}
      <div className="flex flex-col items-center text-center animate-fade-in-up">
        {/* Animated Icon Ring */}
        <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center mb-5 shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-white/20 relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <Store className="w-12 h-12 text-white animate-pulse" />
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight mb-2 drop-shadow-sm select-none">
          Smart<span className="text-emerald-400">Kirana</span>
        </h1>
        <p className="text-blue-100 text-sm font-medium tracking-wide max-w-xs">
          Smart Inventory & Billing for Shop Owners
        </p>
      </div>

      {/* Footer Progress & Status */}
      <div className="w-full max-w-xs flex flex-col items-center gap-4">
        {/* Progress Bar Container */}
        <div className="w-full h-1.5 bg-blue-900/40 rounded-full overflow-hidden border border-blue-800/30">
          <div 
            className="h-full bg-gradient-to-r from-emerald-400 to-sky-400 rounded-full transition-all duration-150 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>

        {/* Loading Spinner & Status Text */}
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-200">
          <Loader2 size={13} className="animate-spin text-emerald-400" />
          <span>Starting local engine... {Math.min(progress, 100)}%</span>
        </div>

        {/* Localized Footnote */}
        <div className="mt-6 text-[10px] text-blue-200/60 font-medium">
          Powered by Flutter Android Mock Web-UI
        </div>
      </div>
    </div>
  );
};
