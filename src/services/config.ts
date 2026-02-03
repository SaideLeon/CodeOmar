export const config = {
  API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
};

export const hasApiKey = (): boolean => {
  return !!config.API_KEY && config.API_KEY.length > 0;
};
