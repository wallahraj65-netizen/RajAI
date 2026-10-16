import React from 'react';
import { ArrowLeft, Sparkles, Globe, ShieldCheck } from 'lucide-react';
import { NavigationTab } from '../types';

interface HeaderProps {
  currentTab: NavigationTab;
  onNavigateBack?: () => void;
  darkTheme: boolean;
  selectedLanguage: 'English' | 'Hindi' | 'Hinglish';
  onChangeLanguage: (lang: 'English' | 'Hindi' | 'Hinglish') => void;
  isOnline: boolean;
  hasApiKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigateBack,
  darkTheme,
  selectedLanguage,
  onChangeLanguage,
  isOnline,
  hasApiKey,
}) => {
  const getTabTitle = () => {
    switch (currentTab) {
      case 'home':
        return 'Raj AI';
      case 'chat':
        return 'AI Assistant';
      case 'story':
        return 'AI Story Studio';
      case 'image':
        return 'AI Image Generator';
      case 'video_prompts':
        return 'Video Prompt Studio';
      case 'study':
        return 'AI Study Mentor';
      case 'code':
        return 'AI Code Guru';
      case 'youtube':
        return 'YouTube Creator Hub';
      case 'voice_text':
        return 'Voice & Text Tools';
      case 'history':
        return 'Activity History';
      case 'settings':
        return 'Settings';
      case 'android_source':
        return 'Android Studio Project';
      default:
        return 'Raj AI';
    }
  };

  const showBackButton = ![
    'home',
    'chat',
    'history',
    'settings',
    'android_source',
  ].includes(currentTab);

  return (
    <header
      className={`shrink-0 px-4 py-2.5 flex items-center justify-between border-b z-30 transition-colors select-none ${
        darkTheme
          ? 'bg-[#0B1021]/95 border-slate-800/80 text-white'
          : 'bg-white/95 border-slate-200 text-slate-900'
      }`}
    >
      <div className="flex items-center gap-2.5">
        {showBackButton && onNavigateBack ? (
          <button
            onClick={onNavigateBack}
            className={`p-1.5 rounded-full cursor-pointer transition-colors ${
              darkTheme ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-100 text-slate-700'
            }`}
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-md shadow-purple-500/20">
            <div
              className={`w-full h-full rounded-[10px] flex items-center justify-center ${
                darkTheme ? 'bg-[#0A0F1D]' : 'bg-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
          </div>
        )}

        <div>
          <h1 className="text-base font-bold tracking-tight leading-tight flex items-center gap-1.5">
            {getTabTitle()}
            {currentTab === 'home' && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-purple-400">
                PRO
              </span>
            )}
          </h1>
          <p className="text-[10px] text-slate-400 font-medium">
            {currentTab === 'home'
              ? 'All-in-One AI Assistant'
              : 'Powered by Raj AI Engine'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Language selector toggle button */}
        <div className="relative">
          <select
            value={selectedLanguage}
            onChange={(e) =>
              onChangeLanguage(e.target.value as 'English' | 'Hindi' | 'Hinglish')
            }
            className={`text-[11px] font-semibold py-1 px-2 pr-6 rounded-lg border appearance-none cursor-pointer focus:outline-none transition-colors ${
              darkTheme
                ? 'bg-slate-900 border-slate-700 text-slate-200 hover:border-purple-500'
                : 'bg-slate-100 border-slate-300 text-slate-800 hover:border-purple-500'
            }`}
          >
            <option value="English">EN</option>
            <option value="Hindi">HI (हिंदी)</option>
            <option value="Hinglish">Hinglish</option>
          </select>
          <Globe className="w-3 h-3 text-slate-400 absolute right-1.5 top-2 pointer-events-none" />
        </div>

        {/* Live Engine Indicator */}
        <div
          title={hasApiKey ? 'Gemini 3.8 Flash Online' : 'Offline Demo Engine Active'}
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold border ${
            hasApiKey
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              hasApiKey ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
            }`}
          />
          <span className="hidden sm:inline">
            {hasApiKey ? 'Live AI' : 'Demo'}
          </span>
        </div>
      </div>
    </header>
  );
};
