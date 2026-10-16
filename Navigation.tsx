import React from 'react';
import { Home, MessageSquare, Sparkles, Clock, Settings, CodeXml } from 'lucide-react';
import { NavigationTab } from '../types';

interface NavigationProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  darkTheme: boolean;
  unreadCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  darkTheme,
  unreadCount = 0,
}) => {
  const tabs: { id: NavigationTab; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'story', label: 'Create', icon: Sparkles },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'android_source', label: 'Code', icon: CodeXml },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav
      className={`shrink-0 border-t z-40 transition-colors select-none ${
        darkTheme
          ? 'bg-[#0B1021]/95 border-slate-800/80 backdrop-blur-md'
          : 'bg-white/95 border-slate-200 backdrop-blur-md'
      }`}
    >
      <div className="flex items-center justify-around px-2 py-1.5 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            currentTab === tab.id ||
            (tab.id === 'story' &&
              ['story', 'image', 'video_prompts', 'study', 'code', 'youtube', 'voice_text'].includes(
                currentTab
              ));

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? darkTheme
                    ? 'text-purple-400 font-bold'
                    : 'text-purple-600 font-bold'
                  : darkTheme
                  ? 'text-slate-400 hover:text-slate-200 font-medium'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              {/* Material 3 active indicator pill */}
              <div
                className={`relative px-3.5 py-1 rounded-full transition-all duration-200 ${
                  isActive
                    ? darkTheme
                      ? 'bg-purple-900/40 text-purple-300 shadow-sm'
                      : 'bg-purple-100 text-purple-700 shadow-sm'
                    : 'bg-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {tab.id === 'chat' && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
