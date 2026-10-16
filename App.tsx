import React, { useState, useEffect } from 'react';
import { AndroidFrame } from './components/AndroidFrame';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { SplashScreen } from './components/screens/SplashScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { ChatScreen } from './components/screens/ChatScreen';
import { StoryScreen } from './components/screens/StoryScreen';
import { ImageScreen } from './components/screens/ImageScreen';
import { VideoPromptScreen } from './components/screens/VideoPromptScreen';
import { StudyScreen } from './components/screens/StudyScreen';
import { CodeScreen } from './components/screens/CodeScreen';
import { YouTubeScreen } from './components/screens/YouTubeScreen';
import { VoiceTextScreen } from './components/screens/VoiceTextScreen';
import { HistoryScreen } from './components/screens/HistoryScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { AndroidSourceScreen } from './components/screens/AndroidSourceScreen';
import { Conversation, NavigationTab, UserPreferences } from './types';
import { api } from './services/api';

const DEFAULT_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_default',
    title: 'Welcome to Raj AI',
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now() - 1800000,
    messages: [
      {
        id: 'msg_welcome_1',
        role: 'assistant',
        content: `Namaste! 🙏 I am **Raj AI**, your high-performance personal AI companion.

I can help you with:
• **Chatting & Answering** in Hindi, English, and Hinglish with Voice Input & Output
• **Generating Screenplays & Stories** with scene dialogues and AI video prompts
• **Creating Art & Thumbnails** across 1:1, 16:9, and 9:16 aspect ratios
• **Directing Cinematic Video Prompts** for Veo, Sora, and Runway
• **Academic Mentoring & Math/Science Solutions** with interactive MCQs
• **Writing & Debugging Code** in Kotlin, Python, Java, JS, HTML/CSS, and SQL
• **YouTube & BGMI Gaming Growth Tools** with viral hooks and SEO descriptions
• **Speech-to-Text & Text-to-Speech** translation and grammar enhancement

Feel free to ask me anything or explore any tool from the bottom bar!`,
        timestamp: Date.now() - 1800000,
        language: 'English',
        isDemo: false,
      },
    ],
  },
];

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  language: 'English',
  deviceFrame: true,
  voiceSpeed: 1.0,
  voicePitch: 1.0,
  autoSpeakResponse: false,
  hapticFeedback: true,
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [navHistory, setNavHistory] = useState<NavigationTab[]>(['home']);

  // Load preferences from localStorage
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem('raj_ai_preferences');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return DEFAULT_PREFERENCES;
  });

  // Load conversations (simulating Room Database persistence)
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem('raj_ai_conversations');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return DEFAULT_CONVERSATIONS;
  });

  const [activeConversationId, setActiveConversationId] = useState<string>(
    conversations[0]?.id || 'conv_default'
  );

  const [hasApiKey, setHasApiKey] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Sync preferences to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('raj_ai_preferences', JSON.stringify(preferences));
    } catch {
      // Ignore
    }
  }, [preferences]);

  // Sync conversations to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('raj_ai_conversations', JSON.stringify(conversations));
    } catch {
      // Ignore
    }
  }, [conversations]);

  // Check health and online state
  useEffect(() => {
    api.getHealth().then((res) => {
      setHasApiKey(Boolean(res?.hasApiKey));
    });

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const navigateTo = (tab: NavigationTab) => {
    if (tab === currentTab) return;
    setNavHistory((prev) => [...prev, tab]);
    setCurrentTab(tab);
  };

  const navigateBack = () => {
    if (navHistory.length > 1) {
      const nextHistory = [...navHistory];
      nextHistory.pop(); // Remove current
      const prevTab = nextHistory[nextHistory.length - 1] || 'home';
      setNavHistory(nextHistory);
      setCurrentTab(prevTab);
    } else {
      setCurrentTab('home');
    }
  };

  const handleUpdatePreferences = (updated: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updated }));
  };

  const handleNewConversation = () => {
    const newId = `conv_${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      title: `New Chat ${conversations.length + 1}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newId);
    setCurrentTab('chat');
  };

  const handleDeleteConversation = (id: string) => {
    const updated = conversations.filter((c) => c.id !== id);
    setConversations(updated);
    if (activeConversationId === id) {
      if (updated.length > 0) {
        setActiveConversationId(updated[0].id);
      } else {
        handleNewConversation();
      }
    }
  };

  const handleClearAllHistory = () => {
    setConversations([]);
    handleNewConversation();
  };

  const handleUpdateConversationMessages = (
    convId: string,
    messages: Conversation['messages']
  ) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === convId) {
          // Auto-generate title from first user message if title is default
          let title = c.title;
          if (
            (title.startsWith('New Chat') || title === 'Welcome to Raj AI') &&
            messages.length > 0
          ) {
            const firstUser = messages.find((m) => m.role === 'user');
            if (firstUser) {
              title = firstUser.content.slice(0, 32) + (firstUser.content.length > 32 ? '...' : '');
            }
          }
          return {
            ...c,
            title,
            updatedAt: Date.now(),
            messages,
          };
        }
        return c;
      })
    );
  };

  const darkTheme = preferences.theme === 'dark';

  return (
    <div
      className={`min-h-screen w-full transition-colors ${
        darkTheme ? 'bg-[#080C18] text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      {showSplash && (
        <SplashScreen
          onDismiss={() => setShowSplash(false)}
          darkTheme={darkTheme}
        />
      )}

      <AndroidFrame
        enabled={preferences.deviceFrame}
        onToggleFrame={() =>
          handleUpdatePreferences({ deviceFrame: !preferences.deviceFrame })
        }
        darkTheme={darkTheme}
      >
        {/* Top App Bar */}
        <Header
          currentTab={currentTab}
          onNavigateBack={navHistory.length > 1 ? navigateBack : undefined}
          darkTheme={darkTheme}
          selectedLanguage={preferences.language}
          onChangeLanguage={(lang) => handleUpdatePreferences({ language: lang })}
          isOnline={isOnline}
          hasApiKey={hasApiKey}
        />

        {/* Viewport Content Area */}
        <main className="flex-1 overflow-hidden flex flex-col relative">
          {currentTab === 'home' && (
            <HomeScreen
              onNavigate={navigateTo}
              darkTheme={darkTheme}
              userName="Raj"
            />
          )}

          {currentTab === 'chat' && (
            <ChatScreen
              darkTheme={darkTheme}
              selectedLanguage={preferences.language}
              onChangeLanguage={(lang) => handleUpdatePreferences({ language: lang })}
              conversations={conversations}
              activeConversationId={activeConversationId}
              onSelectConversation={setActiveConversationId}
              onNewConversation={handleNewConversation}
              onDeleteConversation={handleDeleteConversation}
              onUpdateConversationMessages={handleUpdateConversationMessages}
            />
          )}

          {currentTab === 'story' && (
            <StoryScreen
              darkTheme={darkTheme}
              selectedLanguage={preferences.language}
            />
          )}

          {currentTab === 'image' && <ImageScreen darkTheme={darkTheme} />}

          {currentTab === 'video_prompts' && (
            <VideoPromptScreen darkTheme={darkTheme} />
          )}

          {currentTab === 'study' && (
            <StudyScreen
              darkTheme={darkTheme}
              selectedLanguage={preferences.language}
            />
          )}

          {currentTab === 'code' && <CodeScreen darkTheme={darkTheme} />}

          {currentTab === 'youtube' && (
            <YouTubeScreen
              darkTheme={darkTheme}
              selectedLanguage={preferences.language}
            />
          )}

          {currentTab === 'voice_text' && (
            <VoiceTextScreen
              darkTheme={darkTheme}
              selectedLanguage={preferences.language}
            />
          )}

          {currentTab === 'history' && (
            <HistoryScreen
              darkTheme={darkTheme}
              conversations={conversations}
              onSelectConversation={setActiveConversationId}
              onDeleteConversation={handleDeleteConversation}
              onClearAllHistory={handleClearAllHistory}
              onNavigate={navigateTo}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsScreen
              preferences={preferences}
              onUpdatePreferences={handleUpdatePreferences}
              onClearHistory={handleClearAllHistory}
              darkTheme={darkTheme}
              hasApiKey={hasApiKey}
            />
          )}

          {currentTab === 'android_source' && (
            <AndroidSourceScreen darkTheme={darkTheme} />
          )}
        </main>

        {/* Bottom Material 3 Navigation Bar */}
        <Navigation
          currentTab={currentTab}
          onSelectTab={navigateTo}
          darkTheme={darkTheme}
          unreadCount={0}
        />
      </AndroidFrame>
    </div>
  );
}
