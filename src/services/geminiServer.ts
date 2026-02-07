import 'server-only';

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const getApiKey = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API Key não encontrada. Por favor, configure a variável GEMINI_API_KEY em seu arquivo .env.local");
  }
  return apiKey;
};

const getAiClient = () => {
  return new GoogleGenerativeAI(getApiKey());
};

export const generateArticleContent = async (title: string, excerpt: string): Promise<string> => {
  const ai = getAiClient();
  const model = ai.getGenerativeModel({ model: "gemini-2.5-flash"});
  const prompt = `
    Escreva um artigo técnico completo de blog para programadores sobre o tema: "${title}".
    Contexto: ${excerpt}
    
    Diretrizes:
    - IDIOMA: PORTUGUÊS (BRASIL).
    - Use formato Markdown válido e bem estruturado.
    - Tom: Educativo, profissional mas levemente informal ("de dev para dev").
    - Use subtítulos (H2, H3) frequentes para quebrar o texto.
    - Evite parágrafos muito longos ou blocos densos de texto. O texto deve ser arejado e coeso.
    - Inclua exemplos de código (snippets) onde apropriado (use blocos de código com linguagem especificada).
    - Termine com uma conclusão inspiradora.
  `;

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
};

export const generateSearchInsights = async (query: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash"});
    const result = await model.generateContent(`User search query on a dev blog: "${query}". Provide a 1-sentence technical insight or "did you know" related to this query. Keep it geeky. Language: Portuguese (Brazil).`);
    const response = result.response;
    return response.text();
  } catch (e) {
    return "";
  }
};

export const generateFullPost = async (topic: string): Promise<any> => {
  const prompt = `
    You are a Senior Staff Engineer writing for a technical blog.
    Generate a complete blog post metadata and content about: "${topic}".
    
    Content Guidelines:
    - LANGUAGE: PORTUGUESE (BRAZIL).
    - The content MUST be deep, technical, and include code snippets.
    - Format in VALID Markdown.
    - Structure the content cohesively: Use clear Headings, short paragraphs, and bullet points to avoid large walls of text.
    - Ensure code blocks are properly fenced.
  `;

  const ai = getAiClient();
  const model = ai.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              title: { type: "STRING" },
              slug: { type: "STRING" },
              excerpt: { type: "STRING" },
              content: { type: "STRING" },
              category: { type: "STRING" },
              tags: { 
                type: "ARRAY", 
                items: { type: "STRING" } 
              },
              read_time: { type: "STRING" }
            },
            required: ["title", "slug", "excerpt", "content", "category", "tags", "read_time"]
          }
      },
      safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
      ]
  });
  
  const result = await model.generateContent(prompt);
  const response = result.response;
  let text = response.text() || "{}";
  
  // Sanitize: remove any potential markdown code blocks wrapping the JSON if they exist
  text = text.trim();
  if (text.startsWith('```json')) {
    text = text.replace(/^```json/, '').replace(/```$/, '');
  } else if (text.startsWith('```')) {
     text = text.replace(/^```/, '').replace(/```$/, '');
  }
  
  return JSON.parse(text);
};

export const generateVideoPrompt = async (scene: string, basePrompt: string): Promise<string> => {
  const ai = getAiClient();
  const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
  const prompt = `
    Você é um especialista em prompts para roteiro de vídeo com foco em consistência visual de personagens.
    Melhore o prompt abaixo para ficar mais claro, direto e útil para gerar um roteiro de vídeo.

    Regras:
    - IDIOMA: PORTUGUÊS (BRASIL).
    - Preserve integralmente o DNA visual do personagem e os detalhes de roupa.
    - Não invente novos elementos visuais fora do DNA informado.
    - Mantenha a saída em formato de prompt único (sem listas e sem explicações).
    - Inclua a cena informada e garanta que esteja explícita.

    Cena informada: "${scene}"

    Prompt base:
    ${basePrompt}
  `;

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
};
