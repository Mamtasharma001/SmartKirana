/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Fingerprint, Lock, Unlock, RefreshCw } from 'lucide-react';
import { Language, t } from '../../lang';

interface SecurityPinScreenProps {
  lang: Language;
  onUnlock: () => void;
  isInitiallyLocked?: boolean;
}

export const SecurityPinScreen: React.FC<SecurityPinScreenProps> = ({
  lang,
  onUnlock,
  isInitiallyLocked = true
}) => {
  const [pin, setPin] = useState<string>('');
  const [errorCount, setErrorCount] = useState<number>(0);
  const [warningMsg, setWarningMsg] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStatus, setScanStatus] = useState<'IDLE' | 'SUCCESS' | 'FAILED'>('IDLE');

  // Preset default PIN for demo is "1234"
  const CORRECT_PIN = "1234";

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
      setWarningMsg('');
    }
  };

  const handleClear = () => {
    setPin('');
    setWarningMsg('');
  };

  useEffect(() => {
    if (pin.length === 4) {
      if (pin === CORRECT_PIN) {
        setScanStatus('SUCCESS');
        setTimeout(() => {
          onUnlock();
        }, 600);
      } else {
        setErrorCount(prev => prev + 1);
        setWarningMsg(lang === 'en' ? '⚠️ Invalid PIN! Standard code is 1234.' : '⚠️ गलत पिन! सामान्य डेमो पिन 1234 है।');
        setPin('');
      }
    }
  }, [pin, lang, onUnlock]);

  // Simulate fingerprint / FaceID sensor
  const triggerBiometricScan = () => {
    setIsScanning(true);
    setScanStatus('IDLE');
    setWarningMsg('');

    setTimeout(() => {
      setIsScanning(false);
      setScanStatus('SUCCESS');
      setTimeout(() => {
        onUnlock();
      }, 600);
    }, 1500); // 1.5s scanning simulation
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-tr from-slate-900 via-slate-950 to-indigo-950 text-white z-99 flex flex-col justify-between p-6 select-none select-none">
      
      {/* Top Banner details */}
      <div className="text-center pt-8 space-y-2">
        <div className="mx-auto w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
          <Lock size={22} className="text-amber-400 animate-pulse" />
        </div>
        <div className="space-y-1">
          <h1 className="text-lg font-black tracking-wider uppercase">SmartKirana SaaS Security</h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Standard demo Security Shield Active</p>
        </div>
      </div>

      {/* Main interactive numeric PIN entry screen */}
      <div className="w-full max-w-xs mx-auto space-y-6">
        
        {/* Passcode circle indicators */}
        <div className="flex justify-center gap-5 my-4">
          {[0, 1, 2, 3].map(idx => (
            <div 
              key={idx} 
              className={`w-4 h-4 rounded-full border-2 transition-all duration-250 ${
                idx < pin.length 
                  ? 'bg-blue-500 border-blue-500 scale-110 shadow-lg shadow-blue-500/50' 
                  : scanStatus === 'SUCCESS' ? 'bg-emerald-500 border-emerald-500 scale-110' : 'border-slate-650 bg-slate-900'
              }`}
            />
          ))}
        </div>

        {/* Status warning displays */}
        <div className="h-4 text-center">
          {warningMsg && <p className="text-[10px] text-rose-400 font-extrabold animate-bounce">{warningMsg}</p>}
          {isScanning && <p className="text-[10px] text-blue-400 font-extrabold animate-pulse">Scanning Biometric Ledger ID...</p>}
          {scanStatus === 'SUCCESS' && <p className="text-[10px] text-emerald-400 font-extrabold flex items-center justify-center gap-1">✓ Access Granted!</p>}
        </div>

        {/* Numpad Layout UI Grid */}
        <div className="grid grid-cols-3 gap-3.5 pt-2">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              className="h-14 w-14 mx-auto rounded-full bg-slate-900 border border-slate-800 hover:border-slate-750 hover:bg-slate-850 active:bg-blue-600 transition-all font-black text-lg flex items-center justify-center cursor-pointer shadow-sm"
            >
              {num}
            </button>
          ))}
          
          <button
            onClick={handleClear}
            className="h-14 w-14 mx-auto rounded-full bg-slate-950 font-bold text-[10px] uppercase text-rose-450 flex items-center justify-center cursor-pointer"
          >
            Clear
          </button>
          
          <button
            onClick={() => handleKeyPress("0")}
            className="h-14 w-14 mx-auto rounded-full bg-slate-900 border border-slate-800 hover:bg-slate-850 transition-all font-black text-lg flex items-center justify-center cursor-pointer"
          >
            0
          </button>

          {/* Biometric trigger thumb icon */}
          <button
            onClick={triggerBiometricScan}
            disabled={isScanning}
            className={`h-14 w-14 mx-auto rounded-full flex items-center justify-center cursor-pointer transition-all ${
              isScanning 
                ? 'bg-blue-600 animate-ping border border-blue-400' 
                : 'bg-indigo-950 hover:bg-indigo-900 border border-indigo-800 text-indigo-400'
            }`}
          >
            <Fingerprint size={24} />
          </button>
        </div>

      </div>

      {/* Footer support details */}
      <div className="text-center pb-6 space-y-1">
        <p className="text-[9px] text-slate-500">
          {lang === 'en' ? 'Tip: Enter preset passcode 1234 or click fingerprint' : 'सुझाव: प्रीसेट कोड 1234 दर्ज करें या फिंगरप्रिंट दबाएं'}
        </p>
        <p className="text-[8px] text-slate-650">SmartKirana Protection Terminal • ISO 27001 Secured</p>
      </div>

    </div>
  );
};
