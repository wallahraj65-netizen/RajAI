export type NavigationTab = 
  | 'home' 
  | 'chat' 
  | 'story' 
  | 'image' 
  | 'video_prompts' 
  | 'study' 
  | 'code' 
  | 'youtube' 
  | 'voice_text' 
  | 'history' 
  | 'settings'
  | 'android_source';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  language?: string;
  isStreaming?: boolean;
  isDemo?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
  category?: string;
}

export interface StoryOutput {
  title: string;
  logline: string;
  synopsis: string;
  fullStory: string;
  scenes: {
    sceneNumber: number;
    title: string;
    setting: string;
    visualPrompt: string;
    dialogues: { character: string; line: string }[];
  }[];
  moral: string;
  isDemo?: boolean;
}

export interface ImageOutput {
  imageUrl: string;
  prompt: string;
  aspectRatio: '1:1' | '16:9' | '9:16';
  style: string;
  isDemo?: boolean;
}

export interface VideoPromptOutput {
  projectTitle: string;
  masterPrompt: string;
  scenes: {
    scene: number;
    timecode: string;
    shotType: string;
    cameraMotion: string;
    lighting: string;
    action: string;
    audioAmbience: string;
    promptText: string;
  }[];
  negativePrompt: string;
  recommendedSettings: {
    fps: number;
    motionStrength: number;
    seed: number;
  };
  isDemo?: boolean;
}

export interface StudyOutput {
  title: string;
  summary: string;
  keyFormulasOrPoints: string[];
  stepByStep: {
    stepNumber: number;
    heading: string;
    explanation: string;
  }[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  commonMistakes: string[];
  memoryTrick: string;
  isDemo?: boolean;
}

export interface CodeOutput {
  title: string;
  code: string;
  explanation: string;
  timeComplexity: string;
  spaceComplexity: string;
  bestPractices: string[];
  testCases: { input: string; expectedOutput: string }[];
  commonPitfalls: string[];
  isDemo?: boolean;
}

export interface YouTubeOutput {
  titles: { title: string; hookScore: string; reason: string }[];
  description: string;
  hashtags: string[];
  tags: string[];
  thumbnailConcepts: {
    visualDescription: string;
    boldTextOverlay: string;
    aiImagePrompt: string;
  }[];
  shortsScript: {
    hook: string;
    retentionBody: string;
    callToAction: string;
  };
  isDemo?: boolean;
}

export interface TextToolsOutput {
  action: string;
  result: string;
  keyHighlights: string[];
  stats: {
    originalWordCount: number;
    processedWordCount: number;
    readingTimeSeconds: number;
  };
  speechSynthesisRecommendation: {
    suggestedVoice: string;
    suggestedSpeed: number;
    suggestedPitch: number;
  };
  isDemo?: boolean;
}

export interface UserPreferences {
  theme: 'dark' | 'light';
  language: 'English' | 'Hindi' | 'Hinglish';
  deviceFrame: boolean;
  voiceSpeed: number;
  voicePitch: number;
  autoSpeakResponse: boolean;
  hapticFeedback: boolean;
}
