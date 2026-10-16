import {
  ChatMessage,
  CodeOutput,
  ImageOutput,
  StoryOutput,
  StudyOutput,
  TextToolsOutput,
  VideoPromptOutput,
  YouTubeOutput,
} from '../types';

export const api = {
  async getHealth() {
    try {
      const res = await fetch('/api/health');
      return await res.json();
    } catch {
      return { status: 'offline', hasApiKey: false, engine: 'Offline Mode' };
    }
  },

  async sendChat(
    messages: { role: string; content: string }[],
    language: string,
    onChunk?: (token: string) => void,
    signal?: AbortSignal
  ): Promise<{ content: string; isDemo: boolean; role: string }> {
    if (onChunk) {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, language, stream: true }),
        signal,
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(errorJson.details || errorJson.error || 'Chat request failed');
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunkStr = decoder.decode(value, { stream: true });
          const lines = chunkStr.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataPart = line.slice(6).trim();
              if (dataPart === '[DONE]') break;
              try {
                const parsed = JSON.parse(dataPart);
                if (parsed.text) {
                  fullContent += parsed.text;
                  onChunk(parsed.text);
                }
              } catch {
                // Ignore parse errors on malformed lines
              }
            }
          }
        }
      }

      return {
        role: 'assistant',
        content: fullContent,
        isDemo: false,
      };
    } else {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, language, stream: false }),
        signal,
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(errorJson.details || errorJson.error || 'Chat request failed');
      }

      return await res.json();
    }
  },

  async generateStory(params: {
    genre: string;
    language: string;
    length: string;
    characters: string;
    premise: string;
  }): Promise<StoryOutput> {
    const res = await fetch('/api/story', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to generate story');
    return await res.json();
  },

  async generateImage(params: {
    prompt: string;
    aspectRatio: '1:1' | '16:9' | '9:16';
    style: string;
  }): Promise<ImageOutput> {
    const res = await fetch('/api/image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to generate image');
    return await res.json();
  },

  async generateVideoPrompts(params: {
    concept: string;
    style: string;
    targetTool: string;
  }): Promise<VideoPromptOutput> {
    const res = await fetch('/api/video-prompts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to generate video prompts');
    return await res.json();
  },

  async studyAssist(params: {
    subject: string;
    topic: string;
    mode: string;
    language: string;
  }): Promise<StudyOutput> {
    const res = await fetch('/api/study', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to fetch study assistant notes');
    return await res.json();
  },

  async codeAssist(params: {
    language: string;
    task: string;
    query: string;
    codeSnippet?: string;
  }): Promise<CodeOutput> {
    const res = await fetch('/api/code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to generate code solution');
    return await res.json();
  },

  async youtubeCreator(params: {
    toolType: string;
    topic: string;
    targetLanguage: string;
  }): Promise<YouTubeOutput> {
    const res = await fetch('/api/youtube', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to generate YouTube assets');
    return await res.json();
  },

  async textTools(params: {
    action: string;
    text: string;
    targetLanguage: string;
    tone: string;
  }): Promise<TextToolsOutput> {
    const res = await fetch('/api/text-tools', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to process text tool');
    return await res.json();
  },
};
