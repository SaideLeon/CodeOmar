'use client';

const requestGemini = async <T>(action: string, payload: Record<string, unknown>): Promise<T> => {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action, payload }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || 'Falha ao comunicar com o serviço de IA.');
  }

  return data as T;
};

export const generateArticleContent = async (title: string, excerpt: string): Promise<string> => {
  try {
    const data = await requestGemini<{ content: string }>('generateArticleContent', { title, excerpt });
    return data.content;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `Error generating content: ${(error as Error).message}. \n\n Please try again later.`;
  }
};

export const generateSearchInsights = async (query: string): Promise<string> => {
  try {
    const data = await requestGemini<{ insight: string }>('generateSearchInsights', { query });
    return data.insight;
  } catch (error) {
    console.error('Gemini Search Insight Error:', error);
    return '';
  }
};

export const generateFullPost = async (topic: string): Promise<any> => {
  const data = await requestGemini<{ post: any }>('generateFullPost', { topic });
  return data.post;
};

export const generateVideoPrompt = async (scene: string, basePrompt: string): Promise<string> => {
  try {
    const data = await requestGemini<{ prompt: string }>('generateVideoPrompt', { scene, basePrompt });
    return data.prompt;
  } catch (error) {
    console.error('Gemini Video Prompt Error:', error);
    return basePrompt;
  }
};

export const generateVeo3Prompt = async (itemName: string): Promise<string> => {
  try {
    const data = await requestGemini<{ prompt: string }>('generateVeo3Prompt', { itemName });
    return data.prompt;
  } catch (error) {
    console.error('Gemini VEO3 Prompt Error:', error);
    return '';
  }
};
