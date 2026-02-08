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

export const generateVeo3Prompt = async (itemName: string): Promise<string> => {
  const ai = getAiClient();
  const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
  const prompt = `
Você é um especialista em criar prompts detalhados para geração de vídeos educativos no estilo VEO 3. Quando eu fornecer apenas o NOME de uma fruta, órgão, objeto, animal ou conceito, você deve criar automaticamente um prompt completo seguindo esta estrutura:

ESTRUTURA OBRIGATÓRIA:

[EMOJI] [NOME EM MAIÚSCULAS] - [FUNÇÃO PRINCIPAL EM INGLÊS]

A cute anthropomorphic [nome em inglês] character with big expressive eyes and a [emoção] smile, [ação principal específica do objeto] inside [ambiente contextual ideal]. [Detalhes visuais específicos relacionados à função]. [Efeitos de partículas/luz temáticos]. [Movimento e emoção apropriados].

Voice-over (Portuguese audio):
"Olá, eu sou [Nome em Português]. [Benefício/função em 1 frase simples em português]."

ultra-cute 3D cartoon style, Pixar-style proportions, big expressive eyes, rounded shapes, vibrant colors, smooth animation, cinematic lighting, shallow depth of field, kid-friendly, satisfying motion, vertical 9:16, high detail, soft shadows

REGRAS DE CRIAÇÃO:
1. Pesquise o contexto: Identifique a função principal, benefícios e características do objeto
2. Ambiente ideal: Escolha um cenário que faça sentido contextual (ex: frutas em jardim, órgãos dentro do corpo humano)
3. Ação específica: A ação deve demonstrar visualmente a função (ex: coração bombeando, laranja espremendo suco)
4. Cores temáticas: Use cores naturais do objeto para partículas e efeitos de luz
5. Voice-over educativo: Máximo 10 palavras EM PORTUGUÊS, linguagem simples e infantil
6. Áudio em português: SEMPRE especificar "(Portuguese audio)" antes do voice-over
7. Prompt em inglês: Toda descrição visual em inglês, apenas voice-over em português
8. Sempre mantenha: tom alegre, educativo, seguro para crianças

EXEMPLOS:
INPUT: Coração
OUTPUT:
❤️ HEART - BLOOD CIRCULATION

A cute anthropomorphic heart character wearing a tiny doctor coat, standing inside a large glowing human heart. The heart gently beats with soft red light as warm energy flows through it. Dark particles fade away and the heart looks happy and clean. Soft medical background, playful and educational.

Voice-over (Portuguese audio):
"Olá, eu sou Coração. Eu faço bum-bum. Eu ajudo seu corpo a se mover."

ultra-cute 3D cartoon style, Pixar-style proportions, big expressive eyes, rounded shapes, vibrant colors, smooth animation, cinematic lighting, shallow depth of field, kid-friendly, satisfying motion, vertical 9:16, high detail, soft shadows

INPUT: Banana
OUTPUT:
🍌 BANANA - ENERGY BOOST

A cute anthropomorphic banana character with big sparkling eyes and an energetic smile, running on a tiny treadmill inside a bright tropical jungle with palm trees. Yellow lightning bolts and energy sparkles radiate from the banana. The character flexes small arms showing strength. Dynamic motion, fun and vibrant atmosphere.

Voice-over (Portuguese audio):
"Olá, eu sou Banana. Eu te dou energia e força!"

ultra-cute 3D cartoon style, Pixar-style proportions, big expressive eyes, rounded shapes, vibrant colors, smooth animation, cinematic lighting, shallow depth of field, kid-friendly, satisfying motion, vertical 9:16, high detail, soft shadows

INPUT: Pulmões
OUTPUT:
🫁 LUNGS - OXYGEN BREATHING

A cute anthropomorphic pair of lungs characters holding hands, standing inside a peaceful breathing chamber with floating air bubbles. Fresh blue and white oxygen particles flow in as dark smoke particles flow out. The lungs expand and contract gently with a satisfied expression. Clean clouds and fresh air background, calming and educational.

Voice-over (Portuguese audio):
"Olá, nós somos os Pulmões. Trazemos ar fresquinho para seu corpo."

ultra-cute 3D cartoon style, Pixar-style proportions, big expressive eyes, rounded shapes, vibrant colors, smooth animation, cinematic lighting, shallow depth of field, kid-friendly, satisfying motion, vertical 9:16, high detail, soft shadows

INPUT: Morango
OUTPUT:
🍓 STRAWBERRY - VITAMIN C

A cute anthropomorphic strawberry character with big happy eyes and rosy cheeks, holding a glowing vitamin C shield inside a sunny berry garden. Sparkling golden particles and tiny white flowers float around. The strawberry bounces joyfully showing off its seeds. Bright red glow, protective energy, cheerful and healthy mood.

Voice-over (Portuguese audio):
"Olá, eu sou Morango. Eu protejo você de ficar doente!"

ultra-cute 3D cartoon style, Pixar-style proportions, big expressive eyes, rounded shapes, vibrant colors, smooth animation, cinematic lighting, shallow depth of field, kid-friendly, satisfying motion, vertical 9:16, high detail, soft shadows

INPUT: Água
OUTPUT:
💧 WATER - HYDRATION

A cute anthropomorphic water droplet character with big crystal-clear eyes and a refreshing smile, sliding down a colorful water slide inside a sparkling blue ocean wave tunnel. Fresh bubbles and light reflections dance around. The droplet splashes playfully creating ripples of energy. Cool blue glow, refreshing and pure atmosphere.

Voice-over (Portuguese audio):
"Olá, eu sou Água. Eu deixo seu corpo fresquinho e feliz!"

ultra-cute 3D cartoon style, Pixar-style proportions, big expressive eyes, rounded shapes, vibrant colors, smooth animation, cinematic lighting, shallow depth of field, kid-friendly, satisfying motion, vertical 9:16, high detail, soft shadows

INPUT: Fígado
OUTPUT:
🫀 LIVER - DETOXIFICATION

A cute anthropomorphic liver character wearing a tiny superhero cape, standing inside a clean filtration factory with glowing pipes. The liver uses a magical filter wand to transform dark toxic particles into sparkling clean golden drops. Everything becomes bright and healthy. Purple-brown glow, hardworking hero vibe, protective and educational.

Voice-over (Portuguese audio):
"Olá, eu sou Fígado. Eu limpo as coisas ruins do seu corpo!"

ultra-cute 3D cartoon style, Pixar-style proportions, big expressive eyes, rounded shapes, vibrant colors, smooth animation, cinematic lighting, shallow depth of field, kid-friendly, satisfying motion, vertical 9:16, high detail, soft shadows

Agora gere o prompt completo para o item: "${itemName}".
Retorne apenas o prompt final, sem explicações ou texto extra.
  `;

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
};
