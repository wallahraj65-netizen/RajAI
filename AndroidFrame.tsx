import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal, Smartphone, Monitor } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  enabled: boolean;
  onToggleFrame: () => void;
  darkTheme: boolean;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  enabled,
  onToggleFrame,
  darkTheme,
}) => {
  const [time, setTime] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!enabled) {
    return <div className="w-full min-h-screen flex flex-col">{children}</div>;
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/90 backdrop-blur-md">
      {/* Top Floating Control Bar */}
      <div className="mb-3 flex items-center justify-between gap-4 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-300 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-200">Raj AI Android Simulator</span>
          <span className="text-slate-500 hidden sm:inline">• Material 3 (API 35)</span>
        </div>
        <button
          onClick={onToggleFrame}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border border-purple-500/30 transition-all font-medium cursor-pointer"
          title="Switch to Fullscreen / Phone Frame"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Toggle Fullscreen</span>
        </button>
      </div>

      {/* Android Device Body */}
      <div
        className={`relative w-full max-w-[440px] h-[880px] max-h-[92vh] flex flex-col rounded-[48px] border-[10px] border-slate-800/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(139,92,246,0.15)] overflow-hidden transition-all duration-300 ${
          darkTheme ? 'bg-[#0A0F1D] text-slate-100' : 'bg-slate-50 text-slate-900'
        }`}
      >
        {/* Dynamic Android Status Bar */}
        <div
          className={`h-9 px-6 flex items-center justify-between text-xs font-semibold z-50 select-none ${
            darkTheme ? 'bg-[#0A0F1D] text-slate-300' : 'bg-slate-50 text-slate-700'
          }`}
        >
          {/* Time & Camera Hole */}
          <span className="tracking-tight text-[11px] font-bold">{time}</span>

          {/* Camera Punch Hole */}
          <div className="absolute left-1/2 -translate-x-1/2 top-2 w-4 h-4 rounded-full bg-black border-2 border-slate-900 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
          </div>

          {/* System Icons */}
          <div className="flex items-center gap-1.5 text-[11px]">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center gap-1">
              <span className="text-[10px] opacity-80">98%</span>
              <BatteryMedium className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Device Screen Viewport */}
        <div className="relative flex-1 overflow-hidden flex flex-col">
          {children}
        </div>

        {/* Android Gesture Navigation Pill */}
        <div
          className={`h-4 w-full flex items-center justify-center shrink-0 ${
            darkTheme ? 'bg-[#0A0F1D]' : 'bg-slate-50'
          }`}
        >
          <div className="w-32 h-1 rounded-full bg-slate-500/40 hover:bg-slate-400/60 transition-all cursor-pointer" />
        </div>
      </div>
    </div>
  );
};
